import React, { useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import ExamCard from '../components/landing/ExamCard'
import Navbar from '../components/landing/Navbar'

const omrExams = [
  { name: 'NEET', image: '/neet_thumbnail.png' },
  { name: 'UPSC', image: '/upsc_thumbnail.png' },
  { name: 'TNPSC', image: '/tnpsc_thumbnail.png' },
  { name: 'TRB', image: '/trb_thumbnail.png' },
  { name: 'TET', image: '/tet_thumbnail.png' },
];

const cbtExams = [
  { name: 'GATE', image: '/gate_thumbnail.png' },
  { name: 'JEE', image: '/jee_thumbnail.png' },
  { name: 'IBPS', image: '/ibps_thumbnail.png' },
  { name: 'CSIR NET', image: '/csir_net_thumbnail.png' },
  { name: 'RRB', image: '/rrb_thumbnail.png' },
  { name: 'SSC', image: '/ssc_thumbnail.png' },
];

const ComparisonPage = () => {
  const { user, loading } = useAuth();
  const container = useRef();

  useGSAP(() => {
    // Entrance for Page 1
    gsap.fromTo('.exam-section', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.3, ease: 'power3.out', delay: 0.5 });
    gsap.fromTo('.hero-buttons', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: 1.4 });
  }, { scope: container });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div ref={container} className="w-full pt-20">
        {/* Comparison Section */}
        <section className="relative flex flex-col items-center justify-start px-4 pt-4 pb-10 overflow-hidden bg-white">
          
          {/* Exam Dashboard Grids */}
          <div className="w-full max-w-[1350px] mx-auto flex flex-col lg:flex-row gap-6 lg:gap-6 mb-8 relative z-10 px-2 md:px-6">
            {/* Section 1: OMR Exams */}
            <div className="exam-section flex-1 space-y-8 bg-slate-50/50 p-4 md:p-8 rounded-[3rem] border border-slate-200 shadow-sm h-full">
              <div className="flex flex-col sm:flex-row sm:items-end gap-3 mb-2">
                <h2 className="text-3xl md:text-5xl font-extrabold text-[#0F172A] font-outfit">OMR</h2>
                <span className="text-slate-500 font-semibold text-lg md:text-2xl pb-0.5">Pen & Paper</span>
              </div>
              <div className="flex flex-wrap justify-center gap-6">
                {omrExams.map((exam, idx) => (
                  <div key={`omr-${idx}`} className="w-full sm:w-[calc(50%-12px)] xl:w-[calc(50%-16px)]">
                    <ExamCard key={`omr-${idx}`} image={exam.image} />
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: CBT Exams */}
            <div className="exam-section flex-1 space-y-8 bg-slate-50/50 p-4 md:p-8 rounded-[3rem] border border-slate-200 shadow-sm h-full">
              <div className="flex flex-col sm:flex-row sm:items-end gap-3 mb-2">
                <h2 className="text-3xl md:text-5xl font-extrabold text-[#0F172A] font-outfit">CBT</h2>
                <span className="text-slate-500 font-semibold text-lg md:text-2xl pb-0.5">Computer-Based</span>
              </div>
              <div className="flex flex-wrap justify-center gap-6">
                {cbtExams.map((exam, idx) => (
                  <div key={`cbt-${idx}`} className="w-full sm:w-[calc(50%-12px)] xl:w-[calc(50%-16px)]">
                    <ExamCard key={`cbt-${idx}`} image={exam.image} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Auth CTA Buttons */}
          <div className="hero-buttons flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10 pt-4">
            <Link to="/signup" className="bg-[#0F172A] text-white py-5 px-14 rounded-full text-xl font-bold flex items-center gap-3 hover:scale-105 hover:shadow-2xl hover:bg-slate-900 transition-all shadow-xl shadow-slate-200">
              Sign Up <ArrowRight size={22} strokeWidth={3} />
            </Link>
            <Link to="/login" className="py-5 px-14 text-xl font-bold text-[#0F172A] bg-white border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 rounded-full transition-all shadow-sm">
              Log In
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

export default ComparisonPage
