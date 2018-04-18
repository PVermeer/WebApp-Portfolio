import { Request, Response, NextFunction } from 'express';
import { ErrorMessage } from '../types/types';

export function errorHandler(err: ErrorMessage, _req: Request, res: Response, _next: NextFunction) {
  let error = err;

  if (err.stack) { error = { message: err.message, status: 500 }; }

  if (!error.status) { error.status = 500; }

  return res.status(error.status).send(error);
}
