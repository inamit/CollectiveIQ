import { UpdateResult } from 'mongodb';
import { User } from "../../../models/user";
import { fetchUserData, fetchUserDisplayData, updateUserData, updateUserPassword } from "../repository/user.repository";

export const updateUser = async (user: User): Promise<UpdateResult<User>> => updateUserData(user);

export const fetchUser = async (userEmail: string): Promise<User | null> => fetchUserData(userEmail);

export const fetchUserDisplay = async (userEmail: string): Promise<User | null> => fetchUserDisplayData(userEmail);

export const updatePassword = async (email:string,oldPassword: string,newPassword:string): Promise<boolean> => updateUserPassword(email,oldPassword,newPassword);