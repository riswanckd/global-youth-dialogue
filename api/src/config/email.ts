import nodemailer from 'nodemailer';
import tls from 'tls';
import { env } from './env';
import { logger } from './logger';
import { InternalServerError } from '../utils/errors';

let smtpTransporter: nodemailer.Transporter | null = null;
let cloudflareTransporter: nodemailer.Transporter | null = null;

export function getSmtpTransporter(): nodemailer.Transporter | null {
  const user = env.SMTP_USER || 'thegyde.verify@gmail.com';
  const pass = env.SMTP_PASS || 'nwhnmkersbiwwrry';

  if (!user || !pass) {
    return null;
  }

  if (!smtpTransporter) {
    smtpTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass,
      },
      connectionTimeout: 10000,
      greetingTimeout: 8000,
      socketTimeout: 10000,
    });
  }

  return smtpTransporter;
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

async function sendViaCloudflare(options: SendEmailOptions): Promise<boolean> {
  const fromAddress = env.CLOUDFLARE_FROM_EMAIL || env.FROM_EMAIL || 'thegyde.verify@gmail.com';

  if (env.CLOUDFLARE_ACCOUNT_ID) {
    const url = `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/email/sending/send`;
    const payload = {
      to: options.to,
      from: fromAddress,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data: any = await res.json().catch(() => null);

    if (!res.ok || (data && data.success === false)) {
      const errMsg = data?.errors?.[0]?.message || data?.messages?.[0] || `HTTP ${res.status}`;
      logger.error(`❌ Cloudflare Email API error to ${options.to}: ${errMsg}`);
      throw new InternalServerError(`Cloudflare email delivery failed: ${errMsg}`);
    }

    logger.info(`📧 Email successfully dispatched via Cloudflare REST API to: ${options.to}`);
    return true;
  }

  if (!cloudflareTransporter) {
    cloudflareTransporter = nodemailer.createTransport({
      host: 'smtp.mx.cloudflare.net',
      port: 465,
      secure: true,
      auth: {
        user: 'api_token',
        pass: env.CLOUDFLARE_API_TOKEN,
      },
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 10000,
    });
  }

  await cloudflareTransporter.sendMail({
    from: `"${env.FROM_NAME}" <${fromAddress}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });

  logger.info(`📧 Email successfully delivered via Cloudflare SMTP to: ${options.to}`);
  return true;
}

function sendViaPureTLS(options: SendEmailOptions): Promise<boolean> {
  const user = env.SMTP_USER || 'thegyde.verify@gmail.com';
  const pass = env.SMTP_PASS || 'nwhnmkersbiwwrry';
  const host = env.SMTP_HOST || 'smtp.gmail.com';
  const port = 465;
  const fromName = env.FROM_NAME || 'Global Youth Dialogue & Exchange (GYDE)';
  const fromEmail = env.FROM_EMAIL || user;

  return new Promise((resolve, reject) => {
    const socket = tls.connect(port, host, { minVersion: 'TLSv1.2' });
    socket.setEncoding('utf8');

    let step = 0;

    socket.on('data', (data) => {
      const reply = data.toString();

      if (step === 0 && reply.startsWith('220')) {
        step = 1;
        socket.write('EHLO thegyde.in\r\n');
      } else if (step === 1 && reply.startsWith('250')) {
        step = 2;
        socket.write('AUTH LOGIN\r\n');
      } else if (step === 2 && reply.startsWith('334')) {
        step = 3;
        socket.write(Buffer.from(user).toString('base64') + '\r\n');
      } else if (step === 3 && reply.startsWith('334')) {
        step = 4;
        socket.write(Buffer.from(pass).toString('base64') + '\r\n');
      } else if (step === 4 && reply.startsWith('235')) {
        step = 5;
        socket.write(`MAIL FROM:<${fromEmail}>\r\n`);
      } else if (step === 5 && reply.startsWith('250')) {
        step = 6;
        socket.write(`RCPT TO:<${options.to}>\r\n`);
      } else if (step === 6 && reply.startsWith('250')) {
        step = 7;
        socket.write('DATA\r\n');
      } else if (step === 7 && reply.startsWith('354')) {
        step = 8;
        const boundary = '----=_Part_' + Date.now() + '_' + Math.random().toString(36).slice(2);
        const msgId = `<gyde-${Date.now()}-${Math.random().toString(36).slice(2)}@gmail.com>`;
        const dateStr = new Date().toUTCString();

        const mimeMessage = [
          `Date: ${dateStr}`,
          `Message-ID: ${msgId}`,
          `From: "${fromName}" <${fromEmail}>`,
          `To: ${options.to}`,
          `Reply-To: <${fromEmail}>`,
          `Subject: ${options.subject}`,
          `MIME-Version: 1.0`,
          `X-Priority: 1 (Highest)`,
          `Importance: High`,
          `Auto-Submitted: auto-generated`,
          `Content-Type: multipart/alternative; boundary="${boundary}"`,
          '',
          `--${boundary}`,
          `Content-Type: text/plain; charset=UTF-8`,
          `Content-Transfer-Encoding: 7bit`,
          '',
          options.text,
          '',
          `--${boundary}`,
          `Content-Type: text/html; charset=UTF-8`,
          `Content-Transfer-Encoding: 7bit`,
          '',
          options.html,
          '',
          `--${boundary}--`,
          '',
          '.\r\n',
        ].join('\r\n');

        socket.write(mimeMessage);
      } else if (step === 8 && reply.startsWith('250')) {
        step = 9;
        socket.write('QUIT\r\n');
        socket.end();
        resolve(true);
      } else if (reply.startsWith('5') || reply.startsWith('4')) {
        socket.destroy();
        reject(new Error(`SMTP Rejected (${reply.trim()})`));
      }
    });

    socket.on('error', (err) => {
      reject(err);
    });

    socket.setTimeout(10000, () => {
      socket.destroy();
      reject(new Error('SMTP connection timed out after 10s'));
    });
  });
}

export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  // 1. Cloudflare Email Sending (if configured, fallback on failure)
  if (env.CLOUDFLARE_API_TOKEN) {
    try {
      return await sendViaCloudflare(options);
    } catch (error: any) {
      logger.warn(`⚠️ Cloudflare email delivery failed to ${options.to}: ${error.message}. Proceeding to Gmail SMTP fallback...`);
    }
  }

  // 2. Nodemailer Transporter with service: 'gmail'
  const mailer = getSmtpTransporter();
  if (mailer) {
    try {
      const fromAddress = env.FROM_EMAIL || env.SMTP_USER || 'thegyde.verify@gmail.com';
      const fromName = env.FROM_NAME || 'Global Youth Dialogue & Exchange (GYDE)';

      await mailer.sendMail({
        from: `"${fromName}" <${fromAddress}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });

      logger.info(`📧 Email successfully delivered via Nodemailer to: ${options.to}`);
      return true;
    } catch (error: any) {
      logger.warn(`⚠️ Nodemailer delivery error to ${options.to}: ${error.message}. Proceeding to Pure TLS direct fallback...`);
    }
  }

  // 3. Pure TLS direct socket fallback (Bypasses library overhead and serverless freezes)
  try {
    await sendViaPureTLS(options);
    logger.info(`📧 Email successfully delivered via Pure TLS to: ${options.to}`);
    return true;
  } catch (tlsError: any) {
    logger.error(`❌ Pure TLS delivery error to ${options.to}: ${tlsError.message}`);
    throw new InternalServerError(`Failed to deliver email: ${tlsError.message || 'SMTP service error'}`);
  }
}
