'use client';

import { useState } from 'react';
import { User, Phone, Briefcase, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    occupation: '',
  });

  const handleNext = (e) => {
    e.preventDefault();
    if (step < 2) setStep(step + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Left side: Visuals & Branding */}
      <div className="md:w-1/2 gradient-bg p-12 text-white flex flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-primary font-bold text-2xl">T</div>
            <span className="font-bold text-2xl tracking-tight">The Tip</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Start your <span className="text-secondary">financial journey</span> today.
          </h1>
          <p className="text-xl text-indigo-100 max-w-md">
            Join thousands of service professionals in Uganda receiving digital tips securely and growing their wealth.
          </p>
        </div>

        <div className="relative z-10 mt-12 space-y-6">
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-3 rounded-full">
              <CheckCircle2 className="text-secondary" />
            </div>
            <p className="font-medium">Receive tips via any Mobile Money network</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-3 rounded-full">
              <CheckCircle2 className="text-secondary" />
            </div>
            <p className="font-medium">Built-in privacy: No phone numbers shared</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-3 rounded-full">
              <CheckCircle2 className="text-secondary" />
            </div>
            <p className="font-medium">Access micro-investments from UGX 1,000</p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-accent/20 rounded-full blur-[100px]"></div>
        <div className="absolute -left-10 top-1/2 w-40 h-40 bg-secondary/10 rounded-full blur-[60px]"></div>
      </div>

      {/* Right side: Registration Form */}
      <div className="md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="max-w-md w-full">
          <div className="mb-10">
            <div className="flex gap-2 mb-4">
               <div className={`h-2 flex-1 rounded-full transition-all ${step >= 1 ? 'bg-primary' : 'bg-gray-200'}`}></div>
               <div className={`h-2 flex-1 rounded-full transition-all ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
            </div>
            <h2 className="text-3xl font-bold text-primary">Create your account</h2>
            <p className="text-gray-500 mt-2">Step {step} of 2: {step === 1 ? 'Personal details' : 'Professional info'}</p>
          </div>

          <form onSubmit={handleNext} className="space-y-6">
            {step === 1 ? (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. John Mukasa"
                      className="w-full bg-white border-2 border-gray-100 p-4 pl-12 rounded-2xl outline-none focus:border-primary transition-all font-medium"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Phone Number (Mobile Money)</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                      required
                      type="tel" 
                      placeholder="e.g. 0770 000 000"
                      className="w-full bg-white border-2 border-gray-100 p-4 pl-12 rounded-2xl outline-none focus:border-primary transition-all font-medium"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 ml-1 italic">* This will only be used for withdrawals and never shared with tippers.</p>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">What is your role?</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <select 
                      required
                      className="w-full bg-white border-2 border-gray-100 p-4 pl-12 rounded-2xl outline-none focus:border-primary transition-all font-medium appearance-none"
                      value={formData.occupation}
                      onChange={(e) => setFormData({...formData, occupation: e.target.value})}
                    >
                      <option value="">Select occupation</option>
                      <option value="waiter">Waiter / Waitress</option>
                      <option value="boda">Boda Boda Rider</option>
                      <option value="driver">Taxi Driver</option>
                      <option value="hotel">Hotel Staff</option>
                      <option value="guide">Tour Guide</option>
                      <option value="other">Other Service Worker</option>
                    </select>
                  </div>
                </div>

                <div className="bg-accent/5 p-4 rounded-2xl border border-accent/20 flex gap-3">
                  <ShieldCheck className="text-accent shrink-0" size={24} />
                  <p className="text-xs text-accent-700 leading-relaxed font-medium">
                    By confirming, you agree to our Terms of Service. Your data is encrypted and managed according to Uganda's Data Protection Act.
                  </p>
                </div>
              </>
            )}

            <button 
              type="submit"
              className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-opacity-95 transition-all shadow-lg shadow-indigo-100"
            >
              {step === 1 ? 'Next Step' : 'Complete Registration'} <ArrowRight size={20} />
            </button>
          </form>

          <p className="mt-8 text-center text-gray-500 font-medium">
            Already have an account? <a href="/login" className="text-primary font-bold hover:underline">Sign In</a>
          </p>
        </div>
      </div>
    </div>
  );
}