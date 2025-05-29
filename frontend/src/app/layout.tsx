import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers/Providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from 'react-hot-toast';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'P2E Gaming Platform | Virtual Land & Building Simulation',
  description: 'Play-to-Earn gaming platform built on Stacks blockchain featuring virtual land NFTs, building blueprints, and community competitions.',
  keywords: ['P2E', 'gaming', 'blockchain', 'NFT', 'Stacks', 'virtual land', 'building simulation'],
  authors: [{ name: 'P2E Platform Team' }],
  openGraph: {
    title: 'P2E Gaming Platform',
    description: 'Virtual Land & Building Simulation on Stacks Blockchain',
    type: 'website',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'P2E Gaming Platform',
    description: 'Virtual Land & Building Simulation on Stacks Blockchain',
    images: ['/og-image.png'],
  },

};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#3b82f6',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50`}>
        <Providers>
          <div className="min-h-full flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
