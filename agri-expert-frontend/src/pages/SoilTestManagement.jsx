import React, { useEffect, useState } from 'react';

function SoilTestManagement() {
  const [soilTests, setSoilTests] = useState([]);

  const fetchTests = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/admin/soil-tests', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setSoilTests(data);
  };

  useEffect(() => {
    fetchTests();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">🧪 Soil Tests</h2>
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">User</th>
            <th className="p-2 border">pH</th>
            <th className="p-2 border">Moisture</th>
            <th className="p-2 border">N</th>
            <th className="p-2 border">P</th>
            <th className="p-2 border">K</th>
          </tr>
        </thead>
        <tbody>
          {soilTests.map((test) => (
            <tr key={test._id} className="text-center">
              <td className="border p-2">{test.user?.name}</td>
              <td className="border p-2">{test.pH}</td>
              <td className="border p-2">{test.moisture}</td>
              <td className="border p-2">{test.nitrogen}</td>
              <td className="border p-2">{test.phosphorus}</td>
              <td className="border p-2">{test.potassium}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SoilTestManagement;
