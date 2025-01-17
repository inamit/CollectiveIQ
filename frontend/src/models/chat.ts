import User from "./user.ts";

export default interface Chat {
    _id: string;
    content: string;
    receiverId: User;
    senderId: User;
    date: Date;
}
