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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function SalesChart({ salesData = [], title = "Sales & Order Data" }) {
  if (!salesData || salesData.length === 0) {
    return <p className="text-center text-gray-500">No sales data available.</p>;
  }

  const options = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const labels = salesData.map((data) => data?.date);

  const data = {
    labels,
    datasets: [
      {
        label: "Sales",
        data: salesData.map((data) => data?.sales),
        borderColor: "#198753",
        backgroundColor: "rgba(42, 117, 83, 0.5)",
        yAxisID: "y",
        tension: 0.3,
      },
      {
        label: "Orders",
        data: salesData.map((data) => data?.numOrders),
        borderColor: "rgb(220, 52, 69)",
        backgroundColor: "rgba(201, 68, 82, 0.5)",
        yAxisID: "y1",
        tension: 0.3,
      },
    ],
  };

  return <Line options={options} data={data} />;
}
