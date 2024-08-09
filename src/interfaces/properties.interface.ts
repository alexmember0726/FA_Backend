import { bool } from "aws-sdk/clients/signer";

export interface Property {
  id?: number;
  userid: number;
  address: string;
  propertyType: string;
  description: string;
  contactName: string;
  contactPhone: string;
  price: number;
  notes?: string;
  rating?: number;
  createdAt?: string;
  updatedAt?: string;
  lat?: number;
  lon?: number;
  published: number;
  customFields?: string;
  image_keys?: string;
  lotSize?: number;
  unit?: string;
  phoneNumber?: string;
  remodeled?: string;
  yearBuilt?: string;
  bedrooms?: number;
  bathrooms?: number;
  numberOfStories?: number;
  marketShared?: bool;
  fee?: string;
  referral_fee: string;
  sharing_option: number;
}

// export interface PropertyImage {
//   id?: number,
//   url: string,
//   property_id: number
// }

export interface PropertySharing {
  id?: number;
  field: string;
  value: boolean;
  property_id: number;
}
