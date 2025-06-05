import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';

import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import performanceRoutes from './routes/performanceRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import pointsRoutes from './routes/pointsRoutes.js';

const app = express();
const port = process.env.PORT || 4000;
connectDB();

const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS configuration
app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Set security headers
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Content-Security-Policy', "frame-ancestors 'none'");
    next();
});

// API Endpoints
app.get('/', (req, res) => res.send("API Working"));
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/employees', employeeRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/points', pointsRoutes);

app.listen(port, () => console.log(`Server started on PORT:${port}`));
