import { Request } from 'express';

// **** Express **** //

export interface IReq<T = void> extends Request {
  body: T;
}

export type ExtraRequest<T> = T & Request;

export interface AuthRequest<T = void> extends IReq<T> {
  auth?: {
    _id: string;
    userName: string;
    role?: string;
  };
}
