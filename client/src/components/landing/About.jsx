import React from 'react'
import { Shield, Target, Users } from 'lucide-react'

const About = () => {
  const values = [
    { title: 'Integrity', desc: 'We believe in fair and transparent examination processes.', icon: <Shield size={32} /> },
    { title: 'Efficiency', desc: 'Our platform is designed to save time for both creators and candidates.', icon: <Target size={32} /> },
    { title: 'Community', desc: 'Built for educators, by people who value the growth of learning.', icon: <Users size={32} /> },
  ]

  return (
    <section id="about" className="py-12 md:py-24 bg-white px-6 border-y border-slate-50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-black font-outfit text-slate-900 mb-6 md:mb-8">Our Mission</h2>
        <p className="text-base md:text-lg text-slate-600 font-medium leading-relaxed mb-0 md:mb-16">
          Software Mocker started with a simple goal: to make online testing as reliable and secure as in-person exams. 
          We provide cutting-edge proctoring and a seamless user experience to ensure academic and professional integrity across the globe.
        </p>

        <div className="hidden md:grid md:grid-cols-3 gap-12 mt-16">
          {values.map((v, i) => (
            <div key={i} className="space-y-4 text-center">
               <div className="w-16 h-16 bg-slate-50 text-slate-900 rounded-2xl flex items-center justify-center mx-auto transition-transform hover:scale-110">
                  {v.icon}
               </div>
               <h3 className="text-xl font-bold font-outfit text-slate-900">{v.title}</h3>
               <p className="text-slate-500 text-sm font-medium leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default About
