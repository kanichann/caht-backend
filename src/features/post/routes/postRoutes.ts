import express, { Router } from 'express';
import { authMiddleware } from '@global/helpers/auth-middleware';
import { Create } from '@post/controllers/create-post';
import { Get } from '@post/controllers/get-post';
import { Delete } from '@post/controllers/delete-post';
import { Update } from '@post/controllers/update-post';
// import { Update } from '@post/controllers/update-post';

class PostRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/post/all/:page', authMiddleware.checkAuthenntication, Get.prototype.posts);
    this.router.get('/post/images/:page', authMiddleware.checkAuthenntication, Get.prototype.postsWithImages);
    this.router.post('/post', authMiddleware.checkAuthenntication, Create.prototype.post);
    this.router.post('/post/image/post', authMiddleware.checkAuthenntication, Create.prototype.postWithImage);
    this.router.put('/post/:postId', authMiddleware.checkAuthenntication, Update.prototype.post);
    this.router.put('/post/image/:postId', authMiddleware.checkAuthenntication, Update.prototype.postWithImage);
    this.router.delete('/post/:postId', authMiddleware.checkAuthenntication, Delete.prototype.post);

    return this.router;
  }
}

export const postRoutes: PostRoutes = new PostRoutes();
