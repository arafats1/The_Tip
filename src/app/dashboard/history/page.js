'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowDownLeft, ArrowUpRight, History, Calendar, Search, Filter } from 'lucide-react';
import { api } from '@/lib/api';
import Link from 'next/link';

export default function ActivityHistory() {
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const savedWorker = localStorage.getItem('tip_worker');
    if (savedWorker) {
      const workerData = JSON.parse(savedWorker);
      setWorker(workerData);
      fetchTransactions(workerData.id);
    } else {
      window.location.href = '/login';
    }
  }, []);

  const fetchTransactions = async (workerId) => {
    try {
      const result = await api.getTransactions(workerId);
      const rawData = Array.isArray(result) ? result : (result.data || []);
      
      if (Array.isArray(rawData)) {
        const allTransactions = rawData.map(t => t.attributes ? { id: t.id, ...t.attributes } : t);
        
        const sortedData = allTransactions.sort((a, b) => 
          new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at)
        );
        
        const filteredData = sortedData.filter(t => !t.type || ['tip', 'withdrawal', 'transfer'].includes(t.type));
        
        const formatted = filteredData.map(transaction => {
          const date = new Date(transaction.createdAt || transaction.created_at);
          
          const methodMap = {
            'momo': 'Mobile Money',
            'card': 'Card Payment',
            'visa': 'Visa',
            'mastercard': 'Mastercard'
          };

          let type = transaction.type || 'tip';
          let fromName = transaction.senderName || transaction.sender_name || 'Anonymous';
          
          if (type === 'withdrawal') {
            fromName = 'Withdrawal to ' + (transaction.phone || 'Account');
          } else if (type === 'transfer') {
            fromName = 'Sent to ' + (transaction.recipient || 'Recipient');
          }

          return {
            id: transaction.id,
            amount: parseFloat(transaction.amount || 0),
            from: fromName,
            date: date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            time: date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
            method: methodMap[transaction.method?.toLowerCase()] || transaction.method || 'Mobile Money',
            type: type
          };
        });
        setTransactions(formatted);
      }
    } catch (err) {
      console.error('Failed to fetch transactions', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.from.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tx.amount.toString().includes(searchTerm);
    const matchesFilter = filterType === 'all' || tx.type === filterType;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-primary text-white p-6 sticky top-0 z-30 shadow-lg">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-xl font-bold">Activity History</h1>
            <p className="text-xs text-white/60">Manage your money flow</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4 space-y-4">
        {/* Search and Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search amount or name..."
              className="w-full bg-white border border-gray-200 p-4 pl-12 rounded-2xl outline-none focus:border-primary transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
            {['all', 'tip', 'withdrawal', 'transfer'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-6 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border-2 ${
                  filterType === type 
                    ? 'bg-primary border-primary text-white' 
                    : 'bg-white border-gray-100 text-gray-400'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
          {filteredTransactions.length === 0 ? (
            <div className="p-12 text-center text-gray-400 space-y-2">
              <History size={48} className="mx-auto opacity-20 mb-4" />
              <p className="font-bold">No transactions found</p>
              <p className="text-xs">Adjust your filters or search terms</p>
            </div>
          ) : (
            filteredTransactions.map((tx, idx) => (
              <div key={tx.id} className={`flex items-center justify-between p-5 ${idx !== filteredTransactions.length - 1 ? 'border-b border-gray-50' : ''} hover:bg-gray-50 transition-colors`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
                    tx.type === 'tip' ? 'bg-accent/10 text-accent' : 
                    tx.type === 'withdrawal' ? 'bg-red-50 text-red-600' :
                    'bg-orange-50 text-orange-600'
                  }`}>
                    {tx.type === 'tip' ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                  </div>
                  <div>
                    <h3 className={`font-bold text-sm ${
                      tx.type === 'tip' ? 'text-primary' : 'text-gray-900'
                    }`}>
                      {tx.type === 'tip' ? '+' : '-'} UGX {tx.amount.toLocaleString()}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">{tx.from}</p>
                    <div className="flex items-center gap-2 mt-1">
                       <span className="text-[10px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter">{tx.method}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-900">{tx.date}</p>
                  <p className="text-[10px] text-gray-400 font-medium mt-0.5">{tx.time}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
