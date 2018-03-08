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
  userName: {
    type: String,
    trim: true,
    required: true,
  },
  userNameIndex: {
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
  hash: {
    type: String,
    required: true,
  },
}, { timestamps: { createdAt: 'created_at' } });

const User = mongoose.model('User', UserSchema);
module.exports = User;
