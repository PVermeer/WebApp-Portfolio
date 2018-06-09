import { UpdateWriteOpResult } from 'mongodb';
import { Query } from 'mongoose';
import { ContentFile, ContentImage, ContentPageDocumentLean } from '../../database/models/content/content.types';

// ---------- Queries ------------
export interface QueryResult extends Query<UpdateWriteOpResult['result']> { }

export interface ContentImageSubmit extends ContentImage {
  imageUpdate: Blob;
}
export interface ContentFileSubmit extends ContentFile {
  fileUpdate: Blob;
}
export interface ContentPageLeanInput extends ContentPageDocumentLean {
  images: ContentImageSubmit[];
  files: ContentFileSubmit[];
}
