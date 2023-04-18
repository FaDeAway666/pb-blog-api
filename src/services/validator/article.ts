import { checkSchema } from 'express-validator';

export const createArticleValidator = checkSchema({
  title: {
    in: 'body',
    notEmpty: {
      errorMessage: '未输入文章标题',
    },
  },
  categoryId: {
    in: 'body',
    notEmpty: {
      errorMessage: '请选择类目ID',
    },
  },
});
