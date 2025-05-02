import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import FarmerDashboard from './pages/dashboards/FarmerDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import ResearcherDashboard from './pages/dashboards/ResearcherDashboard';
import GovtDashboard from './pages/dashboards/GovtDashboard';
import FarmerHistory from './pages/FarmerHistory';
import FarmerProfile from './components/FarmerProfile';
import ProtectedRoute from './auth/ProtectedRoute';
import Navbar from './components/Navbar';


const App = () => {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route path="/farmer" element={<ProtectedRoute allowedRoles={['FARMER']} />}>
          <Route index element={<FarmerDashboard />} />
        </Route>

        <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route index element={<AdminDashboard />} />
        </Route>

        <Route path="/farmer/history" element={<FarmerHistory />} />

        <Route path="/farmer/profile" element={<FarmerProfile />} />

        <Route path="/researcher" element={<ProtectedRoute allowedRoles={['RESEARCHER']} />}>
          <Route index element={<ResearcherDashboard />} />
        </Route>

        <Route path="/govt_official" element={<ProtectedRoute allowedRoles={['GOVT_OFFICIAL']} />}>
          <Route index element={<GovtDashboard />} />
        </Route>


        {/* Fallback Route */}
        <Route path="*" element={<h2 style={{ textAlign: 'center' }}>404 - Page Not Found</h2>} />
      </Routes>
    </Router>
  );
};

export default App;
