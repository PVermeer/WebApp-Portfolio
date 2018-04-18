import { Request, Response, NextFunction } from 'express';

export function disableCache(_req: Request, res: Response, next: NextFunction) {

  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate'); // HTTP 1.1.
  res.setHeader('Pragma', 'no-cache'); // HTTP 1.0.
  res.setHeader('Expires', '0'); // Proxies.

  return next();
}
