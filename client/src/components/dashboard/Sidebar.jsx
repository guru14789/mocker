import React from 'react'
import { LayoutDashboard, FileText, BarChart3, Settings, LogOut, Box, Menu, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const Sidebar = () => {
    const { logout, switchRole } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = React.useState(false)

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
        <>
            {/* Mobile Toggle */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-6 right-6 z-[100] w-12 h-12 bg-slate-950 text-white rounded-2xl flex items-center justify-center shadow-2xl active:scale-90 transition-all"
            >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Sidebar Content */}
            <aside className={`fixed lg:sticky top-0 left-0 z-50 w-72 h-screen bg-white border-r border-slate-200 flex flex-col p-6 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="flex items-center gap-3 mb-8 px-4">
                    <div className="w-9 h-9 bg-slate-950 rounded-xl flex items-center justify-center text-white shadow-xl shadow-slate-100">
                        <Box size={18} />
                    </div>
                    <span className="font-black font-outfit text-xl tracking-tight">Mocker</span>
                </div>

                <nav className="flex-1 space-y-2">
                    {menu.map(item => (
                        <Link
                            key={item.name}
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm transition-all ${
                                currentTab === item.tab 
                                ? 'bg-slate-950 text-white shadow-lg shadow-slate-200' 
                                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-950'
                            }`}
                        >
                            <item.icon size={18} />
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-3">
                    <span className="text-[9px] uppercase tracking-widest font-black text-slate-400 px-4">Account Mode</span>
                    <div className="relative flex bg-slate-50 p-1 rounded-xl border border-slate-100 mx-2">
                         <button 
                            type="button" 
                            onClick={async () => {
                                const success = await switchRole('candidate');
                                if (success) navigate('/candidate-dashboard');
                            }}
                            className="relative flex-1 py-1.5 text-[9px] font-black uppercase tracking-widest z-10 transition-colors text-slate-400"
                        >
                            Candidate
                        </button>
                        <button 
                            type="button" 
                            disabled
                            className="relative flex-1 py-1.5 text-[9px] font-black uppercase tracking-widest z-10 transition-colors bg-slate-950 text-white rounded-lg"
                        >
                            Examiner
                        </button>
                    </div>
                </div>

                <button 
                    onClick={handleLogout}
                    className="mt-4 flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm text-red-500 hover:bg-red-50 transition-all"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </aside>

            {/* Overlay for mobile */}
            {isOpen && (
                <div 
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 bg-slate-950/20 backdrop-blur-sm z-40 lg:hidden"
                />
            )}
        </>
    )
}

export default Sidebar
