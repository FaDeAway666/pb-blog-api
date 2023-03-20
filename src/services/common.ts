import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { Response } from 'express';
import { ErrorMessage } from './types/error';

export const responseData = <T>(result: T, msg: string, success = true) => ({
  result,
  msg: msg ?? 'ok',
  success,
});

export const requiredEmptyResponse = (
  params: Record<string, string | undefined | null>,
  res: Response
) => {
  for (const key in params) {
    if (!params[key])
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json(responseData(null, `${key}${ErrorMessage.RequiredEmpty}`, false))
        .end();
  }
  return null;
};

export const sendResponse = <T>(
  res: Response,
  result: T,
  msg: string,
  code: HttpStatusCodes = HttpStatusCodes.OK,
  success = true
) => {
  return res
    .status(code)
    .json(responseData(result, msg, success ?? false))
    .end();
};
