import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AppContext = createContext();

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppContextProvider');
    }
    return context;
};

export const AppContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

    // Configure axios defaults
    axios.defaults.withCredentials = true;

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/auth/me`);
            if (response.data.success) {
                setUser(response.data.user);
                setIsLoggedIn(true);
            } else {
                setUser(null);
                setIsLoggedIn(false);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            setUser(null);
            setIsLoggedIn(false);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password, isSignup = false) => {
        try {
            setLoading(true);
            setError(null);
            console.log('Attempting login with:', { email, backendUrl });

            if (isSignup) {
                const response = await axios.post(
                    `${backendUrl}/api/auth/register`,
                    { email, password },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        withCredentials: true
                    }
                );
                return response.data;
            }

            const response = await axios.post(
                `${backendUrl}/api/auth/login`,
                { email, password },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );

            console.log('Login response:', response.data);

            if (response.data.success) {
                const { user } = response.data;
                setUser(user);
                setIsLoggedIn(true);
                return response.data;
            } else {
                setError(response.data.message || 'Login failed');
                throw new Error(response.data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            setError(error.response?.data?.message || 'An error occurred during login');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.post(`${backendUrl}/api/auth/register`, userData);

            if (response.data.success) {
                const { user } = response.data;
                setUser(user);
                setIsLoggedIn(true);
                return response.data;
            } else {
                setError(response.data.message || 'Registration failed');
                throw new Error(response.data.message || 'Registration failed');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred during registration');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await axios.post(`${backendUrl}/api/auth/logout`);
            setUser(null);
            setIsLoggedIn(false);
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            // Still clear the local state even if the server request fails
            setUser(null);
            setIsLoggedIn(false);
            navigate('/login');
        }
    };

    const value = {
        user,
        loading,
        error,
        isLoggedIn,
        login,
        register,
        logout,
        backendUrl
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export { AppContext };