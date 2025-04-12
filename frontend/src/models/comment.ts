import User from "./user.ts";
import Likeable from "./likeable.ts";

export default interface Comment extends Likeable{
    _id: string;
    content: string;
    userId: User;
    date: Date;
    postID: string;
}
