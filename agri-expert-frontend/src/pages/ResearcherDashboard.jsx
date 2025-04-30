import React, { useState } from 'react';
import SoilInsights from './SoilInsights';
import RecommendationTrends from './RecommendationTrends';
import RuleAudit from './RuleAudit';

const ResearcherDashboard = () => {
  const [activeSection, setActiveSection] = useState('insights');

  const renderSection = () => {
    switch (activeSection) {
      case 'insights':
        return <SoilInsights />;
      case 'trends':
        return <RecommendationTrends />;
      case 'audit':
        return <RuleAudit />;
      default:
        return <SoilInsights />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-blue-800 text-white">
        <div className="p-6 text-2xl font-bold border-b border-blue-700">
          Researcher Panel
        </div>
        <nav className="p-4 space-y-2">
          <button
            onClick={() => setActiveSection('insights')}
            className={`w-full text-left px-4 py-2 rounded hover:bg-blue-700 ${activeSection === 'insights' ? 'bg-blue-700' : ''}`}
          >
            📊 Soil Insights
          </button>
          <button
            onClick={() => setActiveSection('trends')}
            className={`w-full text-left px-4 py-2 rounded hover:bg-blue-700 ${activeSection === 'trends' ? 'bg-blue-700' : ''}`}
          >
            📈 Recommendation Trends
          </button>
          <button
            onClick={() => setActiveSection('audit')}
            className={`w-full text-left px-4 py-2 rounded hover:bg-blue-700 ${activeSection === 'audit' ? 'bg-blue-700' : ''}`}
          >
            🕵️ Rule Audit
          </button>
        </nav>
      </aside>
      <main className="flex-1 p-6">{renderSection()}</main>
    </div>
  );
};

export default ResearcherDashboard;
