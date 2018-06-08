import { Model, Schema, model } from 'mongoose';
import { ContentPageDocument, GridFsDocument } from './content.types';
import { saveOnePre, QueryPre } from './content.middleware';

// ------------- Mongoose content schema's -------------

// GridFs files
const GridFsSchema = new Schema({
  filename: String,
  contentType: String,
  length: Number,
  chunkSize: Number,
  uploadDate: Date,
  md5: String,
});

// Page
const ContentPageSchema = new Schema({
  page: {
    type: String,
    trim: true,
    required: true,
  },
  pageIndex: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    unique: true
  },
  info: {
    title: { type: String, trim: true, required: true },
    subtitle: { type: String, trim: true },
    text: { type: String, trim: true },
    list: [{ type: String, trim: true }],
  },
  texts: [{
    header: { type: String, trim: true, required: true },
    text: { type: String, trim: true }
  }],
  lists: [{
    title: { type: String, trim: true, required: true },
    list: [{ type: String, trim: true }]
  }],
  images: [{
    _id: { type: Schema.Types.ObjectId, required: true },
    title: { type: String, trim: true, required: true },
    image: { type: Schema.Types.ObjectId, ref: 'content.files' }
  }],
  files: [{
    _id: { type: Schema.Types.ObjectId, required: true },
    title: { type: String, trim: true, required: true },
    file: { type: Schema.Types.ObjectId, ref: 'content.files' }
  }]

}, { timestamps: { createdAt: 'created_at' } });


// Expire collections

// Middleware validation
const mustMatch = ['_id', 'pageIndex'];

ContentPageSchema.pre('validate', function (next) { return saveOnePre(this, next); });
ContentPageSchema.pre('update', function (next) { return saveOnePre(this, next); });

ContentPageSchema.pre('findOne', function (next) { return QueryPre(this, next, mustMatch); });
ContentPageSchema.pre('remove', function (next) { return QueryPre(this, next, mustMatch); });


// Export models
export const ContentPage: Model<ContentPageDocument> = model('ContentPage', ContentPageSchema);
export const GridFs: Model<GridFsDocument> = model('content.files', GridFsSchema);
