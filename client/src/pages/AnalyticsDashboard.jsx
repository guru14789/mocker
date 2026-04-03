import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { LayoutDashboard, Users, TrendingUp, AlertTriangle, ChevronLeft, Download, CheckCircle2, Upload } from 'lucide-react'

const AnalyticsCard = ({ title, value, icon: Icon, subtext }) => (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
        <div className="flex justify-between items-start">
             <div className="w-12 h-12 bg-slate-50 text-slate-900 rounded-2xl flex items-center justify-center border border-slate-100">
                <Icon size={24} />
            </div>
            <span className="text-emerald-500 text-xs font-black uppercase tracking-widest">+12%</span>
        </div>
        <div>
            <h3 className="text-4xl font-black font-outfit text-slate-900">{value}</h3>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none mt-2">{title}</p>
        </div>
        <p className="text-xs text-slate-400 font-medium">{subtext}</p>
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
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
             <header className="h-20 bg-white border-b border-slate-200 sticky top-0 px-10 flex items-center justify-between z-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-slate-50 rounded-lg transition-all text-slate-500 hover:text-slate-900">
                        <ChevronLeft size={24} />
                    </button>
                    <h2 className="text-lg font-bold font-outfit text-slate-900">Test Analytics & Insights</h2>
                </div>
                <div className="flex items-center gap-4">
                    <button className="px-6 py-2.5 bg-slate-950 text-white rounded-xl flex items-center gap-2 text-sm font-black shadow-lg shadow-slate-200 hover:scale-105 active:scale-95 transition-all">
                        <Upload size={18} /> Bulk OMR Import
                    </button>
                    <button className="btn-secondary py-2.5 px-6 flex items-center gap-2 text-sm font-bold border-slate-200">
                        <Download size={18} /> Export CSV
                    </button>
                </div>
            </header>

            <main className="flex-1 p-12 max-w-7xl mx-auto w-full space-y-12">
                <div className="grid md:grid-cols-4 gap-8">
                    <AnalyticsCard title="Total Candidates" value={results.length} icon={Users} subtext="Track real-time participation" />
                    <AnalyticsCard title="Average Score" value={avgScore} icon={TrendingUp} subtext="Global performance average" />
                    <AnalyticsCard title="Top Scorer" value={topScorer} icon={CheckCircle2} subtext="Highest achievement on test" />
                    <AnalyticsCard title="Violation Checks" value="08" icon={AlertTriangle} subtext="Total proctoring alerts" />
                </div>

                <div className="bg-white rounded-[3rem] border border-slate-100 p-12 shadow-sm overflow-hidden">
                    <h3 className="text-2xl font-black font-outfit text-slate-900 mb-10 flex items-center gap-4">
                        <TrendingUp size={28} className="text-slate-400" /> Performance Leaderboard
                    </h3>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b border-slate-50">
                                <tr className="text-slate-400 font-black uppercase text-[10px] tracking-widest">
                                    <th className="pb-6 px-4">Rank</th>
                                    <th className="pb-6 px-4">Candidate Name</th>
                                    <th className="pb-6 px-4">Scored / Total</th>
                                    <th className="pb-6 px-4">Accuracy</th>
                                    <th className="pb-6 px-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {results.map((res, idx) => (
                                    <tr key={res._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="py-6 px-4">
                                             <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm ${idx === 0 ? 'bg-slate-900 text-white' : 'text-slate-500'}`}>
                                                {idx + 1}
                                             </div>
                                        </td>
                                        <td className="py-6 px-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900">{res.candidateId?.name}</span>
                                                <span className="text-xs text-slate-400">{res.candidateId?.email}</span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-4">
                                             <div className="flex items-end gap-1">
                                                <span className="text-lg font-black font-outfit text-slate-900">{res.scoredMarks}</span>
                                                <span className="text-xs font-bold text-slate-400 mb-1">/ {res.totalMarks}</span>
                                             </div>
                                        </td>
                                        <td className="py-6 px-4">
                                             <div className="flex items-center gap-3">
                                                 <div className="flex-1 max-w-[80px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-slate-900 rounded-full" style={{ width: `${res.accuracy}%` }} />
                                                 </div>
                                                 <span className="text-xs font-black text-slate-900">{res.accuracy}%</span>
                                             </div>
                                        </td>
                                        <td className="py-6 px-4">
                                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">Submitted</span>
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
