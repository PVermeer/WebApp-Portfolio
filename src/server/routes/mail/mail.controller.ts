import * as mailService from './mail.service';
import { Request, Response, NextFunction } from 'express';

export function contactForm(req: Request, res: Response, next: NextFunction): void {
  mailService.contactForm(req)
    .then(result => res.json(result))
    .catch(error => next(error));
}
