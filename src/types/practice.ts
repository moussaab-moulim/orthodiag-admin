import { FileEntity } from "./quiz";

export interface Practice {
  id: number;
  address: string;
  city: string;
  image: FileEntity;
  latitude: number;
  longitude: number;
  name: string;
  email: string;
  rating: number;
}
