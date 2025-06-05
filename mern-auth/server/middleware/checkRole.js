import userModel from '../models/userModel.js';

export const checkRole = (allowedRoles) => {
    return async (req, res, next) => {
        try {
            const { userId } = req.body;
            
            if (!userId) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Authentication required' 
                });
            }

            const user = await userModel.findById(userId);
            
            if (!user) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'User not found' 
                });
            }

            if (!user.isAccountVerified) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Please verify your account first' 
                });
            }

            if (!allowedRoles.includes(user.role)) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'You do not have permission to access this resource' 
                });
            }

            next();
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                message: error.message 
            });
        }
    };
}; 