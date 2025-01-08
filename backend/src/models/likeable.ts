import mongoose, {Schema, Types} from "mongoose";

export interface Likeable {
    likes?: mongoose.Types.ObjectId[];
    dislikes?: mongoose.Types.ObjectId[];
}