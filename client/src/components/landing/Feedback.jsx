import React, { useState, useEffect } from 'react'
import { Star, Quote, ShieldCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const Feedback = () => {
    const allTestimonials = [
        {
            name: "Dr. Vinoth M P",
            role: "Chief Medical Officer",
            avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150&h=150",
            comment: "Mocker has revolutionized our board certifications. The platform's integrity is unmatched in the digital space.",
            stars: 5,
            tag: "Healthcare"
        },
        {
            name: "Kishore R",
            role: "Global HR Lead",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
            comment: "The automated grading and proctoring sync saved us hundreds of man-hours last quarter. Truly state-of-the-art.",
            stars: 5,
            tag: "Enterprise"
        },
        {
            name: "Varshini D",
            role: "Senior Tech Architect",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150",
            comment: "As an architect, I appreciate the zero-latency OMR sheet implementation. It's the standard for professional testing.",
            stars: 5,
            tag: "Technology"
        },
        {
            name: "Arun Kumar",
            role: "Financial Analyst",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150",
            comment: "Finally, a testing platform that understands the high-stakes requirements of CFA prep exams.",
            stars: 5,
            tag: "Financial"
        },
        {
            name: "Suresh P",
            role: "Product Director",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150",
            comment: "Building custom question banks and distributing them across regions has never been this effortless.",
            stars: 5,
            tag: "Product"
        },
        {
            name: "Anjali S",
            role: "Rector, Global Univ",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
            comment: "Distance learning depends on trust. Mocker provides that through AI-driven security that actually works.",
            stars: 5,
            tag: "Education"
        }
    ];

    const [page, setPage] = useState(0);
    const totalPages = Math.ceil(allTestimonials.length / 3);

    useEffect(() => {
        const timer = setInterval(() => {
            setPage(prev => (prev + 1) % totalPages);
        }, 6000);
        return () => clearInterval(timer);
    }, [totalPages]);

    // Slice current 3 testimonials
    const currentTestimonials = allTestimonials.slice(page * 3, (page * 3) + 3);

    return (
        <section id="feedback" className="py-16 md:py-20 bg-slate-50 min-h-[700px]">
            <div className="max-w-5xl mx-auto px-6">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-4 border border-emerald-100">
                        <ShieldCheck size={12} /> Global Endorsements
                    </div>
                    <h1 className="text-4xl font-black font-outfit text-slate-900 mb-4 tracking-tight">
                        Trusted by industry <br />
                        leading experts.
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={page}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8 }}
                            className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-6"
                        >
                            {currentTestimonials.map((item, index) => (
                                <div 
                                    key={index}
                                    className={`bg-white p-6 md:p-7 rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-200/20 flex flex-col justify-between hover:border-slate-300 transition-colors
                                        ${index > 0 ? 'hidden md:flex' : 'flex'}`}
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex gap-1" title={`${item.stars} stars`}>
                                                {[...Array(item.stars)].map((_, i) => (
                                                    <Star key={i} size={10} className="fill-yellow-400 text-yellow-400" />
                                                ))}
                                            </div>
                                            <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest px-2 py-0.5 bg-slate-50 rounded-lg">
                                                {item.tag}
                                            </span>
                                        </div>
                                        
                                        <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium italic">
                                            "{item.comment}"
                                        </p>
                                    </div>

                                    <div className="mt-8 flex items-center gap-3 pt-5 border-t border-slate-50">
                                        <img 
                                            src={item.avatar} 
                                            className="w-10 h-10 md:w-11 md:h-11 rounded-xl object-cover border-2 border-slate-50 shadow-sm" 
                                            alt={item.name} 
                                        />
                                        <div className="text-left">
                                            <h4 className="font-bold text-slate-900 text-sm leading-none mb-1">{item.name}</h4>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{item.role}</p>
                                        </div>
                                        <Quote className="ml-auto text-slate-100/30" size={24} strokeWidth={3} />
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center gap-2 mt-12">
                    {[...Array(totalPages)].map((_, i) => (
                        <button 
                            key={i}
                            onClick={() => setPage(i)}
                            className={`h-1.5 rounded-full transition-all duration-500 ${page === i ? 'w-8 bg-slate-900' : 'w-2 bg-slate-200'}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Feedback
