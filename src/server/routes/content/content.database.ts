import { gridFsBucket } from '../../database/connection';
import { createReadStream, unlink } from 'fs';
import { Response } from 'express';
import {
  ContentPageModel, GridFsDocument, ContentQuery, ContentFetch, ContentPageDocumentLean
} from '../../database/models/content/content.types';
import { ContentPage } from '../../database/models/content/content.schema';
import { saveError, deleteError, findError } from '../../services/error-handler.service';
import { QueryResult } from './content.types';
import { ObjectId } from 'mongodb';


// GridFs upload
export async function uploadFiles(files: Express.Multer.File[]) {

  const promises = await Promise.all(files.map(x => new Promise((resolve, reject) => {

    const writeStream = gridFsBucket.openUploadStream(x.filename, { contentType: x.mimetype });
    const readStream = createReadStream('./' + x.path);
    readStream.pipe(writeStream);

    readStream.on('error', error => reject(error));
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
  return new Promise((resolve, reject) => {

    const id = new ObjectId(_id);

    gridFsBucket.delete(id, (error) => {
      if (error) { reject(deleteError); }
      return resolve(true);
    });
  });
}

// GridFs image
export function contentImage(_id: string, res: Response): Promise<void> {
  return new Promise((resolve, reject) => {

    const id = new ObjectId(_id);

    const readStream = gridFsBucket.openDownloadStream(id);
    readStream.pipe(res);

    readStream.on('error', error => reject(error));
    readStream.on('file', file => res.contentType(file.contentType));
    readStream.on('close', () => resolve());
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


