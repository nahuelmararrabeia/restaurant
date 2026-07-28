import { TableStatus } from './table-status';

export interface RestaurantTable {
  id: number;
  number: number;
  capacity: number;
  status: TableStatus;
  activeOrderId: number | null;
  positionX: number | null;
  positionY: number | null;
}
