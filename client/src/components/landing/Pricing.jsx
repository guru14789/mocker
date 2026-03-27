import React, { useState } from 'react'
import { Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const Pricing = () => {
  const [activePlan, setActivePlan] = useState(1); // Default to middle plan (Pro)

  const plans = [
    { 
      name: 'Starter', 
      price: '$19', 
      features: ['100 Participants/mo', '50 Tests/mo', 'Basic AI Proctoring', 'Email Support'], 
      desc: 'Ideal for small classrooms & tutors.' 
    },
    { 
      name: 'Growth', 
      price: '$49', 
      features: ['1,000 Participants/mo', '500 Tests/mo', 'Advanced AI Proctoring', 'Detailed Analytics', 'Priority Support'], 
      popular: true, 
      desc: 'Best for growing training centers.' 
    },
    { 
      name: 'Institutional', 
      price: 'Custom', 
      features: ['Unlimited Participants', 'Unlimited Tests', 'Full API Access', 'Custom Branding', '24/7 Dedicated Support'], 
      desc: 'For large-scale university exams.' 
    },
  ]

  return (
    <section id="pricing" className="py-16 md:py-24 bg-white px-6">
      <div className="max-w-6xl mx-auto text-center mb-10 md:mb-20">
        <h2 className="text-3xl md:text-5xl font-black font-outfit text-slate-900 mb-4 tracking-tight translate-y-0">Simple, Transparent Pricing</h2>
        <p className="text-slate-500 font-medium max-w-2xl mx-auto text-sm md:text-lg">Choose the plan that fits your needs. No hidden fees.</p>
      </div>

      {/* Mobile Plan Switcher */}
      <div className="flex md:hidden bg-slate-50 p-1.5 rounded-2xl mb-10 max-w-xs mx-auto border border-slate-100">
        {plans.map((p, i) => (
          <button
            key={i}
            onClick={() => setActivePlan(i)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${activePlan === i ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Pricing Grid */}
      <div className="max-w-6xl mx-auto relative h-auto">
        {/* Desktop View (Grid) */}
        <div className="hidden md:grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div key={i} className={`relative group h-full ${plan.popular ? 'scale-105 z-10' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30">
                  <span className="bg-[#0F172A] text-white text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2 rounded-full shadow-xl">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="h-full bg-white p-10 rounded-[2.5rem] border-2 border-slate-50 hover:border-slate-200 transition-all shadow-xl shadow-slate-200/40 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-400 uppercase tracking-[0.2em] mb-4">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-5xl font-black text-slate-900 leading-none tracking-tight">{plan.price}</span>
                    {plan.price !== 'Custom' && <span className="text-sm font-bold text-slate-400">/mo</span>}
                  </div>
                  <ul className="space-y-4 mb-10">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                        <Check size={16} className="text-emerald-500" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <button className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${plan.popular ? 'bg-slate-900 text-white hover:bg-black shadow-lg shadow-slate-200' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>
                  Get Started
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View (Active Plan Card) */}
        <div className="md:hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePlan}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 shadow-2xl shadow-slate-200/50 flex flex-col items-center text-center"
            >
              <h3 className="text-sm font-black text-[#0F172A] uppercase tracking-[0.2em] mb-4">{plans[activePlan].name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-6xl font-black text-slate-900 leading-none">{plans[activePlan].price}</span>
                {plans[activePlan].price !== 'Custom' && <span className="text-sm font-bold text-slate-400">/mo</span>}
              </div>
              <p className="text-slate-500 text-sm font-medium mb-8">{plans[activePlan].desc}</p>
              <ul className="space-y-4 mb-10 w-full text-left bg-slate-50 p-6 rounded-2xl">
                {plans[activePlan].features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                    <Check size={16} className="text-emerald-500" /> {f}
                  </li>
                ))}
              </ul>
              <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200">
                Start with {plans[activePlan].name}
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

export default Pricing
