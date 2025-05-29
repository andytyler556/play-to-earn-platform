'use client';

import React, { useState } from 'react';
import { 
  Megaphone, 
  X, 
  Star, 
  Gift,
  Calendar,
  TrendingUp,
  Crown,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Announcement {
  id: string;
  type: 'update' | 'event' | 'promotion' | 'maintenance';
  title: string;
  message: string;
  action?: {
    text: string;
    href: string;
  };
  priority: 'low' | 'medium' | 'high';
  dismissible: boolean;
  expiresAt?: Date;
}

const mockAnnouncements: Announcement[] = [
  {
    id: 'blockchain-integration',
    type: 'update',
    title: '🚀 Blockchain Integration Live!',
    message: 'Your game data is now connected to the Stacks blockchain. All NFTs and transactions are real!',
    action: {
      text: 'Learn More',
      href: '/premium'
    },
    priority: 'high',
    dismissible: true
  },
  {
    id: 'premium-launch',
    type: 'promotion',
    title: '👑 Premium Memberships Available',
    message: 'Unlock exclusive features, faster progression, and premium NFT drops. Limited time 20% off!',
    action: {
      text: 'Go Premium',
      href: '/premium'
    },
    priority: 'medium',
    dismissible: true
  },
  {
    id: 'community-event',
    type: 'event',
    title: '🏆 Building Contest This Weekend',
    message: 'Join the community building contest and win rare blueprints and STX rewards!',
    action: {
      text: 'Join Event',
      href: '/events'
    },
    priority: 'medium',
    dismissible: true
  }
];

export function AnnouncementBanner() {
  const [dismissedAnnouncements, setDismissedAnnouncements] = useState<string[]>([]);

  const activeAnnouncements = mockAnnouncements.filter(
    announcement => !dismissedAnnouncements.includes(announcement.id)
  );

  const handleDismiss = (announcementId: string) => {
    setDismissedAnnouncements(prev => [...prev, announcementId]);
  };

  const getAnnouncementIcon = (type: Announcement['type']) => {
    switch (type) {
      case 'update':
        return <TrendingUp className="w-5 h-5" />;
      case 'event':
        return <Calendar className="w-5 h-5" />;
      case 'promotion':
        return <Crown className="w-5 h-5" />;
      case 'maintenance':
        return <Zap className="w-5 h-5" />;
      default:
        return <Megaphone className="w-5 h-5" />;
    }
  };

  const getAnnouncementColor = (type: Announcement['type'], priority: Announcement['priority']) => {
    if (priority === 'high') {
      return 'from-red-500 to-pink-500 text-white';
    }
    
    switch (type) {
      case 'update':
        return 'from-blue-500 to-indigo-500 text-white';
      case 'event':
        return 'from-purple-500 to-pink-500 text-white';
      case 'promotion':
        return 'from-yellow-500 to-orange-500 text-white';
      case 'maintenance':
        return 'from-gray-500 to-gray-600 text-white';
      default:
        return 'from-green-500 to-emerald-500 text-white';
    }
  };

  if (activeAnnouncements.length === 0) {
    return null;
  }

  // Show the highest priority announcement
  const currentAnnouncement = activeAnnouncements.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  })[0];

  return (
    <div className={`bg-gradient-to-r ${getAnnouncementColor(currentAnnouncement.type, currentAnnouncement.priority)} rounded-lg shadow-lg overflow-hidden`}>
      <div className="p-4">
        <div className="flex items-start space-x-3">
          {/* Icon */}
          <div className="flex-shrink-0 mt-0.5">
            {getAnnouncementIcon(currentAnnouncement.type)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold mb-1">
              {currentAnnouncement.title}
            </h3>
            <p className="text-sm opacity-90 mb-3">
              {currentAnnouncement.message}
            </p>

            {/* Action Button */}
            {currentAnnouncement.action && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = currentAnnouncement.action!.href}
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                {currentAnnouncement.action.text}
              </Button>
            )}
          </div>

          {/* Dismiss Button */}
          {currentAnnouncement.dismissible && (
            <button
              onClick={() => handleDismiss(currentAnnouncement.id)}
              className="flex-shrink-0 p-1 hover:bg-white/20 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Multiple Announcements Indicator */}
        {activeAnnouncements.length > 1 && (
          <div className="mt-3 pt-3 border-t border-white/20">
            <div className="flex items-center justify-between">
              <span className="text-sm opacity-75">
                {activeAnnouncements.length - 1} more announcement{activeAnnouncements.length > 2 ? 's' : ''}
              </span>
              <div className="flex space-x-1">
                {activeAnnouncements.slice(0, 3).map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === 0 ? 'bg-white' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar for Timed Announcements */}
      {currentAnnouncement.expiresAt && (
        <div className="h-1 bg-white/20">
          <div 
            className="h-full bg-white/60 transition-all duration-1000"
            style={{ 
              width: `${Math.max(0, Math.min(100, 
                ((currentAnnouncement.expiresAt.getTime() - Date.now()) / 
                (24 * 60 * 60 * 1000)) * 100
              ))}%` 
            }}
          />
        </div>
      )}
    </div>
  );
}
