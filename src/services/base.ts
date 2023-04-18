import EnvVars from '@src/constants/EnvVars';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { UploadedFile } from 'express-fileupload';
import { Request, Response } from 'express';
import { getValidationResult, sendResponse } from './common';
import { ErrorMessage } from './types/error';
import { AuthRequest } from './types/request';
import { uuid } from '@src/util/tool';

const legalSuffix = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];

export const uploadImage = async (req: AuthRequest, res: Response) => {
  const { body, auth, files } = req;
  if (!files) return;

  if (getValidationResult(req, res)) return;

  const file = files.file as UploadedFile;
  const lastIndex = file.name.lastIndexOf('.');
  const suffix = file.name.substring(lastIndex + 1);
  console.log(file, suffix);
  if (!legalSuffix.includes(suffix))
    return sendResponse(
      res,
      null,
      '请上传jpg、jpeg、png格式的文件',
      HttpStatusCodes.BAD_REQUEST,
      false
    );

  const fileId = uuid();
  await file.mv(`${process.cwd()}${EnvVars.FILE.imgPath}/${fileId}.${suffix}`);
  return sendResponse(
    res,
    {
      url: `${EnvVars.FILE.imgPath}/${fileId}.${suffix}`, // 需要返回host + 路径
    },
    '上传成功'
  );
};
