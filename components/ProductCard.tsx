
import React from 'react';
import { Product } from '../types';
import { Icons } from '../constants';

export const ProductCard: React.FC<{ 
  product: Product, 
  onAddToCart: (p: Product) => void,
  onViewDetail: () => void 
}> = ({ product, onAddToCart, onViewDetail }) => (
  <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col group transition-all hover:shadow-xl hover:shadow-orange-100">
    <div className="relative aspect-square overflow-hidden cursor-pointer" onClick={onViewDetail} title="点击查看产品高清细节及详细参数">
      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/95 rounded-xl text-sm font-black text-orange-600 shadow-sm border border-orange-50">
        ¥{product.price}
      </div>
      <div className="absolute bottom-4 left-4">
        <span className="px-3 py-1 bg-black/40 backdrop-blur-md text-white text-[10px] font-black rounded-lg uppercase tracking-wider border border-white/20">
          {product.category}
        </span>
      </div>
    </div>
    <div className="p-5 flex flex-col flex-grow">
      <h3 className="font-black text-slate-800 line-clamp-1 text-lg mb-1 cursor-pointer" onClick={onViewDetail} title={product.name}>{product.name}</h3>
      <p className="text-xs text-slate-400 font-medium line-clamp-2 h-8 leading-relaxed mb-4">{product.description}</p>
      <button 
        onClick={() => onAddToCart(product)} 
        title={`将“${product.name}”添加到我的预订清单`}
        className="w-full bg-orange-600 text-white py-3.5 rounded-2xl text-sm font-black flex items-center justify-center gap-2 hover:bg-orange-700 active:scale-95 transition-all shadow-lg shadow-orange-100"
      >
        <Icons.Cart />立即预订
      </button>
    </div>
  </div>
);
