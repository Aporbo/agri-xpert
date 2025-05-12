import React from 'react';

function SoilSummaryCard({ soilSummary }) {
  if (!soilSummary || !soilSummary.avgMoisture) {
    return (
      <div className="bg-white p-4 rounded shadow text-center">
        <h3 className="text-lg font-bold mb-2">📊 Soil Summary</h3>
        <p className="text-gray-500">No data yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded shadow text-center">
      <h3 className="text-lg font-bold mb-2 text-green-600">📊 Soil Summary</h3>
      <p><strong>Average Moisture:</strong> {soilSummary.avgMoisture.toFixed(1)}%</p>
    </div>
  );
}

export default SoilSummaryCard;
