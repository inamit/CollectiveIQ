import User from "./user.ts";

export default interface Comment {
    _id: string;
    content: string;
    userId: User;
    date: Date;
}
