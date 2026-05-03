import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Box, ArrowRight, BookOpen, ChevronRight, ChevronLeft, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import gsap from 'gsap'

const Auth = () => {
    const location = useLocation()
    const [isLogin, setIsLogin] = useState(location.pathname !== '/signup')

    // ── Login state ──────────────────────────────────────────────────────
    const [loginIdentifier, setLoginIdentifier] = useState('') // username or email
    const [loginPassword, setLoginPassword]   = useState('')
    const [showLoginPwd, setShowLoginPwd]     = useState(false)

    // ── Signup state ─────────────────────────────────────────────────────
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        mobile: '',
        profile: 'aspirant',
        role: 'candidate',
    })
    const [showSignupPwd, setShowSignupPwd]     = useState(false)
    const [showConfirmPwd, setShowConfirmPwd]   = useState(false)

    const { login, signup, loginWithGoogle } = useAuth()
    const navigate = useNavigate()
    const [error, setError]     = useState(null)
    const [loading, setLoading] = useState(false)

    // Refs for animations
    const overlayRef    = useRef(null)
    const loginFormRef  = useRef(null)
    const signupFormRef = useRef(null)
    const timelineRef   = useRef(null)

    // Sync isLogin with route
    useEffect(() => {
        setIsLogin(location.pathname !== '/signup')
    }, [location.pathname])

    // ── Handle Login ─────────────────────────────────────────────────────
    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            const data = await login(loginIdentifier, loginPassword)
            if (!data.user?.profileCompleted) {
                navigate('/create-profile')
            } else {
                navigate('/dashboard')
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Login failed'
            if (err.response?.data?.requiresVerification) {
                navigate('/verify-pending', { state: { email: err.response.data.email } })
            } else {
                setError(msg)
            }
        } finally {
            setLoading(false)
        }
    }

    // ── Handle Signup ────────────────────────────────────────────────────
    const handleSignup = async (e) => {
        e.preventDefault()
        setError(null)

        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match')
        }
        if (formData.password.length < 6) {
            return setError('Password must be at least 6 characters')
        }

        setLoading(true)
        try {
            // Delay signup until policy is accepted
            // Pass the entire formData to the policy page
            navigate('/privacy-policy', { state: { signupData: formData } })
        } catch (err) {
            setError('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleAuth = async () => {
        try {
            const data = await loginWithGoogle(isLogin ? null : formData.role)
            if (!data.user?.profileCompleted) {
                navigate('/create-profile')
            } else {
                navigate('/dashboard')
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Google Auth failed')
        }
    }

    const toggleAuth = () => {
        setIsLogin(!isLogin)
        setError(null)
        navigate(isLogin ? '/signup' : '/login', { replace: true })
    }

    // ── GSAP Animation ───────────────────────────────────────────────────
    useEffect(() => {
        if (timelineRef.current) timelineRef.current.kill()

        const tl = gsap.timeline({
            defaults: { ease: 'power4.inOut', duration: 1.0, force3D: true }
        })
        timelineRef.current = tl

        if (isLogin) {
            tl.to(overlayRef.current, { xPercent: 100, borderRadius: '3rem 0 0 3rem', duration: 1.0 })
            tl.fromTo(loginFormRef.current, { xPercent: -10, opacity: 0 }, { xPercent: 0, opacity: 1, pointerEvents: 'auto' }, 0)
            tl.to(signupFormRef.current, { xPercent: 10, opacity: 0, pointerEvents: 'none' }, 0)
        } else {
            tl.to(overlayRef.current, { xPercent: 0, borderRadius: '0 3rem 3rem 0', duration: 1.0 })
            tl.fromTo(signupFormRef.current, { xPercent: 10, opacity: 0 }, { xPercent: 0, opacity: 1, pointerEvents: 'auto' }, 0)
            tl.to(loginFormRef.current, { xPercent: -10, opacity: 0, pointerEvents: 'none' }, 0)
        }

        return () => { if (timelineRef.current) timelineRef.current.kill() }
    }, [isLogin])

    // ── Shared input classes ─────────────────────────────────────────────
    const inputCls = 'w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all font-medium text-xs'
    const labelCls = 'text-[9px] uppercase tracking-widest font-black text-slate-400 ml-1'

    return (
        <div className="h-screen bg-slate-100 flex items-center justify-center font-outfit select-none overflow-hidden p-6 lg:p-12">
            {/* Back to Home */}
            <Link
                to="/"
                className="absolute top-8 left-8 z-[100] group flex items-center gap-3 bg-white hover:bg-slate-900 p-2 pr-5 rounded-full shadow-lg transition-all active:scale-95 border border-slate-200"
            >
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white group-hover:bg-indigo-500 transition-colors">
                    <ArrowLeft size={16} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white">Back to Home</span>
            </Link>

            <div className="w-full h-full max-w-[1240px] max-h-[840px] bg-white shadow-2xl lg:border lg:border-white/50 lg:rounded-[3rem] flex relative overflow-hidden transition-all duration-1000">

                {/* ── 1. Login Form (Left Side) ────────────────────────── */}
                <div ref={loginFormRef} className="flex-1 flex flex-col justify-center px-10 lg:px-20 py-6 z-10 relative will-change-transform">
                    <div className="max-w-md w-full mx-auto">
                        {/* Logo */}
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-6 h-6 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                                <Box size={14} />
                            </div>
                            <span className="text-base font-black text-slate-900 tracking-tighter uppercase">Mocker</span>
                        </div>
                        <h1 className="text-2xl font-extrabold text-slate-900 mb-0.5">Welcome Back</h1>
                        <p className="text-slate-400 mb-5 text-xs font-semibold uppercase tracking-wider">Access your dashboard</p>

                        {error && isLogin && (
                            <div className="bg-red-50 text-red-600 p-2 rounded-xl mb-3 text-[10px] font-bold border border-red-100">{error}</div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-3.5">
                            {/* Username or Email */}
                            <div className="space-y-1">
                                <label className={labelCls}>Username or Email</label>
                                <input
                                    type="text" required
                                    className={inputCls}
                                    placeholder="username or email@example.com"
                                    value={loginIdentifier}
                                    onChange={e => setLoginIdentifier(e.target.value)}
                                />
                            </div>

                            {/* Password */}
                            <div className="space-y-1">
                                <label className={labelCls}>Password</label>
                                <div className="relative">
                                    <input
                                        type={showLoginPwd ? 'text' : 'password'} required
                                        className={inputCls + ' pr-10'}
                                        placeholder="••••••••"
                                        value={loginPassword}
                                        onChange={e => setLoginPassword(e.target.value)}
                                    />
                                    <button type="button" onClick={() => setShowLoginPwd(!showLoginPwd)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors">
                                        {showLoginPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                </div>
                            </div>

                            {/* Forgot links */}
                            <div className="flex items-center justify-between py-0.5">
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" id="remember" className="w-2.5 h-2.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900" />
                                    <label htmlFor="remember" className="text-[9px] font-bold text-slate-400 cursor-pointer">Stay Signed In</label>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Link to="/forgot-username" className="text-[9px] font-bold text-slate-500 hover:text-slate-900 transition-colors">Forgot Username?</Link>
                                    <span className="text-slate-300">|</span>
                                    <Link to="/forgot-password" className="text-[9px] font-bold text-slate-900 hover:opacity-70 transition-opacity">Forgot Password?</Link>
                                </div>
                            </div>

                            <button type="submit" disabled={loading}
                                className="w-full bg-[#0F172A] text-white py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[.2em] hover:bg-slate-800 transition-all shadow-md shadow-slate-100 flex items-center justify-center group">
                                {loading ? 'Logging in...' : 'Enter Platform'}
                                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={12} />
                            </button>
                        </form>

                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                            <div className="relative flex justify-center text-[7px] uppercase tracking-[.3em] font-black text-slate-300">
                                <span className="px-4 bg-white">OR CONTINUE WITH</span>
                            </div>
                        </div>

                        <button type="button" onClick={handleGoogleAuth}
                            className="w-full flex items-center justify-center gap-3 py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-bold text-slate-700 text-xs shadow-sm">
                            <GoogleIcon />
                            Google Login
                        </button>
                    </div>
                </div>

                {/* ── 2. Signup Form (Right Side) ──────────────────────── */}
                <div ref={signupFormRef} className={`flex-1 flex flex-col justify-center px-10 lg:px-20 py-4 z-10 ${isLogin ? 'opacity-20 blur-sm grayscale' : ''} transition-all duration-1000 overflow-y-auto`}>
                    <div className="max-w-md w-full mx-auto">
                        {/* Logo */}
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                                <Box size={14} />
                            </div>
                            <span className="text-base font-black text-slate-900 tracking-tighter uppercase">Mocker</span>
                        </div>
                        <h1 className="text-2xl font-extrabold text-slate-900 mb-0.5">Registration</h1>
                        <p className="text-slate-400 mb-3 text-xs font-semibold uppercase tracking-wider">Create your free proctoring account</p>

                        {error && !isLogin && (
                            <div className="bg-red-50 text-red-600 p-2 rounded-xl mb-3 text-[10px] font-bold border border-red-100">{error}</div>
                        )}

                        <form onSubmit={handleSignup} className="space-y-2.5">
                            {/* Row: Username + Name */}
                            <div className="grid grid-cols-2 gap-2.5">
                                <div className="space-y-0.5">
                                    <label className={labelCls}>Username <span className="text-red-400">*</span></label>
                                    <input
                                        type="text" required
                                        className={inputCls}
                                        placeholder="johndoe123"
                                        value={formData.username}
                                        onChange={e => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s/g, '') })}
                                    />
                                </div>
                                <div className="space-y-0.5">
                                    <label className={labelCls}>Full Name</label>
                                    <input
                                        type="text"
                                        className={inputCls}
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-0.5">
                                <label className={labelCls}>Email ID <span className="text-red-400">*</span></label>
                                <input
                                    type="email" required
                                    className={inputCls}
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            {/* Mobile */}
                            <div className="space-y-0.5">
                                <label className={labelCls}>Mobile Number</label>
                                <input
                                    type="tel"
                                    className={inputCls}
                                    placeholder="+91 9876543210"
                                    value={formData.mobile}
                                    onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                                />
                            </div>

                            {/* Row: Password + Confirm Password */}
                            <div className="grid grid-cols-2 gap-2.5">
                                <div className="space-y-0.5">
                                    <label className={labelCls}>Password <span className="text-red-400">*</span></label>
                                    <div className="relative">
                                        <input
                                            type={showSignupPwd ? 'text' : 'password'} required
                                            className={inputCls + ' pr-10'}
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        />
                                        <button type="button" onClick={() => setShowSignupPwd(!showSignupPwd)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors">
                                            {showSignupPwd ? <EyeOff size={12} /> : <Eye size={12} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-0.5">
                                    <label className={labelCls}>Confirm Password <span className="text-red-400">*</span></label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPwd ? 'text' : 'password'} required
                                            className={`${inputCls} pr-10 ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-300 focus:border-red-500' : ''}`}
                                            placeholder="••••••••"
                                            value={formData.confirmPassword}
                                            onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        />
                                        <button type="button" onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors">
                                            {showConfirmPwd ? <EyeOff size={12} /> : <Eye size={12} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Profile Selector */}
                            <div className="space-y-0.5">
                                <span className={labelCls}>Profile <span className="text-red-400">*</span></span>
                                <div className="relative flex bg-slate-50 p-1 rounded-xl border border-slate-100">
                                    <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#0F172A] rounded-lg transition-all duration-300 ease-out z-0 ${formData.profile === 'academy' ? 'translate-x-full' : 'translate-x-0'}`} />
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, profile: 'aspirant', role: 'candidate' })}
                                        className={`relative flex-1 py-2 text-[9px] font-black uppercase tracking-widest z-10 transition-colors ${formData.profile === 'aspirant' ? 'text-white' : 'text-slate-400'}`}
                                    >
                                        Aspirant
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, profile: 'academy', role: 'creator' })}
                                        className={`relative flex-1 py-2 text-[9px] font-black uppercase tracking-widest z-10 transition-colors ${formData.profile === 'academy' ? 'text-white' : 'text-slate-400'}`}
                                    >
                                        Academy
                                    </button>
                                </div>
                            </div>

                            <button type="submit" disabled={loading}
                                className="w-full bg-[#0F172A] text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-[.2em] hover:bg-slate-800 transition-all shadow-md shadow-slate-100 flex items-center justify-center group">
                                {loading ? 'Registering...' : 'Continue to Policy'}
                                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={12} />
                            </button>
                        </form>

                        <div className="relative my-3">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                            <div className="relative flex justify-center text-[7px] uppercase tracking-[.3em] font-black text-slate-300">
                                <span className="px-4 bg-white">QUICK REGISTRATION</span>
                            </div>
                        </div>
                        <button type="button" onClick={handleGoogleAuth}
                            className="w-full flex items-center justify-center gap-3 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-bold text-slate-700 text-xs shadow-sm">
                            <GoogleIcon />
                            Google Signup
                        </button>
                    </div>
                </div>

                {/* ── 3. Sliding Overlay Panel ──────────────────────────── */}
                <div
                    ref={overlayRef}
                    className="absolute top-0 left-0 w-1/2 h-full bg-[#0F172A] z-50 flex items-center justify-center shadow-[-20px_0_40px_rgba(0,0,0,0.1)]"
                    style={{ transform: 'translateX(0%)' }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1E293B] to-[#0F172A] opacity-95" />

                    <div className="relative z-10 text-center px-16 max-w-sm">
                        {isLogin ? (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right duration-1000">
                                <h2 className="text-3xl font-black text-white leading-tight">First Time Here?</h2>
                                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                                    Unlock powerful proctoring tools and secure examinations. Join Mocker today.
                                </p>
                                <button
                                    onClick={toggleAuth}
                                    className="px-10 py-3 bg-white text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-2 mx-auto active:scale-95 shadow-xl"
                                >
                                    Create Account <ChevronRight size={14} />
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-in fade-in slide-in-from-left duration-1000">
                                <h2 className="text-3xl font-black text-white leading-tight">Established User?</h2>
                                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                                    Welcome back to your proctoring command center. Your assessments are waiting.
                                </p>
                                <button
                                    onClick={toggleAuth}
                                    className="px-10 py-3 bg-white text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-2 mx-auto active:scale-95 shadow-xl"
                                >
                                    <ChevronLeft size={14} /> Log In Now
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Branding Footer */}
                    <div className="absolute bottom-12 left-0 right-0 flex items-center justify-center gap-8 text-white/30 px-12">
                        <div className="flex items-center gap-2">
                            <BookOpen size={12} />
                            <span className="text-[8px] font-black uppercase tracking-widest">Enterprise Intel</span>
                        </div>
                        <div className="h-px flex-1 bg-white/10" />
                        <span className="text-[8px] font-black uppercase tracking-widest opacity-50">v.1.4.2</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

const GoogleIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
)

export default Auth
