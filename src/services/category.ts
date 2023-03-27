import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import CategoryModel from '@src/models/category';
import { Response } from 'express';
import { getValidationResult, sendResponse } from './common';
import { ErrorMessage } from './types/error';
import { AuthRequest, ExtraRequest, IReq } from './types/request';

interface ICategory {
  categoryName: string;
  private?: boolean;
  parent?: string;
}

async function createCategory(req: AuthRequest<ICategory>, res: Response) {
  const { body, auth } = req;
  if (getValidationResult(req, res)) return;

  const exist = await CategoryModel.exists({
    categoryName: body.categoryName,
  });
  if (exist)
    return sendResponse(
      res,
      null,
      '类目已存在',
      HttpStatusCodes.BAD_REQUEST,
      false
    );

  CategoryModel.create(
    {
      ...body,
      createUser: auth!.userName,
    },
    (err, data) => {
      if (err) {
        return sendResponse(
          res,
          null,
          ErrorMessage.Category('添加'),
          HttpStatusCodes.INTERNAL_SERVER_ERROR,
          false
        );
      }
      return sendResponse(res, data);
    }
  );
}

async function editCategory(req: AuthRequest<ICategory>, res: Response) {
  if (getValidationResult(req, res)) return;
  const { id } = req.params;
  try {
    const result = await CategoryModel.updateOne(
      {
        _id: id,
      },
      { ...req.body }
    );
    if (!result.matchedCount) {
      return sendResponse(
        res,
        null,
        '不存在的类目',
        HttpStatusCodes.BAD_REQUEST,
        false
      );
    }
    return sendResponse(res, result, '类目更新成功');
  } catch (e: any) {
    return sendResponse(
      res,
      null,
      `类目更新失败: ${e as string}`,
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      false
    );
  }
}

async function removeCategory(req: AuthRequest, res: Response) {
  if (getValidationResult(req, res)) return;
  const { id } = req.params;
  try {
    const result = await CategoryModel.deleteOne({
      _id: id,
    });
    if (result.deletedCount) {
      return sendResponse(res, null, '类目删除成功');
    }
    return sendResponse(
      res,
      null,
      '不存在的类目',
      HttpStatusCodes.BAD_REQUEST,
      false
    );
  } catch (e) {
    return sendResponse(
      res,
      null,
      `类目删除失败: ${e as string}`,
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      false
    );
  }
}

export { createCategory, editCategory, removeCategory };
