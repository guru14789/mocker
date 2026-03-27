import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Box, Lock, Mail, User, ShieldCheck, ArrowRight, BookOpen, ChevronLeft } from 'lucide-react'

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
        <div className="min-h-screen relative flex items-center justify-center p-4 md:p-8 font-outfit overflow-hidden">
            {/* Full Page Hero Background */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="/landing-hero.png" 
                    className="w-full h-full object-cover object-bottom scale-110 opacity-40 md:opacity-100" 
                    alt="Background" 
                />
                <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[4px]"></div>
            </div>

            {/* Back to Home Floating Button */}
            <Link to="/" className="absolute top-8 left-8 z-20 flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-2xl hover:scale-105 transition-all text-xs font-black uppercase tracking-widest text-[#0F172A]">
                <ChevronLeft size={16} /> Back to Home
            </Link>

            {/* Main Auth Container (Mockup inspired layout) */}
            <div className="relative z-10 w-full max-w-6xl h-auto md:h-[750px] bg-white rounded-[4rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] flex flex-col md:flex-row overflow-hidden border border-white/50">
                
                {/* Left Side: Established User Banner */}
                <div className="hidden md:flex flex-col w-1/2 bg-[#0F172A] relative items-center justify-center p-16 text-center">
                    <div className="relative z-10">
                        <h2 className="text-5xl font-black text-white mb-8 tracking-tighter">Established User?</h2>
                        <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-sm mx-auto mb-12">
                            Welcome back to your proctoring command center. Your assessments are waiting.
                        </p>
                        <Link to="/login" className="inline-flex items-center gap-3 bg-white text-[#0F172A] px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-all shadow-2xl">
                            <ChevronLeft size={18} /> Log In Now
                        </Link>
                    </div>

                    {/* Footer Info */}
                    <div className="absolute bottom-10 left-10 right-10 flex items-center justify-between opacity-30 text-[10px] font-black uppercase tracking-widest text-white">
                        <div className="flex items-center gap-2">
                            <BookOpen size={14} />
                            <span>Enterprise Intel</span>
                        </div>
                        <div className="flex-1 border-t border-white/20 mx-10"></div>
                        <span>V.1.4.2</span>
                    </div>
                </div>

                {/* Right Side: Signup Form */}
                <div className="w-full md:w-1/2 flex flex-col p-8 md:p-12 lg:p-16 overflow-y-auto">
                    <div className="flex items-center gap-2 mb-10">
                        <div className="w-10 h-10 bg-[#0F172A] rounded-xl flex items-center justify-center text-white">
                            <Box size={20} />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-[#0F172A]">MOCKER</span>
                    </div>

                    <div className="flex-1">
                        <h2 className="text-3xl font-black text-[#0F172A] mb-2">Registration</h2>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-8">Create your free proctoring account</p>

                        {error && <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-xs font-bold border border-red-100">{error}</div>}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase tracking-widest font-black text-slate-300 ml-1">Full Name</label>
                                <input 
                                    type="text" 
                                    required 
                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-slate-950/5 focus:border-slate-950 transition-all font-bold text-sm text-slate-900"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase tracking-widest font-black text-slate-300 ml-1">Email Address</label>
                                <input 
                                    type="email" 
                                    required 
                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-slate-950/5 focus:border-slate-950 transition-all font-bold text-sm text-slate-900"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase tracking-widest font-black text-slate-300 ml-1">Password</label>
                                <input 
                                    type="password" 
                                    required 
                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-slate-950/5 focus:border-slate-950 transition-all font-bold text-sm text-slate-900"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={e => setFormData({...formData, password: e.target.value})}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <span className="text-[10px] uppercase tracking-widest font-black text-slate-300 ml-1">Platform Role</span>
                                <div className="grid grid-cols-2 gap-3">
                                    <button 
                                        type="button"
                                        onClick={() => setFormData({...formData, role: 'candidate'})}
                                        className={`py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border-2 ${
                                            formData.role === 'candidate' ? 'bg-[#0F172A] border-[#0F172A] text-white shadow-lg' : 'bg-white border-slate-50 text-slate-300 hover:border-slate-100'
                                        }`}
                                    >
                                        Candidate
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setFormData({...formData, role: 'creator'})}
                                        className={`py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border-2 ${
                                            formData.role === 'creator' ? 'bg-[#0F172A] border-[#0F172A] text-white shadow-lg' : 'bg-white border-slate-50 text-slate-300 hover:border-slate-100'
                                        }`}
                                    >
                                        Creator
                                    </button>
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="w-full bg-[#0F172A] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center group">
                                {loading ? 'Initializing...' : 'Complete Signup'} <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={14} />
                            </button>
                        </form>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-100"></div>
                            </div>
                            <div className="relative flex justify-center text-[7px] uppercase tracking-[.4em] font-black text-slate-200">
                                <span className="px-4 bg-white">Quick Registration</span>
                            </div>
                        </div>

                        <button 
                            type="button" 
                            onClick={handleGoogleLogin}
                            className="w-full flex items-center justify-center gap-3 py-4 bg-white border-2 border-slate-50 rounded-2xl hover:bg-slate-50 transition-all font-black text-slate-900 text-xs shadow-sm"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            Google Signup
                        </button>
                        
                        <div className="md:hidden mt-8 text-center">
                            <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-[#0F172A] hover:underline">
                                Already have an account? Log In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup
