'use client';

import React from 'react';
import {
  ShoppingBag,
  Trophy,
  Plus,
  Zap,
  Gift,
  Clock,
  Star,
  TrendingUp,
  Users,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LandPlot, Blueprint } from '@/lib/game-data';

interface QuickActionsProps {
  landPlots: LandPlot[];
  blueprints: Blueprint[];
  loading: boolean;
}

export function QuickActions({ landPlots, blueprints, loading }: QuickActionsProps) {
  // Mock active competitions for now
  const activeCompetitions = [
    {
      id: '1',
      name: 'Building Contest',
      description: 'Build the most efficient city layout',
      participants: 45,
      maxParticipants: 100,
      prizePool: 500,
      isActive: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="space-y-3">
          <Button variant="primary" fullWidth leftIcon={<ShoppingBag />}>
            Visit Marketplace
          </Button>
          <Button variant="outline" fullWidth leftIcon={<Plus />}>
            Buy Land
          </Button>
          <Button variant="outline" fullWidth leftIcon={<Trophy />}>
            Join Competition
          </Button>
          <Button variant="outline" fullWidth leftIcon={<Gift />}>
            Daily Rewards
          </Button>
        </div>
      </div>

      {/* Active Competitions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Active Competitions</h3>
          <Trophy className="w-5 h-5 text-yellow-500" />
        </div>

        {activeCompetitions.length > 0 ? (
          <div className="space-y-4">
            {activeCompetitions.slice(0, 2).map((competition) => (
              <div key={competition.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 text-sm">{competition.name}</h4>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                  {competition.description}
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{competition.participants}/{competition.maxParticipants}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3" />
                    <span>{competition.prizePool} STX</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" fullWidth>
                  Join Now
                </Button>
              </div>
            ))}

            {activeCompetitions.length > 2 && (
              <Button variant="ghost" size="sm" fullWidth>
                View All ({activeCompetitions.length})
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No active competitions</p>
            <p className="text-xs">Check back later for new challenges!</p>
          </div>
        )}
      </div>

      {/* Daily Progress */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Daily Progress</h3>
          <Calendar className="w-5 h-5 text-blue-500" />
        </div>

        <div className="space-y-4">
          {/* Daily Quest */}
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-900">Daily Quest</span>
              <span className="text-xs text-blue-600">2/3 completed</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '66%' }}></div>
            </div>
            <p className="text-xs text-blue-800">Complete 1 more action to claim rewards!</p>
          </div>

          {/* Resource Generation */}
          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-900">Resource Generation</span>
              <Zap className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-xs text-green-800">
              <div className="flex justify-between">
                <span>Total resources:</span>
                <span className="font-medium">
                  {landPlots.reduce((sum, land) => sum + land.resources.reduce((rSum, r) => rSum + r.currentAmount, 0), 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Rate per hour:</span>
                <span className="font-medium">
                  {landPlots.reduce((sum, land) => sum + land.resources.reduce((rSum, r) => rSum + r.regenerationRate, 0), 0)}/hour
                </span>
              </div>
            </div>
          </div>

          {/* Streak */}
          <div className="bg-yellow-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-yellow-900">Login Streak</span>
              <Star className="w-4 h-4 text-yellow-600" />
            </div>
            <div className="text-xs text-yellow-800">
              <div className="flex justify-between">
                <span>Current streak:</span>
                <span className="font-medium">7 days</span>
              </div>
              <div className="flex justify-between">
                <span>Next reward:</span>
                <span className="font-medium">Rare Blueprint</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {landPlots.slice(0, 2).map((land, index) => (
            <div key={land.id} className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Acquired {land.terrain} plot ({land.x}, {land.y})</span>
              <span className="text-gray-400 text-xs ml-auto">{index + 1}d ago</span>
            </div>
          ))}
          {blueprints.slice(0, 1).map((blueprint, index) => (
            <div key={blueprint.id} className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Acquired {blueprint.buildingType} blueprint</span>
              <span className="text-gray-400 text-xs ml-auto">{index + 2}d ago</span>
            </div>
          ))}
          {landPlots.length === 0 && blueprints.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              <span className="text-sm">No recent activity</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
