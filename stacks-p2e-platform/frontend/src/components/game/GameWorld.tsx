'use client';

import React, { useState, useCallback } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Map, 
  Grid3X3,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LandGrid } from './LandGrid';
import { LandDetails } from './LandDetails';
import { BuildingPlacer } from './BuildingPlacer';
import { usePlayerAssets } from '@/components/providers/GameProvider';
import { LandPlot } from '@/components/providers/GameProvider';

interface ViewSettings {
  zoom: number;
  centerX: number;
  centerY: number;
  showGrid: boolean;
  showCoordinates: boolean;
  viewMode: 'terrain' | 'ownership' | 'buildings';
}

export function GameWorld() {
  const { land: ownedLand, selectedLand } = usePlayerAssets();
  const [viewSettings, setViewSettings] = useState<ViewSettings>({
    zoom: 1,
    centerX: 0,
    centerY: 0,
    showGrid: true,
    showCoordinates: false,
    viewMode: 'terrain',
  });
  const [showBuildingPlacer, setShowBuildingPlacer] = useState(false);

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    setViewSettings(prev => ({
      ...prev,
      zoom: Math.min(prev.zoom * 1.2, 3)
    }));
  }, []);

  const handleZoomOut = useCallback(() => {
    setViewSettings(prev => ({
      ...prev,
      zoom: Math.max(prev.zoom / 1.2, 0.5)
    }));
  }, []);

  const handleResetView = useCallback(() => {
    setViewSettings(prev => ({
      ...prev,
      zoom: 1,
      centerX: 0,
      centerY: 0
    }));
  }, []);

  // View mode toggles
  const toggleGrid = useCallback(() => {
    setViewSettings(prev => ({
      ...prev,
      showGrid: !prev.showGrid
    }));
  }, []);

  const toggleCoordinates = useCallback(() => {
    setViewSettings(prev => ({
      ...prev,
      showCoordinates: !prev.showCoordinates
    }));
  }, []);

  const handleViewModeChange = useCallback((mode: 'terrain' | 'ownership' | 'buildings') => {
    setViewSettings(prev => ({
      ...prev,
      viewMode: mode
    }));
  }, []);

  // Pan controls
  const handlePan = useCallback((deltaX: number, deltaY: number) => {
    setViewSettings(prev => ({
      ...prev,
      centerX: prev.centerX + deltaX,
      centerY: prev.centerY + deltaY
    }));
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* World Controls Header */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-900">Game World</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">View:</span>
              <div className="flex rounded-md shadow-sm">
                {(['terrain', 'ownership', 'buildings'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => handleViewModeChange(mode)}
                    className={`px-3 py-1 text-xs font-medium border ${
                      viewSettings.viewMode === mode
                        ? 'bg-primary-50 border-primary-200 text-primary-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    } ${
                      mode === 'terrain' ? 'rounded-l-md' : 
                      mode === 'buildings' ? 'rounded-r-md' : 
                      'border-l-0'
                    }`}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* View Controls */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleGrid}
              className={viewSettings.showGrid ? 'bg-gray-100' : ''}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCoordinates}
              className={viewSettings.showCoordinates ? 'bg-gray-100' : ''}
            >
              {viewSettings.showCoordinates ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>

            <div className="w-px h-6 bg-gray-300" />

            {/* Zoom Controls */}
            <Button variant="ghost" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            
            <span className="text-sm text-gray-500 min-w-[3rem] text-center">
              {Math.round(viewSettings.zoom * 100)}%
            </span>
            
            <Button variant="ghost" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="w-4 h-4" />
            </Button>

            <Button variant="ghost" size="sm" onClick={handleResetView}>
              <RotateCcw className="w-4 h-4" />
            </Button>

            <div className="w-px h-6 bg-gray-300" />

            {/* Map Toggle */}
            <Button variant="ghost" size="sm">
              <Map className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Coordinates Display */}
        <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
          <div>
            Center: ({viewSettings.centerX}, {viewSettings.centerY})
          </div>
          <div>
            Owned Land: {ownedLand.length} plots
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="relative h-[600px] bg-gradient-to-br from-green-50 to-blue-50 overflow-hidden">
        {/* Land Grid */}
        <LandGrid
          viewSettings={viewSettings}
          onPan={handlePan}
          ownedLand={ownedLand}
        />

        {/* Zoom Level Indicator */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
          <div className="text-xs text-gray-600">
            Zoom: {Math.round(viewSettings.zoom * 100)}%
          </div>
        </div>

        {/* Coordinates Overlay */}
        {viewSettings.showCoordinates && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
            <div className="text-xs text-gray-600">
              Mouse: (0, 0)
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center opacity-0 pointer-events-none transition-opacity">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="spinner-md" />
              <span className="text-gray-600">Loading world...</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Panel */}
      <div className="bg-gray-50 border-t border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Selected:</span> 
              {selectedLand ? (
                <span className="ml-1">
                  Land ({selectedLand.x}, {selectedLand.y}) - {selectedLand.terrain}
                </span>
              ) : (
                <span className="ml-1 text-gray-400">None</span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {selectedLand && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBuildingPlacer(true)}
                >
                  Place Building
                </Button>
                <Button variant="primary" size="sm">
                  View Details
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Land Details Panel */}
      {selectedLand && (
        <LandDetails
          land={selectedLand}
          onClose={() => {/* Handle close */}}
        />
      )}

      {/* Building Placer Modal */}
      {showBuildingPlacer && selectedLand && (
        <BuildingPlacer
          land={selectedLand}
          onClose={() => setShowBuildingPlacer(false)}
          onPlaceBuilding={(building) => {
            // Handle building placement
            setShowBuildingPlacer(false);
          }}
        />
      )}
    </div>
  );
}
