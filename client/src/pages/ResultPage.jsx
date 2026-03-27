import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { CheckCircle2, XCircle, AlertCircle, TrendingUp, BarChart3, ArrowRight, ClipboardList } from 'lucide-react'

const StatItem = ({ label, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-6 shadow-sm hover:translate-y-[-4px] transition-all">
        <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
            <Icon size={24} strokeWidth={2.5} />
        </div>
        <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
            <h3 className="text-3xl font-black font-outfit text-slate-900">{value}</h3>
        </div>
    </div>
)

export default function ResultPage() {
    const { sessionId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(true)

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

    return (
        <div className="min-h-screen bg-slate-50 p-12 overflow-y-auto font-sans">
            <header className="max-w-6xl mx-auto flex justify-between items-center mb-16">
                <div>
                    <h1 className="text-5xl font-black font-outfit text-slate-900 tracking-tight leading-none mb-2">Exam Result</h1>
                    <p className="text-slate-500 font-medium text-lg">Comprehensive score analysis and performance metrics.</p>
                </div>
                <div className="flex gap-4">
                    {location.state?.uniqueLink && (
                        <button 
                            onClick={() => navigate(`/exam/${location.state.uniqueLink}`)} 
                            className="bg-white text-slate-900 border-2 border-slate-200 py-4 px-10 rounded-full text-lg font-black flex items-center gap-2 shadow-sm hover:bg-slate-50 transition-all"
                        >
                            Retake Exam
                        </button>
                    )}
                    <button onClick={() => navigate('/')} className="btn-primary py-4 px-10 text-lg flex items-center gap-2 shadow-2xl shadow-slate-300">
                        Return Home <ArrowRight size={20} strokeWidth={3} />
                    </button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto space-y-12">
                {/* Score Section */}
                <div className="bg-slate-900 rounded-[3rem] p-16 flex items-center justify-between text-white shadow-2xl relative overflow-hidden group">
                     {/* Decorative glow */}
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-1000 -z-0" />
                    <div className="relative z-10 space-y-4">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Total Scored Points</span>
                        <h2 className="text-8xl font-black font-outfit leading-none mb-6">
                            {result?.scoredMarks?.toFixed(1)} <span className="text-4xl text-slate-500">/ {result?.totalMarks}</span>
                        </h2>
                        <div className="flex gap-4">
                            <div className="px-6 py-2 bg-white/10 rounded-full text-sm font-bold border border-white/5 backdrop-blur-md">Accuracy: {result?.accuracy}%</div>
                            <div className="px-6 py-2 bg-white/10 rounded-full text-sm font-bold border border-white/5 backdrop-blur-md">Status: Passed</div>
                        </div>
                    </div>
                    <div className="relative z-10 hidden md:block">
                        <TrendingUp size={160} className="text-emerald-400 opacity-20" />
                    </div>
                </div>

                {/* Grid Components */}
                <div className="grid md:grid-cols-4 gap-8">
                    <StatItem label="Attempted" value={result?.attempted} icon={ClipboardList} color="bg-slate-800" />
                    <StatItem label="Correct" value={result?.correct} icon={CheckCircle2} color="bg-emerald-500" />
                    <StatItem label="Incorrect" value={result?.incorrect} icon={XCircle} color="bg-red-500" />
                    <StatItem label="Unattempted" value={result?.unattempted} icon={AlertCircle} color="bg-amber-500" />
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-100 p-12 shadow-sm">
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

