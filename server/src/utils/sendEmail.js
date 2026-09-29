import nodemailer from "nodemailer";

// Created once and reused. Works with any SMTP provider
// (Gmail, SendGrid, Resend, Mailtrap, etc.)
let transporter;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465, // true only for port 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // Fail fast instead of hanging for minutes if the mail server is down
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 20000,
    });
  }
  return transporter;
};

// Usage: await sendEmail({ to, subject, text, html })
const sendEmail = async ({ to, subject, text, html, replyTo }) => {
  // No SMTP configured (local development): print the email instead
  if (!process.env.SMTP_HOST) {
    console.log(
      `\n--- Email (SMTP not configured) ---\nTo: ${to}\nSubject: ${subject}\n\n${text}\n----------------------------------\n`
    );
    return;
  }

  await getTransporter().sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
    replyTo,
  });
};

export default sendEmail;
