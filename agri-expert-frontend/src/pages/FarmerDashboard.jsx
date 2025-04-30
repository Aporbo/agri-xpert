import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WeatherCard from '../components/WeatherCard';
import toast, { Toaster } from 'react-hot-toast';
import SoilTrendChart from '../components/SoilTrendChart';
import RecommendationCard from '../components/RecommendationCard';

function FarmerDashboard() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [soilData, setSoilData] = useState({
    pH: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    moisture: '',
    soilType: '',
  });

  const [mySoilTests, setMySoilTests] = useState([]);
  const [recommendations, setRecommendations] = useState({});

  useEffect(() => {
    fetchWeather();
    fetchSoilTests();
  }, []);

  const fetchWeather = async () => {
    try {
      const apiKey = 'eab1f8978689e6242b0b3887e9d3b217';
      const city = 'Dhaka';

      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
      );
      const data = await res.json();

      const groupedForecast = data.list.reduce((acc, curr) => {
        const date = curr.dt_txt.split(' ')[0];
        if (!acc[date]) acc[date] = [];
        acc[date].push(curr);
        return acc;
      }, {});

      const dailyAverages = Object.entries(groupedForecast).slice(0, 5).map(([date, values]) => {
        const avgTemp = values.reduce((sum, v) => sum + v.main.temp, 0) / values.length;
        const humidity = values.reduce((sum, v) => sum + v.main.humidity, 0) / values.length;
        return {
          date,
          temp: avgTemp.toFixed(1),
          humidity: humidity.toFixed(0),
          description: values[0].weather[0].description,
        };
      });

      setForecast(dailyAverages);
      setWeather({
        temp: data.list[0].main.temp,
        humidity: data.list[0].main.humidity,
        description: data.list[0].weather[0].description,
        city: data.city.name,
      });
    } catch (error) {
      console.error('Weather fetch failed:', error);
    }
  };

  const fetchSoilTests = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/farmer/my-tests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMySoilTests(data);
    } catch (err) {
      console.error('Error fetching soil tests:', err);
    }
  };

  const handleChange = (e) => {
    setSoilData({ ...soilData, [e.target.name]: e.target.value });
  };

  const handleSoilSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/farmer/soil-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(soilData),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error('Server error:', data);
        throw new Error(data.message || 'Submission failed');
      }

      toast.success('Soil test submitted ✅');
      setSoilData({
        pH: '',
        nitrogen: '',
        phosphorus: '',
        potassium: '',
        moisture: '',
        soilType: '',
      });
      await fetchSoilTests();
    } catch (err) {
      toast.error('Failed to submit soil data');
      console.error('Submit error:', err);
    }
  };

  const generateRecommendation = async (soilTestId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/farmer/recommendation/${soilTestId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setRecommendations((prev) => ({
        ...prev,
        [soilTestId]: data,
      }));
      toast.success('Recommendation ready!');
    } catch (err) {
      toast.error('Failed to generate recommendation');
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow p-6 bg-gray-100">
        <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">
          Farmer Dashboard
        </h1>
        <Toaster />

        {/* Weather + Forecast Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <WeatherCard weather={weather} forecast={forecast} />
        </div>

        {/* Soil Test Form */}
        <div className="bg-white p-6 rounded shadow mt-6">
          <h2 className="text-xl font-bold text-green-700 mb-4">🧪 Submit Soil Test</h2>
          <form onSubmit={handleSoilSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="number" name="pH" value={soilData.pH} onChange={handleChange} placeholder="pH Level (4.5–8.5)" className="border p-2 rounded" required />
            <input type="number" name="moisture" value={soilData.moisture} onChange={handleChange} placeholder="Moisture (%)" className="border p-2 rounded" required />
            <input type="number" name="nitrogen" value={soilData.nitrogen} onChange={handleChange} placeholder="Nitrogen (N)" className="border p-2 rounded" required />
            <input type="number" name="phosphorus" value={soilData.phosphorus} onChange={handleChange} placeholder="Phosphorus (P)" className="border p-2 rounded" required />
            <input type="number" name="potassium" value={soilData.potassium} onChange={handleChange} placeholder="Potassium (K)" className="border p-2 rounded" required />
            <select name="soilType" value={soilData.soilType} onChange={handleChange} className="border p-2 rounded" required>
              <option value="">Select Soil Type</option>
              <option value="Loamy">Loamy</option>
              <option value="Sandy">Sandy</option>
              <option value="Clayey">Clayey</option>
              <option value="Silty">Silty</option>
              <option value="Peaty">Peaty</option>
              <option value="Chalky">Chalky</option>
              <option value="Saline">Saline</option>
            </select>
            <button type="submit" className="col-span-1 md:col-span-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded">Submit Test</button>
          </form>
        </div>

        {/* Soil Chart */}
        <SoilTrendChart data={mySoilTests} />

        {/* Soil Test History + Smart Recommendations */}
        <div className="bg-white p-6 rounded shadow mt-6">
          <h2 className="text-xl font-bold text-green-700 mb-4">📜 Soil Test History</h2>
          {mySoilTests.length === 0 ? (
            <p className="text-gray-500">No tests yet.</p>
          ) : (
            <table className="w-full table-auto border">
              <thead className="bg-green-100">
                <tr>
                  <th className="p-2 border">pH</th>
                  <th className="p-2 border">Moisture</th>
                  <th className="p-2 border">N</th>
                  <th className="p-2 border">P</th>
                  <th className="p-2 border">K</th>
                  <th className="p-2 border">Soil</th>
                  <th className="p-2 border">Date</th>
                  <th className="p-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {mySoilTests.map((test) => (
                  <React.Fragment key={test._id}>
                    <tr className="text-center">
                      <td className="border p-2">{test.pH}</td>
                      <td className="border p-2">{test.moisture}</td>
                      <td className="border p-2">{test.nitrogen}</td>
                      <td className="border p-2">{test.phosphorus}</td>
                      <td className="border p-2">{test.potassium}</td>
                      <td className="border p-2">{test.soilType}</td>
                      <td className="border p-2">{new Date(test.createdAt).toLocaleDateString()}</td>
                      <td className="border p-2">
                        <button
                          onClick={() => generateRecommendation(test._id)}
                          className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                        >
                          Recommend
                        </button>
                      </td>
                    </tr>
                    {recommendations[test._id] && (
                      <tr className="bg-green-50">
                        <td colSpan="8" className="p-4">
                          <RecommendationCard recommendation={recommendations[test._id]} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default FarmerDashboard;
