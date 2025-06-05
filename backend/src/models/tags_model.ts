import mongoose, { Schema, Types } from "mongoose";
import { USER_RESOURCE_NAME } from "./users_model";

export interface ITag {
    _id: Types.ObjectId;
    name: string;
    bestAi: Types.ObjectId;
    numOfPosts: number;
}

const tagSchema = new Schema<ITag>({
    name: {
        type: String,
        required: true,
    },
    bestAi: {
        type: Schema.Types.ObjectId,
        ref: USER_RESOURCE_NAME,
        default: '67f53a54331547e7685515b8'
    },
    numOfPosts: {
        type: Number,
        default: 0
    }

});

export const TAG_RESOURCE_NAME = "Tag";
const Tag = mongoose.model<ITag>(TAG_RESOURCE_NAME, tagSchema);

export default Tag;
