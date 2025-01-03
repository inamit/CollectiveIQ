import { Collection, UpdateResult } from "mongodb";
import { User } from "../../../models/user";
import { provideMongoCollection } from "../../../db/db-provider";
import bcrypt from 'bcrypt';

const usersCollection: Collection<User> = provideMongoCollection('users');


export const fetchUserData = async (userEmail: string): Promise<User | null> =>
  usersCollection.findOne({ email: userEmail }, { projection: { tokens: 0, password: 0 } });

export const fetchUserDisplayData = async (userEmail: string): Promise<User | null> =>
  usersCollection.findOne({ email: userEmail }, { projection: { firstName: 1, lastName: 1, avatarUrl: 1 } });

export const updateUserData = async (user: User): Promise<UpdateResult<User>> =>
  usersCollection.updateOne({ email: user.email }, { "$set": user });

export const updateUserPassword = async (email: string, oldPassword: string, newPassword: string): Promise<boolean> => {
  let user = await usersCollection.findOne({ email: email });

  if (user?.password) {
    const isMatch = await bcrypt.compare(oldPassword, <string>user?.password);
    if (!isMatch) {
      return false;
    }
  }

  if (user) {
    const salt: string = await bcrypt.genSalt(10);
    const encryptedPassword: string = await bcrypt.hash(newPassword, salt);
    if ((await usersCollection.updateOne({ email: email }, { "$set": { password: encryptedPassword } })).matchedCount > 0) {
      return true;
    }
  }

  return false;
}