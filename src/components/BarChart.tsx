// src/components/BarChart.tsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';

interface BarChartProps {
  data: { date: string; amount: number; count: number }[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      // {
      //   label: 'Amount',
      //   data: data.map(item => item.amount),
      //   borderColor: 'rgba(75, 192, 192, 1)',
      //   backgroundColor: 'rgba(75, 192, 192, 0.2)',
      //   fill: false,
      // },
      {
        label: 'Count',
        data: data.map(item => item.count),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
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
        text: 'Chart.js Bar Chart',
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
          text: 'Value',
        },
      },
    },
  };

  return <Bar data={chartData} options={options} min-height="300px" height="300px" />;
};

export default BarChart;
