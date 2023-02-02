import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { expressjwt } from 'express-jwt';
import { IReq } from './types/request';
import UserModel from '@src/models/User';
import { getValidationResult, sendResponse } from './common';
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
    userName: string;
    role?: string;
  };
}

async function login(req: IReq<User>, res: Response) {
  const { userName, password } = req.body;
  if (getValidationResult(req, res)) return;

  const result = await UserModel.findOne({ userName }).exec();
  console.log(result);
  if (!result) {
    return sendResponse(res, null, '用户不存在', HttpStatusCodes.BAD_REQUEST);
  } else if (!result.authenticate(password)) {
    return sendResponse(res, null, '密码错误', HttpStatusCodes.BAD_REQUEST);
  } else {
    const token = jwt.sign(
      { id: result._id, userName: result.userName, role: result.role },
      EnvVars.Jwt.Secret,
      {
        expiresIn: '24h',
      }
    );
    res.cookie('token', token, {
      expires: new Date(Date.now() + 9999),
    });
    return sendResponse(res, result, '登录成功');
  }
}

function logout(req: Request, res: Response) {
  try {
    res.clearCookie('token');
    return sendResponse(res, null, '登出成功');
  } catch (e) {
    return sendResponse(
      res,
      null,
      e as string,
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
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
    return sendResponse(res, null, msg, HttpStatusCodes.FORBIDDEN);
  }
  next();
}

export { login, logout, decodeJwt, isAuthLegal };
