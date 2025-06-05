import React from 'react';
import { useNavigate } from 'react-router-dom';

const ActionPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Action</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => navigate('/enter-points')}
            className="bg-blue-500 hover:bg-blue-600 text-white p-6 rounded-lg shadow-md transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">Enter Points</h2>
            <p>Record and manage employee points</p>
          </button>

          <button
            onClick={() => navigate('/edit-employee')}
            className="bg-green-500 hover:bg-green-600 text-white p-6 rounded-lg shadow-md transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">Edit Employee</h2>
            <p>Manage employee information</p>
          </button>

          <button
            onClick={() => navigate('/generate-report')}
            className="bg-purple-500 hover:bg-purple-600 text-white p-6 rounded-lg shadow-md transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">Generate Report</h2>
            <p>Create and view reports</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionPage; 