'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { LandPlot, useGameStore } from '@/components/providers/GameProvider';

interface ViewSettings {
  zoom: number;
  centerX: number;
  centerY: number;
  showGrid: boolean;
  showCoordinates: boolean;
  viewMode: 'terrain' | 'ownership' | 'buildings';
}

interface LandGridProps {
  viewSettings: ViewSettings;
  onPan: (deltaX: number, deltaY: number) => void;
  ownedLand: LandPlot[];
}

// Terrain colors
const TERRAIN_COLORS = {
  plains: '#90EE90',
  forest: '#228B22',
  mountain: '#8B7355',
  desert: '#F4A460',
  coastal: '#87CEEB',
  volcanic: '#DC143C',
  water: '#4682B4',
  unknown: '#D3D3D3',
};

// Rarity colors
const RARITY_COLORS = {
  common: '#9CA3AF',
  uncommon: '#10B981',
  rare: '#3B82F6',
  epic: '#8B5CF6',
  legendary: '#F59E0B',
};

export function LandGrid({ viewSettings, onPan, ownedLand }: LandGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [mouseWorldPos, setMouseWorldPos] = useState({ x: 0, y: 0 });
  const setSelectedLand = useGameStore(state => state.setSelectedLand);

  // Grid settings
  const GRID_SIZE = 40; // Size of each grid cell in pixels
  const WORLD_SIZE = 100; // World extends from -50 to +50 in each direction

  // Convert screen coordinates to world coordinates
  const screenToWorld = useCallback((screenX: number, screenY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const canvasX = screenX - rect.left;
    const canvasY = screenY - rect.top;

    const worldX = Math.floor(
      (canvasX - canvas.width / 2) / (GRID_SIZE * viewSettings.zoom) + viewSettings.centerX
    );
    const worldY = Math.floor(
      (canvasY - canvas.height / 2) / (GRID_SIZE * viewSettings.zoom) + viewSettings.centerY
    );

    return { x: worldX, y: worldY };
  }, [viewSettings]);

  // Convert world coordinates to screen coordinates
  const worldToScreen = useCallback((worldX: number, worldY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const screenX = (worldX - viewSettings.centerX) * GRID_SIZE * viewSettings.zoom + canvas.width / 2;
    const screenY = (worldY - viewSettings.centerY) * GRID_SIZE * viewSettings.zoom + canvas.height / 2;

    return { x: screenX, y: screenY };
  }, [viewSettings]);

  // Get land plot at coordinates
  const getLandAt = useCallback((x: number, y: number): LandPlot | null => {
    return ownedLand.find(land => land.x === x && land.y === y) || null;
  }, [ownedLand]);

  // Generate terrain for unowned land (procedural)
  const getTerrainAt = useCallback((x: number, y: number): string => {
    // Simple procedural terrain generation
    const hash = Math.abs(x * 374761393 + y * 668265263) % 1000000;
    
    if (hash < 400000) return 'plains';
    if (hash < 600000) return 'forest';
    if (hash < 750000) return 'mountain';
    if (hash < 850000) return 'desert';
    if (hash < 950000) return 'coastal';
    return 'volcanic';
  }, []);

  // Draw the grid
  const drawGrid = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate visible range
    const halfWidth = canvas.width / 2;
    const halfHeight = canvas.height / 2;
    const cellSize = GRID_SIZE * viewSettings.zoom;

    const startX = Math.floor(viewSettings.centerX - halfWidth / cellSize) - 1;
    const endX = Math.ceil(viewSettings.centerX + halfWidth / cellSize) + 1;
    const startY = Math.floor(viewSettings.centerY - halfHeight / cellSize) - 1;
    const endY = Math.ceil(viewSettings.centerY + halfHeight / cellSize) + 1;

    // Draw land plots
    for (let x = startX; x <= endX; x++) {
      for (let y = startY; y <= endY; y++) {
        const screenPos = worldToScreen(x, y);
        const land = getLandAt(x, y);
        
        // Determine color based on view mode
        let fillColor = TERRAIN_COLORS.unknown;
        let strokeColor = '#E5E7EB';
        let strokeWidth = 1;

        if (viewSettings.viewMode === 'terrain') {
          const terrain = land?.terrain || getTerrainAt(x, y);
          fillColor = TERRAIN_COLORS[terrain as keyof typeof TERRAIN_COLORS] || TERRAIN_COLORS.unknown;
        } else if (viewSettings.viewMode === 'ownership') {
          if (land) {
            fillColor = '#3B82F6'; // Blue for owned
            strokeColor = '#1D4ED8';
            strokeWidth = 2;
          } else {
            fillColor = '#F3F4F6'; // Gray for unowned
          }
        } else if (viewSettings.viewMode === 'buildings') {
          if (land?.buildings && land.buildings.length > 0) {
            fillColor = '#10B981'; // Green for built
            strokeColor = '#059669';
            strokeWidth = 2;
          } else if (land) {
            fillColor = '#FEF3C7'; // Yellow for owned but empty
          } else {
            fillColor = '#F3F4F6'; // Gray for unowned
          }
        }

        // Draw cell
        ctx.fillStyle = fillColor;
        ctx.fillRect(
          screenPos.x,
          screenPos.y,
          cellSize,
          cellSize
        );

        // Draw grid lines
        if (viewSettings.showGrid && cellSize > 10) {
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = strokeWidth;
          ctx.strokeRect(
            screenPos.x,
            screenPos.y,
            cellSize,
            cellSize
          );
        }

        // Draw coordinates
        if (viewSettings.showCoordinates && cellSize > 30) {
          ctx.fillStyle = '#374151';
          ctx.font = `${Math.min(10, cellSize / 4)}px Inter`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(
            `${x},${y}`,
            screenPos.x + cellSize / 2,
            screenPos.y + cellSize / 2
          );
        }

        // Draw buildings
        if (land?.buildings && land.buildings.length > 0 && cellSize > 20) {
          const buildingSize = Math.max(4, cellSize / 6);
          land.buildings.forEach((building, index) => {
            const buildingX = screenPos.x + (index % 2) * (cellSize / 2) + cellSize / 4;
            const buildingY = screenPos.y + Math.floor(index / 2) * (cellSize / 2) + cellSize / 4;
            
            ctx.fillStyle = building.isBuilt ? '#059669' : '#F59E0B';
            ctx.fillRect(
              buildingX - buildingSize / 2,
              buildingY - buildingSize / 2,
              buildingSize,
              buildingSize
            );
          });
        }

        // Draw rarity indicator for owned land
        if (land && viewSettings.viewMode !== 'ownership' && cellSize > 15) {
          const rarityColor = RARITY_COLORS[land.rarity as keyof typeof RARITY_COLORS];
          if (rarityColor) {
            ctx.fillStyle = rarityColor;
            ctx.fillRect(
              screenPos.x + cellSize - 8,
              screenPos.y + 2,
              6,
              6
            );
          }
        }
      }
    }

    // Draw center crosshair
    if (viewSettings.zoom > 0.8) {
      const centerScreen = worldToScreen(0, 0);
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerScreen.x - 10, centerScreen.y);
      ctx.lineTo(centerScreen.x + 10, centerScreen.y);
      ctx.moveTo(centerScreen.x, centerScreen.y - 10);
      ctx.lineTo(centerScreen.x, centerScreen.y + 10);
      ctx.stroke();
    }
  }, [viewSettings, ownedLand, worldToScreen, getLandAt, getTerrainAt]);

  // Mouse event handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const worldPos = screenToWorld(e.clientX, e.clientY);
    setMouseWorldPos(worldPos);

    if (isDragging) {
      const deltaX = (lastMousePos.x - e.clientX) / (GRID_SIZE * viewSettings.zoom);
      const deltaY = (lastMousePos.y - e.clientY) / (GRID_SIZE * viewSettings.zoom);
      
      onPan(deltaX, deltaY);
      setLastMousePos({ x: e.clientX, y: e.clientY });
    }
  }, [isDragging, lastMousePos, onPan, screenToWorld, viewSettings.zoom]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!isDragging) {
      const worldPos = screenToWorld(e.clientX, e.clientY);
      const land = getLandAt(worldPos.x, worldPos.y);
      setSelectedLand(land);
    }
  }, [isDragging, screenToWorld, getLandAt, setSelectedLand]);

  // Resize canvas to match container
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        drawGrid();
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [drawGrid]);

  // Redraw when view settings change
  useEffect(() => {
    drawGrid();
  }, [drawGrid]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleClick}
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
