import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react'
import gsap from 'gsap'
import axios from 'axios'

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

const ForgotPassword = () => {
    const [email, setEmail]   = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent]     = useState(false)
    const [error, setError]   = useState(null)
    const cardRef = useRef(null)

    useEffect(() => {
        gsap.fromTo(cardRef.current,
            { opacity: 0, y: 40, scale: 0.97 },
            { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out' }
        )
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            await axios.post(`${API}/auth/forgot-password`, { email })
            setSent(true)
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.')
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
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-500 ${sent ? 'bg-green-50' : 'bg-slate-900'}`}>
                    {sent ? <CheckCircle2 size={32} className="text-green-500" /> : <KeyRound size={28} className="text-white" />}
                </div>

                {/* Branding */}
                <div className="flex items-center justify-center gap-2 mb-5">
                    <div className="w-5 h-5 bg-slate-900 rounded-md flex items-center justify-center text-white">
                        <span className="text-[8px] font-black">M</span>
                    </div>
                    <span className="text-sm font-black text-slate-900 tracking-tighter uppercase">Mocker</span>
                </div>

                {sent ? (
                    <div className="text-center">
                        <h1 className="text-2xl font-black text-slate-900 mb-3">Check Your Email</h1>
                        <p className="text-slate-500 text-sm leading-relaxed mb-8">
                            If an account with <strong className="text-slate-800">{email}</strong> exists,
                            we've sent a password reset link. Check your inbox and spam folder.
                        </p>
                        <div className="bg-slate-50 rounded-2xl p-4 text-left space-y-2 mb-8 border border-slate-100">
                            {['Open your email inbox', 'Click the "Reset Password" link', 'Set your new password and log in'].map((step, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-[9px] font-black text-indigo-600">{i + 1}</span>
                                    </div>
                                    <span className="text-xs text-slate-600 font-medium">{step}</span>
                                </div>
                            ))}
                        </div>
                        <Link
                            to="/login"
                            className="block w-full bg-[#0F172A] text-white py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[.2em] hover:bg-slate-800 transition-all text-center"
                        >
                            Back to Login
                        </Link>
                        <button
                            onClick={() => { setSent(false); setEmail('') }}
                            className="text-xs text-slate-400 font-bold hover:text-slate-700 mt-4 transition-colors"
                        >
                            Try a different email
                        </button>
                    </div>
                ) : (
                    <>
                        <h1 className="text-2xl font-black text-slate-900 mb-1 text-center">Forgot Password?</h1>
                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider text-center mb-8">
                            Enter your email to receive a reset link
                        </p>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-[10px] font-bold border border-red-100 flex items-center gap-2">
                                <AlertCircle size={12} /> {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[9px] uppercase tracking-widest font-black text-slate-400 ml-1">
                                    Registered Email Address
                                </label>
                                <div className="relative">
                                    <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="email" required
                                        className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all font-medium text-xs"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#0F172A] text-white py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[.2em] hover:bg-slate-800 transition-all shadow-md shadow-slate-100 flex items-center justify-center gap-2"
                            >
                                {loading ? 'Sending…' : 'Send Reset Link'}
                            </button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                            <p className="text-[10px] text-slate-400 font-medium">
                                Forgot your username instead?{' '}
                                <Link to="/forgot-username" className="text-slate-900 font-black hover:underline">
                                    Recover Username
                                </Link>
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default ForgotPassword
