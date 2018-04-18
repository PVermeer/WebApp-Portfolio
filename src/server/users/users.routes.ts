import { Router } from 'express';

import {
  checkDuplicate, logIn, loginCheck, mockUser, passwordRecovery, registerUser, updatePassword,
  userDelete, userDeleteMany, userGetAll, userInfo, userMany, userResetPasswordMany,
  userUpdate, verifyEmail
} from './users.controller';
import { requiresUserAuth } from './users.authentication';
import { disableCache } from '../services/cache-control';
import { DbConnectionError } from '../database/connection';
import { userTypes } from '../database/models/user';

const router = Router();

// Middleware
router.use(disableCache);
router.use(DbConnectionError);

// -----------Routes-------------------

// No authentication
router.post('/login', logIn);
router.post('/register', registerUser);
router.get('/check', checkDuplicate);
router.get('/verify', verifyEmail);
router.post('/recoverpassword', passwordRecovery);
router.put('/updatepassword', updatePassword);

// User authentication (authenticates then adds "userId" and "userType" keys to request)
router.get('/logincheck', requiresUserAuth(403, userTypes.user), loginCheck);

// User
router.get('/info', requiresUserAuth(401, userTypes.user), userInfo);
router.put('/update', requiresUserAuth(401, userTypes.user), userUpdate);
router.delete('/delete/:id', requiresUserAuth(401, userTypes.user), userDelete); // Still used?

// Admin
router.get('/getall', requiresUserAuth(401, userTypes.admin), userGetAll);
router.post('/many', requiresUserAuth(401, userTypes.admin), userMany);
router.delete('/deletemany/:id', requiresUserAuth(401, userTypes.admin), userDeleteMany);
router.post('/resetpasswordmany/:id', requiresUserAuth(401, userTypes.admin), userResetPasswordMany);
router.post('/registermock', requiresUserAuth(401, userTypes.admin), mockUser);

// Catch all
router.use('*', (_req, res) => res.status(403).send('What are you asking for?'));

export { router as users };
