import { useState, useEffect } from 'react';

export interface WorldMapPoint {
  id: string;
  country: string;
  topic: string;
  coordinates: number[];
  intensity: number;
  description: string;
  adversarial: boolean;
}

export const useWorldMapData = () => {
  const [data, setData] = useState<WorldMapPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/world-map-data');
        
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        console.error('Error fetching world map data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};
