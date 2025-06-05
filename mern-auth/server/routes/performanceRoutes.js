// routes/performanceRoutes.js
import express from 'express';
import Performance from '../models/Performance.js';
import Employee from '../models/Employee.js';
import { verifyToken } from '../middleware/userAuth.js';
import { checkRole } from '../middleware/checkRole.js';
import {
    addDailyPoints,
    getMonthlyPerformance,
    getDepartmentPerformance
} from '../controllers/performanceController.js';

const router = express.Router();

// Get all performance records (admin and manager only)
router.get('/', verifyToken, checkRole(['admin', 'manager']), async (req, res) => {
  try {
    const records = await Performance.find();
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get performance records by employee ID (admin, manager, and self)
router.get('/employee/:id', verifyToken, async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);
    
    // Allow access if user is admin, manager, or viewing their own records
    if (user.role === 'admin' || user.role === 'manager' || req.params.id === user.employeeID) {
      const records = await Performance.find({ employeeID: req.params.id });
      res.status(200).json(records);
    } else {
      res.status(403).json({ message: 'Access denied' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get performance records by date range (admin and manager only)
router.get('/date-range', verifyToken, checkRole(['admin', 'manager']), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const records = await Performance.find({
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    });
    
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new performance record (admin, manager, and self)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);
    const { employeeID, date, dailyPoints, salesAmount } = req.body;
    
    // Allow access if user is admin, manager, or creating their own record
    if (user.role === 'admin' || user.role === 'manager' || employeeID === user.employeeID) {
      // Check if employee exists
      const employee = await Employee.findOne({ employeeID });
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
      
      // Create new performance record
      const performance = new Performance({
        employeeID,
        date: date || new Date(),
        dailyPoints,
        salesAmount
      });
      
      const savedRecord = await performance.save();
      
      // Update employee's total points
      employee.points += dailyPoints;
      await employee.save();
      
      res.status(201).json({
        message: 'Performance record created successfully',
        performance: savedRecord
      });
    } else {
      res.status(403).json({ message: 'Access denied' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update performance record (admin and manager only)
router.put('/:id', verifyToken, checkRole(['admin', 'manager']), async (req, res) => {
  try {
    const { dailyPoints, salesAmount } = req.body;
    
    // Find the performance record
    const record = await Performance.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Performance record not found' });
    }
    
    // Calculate point difference
    const pointDifference = dailyPoints - record.dailyPoints;
    
    // Update the record
    record.dailyPoints = dailyPoints;
    record.salesAmount = salesAmount;
    const updatedRecord = await record.save();
    
    // Update employee's total points
    if (pointDifference !== 0) {
      const employee = await Employee.findOne({ employeeID: record.employeeID });
      if (employee) {
        employee.points += pointDifference;
        await employee.save();
      }
    }
    
    res.status(200).json({
      message: 'Performance record updated successfully',
      performance: updatedRecord
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete performance record (admin only)
router.delete('/:id', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const record = await Performance.findById(req.params.id);
    
    if (!record) {
      return res.status(404).json({ message: 'Performance record not found' });
    }
    
    // Update employee's total points
    const employee = await Employee.findOne({ employeeID: record.employeeID });
    if (employee) {
      employee.points -= record.dailyPoints;
      await employee.save();
    }
    
    await Performance.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: 'Performance record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add daily points (admin only)
router.post('/daily-points', verifyToken, addDailyPoints);

// Get employee's monthly performance
router.get('/employee/:employeeID', verifyToken, getMonthlyPerformance);

// Get department performance summary
router.get('/department/:department', verifyToken, getDepartmentPerformance);

export default router;