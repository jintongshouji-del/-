
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[]; // 2-4张图片
  category: string; // 产品分类
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
