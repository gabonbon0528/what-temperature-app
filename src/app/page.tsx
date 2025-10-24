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

  if (loading) {
    return (
      <div className="font-sans flex items-center justify-center min-h-screen p-8 pb-20 sm:p-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg text-gray-700 font-medium">載入中...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="font-sans flex flex-col items-center justify-center min-h-screen p-8 pb-20 sm:p-20 bg-gradient-to-br from-red-50 to-pink-100">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-xl mb-4 font-semibold">
            錯誤: {error}
          </div>
          <button
            onClick={() => fetchWeatherArchive(DEFAULT_PARAMS)}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
          >
            重新載入
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans flex flex-col items-center min-h-screen p-8 pb-20 gap-8 sm:p-20 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-6xl">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          🌡️ 溫度資訊
        </h1>

        {weatherArchive && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl mb-8">
            <Chart weatherArchive={weatherArchive} month={month} />
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg mb-6">
          <p className="text-sm text-gray-600 text-center">
            現在查詢的是歷年 {month} 月均溫，總共查詢了{" "}
            <span className="font-semibold text-blue-600">
              {Object.keys(weatherArchive?.data.yearly || {}).length}
            </span>{" "}
            年資料
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-700 whitespace-nowrap">
              切換月份
            </h2>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
              onChange={(e) => {
                setMonth(Number(e.target.value));
              }}
            >
              <option value={1}>一月</option>
              <option value={2}>二月</option>
              <option value={3}>三月</option>
              <option value={4}>四月</option>
              <option value={5}>五月</option>
              <option value={6}>六月</option>
              <option value={7}>七月</option>
              <option value={8}>八月</option>
              <option value={9}>九月</option>
              <option value={10}>十月</option>
              <option value={11}>十一月</option>
              <option value={12}>十二月</option>
            </select>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-semibold text-center mb-6 text-gray-800">
            📅 資料範圍設定
          </h3>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap min-w-[80px]">
                開始日期
              </label>
              <input
                type="date"
                value={startDate}
                onChange={handleChangeStartDate}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm w-full sm:w-auto"
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap min-w-[80px]">
                結束日期
              </label>
              <input
                type="date"
                value={endDate}
                onChange={handleChangeEndDate}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm w-full sm:w-auto"
              />
            </div>
            <div className="flex justify-center pt-4">
              <button
                onClick={handleClickFetchWeatherArc}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                🔍 查詢資料
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
