import { ErrorRequestHandler } from 'express';
import { ValidationError } from 'express-validation';

export const validationErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    res.status(err.statusCode).json(err);
  } else {
    next(err);
  }
}
