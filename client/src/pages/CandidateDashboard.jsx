import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogOut, User, BookOpen, Clock, Award, ShieldAlert } from 'lucide-react'

const CandidateDashboard = () => {
    const { user, logout, switchRole } = useAuth()
    const navigate = useNavigate()

    const stats = [
        { label: 'Exams Taken', value: '0', icon: <BookOpen className="text-blue-600" /> },
        { label: 'Avg. Score', value: '0%', icon: <Award className="text-emerald-600" /> },
        { label: 'Time Spent', value: '0h', icon: <Clock className="text-amber-600" /> },
    ]

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar Simple */}
            <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col justify-between overflow-y-auto">
                <div className="space-y-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                            <User size={20} />
                        </div>
                        <span className="font-bold text-slate-900">My Profile</span>
                    </div>

                    <nav className="space-y-4">
                        <button className="w-full flex items-center gap-3 px-4 py-3 bg-slate-100 text-slate-900 rounded-xl font-bold transition-all">
                           <BookOpen size={18} /> My Exams
                        </button>
                    </nav>
                </div>

                <div className="mt-auto space-y-4 pt-10">
                    <div className="flex flex-col gap-2">
                        <span className="text-[9px] uppercase tracking-widest font-black text-slate-400 ml-1">Account Mode</span>
                        <div className="relative flex bg-slate-50 p-1 rounded-xl border border-slate-100">
                            <div 
                                className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#0F172A] rounded-lg transition-all duration-300 ease-out z-0 translate-x-0"
                            />
                            <button 
                                type="button" 
                                disabled
                                className="relative flex-1 py-2 text-[9px] font-black uppercase tracking-widest z-10 transition-colors text-white"
                            >
                                Candidate
                            </button>
                            <button 
                                type="button" 
                                onClick={async () => {
                                    const success = await switchRole('creator');
                                    if (success) navigate('/dashboard');
                                }}
                                className="relative flex-1 py-2 text-[9px] font-black uppercase tracking-widest z-10 transition-colors text-slate-400 hover:text-slate-900"
                            >
                                Examiner
                            </button>
                        </div>
                    </div>

                    <button 
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-600 font-bold transition-colors border border-transparent hover:border-red-50 hover:bg-red-50 rounded-xl"
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-12 overflow-y-auto">
                <header className="mb-12">
                    <h1 className="text-4xl font-black font-outfit text-slate-900 tracking-tight">Welcome, {user?.name}!</h1>
                    <p className="text-slate-500 mt-2 font-medium">Ready for your next challenge?</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
                            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center">
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                <p className="text-3xl font-black text-slate-900 mt-1">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm text-center">
                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <ShieldAlert size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 font-outfit">No Exams Assigned</h2>
                    <p className="text-slate-500 mt-3 max-w-sm mx-auto font-medium leading-relaxed">
                        You don't have any pending examinations. Please use the unique link shared by your examiner to start a test.
                    </p>
                </div>
            </main>
        </div>
    )
}

export default CandidateDashboard
