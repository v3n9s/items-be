import { ErrorRequestHandler } from 'express';
import { UnauthorizedError } from 'express-jwt';

export const unauthorizedErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof UnauthorizedError) {
    res.status(err.status).send(err.message);
  } else {
    next(err);
  }
}
