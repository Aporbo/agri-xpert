import React, { useState } from 'react';
import UserManagement from './UserManagement';
import RuleManagement from './RuleManagement';
import SoilTestManagement from './SoilTestManagement';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('users');

  const renderSection = () => {
    switch (activeSection) {
      case 'users':
        return <UserManagement />;
      case 'soil':
        return <SoilTestManagement />;
      case 'rules':
        return <RuleManagement />;
      default:
        return <UserManagement />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-green-800 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-green-700">
          Admin Panel
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <SidebarButton
            label="👥 Users"
            isActive={activeSection === 'users'}
            onClick={() => setActiveSection('users')}
          />
          <SidebarButton
            label="🌱 Soil Tests"
            isActive={activeSection === 'soil'}
            onClick={() => setActiveSection('soil')}
          />
          <SidebarButton
            label="⚙️ Rules"
            isActive={activeSection === 'rules'}
            onClick={() => setActiveSection('rules')}
          />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">{renderSection()}</main>
    </div>
  );
};

// Extract reusable SidebarButton component
const SidebarButton = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-4 py-2 rounded transition ${
      isActive ? 'bg-green-700 font-semibold' : 'hover:bg-green-700'
    }`}
    aria-current={isActive ? 'page' : undefined}
  >
    {label}
  </button>
);

export default AdminDashboard;
