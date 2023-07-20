import { Request } from 'express';
import { Query } from 'express-serve-static-core';

// **** Express **** //

export interface IReq<T = void> extends Request {
  body: T;
}

export interface IReqQuery<T extends Query, U = void> extends Request {
  query: T;
  body: U;
}

export interface QReq<T extends Query> extends Request {
  query: T;
}

export type ExtraRequest<T> = T & Request;

export interface AuthRequest<T = void> extends IReq<T> {
  auth?: {
    _id: string;
    userName: string;
    role?: string;
  };
}
