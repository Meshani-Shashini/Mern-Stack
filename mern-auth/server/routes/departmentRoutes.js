import express from 'express';
import Department from '../models/Department.js';
import { verifyToken } from '../middleware/userAuth.js';

const router = express.Router();

// Get all departments
router.get('/', verifyToken, async (req, res) => {
  try {
    const departments = await Department.find();
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new department
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, description } = req.body;
    
    // Check if department already exists
    const existingDepartment = await Department.findOne({ name });
    if (existingDepartment) {
      return res.status(400).json({ message: 'Department already exists' });
    }
    
    // Create new department
    const department = new Department({
      name,
      description
    });
    
    const savedDepartment = await department.save();
    
    res.status(201).json({
      message: 'Department created successfully',
      department: savedDepartment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update department
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    );
    
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    
    res.status(200).json({
      message: 'Department updated successfully',
      department
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete department
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    
    res.status(200).json({ message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;