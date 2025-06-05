import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EditEmployeePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employeeId: '',
    name: '',
    email: '',
    department: '',
    position: '',
    joinDate: ''
  });

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch(`http://localhost:5000/api/employees/${formData.employeeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}` // Adjust if you're storing the token differently
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email, // Add this to model if needed
        department: formData.department,
        position: formData.position,
        joinDate: formData.joinDate // Add this to model if needed
      })
    });

    const data = await res.json();
    if (res.ok) {
      alert('Employee updated successfully');
      navigate('/dashboard');
    } else {
      alert(`Error: ${data.message}`);
    }
  } catch (err) {
    console.error('Update error:', err);
    alert('An error occurred while updating the employee');
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
          <h1 className="text-3xl font-bold">Edit Employee</h1>
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
            <label className="block text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Position</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Join Date</label>
            <input
              type="date"
              name="joinDate"
              value={formData.joinDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
          >
            Update Employee
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditEmployeePage; 