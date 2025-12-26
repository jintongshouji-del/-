
import React, { useState } from 'react';
import { CartItem } from '../types';

export const LeadForm: React.FC<{ items: CartItem[], onClose: () => void, onSubmit: (d: any) => void }> = ({ items, onClose, onSubmit }) => {
  const [f, setF] = useState({ name: '', phone: '', wechat: '' });
  const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-md rounded-[40px] p-8 shadow-2xl animate-in zoom-in-95">
        <h2 className="text-2xl font-black mb-1">烟花预订信息</h2>
        <p className="text-sm text-slate-500 mb-8">富贵 (Fugui) 将为您准备 {items.length} 种精选花炮</p>
        <form onSubmit={e => { e.preventDefault(); onSubmit(f); }} className="space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 ml-1">收货姓名</label>
            <input required placeholder="怎么称呼您？" className="w-full px-5 py-4 rounded-2xl border bg-slate-50 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" value={f.name} onChange={e => setF({...f, name: e.target.value})} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 ml-1">联系电话</label>
            <input required pattern="[0-9]{11}" placeholder="11位手机号" className="w-full px-5 py-4 rounded-2xl border bg-slate-50 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" value={f.phone} onChange={e => setF({...f, phone: e.target.value})} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 ml-1">微信号</label>
            <input required placeholder="方便沟通配送详情" className="w-full px-5 py-4 rounded-2xl border bg-slate-50 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" value={f.wechat} onChange={e => setF({...f, wechat: e.target.value})} />
          </div>
          <div className="pt-4 space-y-3">
            <button type="submit" className="w-full bg-orange-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-orange-100">提交预订意向 (¥{total})</button>
            <button type="button" onClick={onClose} className="w-full text-slate-400 font-bold py-2">返回修改清单</button>
          </div>
        </form>
      </div>
    </div>
  );
};
