import nodemailer from 'nodemailer';
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
    const port = env.SMTP_PORT || 465;
    const isSecure = port === 465 ? true : env.SMTP_SECURE;

    smtpTransporter = nodemailer.createTransport({
      host: env.SMTP_HOST || 'smtp.gmail.com',
      port,
      secure: isSecure,
      auth: {
        user,
        pass,
      },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 20000,
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

  // 1. Cloudflare REST API (Recommended for Serverless/Vercel)
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

  // 2. Cloudflare Authenticated SMTP (smtp.mx.cloudflare.net:465)
  if (!cloudflareTransporter) {
    cloudflareTransporter = nodemailer.createTransport({
      host: 'smtp.mx.cloudflare.net',
      port: 465,
      secure: true,
      auth: {
        user: 'api_token',
        pass: env.CLOUDFLARE_API_TOKEN,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
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

export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  // 1. Cloudflare Email Sending (if configured, fallback to SMTP on failure)
  if (env.CLOUDFLARE_API_TOKEN) {
    try {
      return await sendViaCloudflare(options);
    } catch (error: any) {
      logger.warn(`⚠️ Cloudflare email delivery failed to ${options.to}: ${error.message}. Proceeding to Gmail SMTP fallback...`);
    }
  }

  // 2. SMTP Transporter (Fallback)
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

      logger.info(`📧 Email successfully delivered via SMTP to: ${options.to}`);
      return true;
    } catch (error: any) {
      logger.error(`❌ SMTP delivery error to ${options.to}: ${error.message}`);
      throw new InternalServerError(`Failed to deliver email: ${error.message || 'SMTP service error'}`);
    }
  }

  // 3. No email provider configured
  if (env.NODE_ENV === 'production') {
    logger.error('❌ Cannot send email: neither CLOUDFLARE_API_TOKEN nor SMTP_USER/SMTP_PASS is configured.');
    throw new InternalServerError('Email service is not configured. Please configure Cloudflare or SMTP in environment variables.');
  }

  logger.warn(`[DEV] No email provider configured. Would have sent email to ${options.to} with subject "${options.subject}"`);
  return true;
}



