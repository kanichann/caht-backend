import nodemailer, { createTestAccount } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import Logger from 'bunyan';
import sendGridMail from '@sendgrid/mail';
import { config } from '@root/config';
import { BadRequestError } from '@global/helpers/error-handlers';

interface IMailOptions{
  from: string;
  to: string;
  subject: string;
  html: string;
}

const log: Logger = config.createLogger('email');

class MailTransport {

  public async sendEmail(receiverEmail: string, subject: string, body: string): Promise<void>{
    if (config.NODE_ENV === 'test' || config.NODE_ENV === 'development') {
      this.developmentEmailSender(receiverEmail, subject, body);
    } else {
      this.productEmailSender(receiverEmail, subject, body);
    }
  }

  private async developmentEmailSender(receiveEmail: string, subject: string, body: string): Promise<void>{
    const transporter:Mail = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: config.SENDER_EMAIL!, // generated ethereal user
        pass: config.SENDER_EMAIL_PASSWORD!, // generated ethereal password
      },
    });
    console.log(receiveEmail, subject, body);

    const mailOptions: IMailOptions = {
      from: `Chatty App <${config.SENDER_EMAIL!}>`,
      to: receiveEmail,
      subject ,
      html:body
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      log.error('Error sending email', error);
      throw new BadRequestError('Error sending email');
    }
  }

  private async productEmailSender(receiveEmail: string, subject: string, body: string): Promise<void>{

    const mailOptions: IMailOptions = {
      from: `Chatty App <${config.SENDER_EMAIL!}>`,
      to: receiveEmail,
      subject,
      html: body
    };

    try {
      await sendGridMail.send(mailOptions);
      log.info('Production email sent successfully.');
    } catch (error) {
      log.error('Error sending email', error);
      throw new BadRequestError('Error sending email');
    }
  }
}


export const mailTransport: MailTransport = new MailTransport();
