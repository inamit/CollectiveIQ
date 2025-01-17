import mongoose, {Schema, Types} from "mongoose";

export interface IChat {
    _id?: string;
    senderId: Types.ObjectId;
    receiverId: Types.ObjectId;
    content: string;
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
    content: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        required: true,
    },
});

export const CHAT_RESOURCE_NAME = "Chats";
const Chat = mongoose.model<IChat>(CHAT_RESOURCE_NAME, chatSchema);


export default Chat;