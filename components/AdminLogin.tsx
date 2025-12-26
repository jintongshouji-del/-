
import React, { useState } from 'react';
import { Icons } from '../constants';

export const AdminLogin: React.FC<{ onLogin: (u: string, p: string) => boolean }> = ({ onLogin }) => {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [err, setErr] = useState(false);
  return (
    <div className="max-w-md mx-auto py-24 px-4">
      <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm"><Icons.Lock /></div>
          <h2 className="text-2xl font-black text-slate-900">管理员登录</h2>
          <p className="text-xs text-slate-400 mt-2 font-bold tracking-widest uppercase">binbinaidapao Control Center</p>
        </div>
        <form onSubmit={e => { e.preventDefault(); if (!onLogin(u, p)) setErr(true); }} className="space-y-4">
          <input required type="text" placeholder="账号" className="w-full px-5 py-4 rounded-2xl border bg-slate-50 focus:border-orange-500 outline-none" value={u} onChange={e => setU(e.target.value)} />
          <input required type="password" placeholder="密码" className="w-full px-5 py-4 rounded-2xl border bg-slate-50 focus:border-orange-500 outline-none" value={p} onChange={e => setP(e.target.value)} />
          {err && <p className="text-rose-500 text-sm text-center font-black animate-shake">验证未通过</p>}
          <button type="submit" className="w-full bg-orange-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-orange-100 hover:bg-orange-700 transition-all">进入后台</button>
        </form>
      </div>
    </div>
  );
};
