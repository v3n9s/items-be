import express from 'express';
import { Request } from 'express-jwt';
import { Joi } from 'express-validation';
import config from '../config';
import { customValidate } from '../middlewares/validation';
import { customExpressJwt } from '../middlewares/express-jwt';
import { deleteSession, loginUser, refreshUserTokens, registerUser } from '../services/auth';
import { handleEntityNotExist } from '../middlewares/handle-entity-not-exist';
import { getUser } from '../services/user';

const authRouter = express.Router();

authRouter.post('/register', customValidate({
  body: Joi.object({
    name: Joi.string(),
    password: Joi.string()
  })
}), async (req, res) => {
  const user = await registerUser(req.body.name, req.body.password);
  res.status(user ? 201 : 409).send();
});

authRouter.post('/login', customValidate({
  body: Joi.object({
    name: Joi.string(),
    password: Joi.string()
  })
}), async (req, res) => {
  const tokens = await loginUser(req.body.name, req.body.password);
  if (tokens) {
    res.status(201).json(tokens);
  } else {
    res.status(404).send();
  }
});

authRouter.post('/refresh', customValidate({
  body: Joi.object({
    refreshToken: Joi.string()
  })
}), customExpressJwt({
  secret: config.JWT_REFRESH_SECRET_KEY,
  getToken: (req) => req.body.refreshToken
}), async (req: Request, res) => {
  if (req.auth && req.auth.userId && req.auth.sessionId) {
    const tokens = await refreshUserTokens(req.auth.userId, req.auth.sessionId);
    if (tokens) {
      res.status(201).json(tokens);
    } else {
      res.status(404).send();
    }
  } else {
    res.status(400).send();
  }
});

authRouter.delete(
  '/logout',
  customExpressJwt(),
  async (req: Request, res) => {
    const isDeleted = await deleteSession(req.auth?.sessionId);
    res.status(isDeleted ? 200 : 404).send();
  }
);

authRouter.get(
  '/user',
  customExpressJwt(),
  handleEntityNotExist((req: Request) => getUser({ id: req.auth?.userId })),
  async (req: Request, res) => {
    res.status(200).json(await getUser({ id: req.auth?.userId})!);
  }
);

export default authRouter;
