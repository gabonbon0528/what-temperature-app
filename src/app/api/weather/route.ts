import { NextRequest, NextResponse } from 'next/server';

// 中央氣象署 API 回應格式
interface CWAStationData {
  StationName: string;
  Temperature: string;
  ObsTime: {
    DateTime: string;
  };
  GeoInfo: {
    Coordinates: Array<{
      CoordinateName: string;
      CoordinateFormat: string;
      StationLatitude: string;
      StationLongitude: string;
    }>;
  };
}

interface CWAWeatherResponse {
  success: string;
  result: {
    resource_id: string;
    fields: Array<{
      id: string;
      type: string;
    }>;
  };
  records: {
    Station: CWAStationData[];
  };
}

export async function GET(request: NextRequest) {
  try {
    const API_KEY = process.env.SECRET_API_KEY;
    
    if (!API_KEY) {
      return NextResponse.json(
        { error: 'API Key 未設定，請在 .env.local 中設定 SECRET_API_KEY' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');

    // 構建中央氣象署 API URL
    const cwaUrl = new URL('https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0001-001');
    cwaUrl.searchParams.append('Authorization', API_KEY);
    cwaUrl.searchParams.append('format', 'JSON');
    cwaUrl.searchParams.append('weatherElement', 'AirTemperatureAirTemperature');
    cwaUrl.searchParams.append('StationID', '466920');
    
    if (location) {
      cwaUrl.searchParams.append('locationName', location);
    }

    // 從伺服器端調用中央氣象署 API
    const response = await fetch(cwaUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`CWA API error! status: ${response.status}`);
    }

    const result: CWAWeatherResponse = await response.json();
    
    // 檢查 API 回應
    if (result.success !== 'true' || !result.records?.Station?.length) {
      throw new Error('無法獲取氣象資料');
    }

    // 取第一個測站的資料
    const station = result.records.Station[0];
    
    // 回傳處理過的資料
    return NextResponse.json({
      temperature: parseFloat(station.Temperature) || 0,
      location: station.StationName,
      timestamp: station.ObsTime.DateTime,
      unit: 'celsius'
    });

  } catch (error) {
    console.error('Error fetching weather data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}
