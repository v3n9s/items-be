import { Handler } from 'express';

export const notFoundHandler: Handler = (req, res, next) => {
  res.status(404).send();
}
