import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import SoilTrendChart from '../components/SoilTrendChart';
import { FiDownload, FiInfo, FiClock, FiDroplet, FiSun, FiBarChart2 } from 'react-icons/fi';
import { FaLeaf, FaSeedling } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const FarmerHistory = () => {
  const [soilTests, setSoilTests] = useState([]);
  const [recommendations, setRecommendations] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [expandedTest, setExpandedTest] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchSoilTests();
  }, []);

  const fetchSoilTests = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/farmer/my-tests');
      setSoilTests(res.data);

      // Fetch recommendation for each test
      const recs = {};
      for (const test of res.data) {
        try {
          const recRes = await axios.get(`/farmer/recommendation/${test._id}`);
          recs[test._id] = recRes.data;
        } catch {
          recs[test._id] = null;
        }
      }
      setRecommendations(recs);
    } catch (err) {
      console.error('Failed to fetch history', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTests = soilTests.filter(test => {
    if (activeTab === 'all') return true;
    if (activeTab === 'withRec') return recommendations[test._id];
    if (activeTab === 'withoutRec') return !recommendations[test._id];
    return true;
  });

  const toggleExpandTest = (testId) => {
    setExpandedTest(expandedTest === testId ? null : testId);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Sidebar - Matching the dashboard */}
      <aside className="bg-green-700 text-white w-full md:w-64 p-6 space-y-6 shadow-lg">
        <div>
          <h2 className="text-2xl font-bold">👨‍🌾 {user?.name || 'Farmer'}</h2>
          <p className="text-sm text-green-200">{user?.email}</p>
        </div>

        <nav className="flex flex-col gap-3">
          <Link to="/farmer" className="hover:bg-green-800 p-2 rounded">🏠 Dashboard</Link>
          <Link to="/farmer/history" className="hover:bg-green-800 p-2 rounded bg-green-800">📜 Soil Test History</Link>
          <Link to="/farmer/profile" className="hover:bg-green-800 p-2 rounded">🧾 My Profile</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 space-y-8">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-green-800">Soil Test History</h1>
          <Link
            to="/farmer"
            className="text-sm bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Back to Dashboard
          </Link>
        </header>

        {/* Filter Tabs */}
        <div className="flex gap-2 bg-white p-1 rounded-lg shadow-sm border border-gray-200 w-full md:w-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 rounded-md text-sm ${activeTab === 'all' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            All Tests
          </button>
          <button
            onClick={() => setActiveTab('withRec')}
            className={`px-3 py-1 rounded-md text-sm ${activeTab === 'withRec' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            With Recommendations
          </button>
          <button
            onClick={() => setActiveTab('withoutRec')}
            className={`px-3 py-1 rounded-md text-sm ${activeTab === 'withoutRec' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Pending Analysis
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : filteredTests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <FiInfo className="text-green-600 text-2xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-1">
              {activeTab === 'all' ? 'No soil tests submitted yet' : 
              activeTab === 'withRec' ? 'No tests with recommendations' : 
              'No tests pending analysis'}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {activeTab === 'all' ? 'Submit your first soil test to get started with soil health analysis' : 
              activeTab === 'withRec' ? 'Recommendations will appear here once your tests are analyzed' : 
              'All your tests have been analyzed'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-6">
              {filteredTests.map(test => (
                <div 
                  key={test._id} 
                  className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 transition-all hover:shadow-lg"
                >
                  <div 
                    className="p-4 cursor-pointer"
                    onClick={() => toggleExpandTest(test._id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                          <FiDroplet className="text-blue-500" />
                          Soil Test - {test.soilType}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                          <FiClock className="text-gray-400" />
                          {formatDate(test.createdAt)}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        recommendations[test._id] ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {recommendations[test._id] ? 'Analyzed' : 'Pending'}
                      </span>
                    </div>

                    {expandedTest === test._id && (
                      <div className="mt-4 space-y-3 animate-fadeIn">
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="bg-blue-50 p-2 rounded">
                            <p className="text-xs text-blue-600">pH</p>
                            <p className="font-bold">{test.pH}</p>
                          </div>
                          <div className="bg-green-50 p-2 rounded">
                            <p className="text-xs text-green-600">Moisture</p>
                            <p className="font-bold">{test.moisture}%</p>
                          </div>
                          <div className="bg-purple-50 p-2 rounded">
                            <p className="text-xs text-purple-600">N-P-K</p>
                            <p className="font-bold">{test.nitrogen}-{test.phosphorus}-{test.potassium}</p>
                          </div>
                        </div>

                        {recommendations[test._id] ? (
                          <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                            <h5 className="font-semibold text-green-700 flex items-center gap-2">
                              <FaLeaf className="text-green-600" />
                              Recommendation
                            </h5>
                            <div className="mt-2 grid grid-cols-2 gap-2">
                              <div className="bg-white p-2 rounded border border-green-100">
                                <p className="text-xs text-gray-500">Best Crop</p>
                                <p className="font-medium">{recommendations[test._id].cropSuggestion}</p>
                              </div>
                              <div className="bg-white p-2 rounded border border-green-100">
                                <p className="text-xs text-gray-500">Fertilizer</p>
                                <p className="font-medium">{recommendations[test._id].fertilizerSuggestion}</p>
                              </div>
                            </div>
                            <button
                              className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`/api/farmer/download/${test._id}`, '_blank');
                              }}
                            >
                              <FiDownload />
                              Download Full Report
                            </button>
                          </div>
                        ) : (
                          <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                            <p className="text-yellow-700 flex items-center justify-center gap-2">
                              <FiClock />
                              Analysis in progress...
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {soilTests.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <FiBarChart2 className="text-green-600" />
                    Soil Trends Overview
                  </h3>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-sm bg-gray-100 rounded-md hover:bg-gray-200">
                      pH Levels
                    </button>
                    <button className="px-3 py-1 text-sm bg-gray-100 rounded-md hover:bg-gray-200">
                      Nutrients
                    </button>
                    <button className="px-3 py-1 text-sm bg-gray-100 rounded-md hover:bg-gray-200">
                      Moisture
                    </button>
                  </div>
                </div>
                <SoilTrendChart soilTests={soilTests} />
                <div className="mt-4 text-sm text-gray-500 flex items-center gap-2">
                  <FiInfo className="text-gray-400" />
                  Hover over the chart to see detailed values for each test
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default FarmerHistory;