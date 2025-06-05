import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import axios from 'axios';

const PerformanceForm = () => {
    const { backendUrl } = useAppContext();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        employeeID: '',
        date: new Date().toISOString().split('T')[0],
        dailyPoints: '',
        salesAmount: '',
        targetProgress: '',
        notes: ''
    });

    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${backendUrl}/api/employees`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setEmployees(response.data.employees);
            }
        } catch (error) {
            console.error('Failed to fetch employees:', error);
            setError('Failed to load employees');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Calculate target progress if both daily points and sales amount are provided
        if (name === 'dailyPoints' || name === 'salesAmount') {
            const points = name === 'dailyPoints' ? value : formData.dailyPoints;
            const sales = name === 'salesAmount' ? value : formData.salesAmount;
            
            if (points && sales) {
                const progress = (parseFloat(points) / parseFloat(sales)) * 100;
                setFormData(prev => ({
                    ...prev,
                    targetProgress: progress.toFixed(2)
                }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('token');
            
            const response = await axios.post(
                `${backendUrl}/api/performance`,
                formData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (response.data.success) {
                navigate('/dashboard');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to save performance record');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    Record Performance
                </h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Employee
                            </label>
                            <select
                                name="employeeID"
                                value={formData.employeeID}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Employee</option>
                                {employees.map(emp => (
                                    <option key={emp._id} value={emp._id}>
                                        {emp.name} - {emp.position}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Daily Points
                            </label>
                            <input
                                type="number"
                                name="dailyPoints"
                                value={formData.dailyPoints}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Sales Amount
                            </label>
                            <input
                                type="number"
                                name="salesAmount"
                                value={formData.salesAmount}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Target Progress (%)
                            </label>
                            <input
                                type="number"
                                name="targetProgress"
                                value={formData.targetProgress}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Notes
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Add any additional notes or observations..."
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
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
                            {loading ? 'Saving...' : 'Save Performance Record'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PerformanceForm; 