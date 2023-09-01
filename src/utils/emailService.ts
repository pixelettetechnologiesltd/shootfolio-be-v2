import nodemailer from 'nodemailer';
import config from '../config/config';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: config.nodeMailer.email,
    pass: config.nodeMailer.password,
  },
});

export const sendVerificationEmail = (
  email: string,
  verificationLink: string
) => {
  transporter.sendMail({
    to: email,
    subject: 'Verify your email',
    text: `Click the following link to verify your email: ${verificationLink}`,
  });
};
