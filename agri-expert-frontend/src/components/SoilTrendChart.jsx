import React, { useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend
} from 'chart.js';

Chart.register(LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend);

const SoilTrendChart = ({ soilTests }) => {
  const chartRef = useRef();

  if (!soilTests || soilTests.length === 0) return null;

  const labels = soilTests.map(test => new Date(test.createdAt).toLocaleDateString());

  const getAvg = (arr) => arr.reduce((sum, val) => sum + val, 0) / arr.length || 0;

  const getAvgLine = (avgVal) => Array(soilTests.length).fill(avgVal);

  const pHValues = soilTests.map(t => t.pH);
  const moistureValues = soilTests.map(t => t.moisture);
  const nValues = soilTests.map(t => t.nitrogen);
  const pValues = soilTests.map(t => t.phosphorus);
  const kValues = soilTests.map(t => t.potassium);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'pH',
        data: pHValues,
        borderColor: '#34D399',
        backgroundColor: 'rgba(52, 211, 153, 0.2)',
        tension: 0.3,
      },
      {
        label: 'pH Avg',
        data: getAvgLine(getAvg(pHValues)),
        borderColor: '#065F46',
        borderDash: [6, 6],
        pointRadius: 0,
        tension: 0.1,
      },
      {
        label: 'Moisture',
        data: moistureValues,
        borderColor: '#60A5FA',
        backgroundColor: 'rgba(96, 165, 250, 0.2)',
        tension: 0.3,
      },
      {
        label: 'Moisture Avg',
        data: getAvgLine(getAvg(moistureValues)),
        borderColor: '#1E40AF',
        borderDash: [6, 6],
        pointRadius: 0,
        tension: 0.1,
      },
      {
        label: 'Nitrogen',
        data: nValues,
        borderColor: '#FBBF24',
        backgroundColor: 'rgba(251, 191, 36, 0.2)',
        tension: 0.3,
      },
      {
        label: 'Nitrogen Avg',
        data: getAvgLine(getAvg(nValues)),
        borderColor: '#92400E',
        borderDash: [6, 6],
        pointRadius: 0,
        tension: 0.1,
      },
      {
        label: 'Phosphorus',
        data: pValues,
        borderColor: '#EC4899',
        backgroundColor: 'rgba(236, 72, 153, 0.2)',
        tension: 0.3,
      },
      {
        label: 'Phosphorus Avg',
        data: getAvgLine(getAvg(pValues)),
        borderColor: '#9D174D',
        borderDash: [6, 6],
        pointRadius: 0,
        tension: 0.1,
      },
      {
        label: 'Potassium',
        data: kValues,
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        tension: 0.3,
      },
      {
        label: 'Potassium Avg',
        data: getAvgLine(getAvg(kValues)),
        borderColor: '#4C1D95',
        borderDash: [6, 6],
        pointRadius: 0,
        tension: 0.1,
      },
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: '📊 Soil Test Trends Over Time' },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const handleDownload = () => {
    const chart = chartRef.current;
    if (chart) {
      const url = chart.toBase64Image();
      const link = document.createElement('a');
      link.href = url;
      link.download = 'soil_trend_chart.png';
      link.click();
    }
  };

  return (
    <div className="bg-white p-4 shadow rounded mt-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-700">📈 Soil Test Trends</h3>
        <button
          onClick={handleDownload}
          className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Download Chart
        </button>
      </div>
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  );
};

export default SoilTrendChart;
