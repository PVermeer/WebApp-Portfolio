import { uploadFiles, deleteFileDb } from './content.database';
import {
  GridFsDocument, ContentPageDocumentLean, ContentTextDocumentLean, ContentPageModel
} from '../../database/models/content/content.types';
import { ContentImageSubmit, ContentPageLeanInput } from './content.types';
import { ObjectID } from 'mongodb';

export function prepareArray(pageForm: ContentPageLeanInput) {

  const images = pageForm.images.map(x => {

    if (!x._id) { x._id = new ObjectID; }
    if (x.imageUpdate && Object.keys(x.imageUpdate).length === 0) { x.imageUpdate = null; }

    return x;
  });

  const texts = pageForm.texts.map(x => {

    if (!x._id) { x._id = new ObjectID; }

    return x;
  });

  return { images, texts };
}

export async function uploadImageHandler(images: Express.Multer.File[], imagesArray: ContentImageSubmit[]) {

  if (images.length === 0) { return null; }

  const fileArray: GridFsDocument[] = await uploadFiles(images);

  // Compare and update file id
  await Promise.all(fileArray.map(x => new Promise(async (resolve) => {

    if (!x) { return resolve(); } // Catch from uploadFiles()

    await Promise.all(imagesArray.map((y, i: number) => new Promise(async (resolve2) => {

      if (x.filename === y._id) {

        if (y.image) { await deleteFileDb(y.image as string); }
        imagesArray[i].image = x._id;

        return resolve2();
      } else { return resolve2(); }
    })));

    resolve();
  })));

  return fileArray;
}

export function deleteOldFromDb(pageDocument: Partial<ContentPageDocumentLean>, imagesArray: ContentImageSubmit[]) {

  Promise.all(pageDocument.images.map(x => new Promise(async resolve => {

    const exists = imagesArray.some(y => y._id === x._id.toString());

    if (!exists && x.image) { await deleteFileDb(x.image as string); }
    resolve();
  })));
}

export function processToDbInput(pageForm: ContentPageLeanInput, textArray: ContentTextDocumentLean[], imageArray: ContentImageSubmit[]
): ContentPageModel {

  return {
    title: pageForm.title,
    description: pageForm.description,
    texts: textArray,
    images: imageArray,
  };
}

export async function updateContentErrorHandler(fileArray: GridFsDocument[], error: any) {

  if (fileArray) {

    await Promise.all(fileArray.map(x => new Promise(async (resolve) => {

      if (x === null) { return resolve(); } // Catch from uploadFiles()

      await deleteFileDb(x._id.toString());
      resolve();
    })));
  }
  throw error;
}
