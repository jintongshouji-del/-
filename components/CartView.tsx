
import React from 'react';
import { CartItem } from '../types';
import { Icons } from '../constants';

export const CartView: React.FC<{ items: CartItem[], onUpdateQuantity: (id: string, d: number) => void, onRemove: (id: string) => void, onCheckout: () => void, onGoShop: () => void }> = ({ items, onUpdateQuantity, onRemove, onCheckout, onGoShop }) => {
  const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  if (items.length === 0) return (
    <div className="max-w-md mx-auto py-20 text-center px-4">
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300"><Icons.Cart /></div>
      <h2 className="text-xl font-bold">购物车空空如也</h2>
      <button onClick={onGoShop} className="mt-6 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold">去商城逛逛</button>
    </div>
  );
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-black mb-6">您的购物车</h1>
      <div className="space-y-4">
        {items.map(i => (
          <div key={i.product.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
            <img src={i.product.image} className="w-16 h-16 rounded-lg object-cover" />
            <div className="flex-grow">
              <h4 className="font-bold text-slate-800">{i.product.name}</h4>
              <p className="text-indigo-600 font-bold">¥{i.product.price}</p>
            </div>
            <div className="flex items-center bg-slate-100 rounded-lg p-1">
              <button onClick={() => onUpdateQuantity(i.product.id, -1)} className="p-1"><Icons.Minus /></button>
              <span className="w-8 text-center font-bold">{i.quantity}</span>
              <button onClick={() => onUpdateQuantity(i.product.id, 1)} className="p-1"><Icons.Plus /></button>
            </div>
            <button onClick={() => onRemove(i.product.id)} className="text-rose-500"><Icons.Trash /></button>
          </div>
        ))}
      </div>
      <div className="mt-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <span className="text-slate-500 font-bold">总计金额</span>
          <span className="text-3xl font-black text-indigo-600">¥{total}</span>
        </div>
        <button onClick={onCheckout} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-indigo-100">立即下单</button>
      </div>
    </div>
  );
};
