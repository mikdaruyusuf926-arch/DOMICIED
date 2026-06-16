const express = require('express');
const nodemailer = require('nodemailer');
const fs = require('fs/promises');
const path = require('path');

const app = express();
const root = path.join(__dirname);
const submissionFile = path.join(root, 'submissions.json');

const smtpConfig = process.env.SMTP_HOST
  ? {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: process.env.SMTP_USER
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        : undefined,
    }
  : null;

const transporter = smtpConfig ? nodemailer.createTransport(smtpConfig) : null;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(root));

app.get('/', (req, res) => {
  res.sendFile(path.join(root, 'DOMICIED.HTML'));
});

async function saveSubmission(data) {
  let submissions = [];

  try {
    const raw = await fs.readFile(submissionFile, 'utf8');
    submissions = JSON.parse(raw);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }

  submissions.push({
    submittedAt: new Date().toISOString(),
    data,
  });

  await fs.writeFile(submissionFile, JSON.stringify(submissions, null, 2), 'utf8');
}

async function sendEmail(data) {
  if (!transporter) {
    return null;
  }

  const destination = process.env.SUBMISSION_EMAIL || process.env.SMTP_USER;
  if (!destination) {
    throw new Error('No email destination configured. Set SUBMISSION_EMAIL or SMTP_USER.');
  }

  const html = `
    <h2>New Enrollment Submission</h2>
    <p><strong>Student:</strong> ${data.student_name}</p>
    <p><strong>Preferred grade:</strong> ${data.grade_level}</p>
    <p><strong>Date of birth:</strong> ${data.birth_date}</p>
    <p><strong>Gender:</strong> ${data.gender}</p>
    <p><strong>Parent/guardian:</strong> ${data.guardian_name}</p>
    <p><strong>Phone:</strong> ${data.parent_phone}</p>
    <p><strong>Email:</strong> ${data.parent_email}</p>
    <p><strong>Current school/class:</strong> ${data.current_school || 'N/A'}</p>
    <p><strong>Preferred start term:</strong> ${data.start_term}</p>
    <p><strong>Notes:</strong><br/>${data.notes ? data.notes.replace(/\n/g, '<br/>') : 'None'}</p>
  `;

  return transporter.sendMail({
    from: process.env.SMTP_FROM || `no-reply@${process.env.SMTP_HOST}`,
    to: destination,
    subject: 'Domicied Enrollment Submission',
    html,
  });
}

app.post('/submit', async (req, res) => {
  const payload = req.body;

  if (!payload.student_name || !payload.parent_email || !payload.grade_level) {
    return res.status(400).json({ error: 'Student name, email, and preferred grade are required.' });
  }

  try {
    await saveSubmission(payload);

    let emailResult = null;
    if (transporter) {
      emailResult = await sendEmail(payload);
    }

    return res.json({
      message: 'Application submitted successfully.',
      emailSent: Boolean(emailResult),
    });
  } catch (error) {
    console.error('Error saving submission:', error);
    return res.status(500).json({ error: 'Unable to process your enrollment at this time.' });
  }
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log('Use SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS and SUBMISSION_EMAIL to enable email delivery.');
});
