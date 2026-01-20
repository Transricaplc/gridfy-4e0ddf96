import { useState, useCallback, useMemo } from 'react';
import { wardData, WardData } from '@/data/mapData';

export interface WardComparisonState {
  selectedWards: string[];
  hoveredWard: string | null;
  highlightedWards: Set<number>; // Ward numbers for map highlighting
}

export interface UseWardComparisonReturn extends WardComparisonState {
  // Selection Actions
  toggleWard: (wardId: string) => void;
  selectWard: (wardId: string) => void;
  deselectWard: (wardId: string) => void;
  clearSelection: () => void;
  selectAll: () => void;
  
  // Hover Actions
  setHoveredWard: (wardId: string | null) => void;
  
  // Computed Values
  selectedWardData: WardData[];
  isWardSelected: (wardId: string) => boolean;
  isWardHighlighted: (wardNumber: number) => boolean;
  
  // Stats
  averageSafetyScore: number;
  averageCctvPerKm: number;
  totalPopulation: number;
  totalCctvCount: number;
}

// Extract ward number from ward ID (e.g., 'w54' -> 54)
const getWardNumber = (wardId: string): number => {
  const match = wardId.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

export const useWardComparison = (): UseWardComparisonReturn => {
  const [selectedWards, setSelectedWards] = useState<string[]>([wardData[0].id, wardData[1].id]);
  const [hoveredWard, setHoveredWard] = useState<string | null>(null);

  // Toggle ward selection
  const toggleWard = useCallback((wardId: string) => {
    setSelectedWards(prev => {
      if (prev.includes(wardId)) {
        // Don't allow deselecting if only 1 ward left
        if (prev.length > 1) {
          return prev.filter(id => id !== wardId);
        }
        return prev;
      }
      return [...prev, wardId];
    });
  }, []);

  // Select a single ward
  const selectWard = useCallback((wardId: string) => {
    setSelectedWards(prev => {
      if (!prev.includes(wardId)) {
        return [...prev, wardId];
      }
      return prev;
    });
  }, []);

  // Deselect a ward
  const deselectWard = useCallback((wardId: string) => {
    setSelectedWards(prev => {
      if (prev.length > 1) {
        return prev.filter(id => id !== wardId);
      }
      return prev;
    });
  }, []);

  // Clear all selections except first
  const clearSelection = useCallback(() => {
    setSelectedWards([wardData[0].id]);
  }, []);

  // Select all wards
  const selectAll = useCallback(() => {
    setSelectedWards(wardData.map(w => w.id));
  }, []);

  // Check if ward is selected
  const isWardSelected = useCallback((wardId: string) => {
    return selectedWards.includes(wardId);
  }, [selectedWards]);

  // Compute highlighted ward numbers for map
  const highlightedWards = useMemo(() => {
    const numbers = new Set<number>();
    selectedWards.forEach(wardId => {
      numbers.add(getWardNumber(wardId));
    });
    // Include hovered ward if any
    if (hoveredWard) {
      numbers.add(getWardNumber(hoveredWard));
    }
    return numbers;
  }, [selectedWards, hoveredWard]);

  // Check if ward number is highlighted on map
  const isWardHighlighted = useCallback((wardNumber: number) => {
    return highlightedWards.has(wardNumber);
  }, [highlightedWards]);

  // Get selected ward data
  const selectedWardData = useMemo(() => {
    return wardData.filter(w => selectedWards.includes(w.id));
  }, [selectedWards]);

  // Compute averages
  const averageSafetyScore = useMemo(() => {
    if (selectedWardData.length === 0) return 0;
    return Math.round(
      selectedWardData.reduce((acc, w) => acc + w.safetyScore, 0) / selectedWardData.length
    );
  }, [selectedWardData]);

  const averageCctvPerKm = useMemo(() => {
    if (selectedWardData.length === 0) return 0;
    return Number(
      (selectedWardData.reduce((acc, w) => acc + (w.cctvCount / w.areaKm2), 0) / selectedWardData.length).toFixed(1)
    );
  }, [selectedWardData]);

  const totalPopulation = useMemo(() => {
    return selectedWardData.reduce((acc, w) => acc + w.population, 0);
  }, [selectedWardData]);

  const totalCctvCount = useMemo(() => {
    return selectedWardData.reduce((acc, w) => acc + w.cctvCount, 0);
  }, [selectedWardData]);

  return {
    selectedWards,
    hoveredWard,
    highlightedWards,
    toggleWard,
    selectWard,
    deselectWard,
    clearSelection,
    selectAll,
    setHoveredWard,
    selectedWardData,
    isWardSelected,
    isWardHighlighted,
    averageSafetyScore,
    averageCctvPerKm,
    totalPopulation,
    totalCctvCount,
  };
};

export default useWardComparison;
