export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string | null;
}