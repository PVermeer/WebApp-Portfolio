import { Query } from 'mongoose';
import { UpdateWriteOpResult } from 'mongodb';
import { ContentPageDocumentLean, ContentImageDocumentLean, ContentFileDocumentLean } from '../../database/models/content/content.types';

// ---------- Queries ------------
export interface QueryResult extends Query<UpdateWriteOpResult['result']> { }

export interface ContentImageSubmit extends ContentImageDocumentLean {
  imageUpdate: Blob;
}
export interface ContentFileSubmit extends ContentFileDocumentLean {
  fileUpdate: Blob;
}
export interface ContentPageLeanInput extends ContentPageDocumentLean {
  images: ContentImageSubmit[];
  files: ContentFileSubmit[];
}
