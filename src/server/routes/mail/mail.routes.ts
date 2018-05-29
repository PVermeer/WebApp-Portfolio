import { Router } from 'express';

import { contactForm } from './mail.controller';

const router = Router();

// Middleware

// -----------Routes-------------------

router.post('/contact-form', contactForm);

export { router as mail };
