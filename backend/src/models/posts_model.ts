import mongoose, { Schema, Types } from "mongoose";
import { USER_RESOURCE_NAME } from "./users_model";

export interface IPost {
  _id: Types.ObjectId,
  content: string;
  sender: Types.ObjectId;
}

const postSchema = new Schema<IPost>({
  content: {
    type: String,
    required: true,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: USER_RESOURCE_NAME,
    required: true,
  },
});

export const POST_RESOURCE_NAME = "Post";
const Post = mongoose.model<IPost>(POST_RESOURCE_NAME, postSchema);

export default Post;