import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Navbar from '../components/Navbar';

function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      const { token } = res.data;

      localStorage.setItem('token', token);
      toast.success('Login successful!');

      const decoded = jwtDecode(token);
      const role = (decoded.role || decoded.user?.role || '').toLowerCase();

      if (role === 'farmer') {
        navigate('/dashboard/farmer');
      } else if (role === 'admin') {
        navigate('/dashboard/admin');
      } else if (role === 'govt') {
        navigate('/dashboard/govt');
      } else if (role === 'researcher') {
        navigate('/dashboard/researcher');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      toast.error('Invalid credentials');
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <Toaster />
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow-md w-full max-w-sm space-y-4"
        >
          <h2 className="text-2xl font-bold text-center text-green-600">Login</h2>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
}

export default LoginPage;
