import express from 'express';
import { verifyToken } from '../middleware/userAuth.js';
import Employee from '../models/Employee.js';
import Performance from '../models/Performance.js';

const router = express.Router();

// Get dashboard statistics
router.get('/stats', verifyToken, async (req, res) => {
    try {
        // Get total employees count
        const totalEmployees = await Employee.countDocuments();

        // Get total performance records
        const totalPerformance = await Performance.countDocuments();

        // Calculate average score
        const performances = await Performance.find();
        const averageScore = performances.length > 0
            ? Math.round(performances.reduce((acc, curr) => acc + curr.dailyPoints, 0) / performances.length)
            : 0;

        // Get recent activities (last 5 performance records)
        const recentActivities = await Performance.find()
            .sort({ date: -1 })
            .limit(5)
            .populate('employeeID', 'name')
            .map(record => ({
                description: `Performance record added for ${record.employeeID.name}`,
                timestamp: new Date(record.date).toLocaleDateString(),
                icon: '📊'
            }));

        res.json({
            success: true,
            stats: {
                totalEmployees,
                totalPerformance,
                averageScore,
                recentActivities
            }
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard statistics'
        });
    }
});

export default router; 