import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

function SoilTrendChart({ data }) {
  const formattedData = data.map((test) => ({
    date: new Date(test.createdAt).toLocaleDateString('en-GB'),
    pH: test.pH,
    moisture: test.moisture,
    nitrogen: test.nitrogen,
    phosphorus: test.phosphorus,
    potassium: test.potassium,
  }));

  return (
    <div className="bg-white p-6 rounded shadow mt-6">
      <h2 className="text-xl font-bold text-green-700 mb-4">
        📊 Soil Parameters Over Time
      </h2>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={formattedData} margin={{ top: 20, right: 40, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" angle={-30} textAnchor="end" height={60} />
          <YAxis />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />

          <Line type="monotone" dataKey="pH" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="moisture" stroke="#059669" strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="nitrogen" stroke="#d97706" strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="phosphorus" stroke="#b91c1c" strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="potassium" stroke="#6d28d9" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SoilTrendChart;
