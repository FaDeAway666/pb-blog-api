import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import CategoryModel from '@src/models/category';
import { Request, Response } from 'express';
import { getValidationResult, sendResponse } from './common';
import { ErrorMessage } from './types/error';
import { AuthRequest } from './types/request';

interface ICategory {
  categoryName: string;
  private?: boolean;
  parent?: string;
  isRoot?: boolean;
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

  try {
    // 如果添加的是子类目，给父类目设置hasChildren为true
    if (body.parent) {
      const parent = await CategoryModel.findById(body.parent);
      if (!parent?.hasChildren)
        await CategoryModel.updateOne(
          {
            _id: body.parent,
          },
          {
            ...parent?.toObject(),
            hasChildren: true,
          }
        );
    }
    const result = await CategoryModel.create({
      ...body,
      createUser: auth!.userName,
    });
    return sendResponse(res, result);
  } catch (e) {
    console.log(e);
    return sendResponse(
      res,
      null,
      ErrorMessage.Category('添加'),
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      false
    );
  }
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

function updateParent(id: string) {
  CategoryModel.find({
    parent: id,
  }).then((children) => {
    if (children.length === 0) {
      CategoryModel.updateOne({ _id: id }, { hasChildren: false });
    }
  });
}

async function removeCategory(req: AuthRequest, res: Response) {
  if (getValidationResult(req, res)) return;
  const { id } = req.params;
  // update parent
  try {
    const category = await CategoryModel.findById(id);
    const result = await CategoryModel.deleteOne({
      _id: id,
    });
    if (category) {
      const parent = category.toObject().parent;
      parent && updateParent(parent);
    }

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

async function getRootCategories(req: Request, res: Response) {
  try {
    const result = await CategoryModel.find({
      isRoot: true,
      private: false,
    });

    return sendResponse(res, result);
  } catch (e) {
    return sendResponse(
      res,
      null,
      ErrorMessage.Unknow,
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      false
    );
  }
}

async function getChildCategory(req: Request, res: Response) {
  if (getValidationResult(req, res)) return;
  const { id } = req.query;
  try {
    const result = await CategoryModel.find({
      parent: id,
      private: false,
    });

    return sendResponse(res, result);
  } catch (e) {
    return sendResponse(
      res,
      null,
      ErrorMessage.Unknow,
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      false
    );
  }
}

export {
  createCategory,
  editCategory,
  removeCategory,
  getRootCategories,
  getChildCategory,
};
