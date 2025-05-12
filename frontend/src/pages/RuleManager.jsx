// pages/RuleManager.jsx
import React, { useEffect, useState } from 'react';

function RuleManager() {
  const [rules, setRules] = useState({
    pH: { min: '', max: '' },
    moisture: { min: '', max: '' },
    nitrogen: { min: '', max: '' },
    phosphorus: { min: '', max: '' },
    potassium: { min: '', max: '' },
    cropRecommendation: '',
    fertilizerRecommendation: '',
    irrigationRecommendation: ''
  });

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/rules')
      .then(res => res.json())
      .then(data => data && setRules(data));
  }, []);

  const handleChange = (e) => {
    const [field, subfield] = e.target.name.split('.');
    if (subfield) {
      setRules({ ...rules, [field]: { ...rules[field], [subfield]: e.target.value } });
    } else {
      setRules({ ...rules, [field]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:5000/api/admin/rules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rules)
    });
    alert('Rules updated');
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Repeat for each rule field like pH, moisture, etc. */}
      <input name="pH.min" value={rules.pH.min} onChange={handleChange} placeholder="Min pH" />
      <input name="pH.max" value={rules.pH.max} onChange={handleChange} placeholder="Max pH" />
      {/* Add other fields... */}
      <input name="cropRecommendation" value={rules.cropRecommendation} onChange={handleChange} placeholder="Crop" />
      <button type="submit">Save Rules</button>
    </form>
  );
}

export default RuleManager;
