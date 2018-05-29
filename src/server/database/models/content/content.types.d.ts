import { Document } from 'mongoose';
import { ObjectID } from 'bson';

// ------------ Mongoose -------------

// Text
export interface ContentText {
  header: string;
  text: string;
}
export interface ContentTextDocument extends ContentText, Document { _id: string | ObjectID; }
export interface ContentTextDocumentLean extends ContentText { _id: string | ObjectID; }

// Image
export interface ContentImage {
  title: string;
  image: string | ObjectID | Blob;
}
export interface ContentImageDocument extends ContentImage, Document { _id: string | ObjectID; }
export interface ContentImageDocumentLean extends ContentImage { _id: string | ObjectID; }

// File
export interface ContentFile {
  title: string;
  file: string | ObjectID | Blob;
}
export interface ContentFileDocument extends ContentFile, Document { _id: string | ObjectID; }
export interface ContentFileDocumentLean extends ContentFile { _id: string | ObjectID; }

// Page
export interface ContentPageModel {
  title: string;
  description: string;
  texts: ContentText[];
  images: ContentImage[];
  files: ContentFile[];
}
export interface ContentPageDocument extends ContentPageModel, Document {
  _id: string | ObjectID;
  texts: ContentTextDocument[];
  images: ContentImageDocument[];
  files: ContentFileDocument[];
}
export interface ContentPageDocumentLean extends ContentPageModel {
  _id: string | ObjectID;
  texts: ContentTextDocumentLean[];
  images: ContentImageDocumentLean[];
  files: ContentFileDocumentLean[];
}

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

