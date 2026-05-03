import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, User, Users, ClipboardList, BarChart2,
  FileText, CreditCard, RefreshCw, LogOut, ChevronRight, Bell,
  Plus, Award, TrendingUp, BookOpen, GraduationCap
} from 'lucide-react';

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'profile', label: 'Profile Details', icon: User },
  { id: 'aspirants', label: 'Aspirants', icon: Users },
  { id: 'assessment', label: 'Assessment', icon: ClipboardList },
  { id: 'evaluation', label: 'Evaluation', icon: Award },
  { id: 'results', label: 'Results', icon: BarChart2 },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'subscription', label: 'Subscription', icon: CreditCard },
  { id: 'renewals', label: 'Renewals', icon: RefreshCw },
  { id: 'payments', label: 'Payment Details', icon: CreditCard },
];

const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4`}>{icon}</div>
    <p className="text-xs uppercase tracking-widest font-black text-slate-400">{label}</p>
    <p className="text-4xl font-black text-slate-900 mt-1">{value}</p>
  </div>
);

const AcademyDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen">
        <div className="px-6 pt-8 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0F172A] rounded-xl flex items-center justify-center">
              <GraduationCap size={20} className="text-white" />
            </div>
            <div>
              <p className="font-black text-sm text-slate-900">Academy Panel</p>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Operations Hub</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeSection === item.id
                  ? 'bg-[#0F172A] text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <item.icon size={16} />
              {item.label}
              {activeSection === item.id && <ChevronRight size={14} className="ml-auto" />}
            </button>
          ))}
        </nav>

        <div className="px-4 py-5 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center">
              <span className="text-sm font-black text-slate-700">{user?.name?.[0] || 'A'}</span>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-900 truncate">{user?.name || 'Academy'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={() => { logout(); navigate('/login'); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 bg-[#F8FAFC]/80 backdrop-blur-sm border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-black text-slate-900 capitalize">
            {navItems.find(n => n.id === activeSection)?.label || 'Overview'}
          </h1>
          <div className="flex items-center gap-3">
            {activeSection === 'assessment' && (
              <button
                onClick={() => navigate('/builder')}
                className="flex items-center gap-2 px-4 py-2 bg-[#0F172A] text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-800 transition-all"
              >
                <Plus size={14} /> New Assessment
              </button>
            )}
            <button className="w-9 h-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center hover:border-slate-300">
              <Bell size={16} className="text-slate-600"/>
            </button>
          </div>
        </header>

        <div className="p-8">
          {activeSection === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard label="Total Aspirants" value="340" icon={<Users size={22} className="text-indigo-600"/>} color="bg-indigo-50"/>
                <StatCard label="Tests Created" value="28" icon={<ClipboardList size={22} className="text-blue-600"/>} color="bg-blue-50"/>
                <StatCard label="Avg. Score" value="74%" icon={<TrendingUp size={22} className="text-emerald-600"/>} color="bg-emerald-50"/>
                <StatCard label="Pending Renewals" value="5" icon={<RefreshCw size={22} className="text-amber-600"/>} color="bg-amber-50"/>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <h3 className="font-black text-slate-900 mb-5 flex items-center gap-2"><Users size={16} className="text-indigo-500"/>Recent Aspirants</h3>
                  <div className="space-y-3">
                    {['Arjun Kumar', 'Priya Singh', 'Rahul Verma', 'Sneha Patel'].map((name, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 font-black text-xs">{name[0]}</div>
                          <span className="text-sm font-semibold text-slate-700">{name}</span>
                        </div>
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">Active</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <h3 className="font-black text-slate-900 mb-5 flex items-center gap-2"><BookOpen size={16} className="text-blue-500"/>Recent Tests</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'NEET Biology Mock #4', taken: 42, avg: '71%' },
                      { name: 'Physics Chapter Test', taken: 28, avg: '65%' },
                      { name: 'Chemistry Full Test', taken: 61, avg: '79%' },
                    ].map((test, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                        <div>
                          <p className="text-sm font-semibold text-slate-700">{test.name}</p>
                          <p className="text-xs text-slate-400">{test.taken} taken • Avg {test.avg}</p>
                        </div>
                        <button onClick={() => navigate('/builder')} className="text-xs font-bold text-indigo-600 hover:underline">View</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Subscription Info */}
              <div className="bg-gradient-to-br from-[#0F172A] to-slate-800 rounded-2xl p-8 text-white flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest font-black text-slate-400 mb-1">Current Plan</p>
                  <h2 className="text-2xl font-black">Pro Academy</h2>
                  <p className="text-slate-400 text-sm mt-1">Renews on June 1, 2026 • 28 days left</p>
                </div>
                <button className="px-6 py-3 bg-white text-slate-900 rounded-xl font-black text-sm hover:bg-slate-100 transition-colors">
                  Manage Plan
                </button>
              </div>
            </div>
          )}

          {activeSection === 'profile' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 max-w-2xl">
              <h2 className="text-lg font-black text-slate-900 mb-6">Academy Profile</h2>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: 'Academy Name', value: user?.academyName || '—' },
                  { label: 'Email', value: user?.email || '—' },
                  { label: 'Contact', value: user?.contactNumber || '—' },
                  { label: 'GST Number', value: user?.gst || '—' },
                  { label: 'Coaching Type', value: user?.coachingType || '—' },
                  { label: 'Target Exams', value: user?.exams || '—' },
                ].map((f, i) => (
                  <div key={i}>
                    <p className="text-[10px] uppercase tracking-widest font-black text-slate-400">{f.label}</p>
                    <p className="font-semibold text-slate-900 mt-1">{f.value}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate('/create-profile')}
                className="mt-8 px-6 py-3 bg-[#0F172A] text-white rounded-xl font-black text-sm hover:bg-slate-800 transition-colors"
              >
                Edit Profile
              </button>
            </div>
          )}

          {activeSection !== 'overview' && activeSection !== 'profile' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center max-w-lg mx-auto">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                {React.createElement(navItems.find(n => n.id === activeSection)?.icon || BarChart2, {size: 28, className: 'text-slate-400'})}
              </div>
              <h2 className="text-lg font-black text-slate-900 mb-2">
                {navItems.find(n => n.id === activeSection)?.label}
              </h2>
              <p className="text-slate-500 text-sm">This section will be populated with live data from your academy's records.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AcademyDashboard;
