
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Product, OrderLead, ViewType, CartItem } from './types';
import { INITIAL_PRODUCTS, Icons } from './constants';
import { ProductCard } from './components/ProductCard';
import { LeadForm } from './components/LeadForm';
import { AdminPanel } from './components/AdminPanel';
import { AdminLogin } from './components/AdminLogin';
import { CartView } from './components/CartView';

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('shop');
  const [products, setProducts] = useState<Product[]>([]);
  const [leads, setLeads] = useState<OrderLead[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCheckoutFormOpen, setIsCheckoutFormOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // 初始化加载
  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem('qs_products_v2');
      const savedLeads = localStorage.getItem('qs_leads_v2');
      const savedCart = localStorage.getItem('qs_cart_v2');
      const savedAuth = sessionStorage.getItem('qs_auth_v2');
      
      if (savedProducts) setProducts(JSON.parse(savedProducts));
      else {
        setProducts(INITIAL_PRODUCTS);
        localStorage.setItem('qs_products_v2', JSON.stringify(INITIAL_PRODUCTS));
      }

      if (savedLeads) setLeads(JSON.parse(savedLeads));
      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedAuth === 'true') setIsAdminAuthenticated(true);
    } catch (e) {
      console.error("Storage Initialization Error", e);
    }
  }, []);

  // 持久化监听
  useEffect(() => {
    if (products.length > 0) localStorage.setItem('qs_products_v2', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('qs_leads_v2', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('qs_cart_v2', JSON.stringify(cart));
  }, [cart]);

  const showToast = useCallback((message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleAdminLogin = (user: string, pass: string) => {
    if (user === 'admin' && pass === 'admin123') {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('qs_auth_v2', 'true');
      showToast('身份验证成功');
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('qs_auth_v2');
    setView('shop');
    showToast('已退出管理模式', 'info');
  };

  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return products;
    return products.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.description.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`已将 ${product.name} 加入清单`, 'info');
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => item.product.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(item => item.product.id !== id));
  
  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  const handleOrderSubmit = (data: { name: string; phone: string; wechat: string }) => {
    const totalPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const newOrder: OrderLead = {
      id: 'ORDER_' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase(),
      items: [...cart],
      totalPrice,
      customerName: data.name,
      phone: data.phone,
      wechat: data.wechat,
      timestamp: Date.now(),
      status: 'pending'
    };
    
    setLeads(prev => [newOrder, ...prev]);
    setCart([]);
    setIsCheckoutFormOpen(false);
    setView('shop');
    showToast('预订成功！我们将尽快与您联系。');
  };

  const updateLeadStatus = (id: string, status: 'pending' | 'completed') => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  const copyLeadInfo = (lead: OrderLead) => {
    const itemsText = lead.items.map(i => `- ${i.product.name} x${i.quantity}`).join('\n');
    const text = `【全球花炮集合-新预订通知】\n--------------------\n客户：${lead.customerName}\n手机：${lead.phone}\n微信：${lead.wechat}\n下单时间：${new Date(lead.timestamp).toLocaleString()}\n--------------------\n选购花炮：\n${itemsText}\n--------------------\n实付总额：¥${lead.totalPrice.toLocaleString()}\n署名：binbinaidapao`;
    
    navigator.clipboard.writeText(text).then(() => {
      showToast('订单信息已复制');
    }).catch(() => {
      showToast('复制失败，请手动选择', 'info');
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setView('shop')}>
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white font-black italic shadow-lg shadow-orange-200 group-hover:scale-110 transition-transform">花</div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-slate-900 tracking-tight leading-none">全球花炮集合<span className="text-orange-600">.</span></span>
              <span className="text-[9px] font-bold text-orange-500/60 tracking-widest uppercase mt-0.5">by binbinaidapao</span>
            </div>
          </div>
          <nav className="flex gap-1 md:gap-2">
            <button onClick={() => setView('shop')} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all ${view === 'shop' ? 'bg-orange-600 text-white shadow-lg shadow-orange-100' : 'text-slate-500 hover:bg-slate-50'}`}><Icons.Store />花炮商城</button>
            <button onClick={() => setView('cart')} className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all ${view === 'cart' ? 'bg-orange-600 text-white shadow-lg shadow-orange-100' : 'text-slate-500 hover:bg-slate-50'}`}>
              <Icons.Cart />预订清单
              {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white animate-bounce">{cartCount}</span>}
            </button>
            <button onClick={() => setView('admin')} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all ${view === 'admin' ? 'bg-orange-600 text-white shadow-lg shadow-orange-100' : 'text-slate-500 hover:bg-slate-50'}`}><Icons.Dashboard />后台管理</button>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {view === 'shop' && (
          <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="mb-10 relative max-w-lg mx-auto">
              <input 
                type="text" 
                className="w-full pl-12 pr-5 py-4 border border-slate-200 rounded-3xl bg-white shadow-sm focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all text-sm font-medium" 
                placeholder="搜索感兴趣的烟花、炮仗或套餐..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
              />
              <div className="absolute left-4 top-4.5 text-slate-400"><Icons.Search /></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map(p => <ProductCard key={p.id} product={p} onAddToCart={addToCart} />)}
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-slate-400 font-bold">没有找到匹配的宝贝，换个关键词搜搜看？</p>
              </div>
            )}
          </div>
        )}
        
        {view === 'cart' && (
          <CartView 
            items={cart} 
            onUpdateQuantity={updateQuantity} 
            onRemove={removeFromCart} 
            onGoShop={() => setView('shop')} 
            onCheckout={() => setIsCheckoutFormOpen(true)} 
          />
        )}
        
        {view === 'admin' && (
          isAdminAuthenticated ? (
            <AdminPanel 
              products={products} 
              leads={leads} 
              onLogout={handleAdminLogout} 
              onCopyLead={copyLeadInfo} 
              onAddProduct={(p) => setProducts(v => [{...p, id: 'PROD_' + Date.now(), createdAt: Date.now()}, ...v])} 
              onDeleteProduct={(id) => setProducts(v => v.filter(p => p.id !== id))} 
              onClearLeads={() => setLeads([])}
              onUpdateLeadStatus={updateLeadStatus}
            />
          ) : (
            <AdminLogin onLogin={handleAdminLogin} />
          )
        )}
      </main>

      <footer className="py-10 border-t border-slate-100 mt-20 text-center">
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Developed by binbinaidapao</p>
        <p className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">© 2025 全球花炮集合 · 版权所有</p>
      </footer>

      {isCheckoutFormOpen && <LeadForm items={cart} onClose={() => setIsCheckoutFormOpen(false)} onSubmit={handleOrderSubmit} />}
      
      {toast && (
        <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 px-8 py-4 rounded-[20px] shadow-2xl font-black text-sm z-50 animate-in slide-in-from-bottom-6 duration-300 ${toast.type === 'success' ? 'bg-orange-600 text-white' : 'bg-white text-orange-600 border border-slate-100'}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default App;
