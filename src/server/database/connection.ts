import { connect, connection } from 'mongoose';
import { NextFunction, Request, Response } from 'express';
import * as multer from 'multer';
import { diskStorage } from 'multer';
import { GridFSBucket } from 'mongodb';

import { config, appRoot } from '../services/server.service';
import { ErrorMessage } from '../types/types';
import { app } from '../server';

// ---------------- Mongoose connection ---------------

let connectionFlag = false;
const options = {
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 2000, // Reconnect every 2s
  bufferMaxEntries: 0
};

const error: ErrorMessage = { status: 503, message: 'Database is not up' };

const connectWithRetry = () => {
  connect(config.mongoDb, options).then(
    () => {
      connectionFlag = true;
    }, err => {
      connectionFlag = false;
      console.log(`\nWhoops, cannot connect to MongoDb at server start:\n\n${err}\n\nWill try again in 5 seconds!\n`);
      setTimeout(() => {
        connectWithRetry();
      }, 5000);
    }
  );
};
connectWithRetry();

connection.on('open', () => {
  connectionFlag = true;
  console.log('Mongoose default connection open');
  app.emit('ready');
});

connection.on('error', err => {
  connectionFlag = false;
  console.log(`Mongoose default connection error: ${err}`);
});

connection.on('disconnected', () => {
  connectionFlag = false;
  console.log('Mongoose default connection disconnected');
});

process.on('SIGINT', () => {
  connection.close(() => {
    connectionFlag = false;
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

// Connection middleware
export function DbConnectionError(_req: Request, res: Response, next: NextFunction): void | Response {

  if (!connectionFlag) { return res.status(error.status).send(error); }

  return next();
}

// ---------------- GridFs connection ---------------------

export let gridFsBucket: GridFSBucket;
connection.once('connected', () => {
  gridFsBucket = new GridFSBucket(connection.db, { bucketName: 'content' });
  console.log('GridFsBucket connection open');
});

export const upload = multer({
  storage: diskStorage({
    destination: appRoot + config.uploadDir,
    filename: (_req, file, cb) => cb(null, file.originalname)
  })
});
