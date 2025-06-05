import mongoose from 'mongoose';

const performanceSchema = new mongoose.Schema({
    employeeID: {
        type: String,
        ref: 'Employee',
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    dailyPoints: {
        type: Number,
        required: true,
        min: 0
    },
    monthlyTarget: {
        type: Number,
        default: 24000
    },
    dailyTarget: {
        type: Number,
        default: 0
    },
    monthlyProgress: {
        type: Number,
        default: 0
    },
    dailyProgress: {
        type: Number,
        default: 0
    },
    salesAmount: {
        type: Number,
        default: 0
    },
    ratio: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

performanceSchema.pre('save', function(next) {
    // Calculate daily target based on month
    const daysInMonth = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDate();
    this.dailyTarget = this.monthlyTarget / daysInMonth;

    // Calculate daily progress percentage
    this.dailyProgress = (this.dailyPoints / this.dailyTarget) * 100;

    // Calculate ratio if sales amount exists
    if (this.salesAmount > 0) {
        this.ratio = (this.dailyPoints / this.salesAmount) * 100;
    }

    // Update timestamp
    this.updatedAt = Date.now();

    next();
});

// Static method to calculate monthly progress
performanceSchema.statics.calculateMonthlyProgress = async function(employeeID, year, month) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const performances = await this.find({
        employeeID,
        date: {
            $gte: startDate,
            $lte: endDate
        }
    });

    const totalPoints = performances.reduce((sum, perf) => sum + perf.dailyPoints, 0);
    const monthlyProgress = (totalPoints / 24000) * 100;

    return {
        totalPoints,
        monthlyProgress,
        performances
    };
};

export default mongoose.model('Performance', performanceSchema);

