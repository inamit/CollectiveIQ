import User from "./user.ts";

export default interface Chat {
    _id: string;
    message: string;
    receiverId: User;
    senderId: User;
    date: Date;
    isAi?: boolean;
}
