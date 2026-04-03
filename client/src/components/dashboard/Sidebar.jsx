import React from 'react'
import { LayoutDashboard, FileText, BarChart3, Settings, LogOut, Box } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const Sidebar = () => {
    const { logout, switchRole } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menu = [
        { name: 'Overview', icon: LayoutDashboard, path: '/dashboard', tab: 'overview' },
        { name: 'My Tests', icon: FileText, path: '/dashboard?tab=tests', tab: 'tests' },
        { name: 'Analytics', icon: BarChart3, path: '/dashboard?tab=analytics', tab: 'analytics' },
        { name: 'Settings', icon: Settings, path: '/dashboard?tab=settings', tab: 'settings' },
    ]

    const currentTab = new URLSearchParams(location.search).get('tab') || 'overview'

    return (
        <aside className="w-80 h-screen bg-white border-r border-slate-200 flex flex-col p-8 sticky top-0 overflow-y-auto">
            <div className="flex items-center gap-3 mb-12 px-4">
                <div className="w-10 h-10 bg-slate-950 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-100">
                    <Box size={20} />
                </div>
                <span className="font-black font-outfit text-2xl tracking-tight">Mocker</span>
            </div>

            <nav className="flex-1 space-y-3">
                {menu.map(item => (
                    <Link
                        key={item.name}
                        to={item.path}
                        className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all transition-duration-500 ${
                            currentTab === item.tab 
                            ? 'bg-slate-950 text-white shadow-2xl shadow-slate-200 translate-x-2' 
                            : 'text-slate-400 hover:bg-slate-50 hover:text-slate-950'
                        }`}
                    >
                        <item.icon size={22} className={currentTab === item.tab ? 'text-white' : 'text-slate-400 group-hover:text-slate-950'} />
                        {item.name}
                    </Link>
                ))}
            </nav>

            <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col gap-4">
                <span className="text-[10px] uppercase tracking-widest font-black text-slate-400 px-4">Account Mode</span>
                <div className="relative flex bg-slate-50 p-1 rounded-xl border border-slate-100 mx-2">
                    <div 
                        className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#0F172A] rounded-lg transition-all duration-300 ease-out z-0 translate-x-full"
                    />
                    <button 
                        type="button" 
                        onClick={async () => {
                            const success = await switchRole('candidate');
                            if (success) navigate('/candidate-dashboard');
                        }}
                        className="relative flex-1 py-2 text-[9px] font-black uppercase tracking-widest z-10 transition-colors text-slate-400"
                    >
                        Candidate
                    </button>
                    <button 
                        type="button" 
                        disabled
                        className="relative flex-1 py-2 text-[9px] font-black uppercase tracking-widest z-10 transition-colors text-white"
                    >
                        Examiner
                    </button>
                </div>
            </div>

            <button 
                onClick={handleLogout}
                className="flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-red-500 hover:bg-red-50 transition-all"
            >
                <LogOut size={22} />
                Logout Sessions
            </button>
        </aside>
    )
}

export default Sidebar
