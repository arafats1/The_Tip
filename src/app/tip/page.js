'use client';

import { useState } from 'react';
import { Heart, ShieldCheck, CreditCard, Smartphone } from 'lucide-react';

export default function TipPage() {
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState(1); // 1: Amount, 2: Payment Method, 3: Success

  const handleNext = () => {
    if (amount) setStep(step + 1);
  };

  const worker = {
    name: "Arafat",
    role: "Service Professional",
    location: "Kampala, Uganda",
    id: "TIP-9283"
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 pb-20">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] card-shadow p-6 md:p-8 text-center space-y-6">
        
        {step < 3 && (
          <>
            <div className="space-y-2">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-primary">{worker.name[0]}</span>
              </div>
              <h2 className="text-2xl font-bold text-primary">Tip {worker.name}</h2>
              <p className="text-gray-500 text-sm">{worker.role} • {worker.location}</p>
            </div>

            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 text-left">Choose amount (UGX)</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[2000, 5000, 10000].map((amt) => (
                      <button 
                        key={amt}
                        onClick={() => setAmount(amt.toString())}
                        className={`py-3 rounded-2xl font-bold transition-all border-2 ${amount === amt.toString() ? 'bg-primary text-white border-primary' : 'bg-gray-50 text-primary border-gray-100'}`}
                      >
                        {amt.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">UGX</span>
                  <input 
                    type="number"
                    placeholder="Other amount"
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-accent p-4 pl-14 rounded-2xl outline-none font-bold text-primary"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>

                <button 
                  onClick={handleNext}
                  disabled={!amount}
                  className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:bg-opacity-95 transition-all disabled:opacity-50"
                >
                  Confirm Amount
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-left">Select Payment Method</p>
                <button onClick={() => setStep(3)} className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-2xl border-2 border-transparent hover:border-accent transition-all group">
                   <div className="flex items-center gap-4">
                      <Smartphone className="text-primary" />
                      <span className="font-bold text-primary">Mobile Money (MTN/Airtel)</span>
                   </div>
                </button>
                <button onClick={() => setStep(3)} className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-2xl border-2 border-transparent hover:border-accent transition-all group">
                   <div className="flex items-center gap-4">
                      <CreditCard className="text-primary" />
                      <span className="font-bold text-primary">Visa / Mastercard</span>
                   </div>
                </button>
                <button onClick={() => setStep(1)} className="text-sm font-bold text-gray-400 hover:text-primary transition-all">Go Back</button>
              </div>
            )}

            <div className="pt-6 flex items-center justify-center gap-2 text-gray-400">
              <ShieldCheck size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Privacy Protected Payments</span>
            </div>
          </>
        )}

        {step === 3 && (
          <div className="py-10 space-y-6">
            <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <Heart className="text-accent fill-accent" size={40} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-primary mb-2">Thank you!</h2>
              <p className="text-gray-500">Your tip of <span className="font-bold text-primary">UGX {Number(amount).toLocaleString()}</span> has been sent safely to {worker.name}.</p>
            </div>
            <button 
              onClick={() => {setStep(1); setAmount('');}}
              className="bg-primary text-white px-8 py-3 rounded-full font-bold"
            >
              Done
            </button>
          </div>
        )}
      </div>

      <p className="mt-8 text-gray-400 text-sm font-medium">Powered by <span className="text-primary font-bold">The Tip</span></p>
    </div>
  );
}