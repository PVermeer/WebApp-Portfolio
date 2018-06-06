import * as mkdirp from 'mkdirp';
import { join, resolve as resolvePath, sep } from 'path';
import * as rimraf from 'rimraf';
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

export async function clearCacheDirs() {

  try {
    await new Promise((resolve, reject) => {
      rimraf(appRoot + config.cacheDir, (error) => { if (error) { return reject(); } resolve(); });
    });
    await new Promise((resolve, reject) => {
      rimraf(appRoot + config.uploadDir, (error) => { if (error) { return reject(); } resolve(); });
    });
    await new Promise((resolve, reject) => {
      mkdirp(appRoot + config.tempDir, (error) => { if (error) { return reject(); } resolve(); });
    });
    await new Promise((resolve, reject) => {
      mkdirp(appRoot + config.cacheDir, (error) => { if (error) { return reject(); } resolve(); });
    });
    await new Promise((resolve, reject) => {
      mkdirp(appRoot + config.cacheDirFiles, (error) => { if (error) { return reject(); } resolve(); });
    });
    await new Promise((resolve, reject) => {
      mkdirp(appRoot + config.cacheDirJson, (error) => { if (error) { return reject(); } resolve(); });
    });
    await new Promise((resolve, reject) => {
      mkdirp(appRoot + config.uploadDir, (error) => { if (error) { return reject(); } resolve(); });
    });
  } catch {
    setTimeout(() => {
      clearCacheDirs();
    }, 1000);
  }
}

export async function startUpServer() {

  await clearCacheDirs();
}

function convertDayToMs(day: number) {
  return day * 24 * 60 * 60 * 1000;
}
