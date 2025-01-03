
export interface ApartmentPost extends Likeable {
  id:string
  userName: string;
  title: string;
  imageUrl: string;
  description?: string;
  location?: string;
  comments?: Comment[];
}

/**
 * represents an object that can be liked or disliked
 */
export interface Likeable {
  timestampInMilliseconds: number;
  likesAmount?: number;
  dislikesAmount?: number;
}