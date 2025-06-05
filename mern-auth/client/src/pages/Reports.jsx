import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Reports = () => {
    const { backendUrl } = useAppContext();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reportData, setReportData] = useState({
        performanceStats: {},
        departmentStats: [],
        employeeStats: [],
        recentPerformance: []
    });
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        department: '',
        employee: ''
    });
    const [departments, setDepartments] = useState([]);
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (filters.startDate && filters.endDate) {
            fetchReportData();
        }
    }, [filters]);

    const fetchInitialData = async () => {
        try {
            const token = localStorage.getItem('token');
            const [departmentsRes, employeesRes] = await Promise.all([
                axios.get(`${backendUrl}/api/departments`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${backendUrl}/api/employees`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            if (departmentsRes.data.success) {
                setDepartments(departmentsRes.data.departments);
            }
            if (employeesRes.data.success) {
                setEmployees(employeesRes.data.employees);
            }

            // Set default date range to last 30 days
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 30);
            
            setFilters(prev => ({
                ...prev,
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0]
            }));
        } catch (error) {
            console.error('Failed to fetch initial data:', error);
            setError('Failed to load initial data');
        }
    };

    const fetchReportData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`${backendUrl}/api/reports`, {
                headers: { Authorization: `Bearer ${token}` },
                params: filters
            });

            if (response.data.success) {
                setReportData(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch report data:', error);
            setError('Failed to load report data');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const performanceChartData = {
        labels: reportData.recentPerformance.map(p => new Date(p.date).toLocaleDateString()),
        datasets: [
            {
                label: 'Daily Points',
                data: reportData.recentPerformance.map(p => p.dailyPoints),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            },
            {
                label: 'Sales Amount',
                data: reportData.recentPerformance.map(p => p.salesAmount),
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1
            }
        ]
    };

    const departmentChartData = {
        labels: reportData.departmentStats.map(d => d.name),
        datasets: [
            {
                label: 'Average Performance Score',
                data: reportData.departmentStats.map(d => d.averageScore),
                backgroundColor: 'rgba(54, 162, 235, 0.5)'
            }
        ]
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Performance Reports</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {/* Filters */}
                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Start Date
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                value={filters.startDate}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                End Date
                            </label>
                            <input
                                type="date"
                                name="endDate"
                                value={filters.endDate}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Department
                            </label>
                            <select
                                name="department"
                                value={filters.department}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Departments</option>
                                {departments.map(dept => (
                                    <option key={dept._id} value={dept._id}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Employee
                            </label>
                            <select
                                name="employee"
                                value={filters.employee}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Employees</option>
                                {employees.map(emp => (
                                    <option key={emp._id} value={emp._id}>
                                        {emp.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Performance Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Performance Records</h3>
                        <p className="text-3xl font-bold text-blue-600">{reportData.performanceStats.totalRecords}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Average Daily Points</h3>
                        <p className="text-3xl font-bold text-green-600">{reportData.performanceStats.averagePoints?.toFixed(2)}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Sales Amount</h3>
                        <p className="text-3xl font-bold text-purple-600">${reportData.performanceStats.totalSales?.toFixed(2)}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Average Target Progress</h3>
                        <p className="text-3xl font-bold text-orange-600">{reportData.performanceStats.averageProgress?.toFixed(2)}%</p>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Performance Trends</h3>
                        <Line data={performanceChartData} />
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Department Performance</h3>
                        <Bar data={departmentChartData} />
                    </div>
                </div>

                {/* Top Performers */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-700">Top Performers</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Employee
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Department
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Average Points
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total Sales
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Target Progress
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {reportData.employeeStats.map((employee) => (
                                    <tr key={employee._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <span className="text-gray-600 font-medium">
                                                        {employee.name.charAt(0)}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {employee.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{employee.department}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{employee.averagePoints.toFixed(2)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">${employee.totalSales.toFixed(2)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{employee.targetProgress.toFixed(2)}%</div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports; 