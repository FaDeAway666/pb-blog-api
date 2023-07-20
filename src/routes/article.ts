import { Router, Request, Response, NextFunction } from 'express';
import api from '@src/constants/api';
import {
  createArticle,
  getArticleDetail,
  getArticleList,
} from '@src/services/article';
import {
  createArticleValidator,
  articleDetailValidator,
} from '@src/services/validator/article';
import { decodeJwt, isAuthLegal } from '@src/services/auth';

const articleRouter = Router();

articleRouter.use((req: Request, res, next) => {
  if (req.method === 'POST') {
    console.log(req.body);
    // req.body = qs.parse((req.body as object).toString());
  }
  next();
});

articleRouter.post(
  api.ARTICLE.ADD,
  [decodeJwt, isAuthLegal],
  createArticleValidator,
  createArticle
);

articleRouter.get(api.ARTICLE.LIST, getArticleList);
articleRouter.get(api.ARTICLE.DETAIL, articleDetailValidator, getArticleDetail);

export default articleRouter;
