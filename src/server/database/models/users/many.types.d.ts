import { Document } from 'mongoose';

// Input
export interface ManyModel {
  data: string[];
}

// Output
export interface ManyDocumentLean {
  _id: string;
  data: string[];
}
export interface ManyDocument extends ManyModel, Document {}
