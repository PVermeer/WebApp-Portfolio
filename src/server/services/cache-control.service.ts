import { createHash } from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { unlink, writeFile } from 'fs';
import { Glob } from 'glob';
import * as mkdirp from 'mkdirp';
import * as rimraf from 'rimraf';
import { errorHandler } from './error-handler.service';
import { appRoot, config } from './server.service';

// Cache headers middleware
export function disableCache(_req: Request, res: Response, next: NextFunction) {

  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate'); // HTTP 1.1.
  res.setHeader('Pragma', 'no-cache'); // HTTP 1.0.
  res.setHeader('Expires', '0'); // Proxies.

  return next();
}

// Cache json middleware
export function cacheJson(req: Request, res: Response, next: NextFunction) {

  const hash = createHash('sha1').update(req.url).digest('base64');
  const find = appRoot + config.cacheDirJson + hash + '-' + '*.json';

  return new Glob(find, (error, matches) => { // Matches returns full path

    if (error || !matches[0]) { return isNotCached(); }
    if (matches[0]) { return isCached(matches[0]); }
  });


  function isNotCached() {

    const original = res.json;
    const expires = Date.now() + config.maxDiskCache;
    const newFile = appRoot + config.cacheDirJson + hash + '-' + expires + '.json';

    function jsonHook(this: any, json: any) {

      if (json && !json.status) {
        writeFile(newFile, JSON.stringify(json), () => { });
      }

      return original.call(this, json);
    }

    res.json = jsonHook;
    next();
  }

  function isCached(file: string) {

    const expires = Number((file.split('-')[1]).split('.')[0]);

    if (Date.now() > expires) {
      unlink(file, () => { });
      return isNotCached();
    }

    return res.sendFile(file);
  }
}

// Cache clear middleware
export async function clearCache(_req: Request, _res: Response, next: NextFunction) {

  await clearCacheDirs();

  return next();
}

// Functions
export async function clearCacheDirs() {
  return new Promise(async resolveFn => {

    let counter = 0;

    function clearDirs() {
      return new Promise(async resolveAll => {
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

          resolveAll();

        } catch {

          if (counter < 10) {
            setTimeout(() => {
              counter++;
              clearDirs();
            }, 1000);
          } else {
            errorHandler(new Error('Counter has reached maximum in clearCacheDirs()'));
            resolveAll();
          }
        }
      });
    }
    await clearDirs();
    resolveFn();
  });
}
