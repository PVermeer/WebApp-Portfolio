import { Request, Response } from 'express';

import {
  updateContentPage, findAllContentPagesLean, contentFile, saveContentPage, findContentPageLean, deleteContentPage
} from './content.database';
import {
  pageUpdateSuccess, saveError, updateErrorDetected, pageSaveSuccess, deleteSuccess, findError,
} from '../../services/error-handler.service';
import { ContentPageLeanInput } from './content.types';
import {
  uploadImageHandler, deleteOldFromDb, updateContentErrorHandler, prepareArray, processToDbInput
} from './content.helpers';
import { RequestId } from '../../types/types';


export async function contentPageNew(req: Request) {

  const pageForm: ContentPageLeanInput = req.body;

  const newArray = prepareArray(pageForm);
  const imageArray = newArray.images;
  const textArray = newArray.texts;

  const dbInput = processToDbInput(pageForm, textArray, imageArray);

  await saveContentPage(dbInput);

  return pageSaveSuccess;
}

export async function contentPageUpdate(req: Request) {

  const images = req.files as Express.Multer.File[];
  const pageForm: ContentPageLeanInput = JSON.parse(req.body.content);
  const pageDocument = await findContentPageLean({ title: pageForm.title });

  const newArray = prepareArray(pageForm);
  const imageArray = newArray.images;
  const textArray = newArray.texts;

  await deleteOldFromDb(pageDocument, imageArray);

  const fileArray = await uploadImageHandler(images, imageArray);

  const pageModel = processToDbInput(pageForm, textArray, imageArray);

  const result = await updateContentPage({ title: pageModel.title }, pageModel)

    // On errors revert back
    .catch(async error => await updateContentErrorHandler(fileArray, error));

  if (result && result.ok !== 1) { throw saveError; }

  if (fileArray && fileArray.some(x => !x)) { throw updateErrorDetected; }

  return pageUpdateSuccess;
}

export async function contentPageDelete(req: RequestId) {

  const { _id } = req.params;

  await deleteContentPage({ _id });

  return deleteSuccess;
}

export async function contentPageGetAll() {

  const allPages = await findAllContentPagesLean({});

  return allPages;
}

export async function getFile(req: Request, res: Response) {

  const _id = req.query.id;

  await contentFile(_id, res)
    .catch(() => { throw findError; });
}

export function getPage(req: Request) {

  const { title } = req.query;

  return findContentPageLean({ title });

}
