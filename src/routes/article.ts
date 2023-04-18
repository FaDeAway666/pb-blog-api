import api from '@src/constants/api';
import { Router, Request, Response, NextFunction } from 'express';
// import fileUpload from 'express-fileupload';
import { createArticle } from '@src/services/article';
import { createArticleValidator } from '@src/services/validator/article';
import { decodeJwt, isAuthLegal } from '@src/services/auth';

const articleRouter = Router();

// articleRouter.use(
//   fileUpload({
//     createParentPath: true,
//   })
// );

articleRouter.post(
  api.ARTICLE.ADD,
  [decodeJwt, isAuthLegal],
  createArticleValidator,
  createArticle
);

export default articleRouter;
