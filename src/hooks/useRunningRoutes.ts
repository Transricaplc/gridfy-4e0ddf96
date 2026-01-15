import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface RunningRoute {
  id: string;
  name: string;
  location: string;
  distance_km: number;
  difficulty: 'easy' | 'moderate' | 'difficult';
  terrain: 'paved' | 'trail' | 'sand' | 'mixed';
  is_lit: boolean;
  has_water_stations: boolean;
  is_open: boolean;
  safety_rating: number;
  coordinates_lat: number | null;
  coordinates_lng: number | null;
  notes: string | null;
  created_at: string;
}

interface UseRunningRoutesReturn {
  routes: RunningRoute[];
  loading: boolean;
  error: string | null;
  getRouteById: (id: string) => RunningRoute | undefined;
  getOpenRoutes: () => RunningRoute[];
  getSafeRoutes: () => RunningRoute[];
  refetch: () => Promise<void>;
}

export const useRunningRoutes = (): UseRunningRoutesReturn => {
  const [routes, setRoutes] = useState<RunningRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('running_routes')
        .select('*')
        .order('safety_rating', { ascending: false });

      if (fetchError) throw fetchError;

      setRoutes(data as unknown as RunningRoute[] || []);
    } catch (err) {
      console.error('Error fetching running routes:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch running routes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getRouteById = (id: string) => routes.find(r => r.id === id);
  const getOpenRoutes = () => routes.filter(r => r.is_open);
  const getSafeRoutes = () => routes.filter(r => r.safety_rating >= 4);

  return {
    routes,
    loading,
    error,
    getRouteById,
    getOpenRoutes,
    getSafeRoutes,
    refetch: fetchData,
  };
};

export const getDifficultyColor = (difficulty: RunningRoute['difficulty']): string => {
  switch (difficulty) {
    case 'easy': return 'hsl(160 84% 39%)';
    case 'moderate': return 'hsl(38 92% 50%)';
    case 'difficult': return 'hsl(0 84% 60%)';
    default: return 'hsl(210 10% 60%)';
  }
};

export const getTerrainIcon = (terrain: RunningRoute['terrain']): string => {
  switch (terrain) {
    case 'paved': return '🛤️';
    case 'trail': return '🌲';
    case 'sand': return '🏖️';
    case 'mixed': return '🔀';
    default: return '🏃';
  }
};

export const getSafetyLabel = (rating: number): string => {
  if (rating >= 5) return 'Very Safe';
  if (rating >= 4) return 'Safe';
  if (rating >= 3) return 'Moderate';
  return 'Caution';
};

export const getSafetyColor = (rating: number): string => {
  if (rating >= 5) return 'hsl(160 84% 39%)';
  if (rating >= 4) return 'hsl(160 60% 45%)';
  if (rating >= 3) return 'hsl(38 92% 50%)';
  return 'hsl(0 84% 60%)';
};
