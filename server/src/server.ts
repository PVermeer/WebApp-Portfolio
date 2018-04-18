import express from 'express';
import compression from 'compression';
import { join } from 'path';
import { json, urlencoded } from 'body-parser';

import './database/connection';
import { mail } from './mail/mail';
import { users } from './users/users.routes';
import { errorHandler } from './services/error-handler';

const app = express();

// Middleware
app.use(compression());
app.use(express.static(join(__dirname, '../../client/dist')));
app.use(urlencoded({ extended: false }));
app.use(json());

// -----------------Routes--------------------

app.use('/mail', mail);
app.use('/users', users);

app.get('*', (_req, res, next) => {
  res.sendFile(join(__dirname, '../../client/dist/index.html'), (error: Error) => {
    if (error) next({ status: 500, message: 'Whoops cannot load the app for some reason' });
  });
});

// Handle errors
app.use(errorHandler);

// Start server
const port = process.env.PORT || 8080;
app.listen(port);

// tslint:disable-next-line:no-console
console.log(`Listening to port ${port}`);
