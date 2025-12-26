
import React, { useState } from 'react';
import { Product } from '../types';
import { Icons } from '../constants';

export const ProductDetail: React.FC<{ product: Product, onClose: () => void, onAddToCart: (p: Product) => void }> = ({ product, onClose, onAddToCart }) => {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-5xl rounded-t-[32px] sm:rounded-[40px] overflow-hidden shadow-2xl flex flex-col lg:flex-row relative animate-slide-up sm:animate-in sm:zoom-in-95 duration-300 max-h-[95vh] sm:max-h-[90vh]">
        <button onClick={onClose} title="关闭" className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20 p-2 bg-black/10 hover:bg-black/30 text-white rounded-full backdrop-blur-md transition-all active:scale-90">
          <Icons.Close />
        </button>
        
        {/* 图片画廊区 - 移动端固定高度 */}
        <div className="w-full lg:w-3/5 bg-slate-100 relative group aspect-square sm:aspect-video lg:aspect-auto h-[40vh] sm:h-auto overflow-hidden">
          <img src={product.images[activeIdx]} className="w-full h-full object-cover transition-opacity duration-500" alt={product.name} />
          
          {product.images.length > 1 && (
            <>
              <button onClick={() => setActiveIdx(v => (v - 1 + product.images.length) % product.images.length)} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 text-white rounded-full hover:bg-white/40 sm:opacity-0 group-hover:opacity-100 transition-all active:scale-90">
                <Icons.ChevronLeft />
              </button>
              <button onClick={() => setActiveIdx(v => (v + 1) % product.images.length)} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 text-white rounded-full hover:bg-white/40 sm:opacity-0 group-hover:opacity-100 transition-all active:scale-90">
                <Icons.ChevronRight />
              </button>
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 px-4 scrollbar-hide overflow-x-auto">
                {product.images.map((_, idx) => (
                  <button key={idx} onClick={() => setActiveIdx(idx)} className={`h-1 rounded-full transition-all ${activeIdx === idx ? 'w-8 bg-orange-600' : 'w-2 bg-white/60'}`} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* 详情内容区 - 移动端支持内容滚动 */}
        <div className="w-full lg:w-2/5 p-6 sm:p-12 flex flex-col bg-white overflow-y-auto">
          <div className="mb-6 sm:mb-8">
            <span className="px-2.5 py-1 bg-orange-50 text-orange-600 text-[10px] sm:text-xs font-black rounded-lg uppercase tracking-widest border border-orange-100">
              {product.category}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3 sm:mt-4 leading-tight">{product.name}</h2>
            <p className="text-3xl sm:text-4xl font-black text-orange-600 mt-2 sm:mt-4 tracking-tighter">¥{product.price}</p>
          </div>

          <div className="flex-grow space-y-5 sm:space-y-6">
            <div className="space-y-2">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">产品详情</h4>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">{product.description}</p>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">核心属性</h4>
              <div className="flex flex-wrap gap-2">
                {product.attributes.map(attr => (
                  <span key={attr} className="px-3 py-1.5 bg-slate-50 border border-slate-100 text-slate-500 rounded-xl text-[11px] sm:text-xs font-bold whitespace-nowrap">
                    {attr}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 sm:mt-12 sticky bottom-0 bg-white pt-4 pb-6 sm:pb-0">
            <button onClick={() => { onAddToCart(product); onClose(); }} className="w-full bg-orange-600 text-white py-4 sm:py-5 rounded-2xl sm:rounded-3xl font-black text-lg sm:text-xl shadow-2xl shadow-orange-100 active:scale-95 hover:bg-orange-700 transition-all flex items-center justify-center gap-3">
              <Icons.Cart />立即添加到预订
            </button>
            <p className="text-center text-slate-300 text-[9px] font-bold mt-4 tracking-widest uppercase">Premium Fireworks by binbinaidapao</p>
          </div>
        </div>
      </div>
    </div>
  );
};
