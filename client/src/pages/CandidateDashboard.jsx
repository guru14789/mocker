const CandidateDashboard = () => {
    const { user, logout, switchRole } = useAuth()
    const navigate = useNavigate()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const stats = [
        { label: 'Exams', value: '0', icon: <BookOpen className="text-blue-600" size={20} /> },
        { label: 'Avg. Score', value: '0%', icon: <Award className="text-emerald-600" size={20} /> },
        { label: 'Time', value: '0h', icon: <Clock className="text-amber-600" size={20} /> },
    ]

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row font-sans overflow-x-hidden">
            {/* Mobile Header */}
            <div className="lg:hidden h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between sticky top-0 z-40">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-slate-950 rounded-lg flex items-center justify-center text-white">
                        <User size={16} />
                    </div>
                    <span className="font-black text-sm tracking-tight font-outfit uppercase">Candidate Portal</span>
                </div>
                <button 
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 text-slate-500"
                >
                    <BookOpen size={20} />
                </button>
            </div>

            {/* Sidebar Simple */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 p-6 flex flex-col justify-between 
                transition-transform duration-300 lg:relative lg:translate-x-0
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center text-white">
                                <User size={20} />
                            </div>
                            <span className="font-black text-slate-950 font-outfit uppercase tracking-tight">Profile Hub</span>
                        </div>
                        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 p-1">
                            <Clock size={20} className="rotate-45" />
                        </button>
                    </div>

                    <nav className="space-y-2">
                        <button className="w-full flex items-center gap-3 px-4 py-2.5 bg-slate-100 text-slate-950 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all">
                           <BookOpen size={16} /> My Exams
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
                                className="relative flex-1 py-2 text-[9px] font-black uppercase tracking-widest z-10 transition-colors text-slate-400 hover:text-slate-950"
                            >
                                Examiner
                            </button>
                        </div>
                    </div>

                    <button 
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-500 hover:text-red-600 text-[11px] font-black uppercase tracking-widest transition-colors border border-transparent hover:border-red-50 hover:bg-red-50 rounded-xl"
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </aside>

            {/* Backdrop for mobile */}
            {sidebarOpen && (
                <div 
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-slate-950/20 backdrop-blur-sm z-40 lg:hidden"
                />
            )}

            {/* Main Content */}
            <main className="flex-1 p-4 lg:p-12 overflow-y-auto">
                <header className="mb-8 lg:mb-12">
                    <h1 className="text-3xl lg:text-5xl font-black font-outfit text-slate-950 tracking-tight italic">Welcome, {user?.name}!</h1>
                    <p className="text-slate-500 mt-2 font-medium text-sm lg:text-lg italic border-l-2 border-slate-200 pl-4">Ready for your next challenge?</p>
                </header>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8 mb-8 lg:mb-12">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white p-4 lg:p-8 rounded-2xl lg:rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-3 lg:gap-6 hover:translate-y-[-2px] transition-all">
                            <div className="w-10 h-10 lg:w-14 lg:h-14 bg-slate-50 rounded-xl lg:rounded-2xl flex items-center justify-center">
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-[10px] lg:text-sm font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                                <p className="text-xl lg:text-3xl font-black text-slate-950">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-[2rem] lg:rounded-[2.5rem] p-8 lg:p-14 border border-slate-100 shadow-sm text-center">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 bg-blue-50 text-blue-600 rounded-[1.5rem] lg:rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <ShieldAlert size={32} lg:size={40} />
                    </div>
                    <h2 className="text-xl lg:text-2xl font-black text-slate-950 font-outfit uppercase tracking-tight italic">No Exams Assigned</h2>
                    <p className="text-slate-500 mt-4 max-w-sm mx-auto font-medium leading-relaxed text-xs lg:text-sm italic">
                        You don't have any pending examinations. Please use the unique link shared by your examiner to start a test.
                    </p>
                </div>
            </main>
        </div>
    )
}

export default CandidateDashboard
