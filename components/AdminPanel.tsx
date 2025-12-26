
import React, { useState } from 'react';
import { Product, OrderLead } from '../types';
import { Icons } from '../constants';

export const AdminPanel: React.FC<{ products: Product[], leads: OrderLead[], onLogout: () => void, onCopyLead: (l: OrderLead) => void, onAddProduct: (p: any) => void, onDeleteProduct: (id: string) => void, onClearLeads: () => void }> = ({ products, leads, onLogout, onCopyLead, onAddProduct, onDeleteProduct, onClearLeads }) => {
  const [tab, setTab] = useState<'p'|'l'>('p');
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2"><h1 className="text-2xl font-black">管理控制台</h1><button onClick={onLogout} className="text-slate-400 hover:text-rose-500"><Icons.Logout /></button></div>
        <div className="flex bg-slate-200/50 p-1 rounded-xl">
          <button onClick={() => setTab('p')} className={`px-4 py-1.5 rounded-lg font-bold text-sm ${tab === 'p' ? 'bg-white shadow' : ''}`}>商品</button>
          <button onClick={() => setTab('l')} className={`px-4 py-1.5 rounded-lg font-bold text-sm ${tab === 'l' ? 'bg-white shadow' : ''}`}>订单 ({leads.length})</button>
        </div>
      </div>
      {tab === 'p' ? (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {products.map(p => (
            <div key={p.id} className="bg-white p-3 rounded-xl border flex items-center gap-3">
              <img src={p.image} className="w-10 h-10 rounded object-cover" />
              <div className="flex-grow min-w-0"><p className="font-bold text-sm truncate">{p.name}</p></div>
              <button onClick={() => onDeleteProduct(p.id)} className="text-rose-400"><Icons.Trash /></button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b"><tr><th className="px-4 py-3">客户</th><th className="px-4 py-3">联系方式</th><th className="px-4 py-3">订单金额</th><th className="px-4 py-3 text-right">操作</th></tr></thead>
            <tbody className="divide-y">
              {leads.map(l => (
                <tr key={l.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-bold">{l.customerName}</td>
                  <td className="px-4 py-3">{l.phone}<br/><span className="text-xs text-slate-400">微信号: {l.wechat}</span></td>
                  <td className="px-4 py-3 font-black text-indigo-600">¥{l.totalPrice}</td>
                  <td className="px-4 py-3 text-right"><button onClick={() => onCopyLead(l)} className="text-indigo-600 font-bold">复制信息</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
