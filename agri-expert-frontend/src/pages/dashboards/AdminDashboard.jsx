import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import {
  FiUsers, FiDatabase, FiSettings, FiHome, FiBarChart2,
  FiTrash2, FiPlus, FiClock, FiCheck, FiX
} from 'react-icons/fi';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [soilTests, setSoilTests] = useState([]);
  const [rules, setRules] = useState({});
  const [allRules, setAllRules] = useState([]); // ✅ NEW
  const [stats, setStats] = useState(null);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeRecommendation, setActiveRecommendation] = useState(null);
  const [pendingRules, setPendingRules] = useState([]);
  const [pendingRecommendations, setPendingRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState({
    users: false,
    soilTests: false,
    rules: false,
    stats: false,
    pendingRules: false,
    pendingRecs: false
  });

  // 🔄 Tab-based fetching
  useEffect(() => {
    if (activeTab === 'dashboard') fetchStats();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'soiltests') fetchSoilTests();
    if (activeTab === 'rules') fetchRules();
    if (activeTab === 'pending-rules') fetchPendingRules();
    if (activeTab === 'pending-recs') fetchPendingRecommendations();
  }, [activeTab]);

  // ✅ USERS
  const fetchUsers = async () => {
    setIsLoading(prev => ({ ...prev, users: true }));
    try {
      const res = await axios.get('/admin/users');
      setUsers(res.data);
    } catch {
      setMessage('Failed to fetch users');
    } finally {
      setIsLoading(prev => ({ ...prev, users: false }));
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`/admin/users/${id}`);
      fetchUsers();
      setMessage('User deleted successfully');
    } catch {
      setMessage('Failed to delete user');
    }
  };

  const addUser = async (e) => {
    e.preventDefault();
    const form = e.target;
    const newUser = {
      name: form.name.value,
      email: form.email.value,
      password: form.password.value,
      role: form.role.value
    };
    try {
      await axios.post('/admin/users', newUser);
      fetchUsers();
      form.reset();
      setMessage('User added successfully');
    } catch {
      setMessage('Failed to add user');
    }
  };

  // ✅ SOIL TESTS
  const fetchSoilTests = async () => {
    setIsLoading(prev => ({ ...prev, soilTests: true }));
    try {
      const res = await axios.get('/admin/soiltests');
      setSoilTests(res.data);
    } catch {
      setMessage('Failed to fetch soil tests');
    } finally {
      setIsLoading(prev => ({ ...prev, soilTests: false }));
    }
  };

  const deleteSoilTest = async (id) => {
    if (!window.confirm('Are you sure you want to delete this soil test?')) return;
    try {
      await axios.delete(`/admin/soiltests/${id}`);
      fetchSoilTests();
      setMessage('Soil test deleted successfully');
    } catch {
      setMessage('Failed to delete soil test');
    }
  };

  // ✅ RULES
  const fetchRules = async () => {
    setIsLoading(prev => ({ ...prev, rules: true }));
    try {
      const res = await axios.get('/admin/rules');
      const data = Array.isArray(res.data) ? res.data : [res.data];
      setAllRules(data);
      setRules({});
    } catch {
      setMessage('Failed to fetch rules');
    } finally {
      setIsLoading(prev => ({ ...prev, rules: false }));
    }
  };

  const handleRuleChange = (e) => {
    const { name, value } = e.target;
    const parts = name.split('.');
    if (parts.length === 2) {
      setRules(prev => ({
        ...prev,
        [parts[0]]: {
          ...prev[parts[0]],
          [parts[1]]: value
        }
      }));
    } else {
      setRules(prev => ({ ...prev, [name]: value }));
    }
  };

  const saveRules = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/admin/rules', rules);
      setMessage('✅ Rule added successfully');
      setRules({});
      fetchRules(); // reload
    } catch {
      setMessage('❌ Failed to add rule');
    }
  };

  const deleteRule = async (ruleId) => {
    if (!window.confirm('Delete this rule?')) return;
    try {
      await axios.delete(`/admin/rules/${ruleId}`);
      setAllRules(prev => prev.filter(r => r._id !== ruleId));
      setMessage('🗑 Rule deleted');
    } catch {
      setMessage('❌ Failed to delete rule');
    }
  };

  // ✅ DASHBOARD STATS
  const fetchStats = async () => {
    setIsLoading(prev => ({ ...prev, stats: true }));
    try {
      const res = await axios.get('/admin/stats');
      setStats(res.data);
    } catch {
      setMessage('Failed to fetch summary stats');
    } finally {
      setIsLoading(prev => ({ ...prev, stats: false }));
    }
  };

  // ✅ PENDING
  const fetchPendingRules = async () => {
    setIsLoading(prev => ({ ...prev, pendingRules: true }));
    try {
      const res = await axios.get('/admin/pending-rules');
      setPendingRules(res.data);
    } catch {
      setMessage('Failed to fetch pending rules');
    } finally {
      setIsLoading(prev => ({ ...prev, pendingRules: false }));
    }
  };

  const fetchPendingRecommendations = async () => {
    setIsLoading(prev => ({ ...prev, pendingRecs: true }));
    try {
      const res = await axios.get('/admin/pending-recommendations');
      setPendingRecommendations(res.data);
    } catch {
      setMessage('Failed to fetch pending recommendations');
    } finally {
      setIsLoading(prev => ({ ...prev, pendingRecs: false }));
    }
  };

  const viewRecommendation = async (soilTestId) => {
    try {
      const res = await axios.get(`/farmer/recommendation/${soilTestId}`);
      setActiveRecommendation({ ...res.data, soilTestId });
    } catch {
      setActiveRecommendation({ error: true, soilTestId });
    }
  };

  const reviewRuleProposal = async (id, action) => {
    try {
      await axios.put(`/admin/review-rule/${id}`, { action });
      fetchPendingRules();
      setMessage(`Rule proposal ${action === 'approve' ? 'approved' : 'rejected'}`);
    } catch {
      setMessage('Failed to process rule proposal');
    }
  };

  const approveRecommendation = async (id) => {
    try {
      await axios.put(`/admin/approve-recommendation/${id}`);
      fetchPendingRecommendations();
      setMessage('Recommendation approved');
    } catch {
      setMessage('Failed to approve recommendation');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-600">AgriExpert Admin</h1>
        </div>
        <nav className="p-4 space-y-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center w-full p-2 rounded-lg ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
          >
            <FiHome className="mr-3" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center w-full p-2 rounded-lg ${activeTab === 'users' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
          >
            <FiUsers className="mr-3" />
            User Management
          </button>
          <button
            onClick={() => setActiveTab('soiltests')}
            className={`flex items-center w-full p-2 rounded-lg ${activeTab === 'soiltests' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
          >
            <FiDatabase className="mr-3" />
            Soil Tests
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`flex items-center w-full p-2 rounded-lg ${activeTab === 'rules' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
          >
            <FiSettings className="mr-3" />
            Soil Rules
          </button>
          <button
            onClick={() => setActiveTab('pending-rules')}
            className={`flex items-center w-full p-2 rounded-lg ${activeTab === 'pending-rules' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
          >
            <FiClock className="mr-3" />
            Pending Rules
          </button>
          <button
            onClick={() => setActiveTab('pending-recs')}
            className={`flex items-center w-full p-2 rounded-lg ${activeTab === 'pending-recs' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
          >
            <FiClock className="mr-3" />
            Pending Recs
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'users' && 'User Management'}
              {activeTab === 'soiltests' && 'Soil Tests'}
              {activeTab === 'rules' && 'Soil Rule Settings'}
              {activeTab === 'pending-rules' && 'Pending Rule Proposals'}
              {activeTab === 'pending-recs' && 'Pending Recommendations'}
            </h2>
            {message && (
              <div className={`px-4 py-2 rounded ${message.includes('Failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {message}
              </div>
            )}
          </div>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {isLoading.stats ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                stats && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                      <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                          <FiUsers size={24} />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-500">Total Users</h3>
                          <p className="text-3xl font-bold">{stats.users.total}</p>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-blue-50 p-2 rounded">
                          <p className="text-blue-600">Farmers</p>
                          <p className="font-medium">{stats.users.farmers}</p>
                        </div>
                        <div className="bg-purple-50 p-2 rounded">
                          <p className="text-purple-600">Researchers</p>
                          <p className="font-medium">{stats.users.researchers}</p>
                        </div>
                        <div className="bg-green-50 p-2 rounded">
                          <p className="text-green-600">Govt Officials</p>
                          <p className="font-medium">{stats.users.govt}</p>
                        </div>
                        <div className="bg-orange-50 p-2 rounded">
                          <p className="text-orange-600">Admins</p>
                          <p className="font-medium">{stats.users.admins}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                      <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-600">
                          <FiDatabase size={24} />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-500">Soil Tests</h3>
                          <p className="text-3xl font-bold">{stats.tests}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                      <div className="flex items-center">
                        <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                          <FiBarChart2 size={24} />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-500">Recommendations</h3>
                          <p className="text-3xl font-bold">{stats.recommendations}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {stats.pendingRecs} pending review
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Add New User</h3>
                <form onSubmit={addUser} className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-3">
                  <input
                    name="name"
                    placeholder="Full Name"
                    required
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <select
                    name="role"
                    required
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Role</option>
                    <option value="FARMER">Farmer</option>
                    <option value="RESEARCHER">Researcher</option>
                    <option value="GOVT_OFFICIAL">Government Official</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    <FiPlus /> Add User
                  </button>
                </form>
              </div>

              <div className="divide-y divide-gray-200">
                {isLoading.users ? (
                  <div className="flex justify-center items-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : users.length > 0 ? (
                  users.map(user => (
                    <div key={user._id} className="p-4 hover:bg-gray-50 flex justify-between items-center">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                          user.role === 'FARMER' ? 'bg-green-100 text-green-800' :
                          user.role === 'RESEARCHER' ? 'bg-blue-100 text-blue-800' :
                          user.role === 'GOVT_OFFICIAL' ? 'bg-purple-100 text-purple-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {user.role.replace('_', ' ')}
                        </span>
                      </div>
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50"
                        title="Delete User"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    No users found
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Soil Tests Tab */}
          {activeTab === 'soiltests' && (
            <div className="space-y-6">
              {isLoading.soilTests ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : soilTests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {soilTests.map(test => (
                    <div key={test._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">Soil Test #{test._id.slice(-6)}</h4>
                          <p className="text-sm text-gray-500">By {test.user?.name || 'Unknown'}</p>
                        </div>
                        <button
                          onClick={() => deleteSoilTest(test._id)}
                          className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                          title="Delete Test"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Soil Type</p>
                          <p className="font-medium">{test.soilType}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">pH Level</p>
                          <p className="font-medium">{test.pH}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Moisture</p>
                          <p className="font-medium">{test.moisture}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Nitrogen (N)</p>
                          <p className="font-medium">{test.nitrogen}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phosphorus (P)</p>
                          <p className="font-medium">{test.phosphorus}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Potassium (K)</p>
                          <p className="font-medium">{test.potassium}</p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <button
                          onClick={() => viewRecommendation(test._id)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          {activeRecommendation?.soilTestId === test._id ? 'Hide Recommendation' : 'View Recommendation'}
                        </button>

                        {activeRecommendation?.soilTestId === test._id && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            {activeRecommendation.error ? (
                              <p className="text-yellow-600">No recommendation found for this test.</p>
                            ) : (
                              <>
                                <div className="mb-2">
                                  <p className="text-sm text-gray-500">Recommended Crop</p>
                                  <p className="font-medium">{activeRecommendation.cropSuggestion}</p>
                                  <p className="text-xs text-gray-400">
                                    Source: {activeRecommendation.source}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Recommended Fertilizer</p>
                                  <p className="font-medium">{activeRecommendation.fertilizerSuggestion}</p>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                  <p className="text-gray-500">No soil tests found</p>
                </div>
              )}
            </div>
          )}

          {/* Rules Tab */}
          {activeTab === 'rules' && (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <h3 className="text-lg font-semibold mb-6">🧪 Configure Soil Recommendation Rule</h3>

    {/* Form to Add New Rule */}
    <form onSubmit={saveRules} className="space-y-4">
      <div className="grid md:grid-cols-3 gap-4">
        <input name="soilType" placeholder="Soil Type (e.g. Loamy)" value={rules.soilType || ''} onChange={handleRuleChange} className="border px-3 py-2 rounded" required />
        <input name="cropSuggestion" placeholder="Crop Suggestion" value={rules.cropSuggestion || ''} onChange={handleRuleChange} className="border px-3 py-2 rounded" required />
        <input name="fertilizerSuggestion" placeholder="Fertilizer Suggestion" value={rules.fertilizerSuggestion || ''} onChange={handleRuleChange} className="border px-3 py-2 rounded" />
        <input name="irrigationRecommendation" placeholder="Irrigation Advice" value={rules.irrigationRecommendation || ''} onChange={handleRuleChange} className="border px-3 py-2 rounded" />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <input name="pH.min" placeholder="Min pH" type="number" step="0.1" value={rules.pH?.min || ''} onChange={handleRuleChange} className="border px-3 py-2 rounded" />
        <input name="pH.max" placeholder="Max pH" type="number" step="0.1" value={rules.pH?.max || ''} onChange={handleRuleChange} className="border px-3 py-2 rounded" />
        <input name="moisture.min" placeholder="Min Moisture" type="number" value={rules.moisture?.min || ''} onChange={handleRuleChange} className="border px-3 py-2 rounded" />
        <input name="moisture.max" placeholder="Max Moisture" type="number" value={rules.moisture?.max || ''} onChange={handleRuleChange} className="border px-3 py-2 rounded" />
        <input name="nitrogen.min" placeholder="Min Nitrogen" type="number" value={rules.nitrogen?.min || ''} onChange={handleRuleChange} className="border px-3 py-2 rounded" />
        <input name="nitrogen.max" placeholder="Max Nitrogen" type="number" value={rules.nitrogen?.max || ''} onChange={handleRuleChange} className="border px-3 py-2 rounded" />
        <input name="phosphorus.min" placeholder="Min Phosphorus" type="number" value={rules.phosphorus?.min || ''} onChange={handleRuleChange} className="border px-3 py-2 rounded" />
        <input name="phosphorus.max" placeholder="Max Phosphorus" type="number" value={rules.phosphorus?.max || ''} onChange={handleRuleChange} className="border px-3 py-2 rounded" />
        <input name="potassium.min" placeholder="Min Potassium" type="number" value={rules.potassium?.min || ''} onChange={handleRuleChange} className="border px-3 py-2 rounded" />
        <input name="potassium.max" placeholder="Max Potassium" type="number" value={rules.potassium?.max || ''} onChange={handleRuleChange} className="border px-3 py-2 rounded" />
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">💾 Save Rule</button>
    </form>

    {/* Existing Rules Table */}
    <h4 className="text-md font-semibold mt-8 mb-2">📋 Existing Rules</h4>
    {isLoading.rules ? (
      <p className="text-sm text-gray-500">Loading...</p>
    ) : (
      <table className="w-full mt-2 border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-2 py-1 border">Soil</th>
            <th className="px-2 py-1 border">Crop</th>
            <th className="px-2 py-1 border">NPK</th>
            <th className="px-2 py-1 border">pH</th>
            <th className="px-2 py-1 border">Moisture</th>
            <th className="px-2 py-1 border">Actions</th>
          </tr>
        </thead>
        <tbody>
        {allRules.map(rule => (
  <tr key={rule._id}>
    <td className="border px-2 py-1">{rule.soilType || '-'}</td>
    <td className="border px-2 py-1">{rule.cropSuggestion || '-'}</td>

    <td className="border px-2 py-1">
      N: {rule.nitrogen?.min ?? '-'} - {rule.nitrogen?.max ?? '-'}<br />
      P: {rule.phosphorus?.min ?? '-'} - {rule.phosphorus?.max ?? '-'}<br />
      K: {rule.potassium?.min ?? '-'} - {rule.potassium?.max ?? '-'}
    </td>

    <td className="border px-2 py-1">
      {rule.pH?.min ?? '-'} – {rule.pH?.max ?? '-'}
    </td>

    <td className="border px-2 py-1">
      {rule.moisture?.min ?? '-'} – {rule.moisture?.max ?? '-'}
    </td>

    <td className="border px-2 py-1">
      <button onClick={() => deleteRule(rule._id)} className="text-red-500 hover:underline">🗑 Delete</button>
    </td>
  </tr>
))}

        </tbody>
      </table>
    )}
  </div>
)}

          {/* Pending Rules Tab */}
          {activeTab === 'pending-rules' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold mb-6">Pending Rule Proposals</h3>
              {isLoading.pendingRules ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : pendingRules.length > 0 ? (
                <div className="space-y-4">
                  {pendingRules.map(rule => (
                    <div key={rule._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">Proposed by: {rule.createdBy?.name || 'Unknown'}</h4>
                          <p className="text-sm text-gray-500">
                            Submitted: {new Date(rule.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => reviewRuleProposal(rule._id, 'approve')}
                            className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
                            title="Approve"
                          >
                            <FiCheck />
                          </button>
                          <button
                            onClick={() => reviewRuleProposal(rule._id, 'reject')}
                            className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                            title="Reject"
                          >
                            <FiX />
                          </button>
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                        {Object.entries(rule).filter(([key]) => !['_id', 'createdBy', 'createdAt', '__v'].includes(key)).map(([key, value]) => (
                          <div key={key} className="bg-gray-50 p-2 rounded">
                            <p className="font-medium">{key}:</p>
                            <p className="text-gray-700">
                              {typeof value === 'object' ? JSON.stringify(value) : value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No pending rule proposals</p>
              )}
            </div>
          )}

          {/* Pending Recommendations Tab */}
          {activeTab === 'pending-recs' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold mb-6">Pending Recommendations</h3>
              {isLoading.pendingRecs ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : pendingRecommendations.length > 0 ? (
                <div className="space-y-4">
                  {pendingRecommendations.map(rec => (
                    <div key={rec._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">Soil Test #{rec.soilTest?._id?.slice(-6) || 'Unknown'}</h4>
                          <p className="text-sm text-gray-500">
                            Generated by: {rec.generatedBy?.name || 'System'}
                          </p>
                        </div>
                        <button
                          onClick={() => approveRecommendation(rec._id)}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          Approve
                        </button>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Recommended Crop</p>
                          <p className="font-medium">{rec.cropSuggestion}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Recommended Fertilizer</p>
                          <p className="font-medium">{rec.fertilizerSuggestion}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Source</p>
                          <p className="font-medium capitalize">{rec.source}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <p className="font-medium capitalize">{rec.status}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No pending recommendations</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;