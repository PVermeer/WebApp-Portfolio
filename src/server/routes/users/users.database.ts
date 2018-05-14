import { FilterQuery } from 'mongodb';
import { User, UserTemp } from '../../database/models/users/user.schema';
import { Many } from '../../database/models/users/many.schema';
import { QueryResult } from './users.types';
import { UserDocumentLean, UserDocument, UserModel, UserQuery, UserFetch } from '../../database/models/users/user.types';
import { ManyDocumentLean, ManyDocument } from '../../database/models/users/many.types';
import { saveError, findError } from '../../services/error-handler.service';


export async function findUser(query: UserQuery, fetch?: UserFetch): Promise<UserDocument> {

  return User.findOne(query, fetch).exec().then(result => {
    if (result) { return result; }

    return UserTemp.findOne(query, fetch).exec().then(result2 => {
      if (!result2) { throw findError; }
      return result2;
    });
  });
}

export async function findUserLean(query: UserQuery, fetch?: UserFetch): Promise<UserDocumentLean> {

  return User.findOne(query, fetch).lean().exec().then(result => {
    if (result) { return result; }

    return UserTemp.findOne(query, fetch).lean().exec().then(result2 => {
      if (!result2) { throw findError; }
      return result2;
    });
  });
}

export async function findUsers(query: FilterQuery<UserDocument>, fetch: UserFetch): Promise<Partial<UserDocumentLean[]>> {

  return User.find(query, fetch).lean().exec().then(result => {
    if (result.length === 0) { throw findError; }
    return result;
  });
}

export async function findTransactions(id: string): Promise<ManyDocumentLean> {

  return Many.findOne({ _id: id }, { data: 1 }).lean().exec().then(result => {
    if (!result) { throw findError; }
    return result;
  });
}

export async function saveTempUser(user: UserModel): Promise<UserDocument> {

  return new UserTemp(user).save().then(result => {
    if (!result) { throw saveError; }
    return result;
  });
}

export async function saveUser(user: UserDocumentLean): Promise<UserDocument> {

  return new User(user).save().then(result => {
    if (!result) { throw saveError; }
    return result;
  });
}

export async function updateUser(query: UserQuery, updateForm: Partial<UserModel>): Promise<QueryResult> {

  return User.update(query, { $set: updateForm }, { runValidators: true }).exec();
}

export async function updateMany(transactions: Array<string>, updateForm: Partial<UserModel>): Promise<QueryResult> {

  return User.updateMany({ _id: { $in: transactions } }, { $set: updateForm }, { runValidators: true }).exec();
}

export async function saveTransactions(transactions: Array<string>): Promise<ManyDocument> {

  const document = { data: transactions };

  return new Many(document).save().then(result => {
    if (!result) { throw saveError; }
    return result;
  });
}

export async function deleteUser(query: UserQuery): Promise<QueryResult> {

  return User.deleteOne(query).exec();
}

export function deleteTempUser(query: UserQuery): void {

  UserTemp.deleteOne(query).exec().catch(error => { console.error(error); });
}

export async function deleteMany(transactions: Array<string>): Promise<QueryResult> {

  return User.deleteMany({ _id: { $in: transactions } }).exec();
}
