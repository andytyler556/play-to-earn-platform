'use client';

import React from 'react';
import { 
  User, 
  Star, 
  TrendingUp, 
  Award,
  Wallet,
  RefreshCw,
  Loader2,
  Crown,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useWallet } from '@/components/providers/WalletProvider';
import { PlayerProfile } from '@/lib/game-data';

interface PlayerOverviewProps {
  profile: PlayerProfile | null;
  loading: boolean;
  onRefresh: () => void;
}

export function PlayerOverview({ profile, loading, onRefresh }: PlayerOverviewProps) {
  const { address, stxBalance } = useWallet();

  const getExperienceProgress = () => {
    if (!profile) return 0;
    const currentLevelXP = (profile.level - 1) * 1000;
    const nextLevelXP = profile.level * 1000;
    const progress = ((profile.experience - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  const formatJoinDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-game border border-gray-200 p-6">
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-white rounded-lg shadow-game border border-gray-200 p-6">
        <div className="text-center">
          <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Loading</h3>
          <p className="text-gray-600 text-sm mb-4">
            Unable to load player profile. This might be your first time playing.
          </p>
          <Button size="sm" onClick={onRefresh} leftIcon={<RefreshCw />}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-game border border-gray-200 overflow-hidden">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{profile.username || 'Player'}</h3>
              <p className="text-blue-100 text-sm">
                {address?.slice(0, 8)}...{address?.slice(-6)}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            className="text-white hover:bg-white/20"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {/* Level and Experience */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-100">Level {profile.level}</span>
            <span className="text-sm text-blue-100">{profile.experience} XP</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${getExperienceProgress()}%` }}
            />
          </div>
          <div className="text-xs text-blue-100 text-center">
            {Math.round(getExperienceProgress())}% to next level
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="p-6">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
          Player Statistics
        </h4>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{profile.stats.landsOwned}</div>
            <div className="text-xs text-gray-600">Lands Owned</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{profile.stats.blueprintsOwned}</div>
            <div className="text-xs text-gray-600">Blueprints</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{profile.stats.buildingsConstructed}</div>
            <div className="text-xs text-gray-600">Buildings</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{profile.stats.tokensEarned}</div>
            <div className="text-xs text-gray-600">Tokens Earned</div>
          </div>
        </div>

        {/* Wallet Balance */}
        <div className="mb-6">
          <h5 className="font-medium text-gray-900 mb-2 flex items-center">
            <Wallet className="w-4 h-4 mr-2 text-orange-500" />
            Wallet Balance
          </h5>
          <div className="bg-orange-50 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">STX Balance</span>
              <span className="font-semibold text-gray-900">
                {stxBalance ? `${stxBalance.toFixed(2)} STX` : 'Loading...'}
              </span>
            </div>
          </div>
        </div>

        {/* Achievements Preview */}
        <div className="mb-6">
          <h5 className="font-medium text-gray-900 mb-2 flex items-center">
            <Award className="w-4 h-4 mr-2 text-yellow-500" />
            Recent Achievements
          </h5>
          {profile.achievements && profile.achievements.length > 0 ? (
            <div className="space-y-2">
              {profile.achievements.slice(0, 3).map((achievement, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <Star className="w-3 h-3 text-yellow-500" />
                  <span className="text-gray-700">{achievement.title}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <Award className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No achievements yet</p>
              <p className="text-xs">Start playing to earn your first achievement!</p>
            </div>
          )}
        </div>

        {/* Member Since */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Member since {formatJoinDate(profile.joinedAt)}</span>
            </div>
            {profile.level >= 10 && (
              <div className="flex items-center space-x-1 text-yellow-600">
                <Crown className="w-4 h-4" />
                <span className="text-xs font-medium">Veteran Player</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
