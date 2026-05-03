import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { CheckCircle2, XCircle, Loader2, Mail } from 'lucide-react'
import gsap from 'gsap'
import axios from 'axios'

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

const EmailVerification = () => {
    const [searchParams]   = useSearchParams()
    const navigate         = useNavigate()
    const [status, setStatus] = useState('loading') // loading | success | error | expired
    const [message, setMessage] = useState('')
    const cardRef = useRef(null)

    const token = searchParams.get('token')
    const id    = searchParams.get('id')

    useEffect(() => {
        gsap.fromTo(cardRef.current,
            { opacity: 0, y: 40, scale: 0.97 },
            { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out' }
        )
    }, [])

    useEffect(() => {
        const verify = async () => {
            if (!token || !id) {
                setStatus('error')
                setMessage('Invalid verification link. Please check your email and try again.')
                return
            }

            try {
                const res = await axios.get(`${API}/auth/verify-email`, { params: { token, id } })
                if (res.data.alreadyVerified) {
                    setStatus('success')
                    setMessage('Your email was already verified. You can log in now.')
                } else {
                    setStatus('success')
                    setMessage('Your email has been verified successfully! Your account is now active.')
                }
            } catch (err) {
                const msg = err.response?.data?.message || 'Verification failed'
                if (msg.toLowerCase().includes('expired')) {
                    setStatus('expired')
                } else {
                    setStatus('error')
                }
                setMessage(msg)
            }
        }
        verify()
    }, [token, id])

    const icons = {
        loading: <Loader2 size={44} className="text-indigo-500 animate-spin" />,
        success: <CheckCircle2 size={44} className="text-green-500" />,
        error:   <XCircle size={44} className="text-red-500" />,
        expired: <Mail size={44} className="text-amber-500" />,
    }

    const bgColors = {
        loading: 'bg-indigo-50',
        success: 'bg-green-50',
        error:   'bg-red-50',
        expired: 'bg-amber-50',
    }

    const titles = {
        loading: 'Verifying Your Email…',
        success: 'Email Verified!',
        error:   'Verification Failed',
        expired: 'Link Expired',
    }

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center font-outfit p-6">
            <div ref={cardRef} className="bg-white rounded-[2rem] shadow-2xl p-12 max-w-md w-full text-center border border-white/50">
                {/* Icon */}
                <div className={`w-20 h-20 ${bgColors[status]} rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-500`}>
                    {icons[status]}
                </div>

                {/* Branding */}
                <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="w-5 h-5 bg-slate-900 rounded-md flex items-center justify-center text-white">
                        <span className="text-[8px] font-black">M</span>
                    </div>
                    <span className="text-sm font-black text-slate-900 tracking-tighter uppercase">Mocker</span>
                </div>

                <h1 className="text-2xl font-black text-slate-900 mb-3">{titles[status]}</h1>

                {status !== 'loading' && (
                    <p className="text-slate-500 text-sm leading-relaxed mb-8">{message}</p>
                )}

                {status === 'loading' && (
                    <p className="text-slate-400 text-sm mb-8">Please wait while we verify your email address…</p>
                )}

                {/* Actions */}
                {status === 'success' && (
                    <div className="space-y-3">
                        <Link
                            to="/login"
                            className="block w-full bg-[#0F172A] text-white py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[.2em] hover:bg-slate-800 transition-all"
                        >
                            Go to Login →
                        </Link>
                    </div>
                )}

                {status === 'expired' && (
                    <div className="space-y-3">
                        <p className="text-xs text-slate-500 mb-4">Please go through the signup process again to get a new verification email.</p>
                        <Link
                            to="/signup"
                            className="block w-full bg-[#0F172A] text-white py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[.2em] hover:bg-slate-800 transition-all"
                        >
                            Sign Up Again
                        </Link>
                    </div>
                )}

                {status === 'error' && (
                    <div className="space-y-3">
                        <Link
                            to="/signup"
                            className="block w-full bg-[#0F172A] text-white py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[.2em] hover:bg-slate-800 transition-all"
                        >
                            Back to Sign Up
                        </Link>
                        <Link
                            to="/login"
                            className="block w-full bg-slate-50 text-slate-700 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[.2em] hover:bg-slate-100 transition-all border border-slate-100"
                        >
                            Go to Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default EmailVerification
