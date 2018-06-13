import { json, urlencoded } from 'body-parser';
import * as compression from 'compression';
import * as express from 'express';
import './database/connection';
import { content } from './routes/content/content.routes';
import { mail } from './routes/mail/mail.routes';
import { users } from './routes/users/users.routes';
import { clearCacheDirs } from './services/cache-control.service';
import { errorHandler } from './services/error-handler.service';
import { appRoot } from './services/server.service';

export const app = express();

clearCacheDirs();

// Middleware
app.use(compression());
app.use(express.static(appRoot + 'dist/client'));
app.use(urlencoded({ extended: false }));
app.use(json());

// -----------------Routes--------------------

app.use('/mail', mail);
app.use('/users', users);
app.use('/content', content);

app.get('*', (_req, res, next) => {
  res.sendFile(appRoot + 'dist/client/index.html', (error: Error) => {
    if (error) { next({ status: 500, message: 'Whoops cannot load the app for some reason' }); }
  });
});

// Handle errors
app.use(errorHandler);

// Start server
const port = process.env.PORT || 8080;
app.listen(port);
console.log(`Listening to port ${port}`);
