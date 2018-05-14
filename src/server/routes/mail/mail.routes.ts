import { Router } from 'express';
import { urlencoded, json } from 'body-parser';

import { contactForm } from './mail.controller';

const router = Router();

// Middleware
router.use(urlencoded({ extended: false }));
router.use(json());


// -----------Routes-------------------

router.post('/contact-form', contactForm);

export { router as mail };
