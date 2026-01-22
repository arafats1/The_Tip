import "./globals.css";

export const metadata = {
  title: "The Tip | Digital Tipping & Wallet for East Africa",
  description: "Receive tips via QR/Mobile Money, manage savings, and grow your wealth. Privacy-first digital wallet.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased font-sans">
        <nav className="bg-white border-b border-gray-100 flex items-center justify-between px-6 py-4 sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">T</div>
            <span className="text-primary font-bold text-xl tracking-tight">The Tip</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-gray-600 font-medium">
            <a href="/" className="hover:text-primary transition-colors">Home</a>
            <a href="/dashboard" className="hover:text-primary transition-colors">Dashboard</a>
            <a href="/goals" className="hover:text-primary transition-colors">Goals & Invest</a>
            <a href="/tip" className="hover:text-primary transition-colors">Sample Tip Page</a>
          </div>
          <button className="bg-primary text-white px-5 py-2 rounded-full font-semibold hover:bg-opacity-90 transition-all">
            Get Started
          </button>
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
