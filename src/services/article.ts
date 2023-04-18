import EnvVars from '@src/constants/EnvVars';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import ArticleModel from '@src/models/article';
import { UploadedFile } from 'express-fileupload';
import { Request, Response } from 'express';
import { getValidationResult, sendResponse } from './common';
import { ErrorMessage } from './types/error';
import { AuthRequest } from './types/request';
import { uuid } from '@src/util/tool';

interface IArticle {
  title: string;
  categoryId: string;
  coverImg?: string;
  tags?: Array<string>;
  path: string;
  createUser: string;
}

export const createArticle = async (
  req: AuthRequest<IArticle>,
  res: Response
) => {
  const { body, auth, files } = req;
  if (!files) return;

  if (getValidationResult(req, res)) return;

  const file = files.file as UploadedFile;
  const lastIndex = file.name.lastIndexOf('.');
  const suffix = file.name.substring(lastIndex + 1);
  if (suffix !== 'md')
    return sendResponse(
      res,
      null,
      '请上传md格式的文件',
      HttpStatusCodes.BAD_REQUEST,
      false
    );

  console.log(`.${EnvVars.FILE.docPath}/${file.name}`, auth);
  const fileId = uuid();
  await file.mv(`${process.cwd()}${EnvVars.FILE.docPath}/${fileId}.md`);
  try {
    const result = await ArticleModel.create({
      ...body,
      path: `${EnvVars.FILE.docPath}/${fileId}.md`,
      createUser: auth!.userName,
    });
    return sendResponse(res, result, '文章添加成功');
  } catch (e) {
    console.log(e);
    return sendResponse(
      res,
      null,
      ErrorMessage.Article('添加'),
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      false
    );
  }
};
