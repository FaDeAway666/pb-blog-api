export const ErrorMessage = {
  Unknow: '未知异常',
  RequiredEmpty: '不能为空',
  Login: {
    UnAuthorized: '用户未登录',
    Expired: '登录超时，请重新登录',
    WrongCertification: '登录信息有误，请重新输入',
  },
} as const;

export const ErrorType = {
  Unknow: 'Unknow',
  UnAuthorized: 'UnAuthorized',
  Expired: 'Expired',
  WrongCertification: 'WrongCertification',
  RequiredEmpty: 'RequiredEmpty',
} as const;
