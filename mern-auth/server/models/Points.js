import mongoose from 'mongoose';

const pointsSchema = new mongoose.Schema({
  employeeID: {
    type: String,
    required: true,
    trim: true
  },
  points: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Points', pointsSchema);
