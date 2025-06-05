import express from 'express'
import { isAuthenticated, login, logout, register, resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail, getMe } from '../controllers/authController.js';
import { verifyToken } from '../middleware/userAuth.js';
import { protect } from '../middleware/auth.js';

const authRouter = express.Router();

// Public routes
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/send-verify-otp', verifyToken, sendVerifyOtp);
authRouter.post('/verify-account', verifyToken, verifyEmail);
authRouter.get('/is-auth', verifyToken, isAuthenticated);
authRouter.post('/send-reset-otp', sendResetOtp);
authRouter.post('/reset-password', resetPassword);

// Protected routes
authRouter.get('/me', protect, getMe);

export default authRouter;