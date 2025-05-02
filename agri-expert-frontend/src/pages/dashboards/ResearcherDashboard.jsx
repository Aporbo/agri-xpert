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
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [soilType, setSoilType] = useState('');
  const [phMin, setPhMin] = useState('');
  const [phMax, setPhMax] = useState('');
  const [moistureMin, setMoistureMin] = useState('');
  const [moistureMax, setMoistureMax] = useState('');
  const [nitrogenMin, setNitrogenMin] = useState('');
  const [nitrogenMax, setNitrogenMax] = useState('');
  const [phosphorusMin, setPhosphorusMin] = useState('');
  const [phosphorusMax, setPhosphorusMax] = useState('');
  const [potassiumMin, setPotassiumMin] = useState('');
  const [potassiumMax, setPotassiumMax] = useState('');
  const [cropRecommendation, setCropRecommendation] = useState('');
  const [fertilizerRecommendation, setFertilizerRecommendation] = useState('');

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
        backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6']
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    if (!soilType || !phMin || !phMax /* validate all other fields */) {
      toast.error('Please fill all fields');
      return;
    }
  
    try {
      const payload = {
        soilType,
        pH: { min: phMin, max: phMax },
        moisture: { min: moistureMin, max: moistureMax },
        nitrogen: { min: nitrogenMin, max: nitrogenMax },
        phosphorus: { min: phosphorusMin, max: phosphorusMax },
        potassium: { min: potassiumMin, max: potassiumMax },
        cropRecommendation,
        fertilizerRecommendation
      };
  
      console.log('Submitting payload:', payload); // Debug log
  
      const response = await axios.post('/researcher/propose-rules', payload);
      console.log('Server response:', response.data); // Debug log
  
      toast.success('Rule submitted successfully!');
      
    } catch (error) {
      console.error('Submission error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Submission failed');
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
            <h3 className="text-xl font-semibold mb-4">📏 Current Soil Rules (Approved)</h3>
            {Array.isArray(rules) && rules.length > 0 ? (
              rules.map((rule, index) => (
                <div key={index} className="mb-6 border-b pb-4">
                  <h4 className="font-medium text-lg mb-2">Rule #{index + 1}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                    <div><b>Soil Type:</b> {rule.soilType}</div>
                    <div><b>pH Range:</b> {rule.pH.min} - {rule.pH.max}</div>
                    <div><b>Moisture Range:</b> {rule.moisture.min} - {rule.moisture.max}</div>
                    <div><b>Nitrogen Range:</b> {rule.nitrogen.min} - {rule.nitrogen.max}</div>
                    <div><b>Phosphorus Range:</b> {rule.phosphorus.min} - {rule.phosphorus.max}</div>
                    <div><b>Potassium Range:</b> {rule.potassium.min} - {rule.potassium.max}</div>
                    <div><b>Recommended Crop:</b> {rule.cropSuggestion}</div>
                    <div><b>Recommended Fertilizer:</b> {rule.fertilizerSuggestion}</div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No approved rules found.</p>
            )}
          </section>

          {/* Propose New Rule Form */}
          <section className="bg-white p-6 shadow rounded">
            <h3 className="text-xl font-semibold mb-4">🧪 Propose New Soil Rule</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <input 
                  type="text" 
                  placeholder="Soil Type (e.g., Loamy, Sandy, Clay)" 
                  value={soilType} 
                  onChange={e => setSoilType(e.target.value)} 
                  className="border p-2 rounded" 
                  required
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">pH Range</label>
                    <div className="flex gap-2">
                      <input 
                        type="number" step="0.1" placeholder="Min" min="0" max="14" 
                        value={phMin} onChange={e => setPhMin(e.target.value)} 
                        className="border p-2 rounded w-full" required 
                      />
                      <input 
                        type="number" step="0.1" placeholder="Max" min="0" max="14" 
                        value={phMax} onChange={e => setPhMax(e.target.value)} 
                        className="border p-2 rounded w-full" required 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Moisture Range</label>
                    <div className="flex gap-2">
                      <input 
                        type="number" step="1" placeholder="Min" min="0" 
                        value={moistureMin} onChange={e => setMoistureMin(e.target.value)} 
                        className="border p-2 rounded w-full" required 
                      />
                      <input 
                        type="number" step="1" placeholder="Max" min="0" 
                        value={moistureMax} onChange={e => setMoistureMax(e.target.value)} 
                        className="border p-2 rounded w-full" required 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nitrogen Range</label>
                    <div className="flex gap-2">
                      <input 
                        type="number" step="1" placeholder="Min" min="0" 
                        value={nitrogenMin} onChange={e => setNitrogenMin(e.target.value)} 
                        className="border p-2 rounded w-full" required 
                      />
                      <input 
                        type="number" step="1" placeholder="Max" min="0" 
                        value={nitrogenMax} onChange={e => setNitrogenMax(e.target.value)} 
                        className="border p-2 rounded w-full" required 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phosphorus Range</label>
                    <div className="flex gap-2">
                      <input 
                        type="number" step="1" placeholder="Min" min="0" 
                        value={phosphorusMin} onChange={e => setPhosphorusMin(e.target.value)} 
                        className="border p-2 rounded w-full" required 
                      />
                      <input 
                        type="number" step="1" placeholder="Max" min="0" 
                        value={phosphorusMax} onChange={e => setPhosphorusMax(e.target.value)} 
                        className="border p-2 rounded w-full" required 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Potassium Range</label>
                    <div className="flex gap-2">
                      <input 
                        type="number" step="1" placeholder="Min" min="0" 
                        value={potassiumMin} onChange={e => setPotassiumMin(e.target.value)} 
                        className="border p-2 rounded w-full" required 
                      />
                      <input 
                        type="number" step="1" placeholder="Max" min="0" 
                        value={potassiumMax} onChange={e => setPotassiumMax(e.target.value)} 
                        className="border p-2 rounded w-full" required 
                      />
                    </div>
                  </div>
                </div>

                <input 
                  type="text" 
                  placeholder="Crop Recommendation" 
                  value={cropRecommendation} 
                  onChange={e => setCropRecommendation(e.target.value)} 
                  className="w-full border p-2 rounded" 
                  required
                />
                
                <input 
                  type="text" 
                  placeholder="Fertilizer Recommendation" 
                  value={fertilizerRecommendation} 
                  onChange={e => setFertilizerRecommendation(e.target.value)} 
                  className="w-full border p-2 rounded" 
                  required
                />
              </div>
              
              <button 
                type="submit" 
                disabled={submitting}
                className={`px-4 py-2 rounded text-white ${submitting ? 'bg-gray-400' : 'bg-emerald-600 hover:bg-emerald-700'}`}
              >
                {submitting ? 'Submitting...' : 'Submit for Approval'}
              </button>
            </form>
          </section>
        </>
      )}
    </div>
  );
};

export default ResearcherDashboard;