import { OrderItem } from './order-item';
import { OrderStatus } from './order-status';

export interface Order {
  id: number;
  tableId: number;
  tableNumber: number;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  orderedAt: string;
  updatedAt: string;
}