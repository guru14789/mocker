import React, { useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const Hero = () => {
  const { user } = useAuth();
  const container = useRef();

  const getStartedPath = () => {
    if (!user) return '/signup';
    return user.role === 'creator' ? '/dashboard' : '/candidate-dashboard';
  };

  useGSAP(() => {
    // Subtle breathing animation for characters (Professional, slower)
    gsap.to('.hero-bg-img', {
      scale: 1.12,
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    // Interactive gaze/parallax effect (Subtle & High-end)
    const onMouseMove = (e) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 25;
      const y = (clientY / window.innerHeight - 0.5) * 12;

      // Characters move slightly WITH the cursor (interactive gaze)
      gsap.to('.hero-bg-img', {
        x: x * 0.6,
        y: y * 0.4,
        duration: 2,
        ease: 'power2.out'
      });

      // Content moves slightly OPPOSITE to cursor (parallax depth)
      gsap.to('.hero-content', {
        x: -x * 0.2,
        y: -y * 0.1,
        duration: 2,
        ease: 'power2.out'
      });
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, { scope: container });

  return (
    <section
      ref={container}
      className="relative flex flex-col items-center justify-center text-center px-4 overflow-hidden bg-white min-h-screen lg:h-screen"
    >
      {/* Dynamic Background Layer */}
      <div className="hero-bg-contain absolute inset-0 z-0 pointer-events-none select-none overflow-hidden flex items-end justify-center">
        <img
          src="/landing-hero.png"
          alt="Hero characters"
          className="hero-bg-img w-full h-full object-cover object-top md:object-bottom scale-110 transition-transform duration-1000"
        />
      </div>

      <div className="hero-content max-w-4xl mx-auto space-y-8 relative z-5 py-10 px-2 -translate-y-10 md:-translate-y-10">
        <h1 className="hero-title text-3xl md:text-5xl font-extrabold font-outfit text-[#0F172A] tracking-tight leading-[1.04] mb-4">
          Smart Exams. <br />
          Seamless Experience.
        </h1>
        <p className="hero-subtext text-sm md:text-base text-slate-800 font-bold max-w-2xl mx-auto leading-relaxed bg-white/[0.02] backdrop-blur-md rounded-2xl px-8 py-5 inline-block shadow-sm">
          The most reliable and intuitive proctoring platform <br className="hidden md:block" />
          for building and delivering high-stakes assessments.
        </p>

        <div className="hero-buttons flex flex-col sm:flex-row items-center justify-center gap-5 pt-12 animate-pulse-subtle">
          <Link to={getStartedPath()} className="bg-[#0F172A] text-white py-4 px-10 rounded-full text-lg font-bold flex items-center gap-3 hover:scale-105 hover:shadow-2xl hover:bg-slate-900 transition-all shadow-xl shadow-slate-200">
            {user ? 'Go to Dashboard' : 'Join for Free'} <ArrowRight size={20} strokeWidth={3} />
          </Link>
          <Link to="/communities" className="group flex items-center gap-3 py-4 px-10 text-lg font-bold text-[#0F172A] bg-white border-2 border-slate-100 hover:border-slate-200 hover:bg-slate-50 rounded-full transition-all shadow-sm">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center border-2 border-white group-hover:scale-110 transition-transform">
              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=64&h=64" alt="profile" className="w-full h-full object-cover" />
            </div>
            Explore Communities
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Hero
