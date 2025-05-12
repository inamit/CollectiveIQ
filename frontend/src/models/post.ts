import User from "./user";
import Comment from "./comment";
import Likeable from "./likeable.ts";

export default interface Post extends Likeable {
  title: string;
  content: string;
  imageUrl?: string;
  userId: User;
  date: string;
  tag: string;
  comments: Comment[];
}
