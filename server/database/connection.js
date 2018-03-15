const mongoose = require('mongoose');

const config = require('../config');

const options = {
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
};

/* eslint-disable no-console */

const connectWithRetry = () => {
  mongoose.connect(config.mongoDb, options).then(
    () => { console.log('Mongoose default connection ready to use.'); },
    (error) => {
      console.log(`\nWhoops, cannot connect to MongoDb at server start:\n\n${error}\n\nWill try again in 5 seconds!\n`);
      setTimeout(() => {
        connectWithRetry();
      }, 5000);
    },
  );
};
connectWithRetry();

mongoose.connection.on('connected', () => {
  console.log('Mongoose default connection open');
});

mongoose.connection.on('error', (err) => {
  console.log(`Mongoose default connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose default connection disconnected');
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});
