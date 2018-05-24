import { hash } from 'bcryptjs';
import { HookNextFunction, Model, Schema, model } from 'mongoose';
import { QueryPre } from '../model.service';
import { UserDocument, UserTypes } from './user.types';

// User types
export const userTypes: Readonly<UserTypes> = {
  blockedUser: { rank: -1, value: 'blocked' },
  notLoggedIn: { rank: 0, value: 'not logged in' },
  tempUser: { rank: 1, value: 'tempUser' },
  user: { rank: 2, value: 'user' },
  admin: { rank: 3, value: 'admin' },
  superAdmin: { rank: 4, value: 'superAdmin' },
  developer: { rank: 10, value: 'developer' }
};


// Specific
async function saveOnePre(context: any, next: HookNextFunction): Promise<void> {

  let document: UserDocument = context;
  if (context._update) { document = context._update.$set; }

  if (document.username) {
    document.usernameIndex = document.username;
  }

  if (document.password) {
    if (document.password.length !== 60) { // Excluded a length of > 59 at server validation
      const password = document.password;
      const hashPassword = await hash(password, 10).catch(error => { throw next(error); });
      document.password = hashPassword;
    }
  }
  if (document._id) {
    delete document._id;
  }
}

// ------------- Mongoose user schema's -------------
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
    value: { type: String, required: true }
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: { createdAt: 'created_at' } });

const UserTempSchema = UserSchema;

// Expire collections
UserTempSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 }); // 1 day

// Middleware validation
const mustMatch = ['_id', 'usernameIndex', 'email'];

UserSchema.pre('validate', function (next): Promise<void> { return saveOnePre(this, next); });
UserSchema.pre('update', function (next): Promise<void> { return saveOnePre(this, next); });
UserSchema.pre('findOne', function (next): void { return QueryPre(this, next, mustMatch); });
UserSchema.pre('remove', function (next): void { return QueryPre(this, next, mustMatch); });

// Export models
export const User: Model<UserDocument> = model('User', UserSchema);
export const UserTemp: Model<UserDocument> = model('TempUser', UserTempSchema);
