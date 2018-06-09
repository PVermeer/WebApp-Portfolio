import { ObjectId } from 'mongodb';
import { ContentPageDocumentLean, ContentPageModel, GridFsDocument } from '../../database/models/content/content.types';
import { deleteFileDb, uploadFiles } from './content.database';
import { ContentFileSubmit, ContentImageSubmit, ContentPageLeanInput } from './content.types';
import { clearCacheDirs } from '../../services/cache-control.service';

export function prepareArray(pageForm: ContentPageLeanInput) {

  const images = pageForm.images.map(x => {
    if (!x._id) { x._id = (new ObjectId).toString(); }
    if (x.imageUpdate && Object.keys(x.imageUpdate).length === 0) { x.imageUpdate = null; }
    return x;
  });

  const files = pageForm.files.map(x => {
    if (!x._id) { x._id = (new ObjectId).toString(); }
    if (x.fileUpdate && Object.keys(x.fileUpdate).length === 0) { x.fileUpdate = null; }
    return x;
  });

  return { ...pageForm, images, files };
}

export function deleteOldImagesFromDb(pageDocument: Partial<ContentPageDocumentLean>, imagesArray: ContentImageSubmit[]) {

  Promise.all(pageDocument.images.map(x => new Promise(async resolve => {

    const exists = imagesArray.some(y => y._id === x._id.toString());

    if (!exists && x.image) { await deleteFileDb(x.image as string); }
    resolve();
  })));
}

export function deleteOldFilesFromDb(pageDocument: Partial<ContentPageDocumentLean>, filesArray: ContentFileSubmit[]) {

  Promise.all(pageDocument.files.map(x => new Promise(async resolve => {

    const exists = filesArray.some(y => y._id === x._id.toString());

    if (!exists && x.file) { await deleteFileDb(x.file as string); }
    resolve();
  })));
}

export async function uploadImageHandler(images: Express.Multer.File[], imagesArray: ContentImageSubmit[]) {

  if (!images || images.length === 0) { return null; }

  const fileArray: GridFsDocument[] = await uploadFiles(images);

  // Compare and update file id
  await Promise.all(fileArray.map(x => new Promise(async (resolve) => {
    if (!x) { return resolve(); } // Catch from uploadFiles()

    await Promise.all(imagesArray.map((y, i: number) => new Promise(async (resolve2) => {
      if (x.filename === y._id) {
        if (y.image) { await deleteFileDb(y.image as string); }
        imagesArray[i].image = x._id;
      }
      return resolve2();
    })));

    resolve();
  })));

  // Convert _id field to ObjectId when done
  imagesArray.map(x => {
    if ((x._id as string).split('-')[0] === 'newId') { x._id = new ObjectId; }
  });

  return fileArray;
}

export async function uploadFileHandler(files: Express.Multer.File[], filesArray: ContentFileSubmit[]) {

  if (!files || files.length === 0) { return null; }

  const fileArray: GridFsDocument[] = await uploadFiles(files);

  // Compare and update file id
  await Promise.all(fileArray.map(x => new Promise(async (resolve) => {
    if (!x) { return resolve(); } // Catch from uploadFiles()

    await Promise.all(filesArray.map((y, i: number) => new Promise(async (resolve2) => {
      if (x.filename === y._id) {
        if (y.file) { await deleteFileDb(y.file as string); }
        filesArray[i].file = x._id;
      }
      return resolve2();
    })));

    resolve();
  })));

  // Convert _id field to ObjectId when done
  filesArray.map(x => {
    if ((x._id as string).split('-')[0] === 'newId') { x._id = new ObjectId; }
  });

  return fileArray;
}

export function processToDbInput(pageForm: ContentPageLeanInput, imageArray: ContentImageSubmit[], fileArray: ContentFileSubmit[]
): ContentPageModel {

  delete pageForm._id;
  return { ...pageForm, images: imageArray, files: fileArray } as ContentPageModel;
}

export async function updateContentErrorHandler(filesArray: GridFsDocument[]) {

  if (filesArray && filesArray.length > 0) {

    clearCacheDirs();
    await Promise.all(filesArray.map(x => new Promise(async (resolve) => {
      if (x === null) { return resolve(); } // Catch from uploadFiles()

      await deleteFileDb(x._id.toString());
      resolve();
    })));
  }
}
