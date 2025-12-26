
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Product, OrderLead, ViewType, CartItem } from './types';
import { INITIAL_PRODUCTS, Icons } from './constants';
import { ProductCard } from './components/ProductCard';
import { LeadForm } from './components/LeadForm';
import { AdminPanel } from './components/AdminPanel';
import { AdminLogin } from './components/AdminLogin';
import { CartView } from './components/CartView';
import { ProductDetail } from './components/ProductDetail';

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('shop');
  
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('fireworks_products_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return INITIAL_PRODUCTS; }
    }
    return INITIAL_PRODUCTS;
  });

  const [leads, setLeads] = useState<OrderLead[]>(() => {
    const saved = localStorage.getItem('fireworks_leads_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [];
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('fireworks_cart_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [];
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return sessionStorage.getItem('fireworks_auth_v3') === 'true';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('全部');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutFormOpen, setIsCheckoutFormOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  useEffect(() => { localStorage.setItem('fireworks_products_v3', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('fireworks_leads_v3', JSON.stringify(leads)); }, [leads]);
  useEffect(() => { localStorage.setItem('fireworks_cart_v3', JSON.stringify(cart)); }, [cart]);

  const categories = useMemo(() => ['全部', ...Array.from(new Set(products.map(p => p.category)))], [products]);
  
  const showToast = useCallback((message: string) => { 
    setToast({ message, type: 'success' }); 
    setTimeout(() => setToast(null), 3000); 
  }, []);

  const filteredProducts = useMemo(() => products.filter(p => {
    const mSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const mCat = activeCategory === '全部' || p.category === activeCategory;
    return mSearch && mCat;
  }), [products, searchQuery, activeCategory]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`已添加：${product.name}`);
  };

  const navButtons = [
    { key: 'shop', icon: <Icons.Store />, label: '商城', title: '点击进入烟花商城主页' },
    { key: 'cart', icon: <Icons.Cart />, label: '预订清单', title: '查看我选购的宝贝清单', count: cart.reduce((a, b) => a + b.quantity, 0) },
    { key: 'admin', icon: <Icons.Dashboard />, label: '管理后台', title: '商户登录管理入口' }
  ];

  return (
    <div className="min-h-screen flex flex-col font-medium">
      <header className="w-full bg-white border-b border-slate-100/50">
        <div className="max-w-7xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setView('shop')} title="回到商城首页">
            <div className="w-9 h-9 bg-orange-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-orange-100">富</div>
            <div className="flex flex-col">
              <span className="text-base font-black text-slate-900 leading-none">富贵的快乐小屋</span>
              <span className="text-[8px] font-black text-orange-600 tracking-tighter uppercase mt-0.5 opacity-80">Fugui's Happy Selection</span>
            </div>
          </div>
          <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest hidden sm:block">Professional Fireworks Order System</div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
              <div className="relative flex-grow group">
                <input 
                  className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-200 bg-slate-50 shadow-inner outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 font-bold transition-all text-sm sm:text-base placeholder:text-slate-400"
                  placeholder="搜索想找的花炮宝贝..." 
                  value={searchQuery} 
                  onChange={e => setSearchQuery(e.target.value)}
                  title="输入关键词进行实时搜索"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196 7.5 7.5 0 0010.607 10.607z" /></svg>
                </div>
              </div>
              
              <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide">
                {navButtons.map(btn => (
                  <button 
                    key={btn.key} 
                    onClick={() => setView(btn.key as ViewType)} 
                    title={btn.title}
                    className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-4 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all active:scale-90 border shadow-sm ${view === btn.key ? 'bg-orange-600 text-white border-orange-600 shadow-orange-200 shadow-lg scale-[1.02]' : 'bg-white text-slate-600 border-slate-100 hover:border-orange-200'}`}
                  >
                    <span className={view === btn.key ? 'text-white' : 'text-orange-500'}>{btn.icon}</span>
                    <span>{btn.label}</span>
                    {btn.count !== undefined && btn.count > 0 && (
                      <span className={`ml-1 px-1.5 py-0.5 rounded-lg text-[10px] font-black ${view === btn.key ? 'bg-white text-orange-600' : 'bg-orange-600 text-white'}`}>
                        {btn.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {view === 'shop' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 animate-in fade-in duration-500">
            <div className="flex gap-2 overflow-x-auto pb-6 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              {categories.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setActiveCategory(cat)} 
                  title={`查看“${cat}”分类下的所有产品`}
                  className={`px-5 sm:px-6 py-2.5 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all active:scale-95 ${activeCategory === cat ? 'bg-orange-600 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-50 hover:text-slate-600'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {filteredProducts.map(p => (
                <ProductCard key={p.id} product={p} onAddToCart={addToCart} onViewDetail={() => setSelectedProduct(p)} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="py-24 text-center">
                <div className="text-slate-200 mb-4 flex justify-center"><Icons.Store /></div>
                <p className="text-slate-400 font-black text-sm">这里暂时没找到宝贝，换个关键词搜搜看吧</p>
              </div>
            )}
          </div>
        )}
        
        {view === 'cart' && (
          <CartView 
            items={cart} onUpdateQuantity={(id, d) => setCart(v => v.map(i => i.product.id === id ? {...i, quantity: Math.max(1, i.quantity + d)} : i))} 
            onRemove={id => setCart(v => v.filter(i => i.product.id !== id))} onGoShop={() => setView('shop')} onCheckout={() => setIsCheckoutFormOpen(true)} 
          />
        )}
        
        {view === 'admin' && (
          isAdminAuthenticated ? (
            <AdminPanel 
              products={products} leads={leads} onLogout={() => { setIsAdminAuthenticated(false); sessionStorage.removeItem('fireworks_auth_v3'); }} 
              onCopyLead={lead => {
                const text = `客户：${lead.customerName}\n手机：${lead.phone}\n微信：${lead.wechat}\n预订：${lead.items.map(i => i.product.name + 'x' + i.quantity).join(', ')}`;
                navigator.clipboard.writeText(text); showToast('已成功复制订单详情');
              }} 
              onAddProduct={p => {
                setProducts(v => [{...p, id: 'P'+Date.now().toString().slice(-5), createdAt: Date.now()}, ...v]);
                showToast('产品已上架');
              }} 
              onUpdateProduct={updated => {
                setProducts(v => v.map(p => p.id === updated.id ? updated : p));
                showToast('保存修改成功');
              }}
              onDeleteProduct={id => {
                setProducts(v => v.filter(p => p.id !== id));
                showToast('产品已下架');
              }}
              onClearLeads={() => { setLeads([]); showToast('记录已清空'); }}
              onUpdateLeadStatus={(id, s) => setLeads(v => v.map(l => l.id === id ? {...l, status: s} : l))}
            />
          ) : (
            <AdminLogin onLogin={(u, p) => {
              if(u === 'admin' && p === 'admin123') { 
                setIsAdminAuthenticated(true); 
                sessionStorage.setItem('fireworks_auth_v3', 'true'); 
                return true; 
              }
              return false;
            }} />
          )
        )}
      </main>

      {selectedProduct && <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={addToCart} />}
      {isCheckoutFormOpen && <LeadForm items={cart} onClose={() => setIsCheckoutFormOpen(false)} onSubmit={data => {
        const total = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
        setLeads(v => [{ id: 'ORD'+Date.now().toString().slice(-6), items: [...cart], totalPrice: total, customerName: data.name, phone: data.phone, wechat: data.wechat, timestamp: Date.now(), status: 'pending' }, ...v]);
        setCart([]); setIsCheckoutFormOpen(false); setView('shop'); showToast('预订提交成功！我们会尽快与您确认。');
      }} />}
      
      {toast && (
        <div className="fixed bottom-24 sm:bottom-10 left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-md text-white px-6 py-3.5 rounded-2xl shadow-2xl font-black z-[200] animate-in slide-in-from-bottom-5 text-sm whitespace-nowrap">
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default App;
