
export interface Inquiry {
  id?: number;
  user_id: number;
  email: string;
  name: string;
  phone: string;
  receiver_email: string;
  receiver_name: string;
  receiver_phone: string;
  message: string;
  property_id: number;
}
