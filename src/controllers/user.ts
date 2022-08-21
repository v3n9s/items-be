import express from 'express';
import { Joi } from 'express-validation';
import { handleEntityNotExist } from '../middlewares/handle-entity-not-exist';
import { customValidate } from '../middlewares/validation';
import { getUser, getUsers } from '../services/user';

const userRouter = express.Router();

userRouter.get('/', async (req, res) => {
  res.status(200).json(await getUsers());
});

userRouter.get(
  '/:id',
  customValidate({
    params: Joi.object({
      id: Joi.number().integer()
    })
  }),
  handleEntityNotExist((req) => getUser(+req.params.id!)),
  async (req, res) => {
    const { password, ...safeUser } = (await getUser(+req.params.id!))!;
    res.status(200).json(safeUser);
});

export default userRouter;
