import {Collection, ObjectId, UpdateResult} from "mongodb";
import {User} from "../../../models/user";
import {provideMongoCollection} from "../../../db/db-provider";
import bcrypt from 'bcrypt';
import {RatingType} from "../../../models/rating";

const usersCollection: Collection<User> = provideMongoCollection('users');

export const fetchUserData = async (userEmail: string): Promise<User | null> =>
    usersCollection.findOne({email: userEmail}, {projection: {tokens: 0, password: 0}});

export const fetchUserDisplayData = async (userEmail: string): Promise<User | null> =>
    usersCollection.findOne({email: userEmail}, {projection: {firstName: 1, lastName: 1, avatarUrl: 1}});

export const updateUserData = async (user: User): Promise<UpdateResult<User>> =>
    usersCollection.updateOne({email: user.email}, {"$set": user});

export const updateUserPassword = async (email: string, oldPassword: string, newPassword: string): Promise<boolean> => {
    let user = await usersCollection.findOne({email: email});

    if (user?.password) {
        const isMatch = await bcrypt.compare(oldPassword, <string>user?.password);
        if (!isMatch) {
            return false;
        }
    }

    if (user) {
        const salt: string = await bcrypt.genSalt(10);
        const encryptedPassword: string = await bcrypt.hash(newPassword, salt);
        if ((await usersCollection.updateOne({email: email}, {"$set": {password: encryptedPassword}})).matchedCount > 0) {
            return true;
        }
    }

    return false;
}

export const fetchExisingRating = async (userEmail: string, postId: string): Promise<RatingType> => {
    const userData: User | null = await usersCollection.findOne({email: userEmail});
    if (userData) {
        if (userData.likedApartments.includes(postId)) {
            return RatingType.like;
        } else if (userData.dislikedApartments.includes(postId)) {
            return RatingType.dislike;
        } else {
            return RatingType.none;
        }
    } else {
        throw new Error('User not found');
    }
}

export const updateUserRatings = async (userEmail: string, postId: string, ratingType: RatingType, action: 'add' | 'remove'): Promise<UpdateResult<User>> => {
    const dbAction: string = action === 'add' ? '$push' : '$pull';
    const targetArrayVal: string = ratingType === RatingType.like ? 'likedApartments' : 'dislikedApartments';
    return usersCollection.updateOne({email: userEmail}, {[dbAction]: {[targetArrayVal]: postId}});
}
