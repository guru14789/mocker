import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Box, User, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const [isScrolled, setIsScrolled] = React.useState(false)
  const container = useRef()

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useGSAP(() => {
    gsap.from(container.current, {
      y: -20,
      duration: 1,
      ease: 'power3.out'
    })
  })
  
  return (
    <nav 
      ref={container} 
      className={`h-20 flex items-center justify-between px-6 md:px-12 fixed top-0 w-full z-[100] transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="flex items-center gap-2 group cursor-pointer">
        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white transition-transform group-hover:rotate-12">
          <Box size={18} />
        </div>
        <span className="text-xl font-bold tracking-tight font-outfit text-slate-900">Mocker</span>
      </div>
      
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
    </nav>
  )
}

export default Navbar

