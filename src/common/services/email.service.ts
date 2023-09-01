import config from '../../config/config';
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(config.email.token);

class EmailService {
  public sendEmail(message: any) {
    return sgMail
      .send(message)
      .then((response: any) => {
        console.log(response[0].statusCode);
        console.log(response[0].headers);
      })
      .catch((error: any) => {
        console.error(error.response.body.errors);
      });
  }
}

export default new EmailService();
