import { resetPasswordTemplate } from './../../../shared/services/emails/templates/reset-password/reset-password-template';
import { emailQueue } from './../../../shared/services/queues/email.queue';
import { IResetPasswordParams, IUserDocument } from '@user/interfaces/user.interface';
import { IAuthDocument } from './../interfaces/auth.interface';
import HTTP_STATUS from 'http-status-codes';
import { authService } from '@service/db/auth.service';
import { BadRequestError } from '@global/helpers/error-handlers';
import JWT from 'jsonwebtoken';
import { config } from '@root/config';
import { loginSchema } from '@auth/schemes/signin';
import { Request, Response } from 'express';

import { joiValidation } from '@global/decorators/joi-validation.decorators';
import { userService } from '@service/db/user.service';
import { mailTransport } from '@service/emails/mail.transport';
import { forgotPasswordTemplate } from '@service/emails/templates/fogot-password/forgot-password-template';
import moment from 'moment';
import publicIP from 'ip';

export class SignIn {
  @joiValidation(loginSchema)
  public async read(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;
    const existingUser: IAuthDocument = await authService.getAuthUserByUsername(username);
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }
    const passwordMatch: boolean = await existingUser.comparePassword(password);
    if (!passwordMatch) {
      throw new BadRequestError('Invalid credentials');
    }

    console.log(existingUser._id);

    const user: IUserDocument = await userService.getUserByAuthId(`${existingUser._id}`);
    const userJwt: string = JWT.sign(
      {
        userId: user._id,
        uid: existingUser.uId,
        email: existingUser.email,
        username: existingUser.username,
        avatarColor: existingUser.avatarColor
      },
      config.JWT_TOKEN!
    );


    const templateParams: IResetPasswordParams = {
      username: existingUser.username!,
      email: existingUser.email!,
      ipaddress: publicIP.address(),
      date: moment().format('DD/MM/YYYY HH:mm')
    };
    const template: string = resetPasswordTemplate.passwordResetConfirmationTemplate(templateParams);
    emailQueue.addEmailJob('forgotPasswordEmail', { template, receiverEmail: 'maynard62@ethereal.email', subject: 'password reset confirmation' });
    // const resetLink = `${config.CLIENT_URL}/reset-password?token=12345678910`;
    // const template: string = forgotPasswordTemplate.passwordResetTemplate(existingUser.username!, resetLink);
    // emailQueue.addEmailJob('forgotPasswordEmail', { template, receiverEmail: 'maynard62@ethereal.email', subject: 'Reset Your password' });

    req.session = { jwt: userJwt };
    // const userDocument: IUserDocument = {
    //   ...user,
    //   authId: existingUser!._id,
    //   username: existingUser!.username,
    //   email: existingUser!.email,
    //   avatarColor: existingUser!.avatarColor,
    //   uId: existingUser!.uId,
    //   createdAt: existingUser!.createdAt
    // } as IUserDocument;
    // await mailTransport.sendEmail('maynard62@ethereal.email','Tesing development','this is a test email to show theat debelopment email sender work');
    res.status(HTTP_STATUS.OK).json({ message: 'User login successfully', user: existingUser, token: userJwt });

  }
}
