import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';

interface LineChartProps {
  data: { date: string; order_amount: number; order_count: number }[];
  selectedMetric: 'order_amount' | 'order_count';
}

const LineChart: React.FC<LineChartProps> = ({ data, selectedMetric }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return <div>No data available</div>;
  }

  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: selectedMetric === 'order_amount' ? 'Order Amount' : 'Order Count',
        data: data.map(item => item[selectedMetric]),
        borderColor: selectedMetric === 'order_amount' ? 'rgba(75, 192, 192, 1)' : 'rgba(153, 102, 255, 1)',
        backgroundColor: selectedMetric === 'order_amount' ? 'rgba(75, 192, 192, 0.2)' : 'rgba(153, 102, 255, 0.2)',
        fill: false,
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sales Daily Line Chart',
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
        },
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: selectedMetric === 'order_amount' ? 'Order Amount' : 'Order Count',
        },
      },
    },
  };

  return <Line data={chartData} options={options} height="300px" />;
};

export default LineChart;
