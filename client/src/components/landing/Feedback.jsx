import React from 'react'
import { Star, Quote } from 'lucide-react'

const Feedback = () => {
    const testimonials = [
        {
            name: "Vinoth M P",
            role: "Student",
            avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150&h=150",
            comment: "Mocker has made taking online exams so much smoother. I feel much more confident with the user-friendly interface.",
            stars: 5
        },
        {
            name: "kishore",
            role: "Student",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
            comment: "The proctoring system is so smooth that it doesn't distract me at all during the exam. Truly advanced!",
            stars: 5
        },
        {
            name: "Varshini D",
            role: "Student",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150",
            comment: "The real-time sync in the OMR interface is a savior. No more worrying about missing a bubble!",
            stars: 5
        }
    ];

    return (
        <section id="feedback" className="py-12 md:py-16 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-slate-500">Testimonials</h2>
                    <h3 className="text-4xl md:text-5xl font-extrabold font-outfit text-slate-900 leading-tight">
                        Trusted by industry <br />
                        leading experts.
                    </h3>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((item, index) => (
                        <div 
                            key={index} 
                            className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300"
                        >
                            <div className="space-y-6">
                                <div className="flex gap-1">
                                    {[...Array(item.stars)].map((_, i) => (
                                        <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                
                                <p className="text-lg text-slate-700 leading-relaxed italic font-medium">
                                    "{item.comment}"
                                </p>
                            </div>

                            <div className="mt-8 flex items-center gap-4 border-t border-slate-50 pt-6">
                                <img 
                                    src={item.avatar} 
                                    className="w-12 h-12 rounded-full object-cover border-2 border-slate-100" 
                                    alt={item.name} 
                                />
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                                    <p className="text-xs text-slate-500 font-medium">{item.role}</p>
                                </div>
                                <Quote className="ml-auto text-slate-100" size={32} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Feedback
