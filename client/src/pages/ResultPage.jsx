import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { CheckCircle2, XCircle, AlertCircle, TrendingUp, BarChart3, ArrowRight, ClipboardList, Share2, Twitter, Linkedin, Link2, Smartphone, ScanLine, X } from 'lucide-react'
import OMRSheet from '../components/exam/OMRSheet'

const StatItem = ({ label, value, icon: Icon, color }) => (
    <div className="bg-white p-4 lg:p-6 rounded-2xl lg:rounded-[2rem] border border-slate-100 flex items-center gap-4 lg:gap-6 shadow-sm hover:translate-y-[-2px] transition-all">
        <div className={`w-10 h-10 lg:w-14 lg:h-14 ${color} rounded-xl lg:rounded-2xl flex items-center justify-center text-white shadow-lg`}>
            <Icon size={18} lg:size={24} strokeWidth={2.5} />
        </div>
        <div>
            <p className="text-[8px] lg:text-sm font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
            <h3 className="text-xl lg:text-3xl font-black font-outfit text-slate-900">{value}</h3>
        </div>
    </div>
)

export default function ResultPage() {
    const { sessionId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showOMR, setShowOMR] = useState(false)

    useEffect(() => {
        const fetchResult = async () => {
             // Check for state passed from ExamPage first for immediate/real calculation
            if (location.state && location.state.answers && location.state.questions) {
                const { answers, questions } = location.state;
                let totalMarks = 0, scoredMarks = 0, correct = 0, incorrect = 0, attempted = 0;

                questions.forEach((q, idx) => {
                    totalMarks += (q.marks || 1);
                    const selected = answers[idx];
                    if (selected) {
                        attempted++;
                        if (selected === q.correct) {
                            scoredMarks += (q.marks || 1);
                            correct++;
                        } else {
                            incorrect++;
                        }
                    }
                });

                const topicMap = {};
                questions.forEach((q, idx) => {
                    const topic = q.topic || 'General';
                    if (!topicMap[topic]) topicMap[topic] = { total: 0, correct: 0 };
                    topicMap[topic].total += (q.marks || 1);
                    if (answers[idx] === q.correct) {
                        topicMap[topic].correct += (q.marks || 1);
                    }
                });

                const topicPerformance = Object.keys(topicMap).map(topic => ({
                    topic,
                    score: Math.round((topicMap[topic].correct / topicMap[topic].total) * 100)
                }));

                setResult({
                    scoredMarks,
                    totalMarks,
                    accuracy: attempted > 0 ? (correct / attempted * 100).toFixed(1) : 0,
                    attempted,
                    correct,
                    incorrect,
                    unattempted: questions.length - attempted,
                    topicPerformance
                });
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get(`http://localhost:5000/api/results/${sessionId}`)
                // Add demo topics if backend doesn't provide them
                const data = res.data;
                if (!data.topicPerformance) {
                    data.topicPerformance = [
                        { topic: 'Mental Ability', score: 85 },
                        { topic: 'Core Technical', score: 92 },
                        { topic: 'Communication', score: 64 },
                    ];
                }
                setResult(data)
            } catch (err) {
                console.error('Failed to fetch result', err)
            } finally {
                setLoading(false)
            }
        }
        fetchResult()
    }, [sessionId, location.state])

    if (loading) return <div className="h-screen flex items-center justify-center font-bold">Generating Report...</div>

    // Build evaluations map for OMR sheet (all questions evaluated on static result page)
    const questions = location.state?.questions || []
    const answers = location.state?.answers || []
    const evaluations = questions.reduce((acc, q, idx) => {
        const selected = answers[idx]
        const isCorrect = selected && selected === q.correct
        const isWrong = selected && selected !== q.correct
        acc[idx] = {
            isCorrect,
            isWrong,
            isSkipped: !selected,
            marks: q.marks || 1,
            negMarks: q.negativeMarks || 0
        }
        return acc
    }, {})

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-12 overflow-y-auto font-sans">

            {/* ── OMR Sheet Full-Screen Modal ── */}
            {showOMR && (
                <div className="fixed inset-0 z-[200] bg-slate-950/90 backdrop-blur-md overflow-y-auto flex flex-col items-center py-6 px-4">
                    <div className="w-full max-w-5xl">
                        <div className="flex items-center justify-between mb-6 px-4">
                            <div>
                                <h2 className="text-white text-xl lg:text-2xl font-black">OMR Answer Sheet</h2>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Digital Evaluation Review</p>
                            </div>
                            <button
                                onClick={() => setShowOMR(false)}
                                className="flex items-center gap-2 px-6 py-3 bg-white text-slate-950 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                                <X size={16} /> Close Review
                            </button>
                        </div>
                        <div className="bg-white rounded-[2rem] overflow-hidden p-2 lg:p-8">
                            <OMRSheet
                                questions={questions}
                                answers={answers}
                                evaluations={questions.length > 0 ? evaluations : null}
                                currentIndex={-1}
                                session={{ _id: sessionId }}
                                test={{ title: result?.testTitle || 'Assessment' }}
                                userName={result?.candidateName || ''}
                            />
                        </div>
                    </div>
                </div>
            )}
            <header className="max-w-6xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 lg:mb-16 gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl lg:text-5xl font-black font-outfit text-slate-950 tracking-tight leading-tight italic">Assessment Outcome</h1>
                    <p className="text-slate-500 font-medium text-xs lg:text-lg border-l-2 border-slate-200 pl-4 italic">Comprehensive score analysis and performance metrics.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    {questions.length > 0 && (
                        <button
                            onClick={() => setShowOMR(true)}
                            className="flex items-center justify-center gap-2 bg-slate-950 text-white py-3 lg:py-4 px-6 lg:px-8 rounded-xl lg:rounded-2xl text-[10px] lg:text-sm font-black shadow-xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            <ScanLine size={18} /> View OMR Sheet
                        </button>
                    )}
                    {location.state?.uniqueLink && (
                        <button 
                            onClick={() => navigate(`/exam-ready/${location.state.uniqueLink}`)} 
                            className="bg-white text-slate-900 border border-slate-200 py-3 lg:py-4 px-6 lg:px-8 rounded-xl lg:rounded-2xl text-[10px] lg:text-sm font-black flex items-center justify-center gap-2 shadow-sm hover:bg-slate-50 transition-all"
                        >
                            Retake Exam
                        </button>
                    )}
                    <button onClick={() => navigate('/')} className="bg-slate-950 text-white py-3 lg:py-4 px-6 lg:px-8 rounded-xl lg:rounded-2xl text-[10px] lg:text-sm font-black flex items-center justify-center gap-2 shadow-2xl shadow-slate-200">
                        Exit Dashboard <ArrowRight size={18} />
                    </button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto space-y-8 lg:space-y-12">
                {/* Score Section */}
                <div className="bg-slate-950 rounded-[2rem] lg:rounded-[3rem] p-8 lg:p-14 flex flex-col lg:flex-row items-center justify-between text-white shadow-2xl relative overflow-hidden group gap-8">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-1000" />
                    <div className="relative z-10 space-y-4 text-center lg:text-left w-full lg:w-auto">
                        <span className="text-[10px] lg:text-xs font-black uppercase tracking-widest text-slate-500">Total Scored Points</span>
                        <h2 className="text-5xl lg:text-7xl font-black font-outfit leading-none italic">
                            {result?.scoredMarks?.toFixed(1)} <span className="text-xl lg:text-3xl text-slate-600">/ {result?.totalMarks}</span>
                        </h2>
                        <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                            <div className="px-5 py-2 bg-white/5 rounded-full text-[9px] lg:text-xs font-black uppercase tracking-widest border border-white/5 backdrop-blur-md">Accuracy: {result?.accuracy}%</div>
                            <div className="px-5 py-2 bg-emerald-500/10 text-emerald-500 rounded-full text-[9px] lg:text-xs font-black uppercase tracking-widest border border-emerald-500/10 backdrop-blur-md">Status: Passed</div>
                        </div>
                    </div>
                    <div className="relative z-10 hidden lg:block pr-10">
                        <TrendingUp size={120} className="text-emerald-500 opacity-20" />
                    </div>
                </div>

                {/* Share Section */}
                <div className="bg-white rounded-[2rem] border border-slate-100 p-6 lg:p-10 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-slate-50 rounded-xl lg:rounded-2xl flex items-center justify-center text-slate-900">
                            <Share2 size={20} lg:size={24} />
                        </div>
                        <div>
                            <h4 className="text-lg lg:text-xl font-black font-outfit text-slate-950 leading-none mb-1">Share Your Success</h4>
                            <p className="text-xs lg:text-sm font-medium text-slate-500">Let your network know about your achievement.</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3">
                        <button 
                            onClick={() => {
                                const text = `I just scored ${result?.scoredMarks?.toFixed(1)}/${result?.totalMarks} on Mocker! 🚀 #Mocker #SmartExams`;
                                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
                            }}
                            className="p-3.5 bg-slate-50 rounded-xl text-slate-900 border border-slate-100 hover:bg-slate-950 hover:text-white transition-all group"
                        >
                            <Twitter size={18} fill="currentColor" />
                        </button>
                        <button 
                            onClick={() => {
                                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
                            }}
                            className="p-3.5 bg-slate-50 rounded-xl text-slate-900 border border-slate-100 hover:bg-slate-950 hover:text-white transition-all"
                        >
                            <Linkedin size={18} fill="currentColor" />
                        </button>
                        <button 
                            onClick={() => {
                                const text = `I just scored ${result?.scoredMarks?.toFixed(1)}/${result?.totalMarks} on Mocker! 🚀 Check it out: ${window.location.href}`;
                                window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                            }}
                            className="p-3.5 bg-slate-50 rounded-xl text-slate-900 border border-slate-100 hover:bg-slate-950 hover:text-white transition-all"
                        >
                            <Smartphone size={18} />
                        </button>
                        <button 
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                alert('Link copied to clipboard!');
                            }}
                            className="flex items-center gap-2 px-5 py-3.5 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                        >
                            <Link2 size={16} /> Copy Link
                        </button>
                    </div>
                </div>

                {/* Grid Components */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
                    <StatItem label="Attempted" value={result?.attempted} icon={ClipboardList} color="bg-slate-800" />
                    <StatItem label="Correct" value={result?.correct} icon={CheckCircle2} color="bg-emerald-500" />
                    <StatItem label="Incorrect" value={result?.incorrect} icon={XCircle} color="bg-red-500" />
                    <StatItem label="Unattempted" value={result?.unattempted} icon={AlertCircle} color="bg-amber-500" />
                </div>

                {/* Detailed Review Section */}
                <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 p-8 md:p-12 shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                        <div>
                            <h3 className="text-3xl font-black font-outfit text-slate-900 flex items-center gap-4">
                                <ClipboardList size={32} className="text-slate-400" /> Question Review
                            </h3>
                            <p className="text-slate-500 font-medium text-sm mt-1">Review your responses and identify areas for improvement.</p>
                        </div>
                        <div className="flex gap-2">
                            <span className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">Correct: {result?.correct}</span>
                            <span className="px-4 py-2 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-100">Incorrect: {result?.incorrect}</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {(location.state?.questions || []).map((q, idx) => {
                            const userAnswer = location.state?.answers[idx];
                            const correctAns = q.correct || (q.correctAnswers && q.correctAnswers[0]);
                            const isCorrect = userAnswer === correctAns;
                            const isSkipped = !userAnswer;

                            return (
                                <div key={idx} className={`p-8 rounded-[2rem] border transition-all ${isCorrect ? 'bg-emerald-50/30 border-emerald-100' : isSkipped ? 'bg-slate-50 border-slate-100' : 'bg-red-50/30 border-red-100'}`}>
                                    <div className="flex justify-between items-start mb-4 gap-4">
                                        <div className="flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xs font-black text-slate-900 shadow-sm">
                                                {idx + 1}
                                            </span>
                                            <h4 className="text-lg font-bold text-slate-900 leading-tight">{q.questionText}</h4>
                                        </div>
                                        {isSkipped ? (
                                            <span className="px-3 py-1 bg-slate-200 text-slate-600 rounded-lg text-[9px] font-black uppercase tracking-tighter whitespace-nowrap">Skipped</span>
                                        ) : isCorrect ? (
                                            <span className="px-3 py-1 bg-emerald-500 text-white rounded-lg text-[9px] font-black uppercase tracking-tighter flex items-center gap-1">
                                                <CheckCircle2 size={10} /> Correct
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 bg-red-500 text-white rounded-lg text-[9px] font-black uppercase tracking-tighter flex items-center gap-1">
                                                <XCircle size={10} /> Incorrect
                                            </span>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                        <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Your Answer</p>
                                            <p className={`text-sm font-black ${isSkipped ? 'text-slate-400 italic' : isCorrect ? 'text-emerald-600' : 'text-red-600'}`}>
                                                {userAnswer ? `${userAnswer}. ${q.options?.find(o => o.label === userAnswer)?.text || ''}` : 'No answer provided'}
                                            </p>
                                        </div>
                                        <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm border-l-4 border-l-emerald-500">
                                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Correct Answer</p>
                                            <p className="text-sm font-black text-slate-900">
                                                {correctAns}. {q.options?.find(o => o.label === correctAns)?.text || ''}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {(q.explanation || q.description) && (
                                        <div className="mt-6 p-6 bg-slate-950 rounded-[1.5rem] border border-white/5 text-white shadow-xl shadow-slate-200 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-2xl" />
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center">
                                                    <AlertCircle size={14} className="text-white" />
                                                </div>
                                                <span className="font-black text-[10px] lg:text-xs uppercase tracking-widest text-slate-400">Description / Justification</span>
                                            </div>
                                            <p className="text-xs lg:text-sm font-bold text-slate-200 leading-relaxed italic pl-9 border-l-2 border-emerald-500/30">
                                                {q.explanation || q.description}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
                {/* Topic Performance Section */}
                <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 p-8 md:p-12 shadow-sm">
                    <h3 className="text-3xl font-black font-outfit text-slate-900 mb-8 flex items-center gap-4">
                        <BarChart3 size={32} className="text-slate-400" /> Topic Performance
                    </h3>
                    <div className="space-y-6">
                        {(result?.topicPerformance || []).map((item, idx) => (
                            <div key={idx} className="space-y-3">
                                <div className="flex justify-between font-bold text-slate-700">
                                    <span>{item.topic}</span>
                                    <span>{item.score}%</span>
                                </div>
                                <div className="h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                                    <div className="h-full bg-slate-900 rounded-full transition-all duration-1000" style={{ width: `${item.score}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}

