import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import OMRSheet from '../components/exam/OMRSheet'
import { Timer } from '../components/exam/Timer'
import { useProctor } from '../hooks/useProctor'
import { useAuth } from '../context/AuthContext'
import { SecureQuestionRenderer } from '../components/exam/SecureQuestionRenderer'
import { ChevronLeft, ChevronRight, Send, AlertCircle, TrendingUp, CheckCircle, XCircle, Shield, Camera, WifiOff, RefreshCw } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const SAMPLE_QUESTIONS = [
    {
        _id: 'q1',
        questionText: 'What is the primary benefit of React Fragments?',
        marks: 2,
        correct: 'B',
        topic: 'React Core',
        explanation: 'React Fragments allow you to group a list of children without adding extra nodes to the DOM, which keeps the HTML structure clean and prevents CSS layout issues related to unexpected div elements.',
        options: [
            { label: 'A', text: 'They improve application security' },
            { label: 'B', text: 'They allow grouping elements without adding extra nodes to the DOM' },
            { label: 'C', text: 'They automatically optimize component re-renders' },
            { label: 'D', text: 'They provide a way to handle global state' }
        ]
    },
    {
        _id: 'q2',
        questionText: 'Which hook should be used for side effects in a functional component?',
        marks: 2,
        correct: 'C',
        topic: 'React Hooks',
        explanation: 'The useEffect hook is designed to handle side effects such as data fetching, subscriptions, or manually changing the DOM. it runs after every render by default, but can be optimized with a dependency array.',
        options: [
            { label: 'A', text: 'useMemo' },
            { label: 'B', text: 'useCallback' },
            { label: 'C', text: 'useEffect' },
            { label: 'D', text: 'useContext' }
        ]
    },
    {
        _id: 'q3',
        questionText: 'What does the "useMemo" hook do?',
        marks: 3,
        correct: 'B',
        topic: 'Optimization',
        explanation: 'useMemo returns a memoized value. It only recomputes the memoized value when one of the dependencies has changed, preventing expensive calculations on every render.',
        options: [
            { label: 'A', text: 'Memoizes a function to prevent re-creation' },
            { label: 'B', text: 'Memoizes the result of a calculation until dependencies change' },
            { label: 'C', text: 'Provides access to the browser session storage' },
            { label: 'D', text: 'Allows a component to subscribe to context changes' }
        ]
    },
    {
        _id: 'q4',
        questionText: 'In React, what is the purpose of the "key" prop in lists?',
        marks: 2,
        correct: 'C',
        topic: 'React Core',
        explanation: 'Keys help React identify which items have changed, are added, or are removed. They should be given to the elements inside the array to give the elements a stable identity across renders.',
        options: [
            { label: 'A', text: 'It style the individual list items' },
            { label: 'B', text: 'It provides a unique ID for CSS selectors' },
            { label: 'C', text: 'It helps React identify which items have changed, been added, or removed' },
            { label: 'D', text: 'It encrypts the data within the list' }
        ]
    },
    {
        _id: 'q5',
        questionText: 'What is the correct way to update state based on previous state?',
        marks: 3,
        correct: 'B',
        topic: 'State Management',
        explanation: 'Using a functional update ensures that you are working with the most recent state value, avoiding race conditions that can occur when updates are batched.',
        options: [
            { label: 'A', text: 'setState(state + 1)' },
            { label: 'B', text: 'setState(prev => prev + 1)' },
            { label: 'C', text: 'this.state.count = this.state.count + 1' },
            { label: 'D', text: 'None of the above' }
        ]
    }
];

export default function ExamPage() {
    const { uniqueLink } = useParams()
    const navigate = useNavigate()
    const [test, setTest] = useState({ title: 'Sample Assessment' })
    const [questions, setQuestions] = useState(SAMPLE_QUESTIONS)
    const [currentQ, setCurrentQ] = useState(0)
    const [answers, setAnswers] = useState({})
    const [loading, setLoading] = useState(true)
    const [session, setSession] = useState(null)
    const [isGrading, setIsGrading] = useState(false)
    const [violation, setViolation] = useState(null)
    const [isTerminated, setIsTerminated] = useState(false)
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)
    const [isOnline, setIsOnline] = useState(navigator.onLine)
    const [syncQueue, setSyncQueue] = useState(() => {
        const saved = localStorage.getItem(`sync_queue_${uniqueLink}`)
        return saved ? JSON.parse(saved) : []
    })
    const [isSyncing, setIsSyncing] = useState(false)

    useEffect(() => {
        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => setIsOnline(false)
        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)
        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    useEffect(() => {
        if (isOnline && syncQueue.length > 0) {
            syncOfflineData()
        }
    }, [isOnline])

    const syncOfflineData = async () => {
        if (isSyncing || !session?._id) return
        setIsSyncing(true)
        const queue = [...syncQueue]
        const remaining = []

        for (const item of queue) {
            try {
                if (item.type === 'answer') {
                    await axios.post(`http://localhost:5000/api/sessions/${session._id}/answer`, { idx: item.idx, opt: item.opt })
                } else if (item.type === 'violation') {
                    await axios.post(`http://localhost:5000/api/sessions/${session._id}/violation`, item.data)
                }
            } catch (err) {
                console.error('Sync failed for item', item, err)
                remaining.push(item)
            }
        }

        setSyncQueue(remaining)
        localStorage.setItem(`sync_queue_${uniqueLink}`, JSON.stringify(remaining))
        setIsSyncing(false)
    }

    const startSession = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/tests/link/${uniqueLink}`)
            setTest(res.data.test)
            if (res.data.questions?.length > 0) {
                setQuestions(res.data.questions)
            }
            
            const sessionRes = await axios.post('http://localhost:5000/api/sessions/start', { testId: res.data.test._id })
            setSession(sessionRes.data.session)
        } catch (err) {
            console.error('Failed to start exam', err)
            setSession({ _id: 'mock-session-' + Math.random().toString(36).substr(2, 9) })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        startSession()
    }, [uniqueLink])

    const { triggerHeadTurn } = useProctor({
        onViolation: (v) => {
            console.warn('Violation detected:', v.type)
            const messageMap = {
                head_turn: "Please keep your eyes on the screen.",
                tab_switch: "Switching tabs is strictly prohibited.",
                window_blur: "Do not leave the exam window.",
                keyboard_shortcut: "Shortcut keys are disabled for security."
            };

            if (v.type in messageMap) {
                if (v.count === 1) {
                    setViolation({ ...v, message: `WARNING: ${messageMap[v.type]} Any further violations will terminate your exam.` })
                } else if (v.count >= 2) {
                    setIsTerminated(true)
                }
            }
            if (session) {
                if (isOnline) {
                    axios.post(`http://localhost:5000/api/sessions/${session._id}/violation`, v)
                } else {
                    const newQueue = [...syncQueue, { type: 'violation', data: v, timestamp: Date.now() }]
                    setSyncQueue(newQueue)
                    localStorage.setItem(`sync_queue_${uniqueLink}`, JSON.stringify(newQueue))
                }
            }
        }
    })

    const handleSelect = (idx, opt) => {
        setAnswers({ ...answers, [idx]: opt })
        if (session?._id) {
            if (isOnline) {
                axios.post(`http://localhost:5000/api/sessions/${session._id}/answer`, { idx, opt })
            } else {
                const newQueue = [...syncQueue, { type: 'answer', idx, opt, timestamp: Date.now() }]
                setSyncQueue(newQueue)
                localStorage.setItem(`sync_queue_${uniqueLink}`, JSON.stringify(newQueue))
            }
        }
    }

    const handleSubmit = async () => {
        setShowSubmitConfirm(true)
    }

    const confirmSubmit = () => {
        setIsGrading(true)
        setShowSubmitConfirm(false)
    }

    const onGradingComplete = async () => {
        try {
            await axios.post(`http://localhost:5000/api/sessions/${session._id}/submit`, { answers })
            navigate(`/result/${session._id}`, { state: { answers, questions, uniqueLink } })
        } catch (err) {
            console.error('Submission failed', err)
            navigate(`/result/${session._id}`, { state: { answers, questions, uniqueLink } })
        }
    }

    if (isTerminated) return (
        <div className="h-screen bg-slate-900 flex items-center justify-center p-8">
            <div className="max-w-md w-full bg-white rounded-[3rem] p-12 text-center shadow-2xl space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Shield size={48} strokeWidth={2.5} />
                </div>
                <h2 className="text-4xl font-black font-outfit text-slate-900">Exam Terminated</h2>
                <p className="text-slate-500 font-medium leading-relaxed">Multiple proctoring violations were detected. This session has been closed or safety. Your progress has been logged.</p>
                <button onClick={() => navigate('/')} className="w-full btn-primary py-4 font-black">Return Home</button>
            </div>
        </div>
    )

    if (loading) return <div className="h-screen flex items-center justify-center font-bold">Loading Exam Environment...</div>

    const currentQuestion = questions[currentQ]

    return (
        <div className="min-h-screen flex flex-col bg-[#F8FAFC] lg:overflow-hidden font-sans">
            <header className="h-auto py-3 lg:h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-4 lg:px-10 flex flex-col lg:flex-row items-center justify-between shrink-0 gap-3 sticky top-0 z-40">
                <div className="flex flex-col">
                    <h1 className="text-sm lg:text-lg font-black font-outfit uppercase tracking-tight text-slate-950 leading-tight truncate max-w-[250px] lg:max-w-md italic">
                        {test?.id?.includes('mock') ? test.title : (test?.title || 'Assessment Sync')}
                    </h1>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">SID: {session?._id.slice(-8)}</span>
                </div>
                <div className="flex items-center gap-2 lg:gap-6 w-full lg:w-auto justify-between lg:justify-end">
                    {!isOnline && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 rounded-lg border border-amber-100 animate-pulse">
                            <WifiOff size={14} />
                            <span className="text-[10px] font-black uppercase tracking-tight">Offline Mode Active</span>
                        </div>
                    )}
                    {isSyncing && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100">
                            <RefreshCw size={14} className="animate-spin" />
                            <span className="text-[10px] font-black uppercase tracking-tight">Syncing Data...</span>
                        </div>
                    )}
                    <div className="hidden xl:flex items-center gap-3 pr-6 border-r border-slate-100">
                        <Camera size={18} className="text-indigo-500 animate-pulse" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Shield Enabled</span>
                    </div>
                    <div className="flex items-center gap-2 lg:gap-4 flex-1 lg:flex-initial justify-end">
                        <Timer durationMinutes={test?.duration || 30} onTimeUp={confirmSubmit} onWarning={(msg) => console.log('Timer Warning:', msg)} />
                        <button onClick={handleSubmit} className="bg-slate-950 text-white py-2 lg:py-2.5 px-4 lg:px-6 rounded-xl flex items-center gap-2 text-[10px] lg:text-sm font-black shadow-lg shadow-slate-200 transition-all hover:scale-[1.02] active:scale-95">
                            Submit <span className="hidden sm:inline">Exam</span> <Send size={14} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col lg:flex-row overflow-hidden p-3 lg:p-6 gap-4 lg:gap-6">
                {/* LEFT: Question Section */}
                <div className="flex-1 lg:flex-[3] flex flex-col bg-white rounded-2xl lg:rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden min-h-[400px]">
                    <div className="flex-1 p-6 lg:p-10 overflow-y-auto custom-scrollbar">
                        {questions.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 animate-pulse">
                                    <AlertCircle size={32} />
                                </div>
                                <h2 className="text-xl lg:text-2xl font-black text-slate-950 font-outfit uppercase">Initializing Portal...</h2>
                                <p className="text-slate-500 max-w-sm text-[10px] lg:text-xs font-bold leading-relaxed italic">The secure environment is being synchronized. Please wait.</p>
                            </div>
                        ) : test.examType === 'omr-scanning' ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-8 p-6 lg:p-10">
                                <div className="w-24 h-24 lg:w-32 lg:h-32 bg-slate-50 text-slate-950 rounded-[1.5rem] lg:rounded-[2.5rem] flex items-center justify-center shadow-xl rotate-3">
                                    <Shield size={48} lg:size={64} />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-3xl lg:text-5xl font-black text-slate-950 font-outfit tracking-tight italic uppercase">Physical Media</h2>
                                    <p className="text-slate-500 max-w-md mx-auto text-xs lg:text-base font-bold italic">
                                        Assessment details are provided on paper.
                                    </p>
                                </div>
                                <div className="p-6 bg-slate-950 rounded-2xl border border-white/5 max-w-sm w-full text-white">
                                    <p className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 text-left">Sync Protocol:</p>
                                    <div className="space-y-2 text-[10px] lg:text-xs text-left font-bold italic">
                                        <div className="flex gap-2"><span>1.</span><span>Process offline question paper.</span></div>
                                        <div className="flex gap-2"><span>2.</span><span>Sync responses to Digital OMR.</span></div>
                                        <div className="flex gap-2"><span>3.</span><span>Execute Final Submission.</span></div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <SecureQuestionRenderer 
                                question={currentQuestion}
                                questionNumber={currentQ + 1}
                                selectedOption={answers[currentQ]}
                                onSelect={(opt) => handleSelect(currentQ, opt)}
                            />
                        )}
                    </div>
                    
                    <div className="h-20 lg:h-24 bg-slate-50/50 border-t border-slate-100 px-6 lg:px-12 flex items-center justify-between shrink-0">
                        <button 
                            disabled={currentQ === 0}
                            onClick={() => setCurrentQ(prev => prev - 1)}
                            className="flex items-center gap-2 font-black text-[9px] lg:text-[10px] uppercase tracking-widest text-slate-400 disabled:opacity-20 hover:text-slate-950 transition-all group"
                        >
                            <ChevronLeft size={16} lg:size={20} /> <span className="hidden sm:inline">Prev</span>
                        </button>
                        
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] lg:text-xs font-black text-slate-950 uppercase tracking-widest italic">{currentQ + 1} <span className="text-slate-400">/ {questions.length}</span></span>
                        </div>

                        <button 
                            disabled={currentQ === questions.length - 1}
                            onClick={() => setCurrentQ(prev => prev + 1)}
                            className="flex items-center gap-2 font-black text-[9px] lg:text-[10px] uppercase tracking-widest text-slate-400 disabled:opacity-20 hover:text-slate-950 transition-all group"
                        >
                            <span className="hidden sm:inline">Next</span> <ChevronRight size={16} lg:size={20} />
                        </button>
                    </div>
                    </div>

                {/* RIGHT: OMR Sheet Section */}
                <div className="flex-1 flex flex-col gap-4 lg:gap-6 shrink-0 min-w-full lg:min-w-[340px] xl:min-w-[380px]">
                    <div className="flex-1 bg-white rounded-2xl lg:rounded-[2.5rem] border border-slate-200/60 shadow-sm flex flex-col overflow-hidden">
                        <div className="p-5 lg:p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                            <div>
                                <h3 className="text-sm lg:text-lg font-black font-outfit text-slate-950 uppercase tracking-tight italic">Response Matrix</h3>
                                <p className="text-[8px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Digital Bubble Analysis</p>
                            </div>
                            <div className="bg-slate-950 text-white px-3 py-1.5 rounded-lg text-[9px] lg:text-[10px] font-black uppercase tracking-widest border border-white/10">
                                {Object.keys(answers).length} <span className="text-slate-500">/ {questions.length}</span>
                            </div>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                           <OMRSheet 
                                questions={questions} 
                                answers={answers} 
                                currentQ={currentQ} 
                                onSelect={(idx, opt) => {
                                    handleSelect(idx, opt);
                                    setCurrentQ(idx);
                                }} 
                            />
                        </div>
                    </div>
                    {/* Live Camera Feed */}
                    <div className="bg-slate-950 rounded-2xl lg:rounded-[2.5rem] h-[200px] lg:h-[240px] relative overflow-hidden shadow-xl border border-white/5">
                        <ProctorWebcam onHeadTurn={triggerHeadTurn} />
                        <div className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-[8px] font-black rounded flex items-center gap-1.5 animate-pulse uppercase tracking-widest">
                            <div className="w-1 h-1 bg-white rounded-full"></div> LIVE SYNC
                        </div>
                        <div className="absolute bottom-3 left-3 right-3 bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/10">
                            <p className="text-[9px] font-black text-white/80 uppercase tracking-widest flex items-center gap-2 italic">
                                <Shield size={12} className="text-emerald-400" /> Identity Secure
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {violation && (
                <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full text-center shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 inset-x-0 h-2 bg-red-500"></div>
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <AlertCircle size={32} />
                        </div>
                        <h3 className="text-xl font-black font-outfit text-slate-900 mb-4 uppercase tracking-tight">Proctoring Warning</h3>
                        <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8">{violation.message}</p>
                        <button 
                            onClick={() => setViolation(null)}
                            className="w-full bg-[#0F172A] text-white py-4 rounded-2xl font-black text-sm hover:scale-[1.02] transition-all shadow-xl shadow-slate-200"
                        >
                            I Understand
                        </button>
                    </div>
                </div>
            )}

            {showSubmitConfirm && (
                <div className="fixed inset-0 z-[1000] bg-slate-900/60 backdrop-blur-xl flex items-center justify-center p-8 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] p-12 max-w-sm w-full text-center shadow-2xl relative overflow-hidden border border-slate-100">
                        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <Send size={40} strokeWidth={2.5} className="rotate-[-12deg]" />
                        </div>
                        <h3 className="text-2xl font-black font-outfit text-slate-900 mb-4 tracking-tight">Final Submission?</h3>
                        <p className="text-slate-500 font-medium text-sm leading-relaxed mb-10">Review your digitally filled OMR sheet carefully. Once submitted, you cannot modify your answers.</p>
                        <div className="flex gap-4">
                            <button onClick={() => setShowSubmitConfirm(false)} className="flex-1 py-4 text-slate-400 font-bold uppercase tracking-widest text-[10px] hover:text-slate-900 transition-all">Cancel</button>
                            <button onClick={confirmSubmit} className="flex-[2] bg-[#0F172A] text-white py-4 rounded-2xl font-black text-sm hover:scale-[1.02] shadow-2xl shadow-indigo-100/40 transition-all">Yes, Submit</button>
                        </div>
                    </div>
                </div>
            )}

            {isGrading && (
                <GradingOverlay 
                    questions={questions} 
                    answers={answers} 
                    test={test}
                    session={session}
                    onComplete={onGradingComplete} 
                />
            )}
        </div>
    )
}

const GradingOverlay = ({ questions, answers, test, session, onComplete }) => {
    const container = React.useRef()
    const { user } = useAuth()
    const [currentScore, setCurrentScore] = useState(0)
    const [currentIndex, setCurrentIndex] = useState(-1)
    const [evaluations, setEvaluations] = useState({})
    const [allDone, setAllDone] = useState(false)

    const safeQuestions = questions || []
    const totalMarks = safeQuestions.reduce((s, q) => s + (q.marks || 1), 0)
    const scorePercent = totalMarks > 0 ? Math.max(0, (currentScore / totalMarks) * 100) : 0

    useGSAP(() => {
        const tl = gsap.timeline({
            onComplete: () => {
                setAllDone(true)
                gsap.to(container.current, { opacity: 0, delay: 2.5, duration: 0.7, onComplete })
            }
        })

        tl.from('.omr-sheet', { y: 50, opacity: 0, duration: 0.8, ease: 'power4.out' })
        tl.from('.score-bar', { y: -40, opacity: 0, duration: 0.6, ease: 'power3.out' }, '<0.1')

        safeQuestions.forEach((q, idx) => {
            tl.to({}, {
                duration: 0.28,
                onStart: () => {
                    setCurrentIndex(idx)
                    const selected = answers[idx]
                    const isCorrect = selected && selected === q.correct
                    const isWrong = selected && selected !== q.correct
                    const delta = isCorrect ? (q.marks || 1) : isWrong ? -(q.negativeMarks || 0) : 0
                    if (delta !== 0) setCurrentScore(prev => prev + delta)
                    setEvaluations(prev => ({ ...prev, [idx]: { isCorrect, isWrong, isSkipped: !selected, delta, marks: q.marks || 1, negMarks: q.negativeMarks || 0 } }))
                }
            })
            // Pulse selected bubble
            if (answers && answers[idx]) {
                tl.to(`.qbub-${idx}-${answers[idx]}`, { scale: 1.3, duration: 0.12, repeat: 1, yoyo: true, ease: 'power2.inOut' }, '<')
            }
        })
    }, { scope: container })

    return (
        <div ref={container} className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex flex-col items-center justify-start overflow-y-auto">

            {/* ── Score Bar (Floating) ── */}
            <div className="score-bar sticky top-0 z-50 w-full bg-[#0F172A] px-6 py-3 flex items-center justify-between shadow-2xl border-b border-white/10">
                <div>
                    <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.35em]">Grading Engine · {test?.title || 'Assessment'}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                            Q {Math.max(0, currentIndex + 1)} / {safeQuestions.length}
                        </span>
                        <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                                style={{ width: `${safeQuestions.length > 0 ? ((currentIndex + 1) / safeQuestions.length) * 100 : 0}%` }} />
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[8px] font-black tracking-[0.35em] uppercase mb-0.5" style={{ color: allDone ? '#34d399' : '#818cf8' }}>
                        {allDone ? '✓ Final Score' : 'Running Score'}
                    </p>
                    <div className="flex items-baseline gap-1.5">
                        <span className={`text-4xl font-black tabular-nums ${currentScore < 0 ? 'text-red-400' : 'text-white'}`} style={{ fontFamily: 'Arial Black, sans-serif' }}>
                            {currentScore >= 0 ? `+${currentScore.toFixed(0)}` : currentScore.toFixed(0)}
                        </span>
                        <span className="text-slate-500 text-sm font-bold">/ {totalMarks}</span>
                    </div>
                    <div className="mt-1 h-1 bg-white/10 rounded-full w-36 overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-700 ${scorePercent >= 60 ? 'bg-emerald-400' : scorePercent >= 35 ? 'bg-amber-400' : 'bg-red-400'}`}
                            style={{ width: `${Math.max(0, scorePercent)}%` }} />
                    </div>
                </div>
            </div>

            {/* ── OMR Sheet ── */}
            <div className="omr-sheet my-4 mx-2 w-full" style={{ maxWidth: '1100px' }}>
                <OMRSheet
                    questions={safeQuestions}
                    answers={answers}
                    evaluations={evaluations}
                    currentIndex={currentIndex}
                    session={session}
                    test={test}
                    userName={user?.name || ''}
                />
            </div>
        </div>
    )
}

const ProctorWebcam = ({ onHeadTurn }) => {
    const videoRef = React.useRef(null)
    const canvasRef = React.useRef(null)
    const lastFrame = React.useRef(null)
    const violationCooldown = React.useRef(false)
    const [status, setStatus] = useState('Initializing...')

    useEffect(() => {
        let stream = null
        const setupCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: { width: 480, height: 360, frameRate: 15 } })
                if (videoRef.current) videoRef.current.srcObject = stream
                setStatus('Active')
            } catch (err) {
                console.error("Camera access failed:", err)
                setStatus('Camera Error')
            }
        }
        setupCamera()

        let calibration = null
        let absenceCounter = 0
        let frameCount = 0
        let sensitivity = 0.05 // Base sensitivity for presence

        const interval = setInterval(() => {
            if (!videoRef.current || !canvasRef.current || videoRef.current.readyState !== 4) return
            
            const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true })
            ctx.drawImage(videoRef.current, 0, 0, 80, 60)
            const imageData = ctx.getImageData(0, 0, 80, 60)
            const frame = imageData.data
            
            frameCount++
            
            // Wait for webcam to auto-adjust
            if (frameCount <= 15) {
                lastFrame.current = new Uint8ClampedArray(frame)
                return
            }

            // 1. LUMINOSITY & PRESENCE DETECTION
            let totalLumi = 0
            for (let i = 0; i < frame.length; i += 4) {
                totalLumi += (frame[i] + frame[i+1] + frame[i+2]) / 3
            }
            const avgLumi = totalLumi / (frame.length / 4)

            if (calibration === null) {
                calibration = avgLumi
            } else {
                // Adaptive calibration
                calibration = calibration * 0.99 + avgLumi * 0.01
            }

            // 2. MOTION DETECTION (Temporal Difference)
            if (lastFrame.current) {
                let diffCount = 0
                for (let i = 0; i < frame.length; i += 4) {
                    const diff = Math.abs(frame[i] - lastFrame.current[i]) + 
                                 Math.abs(frame[i+1] - lastFrame.current[i+1]) + 
                                 Math.abs(frame[i+2] - lastFrame.current[i+2])
                    if (diff > 90) diffCount++
                }
                
                const motionFactor = diffCount / (frame.length / 4)
                
                // High motion threshold
                if (motionFactor > 0.45 && !violationCooldown.current) {
                    console.warn("High Sensitivity Motion Triggered:", motionFactor)
                    violationCooldown.current = true
                    onHeadTurn("Excessive motion or potential head turn detected")
                    setTimeout(() => violationCooldown.current = false, 6000)
                }

                // 3. PRESENCE DETECTION (Luminosity Shift)
                const lumiShift = Math.abs(avgLumi - calibration)
                if (lumiShift > 40 || avgLumi < 5) { // Drastic change or darkness
                    absenceCounter++
                    if (absenceCounter > 10 && !violationCooldown.current) {
                        violationCooldown.current = true
                        onHeadTurn("Candidate presence or focus not detected")
                        setTimeout(() => {
                            violationCooldown.current = false
                            absenceCounter = 0
                        }, 8000)
                    }
                } else {
                    absenceCounter = Math.max(0, absenceCounter - 1)
                }
            }
            
            lastFrame.current = new Uint8ClampedArray(frame)
        }, 200)

        return () => {
            if (stream) stream.getTracks().forEach(t => t.stop())
            clearInterval(interval)
        }
    }, [onHeadTurn])

    return (
        <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center relative">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1] opacity-90" />
            <canvas ref={canvasRef} width="80" height="60" className="hidden" />
            <div className="absolute inset-0 pointer-events-none border-[1px] border-white/5">
                {/* Visual scanline effect */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-indigo-500/30 animate-[scan_3s_linear_infinite]" />
            </div>
            {status !== 'Active' && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{status}</span>
                </div>
            )}
            <style>{`
                @keyframes scan {
                    0% { top: 0; }
                    100% { top: 100%; }
                }
            `}</style>
        </div>
    )
}
