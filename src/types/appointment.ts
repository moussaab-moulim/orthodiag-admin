import { Practice } from './Practices';

interface AppointmentCustomer {
  address1?: string;
  address2?: string;
  avatar?: string;
  city?: string;
  country?: string;
  email: string;
  name: string;
}

export interface AppointmentItem {
  id: string;
  billingCycle: 'daily' | 'weekly' | 'monthly' | 'yearly';
  currency: string;
  name: string;
  quantity: number;
  unitAmount: number;
}

export type AppointmentStatus =
  | 'canceled'
  | 'approuved'
  | 'pending'
  | 'rejected';

export interface Appointment {
  id: string;
  coupon?: string | null;
  createdAt: number;
  currency?: string;
  customer: AppointmentCustomer;
  items?: AppointmentItem[];
  number?: string;
  paymentMethod: string;
  promotionCode?: string;
  status: AppointmentStatus;
  totalAmount?: number;
  requestedDate: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  practice: Practice;
}
