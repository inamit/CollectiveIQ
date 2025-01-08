import User from "./user";

export default interface Post {
  title: string;
  content: string;
  imageUrl?: string;
  id: string;
  sender: User;
  date: Date;
}
