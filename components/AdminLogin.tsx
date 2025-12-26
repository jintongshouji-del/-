
import React, { useState } from 'react';
import { Icons } from '../constants';

export const AdminLogin: React.FC<{ onLogin: (u: string, p: string) => boolean }> = ({ onLogin }) => {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [err, setErr] = useState(false);
  return (
    <div className="max-w-md mx-auto py-24 px-4">
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4"><Icons.Lock /></div>
          <h2 className="text-2xl font-bold">管理后台</h2>
        </div>
        <form onSubmit={e => { e.preventDefault(); if (!onLogin(u, p)) setErr(true); }} className="space-y-4">
          <input required type="text" placeholder="账号" className="w-full px-4 py-3 rounded-xl border" value={u} onChange={e => setU(e.target.value)} />
          <input required type="password" placeholder="密码" className="w-full px-4 py-3 rounded-xl border" value={p} onChange={e => setP(e.target.value)} />
          {err && <p className="text-rose-500 text-sm text-center font-bold animate-shake">账号或密码错误</p>}
          <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold">进入后台</button>
        </form>
      </div>
    </div>
  );
};
