
import React, { useState, useRef } from 'react';
import { Product, OrderLead } from '../types';
import { Icons } from '../constants';

interface ProductForm {
  name: string;
  price: string;
  description: string;
  image: string;
  attributes: string;
}

export const AdminPanel: React.FC<{ 
  products: Product[], 
  leads: OrderLead[], 
  onLogout: () => void, 
  onCopyLead: (l: OrderLead) => void, 
  onAddProduct: (p: Omit<Product, 'id' | 'createdAt'>) => void, 
  onDeleteProduct: (id: string) => void, 
  onClearLeads: () => void,
  onUpdateLeadStatus?: (id: string, status: 'pending' | 'completed') => void
}> = ({ products, leads, onLogout, onCopyLead, onAddProduct, onDeleteProduct, onClearLeads, onUpdateLeadStatus }) => {
  const [tab, setTab] = useState<'p'|'l'>('p');
  const [showAddModal, setShowAddModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<ProductForm>({
    name: '',
    price: '',
    description: '',
    image: '',
    attributes: '类型: 烟花, 燃放建议: 请在开阔地带使用'
  });

  const totalRevenue = leads.reduce((acc, curr) => acc + curr.totalPrice, 0);
  const todayOrders = leads.filter(l => new Date(l.timestamp).toDateString() === new Date().toDateString()).length;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('图片太大啦！请上传小于 2MB 的图片');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(form.price);
    if (!form.name || isNaN(priceNum) || !form.image) {
      alert('请检查表单填写是否完整');
      return;
    }
    onAddProduct({
      name: form.name,
      price: priceNum,
      description: form.description,
      image: form.image,
      attributes: form.attributes.split(/[,，]/).map(s => s.trim()).filter(Boolean)
    });
    setForm({ name: '', price: '', description: '', image: '', attributes: '类型: 烟花, 燃放建议: 请在开阔地带使用' });
    setShowAddModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-orange-100">
            <Icons.Dashboard />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">商户中心</h1>
            <p className="text-sm text-slate-400 font-medium tracking-wide">binbinaidapao 的烟花生意管家</p>
          </div>
          <button onClick={onLogout} title="退出登录" className="ml-4 p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
            <Icons.Logout />
          </button>
        </div>

        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 w-full lg:w-auto">
          <button onClick={() => setTab('p')} className={`flex-1 lg:flex-none px-8 py-3 rounded-xl font-black text-sm transition-all ${tab === 'p' ? 'bg-orange-600 text-white shadow-lg shadow-orange-100' : 'text-slate-500 hover:bg-slate-50'}`}>商品库 ({products.length})</button>
          <button onClick={() => setTab('l')} className={`flex-1 lg:flex-none px-8 py-3 rounded-xl font-black text-sm transition-all ${tab === 'l' ? 'bg-orange-600 text-white shadow-lg shadow-orange-100' : 'text-slate-500 hover:bg-slate-50'}`}>订单流 ({leads.length})</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">成交总额</p>
          <p className="text-3xl font-black text-orange-600">¥ {totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">今日预订</p>
          <p className="text-3xl font-black text-slate-800">{todayOrders} <span className="text-sm font-medium text-slate-400">单</span></p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">管理员署名</p>
            <p className="text-sm font-black text-orange-500">binbinaidapao</p>
          </div>
          <button onClick={() => { if(confirm('清空所有订单记录？')) onClearLeads(); }} className="text-xs font-bold text-rose-500 bg-rose-50 px-3 py-2 rounded-lg">清空记录</button>
        </div>
      </div>

      {tab === 'p' ? (
        <div className="animate-in slide-in-from-bottom-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-slate-800">花炮库存</h2>
            <button onClick={() => setShowAddModal(true)} className="bg-orange-600 text-white px-6 py-3 rounded-2xl text-sm font-black flex items-center gap-2 shadow-xl shadow-orange-100">
              <Icons.Plus /> 上架新花炮
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(p => (
              <div key={p.id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm group">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4"><img src={p.image} className="w-full h-full object-cover" alt={p.name} /></div>
                <p className="font-black text-slate-800 truncate">{p.name}</p>
                <p className="text-orange-600 font-bold mt-1">¥{p.price}</p>
                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <span className="text-[10px] text-slate-300">ID: {p.id.slice(-6)}</span>
                  <button onClick={() => onDeleteProduct(p.id)} className="text-slate-300 hover:text-rose-500"><Icons.Trash /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* 订单流表格保持原有逻辑，配色调整为 orange */
        <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr><th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">客户/联系方式</th><th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">总额</th><th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">操作</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {leads.map(l => (
                  <tr key={l.id} className="hover:bg-slate-50/50">
                    <td className="px-8 py-6">
                      <div className="font-black text-slate-900">{l.customerName}</div>
                      <div className="text-xs text-orange-600 font-bold mt-1">{l.phone} / {l.wechat}</div>
                    </td>
                    <td className="px-8 py-6 text-right font-black text-orange-600 text-lg">¥{l.totalPrice}</td>
                    <td className="px-8 py-6 text-right">
                      <button onClick={() => onCopyLead(l)} className="bg-orange-600 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-orange-100">复制资料</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl p-10">
            <h2 className="text-2xl font-black mb-8 text-slate-900">新花炮上架</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 rounded-[32px] p-8 text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all"
              >
                {form.image ? <img src={form.image} className="h-32 mx-auto rounded-xl" /> : <div className="text-orange-600 flex flex-col items-center"><Icons.Camera /><p className="mt-2 text-sm font-bold">点此拍摄或选图</p></div>}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>
              <input required placeholder="花炮名称" className="w-full px-5 py-4 rounded-2xl border" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              <input required type="number" placeholder="价格" className="w-full px-5 py-4 rounded-2xl border" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
              <button type="submit" className="w-full bg-orange-600 text-white py-5 rounded-2xl font-black text-lg">确认发布 (署名: binbinaidapao)</button>
              <button type="button" onClick={() => setShowAddModal(false)} className="w-full text-slate-400 font-bold">取消</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
