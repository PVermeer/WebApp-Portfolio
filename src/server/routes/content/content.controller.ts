import * as contentService from './content.service';
import { NextFunction, Request, Response } from 'express';

export function contentPageNew(req: Request, res: Response, next: NextFunction): void {
  contentService.contentPageNew(req)
    .then(result => res.json(result))
    .catch(error => next(error));
}
export function contentPageUpdate(req: Request, res: Response, next: NextFunction): void {
  contentService.contentPageUpdate(req)
    .then(result => res.json(result))
    .catch(error => next(error));
}
export function contentPageDelete(req: Request, res: Response, next: NextFunction): void {
  contentService.contentPageDelete(req)
    .then(result => res.json(result))
    .catch(error => next(error));
}
export function contentPageGetAll(_req: Request, res: Response, next: NextFunction): void {
  contentService.contentPageGetAll()
    .then(result => res.json(result))
    .catch(error => next(error));
}
export function getImage(req: Request, res: Response, next: NextFunction): void {
  contentService.getImage(req, res)
    .catch(error => next(error));
}
export function getPage(req: Request, res: Response, next: NextFunction): void {
  contentService.getPage(req)
    .then(result => res.json(result))
    .catch(error => next(error));
}
