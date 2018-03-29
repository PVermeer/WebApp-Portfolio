const mongoose = require('mongoose');

const { Schema } = mongoose;

// Mongoose user schema
const UserSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    required: true,
  },
  lastName: {
    type: String,
    trim: true,
    required: true,
  },
  username: {
    type: String,
    trim: true,
    required: true,
  },
  usernameIndex: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
  },
  type: {
    type: String,
    lowercase: true,
    required: true,
    default: 'user',
  },
  hash: {
    type: String,
    required: true,
  },
}, { timestamps: { createdAt: 'created_at' } });

exports.User = mongoose.model('User', UserSchema);

// Mongoose temp user schema
const UserTempSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    required: true,
  },
  lastName: {
    type: String,
    trim: true,
    required: true,
  },
  username: {
    type: String,
    trim: true,
    required: true,
  },
  usernameIndex: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
  },
  type: {
    type: String,
    lowercase: true,
    required: true,
    default: 'user',
  },
  hash: {
    type: String,
    required: true,
  },
  verificationToken: {
    type: String,
    required: true,
  },
}, { timestamps: true });

UserTempSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });
exports.UserTemp = mongoose.model('tempUser', UserTempSchema);
