import { SignUp } from '@auth/controllers/signup';
import { SignIn } from '@auth/controllers/signin';
import express, { Router } from 'express';
import { config } from '@root/config';
import Logger from 'bunyan';
import { SignOut } from '@auth/controllers/signout';

const log: Logger = config.createLogger('auth');

class AuthRoutes {
  private router: Router;
  constructor() {
    this.router = express.Router();
  }
  public routes(): Router {
    log.info('Auth!!');
    console.log('route');
    this.router.post('/signup', SignUp.prototype.create);
    this.router.post('/signin', SignIn.prototype.read);

    return this.router;
  }
  public signoutRoute(): Router {
    this.router.get('/signout', SignOut.prototype.update);
    return this.router;
  }
}

export const authRoutes: AuthRoutes = new AuthRoutes();
