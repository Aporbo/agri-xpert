import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';

const GovtDashboard = () => {
  const [soilTests, setSoilTests] = useState([]);
  const [reports, setReports] = useState([]);
  const [message, setMessage] = useState('');

  const fetchSoilTests = async () => {
    try {
      const res = await axios.get('/admin/soiltests');
      setSoilTests(res.data);
    } catch {
      setMessage('Failed to load soil tests');
    }
  };

  const fetchReports = async () => {
    try {
      const res = await axios.get('/govt/reports');
      setReports(res.data);
    } catch {
      setMessage('Failed to load reports');
    }
  };

  const generateReport = async (soilTestId) => {
    try {
      const res = await axios.post(`/govt/generate-report/${soilTestId}`);
      setMessage(res.data.message);
      fetchReports(); // refresh list
    } catch {
      setMessage('Report generation failed');
    }
  };

  useEffect(() => {
    fetchSoilTests();
    fetchReports();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10">
      <h2 className="text-3xl font-bold text-purple-700">🏛 Government Dashboard</h2>
      {message && <p className="text-green-700">{message}</p>}

      {/* Generate Report */}
      <section className="bg-white shadow p-6 rounded">
        <h3 className="text-xl font-semibold mb-4">📄 Generate Report from Soil Test</h3>
        {soilTests.length === 0 ? (
          <p className="text-gray-500">No soil tests available.</p>
        ) : (
          <ul className="space-y-4">
            {soilTests.map(test => (
              <li key={test._id} className="border-b pb-3 flex justify-between items-center">
                <div className="text-sm text-gray-700">
                  <p><strong>{test.soilType}</strong> — pH: {test.pH}, Moisture: {test.moisture}</p>
                  <p className="text-xs text-gray-500">User: {test.user?.name}</p>
                </div>
                <button
                  onClick={() => generateReport(test._id)}
                  className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                >
                  Generate PDF
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* View Reports */}
      <section className="bg-white shadow p-6 rounded">
        <h3 className="text-xl font-semibold mb-4">📥 Download Reports</h3>
        {reports.length === 0 ? (
          <p className="text-gray-500">No reports generated yet.</p>
        ) : (
          <ul className="space-y-3">
            {reports.map(report => (
              <li key={report._id} className="border-b pb-2 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-700">Created: {new Date(report.createdOn).toLocaleString()}</p>
                  <p className="text-xs text-gray-500">By: {report.createdBy?.name || 'Govt Official'}</p>
                </div>
                <a
                  href={`http://localhost:5000${report.reportUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Download PDF
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default GovtDashboard;
