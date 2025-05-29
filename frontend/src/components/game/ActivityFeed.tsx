'use client';

import React from 'react';
import { 
  Activity, 
  MapPin, 
  Package, 
  Building,
  Trophy,
  Coins,
  Clock,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { LandPlot, Blueprint } from '@/lib/game-data';

interface ActivityFeedProps {
  landPlots: LandPlot[];
  blueprints: Blueprint[];
  loading: boolean;
}

interface ActivityItem {
  id: string;
  type: 'land_acquired' | 'blueprint_acquired' | 'building_constructed' | 'resource_harvested' | 'achievement_earned';
  title: string;
  description: string;
  timestamp: Date;
  icon: React.ReactNode;
  color: string;
}

export function ActivityFeed({ landPlots, blueprints, loading }: ActivityFeedProps) {
  // Generate activity items based on player data
  const generateActivityItems = (): ActivityItem[] => {
    const activities: ActivityItem[] = [];
    
    // Add land acquisition activities
    landPlots.slice(0, 3).forEach((land, index) => {
      activities.push({
        id: `land-${land.id}`,
        type: 'land_acquired',
        title: 'Land Acquired',
        description: `Acquired ${land.terrain} plot at (${land.x}, ${land.y})`,
        timestamp: new Date(Date.now() - (index * 2 * 60 * 60 * 1000)), // 2 hours apart
        icon: <MapPin className="w-4 h-4" />,
        color: 'text-green-600 bg-green-100'
      });
    });

    // Add blueprint acquisition activities
    blueprints.slice(0, 2).forEach((blueprint, index) => {
      activities.push({
        id: `blueprint-${blueprint.id}`,
        type: 'blueprint_acquired',
        title: 'Blueprint Acquired',
        description: `Obtained ${blueprint.buildingType} blueprint (${blueprint.rarity})`,
        timestamp: new Date(Date.now() - ((index + 1) * 3 * 60 * 60 * 1000)), // 3 hours apart
        icon: <Package className="w-4 h-4" />,
        color: 'text-blue-600 bg-blue-100'
      });
    });

    // Add building construction activities
    landPlots.forEach((land, landIndex) => {
      land.buildings.slice(0, 1).forEach((building, buildingIndex) => {
        activities.push({
          id: `building-${land.id}-${buildingIndex}`,
          type: 'building_constructed',
          title: 'Building Constructed',
          description: `Built ${building.buildingType} on plot (${land.x}, ${land.y})`,
          timestamp: new Date(Date.now() - ((landIndex + buildingIndex + 1) * 4 * 60 * 60 * 1000)),
          icon: <Building className="w-4 h-4" />,
          color: 'text-purple-600 bg-purple-100'
        });
      });
    });

    // Add some mock achievements and resource harvesting
    if (landPlots.length > 0) {
      activities.push({
        id: 'achievement-first-land',
        type: 'achievement_earned',
        title: 'Achievement Unlocked',
        description: 'First Land Owner - Acquired your first land plot',
        timestamp: new Date(Date.now() - (6 * 60 * 60 * 1000)),
        icon: <Trophy className="w-4 h-4" />,
        color: 'text-yellow-600 bg-yellow-100'
      });
    }

    if (blueprints.length > 0) {
      activities.push({
        id: 'achievement-first-blueprint',
        type: 'achievement_earned',
        title: 'Achievement Unlocked',
        description: 'Blueprint Collector - Acquired your first blueprint',
        timestamp: new Date(Date.now() - (8 * 60 * 60 * 1000)),
        icon: <Trophy className="w-4 h-4" />,
        color: 'text-yellow-600 bg-yellow-100'
      });
    }

    // Add resource harvesting activities
    landPlots.slice(0, 2).forEach((land, index) => {
      if (land.resources.length > 0) {
        activities.push({
          id: `harvest-${land.id}`,
          type: 'resource_harvested',
          title: 'Resources Harvested',
          description: `Collected ${land.resources.length} resource types from plot (${land.x}, ${land.y})`,
          timestamp: new Date(Date.now() - ((index + 1) * 1 * 60 * 60 * 1000)), // 1 hour apart
          icon: <Coins className="w-4 h-4" />,
          color: 'text-orange-600 bg-orange-100'
        });
      }
    });

    // Sort by timestamp (newest first)
    return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10);
  };

  const activityItems = generateActivityItems();

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return 'Just now';
    }
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

  return (
    <div className="bg-white rounded-lg shadow-game border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4 text-white">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5" />
          <h3 className="font-semibold">Recent Activity</h3>
        </div>
      </div>

      {/* Activity List */}
      <div className="p-4">
        {activityItems.length > 0 ? (
          <div className="space-y-4">
            {activityItems.map((activity, index) => (
              <div key={activity.id} className="flex items-start space-x-3">
                {/* Icon */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${activity.color}`}>
                  {activity.icon}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                    <span className="text-xs text-gray-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Recent Activity</h4>
            <p className="text-sm">Start playing to see your activity here!</p>
          </div>
        )}

        {/* Performance Metrics */}
        {activityItems.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
              Performance Summary
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-900">{landPlots.length}</div>
                <div className="text-xs text-gray-600">Lands Owned</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-900">{blueprints.length}</div>
                <div className="text-xs text-gray-600">Blueprints</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-900">
                  {landPlots.reduce((sum, land) => sum + land.buildings.length, 0)}
                </div>
                <div className="text-xs text-gray-600">Buildings</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-900">
                  {landPlots.reduce((sum, land) => sum + land.resources.length, 0)}
                </div>
                <div className="text-xs text-gray-600">Resources</div>
              </div>
            </div>
          </div>
        )}

        {/* View All Link */}
        {activityItems.length > 0 && (
          <div className="mt-4 text-center">
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              View All Activity
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
