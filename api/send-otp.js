// Vercel Serverless Function: /api/send-otp
const tls = require('tls');
const fs = require('fs');
const path = require('path');

// Load config from email_config.json if available, or environment, or fallback
function getConfig() {
  let config = {
    smtp_host: 'smtp.gmail.com',
    smtp_port: 465,
    smtp_user: 'riswankckd@gmail.com',
    smtp_pass: 'avkfjotmlvwkavgv',
    from_email: 'riswankckd@gmail.com',
    from_name: 'Global Youth Dialogue & Exchange (GYDE)'
  };

  try {
    const configPath = path.join(process.cwd(), 'email_config.json');
    if (fs.existsSync(configPath)) {
      const fileConf = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      config = { ...config, ...fileConf };
    }
  } catch (e) {}

  if (process.env.SMTP_USER) config.smtp_user = process.env.SMTP_USER;
  if (process.env.SMTP_PASS) config.smtp_pass = process.env.SMTP_PASS;
  if (process.env.FROM_EMAIL) config.from_email = process.env.FROM_EMAIL;
  if (process.env.FROM_NAME) config.from_name = process.env.FROM_NAME;

  return config;
}

function sendEmailViaTLS(toEmail, code, name) {
  const conf = getConfig();
  const user = conf.smtp_user;
  const pass = conf.smtp_pass;
  const host = conf.smtp_host || 'smtp.gmail.com';
  const port = 465; // Direct TLS port
  const fromName = conf.from_name || 'Global Youth Dialogue & Exchange (GYDE)';
  const fromEmail = conf.from_email || user;

  return new Promise((resolve, reject) => {
    const socket = tls.connect(port, host, { minVersion: 'TLSv1.2' }, () => {
      // TLS connection established
    });

    socket.setEncoding('utf8');

    let step = 0;

    socket.on('data', (data) => {
      const reply = data.toString();

      if (step === 0 && reply.startsWith('220')) {
        step = 1;
        socket.write('EHLO gydonline.vercel.app\r\n');
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
        socket.write(`RCPT TO:<${toEmail}>\r\n`);
      } else if (step === 6 && reply.startsWith('250')) {
        step = 7;
        socket.write('DATA\r\n');
      } else if (step === 7 && reply.startsWith('354')) {
        step = 8;
        const subject = `Your GYDE Verification Code: ${code}`;
        const htmlBody = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
    .card { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { background: linear-gradient(135deg, #1e293b, #0f172a); color: #ffffff; padding: 24px 20px; text-align: center; }
    .header h2 { margin: 0 0 6px 0; font-size: 1.25rem; letter-spacing: 0.05em; }
    .header p { margin: 0; font-size: 0.85rem; color: #94a3b8; }
    .content { padding: 28px 24px; text-align: center; }
    .greeting { font-size: 1rem; color: #334155; margin-bottom: 12px; text-align: left; }
    .text { font-size: 0.92rem; color: #64748b; line-height: 1.5; margin-bottom: 20px; text-align: left; }
    .otp-box { background: #f1f5f9; border: 2px dashed #4851ba; border-radius: 10px; padding: 16px 24px; display: inline-block; margin: 10px auto 20px; }
    .otp-code { font-family: monospace; font-size: 2.2rem; font-weight: 800; letter-spacing: 0.35em; color: #4851ba; margin: 0; }
    .notice { font-size: 0.82rem; color: #94a3b8; margin-top: 14px; line-height: 1.4; }
    .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px; font-size: 0.78rem; color: #94a3b8; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h2>Global Youth Dialogue & Exchange</h2>
      <p>Official Membership Verification</p>
    </div>
    <div class="content">
      <div class="greeting">Dear ${name || 'Applicant'},</div>
      <div class="text">
        Your membership application has been approved by the GYDE Coordinator Secretariat! To complete your registration and activate your official credentials, please verify your email address with the one-time code below:
      </div>
      <div class="otp-box">
        <div class="otp-code">${code}</div>
      </div>
      <div class="notice">
        This verification code will expire in <strong>10 minutes</strong>.<br>
        If you did not request this, please disregard this email.
      </div>
    </div>
    <div class="footer">
      &copy; Global Youth Dialogue & Exchange (GYDE) &bull; International Community of Youth Debaters
    </div>
  </div>
</body>
</html>`;

        const mimeMessage = [
          `From: "${fromName}" <${fromEmail}>`,
          `To: ${toEmail}`,
          `Subject: ${subject}`,
          `MIME-Version: 1.0`,
          `Content-Type: text/html; charset=UTF-8`,
          '',
          htmlBody,
          '',
          '.'
        ].join('\r\n') + '\r\n';

        socket.write(mimeMessage);
      } else if (step === 8 && reply.startsWith('250')) {
        step = 9;
        socket.write('QUIT\r\n');
        resolve({ success: true, message: 'Delivered successfully via SMTP TLS' });
      } else if (reply.startsWith('5') || reply.startsWith('4')) {
        reject(new Error(`SMTP Error: ${reply.trim()}`));
      }
    });

    socket.on('error', (err) => {
      reject(err);
    });

    socket.setTimeout(15000, () => {
      socket.destroy();
      reject(new Error('SMTP connection timed out after 15s'));
    });
  });
}

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {}
    }
    body = body || {};

    const email = (body.email || '').trim();
    const code = (body.code || '').trim();
    const name = (body.name || 'Applicant').trim();

    if (!email || !code) {
      return res.status(400).json({ error: 'Missing email or code parameter.' });
    }

    const result = await sendEmailViaTLS(email, code, name);
    return res.status(200).json({
      success: true,
      sent: true,
      message: result.message || 'Verification email delivered successfully.'
    });
  } catch (err) {
    console.error('Error sending OTP email:', err);
    return res.status(500).json({
      success: false,
      sent: false,
      error: err.message || 'Failed to dispatch verification email.'
    });
  }
};
