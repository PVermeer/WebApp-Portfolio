import { HookNextFunction } from 'mongoose';
import { ContentPageModelIndex } from './content.types';

export function saveOnePre(context: any, next: HookNextFunction) {

  let document: ContentPageModelIndex = context;
  if (context._update) { document = context._update.$set; }

  if (document.page) {
    document.pageIndex = document.page;
  }

  next();
}

export function QueryPre(context: any, next: HookNextFunction, mustMatch: string[]): void {

  const query = context.getQuery();

  // Username conversion for user queries
  if (query.page) { query.pageIndex = query.page; delete query.page; }

  if (Object.keys(query).length === 0) { throw next(new Error('Nothing in query object')); }
  if (Object.keys(query).length > 1) { throw next(new Error('Only one query key is allowed')); }

  const queryKey = Object.keys(query)[0];

  const isMatch = mustMatch.some(x => x === queryKey);

  if (!isMatch) { throw next(new Error('Not a matching query')); }

  return next();
}
