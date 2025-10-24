"use client";

import { Chart } from "@/components/Chart";
import { DEFAULT_PARAMS, useWeatherArchive } from "@/hooks/useWeatherArchive";
import { useState } from "react";

export default function Home() {
  const {
    data: weatherArchive,
    refetch: fetchWeatherArchive,
    loading,
    error,
  } = useWeatherArchive();
  const [startDate, setStartDate] = useState(DEFAULT_PARAMS.start_date);
  const [endDate, setEndDate] = useState(DEFAULT_PARAMS.end_date);
  const [month, setMonth] = useState(1);

  const handleChangeStartDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
  };

  const handleChangeEndDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  };

  const handleClickFetchWeatherArc = () => {
    fetchWeatherArchive({
      latitude: 25.0531,
      longitude: 121.5264,
      start_date: startDate,
      end_date: endDate,
    });
  };

  const renderChartContent = () => {
    if (loading) {
      return (
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-sky-200/30 mb-4 shadow-xl shadow-sky-100/30">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mb-4"></div>
            <div className="text-lg text-sky-700 font-medium">
              載入溫度數據中...
            </div>
            <div className="text-sm text-sky-600 mt-2">請稍候</div>
          </div>
        </div>
      );
    }

    if (weatherArchive) {
      return (
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-1 border border-sky-200/30 mb-4 shadow-xl shadow-sky-100/30">
          <Chart weatherArchive={weatherArchive} month={month} />
        </div>
      );
    }

    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-sky-200/30 mb-4 shadow-xl shadow-sky-100/30">
        <div className="flex flex-col items-center justify-center">
          <div className="text-4xl mb-4">🌡️</div>
          <div className="text-lg text-sky-700 font-medium">
            選擇日期範圍開始查詢
          </div>
          <div className="text-sm text-sky-600 mt-2">
            設定開始和結束日期來查看歷年溫度數據
          </div>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="font-sans flex flex-col items-center justify-center min-h-screen p-8 pb-20 sm:p-20 bg-white">
        <div className="text-center max-w-md">
          <div className="text-sky-600 text-xl mb-4 font-semibold">
            錯誤: {error}
          </div>
          <button
            onClick={() => fetchWeatherArchive(DEFAULT_PARAMS)}
            className="px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors duration-200 font-medium border border-sky-400 hover:border-sky-500"
          >
            重新載入
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans flex flex-col items-center min-h-screen p-2 pb-20 gap-4 sm:p-4 bg-gradient-to-br from-sky-50 via-white to-blue-50">
      <div className="w-full max-w-6xl">
        <h1 className="text-3xl font-bold mb-4 text-center text-sky-600 bg-white/20 backdrop-blur-md rounded-xl p-4 border border-sky-200/50 shadow-lg shadow-sky-100/50">
          <span className="inline-block animate-bounce">🌡️</span>
          <span className="ml-2">溫度資訊</span>
          <span className="ml-2 inline-block animate-pulse">📊</span>
        </h1>

        {renderChartContent()}

        {weatherArchive && (
          <div className="bg-white/15 backdrop-blur-md rounded-xl p-2 border border-sky-200/40 mb-3 shadow-lg shadow-sky-100/40">
            <p className="text-sm text-sky-700 text-center">
              現在查詢的是歷年 {month} 月均溫，總共查詢了{" "}
              <span className="font-semibold text-sky-600">
                {Object.keys(weatherArchive?.data.yearly || {}).length}
              </span>{" "}
              年資料
            </p>
          </div>
        )}

        <div className="bg-white/15 backdrop-blur-md rounded-xl p-4 border border-sky-200/40 mb-3 shadow-lg shadow-sky-100/40">
          <h2 className="text-lg font-semibold text-sky-700 text-center mb-4">
            📅 選擇月份
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {[
              { value: 1, name: "一月", emoji: "❄️" },
              { value: 2, name: "二月", emoji: "🌨️" },
              { value: 3, name: "三月", emoji: "🌸" },
              { value: 4, name: "四月", emoji: "🌱" },
              { value: 5, name: "五月", emoji: "🌺" },
              { value: 6, name: "六月", emoji: "☀️" },
              { value: 7, name: "七月", emoji: "🌞" },
              { value: 8, name: "八月", emoji: "🔥" },
              { value: 9, name: "九月", emoji: "🍂" },
              { value: 10, name: "十月", emoji: "🍁" },
              { value: 11, name: "十一月", emoji: "🍃" },
              { value: 12, name: "十二月", emoji: "❄️" },
            ].map((monthOption) => (
              <button
                key={monthOption.value}
                onClick={() => setMonth(monthOption.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  month === monthOption.value
                    ? "bg-sky-500 text-white shadow-md shadow-sky-200/50 border border-sky-400"
                    : "bg-white/20 text-sky-700 hover:bg-white/30 border border-sky-200/50 hover:border-sky-300/60 shadow-sm hover:shadow-md"
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs">{monthOption.emoji}</span>
                  <span>{monthOption.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-4 border border-sky-200/40 shadow-xl shadow-sky-100/40">
          <h3 className="text-xl font-semibold text-center mb-4 text-sky-600">
            📅 資料範圍設定
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-sky-200/50 shadow-md shadow-sky-100/30">
                <label className="flex items-center gap-2 text-sm font-medium text-sky-700 mb-2">
                  <span className="text-lg">📅</span>
                  開始日期
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={handleChangeStartDate}
                  className="w-full px-3 py-2 border border-sky-300/60 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-400 transition-all duration-200 bg-white/20 backdrop-blur-sm text-sky-700 shadow-sm hover:shadow-md"
                />
              </div>

              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-sky-200/50 shadow-md shadow-sky-100/30">
                <label className="flex items-center gap-2 text-sm font-medium text-sky-700 mb-2">
                  <span className="text-lg">📅</span>
                  結束日期
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={handleChangeEndDate}
                  className="w-full px-3 py-2 border border-sky-300/60 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-400 transition-all duration-200 bg-white/20 backdrop-blur-sm text-sky-700 shadow-sm hover:shadow-md"
                />
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-sky-200/40">
              <label className="flex items-center gap-2 text-sm font-medium text-sky-700 mb-3">
                <span className="text-lg">📅</span>
                歷年數據快速選擇
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  {
                    label: "2010-2024",
                    start: "2010-01-01",
                    end: "2024-12-31",
                    emoji: "📊",
                  },
                  {
                    label: "2000-2024",
                    start: "2000-01-01",
                    end: "2024-12-31",
                    emoji: "📈",
                  },
                  {
                    label: "1995-2024",
                    start: "1995-01-01",
                    end: "2024-12-31",
                    emoji: "📉",
                  },
                  {
                    label: "1950-2024",
                    start: "1950-01-01",
                    end: "2024-12-31",
                    emoji: "📋",
                  },
                ].map((option) => (
                  <button
                    key={option.label}
                    onClick={() => {
                      setStartDate(option.start);
                      setEndDate(option.end);
                    }}
                    className="px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 bg-white/20 text-sky-700 hover:bg-white/30 border border-sky-200/50 hover:border-sky-300/60 shadow-sm hover:shadow-md"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-sm">{option.emoji}</span>
                      <span>{option.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-center pt-2">
              <button
                onClick={handleClickFetchWeatherArc}
                className="px-8 py-3 bg-gradient-to-r from-sky-500/90 to-sky-600/90 text-white rounded-xl hover:from-sky-600 hover:to-sky-700 transition-all duration-200 font-semibold border border-sky-400/60 hover:border-sky-500 shadow-lg shadow-sky-200/50 hover:shadow-xl hover:shadow-sky-300/60 backdrop-blur-sm flex items-center gap-2"
              >
                <span className="text-lg">🔍</span>
                <span>查詢資料</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
