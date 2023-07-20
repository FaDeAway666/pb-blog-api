import { Response, Request } from 'express';
import { validationResult } from 'express-validator';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { ErrorMessage } from '../types/error';

export const responseData = <T>(result: T, msg: string, success = true) => ({
  result,
  msg: msg ?? 'ok',
  success,
});

// export const requiredEmptyResponse = (
//   params: Record<string, string | undefined | null>,
//   res: Response
// ) => {
//   for (const key in params) {
//     if (!params[key])
//       return res
//         .status(HttpStatusCodes.BAD_REQUEST)
//         .json(responseData(null, `${key}${ErrorMessage.RequiredEmpty}`, false))
//         .end();
//   }
//   return null;
// };

export const sendResponse = <T>(
  res: Response,
  result: T,
  msg = '',
  code: HttpStatusCodes = HttpStatusCodes.OK,
  success = true
) => {
  return res.status(code).json(responseData(result, msg, success)).end();
};

export const getValidationResult = (req: Request, res: Response) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return sendResponse(
      res,
      null,
      errors
        .formatWith((error) => {
          return error.msg as string;
        })
        .array()
        .join(';'),
      HttpStatusCodes.BAD_REQUEST,
      false
    );
  }
};
