import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ShieldCheck, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react'
import gsap from 'gsap'
import axios from 'axios'

const PrivacyPolicy = () => {
    const navigate   = useNavigate()
    const location   = useLocation()
    const { signup } = useAuth()
    const signupData = location.state?.signupData
    const pendingEmail = signupData?.email || ''

    const [accepted, setAccepted]     = useState(false)
    const [loading, setLoading]       = useState(false)
    const [sent, setSent]             = useState(false)
    const [error, setError]           = useState(null)
    const [scrolledEnd, setScrolledEnd] = useState(false)

    const cardRef     = useRef(null)
    const policyRef   = useRef(null)

    useEffect(() => {
        if (!signupData) {
            navigate('/signup')
        }
        gsap.fromTo(cardRef.current,
            { opacity: 0, y: 40, scale: 0.97 },
            { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out' }
        )
    }, [signupData, navigate])

    // Track if user scrolled to bottom
    const handleScroll = (e) => {
        const el = e.target
        const isAtBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 40
        if (isAtBottom) setScrolledEnd(true)
    }

    const handleAccept = async () => {
        if (!accepted) return setError('Please tick the checkbox to confirm you have read and accepted the policy.')
        setLoading(true)
        setError(null)
        try {
            // Finalize registration
            await signup(signupData)
            setSent(true)
        } catch (err) {
            const msg = err.response?.data?.message || 'Registration failed. Please try again.'
            setError(msg)
        } finally {
            setLoading(false)
        }
    }

    if (sent) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center font-outfit p-6">
                <div ref={cardRef} className="bg-white rounded-[2rem] shadow-2xl p-12 max-w-md w-full text-center border border-white/50">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={40} className="text-green-500" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 mb-2">Verify Your Email</h1>
                    <p className="text-slate-500 text-sm leading-relaxed mb-8">
                        A verification link has been sent to <br />
                        <strong className="text-slate-800">{pendingEmail}</strong>.<br /><br />
                        Please open your email and click the link to activate your account.
                    </p>
                    <div className="bg-slate-50 rounded-2xl p-4 text-left space-y-2 mb-8 border border-slate-100">
                        <div className="flex items-start gap-3">
                            <div className="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-[9px] font-black text-indigo-600">1</span>
                            </div>
                            <span className="text-xs text-slate-600 font-medium">Open your inbox for <strong>{pendingEmail}</strong></span>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-[9px] font-black text-indigo-600">2</span>
                            </div>
                            <span className="text-xs text-slate-600 font-medium">Click the verification link in the email</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-[9px] font-black text-indigo-600">3</span>
                            </div>
                            <span className="text-xs text-slate-600 font-medium">Your account will be activated and you can log in</span>
                        </div>
                    </div>

                    {/* Development Mode Helper */}
                    {import.meta.env.MODE === 'development' && (
                        <div className="mb-8 p-4 bg-amber-50 border border-amber-100 rounded-2xl text-left">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertCircle size={14} className="text-amber-600" />
                                <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider">Developer Sandbox</span>
                            </div>
                            <p className="text-[11px] text-amber-700 leading-relaxed mb-3">
                                Since you are in development mode and using Ethereal (test emails), you can skip the inbox and use the link below:
                            </p>
                            <button
                                onClick={() => navigate('/login')}
                                className="text-[10px] font-black text-indigo-600 underline hover:text-indigo-800 break-all"
                            >
                                [ Note: Verification links are printed to the SERVER console. Check your terminal for the Preview URL! ]
                            </button>
                        </div>
                    )}

                    <Link
                        to="/login"
                        className="block w-full bg-[#0F172A] text-white py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[.2em] hover:bg-slate-800 transition-all text-center"
                    >
                        Go to Login
                    </Link>
                    <p className="text-xs text-slate-400 mt-4">
                        Didn't receive the email?{' '}
                        <button
                            onClick={handleAccept}
                            className="text-indigo-600 font-bold hover:underline"
                        >
                            Resend
                        </button>
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center font-outfit p-6">
            {/* Back */}
            <Link
                to="/signup"
                className="absolute top-8 left-8 z-[100] group flex items-center gap-3 bg-white hover:bg-slate-900 p-2 pr-5 rounded-full shadow-lg transition-all active:scale-95 border border-slate-200"
            >
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white group-hover:bg-indigo-500 transition-colors">
                    <ArrowLeft size={16} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white">Back</span>
            </Link>

            <div ref={cardRef} className="bg-white rounded-[2rem] shadow-2xl max-w-2xl w-full border border-white/50 overflow-hidden">
                {/* Header */}
                <div className="bg-[#0F172A] px-10 py-8 flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                        <ShieldCheck size={22} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-white leading-tight">Privacy Policy &amp; Disclaimer</h1>
                        <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider mt-0.5">Please read carefully before proceeding</p>
                    </div>
                </div>

                {/* Policy Content */}
                <div
                    ref={policyRef}
                    onScroll={handleScroll}
                    className="h-72 overflow-y-auto px-10 py-6 text-xs text-slate-600 leading-relaxed space-y-4 border-b border-slate-100"
                >
                    <section>
                        <h2 className="text-sm font-black text-slate-900 mb-1">1. Data Collection</h2>
                        <p>By creating an account on Mocker, you agree that we may collect and process personal information including your name, username, email address, and mobile number solely for the purpose of providing examination and proctoring services.</p>
                    </section>
                    <section>
                        <h2 className="text-sm font-black text-slate-900 mb-1">2. Use of Information</h2>
                        <p>Your information is used exclusively for: account management, examination delivery, result processing, and platform communications. We do not sell, trade, or share your personal data with third parties without your explicit consent, except as required by law.</p>
                    </section>
                    <section>
                        <h2 className="text-sm font-black text-slate-900 mb-1">3. Examination Integrity</h2>
                        <p>By using Mocker, you agree to uphold examination integrity. Any attempt to cheat, manipulate results, or misuse the platform will result in immediate account suspension and potential legal consequences.</p>
                    </section>
                    <section>
                        <h2 className="text-sm font-black text-slate-900 mb-1">4. Data Security</h2>
                        <p>We implement industry-standard security measures including encryption and secure authentication to protect your data. However, you are responsible for maintaining the confidentiality of your login credentials.</p>
                    </section>
                    <section>
                        <h2 className="text-sm font-black text-slate-900 mb-1">5. Email Communications</h2>
                        <p>By registering, you consent to receive transactional emails including account verification, password resets, and important platform updates. You may opt out of promotional communications at any time.</p>
                    </section>
                    <section>
                        <h2 className="text-sm font-black text-slate-900 mb-1">6. Disclaimer of Liability</h2>
                        <p>Mocker provides this platform on an "as is" basis. We make no warranties regarding the uninterrupted availability of the service. We shall not be liable for any loss of data, exam results, or technical issues beyond our reasonable control.</p>
                    </section>
                    <section>
                        <h2 className="text-sm font-black text-slate-900 mb-1">7. Governing Law</h2>
                        <p>These terms are governed by applicable laws. Disputes shall be resolved through arbitration or the appropriate court of jurisdiction. By continuing, you acknowledge that you have read, understood, and agree to all the terms stated above.</p>
                    </section>
                    <div className="text-center text-slate-400 text-[10px] pt-2 font-semibold">— End of Policy —</div>
                </div>

                {/* Confirmation Section */}
                <div className="px-10 py-6">
                    {!scrolledEnd && (
                        <p className="text-[9px] text-amber-600 font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <AlertCircle size={12} /> Please scroll to the bottom to read the full policy
                        </p>
                    )}

                    {error && (
                        <div className="bg-red-50 text-red-600 p-2 rounded-xl mb-3 text-[10px] font-bold border border-red-100 flex items-center gap-2">
                            <AlertCircle size={12} /> {error}
                        </div>
                    )}

                    <label className="flex items-start gap-3 cursor-pointer group mb-5">
                        <div className="relative mt-0.5 flex-shrink-0">
                            <input
                                type="checkbox"
                                checked={accepted}
                                onChange={e => { setAccepted(e.target.checked); setError(null) }}
                                className="sr-only"
                            />
                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${accepted ? 'bg-[#0F172A] border-[#0F172A]' : 'border-slate-300 group-hover:border-slate-500'}`}>
                                {accepted && <CheckCircle2 size={12} className="text-white" />}
                            </div>
                        </div>
                        <span className="text-xs text-slate-600 leading-relaxed font-medium">
                            I have read and understood the Privacy Policy &amp; Disclaimer. I agree to the terms and conditions of the Mocker platform and consent to the processing of my personal data as described above.
                        </span>
                    </label>

                    <button
                        onClick={handleAccept}
                        disabled={loading}
                        className={`w-full py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[.2em] transition-all flex items-center justify-center gap-2 group
                            ${accepted
                                ? 'bg-[#0F172A] text-white hover:bg-slate-800 shadow-md shadow-slate-100'
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            }`}
                    >
                        {loading ? 'Sending verification...' : 'Accept & Send Verification Email'}
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" size={12} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PrivacyPolicy
