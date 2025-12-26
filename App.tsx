
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
  
  // 核心数据持久化：同步初始化
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('fg_products_v4');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [leads, setLeads] = useState<OrderLead[]>(() => {
    const saved = localStorage.getItem('fg_leads_v4');
    return saved ? JSON.parse(saved) : [];
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('fg_cart_v4');
    return saved ? JSON.parse(saved) : [];
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return sessionStorage.getItem('fg_auth_v4') === 'true';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('全部');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutFormOpen, setIsCheckoutFormOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // 状态变更即时保存
  useEffect(() => { localStorage.setItem('fg_products_v4', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('fg_leads_v4', JSON.stringify(leads)); }, [leads]);
  useEffect(() => { localStorage.setItem('fg_cart_v4', JSON.stringify(cart)); }, [cart]);

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
    showToast(`已选：${product.name}`);
  };

  const navButtons = [
    { key: 'shop', icon: <Icons.Store />, label: '产品库' },
    { key: 'cart', icon: <Icons.Cart />, label: '预订清单', count: cart.reduce((a, b) => a + b.quantity, 0) },
    { key: 'admin', icon: <Icons.Dashboard />, label: '管理员' }
  ];

  // 订单提交核心逻辑：解决管理员看不见的问题
  const handleOrderSubmit = (data: { name: string; phone: string; wechat: string }) => {
    const total = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
    const newLead: OrderLead = {
      id: 'ORD' + Date.now().toString().slice(-6),
      items: [...cart],
      totalPrice: total,
      customerName: data.name,
      phone: data.phone,
      wechat: data.wechat,
      timestamp: Date.now(),
      status: 'pending'
    };

    setLeads(v => [newLead, ...v]);
    
    // 生成微信同步文案
    const itemDetails = cart.map(i => `${i.product.name} x${i.quantity}`).join('、');
    const syncText = `【新订单预订】\n客户：${data.name}\n电话：${data.phone}\n微信：${data.wechat}\n内容：${itemDetails}\n合计：¥${total}\n请富贵确认发货！`;
    
    // 自动复制并提示
    navigator.clipboard.writeText(syncText).then(() => {
      alert(`预订已记录！订单信息已复制到剪贴板，请立即打开微信发给“富贵”确认！`);
    });

    setCart([]);
    setIsCheckoutFormOpen(false);
    setView('shop');
    showToast('提交成功！请在微信粘贴并发送给富贵');
  };

  return (
    <div className="min-h-screen flex flex-col font-medium">
      <header className="w-full bg-white border-b border-slate-100 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('shop')}>
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-orange-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg">富</div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-black text-slate-900 leading-none">富贵的快乐小屋</span>
              <span className="text-[8px] font-bold text-orange-600 tracking-tighter uppercase mt-0.5">Fugui Happy Home</span>
            </div>
          </div>
          <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest hidden sm:block">Fugui Selection System v4.0</div>
        </div>
      </header>

      <main className="flex-grow pb-24 sm:pb-10">
        <div className="bg-white border-b border-slate-100 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <input 
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:border-orange-500 text-sm transition-all"
                placeholder="搜索花炮..." 
                value={searchQuery} 
                onChange={e => setSearchQuery(e.target.value)}
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </div>
            </div>
            
            <div className="flex gap-2">
              {navButtons.map(btn => (
                <button 
                  key={btn.key} 
                  onClick={() => setView(btn.key as ViewType)} 
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${view === btn.key ? 'bg-orange-600 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-100'}`}
                >
                  {btn.icon}
                  <span>{btn.label}</span>
                  {btn.count !== undefined && btn.count > 0 && (
                    <span className="bg-white text-orange-600 px-1 rounded-md text-[9px]">{btn.count}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {view === 'shop' && (
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
              {categories.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setActiveCategory(cat)} 
                  className={`px-4 py-2 rounded-lg font-bold text-xs whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-orange-600 text-white' : 'bg-white text-slate-400 border border-slate-50'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map(p => (
                <ProductCard key={p.id} product={p} onAddToCart={addToCart} onViewDetail={() => setSelectedProduct(p)} />
              ))}
            </div>
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
              products={products} leads={leads} onLogout={() => { setIsAdminAuthenticated(false); sessionStorage.removeItem('fg_auth_v4'); }} 
              onCopyLead={lead => {
                const text = `客户：${lead.customerName}\n手机：${lead.phone}\n清单：${lead.items.map(i => i.product.name + 'x' + i.quantity).join(', ')}`;
                navigator.clipboard.writeText(text); showToast('订单已复制');
              }} 
              onAddProduct={p => setProducts(v => [{...p, id: 'P'+Date.now(), createdAt: Date.now()}, ...v])} 
              onUpdateProduct={updated => {
                setProducts(v => v.map(p => p.id === updated.id ? updated : p));
                showToast('已保存更新');
              }}
              onDeleteProduct={id => setProducts(v => v.filter(p => p.id !== id))}
              onClearLeads={() => setLeads([])}
              onUpdateLeadStatus={(id, s) => setLeads(v => v.map(l => l.id === id ? {...l, status: s} : l))}
            />
          ) : (
            <AdminLogin onLogin={(u, p) => {
              if(u === 'admin' && p === 'admin123') { 
                setIsAdminAuthenticated(true); 
                sessionStorage.setItem('fg_auth_v4', 'true'); 
                return true; 
              }
              return false;
            }} />
          )
        )}
      </main>

      {selectedProduct && <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={addToCart} />}
      {isCheckoutFormOpen && <LeadForm items={cart} onClose={() => setIsCheckoutFormOpen(false)} onSubmit={handleOrderSubmit} />}
      
      {toast && (
        <div className="fixed bottom-24 sm:bottom-10 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur px-6 py-3 rounded-2xl shadow-xl text-white font-bold z-50 animate-in slide-in-from-bottom-5 text-sm">
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default App;
