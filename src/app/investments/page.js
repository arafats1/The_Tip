'use client';

import { useState, useEffect } from 'react';
import { Target, TrendingUp, ShieldCheck, ChevronRight, Info, X, Calendar, Wallet } from 'lucide-react';
import { api } from '@/lib/api';

export default function InvestmentsPage() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [worker, setWorker] = useState(null);
  
  // Modals state
  const [isNewGoalModalOpen, setIsNewGoalModalOpen] = useState(false);
  const [isAddFundsModalOpen, setIsAddFundsModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [selectedFund, setSelectedFund] = useState(null);
  const [fundAmount, setFundAmount] = useState('');
  const [fundMethod, setFundMethod] = useState('wallet'); // 'wallet' or 'momo'
  const [momoPhoneMode, setMomoPhoneMode] = useState('registered'); // 'registered' or 'other'
  const [customPhone, setCustomPhone] = useState('');
  
  const [goalForm, setGoalForm] = useState({
    title: '',
    targetAmount: '',
    deadline: '',
    isLongTerm: true
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      const savedWorker = localStorage.getItem('tip_worker');
      if (savedWorker) {
        const localWorker = JSON.parse(savedWorker);
        setWorker(localWorker);
        await fetchGoals(localWorker.id);
      } else {
        window.location.href = '/login';
      }
      setLoading(false);
    };

    fetchInitialData();
  }, []);

  const fetchGoals = async (workerId) => {
    try {
      const result = await api.getGoals(workerId);
      if (result.data) {
        const allGoals = result.data.map(g => g.attributes ? { id: g.id, ...g.attributes } : g);
        // Only show long term goals on this page (both financial and micro-investments)
        setGoals(allGoals.filter(g => g.isLongTerm));
      }
    } catch (err) {
      console.error('Failed to fetch goals', err);
    }
  };

  const microInvestments = goals.filter(g => g.isMicroInvestment);
  const financialGoals = goals.filter(g => !g.isMicroInvestment);
  const investedBalance = microInvestments.reduce((acc, g) => acc + (parseFloat(g.currentAmount) || 0), 0);
  const financialGoalsTotal = financialGoals.reduce((acc, g) => acc + (parseFloat(g.currentAmount) || 0), 0);

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...goalForm,
        targetAmount: parseFloat(goalForm.targetAmount),
        tip_worker: worker.id,
        isLongTerm: true
      };
      await api.createGoal(data);
      setIsNewGoalModalOpen(false);
      setGoalForm({ title: '', targetAmount: '', deadline: '', isLongTerm: true });
      fetchGoals(worker.id);
    } catch (err) {
      console.error('Error creating goal', err);
    }
  };

  const handleAddFunds = async (e) => {
    e.preventDefault();
    try {
      const amount = parseFloat(fundAmount);
      if (fundMethod === 'wallet' && worker.balance < amount) {
        alert('Insufficient wallet balance');
        return;
      }

      let targetGoalId = selectedGoal?.id;

      // If investing in a fund, find or create the goal for it
      if (selectedFund) {
        const fundTitle = `${selectedFund.manager} ${selectedFund.name}`;
        const existingGoal = goals.find(g => g.title === fundTitle);
        
        if (existingGoal) {
          targetGoalId = existingGoal.id;
        } else {
          const newGoalData = {
            title: fundTitle,
            targetAmount: 10000000, // Default 10M target for funds
            isLongTerm: true,
            isMicroInvestment: true,
            tip_worker: worker.id
          };
          const response = await api.createGoal(newGoalData);
          targetGoalId = response.data?.id || response.id;
        }
      }

      if (!targetGoalId) {
        alert('Could not determine investment target');
        return;
      }

      const transactionData = {
        amount: amount,
        method: 'momo',
        type: fundMethod === 'wallet' ? 'goal-deposit-wallet' : 'goal-deposit-momo',
        tip_worker: worker.id,
        tip_goal: targetGoalId,
        senderName: worker.fullName,
        status: 'completed',
        metadata: {
          fundName: selectedFund?.name || null,
          phone: fundMethod === 'momo' ? (momoPhoneMode === 'registered' ? worker.phone : customPhone) : null
        }
      };

      await api.createTransaction(transactionData);
      
      // Update local worker balance if it was from wallet
      if (fundMethod === 'wallet') {
        const newBalance = worker.balance - amount;
        const updatedWorker = { ...worker, balance: newBalance };
        setWorker(updatedWorker);
        localStorage.setItem('tip_worker', JSON.stringify(updatedWorker));
      }

      setIsAddFundsModalOpen(false);
      setFundAmount('');
      setSelectedFund(null);
      setSelectedGoal(null);
      fetchGoals(worker.id);
      alert('Investment processed successfully!');
    } catch (err) {
      console.error('Error adding funds', err);
      alert('Failed to process investment');
    }
  };

  const formatNumber = (val) => {
    if (!val) return '';
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const parseNumber = (val) => {
    return val.replace(/,/g, '');
  };

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
             {financialGoals.length === 0 ? (
               <div className="text-center py-8 text-gray-400 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                 <p className="font-bold">No financial goals set yet</p>
               </div>
             ) : (
               financialGoals.map((goal) => {
                 const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100) || 0);
                 return (
                   <div key={goal.id} className="bg-white p-5 md:p-6 rounded-3xl border border-gray-100 card-shadow space-y-4">
                     <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg text-primary">{goal.title}</h3>
                          <p className="text-xs text-gray-400">Target: {goal.deadline ? new Date(goal.deadline).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : 'No deadline'}</p>
                        </div>
                        <div className="text-right flex flex-col items-end gap-1">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${progress >= 100 ? 'bg-secondary/10 text-secondary' : 'bg-accent/10 text-accent'}`}>
                            {progress >= 100 ? 'Completed' : 'On Track'}
                          </span>
                          <span className="text-xs font-bold text-primary">{progress}%</span>
                        </div>
                     </div>
                     <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                       <div 
                        className={`h-full rounded-full transition-all duration-1000 ${progress >= 100 ? 'bg-secondary' : 'bg-accent'}`}
                        style={{ width: `${progress}%` }}
                       ></div>
                     </div>
                     <div className="flex justify-between items-end">
                       <div>
                         <p className="text-lg font-bold text-primary">UGX {parseFloat(goal.currentAmount || 0).toLocaleString()}</p>
                         <p className="text-[10px] text-gray-400">Saved of UGX {parseFloat(goal.targetAmount).toLocaleString()}</p>
                       </div>
                       <button 
                        onClick={() => {
                          setSelectedGoal(goal);
                          setIsAddFundsModalOpen(true);
                        }}
                        className="text-accent font-bold text-sm bg-accent/5 px-4 py-2 rounded-xl hover:bg-accent hover:text-white transition-all"
                       >
                        Add Funds
                       </button>
                     </div>
                   </div>
                 );
               })
             )}

             <button 
              onClick={() => setIsNewGoalModalOpen(true)}
              className="w-full py-6 md:py-8 border-2 border-dashed border-gray-200 rounded-3xl text-gray-400 font-bold hover:border-accent hover:text-accent transition-all flex flex-col items-center gap-1 md:gap-2"
             >
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

          <div className="bg-[#1a1b4b] rounded-3xl p-6 text-white space-y-4 shadow-xl shadow-indigo-100/50">
             <div className="flex items-center gap-2 text-secondary">
               <ShieldCheck size={18} />
               <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Regulated by CMA Uganda</span>
             </div>
             <p className="text-sm text-gray-300 leading-relaxed">Start investing from as little as UGX 1,000. Your money is managed by professional fund managers.</p>
             <div className="bg-white/5 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
               <div>
                 <p className="text-[10px] text-white/60 font-bold uppercase">Invested Balance</p>
                 <p className="text-xl font-bold">UGX {investedBalance.toLocaleString()}</p>
               </div>
               <div className="text-[#3ed5a2] font-bold text-sm bg-white p-2 px-3 rounded-lg">+8.2% total gain</div>
             </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Available Fund Managers</p>
            {funds.map((fund, idx) => {
              const fundTitle = `${fund.manager} ${fund.name}`;
              const fundData = microInvestments.find(g => g.title === fundTitle);
              const balance = parseFloat(fundData?.currentAmount || 0);

              return (
                <div 
                  key={idx} 
                  onClick={() => {
                    setSelectedFund(fund);
                    setSelectedGoal(null); // Clear selected goal
                    setIsAddFundsModalOpen(true);
                  }}
                  className="bg-white p-4 rounded-2xl border border-gray-50 flex items-center justify-between hover:border-accent hover:bg-accent/5 cursor-pointer transition-all card-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl">{fund.icon}</div>
                    <div>
                      <h4 className="font-bold text-primary text-sm">{fund.name}</h4>
                      <p className="text-[10px] text-gray-500">{fund.manager} • {fund.risk} Risk</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div className="text-right">
                      {balance > 0 ? (
                        <p className="text-sm font-bold text-primary">UGX {balance.toLocaleString()}</p>
                      ) : (
                        <p className="text-accent font-bold text-sm">{fund.yield}</p>
                      )}
                      <p className="text-[10px] text-gray-400">{balance > 0 ? 'Current Balance' : 'Target yield'}</p>
                    </div>
                    <ChevronRight size={16} className="text-gray-300" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-blue-50 p-4 rounded-2xl flex gap-3">
            <Info className="text-blue-500 shrink-0" size={20} />
            <p className="text-[10px] text-blue-800 leading-relaxed">
              Investments carry risk. Past performance does not guarantee future results. All funds are regulated by the Capital Markets Authority.
            </p>
          </div>
        </div>
      </div>

      {/* New Goal Modal */}
      {isNewGoalModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 relative animate-in zoom-in duration-300">
            <button 
              onClick={() => setIsNewGoalModalOpen(false)}
              className="absolute right-6 top-6 text-gray-400 hover:text-primary"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-primary mb-6">New Financial Goal</h2>
            <form onSubmit={handleCreateGoal} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Goal Name</label>
                <input 
                  required
                  type="text"
                  placeholder="e.g. Land, Motorbike"
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-primary p-4 rounded-2xl outline-none font-bold text-primary"
                  value={goalForm.title}
                  onChange={(e) => setGoalForm({...goalForm, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Target Amount (UGX)</label>
                <div className="relative">
                  <input 
                    required
                    type="text"
                    inputMode="numeric"
                    placeholder="2,000,000"
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-primary p-4 rounded-2xl outline-none font-bold text-primary"
                    value={formatNumber(goalForm.targetAmount)}
                    onChange={(e) => {
                      const val = parseNumber(e.target.value);
                      if (/^\d*$/.test(val)) {
                        setGoalForm({...goalForm, targetAmount: val});
                      }
                    }}
                  />
                  {goalForm.targetAmount && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                      UGX
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Timeline (Deadline)</label>
                <input 
                  required
                  type="date"
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-primary p-4 rounded-2xl outline-none font-bold text-primary"
                  value={goalForm.deadline}
                  onChange={(e) => setGoalForm({...goalForm, deadline: e.target.value})}
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-secondary text-white py-4 rounded-2xl font-bold text-lg hover:bg-opacity-95 shadow-lg flex items-center justify-center gap-2"
              >
                <Target size={20} /> Create Long-term Goal
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Funds Modal */}
      {isAddFundsModalOpen && (selectedGoal || selectedFund) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 relative animate-in zoom-in duration-300">
            <button 
              onClick={() => {
                setIsAddFundsModalOpen(false);
                setSelectedFund(null);
                setSelectedGoal(null);
              }}
              className="absolute right-6 top-6 text-gray-400 hover:text-primary"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-primary mb-2">
              {selectedFund ? 'Invest in Fund' : 'Fund Goal'}
            </h2>
            <p className="text-gray-500 mb-6 text-sm">
              {selectedFund ? (
                <>Adding capital to: <span className="font-bold text-primary">{selectedFund.manager} {selectedFund.name}</span></>
              ) : (
                <>Add money to: <span className="font-bold text-primary">{selectedGoal?.title}</span></>
              )}
            </p>
            
            <form onSubmit={handleAddFunds} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Amount to Add (UGX)</label>
                <div className="relative">
                  <input 
                    required
                    type="text"
                    inputMode="numeric"
                    placeholder="50,000"
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-primary p-4 rounded-2xl outline-none font-bold text-primary"
                    value={formatNumber(fundAmount)}
                    onChange={(e) => {
                      const val = parseNumber(e.target.value);
                      if (/^\d*$/.test(val)) {
                        setFundAmount(val);
                      }
                    }}
                  />
                  {fundAmount && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                      UGX
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Funding Method</label>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    type="button"
                    onClick={() => setFundMethod('wallet')}
                    className={`p-4 rounded-2xl border-2 font-bold flex flex-col items-center gap-2 transition-all ${fundMethod === 'wallet' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 text-gray-400'}`}
                  >
                    <Wallet size={20} /> 
                    <div className="text-xs text-center">
                      Wallet
                      <p className="text-[10px] opacity-60">Bal: UGX {worker.balance.toLocaleString()}</p>
                    </div>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFundMethod('momo')}
                    className={`p-4 rounded-2xl border-2 font-bold flex flex-col items-center gap-2 transition-all ${fundMethod === 'momo' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 text-gray-400'}`}
                  >
                    <ShieldCheck size={20} /> 
                    <div className="text-xs">MoMo</div>
                  </button>
                </div>
              </div>

              {fundMethod === 'momo' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <label className="text-sm font-bold text-gray-700 block">Withdraw money from:</label>
                  <div className="space-y-2">
                    <button 
                      type="button"
                      onClick={() => setMomoPhoneMode('registered')}
                      className={`w-full p-3 rounded-xl border-2 text-left transition-all flex items-center justify-between ${momoPhoneMode === 'registered' ? 'border-primary bg-white text-primary' : 'border-transparent text-gray-500'}`}
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-bold">Registered Number</span>
                        <span className="text-[10px] opacity-60">{worker.phone}</span>
                      </div>
                      {momoPhoneMode === 'registered' && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setMomoPhoneMode('other')}
                      className={`w-full p-3 rounded-xl border-2 text-left transition-all flex items-center justify-between ${momoPhoneMode === 'other' ? 'border-primary bg-white text-primary' : 'border-transparent text-gray-500'}`}
                    >
                      <span className="text-xs font-bold">Use Different Number</span>
                      {momoPhoneMode === 'other' && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                    </button>
                  </div>
                  
                  {momoPhoneMode === 'other' && (
                    <input 
                      required
                      type="tel"
                      placeholder="e.g. 0770000000"
                      className="w-full bg-white border-2 border-gray-100 focus:border-primary p-3 rounded-xl outline-none text-sm font-bold text-primary animate-in zoom-in-95 duration-200"
                      value={customPhone}
                      onChange={(e) => setCustomPhone(e.target.value)}
                    />
                  )}
                </div>
              )}

              <button 
                type="submit"
                className="w-full bg-accent text-white py-4 rounded-2xl font-bold text-lg hover:bg-opacity-95 shadow-lg"
              >
                Confirm Deposit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}