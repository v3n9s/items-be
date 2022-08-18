import { ErrorRequestHandler } from 'express';
import { STATUS_CODES } from 'http';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err.statusCode in STATUS_CODES) {
    res.status(err.statusCode);
  } else {
    res.status(500);
  }
  res.send(err.message);
}

export default errorHandler;
