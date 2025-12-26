
import React from 'react';
import { CartItem } from '../types';
import { Icons } from '../constants';

export const CartView: React.FC<{ items: CartItem[], onUpdateQuantity: (id: string, d: number) => void, onRemove: (id: string) => void, onCheckout: () => void, onGoShop: () => void }> = ({ items, onUpdateQuantity, onRemove, onCheckout, onGoShop }) => {
  const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  if (items.length === 0) return (
    <div className="max-w-md mx-auto py-20 text-center px-4">
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-200"><Icons.Cart /></div>
      <h2 className="text-xl font-bold">预订清单还是空的</h2>
      <button onClick={onGoShop} className="mt-6 bg-orange-600 text-white px-8 py-3 rounded-xl font-bold">去选购花炮</button>
    </div>
  );
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-black mb-6">我的选购清单</h1>
      <div className="space-y-4">
        {items.map(i => (
          <div key={i.product.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
            <img src={i.product.image} className="w-16 h-16 rounded-lg object-cover" />
            <div className="flex-grow">
              <h4 className="font-bold text-slate-800">{i.product.name}</h4>
              <p className="text-orange-600 font-bold">¥{i.product.price}</p>
            </div>
            <div className="flex items-center bg-slate-100 rounded-lg p-1">
              <button onClick={() => onUpdateQuantity(i.product.id, -1)} className="p-1 hover:text-orange-600"><Icons.Minus /></button>
              <span className="w-8 text-center font-bold">{i.quantity}</span>
              <button onClick={() => onUpdateQuantity(i.product.id, 1)} className="p-1 hover:text-orange-600"><Icons.Plus /></button>
            </div>
            <button onClick={() => onRemove(i.product.id)} className="text-rose-500 p-2"><Icons.Trash /></button>
          </div>
        ))}
      </div>
      <div className="mt-8 bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <span className="text-slate-500 font-bold">预估合计</span>
          <span className="text-3xl font-black text-orange-600">¥{total}</span>
        </div>
        <button onClick={onCheckout} className="w-full bg-orange-600 text-white py-5 rounded-2xl font-black text-xl shadow-lg shadow-orange-100">确认并填写资料</button>
      </div>
    </div>
  );
};
