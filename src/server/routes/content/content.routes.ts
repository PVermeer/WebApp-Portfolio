import { Router } from 'express';

import { DbConnectionError, upload } from '../../database/connection';
// import { requiresUserAuth } from '../users/users.authentication';
// import { userTypes } from '../database/models/users/user.schema';
import { contentPageUpdate, contentPageGetAll, getImage, contentPageNew, contentPageDelete, getPage } from './content.controller';
import { urlencoded, json } from 'body-parser';

const router = Router();

// Middleware
router.use(DbConnectionError);
router.use(urlencoded({ extended: false }));
router.use(json());

// router.use(requiresUserAuth(401, userTypes.admin));
// router.use(upload.single());

// -----------Routes-------------------

router.get('/page', getPage);

router.post('/newpage', contentPageNew);
router.post('/updatepage', upload.array('images'), contentPageUpdate);
router.delete('/deletepage/:_id', contentPageDelete);
router.get('/getpages', contentPageGetAll);
router.get('/image', getImage);

// Catch all
router.use('*', (_req, res) => res.status(403).send('Content: What are you asking for?'));

export { router as content };
