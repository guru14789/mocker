import React from 'react'
import Navbar from '../components/landing/Navbar'
import Footer from '../components/landing/Footer'
import { Link } from 'react-router-dom'
import { Users, BookOpen, Search, ArrowRight } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const Communities = () => {
    const container = React.useRef()


    const activeExams = [
        {
            id: "exam-1",
            title: "Advanced React Patterns",
            community: "Computer Science Elite",
            time: "2h 30m",
            questions: 45,
            participants: "1.2k",
            difficulty: "Hard",
            color: "blue",
            link: "react-patterns-2024"
        },
        {
            id: "exam-2",
            title: "Internal Medicine Board Review",
            community: "Global Medical Board",
            time: "3h 00m",
            questions: 100,
            participants: "850",
            difficulty: "Medium",
            color: "emerald",
            link: "med-board-review"
        },
        {
            id: "exam-3",
            title: "CFA Level I Mock Exam",
            community: "Financial Analysts Hub",
            time: "2h 00m",
            questions: 60,
            participants: "2.4k",
            difficulty: "Hard",
            color: "slate",
            link: "cfa-level-1-mock"
        }
    ];

    useGSAP(() => {
        // Only animate the header elements for a clean entry
        gsap.from('.header-content', {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        })
    }, { scope: container })

    return (
        <div className="bg-white min-h-screen pt-20" ref={container}>
            <Navbar />
            
            {/* Header Section */}
            <div className="bg-slate-50 py-28 px-6">
                <div className="max-w-6xl mx-auto flex flex-col items-center text-center space-y-8 header-content">
                    <div className="inline-flex items-center gap-3 px-6 py-2 bg-slate-900 shadow-xl shadow-slate-200 text-white rounded-full text-xs font-black uppercase tracking-[0.25em]">
                        <Users size={16} /> Global Network
                    </div>
                    <h1 className="text-4xl md:text-7xl font-black font-outfit text-slate-900 leading-[1.1] tracking-tight">
                        Explore Specialized <br className="hidden md:block" />
                        Communities.
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl font-medium leading-relaxed italic">
                        "Join thousands of experts and candidates practicing for success."
                    </p>
                    
                    {/* Search Bar */}
                    <div className="w-full max-w-2xl relative group mt-8">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={24} />
                        <input 
                            type="text" 
                            placeholder="Search clinical, technical, or financial exams..."
                            className="w-full pl-16 pr-8 py-6 bg-white border-2 border-slate-100 rounded-[2rem] focus:outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-bold text-lg shadow-sm shadow-slate-200/50"
                        />
                    </div>
                </div>
            </div>

            {/* Active Exams Section */}
            <div className="py-24 px-6 max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-16">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-black text-slate-900 font-outfit uppercase tracking-tight">Enrolled Assessments</h2>
                        <div className="h-1 w-20 bg-indigo-500 rounded-full"></div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-10 items-stretch">
                    {activeExams.map((exam, index) => (
                        <div key={index} className="exam-card group bg-slate-50 border border-slate-100 p-8 rounded-[3rem] hover:bg-white hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full">
                            <div className="flex justify-between items-center mb-8 h-10">
                                {exam.difficulty === 'Hard' ? (
                                    <div className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-red-50 text-red-600 border border-red-100">
                                        HARD
                                    </div>
                                ) : (
                                    <div className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
                                        MEDIUM
                                    </div>
                                )}
                                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 bg-white px-3 py-1.5 rounded-xl shadow-sm border border-slate-50 uppercase tracking-widest">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                                    LIVE
                                </div>
                            </div>
                            
                            <div className="flex-1">
                                <h3 className="text-xl font-bold font-outfit text-slate-900 mb-2 leading-tight min-h-[3rem] line-clamp-2 group-hover:text-slate-600 transition-colors">
                                    {exam.title}
                                </h3>
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-8 leading-none">
                                    {exam.community}
                                </p>
                                
                                <div className="grid grid-cols-2 gap-4 mb-8 pt-8 border-t border-slate-100/50">
                                    <div className="space-y-1">
                                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Duration</p>
                                        <p className="text-sm font-black text-slate-900">{exam.time}</p>
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Ongoing</p>
                                        <p className="text-sm font-black text-slate-900">{exam.participants} users</p>
                                    </div>
                                </div>
                            </div>
                            
                            <Link to={`/exam/${exam.link}`} className="block w-full mt-auto">
                                <button className="w-full py-4 bg-white border-2 border-slate-100 text-slate-900 rounded-[1.25rem] text-xs font-black uppercase tracking-widest group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all shadow-sm">
                                    Join Exam
                                </button>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>


            <Footer />
        </div>
    )
}

export default Communities
