import { Routes, Route, Navigate } from 'react-router-dom';
import { AppContextProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/EmployeeList';
import EmployeeForm from './pages/EmployeeForm';
import PerformanceForm from './pages/PerformanceForm';
import PerformanceDashboard from './pages/PerformanceDashboard';
import Reports from './pages/Reports';
import Unauthorized from './pages/Unauthorized';
import EmailVerify from './pages/EmailVerify';
import ResetPassword from './pages/ResetPassword';
import ActionPage from './pages/ActionPage';
import EnterPointsPage from './pages/EnterPointsPage';
import EditEmployeePage from './pages/EditEmployeePage';
import GenerateReportPage from './pages/GenerateReportPage';

function App() {
    return (
        <AuthProvider>
            <AppContextProvider>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />
                    <Route path="/ActionPage" element={<ActionPage />} />
                    <Route path="/enter-points" element={<EnterPointsPage />} />
                    <Route path="/edit-employee" element={<EditEmployeePage />} />
                    <Route path="/generate-report" element={<GenerateReportPage />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/verify-email" element={<EmailVerify />} />
                    <Route path="/employees" element={<EmployeeList />} />
                    <Route path="/employees/new" element={<EmployeeForm />} />
                    <Route path="/employees/:id/edit" element={<EmployeeForm />} />
                    <Route path="/performance/new" element={<PerformanceForm />} />
                    <Route path="/performance/dashboard" element={<PerformanceDashboard />} />
                    <Route path="/reports" element={<Reports />} /> 

                </Routes>
            </AppContextProvider>
        </AuthProvider>
    );
}

export default App;
