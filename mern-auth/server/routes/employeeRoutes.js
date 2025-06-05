import express from 'express';
import Employee from '../models/Employee.js';
import bcrypt from 'bcryptjs';
import { verifyToken } from '../middleware/userAuth.js';
import { checkRole } from '../middleware/checkRole.js';

const router = express.Router();

// Get all employees (admin and manager only)
router.get('/', verifyToken, checkRole(['admin', 'manager']), async (req, res) => {
  try {
    const employees = await Employee.find().select('-password');
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get employees by department (admin and manager only)
router.get('/department/:dept', verifyToken, checkRole(['admin', 'manager']), async (req, res) => {
  try {
    const employees = await Employee.find({ department: req.params.dept }).select('-password');
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get employee by ID (admin, manager, and self)
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);
    
    // Allow access if user is admin, manager, or viewing their own profile
    if (user.role === 'admin' || user.role === 'manager' || req.params.id === user.employeeID) {
      const employee = await Employee.findOne({ employeeID: req.params.id }).select('-password');
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
      res.status(200).json(employee);
    } else {
      res.status(403).json({ message: 'Access denied' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new employee (admin only)
router.post('/', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const { employeeID, name, department, position, projectCode, coordinatorName, password } = req.body;
    
    // Check if employee already exists
    const existingEmployee = await Employee.findOne({ employeeID });
    if (existingEmployee) {
      return res.status(400).json({ message: 'Employee ID already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new employee
    const employee = new Employee({
      employeeID,
      name,
      department,
      position,
      projectCode,
      coordinatorName,
      password: hashedPassword
    });
    
    const savedEmployee = await employee.save();
    
    res.status(201).json({
      message: 'Employee created successfully',
      employee: {
        ...savedEmployee._doc,
        password: undefined
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update employee (admin and manager only)
router.put('/:id', verifyToken, checkRole(['admin', 'manager']), async (req, res) => {
  try {
    const { name, department, position, projectCode, coordinatorName, password } = req.body;
    const updateData = { name, department, position, projectCode, coordinatorName };
    
    // If password is provided, hash it
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }
    
    const employee = await Employee.findOneAndUpdate(
      { employeeID: req.params.id },
      updateData,
      { new: true }
    ).select('-password');
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    res.status(200).json({
      message: 'Employee updated successfully',
      employee
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete employee (admin only)
router.delete('/:id', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const employee = await Employee.findOneAndDelete({ employeeID: req.params.id });
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;