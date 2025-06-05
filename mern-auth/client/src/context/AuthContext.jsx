import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await axios.get('/api/auth/me', { withCredentials: true });
            if (response.data.success) {
                setUser(response.data.user);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post('/api/auth/login', 
                { email, password },
                { withCredentials: true }
            );
            
            if (response.data.success) {
                setUser(response.data.user);
                return { success: true };
            }
            return { success: false, message: response.data.message };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const logout = async () => {
        try {
            await axios.post('/api/auth/logout', {}, { withCredentials: true });
            setUser(null);
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Logout failed'
            };
        }
    };

    const value = {
        user,
        loading,
        login,
        logout,
        checkAuth
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext; 