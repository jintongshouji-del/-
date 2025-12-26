
import React, { useState, useRef } from 'react';
import { Product, OrderLead } from '../types';
import { Icons } from '../constants';

export const AdminPanel: React.FC<{ 
  products: Product[], 
  leads: OrderLead[], 
  onLogout: () => void, 
  onCopyLead: (l: OrderLead) => void, 
  onAddProduct: (p: Omit<Product, 'id' | 'createdAt'>) => void, 
  onUpdateProduct: (p: Product) => void,
  onDeleteProduct: (id: string) => void, 
  onClearLeads: () => void,
  onUpdateLeadStatus: (id: string, status: 'pending' | 'completed') => void
}> = ({ products, leads, onLogout, onCopyLead, onAddProduct, onUpdateProduct, onDeleteProduct, onClearLeads, onUpdateLeadStatus }) => {
  const [tab, setTab] = useState<'p'|'l'>('p');
  const [showModal, setShowModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [saveEffect, setSaveEffect] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [form, setForm] = useState({
    name: '', price: '', category: '', description: '', images: [] as string[], attributes: ''
  });

  const handleStartEdit = (p: Product) => {
    setEditingProductId(p.id);
    setForm({
      name: p.name, price: p.price.toString(), category: p.category, description: p.description,
      images: p.images, attributes: p.attributes.join(', ')
    });
    setShowModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setForm(prev => ({ ...prev, images: [...prev.images, reader.result as string].slice(0, 4) }));
      reader.readAsDataURL(file);
    });
  };

  const executeSubmit = (shouldClose: boolean) => {
    if (!form.name || !form.price) return alert('请填写名称和价格');
    
    const productData = {
      name: form.name.trim(),
      price: parseFloat(form.price),
      category: form.category.trim() || '默认',
      description: form.description.trim(),
      images: form.images,
      attributes: form.attributes.split(/[,，]/).map(s => s.trim()).filter(Boolean)
    };

    if (editingProductId) {
      const original = products.find(p => p.id === editingProductId);
      if (original) onUpdateProduct({ ...original, ...productData });
    } else {
      onAddProduct(productData);
    }
    
    // 视觉反馈：显示绿色闪烁或提示
    setSaveEffect(true);
    setTimeout(() => setSaveEffect(false), 1000);

    if (shouldClose) {
      setShowModal(false);
      setEditingProductId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white"><Icons.Dashboard /></div>
          <div>
            <h1 className="text-xl font-black">管理后台</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Admin: Fugui</p>
          </div>
        </div>
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100">
          <button onClick={() => setTab('p')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${tab === 'p' ? 'bg-orange-600 text-white' : 'text-slate-400'}`}>产品</button>
          <button onClick={() => setTab('l')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${tab === 'l' ? 'bg-orange-600 text-white' : 'text-slate-400'}`}>订单</button>
          <button onClick={onLogout} className="ml-1 p-2 text-rose-500"><Icons.Logout /></button>
        </div>
      </div>

      {tab === 'p' ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-slate-800">在售商品 ({products.length})</h2>
            <button onClick={() => { setEditingProductId(null); setForm({name:'', price:'', category:'', description:'', images:[], attributes:''}); setShowModal(true); }} className="bg-orange-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shadow-lg shadow-orange-100">
              <Icons.Plus /> 上架新品
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {products.map(p => (
              <div key={p.id} className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm relative group overflow-hidden">
                <img src={p.images[0]} className="w-full aspect-square object-cover rounded-xl mb-2" />
                <p className="font-bold text-xs truncate">{p.name}</p>
                <p className="text-orange-600 font-bold text-xs">¥{p.price}</p>
                <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleStartEdit(p)} className="w-2/3 py-2 bg-indigo-600 text-white rounded-lg text-[10px] font-bold">编辑修改</button>
                  <button onClick={() => confirm('确定删除？') && onDeleteProduct(p.id)} className="w-2/3 py-2 bg-rose-500 text-white rounded-lg text-[10px] font-bold">下架产品</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-slate-800">收到的订单 ({leads.length})</h2>
            <button onClick={() => confirm('确定清空？') && onClearLeads()} className="text-[10px] font-bold text-rose-500 bg-rose-50 px-3 py-1.5 rounded-lg">清空记录</button>
          </div>
          {leads.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 text-sm">暂无订单数据</div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="p-4 font-bold text-slate-400">客户</th>
                    <th className="p-4 font-bold text-slate-400">订单内容</th>
                    <th className="p-4 font-bold text-slate-400 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {leads.map(l => (
                    <tr key={l.id} className={l.status === 'completed' ? 'opacity-50' : ''}>
                      <td className="p-4">
                        <div className="font-bold">{l.customerName}</div>
                        <div className="text-[10px] text-slate-400">{l.phone}</div>
                        <div className="text-[10px] text-orange-600 font-bold">微信: {l.wechat}</div>
                      </td>
                      <td className="p-4">
                        {l.items.map(i => <div key={i.product.id}>{i.product.name} x{i.quantity}</div>)}
                        <div className="font-bold mt-1 text-orange-600">¥{l.totalPrice}</div>
                      </td>
                      <td className="p-4 text-right flex flex-col gap-2 items-end">
                        <button onClick={() => onCopyLead(l)} className="text-slate-400 hover:text-orange-600"><Icons.Copy /></button>
                        <button onClick={() => onUpdateLeadStatus(l.id, l.status === 'pending' ? 'completed' : 'pending')} className={`px-3 py-1.5 rounded-lg font-bold text-[10px] ${l.status === 'pending' ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                          {l.status === 'pending' ? '标记完成' : '已归档'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-xl rounded-[32px] shadow-2xl p-6 sm:p-8 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-slate-300 hover:text-slate-600"><Icons.Close /></button>
            <h2 className="text-xl font-black mb-6">{editingProductId ? '修改商品信息' : '发布新商品'}</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-2">
                {form.images.map((img, idx) => (
                  <div key={idx} className="aspect-square rounded-lg border overflow-hidden relative">
                    <img src={img} className="w-full h-full object-cover" />
                    <button onClick={() => setForm(v => ({...v, images: v.images.filter((_, i) => i !== idx)}))} className="absolute top-0 right-0 bg-rose-500 text-white p-0.5 rounded-bl">×</button>
                  </div>
                ))}
                {form.images.length < 4 && (
                  <button onClick={() => fileInputRef.current?.click()} className="aspect-square border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-300 hover:border-orange-500">+</button>
                )}
              </div>
              <input type="file" hidden multiple ref={fileInputRef} onChange={handleFileChange} />
              
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="产品名称" className="px-4 py-3 rounded-xl border bg-slate-50 w-full text-sm font-bold" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                <input placeholder="分类 (如: 手持)" className="px-4 py-3 rounded-xl border bg-slate-50 w-full text-sm font-bold" value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
              </div>
              <input type="number" placeholder="价格 (¥)" className="px-4 py-3 rounded-xl border bg-slate-50 w-full text-sm font-bold" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
              <textarea placeholder="产品描述..." rows={2} className="px-4 py-3 rounded-xl border bg-slate-50 w-full text-sm" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              <input placeholder="规格参数 (逗号分隔)" className="px-4 py-3 rounded-xl border bg-slate-50 w-full text-sm" value={form.attributes} onChange={e => setForm({...form, attributes: e.target.value})} />
              
              <div className="flex gap-3 pt-4">
                <button onClick={() => executeSubmit(false)} className={`flex-1 py-4 rounded-xl font-bold text-sm transition-all ${saveEffect ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  {saveEffect ? '保存成功!' : '保存不关闭'}
                </button>
                <button onClick={() => executeSubmit(true)} className="flex-[2] py-4 bg-orange-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-100">保存并关闭窗口</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
