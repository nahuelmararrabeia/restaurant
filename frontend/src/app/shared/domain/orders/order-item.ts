export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  notes: string | null;
  subtotal: number;
  version: number;
}
