"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config/config"));
const transporter = nodemailer_1.default.createTransport({
    service: 'Gmail',
    auth: {
        user: config_1.default.nodeMailer.email,
        pass: config_1.default.nodeMailer.password,
    },
});
const sendVerificationEmail = (email, verificationLink) => {
    transporter.sendMail({
        to: email,
        subject: 'Verify your email',
        text: `Click the following link to verify your email: ${verificationLink}`,
    });
};
exports.sendVerificationEmail = sendVerificationEmail;
