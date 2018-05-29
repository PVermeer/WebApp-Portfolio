import { Model, Schema, model } from 'mongoose';
import { ContentPageDocument, GridFsDocument } from './content.types';



// ------- Mongoose middleware User functions --------
// Shared

// Specific

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
  title: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  texts: [{
    _id: { type: Schema.Types.ObjectId, required: true },
    header: { type: String, trim: true, required: true },
    text: { type: String, trim: true, required: true }
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

// Export models
export const ContentPage: Model<ContentPageDocument> = model('ContentPage', ContentPageSchema);
export const GridFs: Model<GridFsDocument> = model('content.files', GridFsSchema);

