// Vercel Serverless Function: /api/applications
const tls = require('tls');
const fs = require('fs');
const path = require('path');

// In-memory applications cache with seed proposals
let globalApplications = [
  {
    id: 'app_01',
    name: 'Farhan Nadeem',
    email: 'farhan.n@outlook.com',
    country: 'Pakistan',
    flag: 'PK',
    interests: ['Global Affairs', 'Governance & Society'],
    debateExperience: 'Debater at National Schools Championship Pakistan, 3 years parliamentary format.',
    motivation: 'I want to build cross-border intellectual ties with fellow youth who care about sustainable governance and international diplomacy.',
    status: 'Pending',
    date: '2024-10-06'
  },
  {
    id: 'app_02',
    name: 'Sarah Van Dijk',
    email: 'sarah.vandijk@edu.nl',
    country: 'Netherlands',
    flag: 'NL',
    interests: ['Environment', 'Economy'],
    debateExperience: 'European Youth Parliament delegate, university debate society treasurer.',
    motivation: 'Passionate about ecological economics and learning how Global South debaters view loss-and-damage policy.',
    status: 'Pending',
    date: '2024-10-07'
  },
  {
    id: 'app_03',
    name: 'Amina Al-Kuwari',
    email: 'amina.kuwari@youth.qa',
    country: 'Qatar',
    flag: 'QA',
    interests: ['Human Rights & Law', 'Global Affairs'],
    debateExperience: 'QatarDebate National League delegate, English & Arabic parliamentary debate speaker.',
    motivation: 'Eager to represent Gulf youth perspectives in multilateral discourse and collaborate on youth policy synthesis.',
    status: 'Pending',
    date: '2024-10-08'
  },
  {
    id: 'app_04',
    name: 'Kofi Mensah',
    email: 'kofi.mensah@ug.edu.gh',
    country: 'Ghana',
    flag: 'GH',
    interests: ['Education & Knowledge', 'Technology & Innovation'],
    debateExperience: 'African Debate Academy finalist, Pan-African Universities Debating Championship participant.',
    motivation: 'Committed to amplifying African youth research and bridging global digital governance divides through evidence-based motions.',
    status: 'Pending',
    date: '2024-10-08'
  },
  {
    id: 'app_05',
    name: 'Elena Rostova',
    email: 'elena.rostova@debate.sg',
    country: 'Singapore',
    flag: 'SG',
    interests: ['Peace & Conflict', 'Global Affairs'],
    debateExperience: 'Singapore WSDC youth delegation finalist, 4 years competitive debate.',
    motivation: 'Excited to engage with international thinkers on geopolitical mediation and publish collaborative youth research papers.',
    status: 'Pending',
    date: '2024-10-08'
  }
];

function sendAdminNotification(app) {
  const user = 'riswankckd@gmail.com';
  const pass = 'avkfjotmlvwkavgv';
  const host = 'smtp.gmail.com';
  const port = 465;
  const adminRecipients = ['3681mubashircp@gmail.com', 'riswankckd@gmail.com'];

  return new Promise((resolve) => {
    try {
      const socket = tls.connect(port, host, { minVersion: 'TLSv1.2' }, () => {});
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
          socket.write(`MAIL FROM:<${user}>\r\n`);
        } else if (step === 5 && reply.startsWith('250')) {
          step = 6;
          // Send to primary admin
          socket.write(`RCPT TO:<3681mubashircp@gmail.com>\r\n`);
        } else if (step === 6 && reply.startsWith('250')) {
          step = 7;
          socket.write('DATA\r\n');
        } else if (step === 7 && reply.startsWith('354')) {
          step = 8;
          const subject = `[GYDE New Application] ${app.name} (${app.country})`;
          const body = [
            `From: "GYDE Secretariat Alerts" <${user}>`,
            `To: 3681mubashircp@gmail.com`,
            `Subject: ${subject}`,
            `MIME-Version: 1.0`,
            `Content-Type: text/html; charset=UTF-8`,
            '',
            `<!DOCTYPE html><html><body style="font-family: sans-serif; padding: 20px; background: #f8fafc;">`,
            `<div style="max-width: 540px; margin: 0 auto; background: #fff; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0;">`,
            `<h3 style="color: #4851ba; margin-top: 0;">New GYDE Membership Application Received</h3>`,
            `<p><strong>Applicant Name:</strong> ${app.name}</p>`,
            `<p><strong>Email Address:</strong> ${app.email}</p>`,
            `<p><strong>Country:</strong> ${app.country}</p>`,
            `<p><strong>Debate Experience:</strong> ${app.debateExperience || 'N/A'}</p>`,
            `<p><strong>Interests:</strong> ${(app.interests || []).join(', ')}</p>`,
            `<p><strong>Motivation:</strong> "${app.motivation || 'N/A'}"</p>`,
            `<hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">`,
            `<p style="font-size: 13px; color: #64748b;">This application is waiting for your review in the Coordinator Dashboard.</p>`,
            `</div></body></html>`,
            '',
            '.'
          ].join('\r\n') + '\r\n';
          socket.write(body);
        } else if (step === 8 && reply.startsWith('250')) {
          step = 9;
          socket.write('QUIT\r\n');
          resolve(true);
        } else if (reply.startsWith('5') || reply.startsWith('4')) {
          socket.destroy();
          resolve(false);
        }
      });

      socket.on('error', () => resolve(false));
      socket.setTimeout(10000, () => { socket.destroy(); resolve(false); });
    } catch (e) {
      resolve(false);
    }
  });
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json(globalApplications);
  }

  if (req.method === 'POST') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) {}
      }
      body = body || {};

      const name = (body.name || '').trim();
      const email = (body.email || '').trim();
      const country = (body.country || 'Global').trim();

      if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required.' });
      }

      const newApp = {
        id: body.id || ('app_' + Date.now().toString(36)),
        name,
        email,
        country,
        flag: body.flag || 'INT',
        interests: body.interests || ['Global Affairs'],
        debateExperience: body.debateExperience || '',
        motivation: body.motivation || '',
        status: body.status || 'Pending',
        date: body.date || new Date().toISOString().split('T')[0]
      };

      // Check if duplicate email exists
      const existingIdx = globalApplications.findIndex(a => a.email.toLowerCase() === email.toLowerCase());
      if (existingIdx >= 0) {
        globalApplications[existingIdx] = { ...globalApplications[existingIdx], ...newApp };
      } else {
        globalApplications.unshift(newApp);
      }

      // Asynchronously notify coordinator via email
      sendAdminNotification(newApp).catch(() => {});

      return res.status(200).json({
        success: true,
        message: 'Application recorded successfully.',
        application: newApp
      });
    } catch (err) {
      return res.status(500).json({ error: err.message || 'Internal error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
