import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const { register, loading, error } = useAppContext();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        try {
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
        } catch (error) {
            // Error is handled by the context
            console.error('Registration failed:', error);
        }
    };

    return (
        <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
            <img 
                onClick={() => navigate('/')} 
                src={assets.logo} 
                alt="" 
                className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' 
            />
            <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
                <h2 className='text-3xl font-semibold text-white text-center mb-3'>
                    Create Account
                </h2>

                <p className='text-center text-sm mb-6'>Create your account</p>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                        <img src={assets.person_icon} alt="" />
                        <input
                            name="name"
                            onChange={handleChange}
                            value={formData.name}
                            className='bg-transparent outline-none w-full'
                            type="text"
                            placeholder='Full Name'
                            autoComplete="name"
                            required
                        />
                    </div>

                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                        <img src={assets.mail_icon} alt="" />
                        <input
                            name="email"
                            onChange={handleChange}
                            value={formData.email}
                            className='bg-transparent outline-none w-full'
                            type="email"
                            placeholder='Email ID'
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                        <img src={assets.lock_icon} alt="" />
                        <input
                            name="password"
                            onChange={handleChange}
                            value={formData.password}
                            className='bg-transparent outline-none w-full'
                            type="password"
                            placeholder='Password'
                            autoComplete="new-password"
                            required
                        />
                    </div>

                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                        <img src={assets.lock_icon} alt="" />
                        <input
                            name="confirmPassword"
                            onChange={handleChange}
                            value={formData.confirmPassword}
                            className='bg-transparent outline-none w-full'
                            type="password"
                            placeholder='Confirm Password'
                            autoComplete="new-password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium ${
                            loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <p className='text-gray-400 text-center text-x5 mt-4'>
                    Already have an account?{' '}
                    <Link to="/login" className='text-blue-400 cursor-pointer underline'>
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register; 