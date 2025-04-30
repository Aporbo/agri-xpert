import React, { useEffect, useState } from 'react';

const RuleAudit = () => {
  const [auditLogs, setAuditLogs] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/researcher/rule-audit')
      .then(res => res.json())
      .then(data => setAuditLogs(data))
      .catch(err => console.error('Failed to load rule audit:', err));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">📋 Rule Audit Logs</h2>
      <ul className="space-y-3">
        {auditLogs.map((log, index) => (
          <li key={index} className="p-4 bg-white shadow rounded">
            <p><strong>Date:</strong> {new Date(log.timestamp).toLocaleString()}</p>
            <p><strong>Changed By:</strong> {log.changedBy}</p>
            <p><strong>Changes:</strong> {log.changes}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RuleAudit;
