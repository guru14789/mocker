import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Plus, Trash2, Save, Send, ChevronLeft, Layout, Settings, GripVertical, CheckCircle2, X, Copy, ExternalLink } from 'lucide-react'

const PublishModal = ({ isOpen, onClose, link }) => {
    if (!isOpen) return null
    const fullLink = `${window.location.origin}/exam/${link}`
    
    const copyLink = () => {
        navigator.clipboard.writeText(fullLink)
        alert('Exam link copied to clipboard!')
    }

    return (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-white rounded-[3rem] p-12 max-w-xl w-full shadow-2xl space-y-8 animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-start">
                    <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 shadow-xl shadow-emerald-50 mb-2">
                        <CheckCircle2 size={32} />
                    </div>
                </div>
                <div className="space-y-2">
                    <h3 className="text-3xl font-black font-outfit text-slate-950">Assessment Published</h3>
                    <p className="text-slate-500 font-medium">Your examination is now live. Share the unique link below with your candidates to begin the session.</p>
                </div>

                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center gap-4">
                    <div className="flex-1 overflow-hidden">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">CANDIDATE ACCESS URL</p>
                        <p className="text-sm font-bold text-slate-950 truncate whitespace-nowrap">{fullLink}</p>
                    </div>
                    <button onClick={copyLink} className="p-4 bg-white hover:bg-slate-950 hover:text-white rounded-xl shadow-sm border border-slate-100 transition-all text-slate-400 active:scale-95">
                        <Copy size={20} />
                    </button>
                </div>

                <div className="flex gap-4 pt-4">
                     <button onClick={onClose} className="flex-1 py-4 px-8 bg-slate-50 text-slate-950 rounded-2xl text-sm font-black hover:bg-slate-100 transition-all">
                        Back to Editor
                    </button>
                    <a href={fullLink} target="_blank" rel="noopener noreferrer" className="flex-1 py-4 px-8 bg-slate-950 text-white rounded-2xl text-sm font-black text-center shadow-lg shadow-slate-200 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
                        Preview Exam <ExternalLink size={16} />
                    </a>
                </div>
            </div>
        </div>
    )
}

const TestBuilder = () => {
    const { testId } = useParams()
    const navigate = useNavigate()
    const [test, setTest] = useState({ title: '', description: '', duration: 30, maxParticipants: 50, negativeMark: 0, examType: 'computer-based' })
    const [questions, setQuestions] = useState([])
    const [isNew, setIsNew] = useState(!testId)
    const [loading, setLoading] = useState(!!testId)
    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false)

    useEffect(() => {
        // Only fetch if we have a testId and the title is still empty (initial load)
        if (testId && !test.title) {
            fetchTestData()
        }
    }, [testId])

    const fetchTestData = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/tests/${testId}`)
            setTest(res.data.test)
            setQuestions(res.data.questions)
        } catch (err) {
            console.error('Failed to fetch test', err)
        } finally {
            setLoading(false)
        }
    }

    const handleSaveTest = async (silent = false) => {
        try {
            const payload = { ...test, questions }
            let res;
            if (isNew) {
                res = await axios.post('http://localhost:5000/api/tests', payload);
                setIsNew(false);
                navigate(`/builder/${res.data.test._id}`, { replace: true });
            } else {
                res = await axios.put(`http://localhost:5000/api/tests/${testId}`, payload)
            }
            
            // Sync state with server response
            if (res.data) {
                setTest(res.data.test)
                setQuestions(res.data.questions)
            }

            if (!silent) alert('Progress saved successfully!')
            return res.data.test;
        } catch (err) {
            console.error('Failed to save test', err)
            throw err
        }
    }

    const handlePublish = async () => {
        try {
            const currentTest = await handleSaveTest(true)
            await axios.put(`http://localhost:5000/api/tests/${currentTest._id}/publish`)
            setIsPublishModalOpen(true)
        } catch (err) {
            alert('Failed to publish assessment.')
        }
    }

    const addQuestion = () => {
        const newQuestion = {
            questionText: '',
            options: [
                { label: 'A', text: '' },
                { label: 'B', text: '' }
            ],
            correctAnswers: ['A'],
            marks: 1,
            negativeMarks: 0,
            order: questions.length,
            type: 'single'
        }
        setQuestions([...questions, newQuestion])
    }

    const updateQuestion = (idx, updates) => {
        const newQs = [...questions]
        newQs[idx] = { ...newQs[idx], ...updates }
        setQuestions(newQs)
    }

    const removeQuestion = (idx) => {
        setQuestions(questions.filter((_, i) => i !== idx))
    }

    const addOption = (qIdx) => {
        const newQs = [...questions]
        const q = newQs[qIdx]
        const nextLabel = String.fromCharCode(65 + q.options.length)
        q.options.push({ label: nextLabel, text: '' })
        setQuestions(newQs)
    }

    const removeOption = (qIdx, optIdx) => {
        const newQs = [...questions]
        const q = newQs[qIdx]
        if (q.options.length <= 2) return
        const removedLabel = q.options[optIdx].label
        q.options.splice(optIdx, 1)
        q.options.forEach((opt, i) => opt.label = String.fromCharCode(65 + i))
        q.correctAnswers = q.correctAnswers.filter(l => l !== removedLabel)
        setQuestions(newQs)
    }

    const toggleCorrect = (qIdx, label) => {
        const newQs = [...questions]
        const q = newQs[qIdx]
        if (q.correctAnswers.includes(label)) {
            if (q.correctAnswers.length > 1) {
                q.correctAnswers = q.correctAnswers.filter(l => l !== label)
            }
        } else {
            q.correctAnswers = [label]
        }
        setQuestions(newQs)
    }

    if (loading) return <div className="h-screen flex items-center justify-center font-bold">Initializing Assessment Engine...</div>

    return (
        <div className="bg-[#FBFCFE] min-h-screen font-sans">
            <PublishModal isOpen={isPublishModalOpen} onClose={() => setIsPublishModalOpen(false)} link={test.uniqueLink} />
            
            <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 px-10 flex items-center justify-between z-50">
                <div className="flex items-center gap-6">
                    <button onClick={() => navigate('/dashboard')} className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-500 hover:text-slate-950">
                        <ChevronLeft size={24} />
                    </button>
                    <div className="flex flex-col">
                        <h2 className="text-xl font-black font-outfit text-slate-950 leading-tight">
                            {isNew ? 'Untitled Assessment' : test.title || 'Untitled Assessment'}
                        </h2>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Builder Mode • {test.status === 'published' ? 'Live' : 'Draft'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={() => handleSaveTest()} className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2">
                        <Save size={18} /> Save Progress
                    </button>
                    <button onClick={handlePublish} className="px-8 py-3 bg-slate-950 text-white rounded-2xl text-sm font-black shadow-2xl shadow-slate-200 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                        <Send size={18} /> Publish Exam
                    </button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto py-16 space-y-12">
                <section className="bg-white rounded-[3rem] border border-slate-100 p-12 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-2 h-full bg-slate-950 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="space-y-10">
                         <div className="space-y-3">
                            <input 
                                className="w-full text-5xl font-black font-outfit text-slate-950 placeholder:text-slate-200 focus:outline-none bg-transparent"
                                placeholder="Assessment Title"
                                value={test.title}
                                onChange={e => setTest({...test, title: e.target.value})}
                            />
                            <textarea 
                                className="w-full text-lg font-medium text-slate-500 placeholder:text-slate-200 focus:outline-none bg-transparent resize-none h-auto"
                                placeholder="Add instructions or description for candidates..."
                                value={test.description}
                                onChange={e => setTest({...test, description: e.target.value})}
                                rows={2}
                            />
                         </div>

                         <div className="grid grid-cols-4 gap-8 pt-10 border-t border-slate-50">
                             <div className="flex flex-col gap-2">
                                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest leading-none">Limit (Min)</label>
                                <input 
                                    type="number"
                                    className="text-2xl font-black font-outfit text-slate-950 bg-slate-50 px-4 py-2 rounded-xl w-full focus:ring-2 ring-slate-100 outline-none"
                                    value={test.duration}
                                    onChange={e => setTest({...test, duration: e.target.value})}
                                />
                             </div>
                             <div className="flex flex-col gap-2">
                                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest leading-none">Max Capacity</label>
                                <input 
                                    type="number"
                                    className="text-2xl font-black font-outfit text-slate-950 bg-slate-50 px-4 py-2 rounded-xl w-full focus:ring-2 ring-slate-100 outline-none"
                                    value={test.maxParticipants}
                                    onChange={e => setTest({...test, maxParticipants: e.target.value})}
                                />
                             </div>
                              <div className="flex flex-col gap-2">
                                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest leading-none">Penalty/Wrong</label>
                                <input 
                                    type="number"
                                    className="text-2xl font-black font-outfit text-slate-950 bg-slate-50 px-4 py-2 rounded-xl w-full focus:ring-2 ring-slate-100 outline-none"
                                    value={test.negativeMark}
                                    onChange={e => setTest({...test, negativeMark: e.target.value})}
                                />
                             </div>
                             <div className="flex flex-col gap-2">
                                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest leading-none">Mode</label>
                                <select 
                                    className="text-sm font-black font-outfit text-slate-950 bg-slate-50 px-4 py-[11px] rounded-xl w-full focus:ring-2 ring-slate-100 outline-none appearance-none cursor-pointer"
                                    value={test.examType}
                                    onChange={e => setTest({...test, examType: e.target.value})}
                                >
                                    <option value="computer-based">🖥️ Computer</option>
                                    <option value="omr-scanning">📑 OMR</option>
                                    <option value="hybrid">🌓 Hybrid</option>
                                </select>
                             </div>
                         </div>
                    </div>
                </section>

                <div className="space-y-8 pb-32">
                    {questions.map((q, qIdx) => (
                        <div key={qIdx} className="bg-white rounded-[3rem] border border-slate-100 p-12 shadow-sm relative group animate-in slide-in-from-bottom-2 duration-500">
                             <div className="absolute top-0 left-0 w-2 h-full bg-blue-600 opacity-0 group-focus-within:opacity-100 transition-opacity" />
                             
                             <div className="flex items-center gap-4 mb-8">
                                <div className="p-2 text-slate-200 cursor-grab active:cursor-grabbing">
                                    <GripVertical size={20} />
                                </div>
                                <input 
                                    className="flex-1 text-2xl font-black font-outfit text-slate-950 placeholder:text-slate-200 focus:outline-none bg-transparent"
                                    placeholder="Untitled Question"
                                    value={q.questionText}
                                    onChange={e => updateQuestion(qIdx, { questionText: e.target.value })}
                                />
                                <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-2xl border border-slate-100">
                                     <input 
                                        type="number"
                                        className="w-12 text-center bg-transparent font-black text-slate-950 focus:outline-none"
                                        value={q.marks}
                                        onChange={e => updateQuestion(qIdx, { marks: parseInt(e.target.value) || 1 })}
                                     />
                                     <span className="text-[10px] font-black uppercase text-slate-400 pr-3">PTS</span>
                                </div>
                             </div>

                             <div className="space-y-4 pl-12">
                                {q.options.map((opt, optIdx) => (
                                    <div key={optIdx} className="flex items-center gap-4 group/option">
                                        <button 
                                            onClick={() => toggleCorrect(qIdx, opt.label)}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                                q.correctAnswers.includes(opt.label) 
                                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' 
                                                : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                                            }`}
                                        >
                                            {q.correctAnswers.includes(opt.label) ? <CheckCircle2 size={20} /> : <span className="font-bold">{opt.label}</span>}
                                        </button>
                                        <input 
                                            className="flex-1 bg-transparent border-b-2 border-transparent focus:border-slate-950 py-2 text-lg font-bold text-slate-900 transition-all focus:outline-none placeholder:text-slate-200"
                                            placeholder={`Option ${optIdx + 1}`}
                                            value={opt.text}
                                            onChange={e => {
                                                const newOpts = [...q.options]
                                                newOpts[optIdx].text = e.target.value
                                                updateQuestion(qIdx, { options: newOpts })
                                            }}
                                        />
                                        <button 
                                            onClick={() => removeOption(qIdx, optIdx)}
                                            className="p-2 text-slate-200 hover:text-red-500 opacity-0 group-hover/option:opacity-100 transition-all"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                ))}
                                
                                <button 
                                    onClick={() => addOption(qIdx)}
                                    className="flex items-center gap-3 text-sm font-black text-slate-400 hover:text-slate-950 transition-colors py-4 pl-14"
                                >
                                    <Plus size={18} /> Add another option
                                </button>
                             </div>

                             <div className="flex justify-end gap-3 mt-12 pt-8 border-t border-slate-50 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => removeQuestion(qIdx)}
                                    className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                                >
                                    <Trash2 size={20} />
                                </button>
                                <div className="w-[1px] h-10 bg-slate-100 mx-2" />
                                <button className="p-3 text-slate-400 hover:text-slate-950 hover:bg-slate-50 rounded-2xl transition-all">
                                    <Settings size={20} />
                                </button>
                             </div>
                        </div>
                    ))}

                    <button 
                        onClick={addQuestion}
                        className="w-full py-10 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center gap-4 text-slate-400 hover:bg-white hover:border-slate-950 hover:text-slate-950 transition-all group"
                    >
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-slate-950 group-hover:text-white transition-all shadow-xl shadow-slate-50">
                            <Plus size={32} />
                        </div>
                        <span className="text-xl font-black font-outfit uppercase tracking-widest">Insert New Question</span>
                    </button>
                </div>
            </main>
        </div>
    )
}

export default TestBuilder
