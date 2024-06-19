import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';

interface BarChartProps {
  data: { type: string; order_amount: number; order_count: number }[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return <div>No data available</div>;
  }

  const chartData = {
    labels: data.map(item => item.type),
    datasets: [
      {
        label: 'Order Amount',
        data: data.map(item => item.order_amount),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      // {
      //   label: 'Order Count',
      //   data: data.map(item => item.order_count),
      //   backgroundColor: 'rgba(153, 102, 255, 0.2)',
      //   borderColor: 'rgba(153, 102, 255, 1)',
      //   borderWidth: 1,
      // },
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
        text: 'Sales by Type',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Type',
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

  return <Bar data={chartData} options={options} height="300px" />;
};

export default BarChart;
