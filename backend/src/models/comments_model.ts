import mongoose, { Schema, Types } from "mongoose";
import { USER_RESOURCE_NAME } from "./users_model";
import { POST_RESOURCE_NAME } from "./posts_model";
import {Likeable} from "./likeable";

export interface IComment extends Likeable {
  _id: Types.ObjectId;
  postID: Types.ObjectId;
  content: string;
  userId: Types.ObjectId;
  date:Date;
}

const commentSchema = new Schema<IComment>({
  postID: {
    type: Schema.Types.ObjectId,
    ref: POST_RESOURCE_NAME,
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
  date: {
    type: Date ,
    default: new Date(),
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
});

export const COMMENT_RESOURCE_NAME = "Comment";
const Comment = mongoose.model<IComment>(COMMENT_RESOURCE_NAME, commentSchema);

export default Comment;
