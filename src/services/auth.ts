import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { expressjwt } from 'express-jwt';
import { IReq } from './types/request';
import { LoginParams } from './types/required-params';
import UserModel from '@src/models/user';
import { requiredEmptyResponse, responseData } from './common';
import EnvVars from '@src/constants/EnvVars';
import { ErrorMessage } from './types/error';

interface User {
  userName: string;
  password: string;
  role?: number;
}

interface AuthRequest extends Request {
  auth?: {
    _id: string;
    role?: string;
  };
}

async function login(req: IReq<User>, res: Response) {
  const { userName, password } = req.body;

  const isRequiredEmpty = requiredEmptyResponse(
    {
      [LoginParams.UserName]: userName,
      [LoginParams.Password]: password,
    },
    res
  );
  if (isRequiredEmpty) return;

  const result = await UserModel.findOne({ userName }).exec();
  console.log(result);
  if (!result) {
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json(responseData(null, '用户不存在', false))
      .end();
  } else if (!result.authenticate(password)) {
    return res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .json(responseData(null, '密码错误', false))
      .end();
  } else {
    const token = jwt.sign(
      { id: result._id, role: result.role },
      EnvVars.Jwt.Secret,
      {
        expiresIn: 100,
      }
    );
    res.cookie('token', token, {
      expires: new Date(Date.now() + 9999),
    });
    return res
      .status(HttpStatusCodes.OK)
      .json(responseData(null, '登录成功'))
      .end();
  }
}

const decodeJwt = expressjwt({
  secret: EnvVars.Jwt.Secret,
  algorithms: ['HS256'],
  requestProperty: 'auth',
  onExpired: () => {
    throw Error(ErrorMessage.Login.Expired);
  },
});

function isAuthLegal(
  err: Error,
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  if (err) {
    let msg = err?.message;
    err.name === 'UnauthorizedError' && (msg = ErrorMessage.Login.UnAuthorized);
    return res
      .status(HttpStatusCodes.FORBIDDEN)
      .json(responseData(null, msg, false))
      .end();
  }
  next();
}

export { login, decodeJwt, isAuthLegal };
