import { connect, connection } from 'mongoose';
import { NextFunction, Request, Response } from 'express';
import * as multer from 'multer';
import { diskStorage } from 'multer';

import { config } from '../services/server.service';
import { ErrorMessage } from '../types/types';
import { GridFSBucket } from 'mongodb';

// ---------------- Mongoose connection ---------------

let connectionFlag = true;
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
      console.log('Mongoose default connection ready to use.');
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

connection.on('connected', () => {
  connectionFlag = true;
  console.log('Mongoose default connection open');
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

export function DbConnectionError(_req: Request, res: Response, next: NextFunction): void | Response {

  if (!connectionFlag) { return res.status(error.status).send(error); }

  return next();
}

// ---------------- GridFs connection ---------------------

export let gridFsBucket: GridFSBucket;
connection.once('open', () => {
  gridFsBucket = new GridFSBucket(connection.db, { bucketName: 'content' });
  console.log('GridFsBucket connection open');
});

export const upload = multer({
  storage: diskStorage({
    destination: './_temp/content-uploads',
    filename: (_req, file, cb) => {
      cb(null, file.originalname);
    }
  })
});
