import * as express from 'express';
import * as compression from 'compression';
import { join } from 'path';

import './database/connection';
import { errorHandler } from './services/error-handler.service';
import { mail } from './routes/mail/mail.routes';
import { users } from './routes/users/users.routes';
import { content } from './routes/content/content.routes';
import { startUpServer } from './services/server.service';

startUpServer();

export const app = express();

// Middleware
app.use(compression());
app.use(express.static(join(__dirname, '../../dist/client')));
app.use(express.static(join(__dirname, '../../node_modules/material-design-icons')));

// -----------------Routes--------------------

app.use('/mail', mail);
app.use('/users', users);
app.use('/content', content);

app.get('*', (_req, res, next) => {
  res.sendFile(join(__dirname, '../../dist/client/index.html'), (error: Error) => {
    if (error) { next({ status: 500, message: 'Whoops cannot load the app for some reason' }); }
  });
});

// Handle errors
app.use(errorHandler);

// Start server
const port = process.env.PORT || 8080;
app.on('ready', () => {
  app.listen(port);
  console.log(`Listening to port ${port}`);
});
