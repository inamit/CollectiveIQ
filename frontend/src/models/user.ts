import Post from "./post";

export default interface User {
  username: string;
  email: string;
  id: string;
  imageUrl?: string;
  posts?: Post[];
  accessToken?: string;
  refreshToken?: string;
}
