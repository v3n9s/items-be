import express from 'express';
import { Request } from 'express-jwt';
import { Joi } from 'express-validation';
import canActivate from '../middlewares/can-activate';
import { customExpressJwt } from '../middlewares/express-jwt';
import { handleEntityNotExist } from '../middlewares/handle-entity-not-exist';
import { customValidate } from '../middlewares/validation';
import {
  isCollectionBelongsToUser,
  createCollection,
  deleteCollection,
  getCollection,
  getCollections,
  updateCollection
} from '../services/collection';

const collectionRouter = express.Router();

collectionRouter.get(
  '/',
  customValidate({
    query: Joi.object({
      userId: Joi.number().integer()
    })
  }), async (req, res) => {
    const collections = await getCollections(+req.query.userId!);
    res.status(200).json(collections);
});

collectionRouter.get(
  '/:id',
  customValidate({
    params: Joi.object({
      id: Joi.number().integer()
    })
  }),
  handleEntityNotExist((req) => getCollection(+req.params.id!)),
  async (req, res) => {
    const collection = (await getCollection(+req.params.id!))!;
    res.status(200).json(collection);
});

collectionRouter.post(
  '/',
  customExpressJwt(),
  customValidate({
    body: Joi.object({
      name: Joi.string(),
      description: Joi.string()
    })
  }),
  async (req: Request, res) => {
    const collection = (await createCollection({
      name: req.body.name,
      description: req.body.description,
      userId: req.auth?.userId
    }))!;
    res.status(201).json(collection);
});

collectionRouter.patch(
  '/:id',
  customExpressJwt(),
  customValidate({
    body: Joi.object({
      name: Joi.string().optional(),
      description: Joi.string().optional()
    }),
    params: Joi.object({
      id: Joi.number().integer()
    })
  }),
  handleEntityNotExist((req) => getCollection(+req.params.id!)),
  canActivate((req) => isCollectionBelongsToUser(+req.params.id!, req.auth!.userId)),
  async (req, res) => {
    const collection = (await updateCollection({ id: +req.params.id!, ...req.body }))!;
    res.status(200).json(collection);
});

collectionRouter.delete(
  '/:id',
  customExpressJwt(),
  customValidate({
    params: Joi.object({
      id: Joi.number().integer()
    })
  }),
  handleEntityNotExist((req) => getCollection(+req.params.id!)),
  canActivate((req) => isCollectionBelongsToUser(+req.params.id!, req.auth!.userId)),
  async (req, res) => {
    await deleteCollection(+req.params.id!)
    res.status(200).send();
});

export default collectionRouter;
