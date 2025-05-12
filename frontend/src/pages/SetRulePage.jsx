import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

function SetRulePage() {
  const [rule, setRule] = useState({
    crop: '',
    fertilizer: '',
    irrigation: ''
  });

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/rules')
      .then(res => setRule(res.data))
      .catch(() => toast.error('Failed to load rules'));
  }, []);

  const handleChange = (e) => {
    setRule({ ...rule, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/admin/rules', rule);
      toast.success('Rules updated');
    } catch {
      toast.error('Update failed');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-green-600">Set Soil Test Rules</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="crop" value={rule.crop} onChange={handleChange} className="border p-2 w-full" placeholder="Crop Recommendation" />
        <input name="fertilizer" value={rule.fertilizer} onChange={handleChange} className="border p-2 w-full" placeholder="Fertilizer Recommendation" />
        <input name="irrigation" value={rule.irrigation} onChange={handleChange} className="border p-2 w-full" placeholder="Irrigation Suggestion" />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Update Rules</button>
      </form>
    </div>
  );
}

export default SetRulePage;
