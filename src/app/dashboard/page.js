'use client';

import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, ArrowDownLeft, ArrowUpRight, History, QrCode, Plus, Pencil, Trash2, X, Download, Share2, Copy, Check, Phone } from 'lucide-react';
import { api } from '@/lib/api';
import { QRCodeCanvas } from 'qrcode.react';
import Link from 'next/link';

export default function Dashboard() {
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  
  // QR Modal State
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Transfer Modals (Withdraw/Send)
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [transferLoading, setTransferLoading] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [sendForm, setSendForm] = useState({
    amount: '',
    network: 'MTN',
    phone: ''
  });

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
      // Determine if we have data in result.data or if result is the array itself
      const rawData = Array.isArray(result) ? result : (result.data || []);
      
      if (Array.isArray(rawData)) {
        // Handle both flat and Strapi attributes format
        const allTransactions = rawData.map(t => t.attributes ? { id: t.id, ...t.attributes } : t);
        
        // Sort by date newest first
        const sortedData = allTransactions.sort((a, b) => 
          new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at)
        );
        
        // Filter out goal deposits, only show standard tips, withdrawals, and transfers
        const filteredData = sortedData.filter(t => !t.type || ['tip', 'withdrawal', 'transfer'].includes(t.type));
        
        const formattedTransactions = filteredData.map(transaction => {
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

          let fromName = transaction.senderName || transaction.sender_name || 'Anonymous';
          let type = transaction.type || 'tip';
          
          if (type === 'withdrawal') {
            fromName = 'Withdrawal to ' + (transaction.phone || worker?.phone || 'Mobile Money');
          } else if (type === 'transfer') {
            fromName = 'Sent to ' + (transaction.recipient || 'Mobile Money');
          }

          return {
            id: transaction.id,
            amount: parseFloat(transaction.amount || 0),
            from: fromName,
            time: timeAgo,
            method: methodMap[transaction.method?.toLowerCase()] || transaction.method || 'Mobile Money',
            type: type
          };
        });
        setRecentTransactions(formattedTransactions);
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
        const allGoals = result.data.map(g => g.attributes ? { id: g.id, ...g.attributes } : g);
        // Only show short-term goals on dashboard
        setGoals(allGoals.filter(g => !g.isLongTerm));
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
        tip_worker: worker.id,
        isLongTerm: false
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

  const handleWithdraw = async (e) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) return;
    if (amount > worker.balance) {
      alert('Insufficient balance');
      return;
    }

    setTransferLoading(true);
    try {
      const newBalance = worker.balance - amount;
      const workerId = worker.documentId || worker.id;
      await api.updateWorker(workerId, { balance: newBalance });
      
      // Log Withdrawal Transaction
      const txResult = await api.createTransaction({
        amount: amount,
        method: 'momo',
        status: 'completed',
        tip_worker: workerId,
        type: 'withdrawal',
        reference: `WD-${Date.now()}`,
        from: 'Wallet',
        phone: worker.phone
      });

      if (!txResult || txResult.error) {
        throw new Error(txResult?.error?.message || 'Failed to log transaction');
      }
      
      // Update local state
      setWorker({ ...worker, balance: newBalance });
      setIsWithdrawModalOpen(false);
      setWithdrawAmount('');
      fetchTransactions(workerId);
      alert('Withdrawal successful! Funds sent to ' + worker.phone);
    } catch (err) {
      console.error('Withdraw error', err);
      alert('Withdrawal failed. Please try again.');
    } finally {
      setTransferLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const amount = parseFloat(sendForm.amount);
    if (!amount || amount <= 0) return;
    if (amount > worker.balance) {
      alert('Insufficient balance');
      return;
    }

    if (!sendForm.phone || sendForm.phone.length < 10) {
      alert('Invalid recipient phone number');
      return;
    }

    setTransferLoading(true);
    try {
      const newBalance = worker.balance - amount;
      const workerId = worker.documentId || worker.id;
      await api.updateWorker(workerId, { balance: newBalance });
      
      // Log Send Transaction
      const txResult = await api.createTransaction({
        amount: amount,
        method: 'momo',
        status: 'completed',
        tip_worker: workerId,
        type: 'transfer',
        reference: `TR-${Date.now()}`,
        from: 'Wallet',
        recipient: sendForm.phone
      });

      if (!txResult || txResult.error) {
        throw new Error(txResult?.error?.message || 'Failed to log transaction');
      }
      
      // Update local state
      setWorker({ ...worker, balance: newBalance });
      setIsSendModalOpen(false);
      setSendForm({ amount: '', network: 'MTN', phone: '' });
      fetchTransactions(workerId);
      alert(`Sent UGX ${amount.toLocaleString()} to ${sendForm.phone} (${sendForm.network})`);
    } catch (err) {
      console.error('Send error', err);
      alert('Transfer failed. Please try again.');
    } finally {
      setTransferLoading(false);
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
    <>
      <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Wallet Balance Card */}
      <div className="gradient-bg rounded-[2rem] p-6 md:p-8 text-white card-shadow relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="w-full md:w-auto">
            <p className="text-gray-300 mb-2 font-medium">Hello, {worker.fullName}</p>
            <h2 className="text-3xl md:text-5xl font-bold">UGX {parseFloat(worker.balance || 0).toLocaleString()}</h2>
            <div className="flex gap-3 md:gap-4 mt-6">
               <button 
                onClick={() => setIsWithdrawModalOpen(true)}
                className="flex-1 md:flex-none bg-white text-primary px-6 py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2"
               >
                 <ArrowDownLeft size={16} /> Withdraw
               </button>
               <button 
                onClick={() => setIsSendModalOpen(true)}
                className="flex-1 md:flex-none bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2"
               >
                 <ArrowUpRight size={16} /> Send
               </button>
               <a href="/investments" className="flex-1 md:flex-none bg-accent text-white px-6 py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2">
                 <TrendingUp size={16} /> Invest
               </a>
            </div>
          </div>
          <div className="w-full md:w-auto bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl flex flex-col items-center">
             <QrCode size={100} className="mb-3" />
             <div className="flex flex-col items-center">
               <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">Your Tip ID</p>
               <p className="text-xl font-black tracking-widest leading-none mt-1">{worker.tipId}</p>
             </div>
             <button 
              onClick={() => setIsQrModalOpen(true)}
              className="mt-4 text-xs font-bold underline hover:text-secondary transition-colors"
             >
              Show Full QR
             </button>
          </div>
        </div>
        {/* Subtle Decorative Circle */}
        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-primary">Recent Activity</h3>
            <Link href="/dashboard/history" className="text-accent font-bold text-sm flex items-center gap-1 hover:underline">
              View All <History size={14} />
            </Link>
          </div>
          <div className="bg-white rounded-2xl card-shadow border border-gray-50 overflow-hidden">
            {recentTransactions.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <p className="font-medium">No activity yet</p>
                <p className="text-xs mt-1">Share your Tip ID to start receiving!</p>
              </div>
            ) : (
              recentTransactions.slice(0, 4).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.type === 'tip' ? 'bg-accent/10 text-accent' : 
                      tx.type === 'withdrawal' ? 'bg-red-100 text-red-600' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      {tx.type === 'tip' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                    </div>
                    <div>
                      <p className={`font-bold ${
                        tx.type === 'tip' ? 'text-primary' : 'text-gray-900'
                      }`}>
                        {tx.type === 'tip' ? '+' : '-'} UGX {tx.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">{tx.from} • {tx.method}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">{tx.time}</p>
                </div>
              ))
            )}
            {recentTransactions.length > 4 && (
              <Link href="/dashboard/history" className="block w-full py-3 text-center text-xs font-bold text-gray-400 border-t border-gray-50 hover:bg-gray-50">
                + {recentTransactions.length - 4} more transactions
              </Link>
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
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-6 max-h-[90vh] overflow-y-auto relative animate-in zoom-in duration-300 custom-scrollbar">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-primary">{editingGoal ? 'Edit Goal' : 'New Goal'}</h2>
              <button 
                onClick={() => setIsGoalModalOpen(false)}
                className="text-gray-400 hover:text-primary transition-colors p-2"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleGoalSubmit} className="space-y-4">
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

      {/* QR Modal */}
      {isQrModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-6 max-h-[90vh] overflow-y-auto relative animate-in zoom-in duration-300 shadow-2xl custom-scrollbar">
            <div className="flex justify-end absolute top-4 right-4 z-20">
              <button 
                onClick={() => setIsQrModalOpen(false)}
                className="text-gray-400 hover:text-primary transition-colors p-2 bg-gray-50/80 backdrop-blur-sm rounded-full shadow-sm"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="text-center space-y-4">
              <div className="space-y-1 pt-2">
                <h2 className="text-2xl font-bold text-primary">Your Tip QR</h2>
                <p className="text-gray-500 text-sm">Customers scan this to send you tips</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-[2rem] inline-block border border-gray-100 flex flex-col items-center gap-3">
                <QRCodeCanvas 
                  id="tip-qr-code"
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}/tip?id=${worker.tipId}`} 
                  size={180}
                  level="H"
                  includeMargin={true}
                  imageSettings={{
                    src: "/favicon.ico",
                    x: undefined,
                    y: undefined,
                    height: 35,
                    width: 35,
                    excavate: true,
                  }}
                />
                <div className="flex flex-col items-center bg-white px-5 py-2 rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">TIP ID</p>
                  <p className="text-2xl font-black text-primary tracking-[0.2em]">{worker.tipId}</p>
                </div>
              </div>

              <div className="space-y-3 pt-1">
                <div className="bg-primary/5 p-3 rounded-2xl flex items-center justify-between border border-primary/10">
                  <div className="text-left overflow-hidden">
                    <p className="text-[10px] uppercase font-bold text-primary/60 tracking-wider">Your Unique Link</p>
                    <p className="text-xs font-bold text-primary truncate">
                      {typeof window !== 'undefined' ? window.location.host : ''}/tip?id={worker.tipId}
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      const link = `${window.location.origin}/tip?id=${worker.tipId}`;
                      navigator.clipboard.writeText(link);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="p-3 bg-white text-primary rounded-xl shadow-sm hover:bg-gray-50 transition-all border border-gray-100 shrink-0"
                  >
                    {copied ? <Check size={18} className="text-secondary" /> : <Copy size={18} />}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    className="flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-2xl font-bold text-xs hover:bg-opacity-90 transition-all shadow-md"
                    onClick={() => {
                      const canvas = document.getElementById('tip-qr-code');
                      if (canvas) {
                        const pngFile = canvas.toDataURL("image/png");
                        const downloadLink = document.createElement("a");
                        downloadLink.download = `tip-qr-${worker.tipId}.png`;
                        downloadLink.href = pngFile;
                        downloadLink.click();
                      }
                    }}
                  >
                    <Download size={14} /> Download
                  </button>
                  <button 
                    className="flex items-center justify-center gap-2 bg-secondary text-white py-4 rounded-2xl font-bold text-xs hover:bg-opacity-90 transition-all shadow-md"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: 'Tip me on The Tip',
                          text: `Hi! You can send me a tip using this link:`,
                          url: `${window.location.origin}/tip?id=${worker.tipId}`
                        });
                      }
                    }}
                  >
                    <Share2 size={14} /> Share
                  </button>
                </div>
              </div>

              <div className="bg-secondary/10 p-3 rounded-xl border border-secondary/10">
                 <p className="text-[10px] text-secondary font-bold">PRO TIP: Print this QR code and display it for customers!</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-6 relative animate-in zoom-in duration-300 shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-primary">Withdraw</h2>
              <button onClick={() => setIsWithdrawModalOpen(false)} className="text-gray-400 hover:text-primary p-2">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleWithdraw} className="space-y-6">
              <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                <p className="text-xs text-primary font-medium">Funds will be sent to your registered number:</p>
                <p className="text-lg font-bold text-primary mt-1">{worker.phone}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">How much to withdraw?</label>
                <div className="relative">
                  <input 
                    required
                    type="number"
                    placeholder="Enter amount"
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-primary p-4 rounded-2xl outline-none font-bold text-primary transition-all"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">UGX</span>
                </div>
                <p className="text-[10px] text-gray-400 ml-1">Max: UGX {parseFloat(worker.balance || 0).toLocaleString()}</p>
              </div>

              <button 
                type="submit"
                disabled={transferLoading || !withdrawAmount || parseFloat(withdrawAmount) > worker.balance}
                className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:bg-opacity-95 transition-all shadow-lg disabled:opacity-50"
              >
                {transferLoading ? 'Processing...' : 'Confirm Withdrawal'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Send Modal */}
      {isSendModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-6 relative animate-in zoom-in duration-300 shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-primary">Send Money</h2>
              <button onClick={() => setIsSendModalOpen(false)} className="text-gray-400 hover:text-primary p-2">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSend} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Select Network</label>
                <div className="grid grid-cols-2 gap-3">
                  {['MTN', 'Airtel'].map((net) => (
                    <button
                      key={net}
                      type="button"
                      onClick={() => setSendForm({ ...sendForm, network: net })}
                      className={`p-3 rounded-xl font-bold text-sm border-2 transition-all ${
                        sendForm.network === net 
                          ? 'border-primary bg-primary/5 text-primary' 
                          : 'border-gray-100 text-gray-400 hover:border-gray-200'
                      }`}
                    >
                      {net} Money
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Recipient Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    required
                    type="tel"
                    placeholder="e.g. 0770 000 000"
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-primary p-4 pl-12 rounded-2xl outline-none font-bold text-primary transition-all"
                    value={sendForm.phone}
                    onChange={(e) => setSendForm({ ...sendForm, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Amount to Send</label>
                <div className="relative">
                  <input 
                    required
                    type="number"
                    placeholder="Enter amount"
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-primary p-4 rounded-2xl outline-none font-bold text-primary transition-all"
                    value={sendForm.amount}
                    onChange={(e) => setSendForm({ ...sendForm, amount: e.target.value })}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">UGX</span>
                </div>
                <p className="text-[10px] text-gray-400 ml-1">Max: UGX {parseFloat(worker.balance || 0).toLocaleString()}</p>
              </div>

              <button 
                type="submit"
                disabled={transferLoading || !sendForm.amount || parseFloat(sendForm.amount) > worker.balance || !sendForm.phone}
                className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:bg-opacity-95 transition-all shadow-lg disabled:opacity-50"
              >
                {transferLoading ? 'Processing...' : 'Send Money'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}