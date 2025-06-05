import { Link } from 'react-router-dom';

const Unauthorized = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
                <p className="text-gray-600 mb-6">
                    You don't have permission to access this page. Please contact your administrator if you believe this is a mistake.
                </p>
                <div className="space-y-4">
                    <Link
                        to="/dashboard"
                        className="block w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Go to Dashboard
                    </Link>
                    <Link
                        to="/"
                        className="block w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                    >
                        Go to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized; 