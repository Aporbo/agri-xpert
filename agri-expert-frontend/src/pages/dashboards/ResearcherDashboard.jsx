import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import toast, { Toaster } from 'react-hot-toast';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ResearcherDashboard = () => {
  const [insights, setInsights] = useState([]);
  const [trends, setTrends] = useState([]);
  const [rules, setRules] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [insightRes, trendRes, ruleRes] = await Promise.all([
        axios.get('/researcher/soil-insights'),
        axios.get('/researcher/trends'),
        axios.get('/researcher/rules')
      ]);
      setInsights(insightRes.data);
      setTrends(trendRes.data);
      setRules(ruleRes.data);
    } catch (err) {
      console.error('Failed to load researcher data:', err);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const chartData = {
    labels: trends.map(item => item._id),
    datasets: [
      {
        label: 'Crop Recommendations',
        data: trends.map(item => item.count),
        backgroundColor: trends.map((_, i) =>
          ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'][i % 5]
        )
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Most Recommended Crops' }
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10">
      <Toaster position="top-right" />
      <h2 className="text-3xl font-bold text-emerald-700">🔬 Researcher Dashboard</h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Chart */}
          <section className="bg-white p-6 shadow rounded">
            <h3 className="text-xl font-semibold mb-4">📊 Recommendation Trends</h3>
            <div className="w-full max-w-2xl">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </section>

          {/* Soil Insights */}
          <section className="bg-white p-6 shadow rounded">
            <h3 className="text-xl font-semibold mb-4">🌱 Soil Type Insights</h3>
            <ul className="space-y-2">
              {insights.map(insight => (
                <li key={insight._id} className="border p-3 rounded text-gray-700">
                  <b>{insight._id}</b> — Count: {insight.count}, Avg pH: {insight.avgPH?.toFixed(2)}
                </li>
              ))}
            </ul>
          </section>

          {/* Rule Audit */}
          <section className="bg-white p-6 shadow rounded">
            <h3 className="text-xl font-semibold mb-4">📏 Current Soil Rule (Audit)</h3>
            {rules && rules.pH ? (
              <ul className="grid grid-cols-2 gap-4 text-gray-700">
                <li><b>pH:</b> {rules.pH.min} - {rules.pH.max}</li>
                <li><b>Moisture:</b> {rules.moisture.min} - {rules.moisture.max}</li>
                <li><b>Nitrogen:</b> {rules.nitrogen.min} - {rules.nitrogen.max}</li>
                <li><b>Phosphorus:</b> {rules.phosphorus.min} - {rules.phosphorus.max}</li>
                <li><b>Potassium:</b> {rules.potassium.min} - {rules.potassium.max}</li>
                <li><b>Recommended Crop:</b> {rules.cropRecommendation}</li>
                <li><b>Recommended Fertilizer:</b> {rules.fertilizerRecommendation}</li>
              </ul>
            ) : (
              <p className="text-gray-500">No rule configuration found.</p>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default ResearcherDashboard;
