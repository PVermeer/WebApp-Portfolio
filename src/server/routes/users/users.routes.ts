import { Router } from 'express';
import { dbConnectionError } from '../../database/connection';
import { userTypes } from '../../database/models/users/user.schema';
import { disableCache } from '../../services/cache-control.service';
import { requiresUserAuth } from './users.authentication';
import { checkDuplicate, logIn, loginCheck, makeAdminMany, makeUserMany, mockUser, passwordRecovery, registerUser, resendEmailVerification, updateEmail, updatePassword, userBlockMany, userDelete, userDeleteMany, userGetAll, userInfo, userMany, userUnblockMany, userUpdate, verifyEmail } from './users.controller';

const router = Router();

// Middleware
router.use(disableCache);
router.use(dbConnectionError);

// -----------Routes-------------------

// No authentication
router.post('/login', logIn);
router.post('/register', registerUser);
router.get('/check', checkDuplicate);
router.get('/verify', verifyEmail);
router.post('/recoverpassword', passwordRecovery);
router.put('/updatepassword', updatePassword);
router.put('/updateemail', updateEmail);
router.post('/resendverification', resendEmailVerification);

// User authentication (authenticates then adds "userId" and "userType" keys to request)
router.get('/logincheck', requiresUserAuth(200, userTypes.user), loginCheck);

// User
router.get('/info', requiresUserAuth(401, userTypes.user), userInfo);
router.put('/update', requiresUserAuth(401, userTypes.user), userUpdate);
router.delete('/delete/:id', requiresUserAuth(401, userTypes.user), userDelete);

// Admin
router.get('/getall', requiresUserAuth(401, userTypes.admin), userGetAll);
router.post('/many', requiresUserAuth(401, userTypes.admin), userMany);
router.delete('/deletemany/:id', requiresUserAuth(401, userTypes.admin), userDeleteMany);
router.put('/blockmany/:id', requiresUserAuth(401, userTypes.admin), userBlockMany);
router.put('/unblockmany/:id', requiresUserAuth(401, userTypes.admin), userUnblockMany);

// SuperAdmin
router.put('/makeadminmany/:id', requiresUserAuth(401, userTypes.superAdmin), makeAdminMany);
router.put('/makeusermany/:id', requiresUserAuth(401, userTypes.superAdmin), makeUserMany);

// Developer
router.post('/registermock', requiresUserAuth(401, userTypes.developer), mockUser);

// Catch all
router.use('*', (_req, res) => res.status(403).send('Users: What are you asking for?'));

export { router as users };
