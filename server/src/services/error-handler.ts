import { Request, Response, NextFunction } from "express";

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  let error = err;

  if (err.stack) error = { message: err.message };

  if (!error.status) error.status = 500;

  return res.status(error.status).send(error);
}
