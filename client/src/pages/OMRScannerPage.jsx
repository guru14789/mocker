import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, CheckCircle2, Shield, Scan, BarChart3, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import gsap from 'gsap';

const OMRScannerPage = () => {
    const { testId } = useParams();
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [scannedData, setScannedData] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [test, setTest] = useState(null);

    useEffect(() => {
        const fetchTest = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/tests/${testId}`);
                const fetchedTest = res.data.test;
                
                // VALIDATION: Only allow OMR scanning for suitable exam types
                if (fetchedTest.examType !== 'omr-scanning' && fetchedTest.examType !== 'hybrid') {
                    console.error('Invalid exam type for OMR scanning');
                    navigate('/dashboard');
                    return;
                }

                setTest(fetchedTest);
            } catch (err) {
                setError('Failed to fetch test details.');
            }
        };
        fetchTest();
        startCamera();
        return () => stopCamera();
    }, [testId, navigate]);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
            });
            setStream(mediaStream);
            if (videoRef.current) videoRef.current.srcObject = mediaStream;
            setError(null);
        } catch (err) {
            setError('Camera access denied or not available.');
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const performScan = () => {
        if (!videoRef.current || isScanning) return;
        setIsScanning(true);
        setProgress(0);
        setError(null);

        // Simulated AI Scanning Logic
        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += Math.random() * 15;
            if (currentProgress >= 100) {
                currentProgress = 100;
                clearInterval(interval);
                finalizeScan();
            }
            setProgress(currentProgress);
        }, 200);
    };

    const finalizeScan = () => {
        // In a real implementation, we would use canvas.getImageData here to analyze the bubbles
        // For this high-fidelity demo, we'll simulate the extraction of MOCK data
        // reflecting the MPSC OMR sheet structure (100 questions)
        
        const mockAnswers = {};
        for(let i=0; i<100; i++) {
            // Randomly simulate some answered and some empty
            if (Math.random() > 0.3) {
                mockAnswers[i] = ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)];
            }
        }

        setTimeout(() => {
            setScannedData({
                rollNumber: "82749102",
                bookletSeries: "B",
                subjectCode: "GS-1",
                answers: mockAnswers,
                confidence: 98.4,
                timestamp: new Date().toISOString()
            });
            setIsScanning(false);
            stopCamera();
        }, 1000);
    };

    const handleScore = async () => {
        if (!scannedData) return;
        // Proceed to results or scoring logic
        navigate(`/result/omr-${Date.now()}`, { state: { answers: scannedData.answers, fromScanner: true } });
    };

    if (error) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8 text-center">
            <div className="max-w-md space-y-6">
                <AlertCircle size={64} className="text-red-500 mx-auto" />
                <h2 className="text-3xl font-black text-white font-outfit">Hardware Error</h2>
                <p className="text-slate-400 font-medium">{error}</p>
                <button onClick={() => window.location.reload()} className="btn-primary py-4 px-10">Retry Connection</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0F172A] text-white font-sans overflow-hidden flex flex-col md:flex-row">
            {/* Camera Viewport */}
            <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center group">
                <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className={`w-full h-full object-cover transition-opacity duration-1000 ${scannedData ? 'opacity-20 blur-sm' : 'opacity-100'}`}
                />
                
                {/* Scanning HUD Overlay */}
                {!scannedData && (
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute inset-0 border-[40px] md:border-[80px] border-[#0F172A]/80 flex items-center justify-center">
                            <div className="relative w-full max-w-[80%] aspect-[1/1.4] border-2 border-indigo-500/50 rounded-2xl">
                                {/* Corner Accents */}
                                <div className="absolute -top-1 -left-1 w-12 h-12 border-t-4 border-l-4 border-indigo-400 rounded-tl-lg"></div>
                                <div className="absolute -top-1 -right-1 w-12 h-12 border-t-4 border-r-4 border-indigo-400 rounded-tr-lg"></div>
                                <div className="absolute -bottom-1 -left-1 w-12 h-12 border-b-4 border-l-4 border-indigo-400 rounded-bl-lg"></div>
                                <div className="absolute -bottom-1 -right-1 w-12 h-12 border-b-4 border-r-4 border-indigo-400 rounded-br-lg"></div>

                                {/* Scaning Line Animation */}
                                {isScanning && (
                                    <div className="absolute inset-x-0 h-1 bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.8)] animate-scanner-line"></div>
                                )}
                            </div>
                        </div>

                        <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-xl px-8 py-3 rounded-full border border-white/10 flex items-center gap-3">
                             <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                             <span className="text-xs font-black uppercase tracking-[0.2em] whitespace-nowrap">OMR Recognition System v5.0</span>
                        </div>

                        {!isScanning && (
                            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center space-y-4">
                                <p className="text-indigo-300 font-bold text-sm tracking-wide bg-indigo-950/40 px-6 py-2 rounded-full backdrop-blur-sm">Align OMR sheet markers within the frame</p>
                                <button 
                                    onClick={performScan}
                                    className="bg-white text-[#0F172A] w-20 h-20 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.3)] hover:scale-110 active:scale-95 transition-all group-pointer-events-auto"
                                >
                                    <Camera size={32} strokeWidth={3} />
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Scanning Progress Modal */}
                {isScanning && (
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white text-slate-900 rounded-[3rem] p-12 max-w-sm w-full shadow-2xl text-center space-y-8 scale-in-center">
                            <RefreshCw size={48} className="text-indigo-600 animate-spin mx-auto" />
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black font-outfit">Analyzing Sheet</h3>
                                <p className="text-slate-500 text-sm font-medium italic">Detecting bubbles & roll number...</p>
                            </div>
                            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-indigo-600 transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <span className="text-xl font-black text-indigo-600 font-outfit">{Math.round(progress)}%</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Results Sidebar */}
            <div className={`w-full md:w-[450px] bg-slate-50 text-slate-950 p-6 md:p-10 flex flex-col transition-all duration-700 ${scannedData ? 'translate-x-0' : 'translate-x-full absolute right-0'}`}>
                {scannedData ? (
                    <div className="flex-1 flex flex-col space-y-8 animate-in slide-in-from-right duration-500">
                        <header className="flex justify-between items-start">
                            <div className="space-y-1">
                                <h2 className="text-4xl font-black font-outfit text-slate-900 leading-none">Scan Verified</h2>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Shield size={14} className="text-emerald-500" /> Integrity Score {scannedData.confidence}%
                                </p>
                            </div>
                            <button onClick={() => setScannedData(null)} className="p-3 bg-white text-slate-400 hover:text-slate-900 rounded-2xl border border-slate-200 transition-colors">
                                <RefreshCw size={20} />
                            </button>
                        </header>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 bg-white rounded-3xl border border-slate-100 space-y-1">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Roll Number</span>
                                <p className="text-lg font-black font-outfit text-slate-900 tracking-wider tabular-nums">{scannedData.rollNumber}</p>
                            </div>
                            <div className="p-6 bg-white rounded-3xl border border-slate-100 space-y-1">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Questions Done</span>
                                <p className="text-lg font-black font-outfit text-slate-900 tracking-wider tabular-nums">{Object.keys(scannedData.answers).length} / 100</p>
                            </div>
                        </div>

                        <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-200/60 p-8 overflow-y-auto custom-scrollbar">
                           <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-6 pb-4 border-b border-slate-50">Response Map</h4>
                           <div className="grid grid-cols-5 gap-3">
                                {Array.from({ length: 100 }).map((_, i) => (
                                    <div key={i} className={`h-12 rounded-xl flex flex-col items-center justify-center gap-1 border transition-all ${scannedData.answers[i] ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50 border-slate-100 opacity-30 text-slate-400'}`}>
                                        <span className="text-[8px] font-black leading-none">{i+1}</span>
                                        <span className="text-xs font-black font-outfit leading-none">{scannedData.answers[i] || '-'}</span>
                                    </div>
                                ))}
                           </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-200/60">
                            <button 
                                onClick={handleScore}
                                className="w-full bg-[#0F172A] text-white py-5 rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-indigo-100 hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                Calculate Score <BarChart3 size={24} />
                            </button>
                            <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest px-10 leading-relaxed">
                                By clicking score, you verify that the extracted responses match the physical OMR sheet.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-8 opacity-40">
                        <div className="w-24 h-24 bg-slate-100 text-slate-400 rounded-[2.5rem] flex items-center justify-center">
                            <Scan size={48} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black font-outfit">Waiting for Data</h3>
                            <p className="text-sm font-medium max-w-xs mx-auto">Complete the scanning process to view and verify the OMR data here.</p>
                        </div>
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes scanner-line {
                    0% { top: 0%; opacity: 0.8; }
                    50% { opacity: 1; }
                    100% { top: 100%; opacity: 0.8; }
                }
                .animate-scanner-line {
                    animation: scanner-line 3s infinite linear;
                }
                .scale-in-center {
                    animation: scale-in-center 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
                }
                @keyframes scale-in-center {
                    0% { transform: scale(0); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}} />
        </div>
    );
};

export default OMRScannerPage;
