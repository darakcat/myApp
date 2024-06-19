import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';

interface LineChartProps {
  data: { date: string; order_amount: number; order_count: number }[];
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return <div>No data available</div>;
  }

  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'Order Amount',
        data: data.map(item => item.order_amount),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
        yAxisID: 'y1',
      },
      {
        label: 'Order Count',
        data: data.map(item => item.order_count),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: false,
        yAxisID: 'y2',
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
      y1: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Order Amount',
        },
      },
      y2: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'Order Count',
        },
      },
    },
  };

  return <Line data={chartData} options={options} height="300px" />;
};

export default LineChart;
