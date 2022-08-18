import express from 'express';
import { Joi } from 'express-validation';
import canActivate from '../middlewares/can-activate';
import { customExpressJwt } from '../middlewares/express-jwt';
import { customValidate } from '../middlewares/validation';
import {
  isCollectionBelongsToUser,
  createCollection,
  deleteCollection,
  getCollection,
  getCollections,
  isCollectionExists,
  updateCollection
} from '../services/collection';

const collectionRouter = express.Router();

collectionRouter.get('/', customValidate({
  query: Joi.object({
    userId: Joi.number().integer()
  })
}), async (req, res) => {
  const collections = await getCollections(+req.query.userId!);
  res.status(200).json(collections);
});

collectionRouter.get('/:id', customValidate({
  params: Joi.object({
    id: Joi.number().integer()
  })
}), async (req, res) => {
  const collection = await getCollection(+req.params.id!);
  if (collection) {
    res.status(200).json(collection);
  } else {
    res.status(404).send();
  }
});

collectionRouter.post(
  '/',
  customExpressJwt(),
  customValidate({
    body: Joi.object({
      name: Joi.string(),
      description: Joi.string(),
      userId: Joi.number().integer()
    })
  }),
  canActivate((req) => req.body.userId === req.auth?.userId),
  async (req, res) => {
    const collection = await createCollection(req.body);
    if (collection) {
      res.status(201).json(collection);
    } else {
      res.status(404).send(`There is no user with id ${req.body.userId}`);
    }
});

collectionRouter.patch(
  '/:id',
  customExpressJwt(),
  customValidate({
    body: Joi.object({
      name: Joi.string(),
      description: Joi.string()
    }),
    params: Joi.object({
      id: Joi.number().integer()
    })
  }),
  canActivate(
    async (req) => await isCollectionBelongsToUser(+req.params.id!, req.auth!.userId)
      || !await isCollectionExists(+req.params.id!)
  ),
  async (req, res) => {
    const collection = await updateCollection({ id: +req.params.id!, ...req.body });
    if (collection) {
      res.status(200).json(collection);
    } else {
      res.status(404).send();
    }
});

collectionRouter.delete(
  '/:id',
  customExpressJwt(),
  customValidate({
    params: Joi.object({
      id: Joi.number().integer()
    })
  }),
  canActivate(
    async (req) => await isCollectionBelongsToUser(+req.params.id!, req.auth!.userId)
      || !await isCollectionExists(+req.params.id!)
  ),
  async (req, res) => {
    res.status(await deleteCollection(+req.params.id!) ? 200 : 404).send();
});

export default collectionRouter;
