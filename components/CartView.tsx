
import React from 'react';
import { CartItem } from '../types';
import { Icons } from '../constants';

export const CartView: React.FC<{ items: CartItem[], onUpdateQuantity: (id: string, d: number) => void, onRemove: (id: string) => void, onCheckout: () => void, onGoShop: () => void }> = ({ items, onUpdateQuantity, onRemove, onCheckout, onGoShop }) => {
  const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  
  if (items.length === 0) return (
    <div className="max-w-md mx-auto py-24 sm:py-32 text-center px-4 animate-in fade-in zoom-in-95 duration-500">
      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-orange-50 text-orange-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"><Icons.Cart /></div>
      <h2 className="text-xl sm:text-2xl font-black text-slate-800">清单空空如也</h2>
      <p className="text-slate-400 mt-2 font-medium text-sm sm:text-base">快去商城挑选心仪的花炮吧！</p>
      <button onClick={onGoShop} className="mt-8 sm:mt-10 bg-orange-600 text-white px-8 sm:px-10 py-4 rounded-2xl font-black text-sm sm:text-lg shadow-lg active:scale-95 transition-all">返回商城挑选</button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 pb-32 sm:pb-12">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">预订清单</h1>
        <span className="text-slate-400 font-bold text-xs sm:text-sm">{items.length} 种宝贝</span>
      </div>

      <div className="mb-6 p-4 bg-orange-50 border-l-4 border-orange-500 rounded-r-2xl animate-in slide-in-from-left-4">
        <p className="text-orange-800 text-[11px] sm:text-sm font-black flex items-center gap-2">
          <span className="bg-orange-500 text-white text-[9px] px-1.5 py-0.5 rounded">提示</span>
          填写真实联系信息，我们将通过电话或微信联系您确认配送。
        </p>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {items.map(i => (
          <div key={i.product.id} className="bg-white p-3 sm:p-5 rounded-[24px] sm:rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-4 sm:gap-6 group">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm flex-shrink-0">
              <img src={i.product.images[0]} className="w-full h-full object-cover" />
            </div>
            <div className="flex-grow min-w-0">
              <h4 className="font-black text-slate-800 text-sm sm:text-lg leading-tight truncate">{i.product.name}</h4>
              <p className="text-orange-600 font-black mt-0.5 text-xs sm:text-sm">¥{i.product.price}</p>
            </div>
            <div className="flex items-center bg-slate-100 rounded-xl sm:rounded-2xl p-1 border border-slate-200/50">
              <button 
                onClick={() => onUpdateQuantity(i.product.id, -1)} 
                title="减少购买数量"
                className="p-1 sm:p-1.5 text-slate-500 hover:text-orange-600 transition-colors active:scale-75"
              >
                <Icons.Minus />
              </button>
              <span className="w-6 sm:w-10 text-center font-black text-slate-900 text-sm">{i.quantity}</span>
              <button 
                onClick={() => onUpdateQuantity(i.product.id, 1)} 
                title="增加购买数量"
                className="p-1 sm:p-1.5 text-slate-500 hover:text-orange-600 transition-colors active:scale-75"
              >
                <Icons.Plus />
              </button>
            </div>
            <button 
              onClick={() => confirm('确定将此项从预订清单中移除吗？') && onRemove(i.product.id)} 
              className="text-slate-300 hover:text-rose-500 p-1 sm:p-2 transition-colors active:scale-90" 
              title="从清单中删除此项"
            >
              <Icons.Trash />
            </button>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 sm:relative sm:mt-12 bg-white/95 backdrop-blur-xl sm:bg-white p-6 sm:p-10 border-t sm:border border-slate-100 sm:rounded-[48px] shadow-[0_-8px_30px_rgba(0,0,0,0.04)] sm:shadow-2xl z-40">
        <div className="max-w-4xl mx-auto flex flex-row sm:flex-row justify-between items-center gap-4">
          <div>
            <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">合计金额</span>
            <p className="text-2xl sm:text-4xl font-black text-orange-600 tracking-tighter">¥{total.toLocaleString()}</p>
          </div>
          <button 
            onClick={onCheckout} 
            title="点击填写收货及联系信息，完成预订提交"
            className="px-8 sm:px-16 py-4 sm:py-5 bg-orange-600 text-white rounded-2xl sm:rounded-[24px] font-black text-base sm:text-xl shadow-xl shadow-orange-100 active:scale-95 hover:scale-[1.02] transition-all"
          >
            提交预订意向
          </button>
        </div>
      </div>
    </div>
  );
};
