import { checkSchema } from 'express-validator';

export const createArticleValidator = checkSchema({
  title: {
    in: 'body',
    notEmpty: {
      errorMessage: '未输入文章标题',
    },
  },
  categoryId: {
    custom: {
      options: (value) => {
        console.log(value);
        return Array.isArray(value) && value.length > 0;
      },
      errorMessage: '格式不正确',
    },
    in: 'body',
  },
});

export const articleDetailValidator = checkSchema({
  id: {
    in: 'params',
    notEmpty: {
      errorMessage: '请传入id',
    },
  },
});
