import React, { useEffect, useState } from 'react';

function SoilInsights() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/researcher/soil-insights', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || 'Unauthorized');
        }

        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error('[SoilInsights] Fetch failed:', err.message);
        setError(err.message || 'Something went wrong');
      }
    };

    fetchInsights();
  }, []);

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded shadow">
        ❌ {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white p-6 rounded shadow">
        ⏳ Loading soil insights...
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold text-green-700 mb-4">🌱 Soil Data Insights</h2>
      <ul className="space-y-2 text-gray-800">
        <li><strong>Average pH:</strong> {(data.avgPH || 0).toFixed(2)}</li>
        <li><strong>Average Moisture:</strong> {(data.avgMoisture || 0).toFixed(2)}%</li>
        <li><strong>Average Nitrogen:</strong> {(data.avgN || 0).toFixed(1)}</li>
        <li><strong>Average Phosphorus:</strong> {(data.avgP || 0).toFixed(1)}</li>
        <li><strong>Average Potassium:</strong> {(data.avgK || 0).toFixed(1)}</li>
        <li><strong>Total Tests:</strong> {data.totalTests || 0}</li>
      </ul>
    </div>
  );
}

export default SoilInsights;
