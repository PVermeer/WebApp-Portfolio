import { Model, Schema, model } from 'mongoose';
import { ManyDocument } from './many.types';
import { QueryPre } from './users.middleware';

// ------------- Mongoose transaction schema -------------

const ManyTransactionSchema = new Schema({
  data: {
    type: [String],
    required: true
  }
}, { timestamps: true });

// Expire the many collection
ManyTransactionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });

// Middleware validation
const mustMatch = ['_id'];

ManyTransactionSchema.pre('findOne', function (next): void { return QueryPre(this, next, mustMatch); });

// Export model
export const Many: Model<ManyDocument> = model('Many', ManyTransactionSchema);
