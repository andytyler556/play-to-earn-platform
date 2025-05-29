'use client';

import React, { useState } from 'react';
import { 
  MapPin, 
  TrendingUp, 
  Clock, 
  Eye,
  ShoppingCart,
  Heart,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface LandListingsProps {
  viewMode: 'grid' | 'list';
  sortBy: 'price-low' | 'price-high' | 'newest' | 'oldest' | 'rarity';
  searchQuery: string;
  priceRange: [number, number];
  selectedRarity: string;
  selectedTerrain: string;
  showAll?: boolean;
}

const TERRAIN_EMOJIS = {
  plains: '🌾',
  forest: '🌲',
  mountain: '⛰️',
  desert: '🏜️',
  coastal: '🏖️',
  volcanic: '🌋',
};

const RARITY_COLORS = {
  common: 'border-gray-300 bg-gray-50',
  uncommon: 'border-green-300 bg-green-50',
  rare: 'border-blue-300 bg-blue-50',
  epic: 'border-purple-300 bg-purple-50',
  legendary: 'border-yellow-300 bg-yellow-50',
};

// Mock marketplace listings
const mockListings = [
  {
    id: 1,
    x: 15,
    y: 23,
    terrain: 'volcanic',
    size: 85,
    rarity: 'legendary',
    price: 45.2,
    seller: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
    listedAt: Date.now() - 3600000,
    views: 234,
    likes: 18,
    resourceMultiplier: 350,
  },
  {
    id: 2,
    x: -8,
    y: 12,
    terrain: 'forest',
    size: 45,
    rarity: 'rare',
    price: 12.8,
    seller: 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE',
    listedAt: Date.now() - 7200000,
    views: 156,
    likes: 12,
    resourceMultiplier: 180,
  },
  {
    id: 3,
    x: 3,
    y: -15,
    terrain: 'coastal',
    size: 62,
    rarity: 'epic',
    price: 28.5,
    seller: 'SP1H1733V5MZ3SZ9XRW9FKYAHJ1NXMVP2PQFPKN4',
    listedAt: Date.now() - 10800000,
    views: 89,
    likes: 7,
    resourceMultiplier: 220,
  },
  {
    id: 4,
    x: 22,
    y: -5,
    terrain: 'mountain',
    size: 38,
    rarity: 'rare',
    price: 15.2,
    seller: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR',
    listedAt: Date.now() - 14400000,
    views: 67,
    likes: 5,
    resourceMultiplier: 190,
  },
  {
    id: 5,
    x: -12,
    y: 8,
    terrain: 'plains',
    size: 25,
    rarity: 'uncommon',
    price: 6.8,
    seller: 'SP3D6PV2ACBPEKYJTCMH7HEN02KP87QSP8KTEH335',
    listedAt: Date.now() - 18000000,
    views: 45,
    likes: 3,
    resourceMultiplier: 120,
  },
];

export function LandListings({
  viewMode,
  sortBy,
  searchQuery,
  priceRange,
  selectedRarity,
  selectedTerrain,
  showAll = false
}: LandListingsProps) {
  const [likedListings, setLikedListings] = useState<Set<number>>(new Set());

  // Filter and sort listings
  const filteredListings = mockListings
    .filter(listing => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!listing.terrain.toLowerCase().includes(query) &&
            !listing.rarity.toLowerCase().includes(query) &&
            !`${listing.x},${listing.y}`.includes(query)) {
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

      // Terrain filter
      if (selectedTerrain && listing.terrain !== selectedTerrain) {
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
    .slice(0, showAll ? undefined : 6); // Limit to 6 items if not showing all

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
    console.log('Buying land:', listing);
  };

  if (filteredListings.length === 0) {
    return (
      <div className="text-center py-12">
        <MapPin className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Land Found</h3>
        <p className="text-gray-600">
          Try adjusting your filters or search terms
        </p>
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing) => {
          const terrainEmoji = TERRAIN_EMOJIS[listing.terrain as keyof typeof TERRAIN_EMOJIS];
          const isLiked = likedListings.has(listing.id);
          
          return (
            <div
              key={listing.id}
              className={`border-2 rounded-lg overflow-hidden transition-all hover:shadow-lg ${
                RARITY_COLORS[listing.rarity as keyof typeof RARITY_COLORS]
              }`}
            >
              {/* Image/Preview */}
              <div className="relative h-48 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                <span className="text-6xl">{terrainEmoji}</span>
                <div className="absolute top-3 left-3">
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
                <div className="absolute top-3 right-3 flex space-x-2">
                  <button
                    onClick={() => handleLike(listing.id)}
                    className={`p-2 rounded-full ${
                      isLiked ? 'bg-red-100 text-red-600' : 'bg-white/80 text-gray-600'
                    } hover:bg-white transition-colors`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">
                    Land ({listing.x}, {listing.y})
                  </h3>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Eye className="w-3 h-3" />
                    <span>{listing.views}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 capitalize mb-3">
                  {listing.terrain} • Size {listing.size}
                </p>

                <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                  <div>
                    <span className="text-gray-600">Resources:</span>
                    <span className="ml-1 font-medium">{listing.resourceMultiplier}/h</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Listed:</span>
                    <span className="ml-1 font-medium">
                      {Math.floor((Date.now() - listing.listedAt) / 3600000)}h ago
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {listing.price} STX
                    </div>
                    <div className="text-sm text-gray-600">
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
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Buy Now
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
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
        const terrainEmoji = TERRAIN_EMOJIS[listing.terrain as keyof typeof TERRAIN_EMOJIS];
        const isLiked = likedListings.has(listing.id);
        
        return (
          <div
            key={listing.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center text-2xl">
                  {terrainEmoji}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Land Plot ({listing.x}, {listing.y})
                  </h3>
                  <p className="text-sm text-gray-600 capitalize">
                    {listing.terrain} • {listing.rarity} • Size {listing.size}
                  </p>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                    <span>{listing.resourceMultiplier} resources/hour</span>
                    <span>{Math.floor((Date.now() - listing.listedAt) / 3600000)}h ago</span>
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
