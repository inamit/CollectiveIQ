import mongoose, {Schema, Types} from "mongoose";

export interface IChat {
    _id?: string;
    senderId: Types.ObjectId;
    receiverId: Types.ObjectId;
    message: string;
    timestamp: Date;
}

const chatSchema = new Schema<IChat>({

    senderId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: new Date()
    },
});

export const CHAT_RESOURCE_NAME = "Chats";
const Chat = mongoose.model<IChat>(CHAT_RESOURCE_NAME, chatSchema);


export default Chat;