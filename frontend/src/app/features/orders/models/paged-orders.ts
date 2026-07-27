import { Order } from '../../../shared/domain/orders/order';

export interface PagedOrders {
  items: Order[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
