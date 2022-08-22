import express from 'express';
import { Request } from 'express-jwt';
import { Joi } from 'express-validation';
import canActivate from '../middlewares/can-activate';
import { customExpressJwt } from '../middlewares/express-jwt';
import { handleEntityNotExist } from '../middlewares/handle-entity-not-exist';
import { customValidate } from '../middlewares/validation';
import { createComment, deleteComment, getComment, getComments, isCommentBelongsToUser } from '../services/comment';
import { getItem, isItemBelongsToUser } from '../services/item';

const commentRouter = express.Router();

commentRouter.get(
  '/',
  customValidate({
    query: Joi.object({
      itemId: Joi.number().integer()
    })
  }),
  handleEntityNotExist((req) => getItem(+req.query.itemId!)),
  async (req, res) => {
    res.status(200).json(await getComments({ itemId: +req.query.itemId!}));
  }
);

commentRouter.post(
  '/',
  customExpressJwt(),
  customValidate({
    body: Joi.object({
      message: Joi.string(),
      itemId: Joi.number().integer()
    })
  }),
  handleEntityNotExist((req) => getItem(req.body.itemId)),
  canActivate((req) => isItemBelongsToUser(req.body.itemId, req.auth?.userId)),
  async (req: Request, res) => {
    res.status(200).json(await createComment({
      ...req.body,
      userId: req.auth?.userId,
      createDate: new Date()
    }));
  }
);

commentRouter.delete(
  '/:id',
  customExpressJwt(),
  customValidate({
    params: Joi.object({
      id: Joi.number().integer()
    })
  }),
  handleEntityNotExist((req) => getComment(+req.params.id!)),
  canActivate((req) => isCommentBelongsToUser(+req.params.id!, req.auth?.userId)),
  async (req, res) => {
    await deleteComment(+req.params.id!);
    res.status(200).send();
  }
);

export default commentRouter;
