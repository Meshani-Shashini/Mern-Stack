import Employee from '../models/Employee.js';
import Performance from '../models/Performance.js';

/**
 * Get employee list by department
 */
const getEmployeesByDepartment = async (req, res) => {
  try {
    const { department } = req.params;
    const employees = await Employee.find({ department }).select('employeeID name position');
    
    if (employees.length === 0) {
      return res.status(404).json({ message: 'No employees found in this department' });
    }
    
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Enter daily points for an employee
 */
const enterDailyPoints = async (req, res) => {
  try {
    const { employeeID, points, salesAmount, date } = req.body;
    
    // Validate inputs
    if (!employeeID || !points) {
      return res.status(400).json({ message: 'Employee ID and points are required' });
    }
    
    // Check if employee exists
    const employee = await Employee.findOne({ employeeID });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    // Format date or use current date
    const performanceDate = date ? new Date(date) : new Date();
    
    // Check if a performance record already exists for this date
    let performance = await Performance.findOne({ 
      employeeID, 
      date: {
        $gte: new Date(performanceDate.setHours(0, 0, 0, 0)),
        $lt: new Date(performanceDate.setHours(23, 59, 59, 999))
      }
    });
    
    if (performance) {
      // Update existing record
      performance.points = points;
      if (salesAmount !== undefined) performance.salesAmount = salesAmount;
      await performance.save();
      
      return res.status(200).json({ 
        message: 'Performance points updated successfully',
        performance
      });
    }
    
    // Create new performance record
    performance = new Performance({
      employeeID,
      points,
      salesAmount: salesAmount || 0,
      date: performanceDate
    });
    
    await performance.save();
    
    res.status(201).json({ 
      message: 'Performance points recorded successfully',
      performance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get points for a specific employee
 */
const getEmployeePoints = async (req, res) => {
  try {
    const { employeeID } = req.params;
    const { startDate, endDate } = req.query;
    
    // Validate employee exists
    const employee = await Employee.findOne({ employeeID });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    // Build date filter
    const dateFilter = {};
    if (startDate) {
      dateFilter.$gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.$lte = new Date(endDate);
    }
    
    // Query with optional date range
    const query = { employeeID };
    if (Object.keys(dateFilter).length > 0) {
      query.date = dateFilter;
    }
    
    const performances = await Performance.find(query).sort({ date: -1 });
    
    // Calculate total points
    const totalPoints = performances.reduce((sum, record) => sum + record.points, 0);
    const totalSales = performances.reduce((sum, record) => sum + (record.salesAmount || 0), 0);
    
    res.status(200).json({
      employee: {
        id: employee.employeeID,
        name: employee.name,
        position: employee.position,
        department: employee.department
      },
      performances,
      summary: {
        totalPoints,
        totalSales,
        recordCount: performances.length
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get department leaderboard
 */
const getDepartmentLeaderboard = async (req, res) => {
  try {
    const { department } = req.params;
    const { period } = req.query; // 'daily', 'weekly', 'monthly'
    
    // Get date range based on period
    const today = new Date();
    let startDate;
    
    switch (period) {
      case 'weekly':
        // Start from last 7 days
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        break;
      case 'monthly':
        // Start from beginning of current month
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'daily':
      default:
        // Just today
        startDate = new Date(today.setHours(0, 0, 0, 0));
        break;
    }
    
    // First get all employees in the department
    const employees = await Employee.find({ department }).select('employeeID name position');
    
    if (employees.length === 0) {
      return res.status(404).json({ message: 'No employees found in this department' });
    }
    
    // Get all performances for these employees in the date range
    const employeeIDs = employees.map(emp => emp.employeeID);
    
    const performances = await Performance.aggregate([
      {
        $match: {
          employeeID: { $in: employeeIDs },
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$employeeID',
          totalPoints: { $sum: '$points' },
          totalSales: { $sum: '$salesAmount' },
          recordCount: { $sum: 1 }
        }
      },
      {
        $sort: { totalPoints: -1 }
      }
    ]);
    
    // Join employee details with performance results
    const leaderboard = performances.map(perf => {
      const employee = employees.find(emp => emp.employeeID === perf._id);
      return {
        employeeID: perf._id,
        name: employee.name,
        position: employee.position,
        totalPoints: perf.totalPoints,
        totalSales: perf.totalSales,
        recordCount: perf.recordCount
      };
    });
    
    res.status(200).json({
      department,
      period: period || 'daily',
      startDate,
      endDate: new Date(),
      leaderboard
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getEmployeesByDepartment,
  enterDailyPoints,
  getEmployeePoints,
  getDepartmentLeaderboard
};