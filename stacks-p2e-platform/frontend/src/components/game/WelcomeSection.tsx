'use client';

import React from 'react';
import { 
  MapPin, 
  Building, 
  Trophy, 
  Coins, 
  Users, 
  Shield,
  ArrowRight,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { WalletButton } from '@/components/ui/WalletButton';

const features = [
  {
    icon: MapPin,
    title: 'Own Virtual Land',
    description: 'Purchase unique land plots as NFTs with different terrain types and rarities.',
    color: 'text-green-600 bg-green-100',
  },
  {
    icon: Building,
    title: 'Build & Develop',
    description: 'Use blueprint NFTs to construct buildings and develop your virtual empire.',
    color: 'text-blue-600 bg-blue-100',
  },
  {
    icon: Trophy,
    title: 'Compete & Win',
    description: 'Join community competitions and challenges to earn rare NFTs and tokens.',
    color: 'text-purple-600 bg-purple-100',
  },
  {
    icon: Coins,
    title: 'Earn Real Rewards',
    description: 'Generate resources, trade assets, and earn platform tokens through gameplay.',
    color: 'text-yellow-600 bg-yellow-100',
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Join a vibrant community of players, builders, and creators.',
    color: 'text-pink-600 bg-pink-100',
  },
  {
    icon: Shield,
    title: 'Bitcoin Secured',
    description: 'All assets are secured by Bitcoin through the Stacks blockchain.',
    color: 'text-orange-600 bg-orange-100',
  },
];

const stats = [
  { label: 'Land Plots Minted', value: '2,847' },
  { label: 'Buildings Constructed', value: '1,293' },
  { label: 'Active Players', value: '456' },
  { label: 'Total Rewards Earned', value: '12,847 STX' },
];

export function WelcomeSection() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-secondary-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Build Your Virtual
              <span className="text-gradient block">Gaming Empire</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              The ultimate Play-to-Earn gaming platform where you truly own your assets. 
              Buy land, build structures, compete in challenges, and earn real rewards on the Stacks blockchain.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <WalletButton />
              <Button variant="outline" size="lg" leftIcon={<Play />}>
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience true ownership, real rewards, and endless possibilities in our 
              blockchain-powered gaming ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in just a few simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Connect Your Wallet
              </h3>
              <p className="text-gray-600">
                Connect your Stacks wallet to start playing and owning assets.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-secondary-100 text-secondary-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Acquire Land & Assets
              </h3>
              <p className="text-gray-600">
                Purchase land plots and building blueprints from the marketplace.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent-100 text-accent-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Build & Earn
              </h3>
              <p className="text-gray-600">
                Develop your land, participate in competitions, and earn rewards.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Building?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of players already earning rewards in our virtual world. 
            Connect your wallet and start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <WalletButton />
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              rightIcon={<ArrowRight />}
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
