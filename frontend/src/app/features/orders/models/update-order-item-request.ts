export interface UpdateOrderItemRequest {
  quantity: number;
  notes: string | null;
  version: number;
  itemVersion: number;
}
