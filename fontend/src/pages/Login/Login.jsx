import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    
   const API_URL = import.meta.env.VITE_BACKEND_URL+"/api";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validation
        if (!email || !password) {
            setError('Please fill in all fields');
            toast.error('Please fill in all fields');
            setLoading(false);
            return;
        }

        try {
            
            const response = await axios.post(`${API_URL}/admin/login`, {
                email: email,
                password: password
            });

            // Check if login was successful
            if (response.data.token) {
                // Save auth data to localStorage
                localStorage.setItem('authToken', response.data.token);
                localStorage.setItem('adminData', JSON.stringify(response.data.user));


                toast.success(response.data.message || 'Login successful!');
                
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1000);
            } else {
                setError('Login failed. Please try again.');
                toast.error('Login failed. Please try again.');
            }
        } catch (err) {
            console.error('Login error:', err);
            
            // Handle different error responses
            if (err.response) {
                // Server responded with error
                const errorMessage = err.response.data.message || 'Login failed';
                setError(errorMessage);
                toast.error(errorMessage);
                
                // Handle specific error codes
                if (err.response.status === 404) {
                    toast.error('User not found');
                } else if (err.response.status === 403) {
                    toast.error('Incorrect password');
                }
            } else if (err.request) {
                
                const errorMsg = 'Unable to connect to server. Please check your connection.';
                setError(errorMsg);
                toast.error(errorMsg);
            } else {
                
                const errorMsg = 'An unexpected error occurred. Please try again.';
                setError(errorMsg);
                toast.error(errorMsg);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Login Card */}
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-3xl shadow-2xl p-8 md:p-12 border border-slate-200">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
                            Welcome Admin!
                        </h1>
                        <p className="text-slate-600 text-sm md:text-base">
                            Enter your Credentials to access system
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <div className="space-y-5">
                        {/* Email Input */}
                        <div>
                            <label 
                                htmlFor="email" 
                                className="block text-sm font-semibold text-slate-700 mb-2"
                            >
                                Email address
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-slate-800 placeholder-slate-400"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label 
                                    htmlFor="password" 
                                    className="block text-sm font-semibold text-slate-700"
                                >
                                    Password
                                </label>
                                <button
                                    type="button"
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                                    onClick={() => toast.info('Forgot password feature coming soon!')}
                                >
                                    forgot password
                                </button>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    className="w-full px-4 py-3 pr-12 bg-white border-2 border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-slate-800 placeholder-slate-400"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                       

                        {/* Login Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-slate-400 to-slate-500 hover:from-slate-500 hover:to-slate-600 text-white py-3.5 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Logging in...
                                </span>
                            ) : (
                                'Login'
                            )}
                        </button>
                    </div>
                </div>

               
            </div>
        </div>
    );
}