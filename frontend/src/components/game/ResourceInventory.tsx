'use client';

import React, { useMemo } from 'react';
import { 
  Package, 
  TrendingUp, 
  Clock,
  Zap,
  RefreshCw,
  Loader2,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LandPlot, RESOURCE_CONFIG } from '@/lib/game-data';

interface ResourceInventoryProps {
  landPlots: LandPlot[];
  loading: boolean;
}

export function ResourceInventory({ landPlots, loading }: ResourceInventoryProps) {
  // Calculate total resources from all land plots
  const resourceSummary = useMemo(() => {
    const summary: Record<string, { total: number; production: number; capacity: number }> = {};
    
    landPlots.forEach(land => {
      land.resources.forEach(resource => {
        if (!summary[resource.type]) {
          summary[resource.type] = { total: 0, production: 0, capacity: 0 };
        }
        summary[resource.type].total += resource.currentAmount;
        summary[resource.type].production += resource.regenerationRate;
        summary[resource.type].capacity += resource.capacity;
      });
    });
    
    return summary;
  }, [landPlots]);

  // Calculate total production rate
  const totalProductionRate = useMemo(() => {
    return Object.values(resourceSummary).reduce((sum, resource) => sum + resource.production, 0);
  }, [resourceSummary]);

  // Calculate average productivity across all lands
  const averageProductivity = useMemo(() => {
    if (landPlots.length === 0) return 0;
    return Math.round(landPlots.reduce((sum, land) => sum + land.productivity, 0) / landPlots.length);
  }, [landPlots]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-game border border-gray-200 p-6">
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-8 h-8 animate-spin text-green-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-game border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5" />
            <h3 className="font-semibold">Resource Inventory</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Production Overview */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <TrendingUp className="w-5 h-5 mx-auto mb-1 text-green-600" />
            <div className="text-lg font-bold text-green-900">{totalProductionRate}</div>
            <div className="text-xs text-green-700">Resources/Hour</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <Zap className="w-5 h-5 mx-auto mb-1 text-blue-600" />
            <div className="text-lg font-bold text-blue-900">{averageProductivity}%</div>
            <div className="text-xs text-blue-700">Avg. Productivity</div>
          </div>
        </div>

        {/* Resource Breakdown */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <BarChart3 className="w-4 h-4 mr-2 text-purple-500" />
            Resource Breakdown
          </h4>
          
          {Object.keys(resourceSummary).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(resourceSummary).map(([resourceType, data]) => {
                const config = RESOURCE_CONFIG[resourceType as keyof typeof RESOURCE_CONFIG];
                const fillPercentage = (data.total / data.capacity) * 100;
                
                return (
                  <div key={resourceType} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{config?.icon || '📦'}</span>
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {config?.name || resourceType}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900">
                          {data.total}/{data.capacity}
                        </div>
                        <div className="text-xs text-gray-600">
                          +{data.production}/h
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          fillPercentage > 80 ? 'bg-red-500' :
                          fillPercentage > 60 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(100, fillPercentage)}%` }}
                      />
                    </div>
                    
                    {/* Storage Warning */}
                    {fillPercentage > 90 && (
                      <div className="text-xs text-red-600 flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Storage almost full!</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No resources found</p>
              <p className="text-xs">Acquire land plots to start generating resources</p>
            </div>
          )}
        </div>

        {/* Production Efficiency */}
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-900 mb-3">Production Efficiency</h4>
          
          {landPlots.length > 0 ? (
            <div className="space-y-2">
              {landPlots.slice(0, 3).map((land, index) => (
                <div key={land.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">
                      Plot ({land.x}, {land.y})
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-blue-500 h-1 rounded-full"
                        style={{ width: `${land.productivity}%` }}
                      />
                    </div>
                    <span className="text-gray-900 font-medium w-8">
                      {land.productivity}%
                    </span>
                  </div>
                </div>
              ))}
              
              {landPlots.length > 3 && (
                <div className="text-xs text-gray-500 text-center pt-2">
                  +{landPlots.length - 3} more plots
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No production data</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="border-t pt-4">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" fullWidth>
              Harvest All
            </Button>
            <Button variant="outline" size="sm" fullWidth>
              Optimize
            </Button>
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-xs text-gray-500 text-center">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
