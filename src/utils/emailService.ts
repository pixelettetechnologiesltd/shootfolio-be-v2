import nodemailer from 'nodemailer';
import config from '../config/config';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: config.nodeMailer.email,   // SMTP username
    pass: config.nodeMailer.password, // SMTP password
  },
});

export const sendVerificationEmail = (
  email: string,
  verificationLink: string
) => {
  console.log(verificationLink);
  transporter.sendMail({
    to: email,
    subject: 'Verify your email',
    text: `Click the following link to verify your email: ${verificationLink}`,
  }, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};
