import { ErrorRequestHandler } from 'express';
import { validate, ValidationError } from 'express-validation';

export const customValidate: typeof validate = (schema, options, joiRoot) => {
  return validate(schema, {
    context: true,
    keyByField: true,
    ...options
  }, {
    abortEarly: false,
    presence: 'required',
    ...joiRoot
  });
}

export const validationErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    res.status(err.statusCode).json(err.details);
  } else {
    next(err);
  }
}
