import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Action = () => {
    const navigate = useNavigate();
    const { user } = useAppContext();

    const handleContinue = () => {
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-purple-400">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    Welcome, {user?.name}!
                </h1>
                
                <div className="space-y-4">
                    <p className="text-gray-600 text-center">
                        What would you like to do next?
                    </p>
                    
                    <div className="grid grid-cols-1 gap-4">
                        <button
                            onClick={() => navigate('/performance/new')}
                            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Add Performance Record
                        </button>
                        
                        <button
                            onClick={() => navigate('/performance/dashboard')}
                            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            View Performance Dashboard
                        </button>
                        
                        {user?.role === 'admin' && (
                            <button
                                onClick={() => navigate('/employees')}
                                className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                Manage Employees
                            </button>
                        )}
                        
                        <button
                            onClick={handleContinue}
                            className="w-full py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Action;