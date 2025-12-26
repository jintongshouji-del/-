
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

  useEffect(() => {
    const savedProducts = localStorage.getItem('qs_products');
    const savedLeads = localStorage.getItem('qs_leads');
    const savedCart = localStorage.getItem('qs_cart');
    const savedAuth = sessionStorage.getItem('qs_auth');
    
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem('qs_products', JSON.stringify(INITIAL_PRODUCTS));
    }
    if (savedLeads) setLeads(JSON.parse(savedLeads));
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedAuth === 'true') setIsAdminAuthenticated(true);
  }, []);

  useEffect(() => localStorage.setItem('qs_products', JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem('qs_leads', JSON.stringify(leads)), [leads]);
  useEffect(() => localStorage.setItem('qs_cart', JSON.stringify(cart)), [cart]);

  const showToast = useCallback((message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleAdminLogin = (user: string, pass: string) => {
    if (user === 'admin' && pass === 'admin123') {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('qs_auth', 'true');
      showToast('登录成功，欢迎管理员');
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('qs_auth');
    setView('shop');
    showToast('已退出管理模式', 'info');
  };

  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return products;
    return products.filter(p => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query));
  }, [products, searchQuery]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`已添加 ${product.name}`, 'info');
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => item.product.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(item => item.product.id !== id));
  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  const handleOrderSubmit = (data: { name: string; phone: string; wechat: string }) => {
    const totalPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const newOrder: OrderLead = {
      id: Math.random().toString(36).substr(2, 9),
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
    showToast('下单成功！我们将尽快与您联系');
  };

  const copyLeadInfo = (lead: OrderLead) => {
    const text = `【新订单】\n客户：${lead.customerName}\n手机：${lead.phone}\n微信：${lead.wechat}\n总价：¥${lead.totalPrice}`;
    navigator.clipboard.writeText(text).then(() => showToast('复制成功')).catch(() => showToast('复制失败', 'info'));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('shop')}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black italic">Q</div>
            <span className="text-xl font-bold text-slate-900">QuickStore</span>
          </div>
          <nav className="flex gap-2">
            <button onClick={() => setView('shop')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold ${view === 'shop' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500'}`}><Icons.Store />商城</button>
            <button onClick={() => setView('cart')} className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold ${view === 'cart' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500'}`}><Icons.Cart />购物车{cartCount > 0 && <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-white">{cartCount}</span>}</button>
            <button onClick={() => setView('admin')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold ${view === 'admin' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500'}`}><Icons.Dashboard />管理</button>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {view === 'shop' && (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="mb-8 relative max-w-md mx-auto">
              <input type="text" className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl bg-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="搜索商品..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              <div className="absolute left-3 top-3.5 text-slate-400"><Icons.Search /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map(p => <ProductCard key={p.id} product={p} onAddToCart={addToCart} />)}
            </div>
          </div>
        )}
        {view === 'cart' && <CartView items={cart} onUpdateQuantity={updateQuantity} onRemove={removeFromCart} onGoShop={() => setView('shop')} onCheckout={() => setIsCheckoutFormOpen(true)} />}
        {view === 'admin' && (isAdminAuthenticated ? <AdminPanel products={products} leads={leads} onLogout={handleAdminLogout} onCopyLead={copyLeadInfo} onAddProduct={(p) => setProducts(v => [{...p, id: Math.random().toString(36).substr(2,9), createdAt: Date.now()}, ...v])} onDeleteProduct={(id) => setProducts(v => v.filter(p => p.id !== id))} onClearLeads={() => setLeads([])} /> : <AdminLogin onLogin={handleAdminLogin} />)}
      </main>

      {isCheckoutFormOpen && <LeadForm items={cart} onClose={() => setIsCheckoutFormOpen(false)} onSubmit={handleOrderSubmit} />}
      {toast && <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl shadow-xl font-bold animate-in slide-in-from-bottom-4 ${toast.type === 'success' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 border border-indigo-100'}`}>{toast.message}</div>}
    </div>
  );
};

export default App;
