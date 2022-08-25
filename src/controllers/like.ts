import express from 'express';
import { Request } from 'express-jwt';
import { Joi } from 'express-validation';
import { customExpressJwt } from '../middlewares/express-jwt';
import { handleEntityNotExist } from '../middlewares/handle-entity-not-exist';
import { customValidate } from '../middlewares/validation';
import { getItem } from '../services/item';
import { createLike, deleteLike, getLike, getLikes } from '../services/like';

const likeRouter = express.Router();

likeRouter.get(
  '/',
  customValidate({
    query: Joi.object({
      itemId: Joi.number().integer()
    })
  }),
  async (req, res) => {
    res.status(200).json(await getLikes({
      item: {
        id: +req.query.itemId!
      }
    }))
  }
);

likeRouter.post(
  '/',
  customExpressJwt(),
  customValidate({
    body: Joi.object({
      itemId: Joi.number().integer()
    })
  }),
  handleEntityNotExist((req) => getItem(req.body.itemId)),
  async (req: Request, res) => {
    const existingLike = await getLike({
      item: { id: req.body.itemId },
      user: { id: req.auth?.userId }
    });
    if (existingLike) {
      res.status(409).send();
    } else {
      res.status(201).json(await createLike({
        itemId: req.body.itemId,
        userId: req.auth?.userId
      }));
    }
  }
);

likeRouter.delete(
  '/',
  customExpressJwt(),
  customValidate({
    query: Joi.object({
      itemId: Joi.number().integer()
    })
  }),
  handleEntityNotExist((req: Request) => getLike({
    item: { id: +req.query.itemId! },
    user: { id: req.auth?.userId }
  })),
  async (req: Request, res) => {
    await deleteLike({
      item: { id: +req.query.itemId! },
      user: { id: req.auth?.userId }
    });
    res.status(200).send();
  }
);

export default likeRouter;
