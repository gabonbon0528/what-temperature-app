import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { WeatherArchiveResponse } from "@/app/api/weather-archive/route";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
};

export function Chart(props: {
  weatherArchive: WeatherArchiveResponse;
  month: number;
}) {
  const { weatherArchive, month } = props;
  const { data } = weatherArchive;
  if (!data) return null;
  const { yearly } = data;
  const labels = Object.keys(yearly);

  const yearMap = new Map();

  Object.entries(yearly).forEach(([year, monthTemperatures]) => {
    yearMap.set(year, monthTemperatures[month]);
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: "攝氏溫度",
        data: [...yearMap.values()],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return <Line options={options} data={chartData} />;
}
