import express from 'express';
import Points from '../models/Points.js';
import Employee from '../models/Employee.js';

const router = express.Router();

// Submit new points
router.post('/submit', async (req, res) => {
  try {
    const { employeeID, points, date, description } = req.body;

    // Check if employee exists
    const employee = await Employee.findOne({ employeeID });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Save points entry
    const newPoints = new Points({ employeeID, points, date, description });
    await newPoints.save();

    // Update total points in employee record
    employee.points += points;
    employee.updateAt = Date.now();
    await employee.save();

    res.status(200).json({ message: 'Points submitted successfully', newPoints });
  } catch (error) {
    console.error('Error submitting points:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all points entries
router.get('/', async (req, res) => {
  try {
    const allPoints = await Points.find().sort({ createdAt: -1 });
    res.status(200).json(allPoints);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch points' });
  }
});

export default router;
