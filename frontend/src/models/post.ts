import User from "./user";
import Comment from "./comment";
import Likeable from "./likeable.ts";

export default interface Post extends Likeable{
  title: string;
  content: string;
  imageUrl?: string;
  _id: string;
  userId: User;
  date: string;
  comments: Comment[];
}
