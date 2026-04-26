import React from 'react'
import Navbar from '../components/landing/Navbar'
import Footer from '../components/landing/Footer'
import { Link } from 'react-router-dom'
import { Users, BookOpen, Search, ArrowRight, ShieldCheck, Printer, Camera } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import axios from 'axios'

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
            link: "react-patterns-2024",
            examType: "computer-based"
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
            link: "med-board-review",
            examType: "hybrid"
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
            link: "cfa-level-1-mock",
            examType: "omr-scanning"
        }
    ];

    const [exams, setExams] = React.useState(activeExams);
    const [enrolled, setEnrolled] = React.useState(["exam-2"]); // Start with one enrolled for demo
    const [modalExam, setModalExam] = React.useState(null); // Track which exam is being enrolled
    const [candidateData, setCandidateData] = React.useState({ name: '', rollNo: '' });

    React.useEffect(() => {
        const fetchExams = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/tests/public/published')
                if (res.data && res.data.length > 0) {
                    // Map API data to the format expected by the UI if necessary
                    const formattedExams = res.data.map(test => ({
                        id: test._id,
                        title: test.title,
                        community: "Open Community",
                        time: `${test.duration}m`,
                        questions: test.questionsCount || 0,
                        participants: test.currentParticipants || 0,
                        difficulty: "Medium",
                        color: "indigo",
                        link: test.uniqueLink,
                        examType: test.examType
                    }));
                    setExams(formattedExams);
                }
            } catch (err) {
                console.error('Failed to fetch exams', err)
            }
        }
        fetchExams()
    }, [])

    const handleEnrollClick = (exam) => {
        setModalExam(exam);
    };

    const confirmEnrollment = (e) => {
        e.preventDefault();
        if (candidateData.name && candidateData.rollNo) {
            setEnrolled([...enrolled, modalExam.id]);
            setModalExam(null);
            setCandidateData({ name: '', rollNo: '' });
        }
    };

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
        <div className="bg-white min-h-screen pt-20 relative" ref={container}>
            <Navbar />

            {/* Enrollment Modal Overlay */}
            {modalExam && (
                <div className="fixed inset-0 z-[10001] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-xl">
                    <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10 border border-white/50 animate-in fade-in zoom-in duration-300">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                                <ShieldCheck size={20} />
                            </div>
                            <span className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">Registration Entry</span>
                        </div>

                        <h3 className="text-2xl font-black text-slate-900 font-outfit mb-2">Final Enrollment</h3>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-10">Confirming: {modalExam.title}</p>

                        <form onSubmit={confirmEnrollment} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-black text-slate-300 ml-1">Candidate Full Name</label>
                                <input 
                                    type="text" 
                                    required 
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-slate-950/5 focus:border-slate-950 transition-all font-bold text-sm text-slate-900"
                                    placeholder="Enter your registered name"
                                    value={candidateData.name}
                                    onChange={e => setCandidateData({...candidateData, name: e.target.value})}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-black text-slate-300 ml-1">Candidate ID / Roll No</label>
                                <input 
                                    type="text" 
                                    required 
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-slate-950/5 focus:border-slate-950 transition-all font-bold text-sm text-slate-900"
                                    placeholder="Enter institutional ID"
                                    value={candidateData.rollNo}
                                    onChange={e => setCandidateData({...candidateData, rollNo: e.target.value})}
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => setModalExam(null)}
                                    className="flex-1 py-4 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-900 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-black transition-all"
                                >
                                    Confirm Enrollment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            {/* Header Section */}
            <div id="explore" className="bg-[#F8FAFC] py-16 lg:py-24 px-4">
                <div className="max-w-6xl mx-auto flex flex-col items-center text-center space-y-6 lg:space-y-8 header-content">
                    <div className="inline-flex items-center gap-2 px-5 py-2 bg-slate-950 shadow-xl shadow-slate-200 text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                        <Users size={14} /> Global Network
                    </div>
                    <h1 className="text-3xl lg:text-6xl font-black font-outfit text-slate-900 leading-tight tracking-tight">
                        Explore Specialized <br className="hidden md:block" />
                        Communities.
                    </h1>
                    <p className="text-base lg:text-xl text-slate-500 max-w-2xl font-medium leading-relaxed italic px-4">
                        "Join thousands of experts and candidates practicing for success."
                    </p>
                    
                    {/* Search Bar */}
                    <div className="w-full max-w-xl relative group mt-4 px-2">
                        <Search className="absolute left-6 lg:left-8 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-950 transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search assessments..."
                            className="w-full pl-14 lg:pl-16 pr-8 py-4 lg:py-5 bg-white border border-slate-200 rounded-2xl lg:rounded-3xl focus:outline-none focus:ring-8 focus:ring-slate-950/5 focus:border-slate-950 transition-all font-bold text-sm lg:text-lg shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Active Exams Section */}
            <div className="py-12 lg:py-20 px-4 max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8 lg:mb-12 px-2">
                    <div className="space-y-1">
                        <h2 className="text-xl lg:text-2xl font-black text-slate-950 font-outfit uppercase tracking-tight">Available Assessments</h2>
                        <div className="h-1 w-12 bg-slate-950 rounded-full"></div>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
                    {exams.map((exam, index) => {
                        const isEnrolled = enrolled.includes(exam.id);
                        return (
                            <div key={index} className="exam-card group bg-white border border-slate-100 p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 cursor-pointer flex flex-col h-full relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-slate-50 group-hover:bg-slate-950 transition-colors" />
                                
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex gap-2">
                                        <div className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-wider ${exam.difficulty === 'Hard' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                            {exam.difficulty}
                                        </div>
                                        {exam.examType && (
                                            <div className="px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-wider bg-slate-100 text-slate-600">
                                                {exam.examType.split('-')[0]}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1 text-[8px] font-black text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg uppercase tracking-widest">
                                        <div className="w-1 h-1 rounded-full bg-red-500 animate-pulse"></div>
                                        LIVE
                                    </div>
                                </div>
                                
                                <div className="flex-1">
                                    <h3 className="text-lg lg:text-xl font-bold font-outfit text-slate-950 mb-1 leading-snug min-h-[2.5rem] line-clamp-2">
                                        {exam.title}
                                    </h3>
                                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-6">
                                        {exam.community}
                                    </p>
                                    
                                    <div className="grid grid-cols-2 gap-4 mb-6 py-4 border-y border-slate-50">
                                        <div className="space-y-0.5">
                                            <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest leading-none">Duration</p>
                                            <p className="text-xs lg:text-sm font-black text-slate-950">{exam.time}</p>
                                        </div>
                                        <div className="space-y-0.5 text-right">
                                            <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest leading-none">Ongoing</p>
                                            <p className="text-xs lg:text-sm font-black text-slate-950">{exam.participants}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                {isEnrolled ? (
                                     <div className="flex flex-col gap-2 mt-auto">
                                         <Link to={`/exam-ready/${exam.link}`} className="block w-full">
                                             <button className="w-full py-3.5 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-slate-200">
                                                 Join Exam
                                             </button>
                                         </Link>
                                         {(exam.examType === 'omr-scanning' || exam.examType === 'hybrid') && (
                                             <div className="grid grid-cols-2 gap-2">
                                                 <Link to={`/print-omr/${exam.id}`} target="_blank" className="flex-1">
                                                     <button className="w-full py-2.5 bg-white border border-slate-200 text-slate-500 rounded-lg text-[8px] font-black uppercase tracking-widest hover:text-slate-950 transition-all flex items-center justify-center gap-1.5">
                                                         <Printer size={12} /> Print
                                                     </button>
                                                 </Link>
                                                 <Link to={`/scan-omr/${exam.id}`} className="flex-1">
                                                     <button className="w-full py-2.5 bg-slate-50 border border-slate-100 text-slate-900 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-slate-950 hover:text-white transition-all flex items-center justify-center gap-1.5">
                                                         <Camera size={12} /> Scan
                                                     </button>
                                                 </Link>
                                             </div>
                                         )}
                                     </div>
                                 ) : (
                                     <div className="flex flex-col gap-2 mt-auto">
                                         <button 
                                             onClick={() => handleEnrollClick(exam)}
                                             className="w-full py-3.5 bg-slate-50 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-950 hover:text-white transition-all"
                                         >
                                             Enroll Now
                                         </button>
                                         {(exam.examType === 'omr-scanning' || exam.examType === 'hybrid') && (
                                            <Link to={`/print-omr/${exam.id}`} target="_blank" className="block w-full">
                                                <button className="w-full py-2.5 text-slate-300 rounded-lg text-[8px] font-black uppercase tracking-widest hover:text-slate-950 transition-all flex items-center justify-center gap-1.5 italic">
                                                    <Printer size={12} /> Sample OMR Sheet
                                                </button>
                                            </Link>
                                         )}
                                     </div>
                                 )}
                            </div>
                        );
                    })}
                </div>
            </div>


            <Footer />
        </div>
    )
}

export default Communities
