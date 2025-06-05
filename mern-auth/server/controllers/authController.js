import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';
import {EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE} from '../config/emailTemplates.js';

// Register new user
export const register = async (req, res) => {
    try {
        const { name, email, password, department } = req.body;

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new userModel({
            name,
            email,
            password: hashedPassword,
            department
        });

        await user.save();

        // Create token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Sending welcome email
        const mailOptions = {
            from:process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to Sri Lanka',
            text: `Welcome to Sri Lanka website. Your account has been created with email id: ${email}`
        }

        await transporter.sendMail(mailOptions);

        res.status(201).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Login user
export const login = async (req, res) => {
    try {
        console.log('Login request received:', {
            body: req.body,
            headers: req.headers,
            cookies: req.cookies
        });

        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            console.log('Missing credentials:', { email: !!email, password: !!password });
            return res.status(400).json({
                success: false,
                message: 'Please provide both email and password'
            });
        }

        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            console.log('User not found:', email);
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Invalid password for user:', email);
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Create token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Set cookie with proper settings
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: '/'
        });

        console.log('Login successful for user:', email);

        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get current user
export const getMe = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Logout user
export const logout = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0)
    });

    res.json({
        success: true,
        message: 'Logged out successfully'
    });
};

// Send Verification OTP to the User's Email
export const sendVerifyOtp = async (req, res) => {
    try {

        const {userId} = req.body;

        const user = await userModel.findById(userId);

        if(user.isAccountVerified){
            return res.json({success:false, message:"Account Already Verified"})
        }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000

    await user.save();

    const mailOption = {
        from:process.env.SENDER_EMAIL,
        to: user.email,
        subject: 'Account Verification OTP',
        //text: `Your OTP is ${otp}. Verify your account using this OTP.`
        html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
    }
    await transporter.sendMail(mailOption);

    res.json({success: true, message: 'Verification OTP Sent on Email'});

    } catch (error) {
        res.json ({ success: false, message: error.message});
    }
}

// Verify the Email using the OTP
export const verifyEmail = async (req, res) => {
    const {userId, otp} = req.body;

    if(!userId || !otp) {
        return res.json({ success: false, message: 'Missing Details'});
    }
    try {
        const user = await userModel.findById(userId);

        if(!user){
            return res.json({success: false, message: 'User not found'});
        }

        if(user.verifyOtp === '' || user.verifyOtp !== otp){
            return res.json({success: false, message: 'Invalid OPT'});
        }

        if(user.verifyOtpExpireAt < Date.now()){
            return res.json({success: false, message: 'OTP Expired'});
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();
        return res.json({ success: true, message: 'Email verified successfully'});
        
    } catch (error) {
        res.json ({ success: false, message: error.message}); 
    }
}

// Check if user is authenticated
export const isAuthenticated = async(req, res) => {
    try {
        return res.json({ success:true});
    } catch (error) {
        res.json({ success:false, message: error.message});
    }
}

// Send Password Reset OTP
export const sendResetOtp = async(req, res) =>{
    const {email} = req.body;

    if(!email){
        return res.json({ success:false, message: 'Email is required'});
    }

    try {
        
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({ success:false, message: 'User not found'});
        }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000

    await user.save();

    const mailOption = {
        from:process.env.SENDER_EMAIL,
        to: user.email,
        subject: 'Password reset OTP',
        //text: `Your OTP for resetting your password is ${otp}. USe this OTP to proceed with resetting your password.`
        html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
    };

    await transporter.sendMail(mailOption);

    return res.json({success: true, message: 'OTP sent to your email'});

    } catch (error) {
        return res.json({ success:false, message: error.message});
    }
}

// Reset User Password
export const resetPassword = async (req, res)=>{
    const {email, otp, newPassword} = req.body;

    if(!email || !otp || !newPassword) {
        return res.json({ success: false, message: 'Email, OTP, and new password are required'});
    }

    try {

        const user = await userModel.findOne({email});
        if(!user){
            return res.json({ success:false, message: 'User not found'});
        }
        
        if(user.resetOtp === "" || user.resetOtp !== otp){
            return res.json({ success: false, message: 'Invalid OTP'});
        }

        if(user.resetOtpExpireAt < Date.now()){
            return res.json({ success:false, message: 'OTP Expired'});
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;

        await user.save();

        return res.json({ success:true, message: 'Password has been reset successfully'});
        
    } catch (error) {
        return res.json({ success:false, message: error.message});
    }
}