'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import "./globals.css";

export default function RootLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Goals & Invest", href: "/goals" },
    { name: "Tip Someone", href: "/tip" },
  ];

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased font-sans">
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
          <div className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">T</div>
              <span className="text-primary font-bold text-xl tracking-tight">The Tip</span>
            </a>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8 text-gray-600 font-medium">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="hover:text-primary transition-colors">
                  {link.name}
                </a>
              ))}
              <a href="/register" className="bg-primary text-white px-5 py-2 rounded-full font-semibold hover:bg-opacity-90 transition-all">
                Get Started
              </a>
            </div>

            {/* Mobile Toggle */}
            <button 
              className="md:hidden text-primary"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* Mobile Nav Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-100 p-6 flex flex-col gap-4 shadow-lg animate-in fade-in slide-in-from-top-4 duration-200">
              {navLinks.map((link) => (
                <a 
                  key={link.href} 
                  href={link.href} 
                  className="text-lg font-bold text-primary py-2 border-b border-gray-50 last:border-0"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <a 
                href="/register" 
                className="bg-primary text-white w-full py-4 rounded-2xl font-bold mt-4 text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </a>
            </div>
          )}
        </nav>
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-white border-t border-gray-100 py-10 px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-white font-bold text-xs">T</div>
              <span className="text-primary font-bold">The Tip</span>
            </div>
            <p className="text-gray-400 text-sm">© 2026 The Tip Uganda. All rights reserved.</p>
            <div className="flex gap-4 text-gray-400 text-sm">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Help</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
