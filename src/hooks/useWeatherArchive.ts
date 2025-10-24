"use client";

import { WeatherArchiveResponse } from "@/app/api/weather-archive/route";
import {
  getWeatherArchiveData,
  WeatherArchiveParams,
} from "@/lib/weatherArchiveService";
import { useCallback, useEffect, useState } from "react";

export const DEFAULT_PARAMS = {
  latitude: 25.0531,
  longitude: 121.5264,
  start_date: "2010-01-01",
  end_date: new Date().toISOString().split("T")[0],
};

export function useWeatherArchive() {
  const [data, setData] = useState<WeatherArchiveResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (params: WeatherArchiveParams) => {
    try {
      setLoading(true);
      setError(null);
      const result = await getWeatherArchiveData(params);
      setData(result);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(DEFAULT_PARAMS);
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
