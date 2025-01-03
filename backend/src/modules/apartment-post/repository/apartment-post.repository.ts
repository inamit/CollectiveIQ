import { Collection, DeleteResult, InsertOneResult, ObjectId, UpdateResult } from "mongodb";
import { ApartmentPost, } from "../../../models/apartmentPost";
import { provideMongoCollection } from "../../../db/db-provider";
import { Comment } from "../../../models/comment"

const apartmentPostCollection: Collection<ApartmentPost> = provideMongoCollection('posts');

export const fetchAllApartmentPosts = (config?: { page: number, pageSize: number }): Promise<ApartmentPost[]> =>
    apartmentPostCollection.find({}, config ? { skip: (config.page - 1) * config.pageSize, limit: config.pageSize } : {}).toArray();

export const fetchApartmentPostByUser = (email: string): Promise<ApartmentPost[]> =>
    apartmentPostCollection.find({ userName: email }, {}).toArray();

export const insertApartmentPost = (userSight: ApartmentPost): Promise<InsertOneResult<ApartmentPost>> => apartmentPostCollection.insertOne(userSight);
export const insertCommentOnApartment = async (comment: Comment): Promise<UpdateResult> =>
    apartmentPostCollection.updateOne({ _id: new ObjectId(comment.apartmentPostId) }, { $push: { comments: comment } });

export const editApartmentPost = (sightId: string, userSight: ApartmentPost): Promise<UpdateResult<ApartmentPost>> =>
    apartmentPostCollection.updateOne({ _id: new ObjectId(sightId) }, { $set: userSight });

export const removeApartmentPost = (sightId: string): Promise<DeleteResult> =>
    apartmentPostCollection.deleteOne({ _id: new ObjectId(sightId) });
