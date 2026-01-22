'use client';

import { useState, useEffect } from 'react';
import { Menu, X, LogOut, LogIn } from 'lucide-react';
import "./globals.css";

export default function RootLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Initial check
    setIsLoggedIn(!!localStorage.getItem('tip_worker'));

    // Check on storage update (for cross-tab sync)
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('tip_worker'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('tip_worker');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  const navLinks = [
    { name: "Home", href: "/", public: true },
    { name: "Dashboard", href: "/dashboard", public: false },
    { name: "Invest", href: "/investments", public: false },
    { name: "Tip Someone", href: "/tip", public: true },
  ].filter(link => link.public || isLoggedIn);

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
              
              {isLoggedIn ? (
                <button 
                  onClick={handleLogout}
                  className="bg-gray-100 text-gray-600 hover:text-red-500 px-5 py-2 rounded-full font-semibold transition-all flex items-center gap-2"
                >
                  <LogOut size={16} /> Logout
                </button>
              ) : (
                <div className="flex gap-4">
                  <a href="/login" className="text-primary px-5 py-2 rounded-full font-semibold hover:bg-gray-50 transition-all flex items-center gap-2">
                    <LogIn size={16} /> Sign In
                  </a>
                  <a href="/register" className="bg-primary text-white px-5 py-2 rounded-full font-semibold hover:bg-opacity-90 transition-all">
                    Register
                  </a>
                </div>
              )}
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
              
              {isLoggedIn ? (
                <button 
                  onClick={handleLogout}
                  className="bg-red-50 text-red-600 w-full py-4 rounded-2xl font-bold mt-4 flex items-center justify-center gap-2"
                >
                  <LogOut size={20} /> Logout
                </button>
              ) : (
                <>
                  <a 
                    href="/login" 
                    className="border-2 border-primary text-primary w-full py-4 rounded-2xl font-bold mt-4 text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </a>
                  <a 
                    href="/register" 
                    className="bg-primary text-white w-full py-4 rounded-2xl font-bold mt-2 text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started Free
                  </a>
                </>
              )}
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
