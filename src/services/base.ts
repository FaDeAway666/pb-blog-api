import EnvVars from '@src/constants/EnvVars';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { UploadedFile } from 'express-fileupload';
import { Request, Response } from 'express';
import { sendResponse } from './common';
import { ErrorMessage } from '../types/error';
import { getHostIP, uuid } from '@src/util/tool';

const legalImgSuffix = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];

export const upload = async (req: Request, res: Response) => {
  const { files } = req;
  if (!files) return;

  const file = files.file as UploadedFile;

  const lastIndex = file.name.lastIndexOf('.');
  const suffix = file.name.substring(lastIndex + 1);
  if (!legalImgSuffix.includes(suffix))
    return sendResponse(
      res,
      null,
      '请上传jpg、jpeg、png、gif、bmp、webp、svg格式的文件',
      HttpStatusCodes.BAD_REQUEST,
      false
    );

  const fileId = uuid();
  await file.mv(`${process.cwd()}${EnvVars.FILE.imgPath}/${fileId}.${suffix}`);
  const host = getHostIP();
  return sendResponse(
    res,
    {
      // 需要返回host + 路径
      url: `${host}${EnvVars.FILE.imgPath}/${fileId}.${suffix}`,
    },
    '上传成功'
  );
};

// 获取每日一言
