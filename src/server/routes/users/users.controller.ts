import * as userService from './users.service';
import { NextFunction, Request, Response } from 'express';

export function checkDuplicate(req: Request, res: Response, next: NextFunction): void {
  userService.checkDuplicate(req)
    .then(result => res.json(result))
    .catch(error => next(error));
}
export function logIn(req: Request, res: Response, next: NextFunction): void {
  userService.logIn(req, res)
    .then(result => res.json(result))
    .catch(error => next(error));
}
export function loginCheck(_req: Request, res: Response, next: NextFunction): void {
  userService.loginCheck()
  .then(result => res.json(result))
  .catch(error => next(error));
}
export function userUpdate(req: Request, res: Response, next: NextFunction): void {
  userService.userUpdate(req)
    .then(result => res.json(result))
    .catch(error => next(error));
}
export function passwordRecovery(req: Request, res: Response, next: NextFunction): void {
  userService.passwordRecovery(req)
    .then(result => res.json(result))
    .catch(error => next(error));
}
export function updatePassword(req: Request, res: Response, next: NextFunction): void {
  userService.updatePassword(req)
    .then(result => res.json(result))
    .catch(error => next(error));
}
export function updateEmail(req: Request, res: Response, next: NextFunction): void {
  userService.updateEmail(req)
    .then(result => res.json(result))
    .catch(error => next(error));
}
export function registerUser(req: Request, res: Response, next: NextFunction): void {
  userService.registerUser(req)
    .then(result => res.json(result))
    .catch(error => next(error));
}
export function verifyEmail(req: Request, res: Response, next: NextFunction): void {
  userService.verifyEmail(req)
    .then(result => res.json(result))
    .catch(error => next(error));
}
export function userInfo(req: Request, res: Response, next: NextFunction): void {
  userService.userInfo(req)
    .then(result => res.json(result))
    .catch(error => next(error));
}
export function userDelete(req: Request, res: Response, next: NextFunction): void {
  userService.userDelete(req)
    .then(result => res.json(result))
    .catch(error => next(error));
}
export function userMany(req: Request, res: Response, next: NextFunction): void {
  userService.userMany(req)
    .then(result => res.json(result))
    .catch(error => next(error));
}
export function userDeleteMany(req: Request, res: Response, next: NextFunction): void {
  userService.userDeleteMany(req)
    .then(result => res.json(result))
    .catch(error => next(error));
}
export function userGetAll(req: Request, res: Response, next: NextFunction): void {
  userService.userGetAll(req)
    .then(result => res.json(result))
    .catch(error => next(error));
}
export function mockUser(req: Request, res: Response, next: NextFunction): void {
  userService.mockUser(req)
    .then(result => res.json(result))
    .catch(error => next(error));
}
export function userBlockMany(req: Request, res: Response, next: NextFunction): void {
  userService.userBlockMany(req)
    .then(result => res.json(result))
    .catch(error => next(error));
}
export function userUnblockMany(req: Request, res: Response, next: NextFunction): void {
  userService.userUnblockMany(req)
    .then(result => res.json(result))
    .catch(error => next(error));
}
export function resendEmailVerification(req: Request, res: Response, next: NextFunction): void {
  userService.resendEmailVerification(req)
    .then(result => res.json(result))
    .catch(error => next(error));
}
export function makeAdminMany(req: Request, res: Response, next: NextFunction): void {
  userService.makeAdminMany(req)
    .then(result => res.json(result))
    .catch(error => next(error));
}
export function makeUserMany(req: Request, res: Response, next: NextFunction): void {
  userService.makeUserMany(req)
    .then(result => res.json(result))
    .catch(error => next(error));
}
