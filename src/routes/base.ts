import api from '@src/constants/api';
import { Router, Request, Response, NextFunction } from 'express';
import { decodeJwt, isAuthLegal } from '@src/services/auth';
import { uploadImage } from '@src/services/base';

const baseRouter = Router();

baseRouter.post(api.UPLOAD_IMG, [decodeJwt, isAuthLegal], uploadImage);

export default baseRouter;
