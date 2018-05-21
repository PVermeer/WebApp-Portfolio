import { Router } from 'express';
import { urlencoded, json } from 'body-parser';

import { contactForm } from './mail.controller';
import { cacheJson } from '../../services/cache-control.service';

const router = Router();

// Middleware
router.use(urlencoded({ extended: false }));
router.use(json());


// -----------Routes-------------------

router.post('/contact-form', cacheJson, contactForm);

export { router as mail };
