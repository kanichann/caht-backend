import { Application } from 'express';
import { authRoutes } from '@auth/routes/authRoutes';
import { config } from '@root/config';
import Logger from 'bunyan';
import { serverAdapter } from '@service/queues/base.queue';
import { currentUserRoutes } from '@auth/routes/currentRoutes';
import { authMiddleware } from '@global/helpers/auth-middleware';
import { postRoutes } from '@post/routes/postRoutes';

const BASE_PATH = '/api/v1';

export default (app: Application) => {
  const routes = () => {
    app.use('/queues', serverAdapter.getRouter());
    app.use(BASE_PATH, authRoutes.routes());
    app.use(BASE_PATH, authRoutes.signoutRoute());

    app.use(BASE_PATH, authMiddleware.veryfyUser, currentUserRoutes.routes());
    app.use(BASE_PATH, authMiddleware.veryfyUser, postRoutes.routes());
  };
  routes();
};
