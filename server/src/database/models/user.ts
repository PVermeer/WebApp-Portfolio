import { HookNextFunction, model, Schema } from 'mongoose';
import { UserModel } from '../../types/types';

// User types
export const userTypes = {
  tempUser: { rank: 0, value: 'tempUser' },
  tempAdmin: { rank: 0, value: 'tempAdmin' },
  user: { rank: 1, value: 'user' },
  admin: { rank: 2, value: 'admin' },
  superAdmin: { rank: 3, value: 'superAdmin' }
};

// Mongoose middleware functions
function saveOnePre(context: any, next: HookNextFunction): void {
  const document: UserModel = context;

  if (document.username) document.usernameIndex = document.username;

  return next();
}

function findOnePre(context: any, next: HookNextFunction): void {
  const query: UserModel = context.getQuery();

  if (query.username) { query.usernameIndex = query.username; delete query.username; }

  if (Object.keys(query).length > 1) return next(new Error('Only one query key is allowed'));

  const mustMatch = ['_id', 'usernameIndex', 'email'];
  const queryKey = Object.keys(query)[0];

  const isMatch = mustMatch.some(x => x === queryKey);

  if (!isMatch) return next(new Error('Not a matching query'));

  return next();
}

function idToStringPost(document: any): UserModel {
  if (document) {
    const user: UserModel = document;

    if (user._id) user.id = document._id.toString();

    return user;
  }

  return document;
}

// ------------- Mongoose user schema's -------------

// tslint:disable: variable-name no-invalid-this

const UserSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    required: true
  },
  lastName: {
    type: String,
    trim: true,
    required: true
  },
  username: {
    type: String,
    trim: true,
    required: true
  },
  usernameIndex: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    unique: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    unique: true
  },
  type: {
    rank: { type: Number, required: true },
    value: { type: String, lowercase: true, required: true }
  },
  hash: {
    type: String,
    required: true
  }
}, { timestamps: { createdAt: 'created_at' } });

const UserTempSchema = UserSchema;

// Expire the userTemp collection
UserTempSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

// Middleware validation
UserSchema.pre('validate', function(next): void { return saveOnePre(this, next); });
UserSchema.pre('findOne', function(next): void { return findOnePre(this, next); });

UserSchema.post('findOne', doc => idToStringPost(doc));

// Export models
export const User = model('User', UserSchema);
export const UserTemp = model('TempUser', UserTempSchema);
