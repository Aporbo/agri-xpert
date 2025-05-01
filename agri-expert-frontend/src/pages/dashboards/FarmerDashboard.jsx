import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import { generateAlertMessage } from '../../utils/alertUtil';
import cropImg from '../../assets/crop.jpg';
import fertilizerImg from '../../assets/fertilizer.jpg';
import irrigationImg from '../../assets/irrigation.jpg';
import weatherImg from '../../assets/weather.jpg';

const FarmerDashboard = () => {
  const [soilForm, setSoilForm] = useState({
    soilType: '',
    pH: '',
    moisture: '',
    nitrogen: '',
    phosphorus: '',
    potassium: ''
  });
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [message, setMessage] = useState('');
  const [alerts, setAlerts] = useState([]);
  const [irrigationPlans, setIrrigationPlans] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchWeather();
    fetchIrrigation();
  }, []);

  const fetchWeather = async () => {
    try {
      const res = await axios.get('/farmer/weather');
      setWeather(res.data);
    } catch {
      console.error('❌ Failed to load weather');
    }
  };

  const fetchIrrigation = async () => {
    try {
      const res = await axios.get('/researcher/irrigation');
      setIrrigationPlans(res.data);
    } catch {
      console.error('❌ Failed to load irrigation plans');
    }
  };

  const handleChange = (e) => {
    setSoilForm({ ...soilForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = {
      soilType: soilForm.soilType,
      pH: parseFloat(soilForm.pH),
      moisture: parseFloat(soilForm.moisture),
      nitrogen: parseFloat(soilForm.nitrogen),
      phosphorus: parseFloat(soilForm.phosphorus),
      potassium: parseFloat(soilForm.potassium)
    };

    try {
      const res = await axios.post('/farmer/soil-test', payload);
      setMessage(res.data.message);
      
      // Get recommendation - it might take some time to generate
      let recommendation;
      let attempts = 0;
      const maxAttempts = 5;
      
      while (attempts < maxAttempts) {
        try {
          const recRes = await axios.get(`/farmer/recommendation/${res.data.soilTest._id}`);
          recommendation = recRes.data;
          break;
        } catch (err) {
          if (attempts === maxAttempts - 1) throw err;
          attempts++;
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
        }
      }
      
      setSelectedRecommendation(recommendation);
      setAlerts(generateAlertMessage(payload, weather));
      setSoilForm({
        soilType: '', pH: '', moisture: '', nitrogen: '', phosphorus: '', potassium: ''
      });
    } catch (err) {
      setMessage('❌ Submission failed. Please try again.');
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-12">
      <h2 className="text-4xl font-extrabold text-green-700 mb-4">👨‍🌾 Welcome to Your Dashboard</h2>
      <p className="text-gray-600 text-lg mb-6">Submit tests, get recommendations and manage irrigation smarter with real-time insights.</p>

      {message && (
        <div className={`p-3 rounded shadow ${
          message.includes('❌') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`}>
          {message}
        </div>
      )}

      {/* Weather */}
      {weather && (
        <div className="flex flex-col md:flex-row items-center bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg shadow-md gap-4 animate-fade-in">
          <img src={weatherImg} alt="Weather" className="w-40 h-28 rounded object-cover" />
          <div>
            <h3 className="text-lg font-semibold text-blue-700 mb-2">🌤 Current Weather</h3>
            <ul className="text-sm text-gray-800 space-y-1">
              <li><b>Location:</b> {weather.location}</li>
              <li><b>Temp:</b> {weather.temperature}°C</li>
              <li><b>Humidity:</b> {weather.humidity}%</li>
              <li><b>Rainfall:</b> {weather.precipitation} mm</li>
              <li><b>Wind:</b> {weather.windSpeed} m/s</li>
            </ul>
          </div>
        </div>
      )}

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-600 p-4 rounded-lg text-sm text-yellow-800 shadow animate-fade-in">
          {alerts.map((msg, i) => <p key={i}>🔔 {msg}</p>)}
        </div>
      )}

      {/* Soil Test Form */}
      <div className="bg-white shadow-md rounded-lg p-6 animate-fade-in">
        <h3 className="text-xl font-bold text-green-700 mb-4">🧪 Submit New Soil Test</h3>
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
          <select
            name="soilType"
            value={soilForm.soilType}
            onChange={handleChange}
            className="border p-2 rounded text-sm"
            required
          >
            <option value="">🌍 Select Soil Type</option>
            <option value="loamy">Loamy</option>
            <option value="clayey">Clayey</option>
            <option value="sandy">Sandy</option>
            <option value="peaty">Peaty</option>
            <option value="saline">Saline</option>
          </select>
          {['pH', 'moisture', 'nitrogen', 'phosphorus', 'potassium'].map((field, i) => (
            <input
              key={i}
              name={field}
              placeholder={field.toUpperCase()}
              value={soilForm[field]}
              onChange={handleChange}
              type="number"
              step="any"
              className="border p-2 rounded text-sm"
              required
            />
          ))}
          <div className="col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 rounded transition ${
                isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isSubmitting ? 'Processing...' : '🚀 Submit Soil Test'}
            </button>
          </div>
        </form>
      </div>

      {/* Recommendations */}
      {selectedRecommendation && (
        <div className="bg-white shadow-md rounded-lg p-6 animate-fade-in space-y-6">
          <h3 className="text-xl font-bold text-indigo-700">📋 Your AI-Powered Recommendation</h3>
          {selectedRecommendation.status === 'pending' && (
            <div className="bg-yellow-100 text-yellow-800 p-3 rounded text-sm mb-4">
              ⏳ Your recommendation is being reviewed by our experts. This might take some time.
            </div>
          )}

          <div className="flex gap-4 items-center">
            <img src={cropImg} alt="Crop" className="w-32 h-24 rounded object-cover" />
            <div>
              <p><strong>Suggested Crop:</strong> {selectedRecommendation.cropSuggestion}</p>
              <p className="text-xs text-gray-500 mt-1">
                Source: {selectedRecommendation.source}
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <img src={fertilizerImg} alt="Fertilizer" className="w-32 h-24 rounded object-cover" />
            <div>
              <p><strong>Fertilizer Plan:</strong> {selectedRecommendation.fertilizerSuggestion}</p>
              <p className="text-xs text-gray-500 mt-1">
                Status: {selectedRecommendation.status}
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <img src={irrigationImg} alt="Irrigation" className="w-32 h-24 rounded object-cover" />
            <p><strong>Irrigation Tip:</strong> Monitor moisture weekly. Use drip below 30%.</p>
          </div>

          <button
            onClick={() => window.open(`/api/farmer/download/${selectedRecommendation.soilTest}`, '_blank')}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            📥 Download PDF
          </button>
        </div>
      )}

      {/* Irrigation Tips */}
      <div className="bg-white shadow-md rounded-lg p-6 animate-fade-in">
        <h3 className="text-lg font-bold text-blue-700 mb-3">💧 Smart Irrigation Plans</h3>
        {irrigationPlans.length === 0 ? (
          <p className="text-gray-500">No irrigation plans available at the moment.</p>
        ) : (
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-800">
            {irrigationPlans.map(plan => (
              <li key={plan._id}>{plan.irrigationAdvice}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Farming Tips */}
      <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg shadow-md space-y-2 animate-fade-in">
        <h3 className="text-lg font-bold text-green-800">🌾 Pro Tip of the Day</h3>
        <p className="text-sm text-green-700">
          Rotate crops every season to naturally enrich soil nutrients and prevent pests.
        </p>
        <p className="text-sm text-green-700">
          Rainwater harvesting can reduce irrigation dependency by up to 30%.
        </p>
      </div>
    </div>
  );
};

export default FarmerDashboard;