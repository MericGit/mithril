import { getPublicationsData } from '../services/api';
import { useState, useEffect } from 'react';

export interface PublicationData {
  years: number[];
  countries: {
    name: string;
    color: string;
    flag: string;
    data: number[];
  }[];
}

// This hook fetches publications data from the API
export const usePublicationsData = () => {
  const [data, setData] = useState<PublicationData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getPublicationsData();
        
        setData(response);
        setError(null);
      } catch (err) {
        console.error('Error fetching publications data:', err);
        setError('Failed to fetch publications data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};
