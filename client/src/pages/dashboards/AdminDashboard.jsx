import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, GraduationCap, Users, BadgeCheck, RefreshCw,
  BookOpen, BarChart3, Settings, LogOut, ChevronRight, TrendingUp,
  Shield, Bell
} from 'lucide-react';

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  {
    id: 'academies', label: 'Academies', icon: GraduationCap,
    children: [
      { id: 'academies-registered', label: 'Registered' },
      { id: 'academies-verified', label: 'Verified' },
      { id: 'academies-subscribed', label: 'Subscribed' },
      { id: 'academies-renewals', label: 'Renewals' },
      { id: 'academies-aspirants', label: 'Aspirants' },
      { id: 'academies-qbank', label: 'Question Bank' },
      { id: 'academies-analytics', label: 'EDA / Analytics' },
    ]
  },
  {
    id: 'aspirants', label: 'Aspirants', icon: Users,
    children: [
      { id: 'aspirants-registered', label: 'Registered' },
      { id: 'aspirants-verified', label: 'Verified' },
      { id: 'aspirants-subscribed', label: 'Subscribed' },
      { id: 'aspirants-renewals', label: 'Renewals' },
      { id: 'aspirants-tests', label: 'Tests Taken' },
      { id: 'aspirants-analytics', label: 'Analytics' },
    ]
  },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const StatCard = ({ label, value, delta, color }) => (
  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <p className="text-xs uppercase tracking-widest font-black text-slate-400 mb-1">{label}</p>
    <p className={`text-4xl font-black ${color || 'text-slate-900'} mt-2`}>{value}</p>
    {delta && <p className="text-xs font-bold text-emerald-500 mt-2 flex items-center gap-1"><TrendingUp size={12}/>{delta}</p>}
  </div>
);

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [expanded, setExpanded] = useState({ academies: true, aspirants: false });

  const handleNav = (id, hasChildren) => {
    if (hasChildren) {
      setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    } else {
      setActiveSection(id);
    }
  };

  const getTitle = () => {
    const flat = navItems.flatMap(n => n.children ? n.children : [n]);
    return flat.find(n => n.id === activeSection)?.label || 'Overview';
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0F172A] text-white flex flex-col sticky top-0 h-screen">
        <div className="px-6 pt-8 pb-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <p className="font-black text-sm">Mocker Admin</p>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Control Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <div key={item.id}>
              <button
                onClick={() => handleNav(item.id, !!item.children)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeSection === item.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <span className="flex items-center gap-3">
                  <item.icon size={16} />
                  {item.label}
                </span>
                {item.children && (
                  <ChevronRight size={14} className={`transition-transform ${expanded[item.id] ? 'rotate-90' : ''}`} />
                )}
              </button>
              {item.children && expanded[item.id] && (
                <div className="mt-1 ml-6 space-y-0.5">
                  {item.children.map(child => (
                    <button
                      key={child.id}
                      onClick={() => setActiveSection(child.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        activeSection === child.id
                          ? 'text-indigo-400 bg-slate-700/50'
                          : 'text-slate-500 hover:text-slate-200'
                      }`}
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="px-4 py-5 border-t border-slate-700/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-slate-700 rounded-xl flex items-center justify-center">
              <span className="text-sm font-black text-white">{user?.name?.[0] || 'A'}</span>
            </div>
            <div>
              <p className="text-sm font-bold text-white truncate">{user?.name || 'Admin'}</p>
              <p className="text-[10px] text-slate-400">{user?.email || ''}</p>
            </div>
          </div>
          <button onClick={() => { logout(); navigate('/login'); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all">
            <LogOut size={14}/> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <header className="sticky top-0 z-10 bg-[#F8FAFC]/80 backdrop-blur-sm border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-black text-slate-900 capitalize">{getTitle()}</h1>
          <div className="flex items-center gap-4">
            <button className="relative w-9 h-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center hover:border-slate-300 transition-colors">
              <Bell size={16} className="text-slate-600"/>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">3</span>
            </button>
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-sm font-black text-white">{user?.name?.[0] || 'A'}</span>
            </div>
          </div>
        </header>

        <div className="p-8">
          {activeSection === 'overview' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard label="Total Academies" value="128" delta="+12 this month" color="text-indigo-600"/>
                <StatCard label="Total Aspirants" value="4,821" delta="+340 this month" color="text-emerald-600"/>
                <StatCard label="Active Subscriptions" value="896" delta="+56 this week"/>
                <StatCard label="Tests Conducted" value="12,450" delta="+1,200 today"/>
              </div>

              {/* Tables */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <h3 className="font-black text-slate-900 mb-5 flex items-center gap-2"><GraduationCap size={18} className="text-indigo-500"/>Recent Academies</h3>
                  <div className="space-y-3">
                    {['Alpha Academy', 'Nexus Coaching', 'EduPrime Institute'].map((name, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 font-black text-xs">{name[0]}</div>
                          <span className="text-sm font-semibold text-slate-700">{name}</span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Verified</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <h3 className="font-black text-slate-900 mb-5 flex items-center gap-2"><BarChart3 size={18} className="text-emerald-500"/>Platform Analytics</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Verification Rate', value: 82, color: 'bg-indigo-500' },
                      { label: 'Subscription Rate', value: 67, color: 'bg-emerald-500' },
                      { label: 'Test Completion', value: 91, color: 'bg-amber-500' },
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-slate-600">{item.label}</span>
                          <span className="text-slate-900">{item.value}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div className={`${item.color} h-2 rounded-full`} style={{width: `${item.value}%`}}/>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection !== 'overview' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <BarChart3 size={28} className="text-indigo-500"/>
              </div>
              <h2 className="text-xl font-black text-slate-900 mb-2 capitalize">{getTitle()}</h2>
              <p className="text-slate-500 text-sm max-w-sm mx-auto">This section is ready to be connected to live data from the database. Use the sidebar to navigate.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
