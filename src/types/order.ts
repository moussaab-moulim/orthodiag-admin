import { PassPlan } from './product';

interface OrderCustomer {
  address1?: string;
  address2?: string;
  avatar?: string;
  city?: string;
  country?: string;
  email: string;
  name: string;
}

export interface OrderItem {
  id: string;
  billingCycle: 'daily' | 'weekly' | 'monthly' | 'yearly';
  currency: string;
  name: string;
  quantity: number;
  unitAmount: number;
}

export type OrderStatus = 'canceled' | 'complete' | 'pending' | 'rejected';

export interface Order {
  id: string;
  coupon?: string | null;
  createdAt: number;
  currency?: string;
  customer: OrderCustomer;
  items?: OrderItem[];
  number?: string;
  paymentMethod: string;
  promotionCode?: string;
  status: OrderStatus;
  totalAmount?: number;
}

export interface Pass {
  id: number;

  purchaseDate: Date;

  stripeOrderId: string;

  hash: string | null;

  status: PassStatus;

  passPlanStripeId: string;

  passPlan: PassPlan;
  user: { stripeCustomerId: string };

  createdAt: Date;

  updatedAt: Date;

  deletedAt: Date;
}

export interface PassStatus {
  id: number;
  name: string;
}
