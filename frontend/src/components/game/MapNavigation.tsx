'use client';

import React from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Grid3X3,
  Eye,
  EyeOff,
  Map,
  Home,
  Building
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface MapNavigationProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onToggleGrid: () => void;
  onToggleCoordinates: () => void;
  onViewModeChange: (mode: 'terrain' | 'ownership' | 'buildings') => void;
  showGrid: boolean;
  showCoordinates: boolean;
  viewMode: 'terrain' | 'ownership' | 'buildings';
  zoomLevel: number;
}

export function MapNavigation({
  onZoomIn,
  onZoomOut,
  onReset,
  onToggleGrid,
  onToggleCoordinates,
  onViewModeChange,
  showGrid,
  showCoordinates,
  viewMode,
  zoomLevel
}: MapNavigationProps) {
  const viewModes = [
    { id: 'terrain' as const, label: 'Terrain', icon: Map },
    { id: 'ownership' as const, label: 'Ownership', icon: Home },
    { id: 'buildings' as const, label: 'Buildings', icon: Building }
  ];

  return (
    <div className="bg-white rounded-lg shadow-game border border-gray-200 p-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Zoom Controls */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Zoom:</span>
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={onZoomOut}
              disabled={zoomLevel <= 50}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <div className="px-3 py-1 bg-gray-100 rounded text-sm font-medium min-w-[60px] text-center">
              {Math.round(zoomLevel)}%
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onZoomIn}
              disabled={zoomLevel >= 300}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">View:</span>
          <div className="flex rounded-md shadow-sm">
            {viewModes.map((mode, index) => {
              const Icon = mode.icon;
              const isActive = viewMode === mode.id;
              const isFirst = index === 0;
              const isLast = index === viewModes.length - 1;
              
              return (
                <button
                  key={mode.id}
                  onClick={() => onViewModeChange(mode.id)}
                  className={`px-3 py-2 text-xs font-medium border flex items-center space-x-1 ${
                    isActive
                      ? 'bg-blue-50 border-blue-200 text-blue-700 z-10'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  } ${
                    isFirst ? 'rounded-l-md' : ''
                  } ${
                    isLast ? 'rounded-r-md' : ''
                  } ${
                    !isFirst ? 'border-l-0' : ''
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span className="hidden sm:inline">{mode.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Display Options */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Display:</span>
          <div className="flex items-center space-x-1">
            <Button
              variant={showGrid ? 'primary' : 'outline'}
              size="sm"
              onClick={onToggleGrid}
              title="Toggle Grid"
            >
              <Grid3X3 className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">Grid</span>
            </Button>
            <Button
              variant={showCoordinates ? 'primary' : 'outline'}
              size="sm"
              onClick={onToggleCoordinates}
              title="Toggle Coordinates"
            >
              {showCoordinates ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span className="hidden sm:inline ml-1">Coords</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Map Legend */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Legend:</span>
          
          {viewMode === 'terrain' && (
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-400 rounded"></div>
                <span className="text-xs text-gray-600">Grassland</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-600 rounded"></div>
                <span className="text-xs text-gray-600">Forest</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-yellow-600 rounded"></div>
                <span className="text-xs text-gray-600">Desert</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-gray-600 rounded"></div>
                <span className="text-xs text-gray-600">Mountain</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-400 rounded"></div>
                <span className="text-xs text-gray-600">Water</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span className="text-xs text-gray-600">Volcanic</span>
              </div>
            </div>
          )}

          {viewMode === 'ownership' && (
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-xs text-gray-600">Your Land</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-gray-300 rounded"></div>
                <span className="text-xs text-gray-600">Available</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-400 rounded"></div>
                <span className="text-xs text-gray-600">Other Players</span>
              </div>
            </div>
          )}

          {viewMode === 'buildings' && (
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-xs text-gray-600">Residential</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-xs text-gray-600">Commercial</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-purple-500 rounded"></div>
                <span className="text-xs text-gray-600">Industrial</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span className="text-xs text-gray-600">Special</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Instructions */}
      <div className="mt-3 text-xs text-gray-500">
        <span>💡 Tip: Click and drag to pan, use mouse wheel to zoom, click on plots for details</span>
      </div>
    </div>
  );
}
