import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import axios from 'axios';

const EmployeeForm = () => {
    const { backendUrl } = useAppContext();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        position: '',
        department: '',
        phone: '',
        address: '',
        joiningDate: '',
        salary: ''
    });

    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDepartments();
        if (isEditMode) {
            fetchEmployee();
        }
    }, [id]);

    const fetchDepartments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${backendUrl}/api/departments`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setDepartments(response.data.departments);
            }
        } catch (error) {
            console.error('Failed to fetch departments:', error);
        }
    };

    const fetchEmployee = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`${backendUrl}/api/employees/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setFormData(response.data.employee);
            }
        } catch (error) {
            console.error('Failed to fetch employee:', error);
            setError('Failed to load employee data');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('token');
            const url = isEditMode
                ? `${backendUrl}/api/employees/${id}`
                : `${backendUrl}/api/employees`;
            
            const method = isEditMode ? 'put' : 'post';
            
            const response = await axios[method](url, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                navigate('/employees');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to save employee');
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditMode) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    {isEditMode ? 'Edit Employee' : 'Add New Employee'}
                </h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                autoComplete="name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                autoComplete="email"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Position
                            </label>
                            <input
                                type="text"
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Department
                            </label>
                            <select
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Department</option>
                                {departments.map(dept => (
                                    <option key={dept._id} value={dept._id}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                autoComplete="tel"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Joining Date
                            </label>
                            <input
                                type="date"
                                name="joiningDate"
                                value={formData.joiningDate}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Salary
                            </label>
                            <input
                                type="number"
                                name="salary"
                                value={formData.salary}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Address
                            </label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate('/employees')}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
                                loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {loading ? 'Saving...' : isEditMode ? 'Update Employee' : 'Add Employee'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmployeeForm; 