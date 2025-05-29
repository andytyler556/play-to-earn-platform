'use client';

import React from 'react';
import { 
  Coins, 
  TrendingUp, 
  Send, 
  ArrowUpDown,
  Lock,
  Unlock,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useWalletBalance } from '@/components/providers/WalletProvider';

interface TokenInventoryProps {
  viewMode: 'grid' | 'list';
  sortBy: 'newest' | 'oldest' | 'rarity' | 'value';
  searchQuery: string;
}

export function TokenInventory({ viewMode, sortBy, searchQuery }: TokenInventoryProps) {
  const { stx: stxBalance, token: tokenBalance } = useWalletBalance();

  // Mock staking data
  const stakedTokens = 1250;
  const stakingRewards = 45.67;

  const tokens = [
    {
      id: 'stx',
      name: 'Stacks',
      symbol: 'STX',
      balance: stxBalance,
      value: stxBalance * 0.85, // Mock USD value
      change: '+5.2%',
      changeType: 'positive' as const,
      icon: '₿',
      color: 'text-orange-600 bg-orange-100',
      description: 'Native Stacks blockchain token',
    },
    {
      id: 'p2e',
      name: 'P2E Platform Token',
      symbol: 'P2E',
      balance: tokenBalance,
      value: tokenBalance * 0.12, // Mock USD value
      change: '+12.8%',
      changeType: 'positive' as const,
      icon: '🎮',
      color: 'text-primary-600 bg-primary-100',
      description: 'Platform utility and governance token',
    },
  ];

  const stakingInfo = {
    totalStaked: stakedTokens,
    pendingRewards: stakingRewards,
    apr: 15.5,
    lockPeriod: '7 days',
  };

  const filteredTokens = tokens.filter(token => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      token.name.toLowerCase().includes(query) ||
      token.symbol.toLowerCase().includes(query)
    );
  });

  if (viewMode === 'grid') {
    return (
      <div className="space-y-8">
        {/* Token Balances */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Token Balances</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredTokens.map((token) => (
              <div
                key={token.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-lg ${token.color} flex items-center justify-center text-xl`}>
                      {token.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{token.name}</h4>
                      <p className="text-sm text-gray-600">{token.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900">
                      {token.balance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-sm text-gray-600">
                      ${token.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className={`text-sm font-medium ${
                    token.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {token.change} 24h
                  </span>
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                </div>

                <p className="text-xs text-gray-600 mb-4">{token.description}</p>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Send className="w-4 h-4 mr-1" />
                    Send
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <ArrowUpDown className="w-4 h-4 mr-1" />
                    Swap
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Staking Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Staking</h3>
          <div className="bg-gradient-to-br from-primary-50 to-secondary-50 border border-primary-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">P2E Token Staking</h4>
                <p className="text-sm text-gray-600">Earn rewards by staking your P2E tokens</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary-600">{stakingInfo.apr}%</div>
                <div className="text-sm text-gray-600">APR</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Lock className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-600">Staked</span>
                </div>
                <div className="text-xl font-semibold text-gray-900">
                  {stakingInfo.totalStaked.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">P2E Tokens</div>
              </div>

              <div className="bg-white/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-600">Pending Rewards</span>
                </div>
                <div className="text-xl font-semibold text-gray-900">
                  {stakingInfo.pendingRewards.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">P2E Tokens</div>
              </div>

              <div className="bg-white/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Unlock className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-600">Lock Period</span>
                </div>
                <div className="text-xl font-semibold text-gray-900">
                  {stakingInfo.lockPeriod}
                </div>
                <div className="text-sm text-gray-600">Minimum</div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button variant="primary" className="flex-1">
                Stake More Tokens
              </Button>
              <Button variant="outline" className="flex-1">
                Claim Rewards
              </Button>
              <Button variant="outline">
                Unstake
              </Button>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="divide-y divide-gray-200">
              {[
                {
                  type: 'Staking Reward',
                  amount: '+12.34 P2E',
                  time: '2 hours ago',
                  status: 'completed',
                },
                {
                  type: 'Token Purchase',
                  amount: '+500 P2E',
                  time: '1 day ago',
                  status: 'completed',
                },
                {
                  type: 'Land Sale',
                  amount: '+2.5 STX',
                  time: '3 days ago',
                  status: 'completed',
                },
                {
                  type: 'Blueprint Purchase',
                  amount: '-0.8 STX',
                  time: '5 days ago',
                  status: 'completed',
                },
              ].map((tx, index) => (
                <div key={index} className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      tx.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                    }`} />
                    <div>
                      <div className="font-medium text-gray-900">{tx.type}</div>
                      <div className="text-sm text-gray-600">{tx.time}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`font-medium ${
                      tx.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {tx.amount}
                    </span>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List view (simplified for tokens)
  return (
    <div className="space-y-4">
      {filteredTokens.map((token) => (
        <div
          key={token.id}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-lg ${token.color} flex items-center justify-center text-xl`}>
                {token.icon}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{token.name}</h3>
                <p className="text-sm text-gray-600">{token.description}</p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="font-medium text-gray-900">
                  {token.balance.toLocaleString(undefined, { maximumFractionDigits: 2 })} {token.symbol}
                </div>
                <div className="text-sm text-gray-600">
                  ${token.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Send className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <ArrowUpDown className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
