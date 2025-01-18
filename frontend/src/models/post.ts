import User from "./user";
import Comment from "./comment";

export default interface Post {
  title: string;
  content: string;
  imageUrl?: string;
  _id: string;
  userId: User;
  date: string;
  likes: string[];
  dislikes: string[];
  comments: Comment[];
}
