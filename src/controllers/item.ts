import express from 'express';
import { Request } from 'express-jwt';
import { Joi } from 'express-validation';
import canActivate from '../middlewares/can-activate';
import { customExpressJwt } from '../middlewares/express-jwt';
import { handleEntityNotExist } from '../middlewares/handle-entity-not-exist';
import { customValidate } from '../middlewares/validation';
import { isCollectionBelongsToUser } from '../services/collection';
import {
  createItem,
  deleteItem,
  getItem,
  getItems,
  isItemBelongsToUser,
  updateItem
} from '../services/item';

const itemRouter = express.Router();

itemRouter.get(
  '/',
  customValidate({
    query: Joi.object({
      sortBy: Joi.string().optional(),
      sortOrder: Joi.string().optional(),
      itemsPerPage: Joi.number().optional(),
      page: Joi.number().optional(),
      collectionId: Joi.number().integer().optional()
    })
  }),
  async (req, res, next) => {
    const items = await getItems(req.query);
    if (items instanceof Error) {
      next(items);
    } else {
      res.status(200).json(items);
    }
  }
);

itemRouter.get(
  '/:id',
  customValidate({
    params: Joi.object({
      id: Joi.number().integer()
    })
  }),
  handleEntityNotExist((req) => getItem(+req.params.id!)),
  async (req, res) => {
    res.status(200).json(await getItem(+req.params.id!));
  }
);

itemRouter.post(
  '/',
  customExpressJwt(),
  customValidate({
    body: Joi.object({
      name: Joi.string(),
      tagNames: Joi.array().items(Joi.string()).optional(),
      collectionId: Joi.number().integer()
    })
  }),
  handleEntityNotExist(
    (req: Request) => isCollectionBelongsToUser(req.body.collectionId, req.auth?.userId)
  ),
  canActivate(
    (req) => isCollectionBelongsToUser(req.body.collectionId, req.auth?.userId)
  ),
  async (req, res) => {
    if (!req.body.tagNames) {
      req.body.tagNames = [];
    }
    res.json(await createItem(req.body));
  }
);

itemRouter.patch(
  '/:id',
  customExpressJwt(),
  customValidate({
    body: Joi.object({
      name: Joi.string().optional(),
      tagNames: Joi.array().items(Joi.string()).optional()
    }),
    params: Joi.object({
      id: Joi.number().integer()
    })
  }),
  handleEntityNotExist((req) => getItem(+req.params.id!)),
  canActivate((req) => isItemBelongsToUser(+req.params.id!, req.auth?.userId)),
  async (req, res) => {
    res.status(200).json(await updateItem({
      id: +req.params.id!,
      ...req.body
    }));
  }
);

itemRouter.delete(
  '/:id',
  customExpressJwt(),
  customValidate({
    params: Joi.object({
      id: Joi.number().integer()
    })
  }),
  handleEntityNotExist((req) => getItem(+req.params.id!)),
  canActivate((req) => isItemBelongsToUser(+req.params.id!, req.auth?.userId)),
  async (req, res) => {
    await deleteItem(+req.params.id!)
    res.status(200).send();
  }
);

export default itemRouter;
