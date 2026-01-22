import { ArrowRight, Shield, Wallet, TrendingUp, QrCode } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="gradient-bg text-white py-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Receive Tips, <span className="text-secondary">Grow Wealth.</span>
          </h1>
          <p className="text-xl text-gray-200 mb-10 max-w-2xl">
            The privacy-first digital wallet for everyday tip recipients in East Africa. Receive tips via QR or Unique Tip ID without sharing your phone number.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="/register" className="bg-secondary text-primary px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:transform hover:scale-105 transition-all outline-none">
              Join as a Tip Recipient <ArrowRight size={20} />
            </a>
            <a href="/tip" className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all outline-none flex items-center justify-center">
              Tip Someone
            </a>
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-primary mb-6">Tipping evolved for the digital age</h2>
            <p className="text-gray-600 mb-6 text-lg">
              In Uganda and East Africa, cash is declining. But tip recipients shouldn't have to share personal phone numbers to receive digital tips.
            </p>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="bg-red-50 p-2 rounded-full text-red-600 h-fit">
                  <Shield size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-primary">Privacy First</h4>
                  <p className="text-gray-500">No phone number exposure. Stay safe while you earn.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-accent/10 p-2 rounded-full text-accent h-fit">
                  <Wallet size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-primary">Instant Access</h4>
                  <p className="text-gray-500">Receive tips via Mobile Money, Visa, or Mastercard instantly.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-3xl card-shadow border border-gray-100 flex flex-col items-center">
             <div className="w-48 h-48 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 border-2 border-dashed border-gray-200">
                <QrCode size={100} className="text-primary opacity-20" />
             </div>
             <p className="text-primary font-bold text-xl mb-2 text-center">Your Personal Tip QR</p>
             <p className="text-gray-500 text-center text-sm">Customers just scan and pay. No apps needed on their end.</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-indigo-50 py-20 px-6 border-y border-indigo-100">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-primary mb-4">More than just tips</h2>
          <p className="text-gray-500">Features designed to help you reach your financial goals.</p>
        </div>
        
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl card-shadow">
            <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center mb-6">
              <Wallet size={24} />
            </div>
            <h3 className="text-xl font-bold text-primary mb-3">Goal Tracking</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Automate savings for rent, school fees, or insurance. Watch your progress grow daily.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl card-shadow">
            <div className="w-12 h-12 bg-accent text-white rounded-xl flex items-center justify-center mb-6">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-xl font-bold text-primary mb-3">Micro-Investments</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Invest as little as 1,000 UGX into regulated fund managers to grow your idle balance.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl card-shadow">
            <div className="w-12 h-12 bg-secondary text-primary rounded-xl flex items-center justify-center mb-6">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-bold text-primary mb-3">Safety & Trust</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Fully regulated and secure transactions. Your data and money are protected.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto bg-primary rounded-[2rem] p-12 text-white">
          <h2 className="text-3xl font-bold mb-6">Ready to grow your tips?</h2>
          <p className="text-gray-300 mb-8">Join thousands of tip recipients getting ahead with The Tip.</p>
          <a href="/register" className="bg-white text-primary px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all outline-none inline-block">
            Get Started
          </a>
        </div>
      </section>
    </div>
  );
}
