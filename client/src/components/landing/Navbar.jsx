import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Box, User, LogOut, Menu, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  const menuRef = useRef()

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useGSAP(() => {
    if (isOpen) {
      gsap.to(menuRef.current, {
        x: 0,
        duration: 0.6,
        ease: 'power4.out'
      })
      gsap.from('.mobile-nav-item', {
        x: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.4,
        delay: 0.2
      })
    } else {
      gsap.to(menuRef.current, {
        x: '100%',
        duration: 0.5,
        ease: 'power4.in'
      })
    }
  }, [isOpen])
  
  return (
    <>
      <nav 
        className={`h-20 flex items-center justify-between px-6 md:px-12 fixed top-0 w-full z-[9999] transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/80 backdrop-blur-xl border-b border-slate-100 py-4 shadow-sm' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="flex items-center gap-2 group cursor-pointer z-[10000]">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white transition-transform group-hover:rotate-12">
              <Box size={18} />
            </div>
            <span className="text-xl font-bold tracking-tight font-outfit text-slate-900">Mocker</span>
          </Link>
        </div>
        
        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          <ul className="flex items-center gap-8">
            <li><Link to="/#pricing" className="text-[15px] font-medium text-slate-600 hover:text-slate-950 transition-colors">Pricing</Link></li>
            <li><Link to="/communities" className="text-[15px] font-medium text-slate-600 hover:text-slate-950 transition-colors">Communities</Link></li>
          </ul>

          <div className="flex items-center gap-6 ml-4">
            {user ? (
              <>
                <Link 
                  to={user.role === 'creator' ? '/dashboard' : '/candidate-dashboard'}
                  className="flex items-center gap-2 px-4 py-1.5 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors group"
                >
                  <User size={14} className="text-slate-600 group-hover:text-slate-900" />
                  <span className="text-sm font-bold text-slate-800">{user.name}</span>
                </Link>
                <button 
                  onClick={logout} 
                  className="p-2 text-slate-400 hover:text-red-600 transition-colors" 
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-[15px] font-medium text-slate-900 hover:underline">Login</Link>
                <Link to="/signup" className="bg-[#0F172A] text-white py-2.5 px-6 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-all">
                  Join for Free <ArrowRight size={14} strokeWidth={3} />
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="lg:hidden p-2 text-slate-900 z-[10000]"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Sidebar */}
      <div 
        ref={menuRef}
        className="fixed inset-0 bg-white z-[9998] flex flex-col p-8 pt-32 translate-x-full lg:hidden"
      >
        <ul className="space-y-6 mb-12">
          <li className="mobile-nav-item"><Link onClick={() => setIsOpen(false)} to="/#pricing" className="text-4xl font-black font-outfit text-slate-900">Pricing</Link></li>
          <li className="mobile-nav-item"><Link onClick={() => setIsOpen(false)} to="/communities" className="text-4xl font-black font-outfit text-slate-900">Communities</Link></li>
        </ul>

        <div className="mt-auto space-y-4">
          {user ? (
            <div className="mobile-nav-item space-y-4">
              <Link 
                onClick={() => setIsOpen(false)}
                to={user.role === 'creator' ? '/dashboard' : '/candidate-dashboard'}
                className="block w-full text-center py-4 bg-slate-100 rounded-2xl font-bold text-slate-900"
              >
                Go to Dashboard
              </Link>
              <button 
                onClick={() => { logout(); setIsOpen(false); }}
                className="w-full py-4 text-red-500 font-bold border-2 border-red-50 rounded-2xl"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="mobile-nav-item space-y-4">
              <Link onClick={() => setIsOpen(false)} to="/login" className="block w-full text-center py-4 text-[#0F172A] font-bold">Login</Link>
              <Link onClick={() => setIsOpen(false)} to="/signup" className="block w-full text-center py-5 bg-[#0F172A] text-white rounded-2xl font-black text-lg shadow-xl shadow-slate-200">
                Join for Free
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Navbar

