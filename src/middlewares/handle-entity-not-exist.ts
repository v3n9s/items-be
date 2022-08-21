import { Request, RequestHandler } from 'express';

type IsEntityExistFunc = (req: Request) => Promise<any>;

export const handleEntityNotExist = (
  isEntityExistFunc: IsEntityExistFunc,
  message: string = 'There is no entity to meet your request'
) => {
  return (async (req, res, next) => {
    if (await isEntityExistFunc(req)) {
      next();
    } else {
      res.status(404).send(message);
    }
  }) as RequestHandler;
}
