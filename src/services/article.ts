import EnvVars from '@src/constants/EnvVars';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import ArticleModel from '@src/models/article';
import { UploadedFile } from 'express-fileupload';
import { readFileSync, rmSync } from 'fs';
import { Request, Response } from 'express';
import { marked } from 'marked';
import hljs from 'highlight.js';
import { getValidationResult, sendResponse } from './common';
import { ErrorMessage } from '../types/error';
import { AuthRequest, QReq } from '../types/request';
import { uuid } from '@src/util/tool';

interface IArticle {
  title: string;
  categoryId: string[];
  coverImg?: string;
  tag?: Array<string>;
  path: string;
  createUser: string;
}

marked.setOptions({
  highlight: function (code) {
    return hljs.highlightAuto(code).value;
  },
});

const parseMdToHTML = (md: string) => {
  return new Promise((resolve, reject) => {
    marked.parse(md, (err, content) => {
      if (err) reject(err);
      resolve(content);
    });
  });
};

export const createArticle = async (
  req: AuthRequest<IArticle>,
  res: Response
) => {
  const { body, auth, files } = req;
  // 传递数组，前端使用formData传递数组，方法为
  // const formData = new FormData();
  // formData.append('categoryId', 1);
  // formData.append('categoryId', 2);

  console.log(files, body, 'files');
  // if (!files) return;

  if (getValidationResult(req, res)) return;

  try {
    const result = await ArticleModel.create({
      ...body,
      createUser: auth!.userName,
    });
    return sendResponse(res, result, '文章创建成功');
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

  // const file = files.file as UploadedFile;
  // const lastIndex = file.name.lastIndexOf('.');
  // const suffix = file.name.substring(lastIndex + 1);
  // if (suffix !== 'md')
  //   return sendResponse(
  //     res,
  //     null,
  //     '请上传md格式的文件',
  //     HttpStatusCodes.BAD_REQUEST,
  //     false
  //   );

  // console.log(`.${EnvVars.FILE.docPath}/${file.name}`, auth);
  // const fileId = uuid();
  // await file.mv(`${process.cwd()}${EnvVars.FILE.docPath}/${fileId}.md`);
};

export const deleteArticle = async (req: AuthRequest, res: Response) => {
  const { params } = req;
  const { id } = params;
  try {
    const article = await ArticleModel.findByIdAndDelete(id);
    if (article?.path) {
      rmSync(`${process.cwd()}${article.path}`);
    }

    return sendResponse(res, null, '删除成功');
  } catch (e) {
    return sendResponse(
      res,
      null,
      ErrorMessage.Article('删除') + (e as string),
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      false
    );
  }
};

export const updateArticle = async (
  req: AuthRequest<IArticle>,
  res: Response
) => {
  const { body, auth, files } = req;
  if (!files) return;
};

interface QArticle {
  pageNum: string;
  pageSize: string;
  categoryId?: string[];
  tag?: string[];
  [key: string]: string | string[] | undefined;
}

export const getArticleList = async (req: QReq<QArticle>, res: Response) => {
  const { query } = req;
  const { pageNum, pageSize, categoryId, tag } = query;
  const skip = (Number(pageNum) - 1) * Number(pageSize);
  const limit = Number(pageSize);
  try {
    const result = await ArticleModel.find({
      ...(categoryId?.length && {
        categoryId: { $in: [categoryId[categoryId.length - 1]] },
      }),
      ...(tag?.length && { tag: { $in: tag } }),
    })
      .skip(skip)
      .limit(limit)
      .populate('categoryId')
      .populate('tags')
      .sort({ createTime: -1 });
    const total = await ArticleModel.countDocuments({
      ...(categoryId && { categoryIds: { $in: [] } }),
      ...(tag && { tags: { $in: [tag] } }),
    });
    return sendResponse(res, {
      list: result,
      total,
    });
  } catch (e) {
    console.log(e);
    return sendResponse(
      res,
      null,
      ErrorMessage.Article('获取'),
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      false
    );
  }
};

export const getArticleDetail = async (req: Request, res: Response) => {
  if (getValidationResult(req, res)) return;
  const {
    params: { id },
  } = req;

  try {
    const result = await ArticleModel.findById(id);
    if (!result)
      return sendResponse(
        res,
        null,
        '文章不存在',
        HttpStatusCodes.NOT_FOUND,
        false
      );
    // 使用MarkdownIt解析markdown
    const md = readFileSync(process.cwd() + result.path, 'utf-8');
    const content = await parseMdToHTML(md);
    console.log(content);

    return sendResponse(res, content);
  } catch (e) {
    console.log(e);
    return sendResponse(
      res,
      null,
      ErrorMessage.Article('获取'),
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      false
    );
  }
};
