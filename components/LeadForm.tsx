
import React, { useState } from 'react';
import { CartItem } from '../types';

export const LeadForm: React.FC<{ items: CartItem[], onClose: () => void, onSubmit: (d: any) => void }> = ({ items, onClose, onSubmit }) => {
  const [f, setF] = useState({ name: '', phone: '', wechat: '' });
  const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl">
        <h2 className="text-xl font-black mb-1">填写收货信息</h2>
        <p className="text-sm text-slate-500 mb-6">共 {items.length} 件商品，需付 ¥{total}</p>
        <form onSubmit={e => { e.preventDefault(); onSubmit(f); }} className="space-y-4">
          <input required placeholder="您的姓名" className="w-full px-4 py-3 rounded-xl border" value={f.name} onChange={e => setF({...f, name: e.target.value})} />
          <input required pattern="[0-9]{11}" placeholder="11位手机号" className="w-full px-4 py-3 rounded-xl border" value={f.phone} onChange={e => setF({...f, phone: e.target.value})} />
          <input required placeholder="您的微信号" className="w-full px-4 py-3 rounded-xl border" value={f.wechat} onChange={e => setF({...f, wechat: e.target.value})} />
          <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black">确认下单</button>
          <button type="button" onClick={onClose} className="w-full text-slate-400 font-bold">返回修改</button>
        </form>
      </div>
    </div>
  );
};
