'use client';

import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, ArrowDownLeft, ArrowUpRight, History, QrCode } from 'lucide-react';

export default function Dashboard() {
  const [worker, setWorker] = useState(null);

  useEffect(() => {
    const savedWorker = localStorage.getItem('tip_worker');
    if (savedWorker) {
      setWorker(JSON.parse(savedWorker));
    } else {
      window.location.href = '/login';
    }
  }, []);

  const recentTips = [
    { id: 1, amount: 5000, from: "Anonymous", time: "2 hours ago", method: "Airtel Money" },
    { id: 2, amount: 20000, from: "Safari Guest", time: "5 hours ago", method: "Visa" },
    { id: 3, amount: 2000, from: "Anonymous", time: "Yesterday", method: "MTN MoMo" },
  ];

  if (!worker) return null;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Wallet Balance Card */}
      <div className="gradient-bg rounded-[2rem] p-6 md:p-8 text-white card-shadow relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="w-full md:w-auto">
            <p className="text-gray-300 mb-2 font-medium">Hello, {worker.fullName}</p>
            <h2 className="text-3xl md:text-5xl font-bold">UGX {parseFloat(worker.balance || 0).toLocaleString()}</h2>
            <div className="flex gap-3 md:gap-4 mt-6">
               <button className="flex-1 md:flex-none bg-white text-primary px-6 py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2">
                 <ArrowDownLeft size={16} /> Withdraw
               </button>
               <button className="flex-1 md:flex-none bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2">
                 <ArrowUpRight size={16} /> Send
               </button>
            </div>
          </div>
          <div className="w-full md:w-auto bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl flex flex-col items-center">
             <QrCode size={100} className="mb-3" />
             <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">Your Tip ID: {worker.tipId}</p>
             <button className="mt-2 text-xs font-bold underline">Show Full QR</button>
          </div>
        </div>
        {/* Subtle Decorative Circle */}
        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-primary">Recent Tips</h3>
            <button className="text-accent font-bold text-sm flex items-center gap-1">
              View All <History size={14} />
            </button>
          </div>
          <div className="bg-white rounded-2xl card-shadow border border-gray-50 overflow-hidden">
            {recentTips.map((tip) => (
              <div key={tip.id} className="flex items-center justify-between p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-accent/10 text-accent rounded-full flex items-center justify-center">
                    <ArrowDownLeft size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-primary">UGX {tip.amount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{tip.from} • {tip.method}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400">{tip.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats / Goals Quick View */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-primary">Goals Progress</h3>
          <div className="bg-white p-6 rounded-2xl card-shadow border border-gray-50 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-bold text-primary">Rent (Feb)</span>
                <span className="text-gray-500">65%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-accent h-full w-[65%] rounded-full"></div>
              </div>
              <p className="text-[10px] text-gray-400">UGX 195,000 / 300,000</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-bold text-primary">School Fees</span>
                <span className="text-gray-500">20%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-secondary h-full w-[20%] rounded-full"></div>
              </div>
              <p className="text-[10px] text-gray-400">UGX 50,000 / 250,000</p>
            </div>

            <button className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 font-bold text-sm hover:border-accent hover:text-accent transition-all">
              + Add New Goal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}