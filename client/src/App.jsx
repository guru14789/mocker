import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Communities from './pages/Communities'
import CreatorDashboard from './pages/CreatorDashboard'
import TestBuilder from './pages/TestBuilder'
import ExamPage from './pages/ExamPage'
import ResultPage from './pages/ResultPage'
import AnalyticsDashboard from './pages/AnalyticsDashboard'
import CandidateDashboard from './pages/CandidateDashboard'
import PrintOMR from './pages/PrintOMR'
import OMRScannerPage from './pages/OMRScannerPage'
import ProtectedRoute from './components/common/ProtectedRoute'
import DebugOMR from './pages/DebugOMR'
import './index.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen font-sans font-medium text-slate-900 overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<Auth />} />
          <Route path="/communities" element={<Communities />} />

          <Route path="/dashboard" element={
            <ProtectedRoute role="creator"><CreatorDashboard /></ProtectedRoute>
          } />
          <Route path="/builder/:testId?" element={
            <ProtectedRoute role="creator"><TestBuilder /></ProtectedRoute>
          } />
          <Route path="/analytics/:testId" element={
           <ProtectedRoute role="creator"><AnalyticsDashboard /></ProtectedRoute>
          } />
          <Route path="/print-omr/:testId" element={
            <ProtectedRoute><PrintOMR /></ProtectedRoute>
          } />
          <Route path="/scan-omr/:testId" element={
            <ProtectedRoute><OMRScannerPage /></ProtectedRoute>
          } />

          <Route path="/exam/:uniqueLink" element={
            <ProtectedRoute><ExamPage /></ProtectedRoute>
          } />
          <Route path="/result/:sessionId" element={
            <ResultPage />
          } />
          <Route path="/candidate-dashboard" element={
            <ProtectedRoute role="candidate"><CandidateDashboard /></ProtectedRoute>
          } />
          <Route path="/debug-omr" element={<DebugOMR />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
