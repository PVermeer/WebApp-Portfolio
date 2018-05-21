import * as rimraf from 'rimraf';
import * as mkdirp from 'mkdirp';
import { Config } from '../types/types';
import { resolve, sep, join } from 'path';

// Define a global root path
export const appRoot = resolve(join(__dirname, '../../../')) + sep;
console.log('appRoot = ' + appRoot);

// ----------------- Config file ---------------------
let config: Config;
try {
  config = require(appRoot + 'config.json');
} catch {
  console.log('Config file missing');
  config = require(appRoot + 'config_dummy.json');
}

config.maxDiskCache = convertDayToMs(config.maxDiskCache);
const configReadOnly: Readonly<Config> = Object.freeze(config);

export { configReadOnly as config };

// ------------------ Functions ----------------
export function startUpServer() {

  try {
    rimraf.sync(appRoot + config.cacheDir);

    mkdirp.sync(appRoot + config.tempDir);
    mkdirp.sync(appRoot + config.cacheDir);
    mkdirp.sync(appRoot + config.cacheDirFiles);
    mkdirp.sync(appRoot + config.cacheDirJson);
    mkdirp.sync(appRoot + config.uploadDir);

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
