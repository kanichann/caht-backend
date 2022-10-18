import { resetPasswordTemplate } from './../../../shared/services/emails/templates/reset-password/reset-password-template';
import { emailQueue } from './../../../shared/services/queues/email.queue';
import { IResetPasswordParams } from '@user/interfaces/user.interface';
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
import { emailSchema, passwordSchema } from '@auth/schemes/password';
import crypto from 'crypto';

export class Password {

  @joiValidation(emailSchema)
  public async create(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    const existingUser: IAuthDocument = await authService.getAuthUserByEmail(email);

    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }
    const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
    const randomCharacters: string = randomBytes.toString('hex');
    await authService.updatePasswordToken(`${existingUser._id!}`, randomCharacters, Date.now() * 60 * 60 * 1000);
    const resetLink = `${config.CLIENT_URL}/reset-password?token=${randomCharacters}`;
    const template: string = forgotPasswordTemplate.passwordResetTemplate(existingUser.username!, resetLink);
    emailQueue.addEmailJob('forgotPasswordEmail', { template, receiverEmail: email, subject: 'Reset your password' });
    res.status(HTTP_STATUS.OK).json({ message: 'Password reset email sent.' });
  }

  @joiValidation(passwordSchema)
  public async update(req: Request, res: Response): Promise<void> {
    const { password, confirmPassword } = req.body;
    const { token } = req.params;
    if (password !== confirmPassword) {
      throw new BadRequestError('password do not match');
    }
    const existingUser: IAuthDocument = await authService.getAuthUserByPassword(token);

    if (!existingUser) {
      throw new BadRequestError('resetToken is expired');
    }

    existingUser.password = password;
    existingUser.passwordResetExpires = undefined;
    existingUser.passwordResetToken = undefined;
    await existingUser.save();

    const templateParams: IResetPasswordParams = {
      username: existingUser.username,
      email: existingUser.email,
      ipaddress: publicIP.address(),
      date: moment().format('DD/MM/YY HH:mm')
    };
    const template: string = resetPasswordTemplate.passwordResetConfirmationTemplate(templateParams);
    emailQueue.addEmailJob('forgotPasswordEmail', { template, receiverEmail: existingUser.email!, subject: 'Reset your password' });
    res.status(HTTP_STATUS.OK).json({ message: 'Password successfully changed.' });
  }
}
