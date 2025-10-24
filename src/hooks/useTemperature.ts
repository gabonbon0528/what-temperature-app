'use client';

import { useState, useEffect } from 'react';
import { getTemperatureData, TemperatureData } from '@/lib/temperatureService';

export interface UseTemperatureReturn {
  data: TemperatureData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useTemperature(location?: string): UseTemperatureReturn {
  const [data, setData] = useState<TemperatureData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getTemperatureData(location);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [location]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
