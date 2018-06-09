import { Response } from 'express';
import { createReadStream, createWriteStream, readFile, unlink, writeFile } from 'fs';
import { ObjectId } from 'mongodb';
import { gridFsBucket } from '../../database/connection';
import { ContentPage } from '../../database/models/content/content.schema';
import { ContentFetch, ContentPageDocumentLean, ContentPageModel, ContentQuery, GridFsDocument } from '../../database/models/content/content.types';
import { findError, saveError } from '../../services/error-handler.service';
import { appRoot, config } from '../../services/server.service';
import { QueryResult } from './content.types';

// GridFs upload
export async function uploadFiles(files: Express.Multer.File[]) {

  const promises = await Promise.all(files.map(x => new Promise((resolve, reject) => {

    const writeStream = gridFsBucket.openUploadStream(x.filename, { contentType: x.mimetype });
    const readStreamFs = createReadStream(x.path);
    readStreamFs.pipe(writeStream);

    readStreamFs.on('error', error => reject(error));
    writeStream.on('error', error => reject(error));

    writeStream.on('finish', (file: GridFsDocument) => {
      unlink(x.path, async error => {
        if (error) {
          await deleteFileDb(file._id.toString());
          return reject(error);
        }
        resolve(file);
      });
    });
  }).catch(() => null)
  )) as GridFsDocument[];

  return promises;
}

// GridFs delete
export function deleteFileDb(_id: string): Promise<boolean> {
  return new Promise(async (resolve) => {

    const id = new ObjectId(_id);

    gridFsBucket.delete(id, (error) => {
      if (error) { throw error; }
      return resolve();
    });
  });
}

// GridFs image
export function contentFile(_id: string, res: Response): Promise<void> {
  return new Promise((resolve, reject) => {

    readFile(appRoot + config.cacheDirJson + _id + '.json', (error, data) => {

      if (error) { return isNotCached(); }

      const file: GridFsDocument = JSON.parse(data.toString());
      const fileType = file.contentType;

      return isCached(fileType);
    });

    function isCached(fileType: string) {

      res.contentType(fileType);
      res.sendFile(appRoot + config.cacheDirFiles + _id, (error: Error) => {
        if (error) { return isNotCached(); }
      });
    }

    function isNotCached() {

      const id = new ObjectId(_id);

      const readStream = gridFsBucket.openDownloadStream(id);
      const writeStreamFsFile = createWriteStream(appRoot + config.cacheDirFiles + id);
      const writeFsJson = appRoot + config.cacheDirJson + id + '.json';

      readStream.pipe(writeStreamFsFile);
      readStream.pipe(res);

      readStream.on('error', error => reject(error));
      readStream.on('file', file => {
        res.contentType(file.contentType);
        writeFile(writeFsJson, JSON.stringify(file), () => { });
      });
      readStream.on('close', () => resolve());

      writeStreamFsFile.on('error', () => writeStreamFsFile.end());
    }
  });
}

// Save
export function saveContentPage(page: ContentPageModel) {

  return new ContentPage(page).save().then(result => {
    if (!result) { throw saveError; }
    return result;
  });
}

export function deleteContentPage(query: ContentQuery) {

  return ContentPage.findOneAndRemove(query).exec().then(async document => {

    await Promise.all(document.images.map(async x => {
      if (x.image) { await deleteFileDb(x.image as string); }
    }));
    await Promise.all(document.files.map(async x => {
      if (x.file) { await deleteFileDb(x.file as string); }
    }));
  });
}

// Update
export function updateContentPage(query: ContentQuery, updateForm: Partial<ContentPageModel>): Promise<QueryResult> {

  return ContentPage.update(query, { $set: updateForm }, { runValidators: true }).exec();
}

// Find
export function findContentPageLean(query: ContentQuery, fetch?: ContentFetch): Promise<Partial<ContentPageDocumentLean>> {

  return ContentPage.findOne(query, fetch).lean().exec().then(result => {
    if (!result) { throw findError; }
    return result;
  });
}

export function findAllContentPagesLean(query: ContentQuery, fetch?: ContentFetch): Promise<Partial<ContentPageDocumentLean>> {

  return ContentPage.find(query, fetch).lean().exec().then(result => {
    if (!result) { throw findError; }
    return result;
  });
}


