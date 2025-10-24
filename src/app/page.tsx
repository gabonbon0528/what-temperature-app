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
      <div className="font-sans flex items-center justify-center min-h-screen p-8 pb-20 sm:p-20 bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
          <div className="text-lg text-sky-700 font-medium">載入中...</div>
        </div>
      </div>
    );
  }

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
        <h1 className="text-2xl font-bold mb-4 text-center text-sky-600 bg-white/20 backdrop-blur-md rounded-xl p-3 border border-sky-200/50 shadow-lg shadow-sky-100/50">
          🌡️ 溫度資訊
        </h1>

        {weatherArchive && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-1 border border-sky-200/30 mb-4 shadow-xl shadow-sky-100/30">
            <Chart weatherArchive={weatherArchive} month={month} />
          </div>
        )}

        <div className="bg-white/15 backdrop-blur-md rounded-xl p-2 border border-sky-200/40 mb-3 shadow-lg shadow-sky-100/40">
          <p className="text-sm text-sky-700 text-center">
            現在查詢的是歷年 {month} 月均溫，總共查詢了{" "}
            <span className="font-semibold text-sky-600">
              {Object.keys(weatherArchive?.data.yearly || {}).length}
            </span>{" "}
            年資料
          </p>
        </div>

        <div className="bg-white/15 backdrop-blur-md rounded-xl p-2 border border-sky-200/40 mb-3 shadow-lg shadow-sky-100/40">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <h2 className="text-lg font-semibold text-sky-700 whitespace-nowrap">
              切換月份
            </h2>
            <select
              className="px-4 py-2 border border-sky-300/60 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-400 transition-all duration-200 bg-white/20 backdrop-blur-sm text-sky-700 shadow-md shadow-sky-100/30"
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

        <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-2 border border-sky-200/40 shadow-xl shadow-sky-100/40">
          <h3 className="text-xl font-semibold text-center mb-2 text-sky-600">
            📅 資料範圍設定
          </h3>
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <label className="text-sm font-medium text-sky-700 whitespace-nowrap min-w-[80px]">
                開始日期
              </label>
              <input
                type="date"
                value={startDate}
                onChange={handleChangeStartDate}
                className="px-4 py-2 border border-sky-300/60 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-400 transition-all duration-200 bg-white/20 backdrop-blur-sm text-sky-700 w-full sm:w-auto shadow-md shadow-sky-100/30"
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <label className="text-sm font-medium text-sky-700 whitespace-nowrap min-w-[80px]">
                結束日期
              </label>
              <input
                type="date"
                value={endDate}
                onChange={handleChangeEndDate}
                className="px-4 py-2 border border-sky-300/60 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-400 transition-all duration-200 bg-white/20 backdrop-blur-sm text-sky-700 w-full sm:w-auto shadow-md shadow-sky-100/30"
              />
            </div>
            <div className="flex justify-center pt-1">
              <button
                onClick={handleClickFetchWeatherArc}
                className="px-8 py-3 bg-gradient-to-r from-sky-500/90 to-sky-600/90 text-white rounded-xl hover:from-sky-600 hover:to-sky-700 transition-all duration-200 font-semibold border border-sky-400/60 hover:border-sky-500 shadow-lg shadow-sky-200/50 hover:shadow-xl hover:shadow-sky-300/60 backdrop-blur-sm"
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
