import { SignUp } from '@auth/controllers/signup';
import { Request, Response } from 'express';
import * as cloudinaryUploads from '@global/helpers/cloudinary-upload';
import { authMock, authMockRequest, authMockResponse } from '@root/mocks/auth.mock';
import { CustomError } from '@global/helpers/error-handlers';

jest.mock('@service/queues/base.queue');
jest.mock('@service/redis/user.cache');
jest.mock('@service/queues/user.queue');
jest.mock('@service/queues/auth.queue');
jest.mock('@global/helpers/cloudinary-upload');

describe('SignUp', () => {
  it('should throw an error if username is not available', () => {
    const req: Request = authMockRequest({}, {
      username: '',
      email: 'sadie.thiel@ethereal.email',
      password: 'tako',
      avatarColor: 'red',
      avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
    }) as Request;
    const res: Response = authMockResponse();

    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Username is a required field');
    });
  });
});
