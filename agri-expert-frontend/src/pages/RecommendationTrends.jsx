import React, { useEffect, useState } from 'react';

const RecommendationTrends = () => {
  const [trends, setTrends] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/researcher/recommendation-trends')
      .then(res => res.json())
      .then(data => setTrends(data))
      .catch(err => console.error('Failed to fetch recommendation trends:', err));
  }, []);

  if (!trends) return <div>Loading trends...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">📈 Recommendation Trends</h2>
      <ul className="space-y-2">
        {trends.map((trend, i) => (
          <li key={i} className="bg-white p-4 rounded shadow">
            <p><strong>Crop:</strong> {trend.crop} — <strong>Used:</strong> {trend.count} times</p>
            <p><strong>Fertilizer:</strong> {trend.fertilizer}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecommendationTrends;
