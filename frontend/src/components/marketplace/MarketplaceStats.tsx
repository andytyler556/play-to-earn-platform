'use client';

import React from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  Users,
  Activity,
  Clock
} from 'lucide-react';

export function MarketplaceStats() {
  // Mock marketplace data
  const stats = [
    {
      label: 'Total Volume',
      value: '12,847 STX',
      change: '+23.5%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'text-green-600 bg-green-100',
      period: '24h',
    },
    {
      label: 'Active Listings',
      value: '1,247',
      change: '+12',
      changeType: 'positive' as const,
      icon: ShoppingBag,
      color: 'text-blue-600 bg-blue-100',
      period: 'now',
    },
    {
      label: 'Floor Price',
      value: '2.5 STX',
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'text-purple-600 bg-purple-100',
      period: 'land',
    },
    {
      label: 'Active Traders',
      value: '456',
      change: '+15.7%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'text-orange-600 bg-orange-100',
      period: '24h',
    },
  ];

  const recentActivity = [
    {
      type: 'sale',
      item: 'Volcanic Land (12, 8)',
      price: '45.2 STX',
      time: '2m ago',
      rarity: 'legendary',
    },
    {
      type: 'listing',
      item: 'Epic Residential Blueprint',
      price: '8.5 STX',
      time: '5m ago',
      rarity: 'epic',
    },
    {
      type: 'sale',
      item: 'Forest Land (3, -2)',
      price: '12.8 STX',
      time: '8m ago',
      rarity: 'rare',
    },
    {
      type: 'sale',
      item: 'Commercial Blueprint',
      price: '3.2 STX',
      time: '12m ago',
      rarity: 'uncommon',
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Stats Cards */}
      <div className="lg:col-span-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <span className={`text-sm font-medium ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">{stat.period}</span>
                    </div>
                  </div>
                  <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center ml-3`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <Activity className="w-5 h-5 text-gray-400" />
        </div>
        
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'sale' ? 'bg-green-500' : 'bg-blue-500'
                  }`} />
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                    activity.rarity === 'common' ? 'bg-gray-100 text-gray-800' :
                    activity.rarity === 'uncommon' ? 'bg-green-100 text-green-800' :
                    activity.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                    activity.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {activity.rarity}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900 truncate mt-1">
                  {activity.item}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-sm font-semibold text-gray-900">{activity.price}</span>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View all activity →
          </button>
        </div>
      </div>
    </div>
  );
}
