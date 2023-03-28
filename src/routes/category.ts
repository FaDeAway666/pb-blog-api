import api from '@src/constants/api';
import { decodeJwt, isAuthLegal } from '@src/services/auth';
import {
  createCategory,
  editCategory,
  getChildCategory,
  getRootCategories,
  removeCategory,
} from '@src/services/category';
import { Router, Request, Response, NextFunction } from 'express';
import {
  createCategoryValidator,
  editCategoryValidator,
  getCategoryValidator,
  removeCategoryValidator,
} from '../services/validator/category';

const categoryRouter = Router();

categoryRouter.get('/', getRootCategories);
categoryRouter.get(
  api.CATEGORY.GET_CHILD,
  getCategoryValidator,
  getChildCategory
);

categoryRouter.post(
  api.CATEGORY.ADD,
  [decodeJwt, isAuthLegal],
  createCategoryValidator,
  createCategory
);

categoryRouter.put(
  api.CATEGORY.EDIT,
  [decodeJwt, isAuthLegal],
  editCategoryValidator,
  editCategory
);

categoryRouter.delete(
  api.CATEGORY.REMOVE,
  [decodeJwt, isAuthLegal],
  removeCategoryValidator,
  removeCategory
);

export default categoryRouter;
