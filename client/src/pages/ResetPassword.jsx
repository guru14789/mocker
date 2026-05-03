import React, { useState, useRef, useEffect } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff, CheckCircle2, AlertCircle, Lock } from 'lucide-react'
import gsap from 'gsap'
import axios from 'axios'

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

const ResetPassword = () => {
    const [searchParams] = useSearchParams()
    const navigate        = useNavigate()

    const token = searchParams.get('token')
    const id    = searchParams.get('id')

    const [newPassword, setNewPassword]         = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showNew, setShowNew]                 = useState(false)
    const [showConfirm, setShowConfirm]         = useState(false)
    const [loading, setLoading]                 = useState(false)
    const [success, setSuccess]                 = useState(false)
    const [error, setError]                     = useState(null)
    const cardRef = useRef(null)

    useEffect(() => {
        gsap.fromTo(cardRef.current,
            { opacity: 0, y: 40, scale: 0.97 },
            { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out' }
        )
    }, [])

    // Strength indicator
    const getStrength = (pwd) => {
        if (!pwd) return { level: 0, label: '', color: '' }
        let score = 0
        if (pwd.length >= 8) score++
        if (/[A-Z]/.test(pwd)) score++
        if (/[0-9]/.test(pwd)) score++
        if (/[^A-Za-z0-9]/.test(pwd)) score++
        const map = [
            { level: 0, label: '', color: '' },
            { level: 1, label: 'Weak', color: 'bg-red-400' },
            { level: 2, label: 'Fair', color: 'bg-amber-400' },
            { level: 3, label: 'Good', color: 'bg-yellow-400' },
            { level: 4, label: 'Strong', color: 'bg-green-500' },
        ]
        return map[score]
    }
    const strength = getStrength(newPassword)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (newPassword !== confirmPassword) return setError('Passwords do not match')
        if (newPassword.length < 6) return setError('Password must be at least 6 characters')
        if (!token || !id) return setError('Invalid reset link. Please request a new one.')

        setLoading(true)
        setError(null)
        try {
            await axios.post(`${API}/auth/reset-password`, { token, id, newPassword })
            setSuccess(true)
            setTimeout(() => navigate('/login'), 3000)
        } catch (err) {
            setError(err.response?.data?.message || 'Reset failed. The link may have expired.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center font-outfit p-6">
            {/* Back */}
            <Link
                to="/login"
                className="absolute top-8 left-8 z-[100] group flex items-center gap-3 bg-white hover:bg-slate-900 p-2 pr-5 rounded-full shadow-lg transition-all active:scale-95 border border-slate-200"
            >
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white group-hover:bg-indigo-500 transition-colors">
                    <ArrowLeft size={16} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white">Back to Login</span>
            </Link>

            <div ref={cardRef} className="bg-white rounded-[2rem] shadow-2xl p-10 max-w-md w-full border border-white/50">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-500 ${success ? 'bg-green-50' : 'bg-slate-900'}`}>
                    {success ? <CheckCircle2 size={32} className="text-green-500" /> : <Lock size={28} className="text-white" />}
                </div>

                {/* Branding */}
                <div className="flex items-center justify-center gap-2 mb-5">
                    <div className="w-5 h-5 bg-slate-900 rounded-md flex items-center justify-center text-white">
                        <span className="text-[8px] font-black">M</span>
                    </div>
                    <span className="text-sm font-black text-slate-900 tracking-tighter uppercase">Mocker</span>
                </div>

                {success ? (
                    <div className="text-center">
                        <h1 className="text-2xl font-black text-slate-900 mb-3">Password Reset!</h1>
                        <p className="text-slate-500 text-sm leading-relaxed mb-8">
                            Your password has been changed successfully. You'll be redirected to the login page in a moment.
                        </p>
                        <Link
                            to="/login"
                            className="block w-full bg-[#0F172A] text-white py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[.2em] hover:bg-slate-800 transition-all text-center"
                        >
                            Go to Login →
                        </Link>
                    </div>
                ) : (
                    <>
                        {(!token || !id) ? (
                            <div className="text-center">
                                <h1 className="text-2xl font-black text-slate-900 mb-3">Invalid Link</h1>
                                <p className="text-slate-500 text-sm mb-6">This reset link is invalid or has expired.</p>
                                <Link to="/forgot-password" className="block w-full bg-[#0F172A] text-white py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[.2em] hover:bg-slate-800 transition-all text-center">
                                    Request New Link
                                </Link>
                            </div>
                        ) : (
                            <>
                                <h1 className="text-2xl font-black text-slate-900 mb-1 text-center">Reset Password</h1>
                                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider text-center mb-8">
                                    Create a new secure password
                                </p>

                                {error && (
                                    <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-[10px] font-bold border border-red-100 flex items-center gap-2">
                                        <AlertCircle size={12} /> {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* New Password */}
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] uppercase tracking-widest font-black text-slate-400 ml-1">New Password</label>
                                        <div className="relative">
                                            <input
                                                type={showNew ? 'text' : 'password'} required
                                                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all font-medium text-xs pr-10"
                                                placeholder="••••••••"
                                                value={newPassword}
                                                onChange={e => setNewPassword(e.target.value)}
                                            />
                                            <button type="button" onClick={() => setShowNew(!showNew)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors">
                                                {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                                            </button>
                                        </div>
                                        {/* Strength Bar */}
                                        {newPassword && (
                                            <div className="mt-1.5 space-y-1">
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4].map(i => (
                                                        <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength.level ? strength.color : 'bg-slate-100'}`} />
                                                    ))}
                                                </div>
                                                {strength.label && (
                                                    <p className="text-[9px] font-black text-slate-400 ml-1">{strength.label}</p>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] uppercase tracking-widest font-black text-slate-400 ml-1">Confirm New Password</label>
                                        <div className="relative">
                                            <input
                                                type={showConfirm ? 'text' : 'password'} required
                                                className={`w-full px-4 py-3.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-600/5 transition-all font-medium text-xs pr-10 ${confirmPassword && newPassword !== confirmPassword ? 'border-red-300 focus:border-red-500' : 'border-slate-100 focus:border-indigo-600'}`}
                                                placeholder="••••••••"
                                                value={confirmPassword}
                                                onChange={e => setConfirmPassword(e.target.value)}
                                            />
                                            <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors">
                                                {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                                            </button>
                                        </div>
                                        {confirmPassword && newPassword !== confirmPassword && (
                                            <p className="text-[9px] text-red-500 font-bold ml-1">Passwords do not match</p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-[#0F172A] text-white py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[.2em] hover:bg-slate-800 transition-all shadow-md shadow-slate-100 flex items-center justify-center gap-2"
                                    >
                                        {loading ? 'Resetting…' : 'Reset Password'}
                                    </button>
                                </form>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default ResetPassword
