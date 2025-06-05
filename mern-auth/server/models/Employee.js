import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
    employeeID: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim:true
    },
    department: {
        type: String,
        required: true,
        enum: ['MKT 1', 'MKT 2', 'MKT3', 'MKT4']
    },
    position: {
        type: String,
        required: true,
        trim: true
    },
    points: {
        type: Number,
        default: 0
    },
    projectCode: {
        type: String,
        trim: true
    },
    coordinatorName: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    updateAt: {
        type: Date,
        default: Date.now
    }
});

employeeSchema.pre('save', function(next) {
    this.updateAt = Date.now();
    next();
});

export default mongoose.model('Employee', employeeSchema);