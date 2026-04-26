import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { LayoutDashboard, Users, TrendingUp, AlertTriangle, ChevronLeft, Download, CheckCircle2, Upload } from 'lucide-react'

const AnalyticsCard = ({ title, value, icon: Icon, subtext }) => (
    <div className="bg-white p-6 lg:p-8 rounded-2xl lg:rounded-[2.5rem] border border-slate-100 shadow-sm space-y-3 lg:space-y-4">
        <div className="flex justify-between items-start">
             <div className="w-10 h-10 lg:w-12 lg:h-12 bg-slate-50 text-slate-950 rounded-xl lg:rounded-2xl flex items-center justify-center border border-slate-100">
                <Icon size={20} lg:size={24} />
            </div>
            <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">+12%</span>
        </div>
        <div>
            <h3 className="text-2xl lg:text-4xl font-black font-outfit text-slate-950">{value}</h3>
            <p className="text-[10px] lg:text-sm font-bold text-slate-400 uppercase tracking-widest leading-none mt-1 lg:mt-2">{title}</p>
        </div>
        <p className="text-[10px] text-slate-400 font-medium">{subtext}</p>
    </div>
)

export default function AnalyticsDashboard() {
    const { testId } = useParams()
    const navigate = useNavigate()
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/results/test/${testId}`)
                setResults(res.data)
            } catch (err) {
                console.error('Failed to fetch analytics', err)
            } finally {
                setLoading(false)
            }
        }
        fetchAnalytics()
    }, [testId])

    if (loading) return <div className="h-screen flex items-center justify-center font-bold">Aggregating Global Data...</div>

    const avgScore = results.length > 0 ? (results.reduce((acc, r) => acc + r.scoredMarks, 0) / results.length).toFixed(1) : 0
    const topScorer = results[0]?.scoredMarks || 0

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
             <header className="h-16 lg:h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 px-4 lg:px-10 flex items-center justify-between z-50">
                <div className="flex items-center gap-2 lg:gap-4">
                    <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-500 hover:text-slate-950">
                        <ChevronLeft size={20} lg:size={24} />
                    </button>
                    <h2 className="text-sm lg:text-lg font-black font-outfit text-slate-950 tracking-tight">Test Intelligence</h2>
                </div>
                <div className="flex items-center gap-2 lg:gap-4">
                    <button className="p-2 lg:px-5 lg:py-2.5 bg-slate-950 text-white rounded-xl flex items-center gap-2 text-[10px] lg:text-sm font-black shadow-lg shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all">
                        <Upload size={16} /> <span className="hidden sm:inline">OMR Import</span>
                    </button>
                    <button className="p-2 lg:px-5 lg:py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl flex items-center gap-2 text-[10px] lg:text-sm font-black hover:bg-slate-50 transition-all">
                        <Download size={16} /> <span className="hidden sm:inline">Export</span>
                    </button>
                </div>
            </header>

            <main className="flex-1 p-4 lg:p-12 max-w-7xl mx-auto w-full space-y-8 lg:space-y-12">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
                    <AnalyticsCard title="Candidates" value={results.length} icon={Users} subtext="Real-time participation" />
                    <AnalyticsCard title="Avg Score" value={avgScore} icon={TrendingUp} subtext="Performance average" />
                    <AnalyticsCard title="Top Scorer" value={topScorer} icon={CheckCircle2} subtext="Highest achievement" />
                    <AnalyticsCard title="Violations" value="08" icon={AlertTriangle} subtext="Proctoring alerts" />
                </div>

                <div className="bg-white rounded-[2rem] lg:rounded-[3rem] border border-slate-100 p-6 lg:p-12 shadow-sm overflow-hidden">
                    <h3 className="text-xl lg:text-2xl font-black font-outfit text-slate-950 mb-6 lg:mb-10 flex items-center gap-3">
                        <TrendingUp size={24} className="text-slate-400" /> Performance Leaderboard
                    </h3>
                    
                    <div className="overflow-x-auto -mx-6 px-6">
                        <table className="w-full text-left min-w-[600px]">
                            <thead className="border-b border-slate-50">
                                <tr className="text-slate-400 font-black uppercase text-[8px] lg:text-[10px] tracking-widest">
                                    <th className="pb-4 lg:pb-6 px-4">Rank</th>
                                    <th className="pb-4 lg:pb-6 px-4">Candidate</th>
                                    <th className="pb-4 lg:pb-6 px-4">Score</th>
                                    <th className="pb-4 lg:pb-6 px-4">Accuracy</th>
                                    <th className="pb-4 lg:pb-6 px-4 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {results.map((res, idx) => (
                                    <tr key={res._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="py-4 lg:py-6 px-4">
                                             <div className={`w-7 h-7 lg:w-8 lg:h-8 rounded-lg flex items-center justify-center font-black text-xs lg:text-sm ${idx === 0 ? 'bg-slate-950 text-white' : 'text-slate-500'}`}>
                                                {idx + 1}
                                             </div>
                                        </td>
                                        <td className="py-4 lg:py-6 px-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-950 text-sm lg:text-base">{res.candidateId?.name}</span>
                                                <span className="text-[10px] text-slate-400">{res.candidateId?.email}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 lg:py-6 px-4">
                                             <div className="flex items-end gap-1">
                                                <span className="text-base lg:text-lg font-black font-outfit text-slate-950">{res.scoredMarks}</span>
                                                <span className="text-[10px] font-bold text-slate-400 mb-0.5 lg:mb-1">/ {res.totalMarks}</span>
                                             </div>
                                        </td>
                                        <td className="py-4 lg:py-6 px-4">
                                             <div className="flex items-center gap-2 lg:gap-3">
                                                 <div className="flex-1 max-w-[60px] lg:max-w-[80px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-slate-950 rounded-full" style={{ width: `${res.accuracy}%` }} />
                                                 </div>
                                                 <span className="text-[10px] lg:text-xs font-black text-slate-950">{res.accuracy}%</span>
                                             </div>
                                        </td>
                                        <td className="py-4 lg:py-6 px-4 text-right">
                                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[8px] lg:text-[10px] font-black uppercase tracking-widest border border-emerald-100">Submitted</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    )
}
