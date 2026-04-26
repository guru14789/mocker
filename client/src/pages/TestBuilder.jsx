import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Plus, Trash2, Save, Send, ChevronLeft, Layout, Settings, GripVertical, CheckCircle2, X, Copy, ExternalLink, Sparkles, FileText, Loader2, AlertCircle } from 'lucide-react'

const AIHelper = ({ onGenerate }) => {
    const [prompt, setPrompt] = useState('')
    const [sourceUrl, setSourceUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    const handleGenerate = async () => {
        if (!prompt && !sourceUrl) return
        setLoading(true)
        try {
            const token = localStorage.getItem('token')
            const res = await axios.post('http://localhost:5000/api/ai/generate', { 
                prompt,
                sourceUrl,
                topic: prompt.slice(0, 50) || 'General',
                count: 5,
                difficulty: 'medium'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            
            if (res.data.success) {
                onGenerate(res.data.questions)
                setIsOpen(false)
                setPrompt('')
                setSourceUrl('')
            } else {
                alert(res.data.note || 'AI Generation failed.')
            }
        } catch (err) {
            console.error(err)
            alert('AI Generation failed. Ensure you have set GEMINI_API_KEY in the server .env file.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed bottom-10 right-10 z-[100]">
            {!isOpen ? (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="w-16 h-16 bg-indigo-600 text-white rounded-2xl shadow-2xl shadow-indigo-200 flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
                >
                    <Sparkles className="group-hover:rotate-12 transition-transform" />
                </button>
            ) : (
                <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] border border-slate-100 p-8 w-[400px] animate-in slide-in-from-bottom-10 duration-500">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                                <Sparkles size={20} />
                            </div>
                            <h3 className="font-black text-slate-950">AI Question Assistant</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="p-2 text-slate-400 hover:text-slate-950"><X size={20} /></button>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">YouTube OR Web Link (Optional)</label>
                            <input 
                                className="w-full bg-slate-50 rounded-xl p-3 text-xs font-bold text-slate-950 placeholder:text-slate-300 focus:outline-none focus:ring-2 ring-indigo-100"
                                placeholder="https://youtube.com/watch?v=... or https://notion.site/..."
                                value={sourceUrl}
                                onChange={e => setSourceUrl(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">TOPIC OR ADDITIONAL CONTEXT</label>
                            <textarea 
                                className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-bold text-slate-950 placeholder:text-slate-300 focus:outline-none focus:ring-2 ring-indigo-100 min-h-[100px] resize-none"
                                placeholder="Example: Generate 5 advanced physics questions... or paste study material here."
                                value={prompt}
                                onChange={e => setPrompt(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-4">
                             <label className="flex-1 flex items-center justify-center gap-2 py-4 px-6 bg-slate-50 text-slate-500 rounded-xl text-xs font-black hover:bg-slate-100 transition-all cursor-pointer">
                                <FileText size={16} /> 
                                {loading ? 'Reading...' : 'Upload PDF'}
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    accept=".pdf" 
                                    onChange={async (e) => {
                                        const file = e.target.files[0]
                                        if (!file) return
                                        setLoading(true)
                                        try {
                                            const pdfjs = await import('pdfjs-dist/build/pdf')
                                            pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
                                            
                                            const reader = new FileReader()
                                            reader.onload = async (event) => {
                                                const typedarray = new Uint8Array(event.target.result)
                                                const pdf = await pdfjs.getDocument(typedarray).promise
                                                let fullText = ''
                                                for (let i = 1; i <= pdf.numPages; i++) {
                                                    const page = await pdf.getPage(i)
                                                    const textContent = await page.getTextContent()
                                                    fullText += textContent.items.map(s => s.str).join(' ') + '\n'
                                                }
                                                setPrompt(prev => prev + "\n\n[PDF Context]:\n" + fullText)
                                                setLoading(false)
                                            }
                                            reader.readAsArrayBuffer(file)
                                        } catch (err) {
                                            console.error('PDF Read failed', err)
                                            alert('Failed to read PDF. Try pasting text instead.')
                                            setLoading(false)
                                        }
                                    }}
                                />
                             </label>
                             <button 
                                onClick={handleGenerate}
                                disabled={loading}
                                className="flex-1 py-4 px-6 bg-indigo-600 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                             >
                                {loading ? <Loader2 className="animate-spin" size={16} /> : 'Generate Now'}
                             </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

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
        if (q.correctAnswers?.includes(label)) {
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
            
            <header className="h-16 lg:h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 px-4 lg:px-10 flex items-center justify-between z-50">
                <div className="flex items-center gap-3 lg:gap-6">
                    <button onClick={() => navigate('/dashboard')} className="p-2 lg:p-3 hover:bg-slate-100 rounded-xl lg:rounded-2xl transition-all text-slate-500 hover:text-slate-950">
                        <ChevronLeft size={20} />
                    </button>
                    <div className="flex flex-col">
                        <h2 className="text-sm lg:text-xl font-black font-outfit text-slate-950 leading-tight truncate max-w-[120px] sm:max-w-xs">
                            {isNew ? 'New Assessment' : test.title || 'Untitled Assessment'}
                        </h2>
                        <p className="text-[8px] lg:text-[10px] font-black uppercase tracking-widest text-slate-400">Builder • {test.status === 'published' ? 'Live' : 'Draft'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 lg:gap-4">
                    <button onClick={() => handleSaveTest()} className="p-2 lg:px-6 lg:py-3 bg-white border border-slate-200 rounded-xl lg:rounded-2xl text-[10px] lg:text-sm font-black text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2">
                        <Save size={16} /> <span className="hidden sm:inline">Save</span>
                    </button>
                    <button onClick={handlePublish} className="px-4 py-2 lg:px-8 lg:py-3 bg-slate-950 text-white rounded-xl lg:rounded-2xl text-[10px] lg:text-sm font-black shadow-lg shadow-slate-200 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                        <Send size={16} /> <span className="hidden sm:inline">Publish Exam</span>
                    </button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto py-8 lg:py-16 px-4 space-y-8 lg:space-y-12">
                <section className="bg-white rounded-[2rem] lg:rounded-[3rem] border border-slate-100 p-6 lg:p-12 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-950 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="space-y-6 lg:space-y-10">
                         <div className="space-y-2 lg:space-y-3">
                            <input 
                                className="w-full text-3xl lg:text-5xl font-black font-outfit text-slate-950 placeholder:text-slate-200 focus:outline-none bg-transparent"
                                placeholder="Assessment Title"
                                value={test.title}
                                onChange={e => setTest({...test, title: e.target.value})}
                            />
                            <textarea 
                                className="w-full text-sm lg:text-lg font-medium text-slate-500 placeholder:text-slate-200 focus:outline-none bg-transparent resize-none h-auto"
                                placeholder="Add instructions or description for candidates..."
                                value={test.description}
                                onChange={e => setTest({...test, description: e.target.value})}
                                rows={2}
                            />
                         </div>

                         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 pt-6 lg:pt-10 border-t border-slate-50">
                             <div className="flex flex-col gap-1.5">
                                <label className="text-[8px] lg:text-[10px] uppercase font-black text-slate-400 tracking-widest leading-none">Limit (Min)</label>
                                <input 
                                    type="number"
                                    className="text-lg lg:text-2xl font-black font-outfit text-slate-950 bg-slate-50 px-3 py-1.5 lg:px-4 lg:py-2 rounded-xl w-full focus:ring-2 ring-slate-100 outline-none"
                                    value={test.duration}
                                    onChange={e => setTest({...test, duration: e.target.value})}
                                />
                             </div>
                             <div className="flex flex-col gap-1.5">
                                <label className="text-[8px] lg:text-[10px] uppercase font-black text-slate-400 tracking-widest leading-none">Max Capacity</label>
                                <input 
                                    type="number"
                                    className="text-lg lg:text-2xl font-black font-outfit text-slate-950 bg-slate-50 px-3 py-1.5 lg:px-4 lg:py-2 rounded-xl w-full focus:ring-2 ring-slate-100 outline-none"
                                    value={test.maxParticipants}
                                    onChange={e => setTest({...test, maxParticipants: e.target.value})}
                                />
                             </div>
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[8px] lg:text-[10px] uppercase font-black text-slate-400 tracking-widest leading-none">Penalty</label>
                                <input 
                                    type="number"
                                    className="text-lg lg:text-2xl font-black font-outfit text-slate-950 bg-slate-50 px-3 py-1.5 lg:px-4 lg:py-2 rounded-xl w-full focus:ring-2 ring-slate-100 outline-none"
                                    value={test.negativeMark}
                                    onChange={e => setTest({...test, negativeMark: e.target.value})}
                                />
                             </div>
                             <div className="flex flex-col gap-1.5">
                                <label className="text-[8px] lg:text-[10px] uppercase font-black text-slate-400 tracking-widest leading-none">Mode</label>
                                <select 
                                    className="text-xs lg:text-sm font-black font-outfit text-slate-950 bg-slate-50 px-3 py-2 lg:px-4 lg:py-[11px] rounded-xl w-full focus:ring-2 ring-slate-100 outline-none appearance-none cursor-pointer"
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

                <div className="space-y-6 lg:space-y-8 pb-32">
                    {questions.map((q, qIdx) => (
                        <div key={qIdx} className="bg-white rounded-[2rem] lg:rounded-[3rem] border border-slate-100 p-6 lg:p-12 shadow-sm relative group animate-in slide-in-from-bottom-1 duration-500">
                             <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600 opacity-0 group-focus-within:opacity-100 transition-opacity" />
                             
                             <div className="flex items-start lg:items-center gap-3 lg:gap-4 mb-6 lg:mb-8">
                                <div className="mt-1.5 lg:mt-0 p-1.5 text-slate-200 cursor-grab active:cursor-grabbing">
                                    <GripVertical size={18} />
                                </div>
                                <input 
                                    className="flex-1 text-lg lg:text-2xl font-black font-outfit text-slate-950 placeholder:text-slate-200 focus:outline-none bg-transparent"
                                    placeholder="Untitled Question"
                                    value={q.questionText}
                                    onChange={e => updateQuestion(qIdx, { questionText: e.target.value })}
                                />
                                <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-100">
                                     <input 
                                        type="number"
                                        className="w-10 text-center bg-transparent font-black text-xs lg:text-sm text-slate-950 focus:outline-none"
                                        value={q.marks}
                                        onChange={e => updateQuestion(qIdx, { marks: parseInt(e.target.value) || 1 })}
                                     />
                                     <span className="text-[8px] lg:text-[10px] font-black uppercase text-slate-400 pr-2">PTS</span>
                                </div>
                             </div>

                             <div className="space-y-3 lg:space-y-4 lg:pl-12">
                                {q.options.map((opt, optIdx) => (
                                    <div key={optIdx} className="flex items-center gap-3 lg:gap-4 group/option">
                                        <button 
                                            onClick={() => toggleCorrect(qIdx, opt.label)}
                                            className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
                                                q.correctAnswers?.includes(opt.label) 
                                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' 
                                                : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                                            }`}
                                        >
                                            {q.correctAnswers?.includes(opt.label) ? <CheckCircle2 size={16} /> : <span className="text-xs lg:text-sm font-bold">{opt.label}</span>}
                                        </button>
                                        <input 
                                            className="flex-1 bg-transparent border-b-2 border-transparent focus:border-slate-950 py-1.5 lg:py-2 text-sm lg:text-lg font-bold text-slate-900 transition-all focus:outline-none placeholder:text-slate-200"
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
                                            className="p-1.5 text-slate-200 hover:text-red-500 opacity-0 group-hover/option:opacity-100 transition-all"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                                
                                <button 
                                    onClick={() => addOption(qIdx)}
                                    className="flex items-center gap-2 text-[10px] lg:text-sm font-black text-slate-400 hover:text-slate-950 transition-colors py-3 lg:pl-14"
                                >
                                    <Plus size={16} /> Add another option
                                </button>

                                <div className="mt-4 lg:mt-6 lg:pl-14">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <AlertCircle size={12} className="text-slate-400" />
                                        <label className="text-[8px] lg:text-[10px] font-black uppercase text-slate-400 tracking-widest">Justification / Explanation</label>
                                    </div>
                                    <textarea 
                                        className="w-full bg-slate-50 rounded-xl lg:rounded-2xl p-3 lg:p-4 text-xs lg:text-sm font-medium text-slate-950 placeholder:text-slate-300 focus:outline-none focus:ring-2 ring-slate-100 min-h-[60px] lg:min-h-[80px] resize-none"
                                        placeholder="Explain why this answer is correct..."
                                        value={q.explanation || ''}
                                        onChange={e => updateQuestion(qIdx, { explanation: e.target.value })}
                                    />
                                </div>
                             </div>

                             <div className="flex justify-end gap-2 lg:gap-3 mt-8 lg:mt-12 pt-6 lg:pt-8 border-t border-slate-50 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => removeQuestion(qIdx)}
                                    className="p-2 lg:p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl lg:rounded-2xl transition-all"
                                >
                                    <Trash2 size={18} />
                                </button>
                                <div className="w-[1px] h-8 lg:h-10 bg-slate-100 mx-1 lg:mx-2" />
                                <button className="p-2 lg:p-3 text-slate-400 hover:text-slate-950 hover:bg-slate-50 rounded-xl lg:rounded-2xl transition-all">
                                    <Settings size={18} />
                                </button>
                             </div>
                        </div>
                    ))}

                    <div className="flex flex-col gap-6 lg:gap-8">
                        <button 
                            onClick={addQuestion}
                            className="w-full py-8 lg:py-10 rounded-[2rem] lg:rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center gap-3 lg:gap-4 text-slate-400 hover:bg-white hover:border-slate-950 hover:text-slate-950 transition-all group"
                        >
                            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-slate-950 group-hover:text-white transition-all shadow-xl shadow-slate-50">
                                <Plus size={24} lg:size={32} />
                            </div>
                            <span className="text-sm lg:text-xl font-black font-outfit uppercase tracking-widest">Insert New Question</span>
                        </button>

                        <div className="flex justify-center">
                            <AIHelper onGenerate={(newQs) => setQuestions([...questions, ...newQs])} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default TestBuilder
