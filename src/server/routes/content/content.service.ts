import { Request, Response } from 'express';
import { deleteSuccess, findError, pageSaveSuccess, pageUpdateSuccess, saveError, updateErrorDetected } from '../../services/error-handler.service';
import { startUpServer } from '../../services/server.service';
import { RequestId } from '../../types/types';
import { contentFile, deleteContentPage, findAllContentPagesLean, findContentPageLean, saveContentPage, updateContentPage } from './content.database';
import { deleteOldFilesFromDb, deleteOldImagesFromDb, prepareArray, processToDbInput, updateContentErrorHandler, uploadFileHandler, uploadImageHandler } from './content.helpers';
import { ContentPageLeanInput } from './content.types';

export async function contentPageNew(req: Request) {

  const pageForm: ContentPageLeanInput = req.body;

  const newArray = prepareArray(pageForm);
  const textArray = newArray.texts;
  const imageArray = newArray.images;
  const fileArray = newArray.files;

  const dbInput = processToDbInput(pageForm, textArray, imageArray, fileArray);

  await saveContentPage(dbInput);

  return pageSaveSuccess;
}

export async function contentPageUpdate(req: Request) {

  const uploads = req.files as any; // Old typings

  const images: Express.Multer.File[] = uploads.images;
  const files: Express.Multer.File[] = uploads.files;
  const pageForm: ContentPageLeanInput = JSON.parse(req.body.content);
  const pageDocument = await findContentPageLean({ title: pageForm.title });

  const newArray = prepareArray(pageForm);
  const textArray = newArray.texts;
  const imageArray = newArray.images;
  const fileArray = newArray.files;

  await deleteOldImagesFromDb(pageDocument, imageArray);
  await deleteOldFilesFromDb(pageDocument, fileArray);

  const uploadImageArray = await uploadImageHandler(images, imageArray);
  const uploadFileArray = await uploadFileHandler(files, fileArray);

  const pageModel = processToDbInput(pageForm, textArray, imageArray, fileArray);

  const result = await updateContentPage({ title: pageModel.title }, pageModel)

    // On errors revert back
    .catch(async error => await updateContentErrorHandler({ ...uploadImageArray, ...uploadFileArray }, error));

  if (result && result.ok !== 1) { startUpServer(); throw saveError; }
  if (fileArray && fileArray.some(x => !x)) { startUpServer(); throw updateErrorDetected; }

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
