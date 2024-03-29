import { Router, Request, Response, NextFunction } from 'express';
import { expressjwt } from 'express-jwt';
import API from '@src/constants/api';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { IReq } from './types/express/misc';
import User from '@src/models/User';
import { login, decodeJwt, isAuthLegal, logout } from '@src/services/auth';
import EnvVars from '@src/constants/EnvVars';
import { loginValidator } from '@src/services/validator/auth';
const authRouter = Router();

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

// function login(req: Request, res: Response) {
//   console.log(req);
//   res.status(HttpStatusCodes.OK).end();
// }

function testAddUser(req: IReq<User>, res: Response) {
  const { body } = req;
  User.create(body, (err, result) => {
    if (err)
      return res.status(HttpStatusCodes.BAD_REQUEST).send({
        msg: err.message,
        result: null,
        success: false,
      });
    return res.status(HttpStatusCodes.OK).json({
      msg: 'ok',
      result,
      success: true,
    });
  });
}

authRouter.post(API.AUTH.LOGIN, loginValidator, login);
authRouter.post(API.AUTH.LOGOUT, logout);
authRouter.post(
  API.AUTH.ADD,
  [decodeJwt, isAuthLegal],
  (res: AuthRequest, req: Response, next: NextFunction) => {
    console.log(res.auth);
    next();
  },
  testAddUser
);

export default authRouter;
