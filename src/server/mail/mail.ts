import { Router } from 'express';

import { contactForm } from './mail.controller';

const router = Router();

// -----------Routes-------------------

router.post('/contact-form', contactForm);

export { router as mail };
