export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  isAvailable: boolean;
  version: number;
  createdAt: string;
  updatedAt: string | null;
}
