import Navigation from '@/components/Navigation';
import "./globals.css";

export const metadata = {
  title: "The Tip - Receive Tips, Grow Wealth",
  description: "The privacy-first digital wallet for everyday tip recipients in East Africa. Receive tips via QR or Unique Tip ID without sharing your phone number.",
  metadataBase: new URL('https://the-tip-aleph.vercel.app'),
  openGraph: {
    title: "The Tip - Receive Tips, Grow Wealth",
    description: "The privacy-first digital wallet for everyday tip recipients in East Africa. Receive tips via QR or ID securely.",
    url: "/",
    siteName: "The Tip",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: 'The Tip - Digital Wallet',
      },
    ],
    locale: "en_UG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Tip - Receive Tips, Grow Wealth",
    description: "Digital wallet for tip recipients. Receive tips via QR or ID without sharing your phone number.",
    images: ["/og-image.png"],
  },
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
        <Navigation />
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
