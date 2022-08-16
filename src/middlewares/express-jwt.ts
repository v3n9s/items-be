import { ErrorRequestHandler } from 'express';
import { expressjwt, UnauthorizedError } from 'express-jwt';
import config from '../config';

export const customExpressJwt = (
  options?: Partial<Parameters<typeof expressjwt>['0']>
) => {
  return expressjwt({
    algorithms: ['HS256'],
    secret: config.JWT_ACCESS_SECRET_KEY,
    ...options
  });
}

export const unauthorizedErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof UnauthorizedError) {
    res.status(err.status).send(err.message);
  } else {
    next(err);
  }
}
