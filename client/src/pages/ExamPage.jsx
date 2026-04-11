import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { OMRSheet } from '../components/exam/OMRSheet'
import { Timer } from '../components/exam/Timer'
import { useProctor } from '../hooks/useProctor'
import { useAuth } from '../context/AuthContext'
import { SecureQuestionRenderer } from '../components/exam/SecureQuestionRenderer'
import { ChevronLeft, ChevronRight, Send, AlertCircle, TrendingUp, CheckCircle, XCircle, Shield, Camera } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const SAMPLE_QUESTIONS = [
    {
        _id: 'q1',
        questionText: 'What is the primary benefit of React Fragments?',
        marks: 2,
        correct: 'B',
        topic: 'React Core',
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

    useEffect(() => {
        const startSession = async () => {
            try {
                // In a real app, we'd find the test by uniqueLink first
                // For this demo, we'll assume the link directly maps to a test ID or slug
                const res = await axios.get(`http://localhost:5000/api/tests/link/${uniqueLink}`)
                setTest(res.data.test)
                if (res.data.questions?.length > 0) {
                    setQuestions(res.data.questions)
                }
                
                const sessionRes = await axios.post('http://localhost:5000/api/sessions/start', { testId: res.data.test._id })
                setSession(sessionRes.data.session)
            } catch (err) {
                console.error('Failed to start exam', err)
                // Fallback for demo: create a mock session
                setSession({ _id: 'mock-session-' + Math.random().toString(36).substr(2, 9) })
            } finally {
                setLoading(false)
            }
        }
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
                axios.post(`http://localhost:5000/api/sessions/${session._id}/violation`, v)
            }
        }
    })

    const handleSelect = (idx, opt) => {
        setAnswers({ ...answers, [idx]: opt })
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
        <div className="min-h-screen flex flex-col bg-slate-50 md:overflow-hidden font-sans">
            <header className="h-auto py-2 md:py-0 md:h-20 bg-white border-b border-slate-200 px-4 md:px-10 flex flex-col md:flex-row items-center justify-between shrink-0 gap-3">
                <div className="flex flex-col">
                    <h1 className="text-base md:text-xl font-black font-outfit uppercase tracking-wider text-slate-900 leading-tight truncate max-w-[200px] md:max-w-md">
                        {test?.id?.includes('mock') ? test.title : (test?.title || 'Assessment Environment')}
                    </h1>
                    <span className="text-[9px] font-bold text-slate-400">SESSION ID: {session?._id.slice(-8)}</span>
                </div>
                <div className="flex items-center gap-2 md:gap-6 w-full md:w-auto justify-between md:justify-end">
                    <div className="hidden lg:flex items-center gap-3 pr-6 border-r border-slate-100">
                        <Camera size={20} className="text-indigo-500 animate-pulse" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Proctoring Active</span>
                    </div>
                    <div className="flex items-center gap-2 md:gap-4 flex-1 md:flex-initial justify-end">
                        <Timer durationMinutes={test?.duration || 30} onTimeUp={confirmSubmit} onWarning={(msg) => console.log('Timer Warning:', msg)} />
                        <button onClick={handleSubmit} className="btn-primary py-2.5 md:py-3 px-5 md:px-8 flex items-center gap-2 font-bold shadow-lg shadow-slate-200 text-xs md:text-sm">
                            Submit <span className="hidden md:inline">Exam</span> <Send size={16} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col lg:flex-row overflow-hidden p-4 md:p-6 gap-6">
                {/* LEFT: Question Section */}
                <div className="flex-1 lg:flex-[3] flex flex-col bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-200/60 shadow-xl shadow-slate-200/20 overflow-hidden min-h-[500px]">
                    <div className="flex-1 p-10 overflow-y-auto custom-scrollbar">
                        {questions.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 animate-pulse">
                                    <AlertCircle size={48} />
                                </div>
                                <h2 className="text-3xl font-black text-slate-900 font-outfit">Preparing Assessment...</h2>
                                <p className="text-slate-500 max-w-sm font-medium leading-relaxed italic">The secure environment is being initialized. If this persists, please refresh your browser.</p>
                            </div>
                        ) : test.examType === 'omr-scanning' ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-12 p-10">
                                <div className="w-32 h-32 bg-indigo-50 text-indigo-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-indigo-100 rotate-3 animate-bounce">
                                    <Printer size={64} />
                                </div>
                                <div className="space-y-4">
                                    <h2 className="text-5xl font-black text-slate-900 font-outfit tracking-tight">Offline Question Paper</h2>
                                    <p className="text-slate-500 max-w-md mx-auto font-medium leading-relaxed">
                                        This is an OMR-based examination. Your question paper has been provided physically.
                                    </p>
                                </div>
                                <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 max-w-sm w-full">
                                    <p className="text-xs font-black uppercase tracking-widest text-[#0F172A] mb-2 text-left">How to submit:</p>
                                    <p className="text-[10px] text-slate-400 font-bold leading-relaxed text-left">
                                        1. Read the physical question paper.<br/>
                                        2. Fill the bubbles on the right-hand digital OMR sheet.<br/>
                                        3. Click "Submit Exam" once you have finished all answers.
                                    </p>
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
                    
                    <div className="h-24 md:h-32 bg-white border-t border-slate-100 px-6 md:px-16 flex items-center justify-between shrink-0">
                        <button 
                            disabled={currentQ === 0}
                            onClick={() => setCurrentQ(prev => prev - 1)}
                            className="flex items-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 disabled:opacity-20 hover:text-slate-900 transition-all group"
                        >
                            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Previous
                        </button>
                        
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-black text-slate-300 uppercase tracking-widest">{currentQ + 1} / {questions.length}</span>
                        </div>

                        <button 
                            disabled={currentQ === questions.length - 1}
                            onClick={() => setCurrentQ(prev => prev + 1)}
                            className="flex items-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 disabled:opacity-20 hover:text-slate-900 transition-all group"
                        >
                            Next <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                    </div>

                {/* RIGHT: OMR Sheet Section */}
                <div className="flex-1 flex flex-col gap-6 shrink-0 min-w-full lg:min-w-[380px]">
                    <div className="flex-1 bg-white rounded-[3rem] border border-slate-200/60 shadow-xl shadow-slate-200/10 flex flex-col overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                            <div>
                                <h3 className="text-lg font-black font-outfit text-[#0F172A] uppercase tracking-wider">Answer Sheet</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">OMR Digital Bubble</p>
                            </div>
                            <div className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                {Object.keys(answers).length} / {questions.length} DONE
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
                    <div className="bg-[#0F172A] rounded-[3rem] h-[260px] relative overflow-hidden shadow-2xl border-4 border-white">
                        <ProctorWebcam onHeadTurn={triggerHeadTurn} />
                        <div className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center gap-2 animate-pulse">
                            <div className="w-1 h-1 bg-white rounded-full"></div> REC
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                            <p className="text-[9px] font-black text-white/80 uppercase tracking-widest flex items-center gap-2">
                                <Shield size={12} className="text-emerald-400" /> AI Identity Verified
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
    
    useGSAP(() => {
        const tl = gsap.timeline({
            onComplete: () => {
                gsap.to(container.current, {
                    opacity: 0,
                    delay: 2,
                    duration: 0.5,
                    onComplete
                })
            }
        })

        // Initial entrance
        tl.from('.grading-card', {
            x: -100,
            opacity: 0,
            duration: 1,
            ease: 'power4.out'
        })
        tl.from('.omr-preview', {
            x: 100,
            opacity: 0,
            duration: 1,
            ease: 'power4.out'
        }, '<')

        // Staggered grading
        questions.forEach((q, idx) => {
            tl.to({}, {
                duration: 0.25,
                onStart: () => {
                    setCurrentIndex(idx)
                    const selected = answers[idx]
                    if (selected === q.correct) {
                        setCurrentScore(prev => prev + (q.marks || 1))
                    }
                }
            })
            
            tl.from(`.row-${idx}`, {
                x: -20,
                duration: 0.2,
                ease: 'power2.out'
            }, '<')

            tl.to(`.status-${idx}`, {
                scale: 1,
                opacity: 1,
                duration: 0.2,
                ease: 'back.out(2)'
            }, '>-0.05')

            // Pulse the OMR bubble if it exists
            if (answers && answers[idx]) {
                tl.to(`.bubble-${idx}-${answers[idx]}`, {
                    scale: 1.3,
                    duration: 0.2,
                    repeat: 1,
                    yoyo: true
                }, '<')
            }
        })

    }, { scope: container })

    return (
        <div ref={container} className="fixed inset-0 z-[100] bg-[#0F172A]/98 backdrop-blur-3xl flex items-center justify-center p-4 md:p-12 overflow-hidden">
            {/* Background Digital Rain / Grid */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(#d81b60 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            </div>

            <div className="flex flex-col lg:flex-row w-full max-w-7xl h-full max-h-[900px] gap-8 relative z-10">
                {/* Left: Logic Audit */}
                <div className="grading-card flex-1 bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border border-white/10">
                    <div className="bg-[#0F172A] p-10 text-center relative overflow-hidden shrink-0">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                        <p className="text-slate-400 text-xs font-black uppercase tracking-[0.4em] mb-4">Grading Intelligence Engine</p>
                        <div className="flex items-center justify-center gap-6">
                            <div className="relative">
                                <h2 className="text-7xl font-black font-outfit text-white tabular-nums drop-shadow-2xl">
                                    {(currentScore || 0).toFixed(0)}
                                </h2>
                            </div>
                            <div className="text-left border-l border-white/10 pl-6">
                                <p className="text-indigo-400 text-[10px] font-black tracking-widest leading-tight">AUTHENTICATED</p>
                                <p className="text-white text-lg font-black font-outfit leading-none mt-1">SCORE</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-10 space-y-4 custom-scrollbar bg-slate-50/50">
                        {(questions || []).map((q, idx) => {
                            const isCorrect = answers[idx] === q.correct;
                            const isActive = idx === currentIndex;
                            const isDone = idx <= currentIndex;
                            
                            return (
                                <div 
                                    key={idx} 
                                    className={`row-${idx} flex items-center justify-between p-5 rounded-[1.5rem] transition-all duration-300 border
                                        ${isActive ? 'bg-white border-indigo-200 scale-[1.03] shadow-lg ring-4 ring-indigo-50' : 'bg-white/50 border-slate-100'}
                                        ${isDone ? 'opacity-100' : 'opacity-20'}`}
                                >
                                    <div className="flex items-center gap-8">
                                        <span className="text-[10px] font-black text-slate-300 w-6 uppercase tracking-widest italic">{String(idx + 1).padStart(2, '0')}</span>
                                        <div className="flex gap-2">
                                            {['A', 'B', 'C', 'D'].map(label => (
                                                <div 
                                                    key={label}
                                                    className={`w-9 h-9 rounded-xl border-2 flex items-center justify-center text-xs font-black transition-all
                                                        ${answers[idx] === label 
                                                            ? (isDone ? (isCorrect ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-100') : 'bg-slate-900 border-slate-900 text-white')
                                                            : 'border-slate-100 text-slate-200'}`}
                                                >
                                                    {label}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className={`status-${idx} opacity-0 scale-50 shrink-0`}>
                                        {isCorrect ? (
                                            <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-[0.1em]">
                                                <CheckCircle size={14} strokeWidth={3} /> PASSED +{q.marks}
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-red-500 font-black text-[10px] uppercase tracking-[0.1em]">
                                                <XCircle size={14} strokeWidth={3} /> FAIL
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Right: Digital OMR Twin (Advanced Debug Template) */}
                <div className="omr-preview flex-[1.4] bg-white rounded-[3rem] shadow-2xl p-10 border-[3px] border-[#d81b60] hidden lg:flex flex-col relative overflow-hidden text-[#d81b60]">
                    {/* Corner Alignment Markers (Fiducials) */}
                    <div className="absolute top-6 left-6 w-8 h-8 border-t-4 border-l-4 border-slate-900"></div>
                    <div className="absolute top-6 right-6 w-8 h-8 border-t-4 border-r-4 border-slate-900"></div>
                    <div className="absolute bottom-6 left-6 w-8 h-8 border-b-4 border-l-4 border-slate-900"></div>
                    <div className="absolute bottom-6 right-6 w-8 h-8 border-b-4 border-r-4 border-slate-900"></div>

                    {/* AI Vision HUD Elements */}
                    <div className="absolute top-10 right-20 text-[8px] font-mono font-black opacity-40 text-right space-y-1">
                        <p>VISION_ENGINE: V2.4.RC</p>
                        <p>LATENCY: 12ms</p>
                        <p>SYNC_LOCK: OK</p>
                    </div>

                    {/* Security Micro-Text Watermark */}
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 -rotate-12 opacity-[0.04] pointer-events-none select-none">
                        <div className="text-[120px] font-black whitespace-nowrap font-outfit uppercase">OFFICIAL OMR AUTHENTICATED</div>
                        <div className="text-[120px] font-black whitespace-nowrap font-outfit uppercase">OFFICIAL OMR AUTHENTICATED</div>
                    </div>

                    <div className="relative z-10 flex-1 flex flex-col">
                        <div className="border-[1.5px] border-[#d81b60] mb-6 rounded-2xl overflow-hidden shrink-0">
                            <div className="bg-[#fff0f3] border-b border-[#d81b60] py-4 text-center px-6">
                                <h1 className="text-2xl font-black font-outfit uppercase tracking-[0.2em] leading-none mb-1">
                                    {test?.organization || "OFFICIAL EXAMINATION BUREAU"}
                                </h1>
                                <p className="text-[9px] font-black tracking-widest opacity-70">SECURE OMR ANSWER SHEET • PART - 1</p>
                            </div>
                            <div className="flex bg-white text-[8px] font-black border-b border-[#d81b60]">
                                <div className="flex-1 py-3 px-4 border-r border-[#d81b60]">EXAM TITLE: {test?.title || 'GENERAL ASSESSMENT'}</div>
                                <div className="flex-1 py-3 px-4 bg-[#fff0f3]">CANDIDATE: {user?.name || 'GUEST CANDIDATE'}</div>
                            </div>
                        </div>

                        {/* Metadata Mock (Roll Number & Codes) */}
                        <div className="grid grid-cols-[180px_1fr_120px] gap-6 mb-8 h-[160px] shrink-0">
                             {/* Roll Number Grid */}
                             <div className="border-[1.5px] border-[#d81b60] rounded-xl flex flex-col bg-white overflow-hidden">
                                <div className="bg-[#fff0f3] text-[8px] font-black py-1.5 text-center border-b border-[#d81b60] tracking-widest">ROLL NUMBER</div>
                                <div className="flex-1 flex p-1.5 gap-[1px]">
                                   {[...Array(6)].map((_, col) => (
                                     <div key={col} className="flex-1 flex flex-col gap-[1px] opacity-40">
                                        <div className="h-4 border-b border-[#ffd1dc] bg-slate-50 mb-1"></div>
                                        {[...Array(10)].map((_, row) => (
                                          <div key={row} className="flex-1 flex items-center justify-center">
                                            <div className="w-[10px] h-[10px] rounded-full border border-[#d81b60] text-[5px] flex items-center justify-center font-black">
                                               {row}
                                            </div>
                                          </div>
                                        ))}
                                     </div>
                                   ))}
                                </div>
                             </div>

                             {/* Booklet & Info */}
                             <div className="flex flex-col gap-4">
                                <div className="border-[1.5px] border-[#d81b60] rounded-xl h-[65px] flex flex-col bg-white overflow-hidden">
                                   <div className="bg-[#fff0f3] text-[8px] font-black py-1.5 text-center border-b border-[#d81b60] uppercase tracking-widest">Booklet Number</div>
                                   <div className="flex-1 flex p-3 items-center justify-center gap-1.5">
                                      {[...Array(6)].map((_, i) => (
                                        <div key={i} className="w-6 h-6 border-[1.5px] border-[#d81b60] bg-slate-50 rounded-sm"></div>
                                      ))}
                                   </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 flex-1">
                                    <div className="border-[1.5px] border-[#d81b60] rounded-xl flex flex-col bg-white overflow-hidden">
                                        <div className="bg-[#fff0f3] text-[7.5px] font-black py-1 px-1 text-center border-b border-[#d81b60] uppercase italic">Series</div>
                                        <div className="flex-1 flex items-center justify-center gap-2">
                                            {['A', 'B', 'C', 'D'].map(l => (
                                                <div key={l} className="w-5 h-5 rounded-full border border-[#d81b60] text-[7px] font-black flex items-center justify-center opacity-40">{l}</div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="border-[1.5px] border-[#d81b60] rounded-xl flex flex-col bg-white overflow-hidden">
                                        <div className="bg-[#fff0f3] text-[7.5px] font-black py-1 px-1 text-center border-b border-[#d81b60] uppercase italic">Code</div>
                                        <div className="flex-1 flex items-center justify-center">
                                            <div className="w-8 h-8 font-mono font-black text-xl flex items-center justify-center">#{session?._id?.slice(-2).toUpperCase() || 'X1'}</div>
                                        </div>
                                    </div>
                                </div>
                             </div>

                             {/* Barcode Mock */}
                             <div className="flex flex-col gap-4">
                                <div className="flex-1 border-[1.5px] border-[#d81b60] rounded-xl bg-white p-3 flex flex-col justify-between">
                                    <div className="space-y-[1px] opacity-80">
                                        {[...Array(30)].map((_, i) => (
                                            <div key={i} className="bg-[#d81b60]" style={{ height: `${[1,2,4,1,3][i%5]}px`, width: '100%' }}></div>
                                        ))}
                                    </div>
                                    <div className="text-[7px] font-mono font-black text-center mt-2 tracking-tighter">SECURE-SESSION-{session?._id?.slice(-6).toUpperCase()}</div>
                                </div>
                             </div>
                        </div>

                        {/* OMR Question Body */}
                        <div className="flex-1 bg-white p-10 rounded-[2.5rem] shadow-inner border-[2px] border-[#ffd1dc]">
                             <div className="grid grid-cols-2 gap-12 h-full content-start">
                                {Array.from({ length: 2 }).map((_, col) => {
                                    const safeQuestions = questions || [];
                                    const colSize = Math.ceil(safeQuestions.length / 2) || 1;
                                    return (
                                        <div key={col} className="space-y-3">
                                            <div className="flex justify-between items-center px-4 mb-2">
                                                <span className="text-[7px] font-black opacity-30 uppercase tracking-[0.2em]">Q. No</span>
                                                <span className="text-[7px] font-black opacity-30 uppercase tracking-[0.2em]">Response</span>
                                            </div>
                                            {safeQuestions.slice(col * colSize, (col + 1) * colSize).map((q, qidx) => {
                                                const actualIdx = col * colSize + qidx;
                                                const isAnalyzed = actualIdx <= currentIndex;
                                                const isActive = actualIdx === currentIndex;
                                                return (
                                                        <div className="flex items-center gap-8 px-6 py-2 rounded-xl transition-all duration-300 relative group overflow-visible">
                                                            {/* AI Bounding Box (Only on active/analyzed rows) */}
                                                            {isAnalyzed && (
                                                                <div className={`absolute inset-0 border-2 rounded-xl pointer-events-none transition-all duration-300 
                                                                    ${isActive ? 'border-indigo-500 bg-indigo-50/10' : 'border-emerald-500/20'}`}>
                                                                    <div className={`absolute -top-3 left-2 px-1 text-[6px] font-black uppercase tracking-tighter
                                                                        ${isActive ? 'text-indigo-600' : 'text-emerald-600/40'}`}>
                                                                        {isActive ? '[REALTIME_AUDIT]' : '[OBJECT_IDENTIFIED]'}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            <span className="text-[11px] font-black text-[#d81b60] w-5 italic relative z-10">{String(actualIdx + 1).padStart(2, '0')}.</span>
                                                            <div className="flex gap-5 relative z-10">
                                                                {['A', 'B', 'C', 'D'].map(label => {
                                                                    const isUserSelect = answers && answers[actualIdx] === label;
                                                                    return (
                                                                        <div key={label} className="relative">
                                                                             <div className={`w-7 h-7 rounded-full border-[1.5px] border-[#d81b60] flex items-center justify-center text-[9px] font-black transition-all duration-300
                                                                                ${isAnalyzed && isUserSelect ? 'bg-[#d81b60] border-[#d81b60] text-white scale-110 shadow-lg' : 'text-[#d81b60]'}`}>
                                                                                {label}
                                                                            </div>
                                                                            {/* Confidence Readout on active bubble */}
                                                                            {isActive && isUserSelect && (
                                                                                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[6px] font-black text-indigo-600 animate-pulse">
                                                                                    CONF: 0.9984
                                                                                </div>
                                                                            )}
                                                                            {isAnalyzed && isUserSelect && (
                                                                                <div className={`bubble-${actualIdx}-${label} absolute inset-0 rounded-full bg-[#d81b60] pointer-events-none opacity-20 -z-10`} />
                                                                        )}
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )
                                })}
                             </div>
                        </div>

                        {/* Footer Markers */}
                        <div className="mt-8 flex justify-between items-center px-2">
                             <div className="flex gap-2">
                                {[...Array(6)].map((_, i) => <div key={i} className="w-4 h-4 bg-[#d81b60]"></div>)}
                             </div>
                             <div className="text-[9px] font-black italic tracking-widest opacity-40">MOCKER OMR INTERFACE • {test?.organizationCode || 'OFFICIAL'}</div>
                             <div className="flex gap-2">
                                {[...Array(6)].map((_, i) => <div key={i} className="w-4 h-4 bg-[#d81b60]"></div>)}
                             </div>
                        </div>
                    </div>

                    {/* Scanner line animation (Red Laser) */}
                    <div className="absolute inset-x-0 h-1.5 bg-[#d81b60] shadow-[0_0_20px_#d81b60] top-0 animate-scanning-line opacity-40 z-20"></div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes scanning-line {
                    0% { top: 0% }
                    100% { top: 100% }
                }
                .animate-scanning-line {
                    animation: scanning-line 3s linear infinite;
                }
            `}} />
        </div>
    )
}

const ProctorWebcam = ({ onHeadTurn }) => {
    const videoRef = React.useRef(null)
    const canvasRef = React.useRef(null)
    const lastFrame = React.useRef(null)
    const violationCooldown = React.useRef(false)

    useEffect(() => {
        let stream = null
        const setupCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: { width: 400, height: 300 } })
                if (videoRef.current) videoRef.current.srcObject = stream
            } catch (err) {
                console.error("Camera access failed:", err)
            }
        }
        setupCamera()

        // Ultra-High Sensitivity movement + presence monitor
        let calibration = null
        let absenceCounter = 0

        const interval = setInterval(() => {
            if (!videoRef.current || !canvasRef.current) return
            const ctx = canvasRef.current.getContext('2d')
            ctx.drawImage(videoRef.current, 0, 0, 100, 75)
            const frame = ctx.getImageData(0, 0, 100, 75).data
            
            // Calculate average luminosity for presence detection
            let avgLumi = 0
            for (let i = 0; i < frame.length; i += 4) {
                avgLumi += (frame[i] + frame[i+1] + frame[i+2]) / 3
            }
            avgLumi = avgLumi / (frame.length / 4)

            if (!calibration) {
                calibration = avgLumi
                console.log("Proctoring Calibrated Base Presence:", calibration)
            }

            if (lastFrame.current) {
                let totalDiff = 0
                for (let i = 0; i < frame.length; i += 4) {
                    const pixelDiff = Math.abs(frame[i] - lastFrame.current[i])
                    if (pixelDiff > 25) totalDiff += pixelDiff
                }
                
                // 1. Movement Detection (Lowered to 150k for ultra sensitivity)
                if (totalDiff > 150000 && !violationCooldown.current) {
                    console.log("High Movement Detected:", totalDiff)
                    violationCooldown.current = true
                    onHeadTurn("Significant movement detected")
                    setTimeout(() => violationCooldown.current = false, 5000)
                }

                // 2. Presence Check (If luminosity shifts drastically, person probably left)
                const lumiShift = Math.abs(avgLumi - calibration)
                if (lumiShift > 25) { // Significant change in frame composition
                    absenceCounter++
                    if (absenceCounter > 8 && !violationCooldown.current) { // Lasting over 2 seconds
                        console.log("Presence Lost/Drastic Change Detected:", lumiShift)
                        violationCooldown.current = true
                        onHeadTurn("User presence or focus lost")
                        setTimeout(() => {
                            violationCooldown.current = false
                            absenceCounter = 0
                        }, 5000)
                    }
                } else {
                    absenceCounter = Math.max(0, absenceCounter - 1)
                }
            }
            lastFrame.current = frame
        }, 250)

        return () => {
            if (stream) stream.getTracks().forEach(t => t.stop())
            clearInterval(interval)
        }
    }, [onHeadTurn])

    return (
        <div className="w-full h-full bg-slate-800">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
            <canvas ref={canvasRef} width="100" height="75" className="hidden" />
        </div>
    )
}
