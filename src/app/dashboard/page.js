'use client';

import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, ArrowDownLeft, ArrowUpRight, History, QrCode, Plus, Pencil, Trash2, X } from 'lucide-react';
import { api } from '@/lib/api';

export default function Dashboard() {
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentTips, setRecentTips] = useState([]);
  const [goals, setGoals] = useState([]);
  
  // Goal Modal State
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [goalForm, setGoalForm] = useState({
    title: '',
    targetAmount: '',
    allocationPercentage: 0
  });

  useEffect(() => {
    const fetchLatestBalance = async () => {
      const savedWorker = localStorage.getItem('tip_worker');
      if (savedWorker) {
        const localData = JSON.parse(savedWorker);
        try {
          // Use documentId for Strapi 5, fallback to id
          const workerId = localData.documentId || localData.document_id || localData.id;
          const result = await api.getWorker(workerId);
          
          let updatedData = null;
          // Handle Strapi 5 response format
          if (result.data) {
            updatedData = { ...localData, ...result.data, documentId: result.data.documentId || result.data.id };
          } else if (result.id) {
            updatedData = { ...localData, ...result, documentId: result.documentId || result.id };
          }

          if (updatedData) {
            setWorker(updatedData);
            localStorage.setItem('tip_worker', JSON.stringify(updatedData));
            // Fetch data
            fetchTransactions(localData.id);
            fetchGoals(localData.id);
          } else {
            setWorker(localData);
            fetchTransactions(localData.id);
            fetchGoals(localData.id);
          }
        } catch (err) {
          console.error("Failed to fetch latest balance", err);
          setWorker(localData);
          fetchTransactions(localData.id);
          fetchGoals(localData.id);
        }
      } else {
        window.location.href = '/login';
      }
      setLoading(false);
    };

    fetchLatestBalance();
  }, []);

  const fetchTransactions = async (workerId) => {
    try {
      const result = await api.getTransactions(workerId);
      if (result.data && Array.isArray(result.data)) {
        const formattedTips = result.data.map(transaction => {
          const createdAt = new Date(transaction.createdAt || transaction.created_at);
          const now = new Date();
          const diffMs = now - createdAt;
          const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
          const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          
          let timeAgo;
          if (diffHrs < 1) {
            timeAgo = 'Just now';
          } else if (diffHrs < 24) {
            timeAgo = `${diffHrs} hour${diffHrs > 1 ? 's' : ''} ago`;
          } else if (diffDays === 1) {
            timeAgo = 'Yesterday';
          } else {
            timeAgo = `${diffDays} days ago`;
          }

          const methodMap = {
            'momo': 'Mobile Money',
            'card': 'Card Payment',
            'visa': 'Visa',
            'mastercard': 'Mastercard'
          };

          return {
            id: transaction.id,
            amount: parseFloat(transaction.amount || 0),
            from: transaction.senderName || transaction.sender_name || 'Anonymous',
            time: timeAgo,
            method: methodMap[transaction.method] || transaction.method
          };
        });
        setRecentTips(formattedTips);
      }
    } catch (err) {
      console.error('Failed to fetch transactions', err);
    }
  };

  const fetchGoals = async (workerId) => {
    try {
      const result = await api.getGoals(workerId);
      if (result.data) {
        // Strapi 5 usually returns flat data if we configured it, but let's handle both
        const formattedGoals = result.data.map(g => g.attributes ? { id: g.id, ...g.attributes } : g);
        setGoals(formattedGoals);
      }
    } catch (err) {
      console.error('Failed to fetch goals', err);
    }
  };

  const handleGoalSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        title: goalForm.title,
        targetAmount: parseFloat(goalForm.targetAmount),
        allocationPercentage: parseInt(goalForm.allocationPercentage),
        tip_worker: worker.id
      };

      if (editingGoal) {
        await api.updateGoal(editingGoal.id, data);
      } else {
        await api.createGoal(data);
      }
      
      setIsGoalModalOpen(false);
      setEditingGoal(null);
      setGoalForm({ title: '', targetAmount: '', allocationPercentage: 0 });
      fetchGoals(worker.id);
    } catch (err) {
      console.error('Error saving goal', err);
    }
  };

  const deleteGoal = async (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await api.deleteGoal(id);
        fetchGoals(worker.id);
      } catch (err) {
        console.error('Error deleting goal', err);
      }
    }
  };

  const totalAllocated = goals.reduce((sum, g) => sum + (g.allocationPercentage || 0), 0);
  const availablePercentage = 100 - (totalAllocated - (editingGoal ? editingGoal.allocationPercentage : 0));

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
               <a href="/goals" className="flex-1 md:flex-none bg-accent text-white px-6 py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2">
                 <TrendingUp size={16} /> Invest
               </a>
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
            {recentTips.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <p className="font-medium">No tips received yet</p>
                <p className="text-xs mt-1">Share your Tip ID to start receiving!</p>
              </div>
            ) : (
              recentTips.map((tip) => (
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
              ))
            )}
          </div>
        </div>

        {/* Stats / Goals Quick View */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-primary">Goals</h3>
          <div className="bg-white p-6 rounded-2xl card-shadow border border-gray-50 space-y-6">
            {goals.length === 0 ? (
              <div className="text-center py-4 text-gray-400">
                <p className="text-sm">No goals set yet.</p>
              </div>
            ) : (
              goals.map((goal) => {
                const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100) || 0);
                return (
                  <div key={goal.id} className="space-y-2 group relative">
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary">{goal.title}</span>
                        <span className="text-[10px] bg-indigo-50 text-primary px-1.5 py-0.5 rounded-md font-bold">{goal.allocationPercentage}%</span>
                      </div>
                      <span className="text-gray-500">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${progress >= 100 ? 'bg-accent' : 'bg-primary'}`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] text-gray-400">UGX {parseFloat(goal.currentAmount || 0).toLocaleString()} / {parseFloat(goal.targetAmount).toLocaleString()}</p>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                          onClick={() => {
                            setEditingGoal(goal);
                            setGoalForm({
                              title: goal.title,
                              targetAmount: goal.targetAmount,
                              allocationPercentage: goal.allocationPercentage
                            });
                            setIsGoalModalOpen(true);
                          }}
                          className="text-primary hover:text-accent transition-colors"
                         >
                           <Pencil size={12} />
                         </button>
                         <button 
                          onClick={() => deleteGoal(goal.id)}
                          className="text-red-400 hover:text-red-500 transition-colors"
                         >
                           <Trash2 size={12} />
                         </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            <button 
              onClick={() => {
                setEditingGoal(null);
                setGoalForm({ title: '', targetAmount: '', allocationPercentage: 0 });
                setIsGoalModalOpen(true);
              }}
              className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 font-bold text-sm hover:border-accent hover:text-accent transition-all flex items-center justify-center gap-2"
            >
              <Plus size={16} /> Add Goal
            </button>
          </div>
        </div>
      </div>

      {/* Goal Modal */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 relative animate-in zoom-in duration-300">
            <button 
              onClick={() => setIsGoalModalOpen(false)}
              className="absolute right-6 top-6 text-gray-400 hover:text-primary transition-colors"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold text-primary mb-6">{editingGoal ? 'Edit Goal' : 'New Goal'}</h2>

            <form onSubmit={handleGoalSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Goal Name</label>
                <input 
                  required
                  type="text"
                  placeholder="e.g. Rent, School Fees"
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-primary p-4 rounded-2xl outline-none font-bold text-primary transition-all"
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
                    placeholder="500,000"
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-primary p-4 rounded-2xl outline-none font-bold text-primary transition-all"
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
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-bold text-gray-700">Tip Allocation (%)</label>
                  <span className="text-xs font-bold text-accent">Available: {availablePercentage}%</span>
                </div>
                <div className="relative pt-2">
                  <input 
                    type="range"
                    min="0"
                    max={availablePercentage}
                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary"
                    value={goalForm.allocationPercentage}
                    onChange={(e) => setGoalForm({...goalForm, allocationPercentage: e.target.value})}
                  />
                  <div className="flex justify-between mt-2 px-1">
                    <span className="text-xs font-bold text-gray-400">0%</span>
                    <span className="text-lg font-bold text-primary">{goalForm.allocationPercentage}%</span>
                    <span className="text-xs font-bold text-gray-400">{availablePercentage}%</span>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 italic mt-1 leading-relaxed">
                  This percentage of every tip you receive will be automatically saved towards this goal.
                </p>
              </div>

              <button 
                type="submit"
                className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:bg-opacity-95 transition-all shadow-lg"
              >
                {editingGoal ? 'Save Changes' : 'Create Goal'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}