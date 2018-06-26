import { Request, Response } from 'express';
import { GridFsDocument, ContentPageModel } from '../../database/models/content/content.types';
import { deleteSuccess, findError, pageSaveSuccess, pageUpdateSuccess, saveError } from '../../services/error-handler.service';
import { RequestId } from '../../types/types';
import { contentFile, deleteContentPage, findAllContentPagesLean, findContentPageLean, saveContentPage, updateContentPage } from './content.database';
import { deleteOldFilesFromDb, deleteOldImagesFromDb, prepareArray, processToDbInput, updateContentErrorHandler, uploadFileHandler, uploadImageHandler } from './content.helpers';
import { ContentPageLeanInput } from './content.types';

export async function contentPageNew(req: Request) {

  const pageForm: ContentPageLeanInput = req.body;

  const newArray = prepareArray(pageForm);
  const imageArray = newArray.images;
  const fileArray = newArray.files;

  const dbInput = processToDbInput(pageForm, imageArray, fileArray);

  await saveContentPage(dbInput);

  return pageSaveSuccess;
}

export async function contentPageUpdate(req: Request) {

  const uploads = req.files as any; // Old typings

  const images: Express.Multer.File[] = uploads.images;
  const files: Express.Multer.File[] = uploads.files;
  const pageForm: ContentPageLeanInput = JSON.parse(req.body.content);
  const pageDocument = await findContentPageLean({ page: pageForm.page });

  const newArray = prepareArray(pageForm);
  const imageArray = newArray.images;
  const fileArray = newArray.files;

  let uploadImageArray: GridFsDocument[];
  let uploadFileArray: GridFsDocument[];

  try {
    await deleteOldImagesFromDb(pageDocument, imageArray);
    await deleteOldFilesFromDb(pageDocument, fileArray);

    uploadImageArray = await uploadImageHandler(images, imageArray);
    uploadFileArray = await uploadFileHandler(files, fileArray);

    const pageModel: ContentPageModel = processToDbInput(pageForm, imageArray, fileArray);

    const result = await updateContentPage({ page: pageModel.page }, pageModel);
    if (result && result.ok !== 1) { throw saveError; }

    return pageUpdateSuccess;

  } catch (error) {
    if (!uploadImageArray) { uploadImageArray = []; }
    if (!uploadFileArray) { uploadFileArray = []; }

    await updateContentErrorHandler(uploadImageArray.concat(uploadFileArray));
    throw error;
  }
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

  const { page } = req.query;

  return findContentPageLean({ page });
}
