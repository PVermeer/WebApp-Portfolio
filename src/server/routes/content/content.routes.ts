import { Router } from 'express';
import { dbConnectionError, upload } from '../../database/connection';
import { userTypes } from '../../database/models/users/user.schema';
import { cacheJson, clearCache } from '../../services/cache-control.service';
import { requiresUserAuth } from '../users/users.authentication';
import { contentPageDelete, contentPageGetAll, contentPageNew, contentPageUpdate, getFile, getPage } from './content.controller';

const router = Router();

// Middleware
router.use(dbConnectionError);

// -----------Routes-------------------

// No authentication
router.get('/page', cacheJson, getPage);
router.get('/image', getFile); // Separation for client cache support (images may be cached, files may not)
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
router.post('/newpage', requiresUserAuth(401, userTypes.developer), clearCache, contentPageNew);
router.delete('/deletepage/:_id', requiresUserAuth(401, userTypes.developer), clearCache, contentPageDelete);

// Catch all
router.use('*', (_req, res) => res.status(403).send('Content: What are you asking for?'));

export { router as content };
