"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../../config/config"));
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(config_1.default.email.token);
class EmailService {
    sendEmail(message) {
        return sgMail
            .send(message)
            .then((response) => {
            console.log(response[0].statusCode);
            console.log(response[0].headers);
        })
            .catch((error) => {
            console.error(error.response.body.errors);
        });
    }
}
exports.default = new EmailService();
