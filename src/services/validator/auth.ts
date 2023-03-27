import { checkSchema } from 'express-validator';

export const loginValidator = checkSchema({
  userName: {
    in: 'body',
    notEmpty: {
      errorMessage: '未输入用户名',
    },
  },
  password: {
    in: 'body',
    notEmpty: {
      errorMessage: '未输入密码',
    },
  },
});
