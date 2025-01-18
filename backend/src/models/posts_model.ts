import mongoose, { Schema, Types } from "mongoose";
import { USER_RESOURCE_NAME } from "./users_model";
import { Likeable } from "./likeable";

export interface IPost extends Likeable {
  _id: Types.ObjectId;
  title: string;
  content: string;
  userId: Types.ObjectId;
  imageUrl?: string;
  date?: Date;
}

const postSchema = new Schema<IPost>({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: USER_RESOURCE_NAME,
    required: true,
  },
  imageUrl: {
    type: String,
    required: false,
  },
  likes: {
    type: [Schema.Types.ObjectId],
    default: [],
    ref: USER_RESOURCE_NAME,
  },
  dislikes: {
    type: [Schema.Types.ObjectId],
    default: [],
    ref: USER_RESOURCE_NAME,
  },
  date: {
    type: Date ,
    default: new Date(),
  },
});

export const POST_RESOURCE_NAME = "Post";
const Post = mongoose.model<IPost>(POST_RESOURCE_NAME, postSchema);

export default Post;
