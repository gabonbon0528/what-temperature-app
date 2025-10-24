import { NextRequest, NextResponse } from "next/server";
import { fetchWeatherApi } from "openmeteo";

export type WeatherArchiveResponse = {
  success: boolean;
  location: {
    latitude: number;
    longitude: number;
    elevation: number;
  };
  data: {
    daily: {
      temperatures: number[];
      dates: string[];
    };
    monthly: Record<string, number>;
    yearly: Record<number, Record<number, number>>;
  };
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const currentDate = new Date();

    const latitude = searchParams.get("latitude");
    const longitude = searchParams.get("longitude");
    const start_date =
      searchParams.get("start_date") || currentDate.toISOString().split("T")[0];
    const end_date =
      searchParams.get("end_date") || currentDate.toISOString().split("T")[0];

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    if (startDate > currentDate || endDate > currentDate) {
      return NextResponse.json(
        { error: "Date cannot be in the future" },
        { status: 400 }
      );
    }

    const params = {
      latitude,
      longitude,
      start_date,
      end_date,
      daily: "temperature_2m_mean",
      timezone: "GMT",
    };

    const url = "https://archive-api.open-meteo.com/v1/archive";
    const responses = await fetchWeatherApi(url, params);

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];

    // Attributes for timezone and location
    const elevation = response.elevation();
    const utcOffsetSeconds = response.utcOffsetSeconds();

    const daily = response.daily()!;
    const temperatureMeanArray = daily.variables(0)!.valuesArray();
    const timeArray = [
      ...Array(
        (Number(daily.timeEnd()) - Number(daily.time())) / daily.interval()
      ),
    ].map(
      (_, i) =>
        new Date(
          (Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) *
            1000
        )
    );

    // 從 daily 資料計算月均溫
    const monthlyAverages = new Map<string, number[]>();

    temperatureMeanArray?.forEach((temp, index) => {
      const date = timeArray[index];
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!monthlyAverages.has(monthKey)) {
        monthlyAverages.set(monthKey, []);
      }
      monthlyAverages.get(monthKey)!.push(temp);
    });

    // 計算每個月的平均溫度
    const monthlyTemps = new Map<string, number>();
    monthlyAverages.forEach((temps, monthKey) => {
      const average = temps.reduce((sum, temp) => sum + temp, 0) / temps.length;
      monthlyTemps.set(monthKey, average);
    });

    // 按年份分組的月均溫
    const yearlyMonthlyTemps = new Map<number, Map<number, number>>();
    monthlyTemps.forEach((temp, monthKey) => {
      const [year, month] = monthKey.split("-").map(Number);
      if (!yearlyMonthlyTemps.has(year)) {
        yearlyMonthlyTemps.set(year, new Map());
      }
      yearlyMonthlyTemps.get(year)!.set(month, temp);
    });

    // 回傳處理過的資料
    return NextResponse.json<WeatherArchiveResponse>({
      success: true,
      location: {
        latitude: Number(latitude),
        longitude: Number(longitude),
        elevation: elevation,
      },
      data: {
        daily: {
          temperatures: temperatureMeanArray
            ? Array.from(temperatureMeanArray)
            : [],
          dates: timeArray.map((date) => date.toISOString().split("T")[0]),
        },
        monthly: Object.fromEntries(monthlyTemps),
        yearly: Object.fromEntries(
          Array.from(yearlyMonthlyTemps.entries()).map(([year, months]) => [
            year,
            Object.fromEntries(months),
          ])
        ),
      },
    });
  } catch (error) {
    console.error("Error fetching weather archive data:", error);
    return NextResponse.json(
      { error: "Failed to fetch weather archive data" },
      { status: 500 }
    );
  }
}
