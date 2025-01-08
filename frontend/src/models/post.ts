import User from "./user";

export default interface Post {
  title: string;
  content: string;
  imageUrl?: string;
  _id: string;
  sender: User;
  date: string;
}
