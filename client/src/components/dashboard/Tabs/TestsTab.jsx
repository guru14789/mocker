import React from 'react'
import { Link } from 'react-router-dom'
import { Link as LinkIcon, Edit, BarChart3, Copy, Printer } from 'lucide-react'

const TestsTab = ({ tests }) => {
    const copyLink = (link) => {
        navigator.clipboard.writeText(`${window.location.origin}/exam/${link}`)
        alert('Exam link copied!')
    }

    return (
        <div className="bg-white rounded-[3rem] border border-slate-100 p-12 shadow-sm">
            <h3 className="text-3xl font-black font-outfit text-slate-900 mb-10">My Examination Library</h3>
            <div className="grid md:grid-cols-2 gap-10">
                {tests.map(test => (
                    <div key={test._id} className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-slate-300 transition-all hover:shadow-xl hover:shadow-slate-100 relative group">
                        <div className="flex justify-between items-start mb-6">
                             <div className="flex gap-2">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                    test.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                    {test.status}
                                </span>
                                <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-700 border border-blue-100">
                                    {test.examType || 'computer'}
                                </span>
                             </div>
                            <div className="flex gap-2">
                                {(test.examType === 'omr-scanning' || test.examType === 'hybrid') && (
                                     <Link to={`/print-omr/${test._id}`} className="p-2 bg-white rounded-lg text-slate-400 hover:text-slate-900 border border-slate-200 transition-colors tooltip" title="Print OMR Sheet">
                                        <Printer size={16} />
                                    </Link>
                                )}
                                <Link to={`/builder/${test._id}`} className="p-2 bg-white rounded-lg text-slate-400 hover:text-slate-900 border border-slate-200 transition-colors">
                                    <Edit size={16} />
                                </Link>
                                <Link to={`/analytics/${test._id}`} className="p-2 bg-white rounded-lg text-slate-400 hover:text-slate-900 border border-slate-200 transition-colors">
                                    <BarChart3 size={16} />
                                </Link>
                            </div>
                        </div>
                        <h4 className="text-xl font-black font-outfit text-slate-950 mb-3">{test.title}</h4>
                        <p className="text-slate-500 font-medium text-sm mb-8 line-clamp-2">{test.description || 'No description provided.'}</p>
                        
                        <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-200/60">
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase font-black text-slate-400 tracking-tighter mb-1">Participants</span>
                                <span className="text-sm font-bold text-slate-900">{test.currentParticipants || 0} / {test.maxParticipants}</span>
                            </div>
                            {test.status === 'published' && (
                                <button 
                                    onClick={() => copyLink(test.uniqueLink)}
                                    className="flex items-center gap-2 text-xs font-black text-slate-950 uppercase tracking-widest hover:bg-slate-950 hover:text-white px-4 py-2 rounded-xl transition-all"
                                >
                                    <LinkIcon size={14} /> Copy Link
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TestsTab
