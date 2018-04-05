const mongoose = require('mongoose');

const { Schema } = mongoose;

// Mongoose post delete transaction
const ManyTransactionSchema = new Schema({
  data: {
    type: [String],
    required: true,
  },
}, { timestamps: true });

ManyTransactionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });
exports.Many = mongoose.model('Many', ManyTransactionSchema);
