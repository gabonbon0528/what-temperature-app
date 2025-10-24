// 溫度資料服務
export interface TemperatureData {
  temperature: number;
  location: string;
  timestamp: string;
  unit: 'celsius' | 'fahrenheit';
}

// 獲取溫度資料
export async function getTemperatureData(location?: string): Promise<TemperatureData> {
  try {
    // 調用我們的內部 API 路由
    const url = new URL('/api/weather', window.location.origin);
    if (location) {
      url.searchParams.append('location', location);
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result: TemperatureData = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching temperature data:', error);
    throw new Error('Failed to fetch temperature data');
  }
}

// 轉換溫度單位
export function convertTemperature(
  temp: number, 
  from: 'celsius' | 'fahrenheit', 
  to: 'celsius' | 'fahrenheit'
): number {
  if (from === to) return temp;
  
  if (from === 'celsius' && to === 'fahrenheit') {
    return (temp * 9/5) + 32;
  } else {
    return (temp - 32) * 5/9;
  }
}
