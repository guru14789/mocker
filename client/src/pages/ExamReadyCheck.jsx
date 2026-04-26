import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
    Camera, Mic, Wifi, Shield, CheckCircle2, XCircle, Loader2,
    ChevronRight, Monitor, AlertTriangle, RefreshCw, Lock
} from 'lucide-react'

// ─── Check Status Constants ───────────────────────────────────────────────────
const STATUS = {
    IDLE: 'idle',
    CHECKING: 'checking',
    PASSED: 'passed',
    FAILED: 'failed',
    SKIPPED: 'skipped',
}

// ─── Individual Check Definitions ─────────────────────────────────────────────
const INITIAL_CHECKS = [
    {
        id: 'camera',
        label: 'Camera Access',
        description: 'Required for AI proctoring and identity verification.',
        icon: Camera,
        status: STATUS.IDLE,
        required: true,
        detail: null,
    },
    {
        id: 'microphone',
        label: 'Microphone Access',
        description: 'Required to detect suspicious audio during the exam.',
        icon: Mic,
        status: STATUS.IDLE,
        required: true,
        detail: null,
    },
    {
        id: 'network',
        label: 'Network Connection',
        description: 'A stable connection is required to submit your answers.',
        icon: Wifi,
        status: STATUS.IDLE,
        required: true,
        detail: null,
    },
    {
        id: 'fullscreen',
        label: 'Fullscreen Capability',
        description: 'The exam runs in fullscreen to prevent context-switching.',
        icon: Monitor,
        status: STATUS.IDLE,
        required: false,
        detail: null,
    },
    {
        id: 'browser',
        label: 'Browser Compatibility',
        description: 'Checking for required modern browser APIs.',
        icon: Shield,
        status: STATUS.IDLE,
        required: true,
        detail: null,
    },
]

// ─── Camera Preview Component ─────────────────────────────────────────────────
function CameraPreview({ stream }) {
    const videoRef = useRef(null)
    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream
        }
        return () => {
            if (videoRef.current) videoRef.current.srcObject = null
        }
    }, [stream])

    if (!stream) return null
    return (
        <div className="relative rounded-[1.5rem] overflow-hidden bg-slate-900 border-2 border-emerald-500/30 shadow-lg shadow-emerald-500/10">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-36 object-cover scale-x-[-1]"
            />
            <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-emerald-500 text-white text-[9px] font-black px-2 py-1 rounded-full tracking-widest">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                LIVE
            </div>
            <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm text-white text-[9px] font-black px-2 py-1 rounded-full tracking-widest uppercase">
                Camera OK
            </div>
        </div>
    )
}

// ─── Check Card Component ─────────────────────────────────────────────────────
function CheckCard({ check, onRetry }) {
    const Icon = check.icon
    const statusConfig = {
        [STATUS.IDLE]: {
            bg: 'bg-slate-50',
            border: 'border-slate-200',
            iconBg: 'bg-slate-100',
            iconColor: 'text-slate-400',
            badge: null,
        },
        [STATUS.CHECKING]: {
            bg: 'bg-indigo-50/50',
            border: 'border-indigo-200',
            iconBg: 'bg-indigo-100',
            iconColor: 'text-indigo-500',
            badge: <div className="flex items-center gap-1.5 text-indigo-600 text-[10px] font-black uppercase tracking-widest"><Loader2 size={12} className="animate-spin" /> Checking...</div>,
        },
        [STATUS.PASSED]: {
            bg: 'bg-emerald-50/40',
            border: 'border-emerald-200',
            iconBg: 'bg-emerald-100',
            iconColor: 'text-emerald-600',
            badge: <div className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-black uppercase tracking-widest"><CheckCircle2 size={12} strokeWidth={3} /> Passed</div>,
        },
        [STATUS.FAILED]: {
            bg: 'bg-red-50/40',
            border: 'border-red-200',
            iconBg: 'bg-red-100',
            iconColor: 'text-red-500',
            badge: <div className="flex items-center gap-1.5 text-red-500 text-[10px] font-black uppercase tracking-widest"><XCircle size={12} strokeWidth={3} /> Failed</div>,
        },
        [STATUS.SKIPPED]: {
            bg: 'bg-amber-50/40',
            border: 'border-amber-200',
            iconBg: 'bg-amber-100',
            iconColor: 'text-amber-500',
            badge: <div className="flex items-center gap-1.5 text-amber-500 text-[10px] font-black uppercase tracking-widest"><AlertTriangle size={12} strokeWidth={3} /> Optional</div>,
        },
    }

    const cfg = statusConfig[check.status]

    return (
        <div className={`flex items-center gap-4 p-4 rounded-2xl border ${cfg.bg} ${cfg.border} transition-all duration-500`}>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${cfg.iconBg}`}>
                <Icon size={20} className={cfg.iconColor} strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-black text-slate-900 font-outfit">{check.label}</h3>
                    {check.required && (
                        <span className="text-[8px] font-black uppercase tracking-widest text-red-400 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded-full">
                            Required
                        </span>
                    )}
                </div>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5 leading-snug">{check.description}</p>
                {check.detail && (
                    <p className={`text-[10px] font-bold mt-1 ${check.status === STATUS.FAILED ? 'text-red-400' : 'text-emerald-500'}`}>
                        {check.detail}
                    </p>
                )}
            </div>
            <div className="shrink-0 text-right flex flex-col items-end gap-2">
                {cfg.badge}
                {check.status === STATUS.FAILED && (
                    <button
                        onClick={() => onRetry(check.id)}
                        className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-700 transition-colors"
                    >
                        <RefreshCw size={9} /> Retry
                    </button>
                )}
            </div>
        </div>
    )
}

// ─── Main Page Component ───────────────────────────────────────────────────────
export default function ExamReadyCheck() {
    const { uniqueLink } = useParams()
    const navigate = useNavigate()
    const [checks, setChecks] = useState(INITIAL_CHECKS)
    const [phase, setPhase] = useState('intro') // 'intro' | 'checking' | 'done'
    const [cameraStream, setCameraStream] = useState(null)
    const streamRef = useRef(null)

    const updateCheck = useCallback((id, updates) => {
        setChecks(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c))
    }, [])

    // ── Run all permission checks sequentially ─────────────────────────────────
    const runChecks = useCallback(async () => {
        setPhase('checking')

        // 1. Browser Compatibility
        updateCheck('browser', { status: STATUS.CHECKING })
        await new Promise(r => setTimeout(r, 400))
        const hasGetUserMedia = !!(navigator.mediaDevices?.getUserMedia)
        const hasCanvas = !!document.createElement('canvas').getContext
        const hasLocalStorage = (() => { try { localStorage.setItem('__test', '1'); localStorage.removeItem('__test'); return true } catch { return false } })()
        if (hasGetUserMedia && hasCanvas && hasLocalStorage) {
            updateCheck('browser', { status: STATUS.PASSED, detail: 'All required browser APIs are available.' })
        } else {
            const missing = [!hasGetUserMedia && 'Camera API', !hasCanvas && 'Canvas API', !hasLocalStorage && 'Storage API'].filter(Boolean).join(', ')
            updateCheck('browser', { status: STATUS.FAILED, detail: `Missing: ${missing}. Please use Chrome or Firefox.` })
        }

        // 2. Network Check
        updateCheck('network', { status: STATUS.CHECKING })
        await new Promise(r => setTimeout(r, 500))
        const isOnline = navigator.onLine
        if (isOnline) {
            updateCheck('network', { status: STATUS.PASSED, detail: 'Stable internet connection detected.' })
        } else {
            updateCheck('network', { status: STATUS.FAILED, detail: 'No internet connection. Please check your network.' })
        }

        // 3. Camera Access — triggers the permission prompt HERE, safely
        updateCheck('camera', { status: STATUS.CHECKING })
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } })
            streamRef.current = stream
            setCameraStream(stream)
            const track = stream.getVideoTracks()[0]
            updateCheck('camera', { status: STATUS.PASSED, detail: `Using: ${track?.label || 'Default Camera'}` })
        } catch (err) {
            const msg = err.name === 'NotAllowedError'
                ? 'Permission denied. Please allow camera access in your browser settings.'
                : err.name === 'NotFoundError'
                    ? 'No camera device found. Please connect a camera.'
                    : `Camera error: ${err.message}`
            updateCheck('camera', { status: STATUS.FAILED, detail: msg })
        }

        // 4. Microphone Access — triggers permission prompt HERE, safely
        updateCheck('microphone', { status: STATUS.CHECKING })
        try {
            const micStream = await navigator.mediaDevices.getUserMedia({ audio: true })
            // We only need permission, not the stream. Stop tracks immediately.
            micStream.getTracks().forEach(t => t.stop())
            updateCheck('microphone', { status: STATUS.PASSED, detail: 'Microphone access granted.' })
        } catch (err) {
            const msg = err.name === 'NotAllowedError'
                ? 'Permission denied. Please allow microphone access.'
                : err.name === 'NotFoundError'
                    ? 'No microphone detected.'
                    : `Microphone error: ${err.message}`
            updateCheck('microphone', { status: STATUS.FAILED, detail: msg })
        }

        // 5. Fullscreen Capability
        updateCheck('fullscreen', { status: STATUS.CHECKING })
        await new Promise(r => setTimeout(r, 300))
        const canFullscreen = !!(document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen)
        updateCheck('fullscreen', {
            status: canFullscreen ? STATUS.PASSED : STATUS.SKIPPED,
            detail: canFullscreen ? 'Fullscreen supported.' : 'Fullscreen not available. Exam will proceed in windowed mode.',
        })

        setPhase('done')
    }, [updateCheck])

    // ── Retry a single check ───────────────────────────────────────────────────
    const handleRetry = useCallback(async (checkId) => {
        updateCheck(checkId, { status: STATUS.CHECKING, detail: null })
        await new Promise(r => setTimeout(r, 400))

        if (checkId === 'camera') {
            try {
                if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
                const stream = await navigator.mediaDevices.getUserMedia({ video: true })
                streamRef.current = stream
                setCameraStream(stream)
                const track = stream.getVideoTracks()[0]
                updateCheck('camera', { status: STATUS.PASSED, detail: `Using: ${track?.label || 'Default Camera'}` })
            } catch (err) {
                updateCheck('camera', { status: STATUS.FAILED, detail: 'Permission still denied. Check browser settings.' })
            }
        } else if (checkId === 'microphone') {
            try {
                const s = await navigator.mediaDevices.getUserMedia({ audio: true })
                s.getTracks().forEach(t => t.stop())
                updateCheck('microphone', { status: STATUS.PASSED, detail: 'Microphone access granted.' })
            } catch {
                updateCheck('microphone', { status: STATUS.FAILED, detail: 'Permission still denied. Check browser settings.' })
            }
        } else if (checkId === 'network') {
            updateCheck('network', {
                status: navigator.onLine ? STATUS.PASSED : STATUS.FAILED,
                detail: navigator.onLine ? 'Connection restored.' : 'Still offline. Please check your network.',
            })
        } else if (checkId === 'browser') {
            updateCheck('browser', { status: STATUS.PASSED, detail: 'Browser APIs verified.' })
        } else if (checkId === 'fullscreen') {
            const can = !!(document.documentElement.requestFullscreen)
            updateCheck('fullscreen', { status: can ? STATUS.PASSED : STATUS.SKIPPED, detail: can ? 'Fullscreen supported.' : 'Not available.' })
        }
    }, [updateCheck])

    // ── Stop camera when navigating away ──────────────────────────────────────
    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(t => t.stop())
            }
        }
    }, [])

    // ── Derived state ──────────────────────────────────────────────────────────
    const allDone = phase === 'done'
    const requiredChecks = checks.filter(c => c.required)
    const allRequiredPassed = requiredChecks.every(c => c.status === STATUS.PASSED)
    const hasFailures = checks.some(c => c.status === STATUS.FAILED && c.required)
    const passedCount = checks.filter(c => c.status === STATUS.PASSED).length

    // ── Enter exam: stop camera tracks so ExamPage can reclaim the device ──────
    const handleEnterExam = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop())
        }
        navigate(`/exam/${uniqueLink}`, { state: { permissionsGranted: true } })
    }

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 lg:p-12 relative overflow-hidden font-sans">
            {/* Background ambience */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[120px]" />
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
            </div>

            <div className="relative z-10 w-full max-w-lg">

                {/* ─── Intro Phase ───────────────────────────────────────── */}
                {phase === 'intro' && (
                    <div className="bg-white rounded-[2rem] lg:rounded-[3rem] shadow-2xl shadow-indigo-950/20 border border-slate-100 overflow-hidden">
                        <div className="bg-slate-950 p-8 lg:p-12 text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-violet-600/10" />
                            <div className="relative z-10">
                                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl lg:rounded-3xl flex items-center justify-center mx-auto mb-4 lg:mb-6">
                                    <Shield size={32} lg:size={40} className="text-indigo-400" strokeWidth={2} />
                                </div>
                                <h1 className="text-2xl lg:text-4xl font-black font-outfit text-white tracking-tight mb-2 italic">Proctoring Sync</h1>
                                <p className="text-slate-400 text-[10px] lg:text-xs font-bold uppercase tracking-widest leading-relaxed">
                                    System Verification & Permissions
                                </p>
                            </div>
                        </div>

                        <div className="p-6 lg:p-10 space-y-4">
                            <div className="grid grid-cols-2 gap-3 lg:gap-4">
                                {[
                                    { icon: Camera, text: 'Live Camera' },
                                    { icon: Mic, text: 'Audio Guard' },
                                    { icon: Wifi, text: 'Sync Status' },
                                    { icon: Monitor, text: 'Deep Scan' },
                                ].map(({ icon: Icon, text }, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl lg:rounded-2xl border border-slate-100">
                                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                                            <Icon size={14} className="text-indigo-500" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-tight text-slate-700">{text}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-amber-50 border border-amber-100 rounded-xl lg:rounded-2xl p-4 flex items-start gap-3">
                                <AlertTriangle size={14} className="shrink-0 mt-0.5 text-amber-600" />
                                <p className="text-[10px] text-amber-700 font-bold leading-relaxed italic">
                                    Your browser will request hardware access. Please select <strong>Allow</strong> to begin the secure session.
                                </p>
                            </div>

                            <button
                                onClick={runChecks}
                                className="w-full bg-slate-950 hover:bg-indigo-600 text-white py-4 rounded-xl lg:rounded-2xl font-black text-xs lg:text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.01] shadow-xl shadow-slate-200 mt-2"
                            >
                                Begin Sync <ChevronRight size={18} strokeWidth={3} />
                            </button>
                        </div>
                    </div>
                )}

                {/* ─── Checking / Done Phase ─────────────────────────────── */}
                {(phase === 'checking' || phase === 'done') && (
                    <div className="bg-white rounded-[2rem] lg:rounded-[3rem] shadow-2xl shadow-indigo-950/20 border border-slate-100 overflow-hidden">
                        {/* Header */}
                        <div className="bg-slate-950 px-6 lg:px-10 py-5 lg:py-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-sm lg:text-lg font-black font-outfit text-white uppercase tracking-tight italic">Verification Matrix</h2>
                                <p className="text-slate-500 text-[8px] lg:text-[10px] font-black uppercase tracking-widest mt-0.5">
                                    {allDone ? `Check Complete: ${passedCount}/${checks.length}` : 'Scanning Environment...'}
                                </p>
                            </div>
                            {!allDone && <Loader2 size={20} className="text-indigo-400 animate-spin" />}
                            {allDone && allRequiredPassed && <CheckCircle2 size={22} className="text-emerald-400" strokeWidth={2.5} />}
                            {allDone && hasFailures && <XCircle size={22} className="text-red-400" strokeWidth={2.5} />}
                        </div>

                        <div className="p-4 lg:p-8 space-y-3 lg:space-y-4">
                            {/* Camera Preview (when passed) */}
                            {cameraStream && checks.find(c => c.id === 'camera')?.status === STATUS.PASSED && (
                                <CameraPreview stream={cameraStream} />
                            )}

                            {/* Check Cards */}
                            <div className="space-y-2 lg:space-y-3">
                                {checks.map(check => (
                                    <CheckCard key={check.id} check={check} onRetry={handleRetry} />
                                ))}
                            </div>

                            {/* Result: All passed */}
                            {allDone && allRequiredPassed && (
                                <div className="pt-2 lg:pt-4 space-y-3 lg:space-y-4">
                                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl lg:rounded-2xl p-4 flex items-start gap-3">
                                        <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                                        <div>
                                            <p className="text-xs lg:text-sm font-black text-emerald-900 uppercase">System Synchronized</p>
                                            <p className="text-[10px] text-emerald-600 font-bold mt-0.5 italic">Security handshake completed. You may now enter the assessment.</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleEnterExam}
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl lg:rounded-2xl font-black text-xs lg:text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.01] shadow-xl shadow-emerald-100"
                                    >
                                        <Lock size={16} strokeWidth={3} /> Enter Secure Portal
                                    </button>
                                </div>
                            )}

                            {/* Result: Has failures */}
                            {allDone && hasFailures && (
                                <div className="pt-2 lg:pt-4 space-y-3 lg:space-y-4">
                                    <div className="bg-red-50 border border-red-100 rounded-xl lg:rounded-2xl p-4 flex items-start gap-3">
                                        <XCircle size={18} className="text-red-500 shrink-0 mt-0.5" strokeWidth={2.5} />
                                        <div>
                                            <p className="text-xs lg:text-sm font-black text-red-900 uppercase">Handshake Failed</p>
                                            <p className="text-[10px] text-red-500 font-bold mt-0.5 italic">
                                                Hardware constraints detected. Resolve the red items above to proceed.
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={runChecks}
                                        className="w-full bg-slate-950 hover:bg-indigo-600 text-white py-4 rounded-xl lg:rounded-2xl font-black text-xs lg:text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.01]"
                                    >
                                        <RefreshCw size={16} strokeWidth={3} /> Re-Sync Systems
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <p className="text-center text-[8px] lg:text-[10px] text-slate-600 font-black uppercase tracking-[0.2em] mt-8 opacity-50">
                    Proctored Environment Active • Mocker v2
                </p>
            </div>
        </div>
    )
}
