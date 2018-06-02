import { HookNextFunction } from 'mongoose';

// Mongoose middleware functions


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
