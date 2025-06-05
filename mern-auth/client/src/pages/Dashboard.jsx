import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import axios from 'axios';

const Dashboard = () => {
    const { user, backendUrl } = useAppContext();
    const [stats, setStats] = useState({
        totalEmployees: 0,
        totalPerformance: 0,
        averageScore: 0,
        recentActivities: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${backendUrl}/api/dashboard/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success) {
                    setStats(response.data.stats);
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [backendUrl]);

    const QuickActionCard = ({ title, description, icon, link }) => (
        <Link to={link} className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                <span className="text-2xl text-blue-600">{icon}</span>
            </div>
            <p className="text-gray-600">{description}</p>
        </Link>
    );

    const StatCard = ({ title, value, icon, color }) => (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-semibold text-gray-800 mt-1">{value}</p>
                </div>
                <div className={`p-3 rounded-full ${color}`}>
                    <span className="text-2xl text-white">{icon}</span>
                </div>
            </div>
        </div>
    );

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
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Welcome back, {user?.name}!
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Here's what's happening with your performance management system.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Employees"
                        value={stats.totalEmployees}
                        icon="👥"
                        color="bg-blue-500"
                    />
                    <StatCard
                        title="Performance Records"
                        value={stats.totalPerformance}
                        icon="📊"
                        color="bg-green-500"
                    />
                    <StatCard
                        title="Average Score"
                        value={`${stats.averageScore}%`}
                        icon="⭐"
                        color="bg-yellow-500"
                    />
                    <StatCard
                        title="Active Projects"
                        value="12"
                        icon="📈"
                        color="bg-purple-500"
                    />
                </div>

                {/* Quick Actions */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <QuickActionCard
                            title="Add Performance Record"
                            description="Record new performance metrics for employees"
                            icon="📝"
                            link="/performance/new"
                        />
                        <QuickActionCard
                            title="View Reports"
                            description="Access detailed performance reports and analytics"
                            icon="📊"
                            link="/reports"
                        />
                        <QuickActionCard
                            title="Manage Employees"
                            description="Add, edit, or remove employee records"
                            icon="👥"
                            link="/employees"
                        />
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
                    <div className="space-y-4">
                        {stats.recentActivities.length > 0 ? (
                            stats.recentActivities.map((activity, index) => (
                                <div key={index} className="flex items-center justify-between py-3 border-b last:border-b-0">
                                    <div>
                                        <p className="text-gray-800">{activity.description}</p>
                                        <p className="text-sm text-gray-500">{activity.timestamp}</p>
                                    </div>
                                    <span className="text-blue-600">{activity.icon}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4">No recent activities</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 