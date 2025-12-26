
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  attributes: string[];
  createdAt: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderLead {
  id: string;
  items: CartItem[];
  totalPrice: number;
  customerName: string;
  phone: string;
  wechat: string;
  timestamp: number;
  status: 'pending' | 'completed';
}

export type ViewType = 'shop' | 'admin' | 'cart';
