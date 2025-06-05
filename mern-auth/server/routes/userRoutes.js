import express from 'express';
import { verifyToken } from '../middleware/userAuth.js';
import { getUserData } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/data', verifyToken, getUserData); // Protect route with verifyToken middleware

export default userRouter;
