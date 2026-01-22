'use client';

import { useState, useEffect } from 'react';
import { Target, TrendingUp, ShieldCheck, ChevronRight, Info } from 'lucide-react';

export default function GoalsPage() {
  const [loading, setLoading] = useState(true);
  const [worker, setWorker] = useState(null);

  useEffect(() => {
    const savedWorker = localStorage.getItem('tip_worker');
    if (savedWorker) {
      setWorker(JSON.parse(savedWorker));
    } else {
      window.location.href = '/login';
    }
    setLoading(false);
  }, []);

  if (loading || !worker) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const funds = [
    { name: "Balanced Fund", manager: "Xeno", yield: "+12.5% p.a", risk: "Low", icon: "📈" },
    { name: "Equity Fund", manager: "UAP Old Mutual", yield: "+15.2% p.a", risk: "Medium", icon: "📊" },
    { name: "Money Market", manager: "ICEA Lion", yield: "+11.0% p.a", risk: "Very Low", icon: "💰" },
  ];

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-10 md:space-y-12 pb-20">
      {/* Header */}
      <div className="space-y-2 text-center md:text-left pt-4">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">Grow Your Earnings</h1>
        <p className="text-gray-500">Put your tips to work by saving for goals or investing in regulated funds.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-10 md:gap-12">
        {/* Goals Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary/10 text-secondary rounded-lg">
              <Target size={24} />
            </div>
            <h2 className="text-2xl font-bold text-primary">Financial Goals</h2>
          </div>

          <div className="space-y-4">
             {/* Dynamic Goal cards */}
             <div className="bg-white p-5 md:p-6 rounded-3xl border border-gray-100 card-shadow space-y-4">
               <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-primary">New Motorbike (Boda)</h3>
                    <p className="text-xs text-gray-400">Target: Dec 2026</p>
                  </div>
                  <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-[10px] font-bold">On Track</span>
               </div>
               <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                 <div className="bg-accent h-full w-[15%] rounded-full"></div>
               </div>
               <div className="flex justify-between items-end">
                 <div>
                   <p className="text-lg font-bold text-primary">UGX 450,000</p>
                   <p className="text-[10px] text-gray-400">Saved of UGX 3,000,000</p>
                 </div>
                 <button className="text-accent font-bold text-sm bg-accent/5 px-4 py-2 rounded-xl">Add Funds</button>
               </div>
             </div>

             <button className="w-full py-6 md:py-8 border-2 border-dashed border-gray-200 rounded-3xl text-gray-400 font-bold hover:border-accent hover:text-accent transition-all flex flex-col items-center gap-1 md:gap-2">
                <span className="text-2xl">+</span>
                <span className="text-sm">Create a new goal</span>
             </button>
          </div>
        </div>

        {/* Investment Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 text-accent rounded-lg">
              <TrendingUp size={24} />
            </div>
            <h2 className="text-2xl font-bold text-primary">Micro-Investments</h2>
          </div>

          <div className="bg-primary rounded-3xl p-6 text-white space-y-4 shadow-xl shadow-indigo-100/50">
             <div className="flex items-center gap-2 text-secondary">
               <ShieldCheck size={18} />
               <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Regulated by CMA Uganda</span>
             </div>
             <p className="text-sm text-gray-300 leading-relaxed">Start investing from as little as UGX 1,000. Your money is managed by professional fund managers.</p>
             <div className="bg-white/10 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
               <div>
                 <p className="text-[10px] text-white/60 font-bold uppercase">Invested Balance</p>
                 <p className="text-xl font-bold">UGX 85,000</p>
               </div>
               <div className="text-accent font-bold text-sm bg-white p-2 rounded-lg">+8.2% total gain</div>
             </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Available Fund Managers</p>
            {funds.map((fund, idx) => (
              <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-50 card-shadow flex items-center justify-between hover:border-accent cursor-pointer transition-all">
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{fund.icon}</div>
                  <div>
                    <h4 className="font-bold text-primary text-sm">{fund.name}</h4>
                    <p className="text-[10px] text-gray-500">{fund.manager} • {fund.risk} Risk</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-accent font-bold text-sm">{fund.yield}</p>
                  <ChevronRight size={16} className="ml-auto text-gray-300" />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 p-4 rounded-2xl flex gap-3">
            <Info className="text-blue-500 shrink-0" size={20} />
            <p className="text-[10px] text-blue-800 leading-relaxed">
              Investments carry risk. Past performance does not guarantee future results. All funds are regulated by the Capital Markets Authority.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}