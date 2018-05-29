import { Router } from 'express';
import { DbConnectionError, upload } from '../../database/connection';
import { userTypes } from '../../database/models/users/user.schema';
import { cacheJson, clearCache } from '../../services/cache-control.service';
import { requiresUserAuth } from '../users/users.authentication';
// import { requiresUserAuth } from '../users/users.authentication';
// import { userTypes } from '../database/models/users/user.schema';
import { contentPageDelete, contentPageGetAll, contentPageNew, contentPageUpdate, getFile, getPage } from './content.controller';

const router = Router();

// Middleware
router.use(DbConnectionError);

// -----------Routes-------------------

// No authentication
router.get('/page', cacheJson, getPage);
router.get('/file', getFile);

// Admin authentication
router.get('/getpages', requiresUserAuth(401, userTypes.admin), contentPageGetAll);
router.post('/updatepage',
  requiresUserAuth(401, userTypes.admin),
  clearCache,
  upload.fields([{ name: 'images' }, { name: 'files' }]),
  contentPageUpdate
);

// Developer authentication
router.post('/newpage', requiresUserAuth(401, userTypes.developer), contentPageNew);
router.delete('/deletepage/:_id', requiresUserAuth(401, userTypes.developer), clearCache, contentPageDelete);

// Catch all
router.use('*', (_req, res) => res.status(403).send('Content: What are you asking for?'));

export { router as content };
