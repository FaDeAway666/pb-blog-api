import api from '@src/constants/api';
import { Router, Request, Response, NextFunction } from 'express';
import { decodeJwt, isAuthLegal } from '@src/services/auth';
import { upload } from '@src/services/base';

const baseRouter = Router();

baseRouter.post(api.UPLOAD, [decodeJwt, isAuthLegal], upload);

export default baseRouter;
