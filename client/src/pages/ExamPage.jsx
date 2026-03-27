import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { OMRSheet } from '../components/exam/OMRSheet'
import { Timer } from '../components/exam/Timer'
import { useProctor } from '../hooks/useProctor'
import { ChevronLeft, ChevronRight, Send, AlertCircle, TrendingUp, CheckCircle, XCircle } from 'lucide-react'
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

    useProctor({
        onViolation: (violation) => {
            console.warn('Violation detected:', violation.type)
            // Log violation to backend
            if (session) {
                axios.post(`http://localhost:5000/api/sessions/${session._id}/violation`, violation)
            }
        }
    })

    const handleSelect = (idx, opt) => {
        setAnswers({ ...answers, [idx]: opt })
    }

    const handleSubmit = async () => {
        if (window.confirm('Are you sure you want to submit the exam?')) {
            setIsGrading(true)
        }
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

    if (loading) return <div className="h-screen flex items-center justify-center font-bold">Loading Exam Environment...</div>

    const currentQuestion = questions[currentQ]

    return (
        <div className="h-screen flex flex-col bg-slate-50 overflow-hidden font-sans">
            <header className="h-20 bg-white border-b border-slate-200 px-10 flex items-center justify-between shrink-0">
                <div className="flex flex-col">
                    <h1 className="text-xl font-black font-outfit uppercase tracking-wider text-slate-900">{test?.title}</h1>
                    <span className="text-xs font-bold text-slate-400">SESSION ID: {session?._id.slice(-8)}</span>
                </div>
                <div className="flex items-center gap-6">
                    <Timer durationMinutes={test?.duration || 30} onTimeUp={handleSubmit} onWarning={(msg) => alert(msg)} />
                    <button onClick={handleSubmit} className="btn-primary py-3 px-8 flex items-center gap-2 font-bold shadow-lg shadow-slate-200">
                        Submit Exam <Send size={18} />
                    </button>
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden p-6 gap-6">
                {/* LEFT: Question Section */}
                <div className="flex-[3] flex flex-col bg-white rounded-[2.5rem] border border-slate-200/60 shadow-xl shadow-slate-200/20 overflow-hidden">
                    <div className="flex-1 p-10 overflow-y-auto custom-scrollbar">
                        {questions.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 animate-pulse">
                                    <AlertCircle size={48} />
                                </div>
                                <h2 className="text-3xl font-black text-slate-900 font-outfit">Preparing Assessment...</h2>
                                <p className="text-slate-500 max-w-sm font-medium leading-relaxed italic">The secure environment is being initialized. If this persists, please refresh your browser.</p>
                            </div>
                        ) : (
                            <div className="max-w-3xl mx-auto w-full">
                                <div className="flex items-center gap-6 mb-8">
                                     <div className="px-5 py-1.5 bg-[#0F172A] text-white rounded-full text-[9px] font-black uppercase tracking-[0.2em]">QUESTION {currentQ + 1}</div>
                                     <div className="h-px flex-1 bg-slate-100"></div>
                                     <div className="px-3 py-1 bg-slate-50 rounded-xl text-slate-500 font-bold text-[10px] border border-slate-100 uppercase tracking-widest">{currentQuestion?.marks} MARKS</div>
                                </div>

                                <h2 className="text-2xl md:text-3xl font-black font-outfit text-[#0F172A] mb-8 leading-[1.2] tracking-tight">{currentQuestion?.questionText}</h2>
                                
                                <div className="space-y-3">
                                    {currentQuestion?.options.map((opt) => (
                                        <button 
                                            key={opt.label}
                                            onClick={() => handleSelect(currentQ, opt.label)}
                                            className={`w-full text-left p-4 md:p-5 rounded-2xl border-2 transition-all duration-300 flex items-center gap-6 group relative overflow-hidden
                                                ${answers[currentQ] === opt.label 
                                                    ? 'bg-[#0F172A] border-[#0F172A] text-white shadow-xl -translate-y-0.5' 
                                                    : 'bg-white border-slate-100 hover:border-slate-300 text-slate-700 hover:bg-slate-50 active:translate-y-0.5'}`}
                                        >
                                            <div className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center font-black text-sm transition-all duration-300 shrink-0
                                                ${answers[currentQ] === opt.label ? 'bg-white border-white text-[#0F172A] rotate-12 scale-105' : 'bg-slate-50 border-slate-100 text-slate-400 group-hover:border-slate-900 group-hover:text-slate-900'}`}>
                                                {opt.label}
                                            </div>
                                            <span className="text-lg font-bold font-outfit tracking-tight">{opt.text}</span>
                                            
                                            {/* Selection indicator dot */}
                                            {answers[currentQ] === opt.label && (
                                                <div className="absolute right-8 w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_12px_rgba(129,140,248,0.8)]"></div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="h-32 bg-white border-t border-slate-100 px-16 flex items-center justify-between shrink-0">
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
                <div className="flex-1 flex flex-col gap-6 shrink-0 min-w-[380px]">
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
                    
                </div>
            </main>

            {isGrading && (
                <GradingOverlay 
                    questions={questions} 
                    answers={answers} 
                    onComplete={onGradingComplete} 
                />
            )}
        </div>
    )
}

const GradingOverlay = ({ questions, answers, onComplete }) => {
    const container = React.useRef()
    const [currentScore, setCurrentScore] = useState(0)
    const [currentIndex, setCurrentIndex] = useState(-1)
    
    useGSAP(() => {
        const tl = gsap.timeline({
            onComplete: () => {
                gsap.to(container.current, {
                    opacity: 0,
                    delay: 1,
                    duration: 0.5,
                    onComplete
                })
            }
        })

        // Initial entrance
        tl.from('.grading-card', {
            scale: 0.8,
            y: 50,
            duration: 0.8,
            ease: 'back.out(1.7)'
        })

        // Staggered grading
        questions.forEach((q, idx) => {
            tl.to({}, {
                duration: 0.4,
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
                duration: 0.3,
                ease: 'power2.out'
            }, '<')

            tl.to(`.status-${idx}`, {
                scale: 1,
                opacity: 1,
                duration: 0.3,
                ease: 'back.out(2)'
            }, '>-0.1')
        })

    }, { scope: container })

    return (
        <div ref={container} className="fixed inset-0 z-[100] bg-[#0F172A]/90 backdrop-blur-xl flex items-center justify-center p-8">
            <div className="grading-card w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Score Header */}
                <div className="bg-[#0F172A] p-10 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                    <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em] mb-2">Automated Grading Engine</p>
                    <div className="flex items-center justify-center gap-4">
                         <h2 className="text-6xl font-black font-outfit text-white tabular-nums">
                            {currentScore.toFixed(0)}
                        </h2>
                        <div className="text-left">
                            <p className="text-indigo-400 text-xs font-bold leading-none">TOTAL</p>
                            <p className="text-indigo-400 text-xs font-bold leading-none">SCORE</p>
                        </div>
                    </div>
                </div>

                {/* Progress List */}
                <div className="flex-1 overflow-y-auto p-10 space-y-3 custom-scrollbar">
                    {questions.map((q, idx) => {
                        const isCorrect = answers[idx] === q.correct;
                        const isActive = idx === currentIndex;
                        const isDone = idx <= currentIndex;
                        
                        return (
                            <div 
                                key={idx} 
                                className={`row-${idx} flex items-center justify-between p-4 rounded-2xl transition-all duration-300 border
                                    ${isActive ? 'bg-slate-50 border-slate-200 scale-[1.02] shadow-sm' : 'border-transparent'}
                                    ${isDone ? 'opacity-100' : 'opacity-20'}`}
                            >
                                <div className="flex items-center gap-6">
                                    <span className="text-xs font-black text-slate-300 w-6 uppercase tracking-widest">Q{idx + 1}</span>
                                    <div className="flex gap-2">
                                        {['A', 'B', 'C', 'D'].map(label => (
                                            <div 
                                                key={label}
                                                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-black
                                                    ${answers[idx] === label 
                                                        ? (isDone ? (isCorrect ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-red-500 border-red-500 text-white') : 'bg-slate-900 border-slate-900 text-white')
                                                        : 'border-slate-100 text-slate-200'}`}
                                            >
                                                {label}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className={`status-${idx} opacity-0 scale-50 shrink-0`}>
                                    {isCorrect ? (
                                        <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-wider">
                                            <CheckCircle size={14} strokeWidth={3} /> Correct +{q.marks}
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-red-500 font-black text-[10px] uppercase tracking-wider">
                                            <XCircle size={14} strokeWidth={3} /> Incorrect
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="p-8 bg-slate-50 border-t border-slate-100 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">
                        Verifying responses with secure proctoring data...
                    </p>
                </div>
            </div>
        </div>
    )
}
