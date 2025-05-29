'use client';

import React, { useState } from 'react';
import { 
  MapPin, 
  Grid3X3, 
  List, 
  Map,
  Filter,
  Search,
  Plus,
  RefreshCw,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LandPlotCard } from '@/components/game/LandPlotCard';
import { LandGrid } from '@/components/game/LandGrid';
import { LandDetails } from '@/components/game/LandDetails';
import { MapNavigation } from '@/components/game/MapNavigation';
import { useBlockchainData } from '@/hooks/useBlockchainData';
import { useWallet } from '@/components/providers/WalletProvider';

type ViewMode = 'grid' | 'list' | 'map';
type FilterType = 'all' | 'grassland' | 'forest' | 'mountain' | 'desert' | 'water' | 'volcanic';

export default function LandPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLand, setSelectedLand] = useState<string | null>(null);
  
  // Map view settings
  const [mapSettings, setMapSettings] = useState({
    zoom: 1,
    centerX: 0,
    centerY: 0,
    showGrid: true,
    showCoordinates: true,
    viewMode: 'terrain' as 'terrain' | 'ownership' | 'buildings'
  });

  const { isConnected } = useWallet();
  const { landPlots, loading, errors, refresh } = useBlockchainData();

  const filteredLandPlots = landPlots.filter(land => {
    const matchesFilter = filter === 'all' || land.terrain === filter;
    const matchesSearch = searchTerm === '' || 
      land.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      land.terrain.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleMapPan = (deltaX: number, deltaY: number) => {
    setMapSettings(prev => ({
      ...prev,
      centerX: prev.centerX + deltaX,
      centerY: prev.centerY + deltaY
    }));
  };

  const handleZoomIn = () => {
    setMapSettings(prev => ({
      ...prev,
      zoom: Math.min(3, prev.zoom * 1.2)
    }));
  };

  const handleZoomOut = () => {
    setMapSettings(prev => ({
      ...prev,
      zoom: Math.max(0.5, prev.zoom / 1.2)
    }));
  };

  const handleResetView = () => {
    setMapSettings({
      zoom: 1,
      centerX: 0,
      centerY: 0,
      showGrid: true,
      showCoordinates: true,
      viewMode: 'terrain'
    });
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-digital-oasis flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Wallet Not Connected</h2>
          <p className="text-gray-600 mb-4">Please connect your wallet to view your land plots.</p>
          <Button onClick={() => window.location.href = '/'}>
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-digital-oasis">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <MapPin className="w-8 h-8 mr-3 text-green-500" />
                Land Management
              </h1>
              <p className="text-gray-600 mt-1">Manage your virtual land plots and territories</p>
            </div>
            <div className="flex items-center space-x-2">
              {loading.landPlots && (
                <div className="flex items-center text-sm text-gray-600">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={refresh.landPlots}
                leftIcon={<RefreshCw className={loading.landPlots ? 'animate-spin' : ''} />}
                disabled={loading.landPlots}
              >
                Refresh
              </Button>
              <Button leftIcon={<Plus />} className="bg-green-500 hover:bg-green-600">
                Acquire Land
              </Button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {errors.landPlots && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error Loading Land Data</h3>
                <p className="text-sm text-red-700 mt-1">{errors.landPlots}</p>
                <p className="text-xs text-red-600 mt-2">
                  Using cached or mock data. Check your connection and try refreshing.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-game p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Land Plots</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading.landPlots ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    landPlots.length
                  )}
                </p>
              </div>
              <MapPin className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-game p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Buildings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {landPlots.reduce((sum, land) => sum + land.buildings.length, 0)}
                </p>
              </div>
              <Grid3X3 className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-game p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Productivity</p>
                <p className="text-2xl font-bold text-gray-900">
                  {landPlots.length > 0 
                    ? Math.round(landPlots.reduce((sum, land) => sum + land.productivity, 0) / landPlots.length)
                    : 0}%
                </p>
              </div>
              <RefreshCw className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-game p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resource Nodes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {landPlots.reduce((sum, land) => sum + land.resources.length, 0)}
                </p>
              </div>
              <Plus className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-game border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search and Filters */}
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search land plots..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as FilterType)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Terrains</option>
                <option value="grassland">Grassland</option>
                <option value="forest">Forest</option>
                <option value="mountain">Mountain</option>
                <option value="desert">Desert</option>
                <option value="water">Water</option>
                <option value="volcanic">Volcanic</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                leftIcon={<Grid3X3 />}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                leftIcon={<List />}
              >
                List
              </Button>
              <Button
                variant={viewMode === 'map' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('map')}
                leftIcon={<Map />}
              >
                Map
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {viewMode === 'map' ? (
              <div className="space-y-4">
                <MapNavigation
                  onZoomIn={handleZoomIn}
                  onZoomOut={handleZoomOut}
                  onReset={handleResetView}
                  onToggleGrid={() => setMapSettings(prev => ({ ...prev, showGrid: !prev.showGrid }))}
                  onToggleCoordinates={() => setMapSettings(prev => ({ ...prev, showCoordinates: !prev.showCoordinates }))}
                  onViewModeChange={(mode) => setMapSettings(prev => ({ ...prev, viewMode: mode }))}
                  showGrid={mapSettings.showGrid}
                  showCoordinates={mapSettings.showCoordinates}
                  viewMode={mapSettings.viewMode}
                  zoomLevel={mapSettings.zoom * 100}
                />
                <LandGrid
                  viewSettings={mapSettings}
                  onPan={handleMapPan}
                  ownedLand={filteredLandPlots}
                />
              </div>
            ) : (
              <div className={`grid gap-4 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredLandPlots.map((land) => (
                  <LandPlotCard
                    key={land.id}
                    land={land}
                    viewMode={viewMode}
                    onSelect={() => setSelectedLand(land.id)}
                    isSelected={selectedLand === land.id}
                  />
                ))}
              </div>
            )}

            {filteredLandPlots.length === 0 && !loading.landPlots && (
              <div className="bg-white rounded-lg shadow-game border border-gray-200 p-12 text-center">
                <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Land Plots Found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || filter !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'You don\'t own any land plots yet. Start building your empire!'
                  }
                </p>
                <Button leftIcon={<Plus />} className="bg-green-500 hover:bg-green-600">
                  Acquire Your First Land
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {selectedLand ? (
              <LandDetails 
                landId={selectedLand} 
                onClose={() => setSelectedLand(null)}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-game border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-green-500" />
                  Land Details
                </h3>
                <p className="text-gray-600 text-sm">
                  Select a land plot to view detailed information, manage buildings, and harvest resources.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
