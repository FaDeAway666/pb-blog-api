import { checkSchema } from 'express-validator';

export const createCategoryValidator = checkSchema({
  categoryName: {
    in: 'body',
    notEmpty: {
      errorMessage: '未输入类目名',
    },
  },
});

export const editCategoryValidator = checkSchema({
  id: {
    in: 'params',
    notEmpty: {
      errorMessage: '请传入id',
    },
  },
  categoryName: {
    in: 'body',
    notEmpty: {
      errorMessage: '内容不能为空',
    },
  },
});

export const removeCategoryValidator = checkSchema({
  id: {
    in: 'params',
    notEmpty: {
      errorMessage: '请传入id',
    },
  },
});
