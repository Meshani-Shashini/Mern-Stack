import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate, Link } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

const Login = () => {
    const navigate = useNavigate()
    const { login, loading, error, backendUrl } = useAppContext()
    const [signup, setSignup] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (signup) {
                if (formData.password !== formData.confirmPassword) {
                    toast.error('Passwords do not match')
                    return
                }
                // Handle signup through AppContext
                await login(formData.email, formData.password, true)
                toast.success('Registration successful! Please login.')
                setSignup(false)
            } else {
                // Handle login through AppContext
                await login(formData.email, formData.password)
                navigate('/ActionPage')
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'An error occurred')
        }
    }

    return (
        <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
            <img onClick={() => navigate('/')} src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />
            <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
                <h2 className='text-3xl font-semibold text-white text-center mb-3'>
                    {signup ? 'Sign Up' : 'Login'}
                </h2>

                <p className='text-center text-sm mb-6'>
                    {signup ? 'Create your account!' : 'Login to your account!'}
                </p>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {signup && (
                        <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                            <img src={assets.person_icon} alt="" />
                            <input 
                                name="name"
                                onChange={handleChange}
                                value={formData.name}
                                className='bg-transparent outline-none w-full'
                                type="text"
                                placeholder='Full Name'
                                required
                            />
                        </div>
                    )}

                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                        <img src={assets.mail_icon} alt="" />
                        <input 
                            name="email"
                            onChange={handleChange}
                            value={formData.email}
                            className='bg-transparent outline-none w-full'
                            type="email"
                            placeholder='Email ID'
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
                            required
                        />
                    </div>

                    {signup && (
                        <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                            <img src={assets.lock_icon} alt="" />
                            <input 
                                name="confirmPassword"
                                onChange={handleChange}
                                value={formData.confirmPassword}
                                className='bg-transparent outline-none w-full'
                                type="password"
                                placeholder='Confirm Password'
                                required
                            />
                        </div>
                    )}

                    {!signup && (
                        <div className="flex items-center justify-between mb-4">
                            <Link
                                to="/reset-password"
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                Forgot Password?
                            </Link>
                        </div>
                    )}

                    <button 
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium ${
                            loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {loading ? 'Please wait...' : signup ? 'Sign Up' : 'Login'}
                    </button>
                </form>

                <p className='text-gray-400 text-center text-x5 mt-4'>
                    {signup ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <span 
                        onClick={() => setSignup(!signup)} 
                        className='text-blue-400 cursor-pointer underline'
                    >
                        {signup ? 'Login' : 'Sign up'}
                    </span>
                </p>
            </div>
        </div>
    )
}

export default Login
