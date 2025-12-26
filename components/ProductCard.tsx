
import React from 'react';
import { Product } from '../types';
import { Icons } from '../constants';

export const ProductCard: React.FC<{ product: Product, onAddToCart: (p: Product) => void }> = ({ product, onAddToCart }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full group">
    <div className="relative aspect-square overflow-hidden bg-slate-100">
      <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
      <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 rounded-lg text-sm font-black text-orange-600 shadow-sm">¥{product.price}</div>
    </div>
    <div className="p-4 flex flex-col flex-grow">
      <h3 className="font-bold text-slate-800 line-clamp-1">{product.name}</h3>
      <p className="text-xs text-slate-500 mt-1 line-clamp-2 h-8">{product.description}</p>
      <div className="mt-auto pt-4">
        <button onClick={() => onAddToCart(product)} className="w-full bg-orange-600 text-white py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-orange-700 active:scale-95 transition-all">
          <Icons.Cart />加入预订清单
        </button>
      </div>
    </div>
  </div>
);
