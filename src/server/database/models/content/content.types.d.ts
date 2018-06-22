import { ObjectID } from 'bson';
import { Document } from 'mongoose';

// ------------ Mongoose -------------

// Sub models
export interface ContentInfo {
  title: string;
  subtitle: string;
  text: string;
  list: string[];
}
export interface ContentText {
  ref: string;
  header: string;
  text: string[];
}
export interface ContentList {
  ref: string;
  title: string;
  list: string[][];
}
export interface ContentImage {
  _id: string | ObjectID;
  ref: string;
  title: string;
  image: string | ObjectID | Blob;
}
export interface ContentFile {
  _id: string | ObjectID;
  ref: string;
  title: string;
  file: string | ObjectID | Blob;
}

// Page model
export interface ContentPageInfo {
  page: string;
  info: ContentInfo;
}
export interface ContentPageArrays {
  texts: ContentText[];
  lists: ContentList[];
  images: ContentImage[];
  files: ContentFile[];
}
export interface ContentPageModel extends ContentPageInfo, ContentPageArrays { }
export interface ContentPageDocumentLean extends ContentPageModel { _id: string | ObjectID; }
export interface ContentPageDocument extends ContentPageModel, Document { }
export interface ContentPageModelIndex extends ContentPageModel { pageIndex: string }

export type ContentQuery = { [P in keyof ContentPageDocumentLean]?: ContentPageDocumentLean[P] };
export type ContentFetch = { [K in keyof ContentPageDocumentLean]?: 1 | 0 };


// ---------- GridFs ----------------
export interface GridFsModel {
  filename: string;
  contentType: string;
  length: number;
  chunkSize: number;
  uploadDate: Date;
  md5: string;
}
export interface GridFsDocument extends GridFsModel, Document { _id: string | ObjectID; }

