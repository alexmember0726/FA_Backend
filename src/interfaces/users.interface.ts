export interface User {
  otp: string
  id?: number;
  email: string;
  name: string;
  address: string;
  phone: string;
  license: string;
  image: string;
  role:number;
  is_active:number;
}

export interface UserRating {
  id?: number;
  receiver_id: number;
  rater_id: number;
  title: string;
  rating: number;
  description: string;
  createdAt?: string;
}
