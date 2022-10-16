import { IUserDocument } from '@user/interfaces/user.interface';
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

export class SignOut {
  public async update(req: Request, res: Response): Promise<void> {
    req.session = null;
    res.status(HTTP_STATUS.OK).json({ message: 'Logout successful', user: {}, token: '' });
  }
}
