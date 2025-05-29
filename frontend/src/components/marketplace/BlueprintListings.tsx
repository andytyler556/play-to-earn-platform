'use client';

import React, { useState } from 'react';
import { 
  Building, 
  Home, 
  Store, 
  Factory, 
  Palette,
  Clock,
  Zap,
  Users,
  Heart,
  ShoppingCart,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface BlueprintListingsProps {
  viewMode: 'grid' | 'list';
  sortBy: 'price-low' | 'price-high' | 'newest' | 'oldest' | 'rarity';
  searchQuery: string;
  priceRange: [number, number];
  selectedRarity: string;
  showAll?: boolean;
}

const BUILDING_ICONS = {
  residential: Home,
  commercial: Store,
  industrial: Factory,
  decorative: Palette,
};

const RARITY_COLORS = {
  common: 'border-gray-300 bg-gray-50',
  uncommon: 'border-green-300 bg-green-50',
  rare: 'border-blue-300 bg-blue-50',
  epic: 'border-purple-300 bg-purple-50',
  legendary: 'border-yellow-300 bg-yellow-50',
};

// Mock blueprint listings
const mockListings = [
  {
    id: 1,
    buildingType: 'residential',
    rarity: 'epic',
    price: 8.5,
    seller: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
    listedAt: Date.now() - 1800000,
    views: 89,
    likes: 12,
    buildTime: 6,
    resourceGeneration: 25,
    populationCapacity: 15,
    maintenanceCost: 3,
  },
  {
    id: 2,
    buildingType: 'commercial',
    rarity: 'rare',
    price: 5.2,
    seller: 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE',
    listedAt: Date.now() - 3600000,
    views: 67,
    likes: 8,
    buildTime: 8,
    resourceGeneration: 35,
    populationCapacity: 0,
    maintenanceCost: 5,
  },
  {
    id: 3,
    buildingType: 'industrial',
    rarity: 'legendary',
    price: 25.0,
    seller: 'SP1H1733V5MZ3SZ9XRW9FKYAHJ1NXMVP2PQFPKN4',
    listedAt: Date.now() - 5400000,
    views: 156,
    likes: 23,
    buildTime: 12,
    resourceGeneration: 75,
    populationCapacity: 0,
    maintenanceCost: 8,
  },
  {
    id: 4,
    buildingType: 'decorative',
    rarity: 'uncommon',
    price: 2.8,
    seller: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR',
    listedAt: Date.now() - 7200000,
    views: 34,
    likes: 4,
    buildTime: 4,
    resourceGeneration: 0,
    populationCapacity: 0,
    maintenanceCost: 1,
  },
];

export function BlueprintListings({
  viewMode,
  sortBy,
  searchQuery,
  priceRange,
  selectedRarity,
  showAll = false
}: BlueprintListingsProps) {
  const [likedListings, setLikedListings] = useState<Set<number>>(new Set());

  // Filter and sort listings
  const filteredListings = mockListings
    .filter(listing => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!listing.buildingType.toLowerCase().includes(query) &&
            !listing.rarity.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Price filter
      if (listing.price < priceRange[0] || listing.price > priceRange[1]) {
        return false;
      }

      // Rarity filter
      if (selectedRarity && listing.rarity !== selectedRarity) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'newest':
          return b.listedAt - a.listedAt;
        case 'oldest':
          return a.listedAt - b.listedAt;
        case 'rarity':
          const rarityOrder = { common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5 };
          return rarityOrder[b.rarity as keyof typeof rarityOrder] - rarityOrder[a.rarity as keyof typeof rarityOrder];
        default:
          return 0;
      }
    })
    .slice(0, showAll ? undefined : 4); // Limit to 4 items if not showing all

  const handleLike = (listingId: number) => {
    setLikedListings(prev => {
      const newSet = new Set(prev);
      if (newSet.has(listingId)) {
        newSet.delete(listingId);
      } else {
        newSet.add(listingId);
      }
      return newSet;
    });
  };

  const handleBuy = (listing: any) => {
    // Handle purchase logic
    console.log('Buying blueprint:', listing);
  };

  if (filteredListings.length === 0) {
    return (
      <div className="text-center py-12">
        <Building className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Blueprints Found</h3>
        <p className="text-gray-600">
          Try adjusting your filters or search terms
        </p>
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredListings.map((listing) => {
          const Icon = BUILDING_ICONS[listing.buildingType as keyof typeof BUILDING_ICONS];
          const isLiked = likedListings.has(listing.id);
          
          return (
            <div
              key={listing.id}
              className={`border-2 rounded-lg overflow-hidden transition-all hover:shadow-lg ${
                RARITY_COLORS[listing.rarity as keyof typeof RARITY_COLORS]
              }`}
            >
              {/* Preview */}
              <div className="relative h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <Icon className="w-12 h-12 text-gray-600" />
                <div className="absolute top-2 left-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    listing.rarity === 'common' ? 'bg-gray-100 text-gray-800' :
                    listing.rarity === 'uncommon' ? 'bg-green-100 text-green-800' :
                    listing.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                    listing.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {listing.rarity}
                  </span>
                </div>
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => handleLike(listing.id)}
                    className={`p-1.5 rounded-full ${
                      isLiked ? 'bg-red-100 text-red-600' : 'bg-white/80 text-gray-600'
                    } hover:bg-white transition-colors`}
                  >
                    <Heart className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 capitalize">
                    {listing.buildingType}
                  </h3>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Eye className="w-3 h-3" />
                    <span>{listing.views}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3">Blueprint</p>

                <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-gray-500" />
                    <span>{listing.buildTime}h</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Zap className="w-3 h-3 text-gray-500" />
                    <span>{listing.resourceGeneration}/h</span>
                  </div>
                  {listing.populationCapacity > 0 && (
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3 text-gray-500" />
                      <span>{listing.populationCapacity}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-xl font-bold text-gray-900">
                      {listing.price} STX
                    </div>
                    <div className="text-xs text-gray-600">
                      ~${(listing.price * 0.85).toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleBuy(listing)}
                  >
                    <ShoppingCart className="w-3 h-3 mr-1" />
                    Buy
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-4">
      {filteredListings.map((listing) => {
        const Icon = BUILDING_ICONS[listing.buildingType as keyof typeof BUILDING_ICONS];
        const isLiked = likedListings.has(listing.id);
        
        return (
          <div
            key={listing.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 capitalize">
                    {listing.buildingType} Blueprint
                  </h3>
                  <p className="text-sm text-gray-600">
                    {listing.rarity} • {listing.buildTime}h build time
                  </p>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                    <span>{listing.resourceGeneration} resources/hour</span>
                    {listing.populationCapacity > 0 && (
                      <span>{listing.populationCapacity} population</span>
                    )}
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{listing.views}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">
                    {listing.price} STX
                  </div>
                  <div className="text-sm text-gray-600">
                    ~${(listing.price * 0.85).toFixed(2)}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleLike(listing.id)}
                    className={`p-2 rounded-full ${
                      isLiked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                    } hover:bg-gray-200 transition-colors`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  </button>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleBuy(listing)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
