import express from 'express';
import Performance from '../models/Performance.js';
import Employee from '../models/Employee.js';
import { verifyToken } from '../middleware/userAuth.js';
import { checkRole } from '../middleware/checkRole.js';
import Department from '../models/Department.js';

const router = express.Router();

// Generate monthly report for all employees (admin and manager only)
router.get('/monthly', verifyToken, checkRole(['admin', 'manager']), async (req, res) => {
  try {
    const { month, year } = req.query;
    
    // Validate month and year
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);
    
    if (isNaN(monthNum) || isNaN(yearNum) || monthNum < 1 || monthNum > 12) {
      return res.status(400).json({ message: 'Invalid month or year' });
    }
    
    // Get start and end dates for the month
    const startDate = new Date(yearNum, monthNum - 1, 1);
    const endDate = new Date(yearNum, monthNum, 0);
    
    // Get all employees
    const employees = await Employee.find().select('-password');
    
    // Get performance records for the month
    const records = await Performance.aggregate([
      {
        $match: {
          date: {
            $gte: startDate,
            $lte: endDate
          }
        }
      },
      {
        $group: {
          _id: '$employeeID',
          totalPoints: { $sum: '$dailyPoints' },
          totalSales: { $sum: '$salesAmount' },
          averageRatio: { $avg: '$ratio' },
          recordCount: { $sum: 1 }
        }
      }
    ]);
    
    // Calculate days in month
    const daysInMonth = endDate.getDate();
    
    // Monthly target
    const MONTHLY_TARGET = 24000;
    
    // Map records to employees
    const report = employees.map(employee => {
      const record = records.find(r => r._id === employee.employeeID) || {
        totalPoints: 0,
        totalSales: 0,
        averageRatio: 0,
        recordCount: 0
      };
      
      const targetPercentage = (record.totalPoints / MONTHLY_TARGET) * 100;
      
      return {
        employeeID: employee.employeeID,
        name: employee.name,
        department: employee.department,
        position: employee.position,
        totalPoints: record.totalPoints,
        totalSales: record.totalSales,
        averageRatio: record.averageRatio,
        targetPercentage: targetPercentage.toFixed(2),
        daysLogged: record.recordCount,
        daysInMonth,
        status: targetPercentage >= 100 ? 'Achieved' : 'In Progress'
      };
    });
    
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate individual employee report (admin, manager, and self)
router.get('/employee/:id', verifyToken, async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);
    
    // Allow access if user is admin, manager, or viewing their own report
    if (user.role === 'admin' || user.role === 'manager' || req.params.id === user.employeeID) {
      const { month, year } = req.query;
      
      // Validate month and year
      const monthNum = parseInt(month);
      const yearNum = parseInt(year);
      
      if (isNaN(monthNum) || isNaN(yearNum) || monthNum < 1 || monthNum > 12) {
        return res.status(400).json({ message: 'Invalid month or year' });
      }
      
      // Get start and end dates for the month
      const startDate = new Date(yearNum, monthNum - 1, 1);
      const endDate = new Date(yearNum, monthNum, 0);
      
      // Get employee
      const employee = await Employee.findOne({ employeeID: req.params.id }).select('-password');
      
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
      
      // Get daily performance records
      const dailyRecords = await Performance.find({
        employeeID: req.params.id,
        date: {
          $gte: startDate,
          $lte: endDate
        }
      }).sort({ date: 1 });
      
      // Monthly target
      const MONTHLY_TARGET = 24000;
      const daysInMonth = endDate.getDate();
      const dailyTarget = MONTHLY_TARGET / daysInMonth;
      
      // Calculate totals
      const totalPoints = dailyRecords.reduce((sum, record) => sum + record.dailyPoints, 0);
      const totalSales = dailyRecords.reduce((sum, record) => sum + record.salesAmount, 0);
      
      // Calculate average ratio
      const averageRatio = dailyRecords.length > 0 
        ? dailyRecords.reduce((sum, record) => sum + record.ratio, 0) / dailyRecords.length
        : 0;
      
      // Format daily records for report
      const formattedDailyRecords = dailyRecords.map(record => {
        return {
          date: record.date,
          dailyPoints: record.dailyPoints,
          salesAmount: record.salesAmount,
          ratio: record.ratio.toFixed(2),
          targetProgress: record.targetProgress.toFixed(2),
          dailyTarget,
          surplus: record.dailyPoints - dailyTarget
        };
      });
      
      // Calculate target percentage
      const targetPercentage = (totalPoints / MONTHLY_TARGET) * 100;
      
      const report = {
        employee: {
          employeeID: employee.employeeID,
          name: employee.name,
          department: employee.department,
          position: employee.position
        },
        summary: {
          totalPoints,
          totalSales,
          averageRatio: averageRatio.toFixed(2),
          targetPercentage: targetPercentage.toFixed(2),
          daysLogged: dailyRecords.length,
          daysInMonth,
          remainingPoints: MONTHLY_TARGET - totalPoints,
          status: targetPercentage >= 100 ? 'Achieved' : 'In Progress'
        },
        dailyRecords: formattedDailyRecords
      };
      
      res.status(200).json(report);
    } else {
      res.status(403).json({ message: 'Access denied' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Department performance report (admin and manager only)
router.get('/department/:dept', verifyToken, checkRole(['admin', 'manager']), async (req, res) => {
  try {
    const { month, year } = req.query;
    
    // Validate month and year
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);
    
    if (isNaN(monthNum) || isNaN(yearNum) || monthNum < 1 || monthNum > 12) {
      return res.status(400).json({ message: 'Invalid month or year' });
    }
    
    // Get start and end dates for the month
    const startDate = new Date(yearNum, monthNum - 1, 1);
    const endDate = new Date(yearNum, monthNum, 0);
    
    // Get employees in department
    const employees = await Employee.find({ department: req.params.dept }).select('-password');
    
    if (employees.length === 0) {
      return res.status(404).json({ message: 'No employees found in this department' });
    }
    
    // Get employee IDs
    const employeeIds = employees.map(emp => emp.employeeID);
    
    // Get performance records for the month and department
    const records = await Performance.aggregate([
      {
        $match: {
          employeeID: { $in: employeeIds },
          date: {
            $gte: startDate,
            $lte: endDate
          }
        }
      },
      {
        $group: {
          _id: '$employeeID',
          totalPoints: { $sum: '$dailyPoints' },
          totalSales: { $sum: '$salesAmount' },
          averageRatio: { $avg: '$ratio' },
          recordCount: { $sum: 1 }
        }
      }
    ]);
    
    // Calculate days in month
    const daysInMonth = endDate.getDate();
    
    // Monthly target
    const MONTHLY_TARGET = 24000;
    
    // Map records to employees
    const employeeReports = employees.map(employee => {
      const record = records.find(r => r._id === employee.employeeID) || {
        totalPoints: 0,
        totalSales: 0,
        averageRatio: 0,
        recordCount: 0
      };
      
      const targetPercentage = (record.totalPoints / MONTHLY_TARGET) * 100;
      
      return {
        employeeID: employee.employeeID,
        name: employee.name,
        position: employee.position,
        totalPoints: record.totalPoints,
        totalSales: record.totalSales,
        averageRatio: record.averageRatio,
        targetPercentage: targetPercentage.toFixed(2),
        daysLogged: record.recordCount,
        status: targetPercentage >= 100 ? 'Achieved' : 'In Progress'
      };
    });
    
    // Calculate department totals
    const departmentTotals = employeeReports.reduce((acc, report) => {
      acc.totalPoints += report.totalPoints;
      acc.totalSales += report.totalSales;
      acc.totalEmployees += 1;
      acc.achievedTarget += report.status === 'Achieved' ? 1 : 0;
      return acc;
    }, {
      totalPoints: 0,
      totalSales: 0,
      totalEmployees: 0,
      achievedTarget: 0
    });
    
    // Calculate department average ratio
    departmentTotals.averageRatio = departmentTotals.totalSales > 0
      ? (departmentTotals.totalPoints / departmentTotals.totalSales) * 100
      : 0;
    
    const report = {
      department: req.params.dept,
      month: monthNum,
      year: yearNum,
      summary: {
        totalPoints: departmentTotals.totalPoints,
        totalSales: departmentTotals.totalSales,
        averageRatio: departmentTotals.averageRatio.toFixed(2),
        totalEmployees: departmentTotals.totalEmployees,
        achievedTarget: departmentTotals.achievedTarget,
        achievementRate: ((departmentTotals.achievedTarget / departmentTotals.totalEmployees) * 100).toFixed(2)
      },
      employees: employeeReports
    };
    
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get performance reports with filters
router.get('/', verifyToken, async (req, res) => {
    try {
        const { startDate, endDate, department, employee } = req.query;
        
        // Build query
        const query = {};
        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        if (department) {
            query.department = department;
        }
        if (employee) {
            query.employeeID = employee;
        }

        // Get performance records
        const performanceRecords = await Performance.find(query)
            .populate('employeeID', 'name department')
            .sort({ date: -1 });

        // Calculate performance stats
        const totalRecords = performanceRecords.length;
        const totalPoints = performanceRecords.reduce((sum, record) => sum + record.dailyPoints, 0);
        const totalSales = performanceRecords.reduce((sum, record) => sum + record.salesAmount, 0);
        const totalProgress = performanceRecords.reduce((sum, record) => sum + record.targetProgress, 0);

        const performanceStats = {
            totalRecords,
            averagePoints: totalRecords ? totalPoints / totalRecords : 0,
            totalSales,
            averageProgress: totalRecords ? totalProgress / totalRecords : 0
        };

        // Get department stats
        const departments = await Department.find();
        const departmentStats = await Promise.all(departments.map(async (dept) => {
            const deptRecords = performanceRecords.filter(record => 
                record.employeeID?.department === dept._id
            );
            const deptPoints = deptRecords.reduce((sum, record) => sum + record.dailyPoints, 0);
            return {
                name: dept.name,
                averageScore: deptRecords.length ? deptPoints / deptRecords.length : 0
            };
        }));

        // Get employee stats
        const employees = await Employee.find();
        const employeeStats = await Promise.all(employees.map(async (emp) => {
            const empRecords = performanceRecords.filter(record => 
                record.employeeID?._id.toString() === emp._id.toString()
            );
            const empPoints = empRecords.reduce((sum, record) => sum + record.dailyPoints, 0);
            const empSales = empRecords.reduce((sum, record) => sum + record.salesAmount, 0);
            const empProgress = empRecords.reduce((sum, record) => sum + record.targetProgress, 0);
            
            return {
                _id: emp._id,
                name: emp.name,
                department: emp.department?.name || 'N/A',
                averagePoints: empRecords.length ? empPoints / empRecords.length : 0,
                totalSales: empSales,
                targetProgress: empRecords.length ? empProgress / empRecords.length : 0
            };
        }));

        // Sort employee stats by average points
        employeeStats.sort((a, b) => b.averagePoints - a.averagePoints);

        // Get recent performance for chart
        const recentPerformance = performanceRecords
            .slice(0, 10)
            .map(record => ({
                date: record.date,
                dailyPoints: record.dailyPoints,
                salesAmount: record.salesAmount
            }));

        res.json({
            success: true,
            performanceStats,
            departmentStats,
            employeeStats,
            recentPerformance
        });
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch report data'
        });
    }
});

export default router;