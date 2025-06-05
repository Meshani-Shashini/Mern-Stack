import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EnterPointsPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employeeId: '',
    points: '',
    date: '',
    description: ''
  });

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch('http://localhost:4000/api/points/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (response.ok) {
      alert('Points submitted successfully!');
      setFormData({ employeeId: '', points: '', date: '', description: '' });
    } else {
      alert(result.message || 'Failed to submit points.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Server error. Please try again later.');
  }
};


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Enter Points</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Back to Dashboard
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Employee ID</label>
            <input
              type="text"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Points</label>
            <input
              type="number"
              name="points"
              value={formData.points}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="3"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
          >
            Submit Points
          </button>
        </form>
      </div>
    </div>
  );
};

export default EnterPointsPage; 