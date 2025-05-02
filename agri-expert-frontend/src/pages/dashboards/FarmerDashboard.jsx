import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import { generateAlertMessage } from '../../utils/alertUtil';
import { Link } from 'react-router-dom';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

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
      const res = await axios.get('/farmer/irrigation');
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

      const recRes = await axios.get(`/farmer/recommendation/${res.data.soilTest._id}`);
      setSelectedRecommendation(recRes.data);
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
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Sidebar */}
      <aside className="bg-green-700 text-white w-full md:w-64 p-6 space-y-6 shadow-lg">
        <div>
          <h2 className="text-2xl font-bold">👨‍🌾 {user?.name || 'Farmer'}</h2>
          <p className="text-sm text-green-200">{user?.email}</p>
        </div>

        <nav className="flex flex-col gap-3">
          <Link to="/farmer" className="hover:bg-green-800 p-2 rounded">🏠 Dashboard</Link>
          <Link to="/farmer/history" className="hover:bg-green-800 p-2 rounded">📜 Soil Test History</Link>
          <Link to="/farmer/profile" className="hover:bg-green-800 p-2 rounded">🧾 My Profile</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 space-y-10">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-green-800">Farmer Dashboard</h1>
          <Link
            to="/farmer/history"
            className="text-sm bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            View History
          </Link>
        </header>

        {message && (
          <div className={`p-3 rounded shadow-md ${message.includes('❌') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
            {message}
          </div>
        )}

        {/* Weather */}
        {weather && (
          <section className="bg-white shadow rounded p-6 flex flex-col md:flex-row gap-4 items-center">
            <img src={weatherImg} alt="Weather" className="w-32 h-24 rounded" />
            <div>
              <h3 className="text-lg font-semibold text-blue-600">🌤 Weather Now</h3>
              <p className="text-sm">📍 {weather.location}</p>
              <p className="text-sm">🌡 Temp: {weather.temperature}°C, 💧 Humidity: {weather.humidity}%, 🌧 Rain: {weather.precipitation}mm</p>
            </div>
          </section>
        )}

        {/* Soil Test Form */}
        <section className="bg-white shadow rounded p-6 space-y-4">
          <h3 className="text-xl font-bold text-green-700">🧪 New Soil Test</h3>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <select name="soilType" value={soilForm.soilType} onChange={handleChange} required className="p-2 border rounded">
              <option value="">Select Soil Type</option>
              <option value="loamy">Loamy</option>
              <option value="clayey">Clayey</option>
              <option value="sandy">Sandy</option>
              <option value="peaty">Peaty</option>
              <option value="saline">Saline</option>
            </select>
            {['pH', 'moisture', 'nitrogen', 'phosphorus', 'potassium'].map(field => (
              <input
                key={field}
                name={field}
                placeholder={field.toUpperCase()}
                value={soilForm[field]}
                onChange={handleChange}
                type="number"
                step="any"
                className="p-2 border rounded"
                required
              />
            ))}
            <div className="col-span-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 rounded ${isSubmitting ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700 text-white'}`}
              >
                {isSubmitting ? 'Processing...' : '🚀 Submit Soil Test'}
              </button>
            </div>
          </form>
        </section>

        {/* Alerts */}
        {alerts.length > 0 && (
          <section className="bg-yellow-100 p-4 rounded border-l-4 border-yellow-600">
            {alerts.map((a, idx) => (
              <p key={idx} className="text-yellow-800 text-sm">🔔 {a}</p>
            ))}
          </section>
        )}

        {/* Recommendation */}
        {selectedRecommendation && (
          <section className="bg-white p-6 rounded shadow space-y-4">
            <h3 className="text-xl font-bold text-indigo-700">📋 Your Recommendation</h3>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center">
                <img src={cropImg} className="w-28 h-20 object-cover rounded" alt="crop" />
                <p className="mt-2 text-sm"><strong>Crop:</strong> {selectedRecommendation.cropSuggestion || 'N/A'}</p>
              </div>
              <div className="flex flex-col items-center">
                <img src={fertilizerImg} className="w-28 h-20 object-cover rounded" alt="fertilizer" />
                <p className="mt-2 text-sm"><strong>Fertilizer:</strong> {selectedRecommendation.fertilizerSuggestion || 'N/A'}</p>
              </div>
              <div className="flex flex-col items-center">
                <img src={irrigationImg} className="w-28 h-20 object-cover rounded" alt="irrigation" />
                <p className="mt-2 text-sm"><strong>Irrigation:</strong> {selectedRecommendation.irrigationRecommendation || 'N/A'}</p>
              </div>
            </div>

            <button
              onClick={() => window.open(`/api/farmer/download/${selectedRecommendation.soilTest}`, '_blank')}
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            >
              📥 Download PDF Report
            </button>
          </section>
        )}


        {/* Pro Tip */}
        <section className="bg-green-50 border-l-4 border-green-500 p-4 rounded shadow">
          <h3 className="text-lg font-bold text-green-800">🌾 Farmer Tip of the Day</h3>
          <p className="text-sm text-green-700">Rotate crops every season to improve soil health and reduce pests naturally.</p>
          <p className="text-sm text-green-700 mt-1">Use organic compost to enhance soil fertility and moisture retention.</p>
        </section>
      </main>
    </div>
  );
};

export default FarmerDashboard;