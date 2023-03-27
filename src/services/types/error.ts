export const ErrorMessage = {
  Unknow: '未知异常',
  Login: {
    UnAuthorized: '用户未登录',
    Expired: '登录超时，请重新登录',
    WrongCertification: '登录信息有误，请重新输入',
  },
  Category: function (operation: string) {
    return `${operation}类目失败，请联系管理员`;
  },
} as const;

export const ErrorType = {
  Unknow: 'Unknow',
  UnAuthorized: 'UnAuthorized',
  Expired: 'Expired',
  WrongCertification: 'WrongCertification',
} as const;
