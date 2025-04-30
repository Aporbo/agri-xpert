import React, { useEffect, useState } from 'react';

function RuleManagement() {
  const [rules, setRules] = useState({
    minPH: '',
    maxPH: '',
    minMoisture: '',
    maxMoisture: '',
    cropRecommendation: '',
    fertilizerRecommendation: '',
    irrigationRecommendation: ''
  });

  const fetchRules = async () => {
    const res = await fetch('http://localhost:5000/api/admin/rules');
    const data = await res.json();
    if (data) setRules(data);
  };

  const handleChange = (e) => {
    setRules({ ...rules, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    await fetch('http://localhost:5000/api/admin/rules', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(rules)
    });
    alert('Rules updated!');
  };

  useEffect(() => {
    fetchRules();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">⚙️ Rule Management</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        {['minPH', 'maxPH', 'minMoisture', 'maxMoisture'].map((key) => (
          <input
            key={key}
            type="number"
            name={key}
            value={rules[key] || ''}
            onChange={handleChange}
            placeholder={key}
            className="border p-2 rounded"
            required
          />
        ))}
        {['cropRecommendation', 'fertilizerRecommendation', 'irrigationRecommendation'].map((key) => (
          <input
            key={key}
            name={key}
            value={rules[key] || ''}
            onChange={handleChange}
            placeholder={key}
            className="border p-2 rounded"
            required
          />
        ))}
        <button type="submit" className="col-span-2 bg-green-600 text-white p-2 rounded">
          Save Rules
        </button>
      </form>
    </div>
  );
}

export default RuleManagement;
