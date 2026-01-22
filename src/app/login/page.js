'use client';

import { useState } from 'react';
import { Phone, Lock, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    phone: '',
    pin: '',
  });
  const [showPin, setShowPin] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    // Logic for login would go here
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Left side: Branding & Welcome Message */}
      <div className="md:w-1/2 gradient-bg p-12 text-white flex flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-primary font-bold text-2xl">T</div>
            <span className="font-bold text-2xl tracking-tight">The Tip</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Welcome back to <span className="text-secondary">The Tip.</span>
          </h1>
          <p className="text-xl text-indigo-100 max-w-md">
            Securely access your earnings, track your goals, and grow your wealth.
          </p>
        </div>

        <div className="relative z-10 mt-12 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 max-w-sm">
           <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white">
                 <ShieldCheck size={24} />
              </div>
              <div>
                <p className="font-bold text-sm">Secure Access</p>
                <p className="text-xs text-indigo-100 opacity-80">Encryption protected</p>
              </div>
           </div>
           <p className="text-xs text-indigo-200">Never share your login PIN with anyone. The Tip team will never ask for your PIN.</p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-secondary/10 rounded-full blur-[100px]"></div>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-accent/20 rounded-full blur-[60px]"></div>
      </div>

      {/* Right side: Login Form */}
      <div className="md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="max-w-md w-full">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-primary">Login to your wallet</h2>
            <p className="text-gray-500 mt-2 font-medium">Enter your registered mobile number and PIN</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input 
                  required
                  type="tel" 
                  placeholder="0770 000 000"
                  className="w-full bg-white border-2 border-gray-100 p-4 pl-12 rounded-2xl outline-none focus:border-primary transition-all font-medium text-primary placeholder:text-gray-400"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-gray-700">Security PIN</label>
                <a href="#" className="text-xs font-bold text-primary hover:underline">Forgot PIN?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input 
                  required
                  type={showPin ? "text" : "password"}
                  maxLength={4}
                  placeholder="••••"
                  className="w-full bg-white border-2 border-gray-100 p-4 px-12 rounded-2xl outline-none focus:border-primary transition-all font-medium text-primary placeholder:text-gray-400 tracking-[0.5em]"
                  value={formData.pin}
                  onChange={(e) => setFormData({...formData, pin: e.target.value})}
                />
                <button 
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                  onClick={() => setShowPin(!showPin)}
                >
                  {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-opacity-95 transition-all shadow-lg shadow-indigo-100"
            >
              Sign In <ArrowRight size={20} />
            </button>
          </form>

          <p className="mt-8 text-center text-gray-500 font-medium">
            Don't have an account? <a href="/register" className="text-primary font-bold hover:underline">Register as a Worker</a>
          </p>
        </div>
      </div>
    </div>
  );
}