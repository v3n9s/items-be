import express from 'express';
import { Joi } from 'express-validation';
import { customValidate } from '../middlewares/validation';
import { getUser, getUsers } from '../services/user';

const userRouter = express.Router();

userRouter.get('/', async (req, res) => {
  res.status(200).json(await getUsers());
});

userRouter.get('/:id', customValidate({
  params: Joi.object({
    id: Joi.number().integer()
  })
}), async (req, res) => {
  const user = await getUser(+req.params.id!);
  if (user) {
    const { password, ...safeUser } = user;
    res.status(200).json(safeUser);
  } else {
    res.status(404).send();
  }
});

export default userRouter;
