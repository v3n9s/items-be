import { RequestHandler } from 'express';
import { Request } from 'express-jwt';

type CanActivateFunc = (req: Request) => boolean | Promise<boolean>

const canActivate = (...funcs: CanActivateFunc[]) => {
  return (async (req: Request, res, next) => {
    if ((await Promise.all(funcs.map((func) => func(req)))).every(Boolean)) {
      next();
    } else {
      res.status(403).send('You don\'t have rights to access this route');
    }
  }) as RequestHandler;
}

export default canActivate;
