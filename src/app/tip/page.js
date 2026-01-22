'use client';

import { useState } from 'react';
import { Heart, ShieldCheck, CreditCard, Smartphone, QrCode, Search, User, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function TipPage() {
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState(0); // 0: Find, 1: Amount, 2: Payment Method, 3: Success
  const [searchId, setSearchId] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const [worker, setWorker] = useState(null);

  const handleFindWorker = (e) => {
    e.preventDefault();
    if (searchId.length >= 4) {
      // Simulation of finding a worker
      setWorker({
        name: "Arafat",
        role: "Service Professional",
        location: "Kampala, Uganda",
        id: searchId.toUpperCase()
      });
      setStep(1);
    }
  };

  const handleNext = () => {
    if (amount) setStep(step + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 pb-20">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] card-shadow p-6 md:p-8 text-center space-y-6 relative overflow-hidden">
        
        {/* Step 0: Find Worker */}
        {step === 0 && (
          <div className="space-y-8 py-4">
            <div className="space-y-2">
              <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-100">
                <Heart className="text-white fill-white" size={32} />
              </div>
              <h1 className="text-3xl font-extrabold text-primary">Tip Someone</h1>
              <p className="text-gray-500 font-medium">Support a service professional today.</p>
            </div>

            <div className="space-y-6">
              {/* Scan QR Area */}
              <button 
                onClick={() => setIsScanning(true)}
                className="w-full aspect-square max-w-[200px] mx-auto border-4 border-dashed border-gray-100 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 hover:border-primary hover:bg-indigo-50/50 transition-all group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <QrCode size={48} className="text-primary group-hover:scale-110 transition-transform" />
                <span className="font-bold text-gray-400 group-hover:text-primary">Scan QR Code</span>
                {isScanning && (
                   <div className="absolute inset-0 bg-white flex flex-col items-center justify-center gap-4 animate-in fade-in zoom-in duration-300">
                     <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                     <p className="font-bold text-primary">Accessing Camera...</p>
                     <button onClick={(e) => {e.stopPropagation(); setIsScanning(false);}} className="text-xs font-bold text-gray-400 underline">Cancel</button>
                   </div>
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-4 text-gray-400 font-bold">Or enter Tip ID</span>
                </div>
              </div>

              <form onSubmit={handleFindWorker} className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="text"
                    placeholder="Enter Worker ID (e.g. 9283)"
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-primary p-4 px-12 rounded-2xl outline-none font-bold text-primary placeholder:text-gray-400 transition-all"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                  />
                </div>
                <button 
                  type="submit"
                  disabled={searchId.length < 4}
                  className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-opacity-95 transition-all disabled:opacity-50 shadow-lg shadow-indigo-100"
                >
                  Find Professional <Search size={20} />
                </button>
              </form>
            </div>
          </div>
        )}

        {step > 0 && step < 3 && worker && (
          <>
            <button 
              onClick={() => setStep(step - 1)}
              className="absolute left-6 top-8 text-gray-400 hover:text-primary transition-colors"
            >
              <ArrowLeft size={24} />
            </button>

            <div className="space-y-2 pt-4">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm ring-1 ring-gray-100">
                <span className="text-3xl font-bold text-primary">{worker.name[0]}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-2xl font-bold text-primary">Tip {worker.name}</h2>
                <CheckCircle2 size={18} className="text-accent" />
              </div>
              <p className="text-gray-500 text-sm font-medium">{worker.role} • {worker.location}</p>
              <div className="inline-block px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                ID: {worker.id}
              </div>
            </div>

            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 text-left ml-1">Choose amount (UGX)</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[2000, 5000, 10000].map((amt) => (
                      <button 
                        key={amt}
                        onClick={() => setAmount(amt.toString())}
                        className={`py-4 rounded-2xl font-bold transition-all border-2 ${amount === amt.toString() ? 'bg-primary text-white border-primary shadow-md' : 'bg-gray-50 text-primary border-gray-100 hover:border-indigo-100'}`}
                      >
                        {amt.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-500">UGX</span>
                  <input 
                    type="number"
                    placeholder="Other amount"
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-accent p-4 pl-14 rounded-2xl outline-none font-bold text-primary placeholder:text-gray-400 transition-all"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>

                <button 
                  onClick={handleNext}
                  disabled={!amount}
                  className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:bg-opacity-95 transition-all disabled:opacity-50 shadow-lg shadow-indigo-100"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-left ml-1">Select Payment Method</p>
                <button onClick={() => setStep(3)} className="w-full flex items-center justify-between p-5 bg-white border-2 border-gray-100 rounded-2xl hover:border-accent hover:bg-emerald-50/30 transition-all group shadow-sm">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary group-hover:bg-accent group-hover:text-white transition-colors">
                        <Smartphone size={24} />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-primary">Mobile Money</p>
                        <p className="text-xs text-gray-400">MTN & Airtel Africa</p>
                      </div>
                   </div>
                   <ArrowRight className="text-gray-300 group-hover:text-accent transition-colors" size={20} />
                </button>
                <button onClick={() => setStep(3)} className="w-full flex items-center justify-between p-5 bg-white border-2 border-gray-100 rounded-2xl hover:border-accent hover:bg-emerald-50/30 transition-all group shadow-sm">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary group-hover:bg-accent group-hover:text-white transition-colors">
                        <CreditCard size={24} />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-primary">Card Payment</p>
                        <p className="text-xs text-gray-400">Visa / Mastercard</p>
                      </div>
                   </div>
                   <ArrowRight className="text-gray-300 group-hover:text-accent transition-colors" size={20} />
                </button>
              </div>
            )}

            <div className="pt-6 flex items-center justify-center gap-2 text-gray-400">
              <ShieldCheck size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Privacy Protected Payments</span>
            </div>
          </>
        )}

        {step === 3 && (
          <div className="py-10 space-y-8 animate-in zoom-in duration-500">
            <div className="relative">
              <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-100 ring-8 ring-emerald-50">
                <Heart className="text-white fill-white" size={40} />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-lg">
                <div className="bg-accent rounded-full p-1">
                  <CheckCircle2 className="text-white" size={20} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold text-primary">Brilliant!</h2>
              <p className="text-gray-500 font-medium leading-relaxed">
                Your support of <span className="font-bold text-primary">UGX {Number(amount).toLocaleString()}</span> has been sent securely to <span className="text-primary font-bold">{worker?.name}</span>.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 space-y-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Transaction ID</p>
              <p className="font-mono text-primary font-bold">#TRX-99283-OK</p>
            </div>

            <button 
              onClick={() => {setStep(0); setAmount(''); setSearchId(''); setWorker(null);}}
              className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:bg-opacity-95 transition-all shadow-lg shadow-indigo-100"
            >
              Back to Start
            </button>
          </div>
        )}
      </div>
      
      <p className="mt-8 text-gray-400 text-sm font-medium">Powered by <span className="text-primary font-bold">The Tip</span></p>
    </div>
  );
}