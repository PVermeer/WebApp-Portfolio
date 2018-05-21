import * as rimraf from 'rimraf';
import * as mkdirp from 'mkdirp';
import { Config } from '../types/types';

// ----------------- Config file ---------------------
let config: Config;
try {
  config = require('../../../config.json');
} catch {
  console.log('Config file missing');
  config = require('../../../config_dummy.json');
}

config.maxDiskCache = convertDayToMs(config.maxDiskCache);
const configReadOnly: Readonly<Config> = Object.freeze(config);

export { configReadOnly as config };


// ------------------ Functions ----------------
export function startUpServer() {

  try {
    rimraf.sync(config.cacheDir);

    mkdirp.sync(config.tempDir);
    mkdirp.sync(config.cacheDir);
    mkdirp.sync(config.cacheDirFiles);
    mkdirp.sync(config.cacheDirJson);
    mkdirp.sync(config.uploadDir);

  } catch (error) {

    setTimeout(() => {
      startUpServer();
    }, 1000
    );
  }
}

function convertDayToMs(day: number) {
  return day * 24 * 60 * 60 * 1000;
}
