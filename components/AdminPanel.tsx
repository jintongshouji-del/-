
import React, { useState, useRef, useEffect } from 'react';
import { Product, OrderLead } from '../types';
import { Icons } from '../constants';

interface ProductForm {
  name: string;
  price: string;
  category: string;
  description: string;
  images: string[];
  attributes: string;
}

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [form, setForm] = useState<ProductForm>({
    name: '', price: '', category: '', description: '', images: [], attributes: '类型: 烟花, 燃放建议: 请在开阔地带使用'
  });

  const handleStartEdit = (p: Product) => {
    setEditingProductId(p.id);
    setForm({
      name: p.name,
      price: p.price.toString(),
      category: p.category,
      description: p.description,
      images: p.images,
      attributes: p.attributes.join(', ')
    });
    setShowModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + form.images.length > 4) { alert('单品最多支持4张展示图'); return; }
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setForm(prev => ({ ...prev, images: [...prev.images, reader.result as string] }));
      reader.readAsDataURL(file);
    });
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProductId(null);
    setForm({ name: '', price: '', category: '', description: '', images: [], attributes: '类型: 烟花, 燃放建议: 请在开阔地带使用' });
  };

  const executeSubmit = (shouldClose: boolean) => {
    if (form.images.length < 2) { alert('请至少上传2张产品图片以展示细节'); return; }
    const priceNum = parseFloat(form.price);
    if (isNaN(priceNum)) { alert('请输入有效的价格数字'); return; }

    const productData = {
      name: form.name.trim(),
      price: priceNum,
      category: (form.category || '默认').trim(),
      description: form.description.trim(),
      images: form.images,
      attributes: form.attributes.split(/[,，]/).map(s => s.trim()).filter(Boolean)
    };

    if (editingProductId) {
      const original = products.find(p => p.id === editingProductId);
      if (original) {
        onUpdateProduct({ ...original, ...productData });
      }
    } else {
      onAddProduct(productData);
    }
    
    if (shouldClose) {
      closeModal();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-24 sm:pb-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 sm:mb-12 gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-600 rounded-2xl sm:rounded-[20px] flex items-center justify-center text-white shadow-xl shadow-orange-100"><Icons.Dashboard /></div>
          <div>
            <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">后台管理中心</h1>
            <p className="text-[10px] sm:text-sm text-slate-400 font-bold uppercase tracking-widest">Operator: 富贵 (Fugui)</p>
          </div>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 self-stretch sm:self-auto">
          <button onClick={() => setTab('p')} className={`flex-1 sm:flex-none px-4 sm:px-8 py-3 rounded-xl text-xs sm:text-sm font-black transition-all ${tab === 'p' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`} title="管理现有库存及上架新产品">产品管理</button>
          <button onClick={() => setTab('l')} className={`flex-1 sm:flex-none px-4 sm:px-8 py-3 rounded-xl text-xs sm:text-sm font-black transition-all ${tab === 'l' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`} title="查看并处理客户提交的实时订单线索">订单流中心</button>
          <button onClick={onLogout} title="安全退出管理后台" className="ml-2 p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all active:scale-90"><Icons.Logout /></button>
        </div>
      </div>

      {tab === 'p' ? (
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-black text-slate-800">库存清单 ({products.length})</h2>
            <button onClick={() => { setEditingProductId(null); setShowModal(true); }} title="上架一款全新的烟花产品" className="bg-orange-600 text-white px-5 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-orange-100 hover:scale-105 active:scale-95 transition-all">
              <Icons.Plus /> 上架新品
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {products.map(p => (
              <div key={p.id} className="bg-white p-2 sm:p-3 rounded-2xl sm:rounded-[24px] border border-slate-100 shadow-sm relative group overflow-hidden">
                <div className="aspect-square rounded-xl overflow-hidden mb-3">
                  <img src={p.images[0]} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <p className="font-black text-slate-800 truncate text-xs sm:text-sm px-1">{p.name}</p>
                <div className="flex justify-between items-center mt-1 px-1">
                  <p className="text-orange-600 font-black text-xs sm:text-sm">¥{p.price}</p>
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-sm p-2 flex gap-1 translate-y-full group-hover:translate-y-0 transition-transform duration-300 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                  <button onClick={() => handleStartEdit(p)} title="编辑此产品信息" className="flex-1 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black hover:bg-indigo-100 transition-colors">编辑</button>
                  <button onClick={() => confirm('确定下架此产品吗？') && onDeleteProduct(p.id)} title="下架产品" className="flex-1 py-1.5 bg-rose-50 text-rose-500 rounded-lg text-[10px] font-black hover:bg-rose-100 transition-colors">下架</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
          <div className="flex justify-between items-center">
            <h2 className="text-lg sm:text-xl font-black text-slate-800">实时订单 ({leads.filter(l => l.status === 'pending').length})</h2>
            <button onClick={() => confirm('清空所有订单记录？') && onClearLeads()} className="text-[10px] sm:text-xs font-black text-rose-500 hover:bg-rose-50 px-4 py-2 rounded-xl transition-all">清空历史</button>
          </div>
          <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-xl hidden lg:block">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">客户信息</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">预订清单</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">管理操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {leads.map(l => (
                  <tr key={l.id} className={l.status === 'completed' ? 'bg-slate-50/50' : 'hover:bg-orange-50/10'}>
                    <td className="px-8 py-6">
                      <div className="font-black text-slate-900">{l.customerName}</div>
                      <div className="text-xs text-orange-600 font-bold mt-1">微信号: {l.wechat}</div>
                      <div className="text-[10px] text-slate-400 mt-1">{l.phone}</div>
                    </td>
                    <td className="px-8 py-6 text-xs text-slate-600">
                      {l.items.map(i => <div key={i.product.id}><span className="font-bold">{i.product.name}</span> x {i.quantity}</div>)}
                      <div className="text-[9px] text-slate-300 mt-2">合计: ¥{l.totalPrice}</div>
                    </td>
                    <td className="px-8 py-6 text-right space-x-2">
                      <button onClick={() => onCopyLead(l)} className="p-2.5 rounded-xl border border-slate-100 text-slate-400 hover:text-orange-600 transition-all"><Icons.Copy /></button>
                      <button onClick={() => onUpdateLeadStatus(l.id, l.status === 'pending' ? 'completed' : 'pending')} className={`px-5 py-2.5 rounded-xl text-xs font-black ${l.status === 'pending' ? 'bg-orange-600 text-white shadow-lg shadow-orange-100' : 'bg-slate-200 text-slate-400'}`}>
                        {l.status === 'pending' ? '立即处理' : '已归档'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile view omitted for brevity, same logic applies */}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-2xl rounded-t-[32px] sm:rounded-[40px] shadow-2xl p-6 sm:p-10 max-h-[90vh] overflow-y-auto animate-slide-up sm:animate-in sm:zoom-in-95 relative">
            <button onClick={closeModal} className="absolute top-4 sm:top-6 right-4 sm:right-6 p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-all"><Icons.Close /></button>
            <h2 className="text-xl sm:text-2xl font-black mb-6 sm:mb-8 text-slate-900">{editingProductId ? '编辑产品详情' : '新发布产品'}</h2>
            <form onSubmit={e => { e.preventDefault(); executeSubmit(true); }} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-4 gap-2 sm:gap-4">
                {form.images.map((img, idx) => (
                  <div key={idx} className="aspect-square rounded-xl overflow-hidden relative border-2 border-orange-100">
                    <img src={img} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setForm(v => ({...v, images: v.images.filter((_, i) => i !== idx)}))} className="absolute top-0.5 right-0.5 bg-rose-500 text-white p-0.5 rounded shadow-sm"><Icons.Close /></button>
                  </div>
                ))}
                {form.images.length < 4 && (
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="aspect-square border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-orange-500 active:bg-orange-50">
                    <Icons.Plus /> <span className="text-[9px] font-bold mt-1">上传图片</span>
                  </button>
                )}
              </div>
              <input type="file" multiple hidden ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input required placeholder="产品名称" className="px-5 py-4 rounded-2xl border bg-slate-50 w-full font-bold focus:bg-white focus:border-orange-500 transition-all" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                <input required placeholder="分类名称" className="px-5 py-4 rounded-2xl border bg-slate-50 w-full font-bold focus:bg-white focus:border-orange-500 transition-all" value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
              </div>
              <input required type="number" step="0.01" placeholder="价格 (¥)" className="px-5 py-4 rounded-2xl border bg-slate-50 w-full font-bold focus:bg-white focus:border-orange-500 transition-all" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
              <textarea required placeholder="详细描述及卖点..." rows={3} className="px-5 py-4 rounded-2xl border bg-slate-50 w-full font-medium focus:bg-white focus:border-orange-500 transition-all" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              <input placeholder="属性参数 (用逗号分隔，如: 100发, 30米高)" className="px-5 py-4 rounded-2xl border bg-slate-50 w-full font-medium focus:bg-white focus:border-orange-500 transition-all" value={form.attributes} onChange={e => setForm({...form, attributes: e.target.value})} />
              
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <div className="flex gap-3 flex-1">
                   <button type="button" onClick={() => executeSubmit(false)} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-black text-sm active:scale-95 transition-all hover:bg-slate-200">仅保存</button>
                   <button type="submit" className="flex-[2] bg-orange-600 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-orange-100 active:scale-95 transition-all">保存并关闭</button>
                </div>
                <button type="button" onClick={closeModal} className="text-slate-400 font-bold py-2 px-4 text-xs">暂不修改</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
