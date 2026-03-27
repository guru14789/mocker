import React from 'react'
import { Check } from 'lucide-react'

const Pricing = () => {
  const plans = [
    { name: 'Basic', price: 'Free', features: ['10 Tests/month', 'Basic Proctoring', 'Email Support'] },
    { name: 'Pro', price: '$29', features: ['Unlimited Tests', 'AI Proctoring', 'Advanced Analytics', 'Priority Support'], popular: true },
    { name: 'Enterprise', price: 'Custom', features: ['Dedicated Server', 'SLA', 'Custom Integrations', '24/7 Support'] },
  ]

  return (
    <section id="pricing" className="py-12 md:py-16 bg-white px-6">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h2 className="text-4xl font-black font-outfit text-slate-900 mb-4">Simple, Transparent Pricing</h2>
        <p className="text-slate-500 font-medium max-w-2xl mx-auto">Choose the plan that fits your needs. No hidden fees.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, i) => (
          <div key={i} className={`relative group transition-all duration-500 ${plan.popular ? 'scale-105 z-10' : ''}`}>
            {/* The Badge (outside overflow-hidden) */}
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30">
                <span className="bg-[#0F172A] text-white text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2 rounded-full shadow-xl whitespace-nowrap">
                  Most Popular
                </span>
              </div>
            )}

            {/* Layout Wrapper with Border Animation */}
            <div className="relative p-[2px] rounded-[2.6rem] overflow-hidden h-full">
              {/* Moving Border Layer (Conic Gradient) */}
              <div className="absolute inset-[-100%] bg-[conic-gradient(transparent,transparent,transparent,#0F172A)] opacity-0 group-hover:opacity-100 animate-spin-slow transition-opacity duration-500 z-0"></div>
              
              {/* Card Content Layer */}
              <div className="relative z-10 p-10 rounded-[2.5rem] bg-white h-full flex flex-col justify-between">
                <div>
                  <div className="mb-8">
                    <h3 className="text-xl font-bold font-outfit text-slate-500 uppercase tracking-widest mb-2">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-black text-slate-900 leading-none">{plan.price}</span>
                      {plan.price !== 'Custom' && <span className="text-sm font-bold text-slate-400">/mo</span>}
                    </div>
                  </div>

                  <ul className="space-y-5 mb-12 text-left">
                    {plan.features.map((feat, j) => (
                      <li key={j} className="flex items-center gap-3 text-base font-medium text-slate-600 transition-colors">
                        <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                          <Check size={14} className="text-emerald-600 stroke-[3px]" />
                         </div>
                         {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                <button className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300
                  ${plan.popular ? 'bg-slate-900 text-white shadow-xl hover:bg-slate-800' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}>
                  Choose {plan.name}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Pricing
