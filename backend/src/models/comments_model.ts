import mongoose, { Schema, Types } from "mongoose";
import { USER_RESOURCE_NAME } from "./users_model";
import { POST_RESOURCE_NAME } from "./posts_model";

export const COMMENT_RESOURCE_NAME = "Comment";

export interface IComment {
  _id: Types.ObjectId;
  postID: Types.ObjectId;
  parentCommentID?: Types.ObjectId;
  content: string;
  userId: Types.ObjectId;
  date: Date;
}

const commentSchema = new Schema<IComment>({
  postID: {
    type: Schema.Types.ObjectId,
    ref: POST_RESOURCE_NAME,
    required: true,
  },
  parentCommentID: {
    type: Schema.Types.ObjectId,
    ref: COMMENT_RESOURCE_NAME,
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
    type: Date,
    default: new Date(),
  },
});

const Comment = mongoose.model<IComment>(COMMENT_RESOURCE_NAME, commentSchema);

export default Comment;
