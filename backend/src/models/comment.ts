import {Likeable} from "./apartmentPost";

export interface Comment extends Likeable {
  apartmentPostId: string;
  authorUsername: string;
  text: string;
}