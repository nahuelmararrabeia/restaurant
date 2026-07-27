export type RecentOrderStatus =
  | 'pending'
  | 'preparing'
  | 'ready'
  | 'delivered'
  | 'cancelled';

export interface RecentOrder {
  id: number;
  tableNumber: number;
  status: RecentOrderStatus;
  total: number;
  orderedAt: Date;
}