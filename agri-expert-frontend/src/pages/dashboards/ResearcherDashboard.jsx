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
import { FiUpload, FiSave, FiEdit2 } from 'react-icons/fi';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ResearcherDashboard = () => {
  const [insights, setInsights] = useState([]);
  const [trends, setTrends] = useState([]);
  const [rules, setRules] = useState({});
  const [pendingRecs, setPendingRecs] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newRules, setNewRules] = useState({
    pH: { min: 0, max: 0 },
    moisture: { min: 0, max: 0 },
    nitrogen: { min: 0, max: 0 },
    phosphorus: { min: 0, max: 0 },
    potassium: { min: 0, max: 0 },
    cropRecommendation: '',
    fertilizerRecommendation: ''
  });
  const [loading, setLoading] = useState({
    data: true,
    pendingRecs: false,
    uploading: false
  });

  const fetchData = async () => {
    try {
      const [insightRes, trendRes, ruleRes, pendingRes] = await Promise.all([
        axios.get('/researcher/soil-insights'),
        axios.get('/researcher/trends'),
        axios.get('/researcher/rules'),
        axios.get('/researcher/recommendations-for-review')
      ]);
      setInsights(insightRes.data);
      setTrends(trendRes.data);
      setRules(ruleRes.data);
      setPendingRecs(pendingRes.data);
    } catch (err) {
      console.error('Failed to load researcher data:', err);
    } finally {
      setLoading(prev => ({ ...prev, data: false }));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const uploadModel = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    
    setLoading(prev => ({ ...prev, uploading: true }));
    const formData = new FormData();
    formData.append('model', selectedFile);
    
    try {
      await axios.post('/researcher/upload-model', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Model uploaded successfully!');
      setSelectedFile(null);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload model');
    } finally {
      setLoading(prev => ({ ...prev, uploading: false }));
    }
  };

  const handleRuleInputChange = (e) => {
    const { name, value } = e.target;
    const [parent, child] = name.split('.');
    
    if (child) {
      setNewRules(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: parseFloat(value) || 0
        }
      }));
    } else {
      setNewRules(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const proposeNewRules = async () => {
    try {
      await axios.post('/researcher/propose-rules', newRules);
      alert('Rules submitted for admin approval');
      setNewRules({
        pH: { min: 0, max: 0 },
        moisture: { min: 0, max: 0 },
        nitrogen: { min: 0, max: 0 },
        phosphorus: { min: 0, max: 0 },
        potassium: { min: 0, max: 0 },
        cropRecommendation: '',
        fertilizerRecommendation: ''
      });
    } catch (err) {
      console.error('Failed to propose rules:', err);
      alert('Failed to submit rules');
    }
  };

  const updateRecommendation = async (id, updates) => {
    try {
      await axios.put(`/researcher/update-recommendation/${id}`, updates);
      fetchData();
      alert('Recommendation updated');
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update recommendation');
    }
  };

  const chartData = {
    labels: trends.map(item => item._id),
    datasets: [
      {
        label: 'Crop Recommendations',
        data: trends.map(item => item.count),
        backgroundColor: 'rgba(34,197,94,0.7)'
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
      <h2 className="text-3xl font-bold text-emerald-700">🔬 Researcher Dashboard</h2>

      {loading.data ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* ML Model Upload */}
          <section className="bg-white p-6 shadow rounded">
            <h3 className="text-xl font-semibold mb-4">🤖 Upload ML Model</h3>
            <form onSubmit={uploadModel} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select ML Model (.pkl file)
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pkl"
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </div>
              <button
                type="submit"
                disabled={!selectedFile || loading.uploading}
                className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300"
              >
                <FiUpload />
                {loading.uploading ? 'Uploading...' : 'Upload Model'}
              </button>
            </form>
          </section>

          {/* Rule Proposal */}
          <section className="bg-white p-6 shadow rounded">
            <h3 className="text-xl font-semibold mb-4">📝 Propose New Rules</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {['pH', 'moisture', 'nitrogen', 'phosphorus', 'potassium'].map(param => (
                <div key={param} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {param.toUpperCase()} Range
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name={`${param}.min`}
                      value={newRules[param].min}
                      onChange={handleRuleInputChange}
                      placeholder="Min"
                      className="w-full border rounded p-2"
                    />
                    <input
                      type="number"
                      name={`${param}.max`}
                      value={newRules[param].max}
                      onChange={handleRuleInputChange}
                      placeholder="Max"
                      className="w-full border rounded p-2"
                    />
                  </div>
                </div>
              ))}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Crop Recommendation
                </label>
                <input
                  type="text"
                  name="cropRecommendation"
                  value={newRules.cropRecommendation}
                  onChange={handleRuleInputChange}
                  className="w-full border rounded p-2"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Fertilizer Recommendation
                </label>
                <input
                  type="text"
                  name="fertilizerRecommendation"
                  value={newRules.fertilizerRecommendation}
                  onChange={handleRuleInputChange}
                  className="w-full border rounded p-2"
                />
              </div>
            </div>
            <button
              onClick={proposeNewRules}
              className="mt-4 flex items-center gap-2 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              <FiSave />
              Submit for Approval
            </button>
          </section>

          {/* Pending Recommendations */}
          {pendingRecs.length > 0 && (
            <section className="bg-white p-6 shadow rounded">
              <h3 className="text-xl font-semibold mb-4">🔄 Recommendations Needing Review</h3>
              <div className="space-y-4">
                {pendingRecs.map(rec => (
                  <div key={rec._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Soil Test #{rec.soilTest?._id?.slice(-6) || 'Unknown'}</h4>
                        <p className="text-sm text-gray-500">
                          Source: {rec.source} • Status: {rec.status}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-500">Current Crop Suggestion</label>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{rec.cropSuggestion}</p>
                          <button
                            onClick={() => {
                              const newCrop = prompt('Enter new crop suggestion', rec.cropSuggestion);
                              if (newCrop) {
                                updateRecommendation(rec._id, {
                                  cropSuggestion: newCrop,
                                  status: 'approved',
                                  source: 'modified'
                                });
                              }
                            }}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            <FiEdit2 />
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500">Current Fertilizer Suggestion</label>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{rec.fertilizerSuggestion}</p>
                          <button
                            onClick={() => {
                              const newFert = prompt('Enter new fertilizer suggestion', rec.fertilizerSuggestion);
                              if (newFert) {
                                updateRecommendation(rec._id, {
                                  fertilizerSuggestion: newFert,
                                  status: 'approved',
                                  source: 'modified'
                                });
                              }
                            }}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            <FiEdit2 />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => updateRecommendation(rec._id, { status: 'approved' })}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm"
                      >
                        Approve As Is
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

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