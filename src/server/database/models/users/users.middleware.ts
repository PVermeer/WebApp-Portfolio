import { hash } from 'bcryptjs';
import { HookNextFunction } from 'mongoose';
import { UserDocument } from './user.types';

// --------- Mongoose middleware ------------

export async function saveOnePre(context: any, next: HookNextFunction): Promise<void> {

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

export function QueryPre(context: any, next: HookNextFunction, mustMatch: string[]): void {

  const query = context.getQuery();

  // Username conversion for user queries
  if (query.username) { query.usernameIndex = query.username; delete query.username; }

  if (Object.keys(query).length === 0) { throw next(new Error('Nothing in query object')); }
  if (Object.keys(query).length > 1) { throw next(new Error('Only one query key is allowed')); }

  const queryKey = Object.keys(query)[0];

  const isMatch = mustMatch.some(x => x === queryKey);

  if (!isMatch) { throw next(new Error('Not a matching query')); }

  return next();
}
