import mongoose, { Schema, Types } from "mongoose";

export interface ITag {
    _id: Types.ObjectId;
    name: string;
    bestAi: string;
    numOfPosts: number;
}

const tagSchema = new Schema<ITag>({
    name: {
        type: String,
        required: true,
    },
    bestAi: {
        type: String,
        required: false
    },
    numOfPosts: {
        type: Number,
        default: 0
    }

});

export const Tag_RESOURCE_NAME = "Tag";
const Tag = mongoose.model<ITag>(Tag_RESOURCE_NAME, tagSchema);

export default Tag;
