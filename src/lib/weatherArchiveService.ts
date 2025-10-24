export type WeatherArchiveParams = {
  latitude: number;
  longitude: number;
  start_date: string;
  end_date: string;
};

export async function getWeatherArchiveData(params: WeatherArchiveParams) {
  try {
    const { latitude, longitude, start_date, end_date } = params;
    const url = new URL("/api/weather-archive", window.location.origin);
    url.searchParams.append("latitude", String(latitude));
    url.searchParams.append("longitude", String(longitude));
    url.searchParams.append("start_date", String(start_date));
    url.searchParams.append("end_date", String(end_date));

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching weather archive data:", error);
    throw new Error("Failed to fetch weather archive data");
  }
}
