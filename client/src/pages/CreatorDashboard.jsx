import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import Sidebar from '../components/dashboard/Sidebar'
import OverviewTab from '../components/dashboard/Tabs/OverviewTab'
import TestsTab from '../components/dashboard/Tabs/TestsTab'
import AnalyticsTab from '../components/dashboard/Tabs/AnalyticsTab'
import SettingsTab from '../components/dashboard/Tabs/SettingsTab'
import { Plus } from 'lucide-react'

const CreatorDashboard = () => {
    const [tests, setTests] = useState([])
    const [loading, setLoading] = useState(true)
    const location = useLocation()
    const navigate = useNavigate()
    const queryParams = new URLSearchParams(location.search)
    const activeTab = queryParams.get('tab') || 'overview'

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/tests')
                setTests(res.data)
            } catch (err) {
                console.error('Failed to fetch tests', err)
            } finally {
                setLoading(false)
            }
        }
        fetchTests()
    }, [])

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <OverviewTab tests={tests} />
            case 'tests': return <TestsTab tests={tests} />
            case 'analytics': return <AnalyticsTab />
            case 'settings': return <SettingsTab />
            default: return <OverviewTab tests={tests} />
        }
    }

    if (loading) return <div className="h-screen flex items-center justify-center font-bold">Synchronizing Dashboard...</div>

    return (
        <div className="flex bg-[#F8FAFC] min-h-screen font-sans selection:bg-slate-900 selection:text-white flex-col lg:flex-row">
            <Sidebar />
            <main className="flex-1 p-4 lg:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 lg:mb-12 px-2 gap-4">
                    <div className="space-y-1">
                        <h2 className="text-3xl lg:text-4xl font-black font-outfit text-slate-950 tracking-tight capitalize leading-tight">{activeTab} Dashboard</h2>
                        <p className="text-slate-500 font-medium text-xs lg:text-sm border-l-2 border-slate-200 pl-3">Premium real-time command center for exam creators.</p>
                    </div>
                    {activeTab === 'overview' || activeTab === 'tests' ? (
                        <Link to="/builder" className="w-full sm:w-auto bg-slate-950 text-white py-3 px-6 rounded-2xl flex items-center justify-center gap-2 text-sm font-black shadow-xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all">
                            <Plus size={20} /> New Assessment
                        </Link>
                    ) : null}
                </header>

                <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
                    {renderContent()}
                </div>
            </main>
        </div>
    )
}

export default CreatorDashboard
