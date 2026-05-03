import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, User, BookOpen, BarChart2,
  FileText, CreditCard, RefreshCw, LogOut, ChevronRight,
  Bell, Award, Clock, Target, CheckCircle2
} from 'lucide-react';

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'profile', label: 'Profile Details', icon: User },
  { id: 'tests', label: 'Tests Taken', icon: BookOpen },
  { id: 'results', label: 'Results', icon: Award },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'subscription', label: 'Subscription', icon: CreditCard },
  { id: 'renewal', label: 'Renewal', icon: RefreshCw },
  { id: 'payments', label: 'Payment Details', icon: CreditCard },
];

const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4`}>{icon}</div>
    <p className="text-xs uppercase tracking-widest font-black text-slate-400">{label}</p>
    <p className="text-4xl font-black text-slate-900 mt-1">{value}</p>
  </div>
);

const AspirantDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');

  const recentTests = [
    { name: 'NEET Biology Mock #3', date: 'Apr 28', score: '78%', status: 'Passed' },
    { name: 'Chemistry Chapter Test', date: 'Apr 22', score: '65%', status: 'Passed' },
    { name: 'Physics Full Mock', date: 'Apr 18', score: '51%', status: 'Average' },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen">
        <div className="px-6 pt-8 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-lg">{user?.name?.[0] || 'A'}</span>
            </div>
            <div>
              <p className="font-black text-sm text-slate-900 truncate max-w-[120px]">{user?.name || 'Aspirant'}</p>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Student</p>
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
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
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
          <button onClick={() => { logout(); navigate('/login'); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 bg-[#F8FAFC]/80 backdrop-blur-sm border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <div>
            {activeSection === 'overview'
              ? <h1 className="text-2xl font-black text-slate-900">Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 👋</h1>
              : <h1 className="text-2xl font-black text-slate-900 capitalize">{navItems.find(n => n.id === activeSection)?.label}</h1>
            }
          </div>
          <button className="w-9 h-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center hover:border-slate-300">
            <Bell size={16} className="text-slate-600"/>
          </button>
        </header>

        <div className="p-8">
          {activeSection === 'overview' && (
            <div className="space-y-8">
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard label="Tests Taken" value="12" icon={<BookOpen size={22} className="text-indigo-600"/>} color="bg-indigo-50"/>
                <StatCard label="Best Score" value="84%" icon={<Award size={22} className="text-emerald-600"/>} color="bg-emerald-50"/>
                <StatCard label="Avg Score" value="69%" icon={<Target size={22} className="text-blue-600"/>} color="bg-blue-50"/>
                <StatCard label="Study Hours" value="48h" icon={<Clock size={22} className="text-amber-600"/>} color="bg-amber-50"/>
              </div>

              {/* Recent Tests */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="font-black text-slate-900 mb-5 flex items-center gap-2">
                  <BookOpen size={16} className="text-indigo-500"/>Recent Tests
                </h3>
                <div className="space-y-3">
                  {recentTests.map((test, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl border border-slate-200 flex items-center justify-center">
                          <CheckCircle2 size={18} className="text-emerald-500"/>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{test.name}</p>
                          <p className="text-xs text-slate-400">{test.date} • {test.status}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-slate-900">{test.score}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subscription Banner */}
              <div className="bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl p-8 text-white flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest font-black text-indigo-200 mb-1">Current Plan</p>
                  <h2 className="text-2xl font-black">Basic Aspirant</h2>
                  <p className="text-indigo-200 text-sm mt-1">Renews June 1, 2026 • 28 days left</p>
                </div>
                <button className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-black text-sm hover:bg-indigo-50 transition-colors">
                  Upgrade Plan
                </button>
              </div>
            </div>
          )}

          {activeSection === 'profile' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 max-w-2xl">
              <h2 className="text-lg font-black text-slate-900 mb-6">Your Profile</h2>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: 'Full Name', value: user?.name || '—' },
                  { label: 'Email', value: user?.email || '—' },
                  { label: 'Username', value: user?.username || '—' },
                  { label: 'Gender', value: user?.gender || '—' },
                  { label: 'Age', value: user?.age || '—' },
                  { label: 'Category', value: user?.category || '—' },
                ].map((f, i) => (
                  <div key={i}>
                    <p className="text-[10px] uppercase tracking-widest font-black text-slate-400">{f.label}</p>
                    <p className="font-semibold text-slate-900 mt-1">{f.value}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate('/create-profile')}
                className="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-sm hover:bg-indigo-700 transition-colors"
              >
                Edit Profile
              </button>
            </div>
          )}

          {activeSection === 'tests' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h3 className="font-black text-slate-900 mb-5">All Tests Taken</h3>
              <div className="space-y-3">
                {recentTests.map((test, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{test.name}</p>
                      <p className="text-xs text-slate-400">{test.date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-black text-slate-900">{test.score}</span>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">{test.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!['overview', 'profile', 'tests'].includes(activeSection) && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center max-w-lg mx-auto">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                {React.createElement(navItems.find(n => n.id === activeSection)?.icon || BarChart2, {size: 28, className: 'text-indigo-400'})}
              </div>
              <h2 className="text-lg font-black text-slate-900 mb-2">
                {navItems.find(n => n.id === activeSection)?.label}
              </h2>
              <p className="text-slate-500 text-sm">This section will be populated with your personal data and records.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AspirantDashboard;
