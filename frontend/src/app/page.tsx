'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/components/providers/WalletProvider';
import { WelcomeSection } from '@/components/game/WelcomeSection';

export default function HomePage() {
  const { isConnected } = useWallet();
  const router = useRouter();

  // Redirect connected users to dashboard
  useEffect(() => {
    if (isConnected) {
      router.push('/dashboard');
    }
  }, [isConnected, router]);

  // Show welcome section for non-connected users
  if (!isConnected) {
    return <WelcomeSection />;
  }

  // Show loading state while redirecting
  return (
    <div className="min-h-screen bg-digital-oasis flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}
