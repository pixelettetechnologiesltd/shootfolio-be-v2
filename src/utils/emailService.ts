import nodemailer from 'nodemailer';
import config from '../config/config';

const transporter = nodemailer.createTransport({
  host: config.nodeMailer.smtpHost,  // SMTP server hostname
  port: config.nodeMailer.smtpPort,  // SMTP server port
  secure: config.nodeMailer.secure,  // true for 465, false for other ports
  auth: {
    user: config.nodeMailer.email,   // SMTP username
    pass: config.nodeMailer.password, // SMTP password
  },
  tls: {
    rejectUnauthorized: false,  // optional, but recommended for testing
  },
});

export const sendVerificationEmail = (
  email: string,
  verificationLink: string
) => {
  console.log(verificationLink);
  transporter.sendMail({
    from: `shootfolio@pixelette.tech`,
    to: email,
    subject: 'Verify your email',
    text: `Click the following link to verify your email: ${verificationLink}`,
  });
};
