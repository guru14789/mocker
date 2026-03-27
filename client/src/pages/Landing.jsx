import React from 'react'
import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
import CompanySlider from '../components/landing/CompanySlider'
import Pricing from '../components/landing/Pricing'
import About from '../components/landing/About'
import Feedback from '../components/landing/Feedback'
import Footer from '../components/landing/Footer'

import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { ShieldCheck, FileEdit, BarChart3 } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)


const Landing = () => {
  const main = React.useRef()

  useGSAP(() => {
    // Hero Entrance
    const tl = gsap.timeline()
    tl.from('.hero-content > *', {
      y: 20,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out'
    })

    // Sub-section revealing (Professional expo ease)
    const sections = gsap.utils.toArray('section')
    sections.forEach((section) => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        y: 60,
        duration: 1.4,
        ease: 'expo.out'
      })
    })
  }, { scope: main })

  return (
    <div ref={main} className="bg-white scroll-smooth overflow-x-hidden">
      <Navbar />
      <Hero />
      <CompanySlider />
      <Feedback />
      <Pricing />
      <About />
      <Footer />
    </div>
  )
}

export default Landing
