import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Communities from './pages/Communities'
import CreatorDashboard from './pages/CreatorDashboard'
import TestBuilder from './pages/TestBuilder'
import ExamPage from './pages/ExamPage'
import ExamReadyCheck from './pages/ExamReadyCheck'
import ResultPage from './pages/ResultPage'
import AnalyticsDashboard from './pages/AnalyticsDashboard'
import CandidateDashboard from './pages/CandidateDashboard'
import PrintOMR from './pages/PrintOMR'
import OMRScannerPage from './pages/OMRScannerPage'
import ProtectedRoute from './components/common/ProtectedRoute'
import DebugOMR from './pages/DebugOMR'

// Auth flow pages
import PrivacyPolicy from './pages/PrivacyPolicy'
import EmailVerification from './pages/EmailVerification'
import ForgotPassword from './pages/ForgotPassword'
import ForgotUsername from './pages/ForgotUsername'
import ResetPassword from './pages/ResetPassword'
import CreateProfile from './pages/CreateProfile'
import Dashboard from './pages/Dashboard'

import './index.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen font-sans font-medium text-slate-900 overflow-x-hidden">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<Auth />} />
          <Route path="/communities" element={<Communities />} />

          {/* Registration flow */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/verify-email" element={<EmailVerification />} />

          {/* Forgot credentials */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/forgot-username" element={<ForgotUsername />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Profile Setup */}
          <Route path="/create-profile" element={
            <ProtectedRoute><CreateProfile /></ProtectedRoute>
          } />

          {/* Protected — any role */}
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/candidate-dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/builder/:testId?" element={
            <ProtectedRoute role="creator"><TestBuilder /></ProtectedRoute>
          } />
          <Route path="/analytics/:testId" element={
            <ProtectedRoute role="creator"><AnalyticsDashboard /></ProtectedRoute>
          } />

          {/* Protected — Any auth */}
          <Route path="/print-omr/:testId" element={
            <ProtectedRoute><PrintOMR /></ProtectedRoute>
          } />
          <Route path="/scan-omr/:testId" element={
            <ProtectedRoute><OMRScannerPage /></ProtectedRoute>
          } />
          <Route path="/exam-ready/:uniqueLink" element={
            <ProtectedRoute><ExamReadyCheck /></ProtectedRoute>
          } />
          <Route path="/exam/:uniqueLink" element={
            <ProtectedRoute><ExamPage /></ProtectedRoute>
          } />

          {/* Results */}
          <Route path="/result/:sessionId" element={<ResultPage />} />

          {/* Candidate */}
          <Route path="/candidate-dashboard" element={
            <ProtectedRoute role="candidate"><CandidateDashboard /></ProtectedRoute>
          } />

          {/* Dev */}
          <Route path="/debug-omr" element={<DebugOMR />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
