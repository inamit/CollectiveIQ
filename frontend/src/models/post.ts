import User from "./user";

export default interface Post {
  title: string;
  content: string;
  imageUrl?: string;
  _id: string;
  userId: User;
  date: string;
  likes: string[];
  dislikes: string[];
}
