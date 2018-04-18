import { User, UserTemp } from '../database/models/user';
import { Many } from '../database/models/many';
import { ManyTransactionModel, QueryResult, UserFetch, UserModel, UserQuery } from '../types/types';

// Notes present, also check the object length checks, perhaps middleware?

export async function findUser(query: UserQuery, fetch: UserFetch): Promise<UserModel> {

  return User.findOne(query, fetch, { lean: true }, (error, result) => {
    if (error) return Promise.reject(error);
    if (result) return result;

    return UserTemp.findOne(query, fetch, { lean: true }, (error2, result2) => {
      if (error2) return Promise.reject(error2);

      return result2;
    });
  });
}

export async function findAndUpdateUser(query: UserQuery, updateForm: UserModel): Promise<UserModel> {

  return User.findOneAndUpdate(query, { $set: updateForm }, { runValidators: true }, (error, result) => {
    if (error) return Promise.reject(error);

    return result;
  });
}

export async function findAllUsers(fetch: UserFetch): Promise<Array<UserModel>> {

  return User.find({}, fetch, { lean: true }, (error, result) => {
    if (error) return Promise.reject(error);

    return result;
  });
}

export async function findTransactions(id: string): Promise<ManyTransactionModel> {

  return Many.findOne({ _id: id }, { data: 1 }, { lean: true }, (error, result) => {
    if (error) return Promise.reject(error);

    return result;
  });
}

export async function saveTempUser(user: UserModel): Promise<UserModel> {

  return new UserTemp(user).save((error, result) => {
    if (error) return Promise.reject(error);

    return result;
  });
}

export async function saveUser(user: UserModel): Promise<UserModel> {

  return new User(user).save((error, result) => {
    if (error) return Promise.reject(error);

    return result;
  });
}

export async function updateUser(query: UserQuery, updateForm: UserModel): Promise<QueryResult> {

  // tslint:disable-next-line no-null-keyword
  if (Object.keys(query).length === 0) return null;

  return User.update(query, { $set: updateForm }, { runValidators: true }, (error, result) => {
    if (error) return Promise.reject(error);

    return result;
  });
}

export async function saveTransactions(transactions: Array<string>): Promise<ManyTransactionModel> {

  const emptyArray = 'Empty array';
  if (transactions.length === 0) return Promise.reject(emptyArray); // Note: Is this right??? {message:......}

  const document = { data: transactions };

  return new Many(document).save((error, result) => {
    if (error) return Promise.reject(error);

    return { id: result._id.toString() }; // Note: Check this!!! Maybe middleware?
  });
}

export async function deleteUser(query: UserQuery): Promise<QueryResult> {

  // tslint:disable-next-line no-null-keyword
  if (Object.keys(query).length === 0) return null;

  return User.deleteOne(query, result => {

    return result;
  });
}

export async function deleteTempUser(query: UserQuery): Promise<QueryResult> {

  // tslint:disable-next-line no-null-keyword
  if (Object.keys(query).length === 0) return null;

  return UserTemp.deleteOne(query, result => {

    return result;
  });
}

export async function deleteMany(transactions: Array<string>): Promise<QueryResult> {

  return User.deleteMany({ _id: { $in: transactions } }, result => {

    return result;
  });
}
