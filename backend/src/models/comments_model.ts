import mongoose, { Schema, Types } from "mongoose";
import { USER_RESOURCE_NAME } from "./users_model";
import { POST_RESOURCE_NAME } from "./posts_model";

export interface IComment {
  _id: Types.ObjectId;
  postID: Types.ObjectId;
  content: string;
  sender: Types.ObjectId;
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
  sender: {
    type: Schema.Types.ObjectId,
    ref: USER_RESOURCE_NAME,
    required: true,
  },
});

export const COMMENT_RESOURCE_NAME = "Comment";
const Comment = mongoose.model<IComment>(COMMENT_RESOURCE_NAME, commentSchema);

export default Comment;
