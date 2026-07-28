export interface AddOrderItemRequest {
  productId: number;
  quantity: number;
  notes: string | null;
  version: number;
}
