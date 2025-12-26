
import React, { useState, useRef } from 'react';
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
  onDeleteProduct: (id: string) => void, 
  onClearLeads: () => void,
  onUpdateLeadStatus: (id: string, status: 'pending' | 'completed') => void
}> = ({ products, leads, onLogout, onCopyLead, onAddProduct, onDeleteProduct, onClearLeads, onUpdateLeadStatus }) => {
  const [tab, setTab] = useState<'p'|'l'>('p');
  const [showAddModal, setShowAddModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [form, setForm] = useState<ProductForm>({
    name: '', price: '', category: '', description: '', images: [], attributes: '类型: 烟花, 燃放建议: 请在开阔地带使用'
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + form.images.length > 4) { alert('单品最多支持4张展示图'); return; }
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setForm(prev => ({ ...prev, images: [...prev.images, reader.result as string] }));
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.images.length < 2) { alert('请至少上传2张产品图片以展示细节'); return; }
    onAddProduct({
      name: form.name, price: parseFloat(form.price), category: form.category || '默认',
      description: form.description, images: form.images,
      attributes: form.attributes.split(/[,，]/).map(s => s.trim())
    });
    setForm({ name: '', price: '', category: '', description: '', images: [], attributes: '类型: 烟花, 燃放建议: 请在开阔地带使用' });
    setShowAddModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-24 sm:pb-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 sm:mb-12 gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-600 rounded-2xl sm:rounded-[20px] flex items-center justify-center text-white shadow-xl shadow-orange-100"><Icons.Dashboard /></div>
          <div>
            <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">后台管理中心</h1>
            <p className="text-[10px] sm:text-sm text-slate-400 font-bold uppercase tracking-widest">Operator: binbinaidapao</p>
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
            <button onClick={() => setShowAddModal(true)} title="上架一款全新的烟花产品到商城" className="bg-orange-600 text-white px-5 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-orange-100 hover:scale-105 active:scale-95 transition-all">
              <Icons.Plus /> 上架新品
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {products.map(p => (
              <div key={p.id} className="bg-white p-2 sm:p-3 rounded-2xl sm:rounded-[24px] border border-slate-100 shadow-sm relative group">
                <div className="aspect-square rounded-xl overflow-hidden mb-3">
                  <img src={p.images[0]} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <p className="font-black text-slate-800 truncate text-xs sm:text-sm px-1">{p.name}</p>
                <div className="flex justify-between items-center mt-1 px-1">
                  <p className="text-orange-600 font-black text-xs sm:text-sm">¥{p.price}</p>
                </div>
                <button onClick={() => confirm('确定彻底删除该产品吗？此操作不可撤销。') && onDeleteProduct(p.id)} title="从商城中彻底下架该产品" className="absolute top-3 right-3 p-1.5 sm:p-2 bg-rose-500 text-white rounded-lg sm:opacity-0 group-hover:opacity-100 transition-all shadow-lg active:scale-90"><Icons.Trash /></button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
          <div className="flex justify-between items-center">
            <h2 className="text-lg sm:text-xl font-black text-slate-800">待处理订单 ({leads.filter(l => l.status === 'pending').length})</h2>
            <button onClick={() => confirm('确定清空所有历史订单记录吗？') && onClearLeads()} title="清空全部预订记录" className="text-[10px] sm:text-xs font-black text-rose-500 hover:bg-rose-50 px-4 py-2 rounded-xl transition-all">清空历史</button>
          </div>
          
          <div className="hidden lg:block bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-xl">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">客户信息</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">清单明细</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">管理操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {leads.map(l => (
                  <tr key={l.id} className={`transition-colors ${l.status === 'completed' ? 'bg-slate-50/50' : 'hover:bg-orange-50/20'}`}>
                    <td className="px-8 py-6">
                      <div className="font-black text-slate-900">{l.customerName}</div>
                      <div className="text-xs text-orange-600 font-bold mt-1">微信: {l.wechat}</div>
                      <div className="text-[10px] text-slate-400 mt-1">{l.phone}</div>
                    </td>
                    <td className="px-8 py-6 text-xs text-slate-600">
                      {l.items.map(i => <div key={i.product.id}><span className="font-bold text-slate-800">{i.product.name}</span> × {i.quantity}</div>)}
                      <div className="text-[9px] text-slate-300 mt-2 font-black">¥{l.totalPrice.toLocaleString()} · {new Date(l.timestamp).toLocaleString()}</div>
                    </td>
                    <td className="px-8 py-6 text-right space-x-2">
                      <button onClick={() => onCopyLead(l)} title="一键复制客户信息及预订内容" className="p-2.5 rounded-xl border border-slate-100 text-slate-400 hover:text-orange-600 transition-all"><Icons.Copy /></button>
                      <button onClick={() => onUpdateLeadStatus(l.id, l.status === 'pending' ? 'completed' : 'pending')} title={l.status === 'pending' ? '标记为已处理/已联系' : '恢复为待处理状态'} className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${l.status === 'pending' ? 'bg-orange-600 text-white shadow-lg shadow-orange-100' : 'bg-slate-200 text-slate-400'}`}>
                        {l.status === 'pending' ? '处理此单' : '已完成'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="lg:hidden space-y-4">
            {leads.map(l => (
              <div key={l.id} className={`p-5 rounded-3xl border bg-white shadow-sm transition-all ${l.status === 'completed' ? 'opacity-60 grayscale-[0.5]' : 'border-orange-100'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-black text-slate-900 text-lg">{l.customerName}</h4>
                    <p className="text-xs text-orange-600 font-bold">微信: {l.wechat}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-orange-600">¥{l.totalPrice}</p>
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl mb-4 text-xs space-y-1">
                  {l.items.map(i => <div key={i.product.id} className="text-slate-600"><span className="font-bold text-slate-800">{i.product.name}</span> × {i.quantity}</div>)}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => onCopyLead(l)} title="复制信息" className="flex-1 py-3 bg-white border border-slate-200 rounded-xl text-slate-400 flex justify-center active:bg-slate-100 transition-all"><Icons.Copy /></button>
                  <button onClick={() => onUpdateLeadStatus(l.id, l.status === 'pending' ? 'completed' : 'pending')} className={`flex-[3] py-3 rounded-xl text-sm font-black transition-all ${l.status === 'pending' ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                    {l.status === 'pending' ? '处理完毕' : '已存档'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-2xl rounded-t-[32px] sm:rounded-[40px] shadow-2xl p-6 sm:p-10 max-h-[90vh] overflow-y-auto animate-slide-up sm:animate-in sm:zoom-in-95 relative">
            <button onClick={() => setShowAddModal(false)} title="关闭窗口" className="absolute top-4 sm:top-6 right-4 sm:right-6 p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-all active:scale-90"><Icons.Close /></button>
            <h2 className="text-xl sm:text-2xl font-black mb-6 sm:mb-8 text-slate-900">上架新款烟花</h2>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-4 gap-2 sm:gap-4">
                {form.images.map((img, idx) => (
                  <div key={idx} className="aspect-square rounded-xl overflow-hidden relative border-2 border-orange-100">
                    <img src={img} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setForm(v => ({...v, images: v.images.filter((_, i) => i !== idx)}))} title="删除此图" className="absolute top-0.5 right-0.5 bg-rose-500 text-white p-0.5 rounded shadow-sm"><Icons.Close /></button>
                  </div>
                ))}
                {form.images.length < 4 && (
                  <button type="button" onClick={() => fileInputRef.current?.click()} title="点击从本地或拍照上传产品图" className="aspect-square border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-orange-500 transition-all active:bg-orange-50">
                    <Icons.Plus /> <span className="text-[9px] font-bold mt-1">上传图片</span>
                  </button>
                )}
              </div>
              <input type="file" multiple hidden ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input required placeholder="花炮全称 (如: 黄金瀑布)" className="px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 w-full font-bold focus:bg-white focus:border-orange-500 transition-all" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                <input required placeholder="产品分类 (如: 手持类)" className="px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 w-full font-bold focus:bg-white focus:border-orange-500 transition-all" value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
              </div>
              <input required type="number" placeholder="产品单价 (¥)" className="px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 w-full font-bold focus:bg-white focus:border-orange-500 transition-all" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
              <textarea required placeholder="产品亮点说明及燃放效果描述..." rows={3} className="px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 w-full font-medium focus:bg-white focus:border-orange-500 transition-all" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              <input placeholder="核心属性参数 (用逗号分隔，如: 100发, 30米高)" className="px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 w-full font-medium focus:bg-white focus:border-orange-500 transition-all" value={form.attributes} onChange={e => setForm({...form, attributes: e.target.value})} />
              
              <div className="flex gap-4 pt-4 pb-4 sm:pb-0">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 text-slate-400 font-black py-4">返回列表</button>
                <button type="submit" className="flex-[3] bg-orange-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-orange-100 active:scale-95 transition-all">立即发布到商城</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
