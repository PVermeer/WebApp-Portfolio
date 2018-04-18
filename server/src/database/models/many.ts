import { model, Schema } from 'mongoose';

// tslint:disable:variable-name

// Mongoose post delete transaction
const ManyTransactionSchema = new Schema({
  data: {
    type: [String],
    required: true
  }
}, { timestamps: true });

ManyTransactionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });
export const Many = model('Many', ManyTransactionSchema);
