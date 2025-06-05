import mongoose, { model, Schema } from 'mongoose';

const userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {
        type: String,
        enum: ['admin', 'manager', 'employee'],
        default: 'employee'
    },
    department: {
        type: String,
        required: true
    },
    verifyOtp: {type: String, default: ''},
    verifyOtpExpireAt: {type: Number, default: 0},
    isAccountVerified: {type: Boolean, default: false},
    resetOtp: {type: String, default: ''},
    resetOtpExpireAt: {type: Number, default: 0},
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const userModel = mongoose.models.user || model('user', userSchema, 'users');

export default userModel;
