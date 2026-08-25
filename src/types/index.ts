export interface Product {
  id: string;
  name: string;
  desc: string;
  price: number;
  cat: 'combo' | 'special' | 'drink';
  img: string;
  badge?: string;
  includesBuffet?: boolean; // Novo flag para destacar o self-service
}

export type OrderType = 'mesa' | 'delivery';

export interface OrderPayload {
  type: OrderType;
  tableNumber?: string;
  address?: string;
  items: Record<string, number>;
  total: number;
}