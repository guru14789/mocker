import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Box, Lock, Mail, User, ShieldCheck, ArrowRight, BookOpen } from 'lucide-react'

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'candidate' 
    })
    const { signup, loginWithGoogle } = useAuth()
    const navigate = useNavigate()
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            const data = await signup(formData)
            if (data.user.role === 'creator') navigate('/dashboard')
            else navigate('/candidate-dashboard') 
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        try {
            const data = await loginWithGoogle(formData.role)
            if (data.user?.role === 'creator') navigate('/dashboard')
            else navigate('/candidate-dashboard') 
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Google Signup failed')
        }
    }

    return (
        <div className="h-screen bg-white flex overflow-hidden font-outfit select-none">
            {/* Left Side: Auth Form */}
            <div className="flex-1 flex flex-col justify-center px-8 lg:px-20 py-2 relative">
                <div className="max-w-md w-full mx-auto">
                    {/* Brand */}
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                            <Box size={14} />
                        </div>
                        <span className="text-base font-black text-slate-900 tracking-tighter uppercase">Mocker</span>
                    </div>

                    <h1 className="text-2xl font-extrabold text-slate-900 mb-0.5">Create Account</h1>
                    <p className="text-slate-400 mb-3 text-xs font-semibold uppercase tracking-wider">Join our global community</p>

                    {error && <div className="bg-red-50 text-red-600 p-2 rounded-xl mb-3 text-[10px] font-bold border border-red-100">{error}</div>}

                    {/* Form Layout */}
                    <form onSubmit={handleSubmit} className="space-y-2.5">
                        <div className="space-y-0.5">
                            <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-1">Full Name</label>
                            <input 
                                type="text" 
                                required 
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all font-medium text-xs"
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                            />
                        </div>

                        <div className="space-y-0.5">
                            <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-1">Email Address</label>
                            <input 
                                type="email" 
                                required 
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all font-medium text-xs"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                            />
                        </div>

                        <div className="space-y-0.5">
                            <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-1">Password</label>
                            <input 
                                type="password" 
                                required 
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all font-medium text-xs"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={e => setFormData({...formData, password: e.target.value})}
                            />
                        </div>

                        <div className="space-y-1">
                            <span className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-1">I want to...</span>
                            <div className="grid grid-cols-2 gap-2">
                                <button 
                                    type="button"
                                    onClick={() => setFormData({...formData, role: 'candidate'})}
                                    className={`py-2 px-3 rounded-lg border-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                                        formData.role === 'candidate' ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                                    }`}
                                >
                                    Take Exams
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setFormData({...formData, role: 'creator'})}
                                    className={`py-2 px-3 rounded-lg border-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                                        formData.role === 'creator' ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                                    }`}
                                >
                                    Create Exams
                                </button>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-[.2em] hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 flex items-center justify-center group disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : 'Create Account'} <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={12} />
                        </button>
                    </form>

                    <div className="relative my-3">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-100"></div>
                        </div>
                        <div className="relative flex justify-center text-[8px] uppercase tracking-[.3em] font-black text-slate-300">
                            <span className="px-4 bg-white">Or join with Google</span>
                        </div>
                    </div>

                    <button 
                        type="button" 
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-bold text-slate-700 text-xs shadow-sm mb-4"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Join with Google
                    </button>

                    <p className="text-center text-[9px] font-black uppercase tracking-widest text-slate-300">
                        Already have an account? <Link to="/login" className="text-indigo-600 hover:underline">Log In</Link>
                    </p>
                </div>
            </div>

            {/* Right Side: Information/Illustration */}
            <div className="hidden lg:flex flex-col flex-1 bg-indigo-50 items-center justify-center p-8 relative">
                {/* Decorative Elements */}
                <div className="absolute top-8 right-8 flex flex-col items-end text-right">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-black uppercase tracking-[.2em] text-slate-900">Mocker Intelligence</span>
                        <BookOpen size={12} className="text-slate-900" />
                    </div>
                    <p className="text-slate-500 max-w-[150px] font-medium text-[10px] leading-tight">
                        Experience secure and intuitive assessments.
                    </p>
                </div>

                <div className="relative">
                    {/* Main Illustration */}
                    <img 
                        src="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=800"
                        alt="Workspace illustration" 
                        className="max-w-md w-full rounded-[2rem] shadow-2xl mix-blend-multiply opacity-80"
                    />
                    
                    {/* Floating Info Card */}
                    <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-[2rem] shadow-2xl max-w-xs border border-indigo-50">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white">
                                <Box size={16} />
                            </div>
                            <span className="font-bold text-slate-900 text-sm tracking-tight">Enterprise Ready</span>
                        </div>
                        <p className="text-slate-500 text-[10px] leading-relaxed font-medium">
                            Our architecture is designed to handle thousands of concurrent candidates with zero latency.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup
