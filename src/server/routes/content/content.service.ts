import { Request, Response } from 'express';

import {
  updateContentPage, findAllContentPagesLean, contentImage, saveContentPage, findContentPageLean
} from './content.database';
import { ContentPageModel } from '../../database/models/content/content.types';
import { pageUpdateSuccess, saveError, updateErrorDetected, pageSaveSuccess } from '../../services/error-handler.service';
import { ObjectID } from 'bson';
import { ContentPageLeanInput } from './content.types';
import { compareSortObject, uploadImageHandler, deleteOldFromDb, updateContentErrorHandler } from './content.helpers';

export async function contentPageNew(req: Request): Promise<any> {

  const page = req.body;

  await saveContentPage(page);

  return pageSaveSuccess;
}

export async function contentPageUpdate(req: Request): Promise<any> {

  const images = req.files as Express.Multer.File[];
  const pageForm: ContentPageLeanInput = JSON.parse(req.body.content);
  const pageDocument = await findContentPageLean({ title: pageForm.title });

  // Prepare imagesArray
  const imagesArray = pageForm.images.map(x => {
    if (!x._id) { x._id = new ObjectID; }
    if (x.imageUpdate && Object.keys(x.imageUpdate).length === 0) { x.imageUpdate = null; }
    return x;
  });

  // Prepare textArray
  const textArray = pageForm.texts.map(x => {
    if (!x._id) { x._id = new ObjectID; }
    return x;
  });

  // Delete files from database if not in the new imageArray
  await deleteOldFromDb(pageDocument, imagesArray);

  // Upload new files and/or replace
  const fileArray = await uploadImageHandler(images, imagesArray);

  // Build new pageDocument
  const pageModel: ContentPageModel = {
    title: pageForm.title,
    description: pageForm.description,
    texts: textArray.sort((a: object, b: object) => compareSortObject(a, b)),
    images: imagesArray.sort((a: object, b: object) => compareSortObject(a, b)),
  };

  // Update the page document
  const result = await updateContentPage({ title: pageModel.title }, pageModel)

    // On errors revert back
    .catch(async error => await updateContentErrorHandler(fileArray, error));

  if (result && result.ok !== 1) { throw saveError; }

  if (fileArray && fileArray.some(x => !x)) { throw updateErrorDetected; }

  return pageUpdateSuccess;
}

export async function contentPageGetAll(): Promise<any> {

  const allPages = await findAllContentPagesLean({}, { _id: 0 });

  return allPages;
}

export async function getImage(req: Request, res: Response): Promise<any> {

  const _id = req.query.id;

  await contentImage(_id, res);
}
