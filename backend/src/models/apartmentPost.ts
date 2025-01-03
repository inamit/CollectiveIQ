
export interface ApartmentPost {
  id:string
  userName: string;
  title: string;
  imageUrl: string;
  description?: string;
  location?: string;
  comments?: Comment[];
}

