import { connect, connection } from 'mongoose';
import { mongoDb } from '../config';
import { NextFunction, Request, Response } from 'express';
import { ErrorMessage } from '../types/types';

let connectionFlag = true;
const options = {
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 2000, // Reconnect every 2s
  bufferMaxEntries: 0
};

const error: ErrorMessage = { status: 503, message: 'Database is not up' };

// tslint:disable no-console

const connectWithRetry = () => {
  connect(mongoDb, options).then(
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
