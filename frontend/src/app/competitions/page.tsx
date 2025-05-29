'use client';

import React from 'react';
import { Trophy, Users, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCompetitions } from '@/components/providers/GameProvider';

export default function CompetitionsPage() {
  const { competitions, isLoading } = useCompetitions();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Competitions</h1>
          <p className="text-gray-600">Join community challenges and earn rewards</p>
        </div>

        {/* Active Competitions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {competitions.map((competition) => (
            <div key={competition.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <Trophy className="w-8 h-8 text-yellow-500" />
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {competition.name}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4">
                {competition.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{competition.participants}</div>
                  <div className="text-xs text-gray-600">Participants</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{competition.prizePool} STX</div>
                  <div className="text-xs text-gray-600">Prize Pool</div>
                </div>
              </div>
              
              <Button variant="primary" fullWidth>
                Join Competition
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
