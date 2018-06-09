import { join, resolve as resolvePath, sep } from 'path';
import { Config } from '../types/types';

// Define a global root path
export const appRoot = resolvePath(join(__dirname, '../../../')) + sep;
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

function convertDayToMs(day: number) {
  return day * 24 * 60 * 60 * 1000;
}
