import { ErrorRequestHandler } from 'express';
import { expressjwt, UnauthorizedError, IsRevoked } from 'express-jwt';
import config from '../config';
import { isSessionExist } from '../services/auth';

const isRevoked: IsRevoked = async (req, token) => {
  if (!token || typeof token.payload === 'string') {
    return false;
  }
  return !(await isSessionExist(token?.payload.sessionId));
}

export const customExpressJwt = (
  options?: Partial<Parameters<typeof expressjwt>['0']>
) => {
  return expressjwt({
    algorithms: ['HS256'],
    secret: config.JWT_ACCESS_SECRET_KEY,
    isRevoked,
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
