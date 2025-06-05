import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GenerateReportPage = () => {
  const navigate = useNavigate();
  const [reportType, setReportType] = useState('points');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement report generation logic
    console.log('Generating report:', { reportType, dateRange });
  };

  const handleDateChange = (e) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Generate Report</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Back to Dashboard
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="points">Points Summary</option>
              <option value="employee">Employee Performance</option>
              <option value="department">Department Overview</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded"
            >
              Generate Report
            </button>
            <button
              type="button"
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded"
            >
              Download PDF
            </button>
          </div>
        </form>

        {/* Report Preview Section */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Report Preview</h2>
          <div className="border rounded p-4 min-h-[200px]">
            <p className="text-gray-500 text-center">Report will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateReportPage; 