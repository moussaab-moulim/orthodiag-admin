import { FileEntity } from './quiz';

export interface User {
  id: string;
  email: string;
  provider: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  conditionsAccepted: boolean;
  phoneNumber: string;
  photo: FileEntity;
  role: { id: number; name: string };
  status: { id: number; name: string };

  [key: string]: any;
}
