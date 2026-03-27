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
        gsap.from('.exam-card', {
            y: 40,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out'
        })
    }, { scope: container })

    return (
        <div className="bg-white min-h-screen pt-20" ref={container}>
            <Navbar />
            
            {/* Header Section */}
            <div className="bg-slate-50 py-20 px-6">
                <div className="max-w-6xl mx-auto flex flex-col items-center text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full text-xs font-bold uppercase tracking-widest">
                        <Users size={14} /> Global Network
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black font-outfit text-slate-900 leading-tight">
                        Explore Learning <br className="hidden md:block" />
                        Communities.
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl font-medium leading-relaxed">
                        Join thousands of experts and students. Discover exams, share resources, and build your assessment network.
                    </p>
                    
                    {/* Search Bar */}
                    <div className="w-full max-w-xl relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search communities, topics, or exams..."
                            className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-3xl focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-medium shadow-sm shadow-slate-200/50"
                        />
                    </div>
                </div>
            </div>

            {/* Active Exams Section */}
            <div className="py-12 px-6 max-w-6xl mx-auto border-b border-slate-100">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="text-2xl font-extrabold text-[#0F172A] font-outfit uppercase tracking-tight">Active Exams</h2>
                        <p className="text-slate-500 font-medium">Join an assessment currently in progress</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {activeExams.map((exam, index) => (
                        <div key={index} className="exam-card group bg-slate-50 border border-slate-100 p-6 rounded-[2rem] hover:bg-white hover:shadow-xl transition-all duration-300 cursor-pointer">
                            <div className="flex justify-between items-center mb-6 h-10">
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
                            
                            <h3 className="text-lg font-bold font-outfit text-slate-900 mb-2 leading-snug group-hover:text-slate-600 transition-colors">{exam.title}</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">{exam.community}</p>
                            
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Duration</p>
                                    <p className="text-sm font-bold text-slate-900">{exam.time}</p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Ongoing</p>
                                    <p className="text-sm font-bold text-slate-900">{exam.participants} users</p>
                                </div>
                            </div>
                            
                            <Link to={`/exam/${exam.link}`} className="block w-full">
                                <button className="w-full py-3 bg-white border border-slate-200 text-slate-900 rounded-xl text-sm font-bold group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all">
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
