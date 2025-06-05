import Performance from '../models/Performance.js';
import Employee from '../models/Employee.js';

// Add daily performance points
export const addDailyPoints = async (req, res) => {
    try {
        const { employeeID, dailyPoints, salesAmount } = req.body;

        // Validate employee exists
        const employee = await Employee.findOne({ employeeID });
        if (!employee) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }

        // Create new performance record
        const performance = new Performance({
            employeeID,
            dailyPoints,
            salesAmount,
            date: new Date()
        });

        await performance.save();

        res.status(201).json({
            success: true,
            data: performance
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get employee's monthly performance
export const getMonthlyPerformance = async (req, res) => {
    try {
        const { employeeID } = req.params;
        const { year, month } = req.query;

        const currentDate = new Date();
        const targetYear = year || currentDate.getFullYear();
        const targetMonth = month || currentDate.getMonth() + 1;

        const performance = await Performance.calculateMonthlyProgress(
            employeeID,
            parseInt(targetYear),
            parseInt(targetMonth)
        );

        res.status(200).json({
            success: true,
            data: performance
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get department performance summary
export const getDepartmentPerformance = async (req, res) => {
    try {
        const { department } = req.params;
        const { year, month } = req.query;

        const currentDate = new Date();
        const targetYear = year || currentDate.getFullYear();
        const targetMonth = month || currentDate.getMonth() + 1;

        const startDate = new Date(targetYear, targetMonth - 1, 1);
        const endDate = new Date(targetYear, targetMonth, 0);

        // Get all employees in the department
        const employees = await Employee.find({ department });

        // Get performance data for all employees
        const departmentPerformance = await Promise.all(
            employees.map(async (employee) => {
                const performance = await Performance.calculateMonthlyProgress(
                    employee.employeeID,
                    parseInt(targetYear),
                    parseInt(targetMonth)
                );

                return {
                    employeeID: employee.employeeID,
                    name: employee.name,
                    ...performance
                };
            })
        );

        // Calculate department averages
        const totalPoints = departmentPerformance.reduce((sum, emp) => sum + emp.totalPoints, 0);
        const averageProgress = totalPoints / (employees.length * 24000) * 100;

        res.status(200).json({
            success: true,
            data: {
                department,
                totalEmployees: employees.length,
                totalPoints,
                averageProgress,
                employeePerformance: departmentPerformance
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}; 