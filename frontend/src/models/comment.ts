import User from "./user.ts";
import Post from "./post.ts";

export default interface Comment {
    _id: string;
    postID: Post;
    content: string;
    userId: User;
    date: Date;
}
