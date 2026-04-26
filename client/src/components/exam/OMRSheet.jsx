import React from 'react'
import { QRCodeSVG } from 'qrcode.react'

/**
 * OMRSheet — Authentic Indian OMR sheet replica.
 */
export default function OMRSheet({
    questions = [],
    answers = [],
    evaluations = null,
    currentIndex = -1,
    session = null,
    test = null,
    userName = '',
    onSelect = null, // Optional callback for interaction
}) {
    const numQ = questions.length || 0
    const maxOptions = 5 // Supported up to E

    // Dynamic column count — one column per 35 questions
    const numCols = numQ <= 35 ? 1 : numQ <= 70 ? 2 : numQ <= 105 ? 3 : 4
    const perCol = Math.ceil(numQ / numCols)

    const columns = Array.from({ length: numCols }, (_, c) =>
        questions.slice(c * perCol, (c + 1) * perCol).map((q, i) => ({ q, idx: c * perCol + i }))
    )

    const groupOf5 = (arr) => {
        const groups = []
        for (let i = 0; i < arr.length; i += 5) groups.push(arr.slice(i, i + 5))
        return groups
    }

    const ScoreBadge = ({ idx }) => {
        const ev = evaluations?.[idx]
        if (!ev) return null
        if (ev.isSkipped) return <span className="omr-score-skip">—</span>
        if (ev.isCorrect) return <span className="omr-score-correct">+{ev.marks}</span>
        if (ev.negMarks > 0) return <span className="omr-score-wrong">−{ev.negMarks}</span>
        return <span className="omr-score-wrong">✗</span>
    }

    const options = ['A', 'B', 'C', 'D', 'E']

    return (
        <div className="omr-root">
            <div className="omr-wrapper">

                {/* Left timing marks */}
                <div className="omr-timing">
                    {[...Array(32)].map((_, i) => <div key={i} className="omr-timing-bar" />)}
                </div>

                {/* ── Main sheet ── */}
                <div className="omr-sheet">

                    {/* TOP HEADER ROW */}
                    <div className="omr-header-top">
                        <div className="omr-header-cell omr-cell-centre">
                            <span className="omr-label-en">Centre</span>
                            <span className="omr-label-hi">(केन्द्र)</span>
                            <div className="omr-input-box mt-1" />
                        </div>
                        <div className="omr-header-cell omr-cell-subject">
                            <span className="omr-label-en">Subject</span>
                            <span className="omr-label-hi">(विषय)</span>
                            <div className="text-[10px] font-black mt-1 text-slate-700 truncate">{test?.title || 'GENERAL'}</div>
                        </div>
                        <div className="omr-header-cell omr-cell-subcode">
                            <span className="omr-label-en">Sub Code</span>
                            <span className="omr-label-hi">(विषय कोड)</span>
                            <div className="omr-subcode-grid">
                                {[0, 1].map(col => (
                                    <div key={col} className="omr-subcode-col">
                                        {[...Array(10)].map((_, r) => (
                                            <div key={r} className="omr-tiny-bubble">{r}</div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="omr-header-cell omr-cell-rollno">
                            <span className="omr-label-en">Roll Number</span>
                            <span className="omr-label-hi">(अनुक्रमांक)</span>
                            <div className="omr-rollno-grid">
                                {[...Array(6)].map((_, col) => (
                                    <div key={col} className="omr-rollno-col">
                                        <div className="omr-rollno-box" />
                                        {[...Array(10)].map((_, r) => (
                                            <div key={r} className="omr-tiny-bubble">{r}</div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* BODY: left sidebar + question columns */}
                    <div className="omr-body">

                        {/* LEFT SIDEBAR */}
                        <div className="omr-sidebar">
                            <div className="omr-sidebar-note">
                                <p className="omr-note-title">Note :</p>
                                <p className="omr-note-text">
                                    Mark your answer by completely blackening with black ball pen.
                                </p>
                                <div className="omr-example-row">
                                    <div className="omr-ex-bubble omr-ex-empty">A</div>
                                    <div className="omr-ex-bubble omr-ex-filled">B</div>
                                    <div className="omr-ex-bubble omr-ex-empty">C</div>
                                </div>
                            </div>

                            <div className="omr-sidebar-section">
                                <p className="omr-sidebar-label">Booklet Series</p>
                                <div className="flex gap-1.5">
                                    {['A', 'B', 'C', 'D'].map(l => (
                                        <div key={l} className="omr-series-bubble">{l}</div>
                                    ))}
                                </div>
                            </div>

                            <div className="omr-sidebar-section flex items-center justify-center py-4">
                                <div className="bg-white p-2 border border-slate-200 rounded-lg shadow-sm">
                                    <QRCodeSVG value={`https://mocker.ai/verify/${session?._id || 'demo'}`} size={64} level="H" />
                                    <p className="text-[5px] text-center mt-1 font-black opacity-40">SCAN TO VERIFY</p>
                                </div>
                            </div>

                            <div className="omr-sidebar-section">
                                <p className="omr-sidebar-label">NAME</p>
                                <div className="omr-name-value truncate">{userName || '________________'}</div>
                            </div>

                            <div className="omr-sidebar-section">
                                <p className="omr-sidebar-label">INVIGILATOR SIGN</p>
                                <div className="omr-sig-box" />
                            </div>
                            
                            <div className="omr-sidebar-section border-none">
                                <p className="omr-sidebar-label">CANDIDATE SIGN</p>
                                <div className="omr-sig-box" />
                            </div>
                        </div>

                        {/* QUESTION COLUMNS */}
                        <div className="omr-question-area" style={{ gridTemplateColumns: `repeat(${numCols}, 1fr)` }}>
                            {columns.map((col, ci) => (
                                <div key={ci} className="omr-question-col">
                                    <div className="omr-col-header">
                                        <span className="omr-col-qno">Q.No</span>
                                        <span className="omr-col-bubbles">RESPONSE</span>
                                        {evaluations && <span className="omr-col-marks">Score</span>}
                                    </div>

                                    {groupOf5(col).map((group, gi) => (
                                        <div key={gi} className={`omr-group ${gi % 2 === 0 ? 'omr-group-white' : 'omr-group-pink'}`}>
                                            {group.map(({ q, idx }) => {
                                                const isActive = idx === currentIndex
                                                const ev = evaluations?.[idx]
                                                const isAnalyzed = ev !== undefined
                                                const userAnswer = answers[idx]
                                                const numOptionsForQ = q?.options?.length || 4

                                                return (
                                                    <div key={idx} 
                                                        onClick={() => onSelect && onSelect(idx)}
                                                        className={`omr-row ${isActive ? 'omr-row-active' : ''} cursor-pointer`}>
                                                        {isActive && <div className="omr-scan-border" />}

                                                        <span className="omr-qnum">{idx + 1}</span>

                                                        <div className="omr-bubbles">
                                                            {options.map((label, optIdx) => {
                                                                const isUserSelect = userAnswer === label
                                                                const isCorrectLabel = label === q?.correct
                                                                const showResult = isAnalyzed && isUserSelect
                                                                const isUnused = optIdx >= numOptionsForQ

                                                                let cls = 'omr-bubble '
                                                                if (isUnused) cls += 'omr-bubble-unused '
                                                                
                                                                if (showResult && ev?.isCorrect) cls += 'omr-bubble-correct'
                                                                else if (showResult && ev?.isWrong) cls += 'omr-bubble-wrong'
                                                                else if (isAnalyzed && isCorrectLabel && ev?.isWrong) cls += 'omr-bubble-hint'
                                                                else if (!isAnalyzed && isUserSelect) cls += 'omr-bubble-marked'
                                                                else cls += 'omr-bubble-empty'

                                                                return (
                                                                    <div key={label}
                                                                        onClick={(e) => {
                                                                            if (!isAnalyzed && !isUnused && onSelect) {
                                                                                e.stopPropagation();
                                                                                onSelect(idx, label);
                                                                            }
                                                                        }}
                                                                        className={`${cls} qbub-${idx}-${label}`}>
                                                                        {label}
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>

                                                        {evaluations && (
                                                            <div className={`omr-score-badge sbadge-${idx}`}
                                                                style={{ opacity: isAnalyzed ? 1 : 0 }}>
                                                                <ScoreBadge idx={idx} />
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="omr-footer">
                        <div className="omr-footer-marks">
                            {[...Array(6)].map((_, i) => <div key={i} className="omr-foot-bar" />)}
                        </div>
                        <p className="omr-footer-text">
                            OFFICIAL MOCKER OMR • SHEET ID: {session?._id?.slice(-6).toUpperCase() || 'DEBUG'} • {test?.organization || 'MOCKER'}
                        </p>
                        <div className="omr-footer-marks">
                            {[...Array(6)].map((_, i) => <div key={i} className="omr-foot-bar" />)}
                        </div>
                    </div>
                </div>

                {/* Right timing marks */}
                <div className="omr-timing">
                    {[...Array(32)].map((_, i) => <div key={i} className="omr-timing-bar" />)}
                </div>
            </div>

            <style>{`
                .omr-root { font-family: 'Inter', Arial, sans-serif; background: #f1f5f9; padding: 12px; }
                .omr-wrapper { display: flex; align-items: stretch; background: white; border: 1px solid #cbd5e1; }

                .omr-timing { background: white; padding: 4px 2px; display: flex; flex-direction: column; justify-content: space-between; border-right: 1.5px solid #000; border-left: 1.5px solid #000; }
                .omr-timing-bar { width: 12px; height: 6px; background: black; }

                .omr-sheet { background: white; flex: 1; display: flex; flex-direction: column; }

                .omr-header-top { display: flex; border-bottom: 2px solid #e87bbf; background: #fffdfd; }
                .omr-header-cell { border-right: 1px solid #e87bbf; padding: 4px 8px; display: flex; flex-direction: column; }
                .omr-cell-centre { flex: 1; }
                .omr-cell-subject { flex: 1.5; }
                .omr-cell-subcode { flex: 1; }
                .omr-cell-rollno { flex: 2; border-right: none; }
                
                .omr-label-en { font-size: 8px; font-weight: 900; color: #c2185b; text-transform: uppercase; }
                .omr-label-hi { font-size: 7px; color: #c2185b; opacity: 0.7; }

                .omr-subcode-grid, .omr-rollno-grid { display: flex; gap: 2px; margin-top: 2px; }
                .omr-subcode-col, .omr-rollno-col { display: flex; flex-direction: column; gap: 0.5px; align-items: center; }
                .omr-rollno-box { width: 12px; height: 10px; border: 0.5px solid #e87bbf; background: #fff8fb; }
                .omr-tiny-bubble { width: 11px; height: 11px; border-radius: 50%; border: 0.5px solid #e87bbf; display: flex; align-items: center; justify-content: center; font-size: 5px; font-weight: 900; color: #c2185b; }

                .omr-body { display: flex; flex: 1; }

                .omr-sidebar { width: 120px; border-right: 1.5px solid #e87bbf; background: #fffbff; }
                .omr-sidebar-note { padding: 4px 8px; border-bottom: 1px solid #e87bbf; }
                .omr-note-title { font-size: 7px; font-weight: 900; color: #333; }
                .omr-note-text { font-size: 6px; color: #666; line-height: 1.2; margin-top: 2px; }
                .omr-example-row { display: flex; gap: 4px; margin-top: 4px; }
                .omr-ex-bubble { width: 14px; height: 14px; border-radius: 50%; border: 1px solid #e87bbf; display: flex; align-items: center; justify-content: center; font-size: 6px; font-weight: 900; color: #c2185b; }
                .omr-ex-filled { background: #c2185b; color: white; }

                .omr-sidebar-section { padding: 6px 8px; border-bottom: 1px solid #e87bbf; }
                .omr-sidebar-label { font-size: 7px; font-weight: 900; color: #c2185b; margin-bottom: 2px; }
                .omr-series-bubble { width: 18px; height: 18px; border-radius: 50%; border: 1px solid #e87bbf; display: flex; align-items: center; justify-content: center; font-size: 8px; font-weight: 900; color: #c2185b; }
                .omr-input-box { height: 16px; border: 1px solid #e87bbf; background: white; }
                .omr-name-value { font-size: 7.5px; font-weight: 700; color: #333; margin-top: 2px; border-bottom: 0.5px solid #e87bbf; }
                .omr-sig-box { height: 28px; border: 1px solid #e87bbf; margin-top: 2px; background: white; }

                .omr-question-area { flex: 1; display: grid; }
                .omr-question-col { border-right: 1px solid #e87bbf; }
                .omr-question-col:last-child { border-right: none; }

                .omr-col-header { display: flex; align-items: center; padding: 2px 4px; border-bottom: 1px solid #e87bbf; background: #fff0f7; }
                .omr-col-qno { font-size: 6px; font-weight: 900; color: #c2185b; width: 20px; }
                .omr-col-bubbles { flex: 1; font-size: 6px; font-weight: 900; color: #c2185b; text-align: center; letter-spacing: 2px; }
                .omr-col-marks { font-size: 6px; font-weight: 900; color: #c2185b; width: 30px; text-align: right; }

                .omr-group { display: flex; flex-direction: column; }
                .omr-group-white { background: white; }
                .omr-group-pink { background: #fff9fc; }

                .omr-row { display: flex; align-items: center; padding: 2px 4px; position: relative; height: 16px; border-bottom: 0.2px solid #fce7f3; }
                .omr-row-active { background: #eff6ff !important; }
                .omr-scan-border { position: absolute; inset: 0; border: 1px solid #3b82f6; pointer-events: none; }
                .omr-qnum { font-size: 7px; font-weight: 900; color: #c2185b; width: 20px; }

                .omr-bubbles { display: flex; gap: 4px; flex: 1; justify-content: center; }
                .omr-bubble { width: 12px; height: 12px; border-radius: 50%; border: 0.8px solid #e87bbf; display: flex; align-items: center; justify-content: center; font-size: 6px; font-weight: 900; color: #c2185b; cursor: pointer; transition: 0.1s; }
                .omr-bubble-marked { background: #c2185b; color: white; }
                .omr-bubble-correct { background: #16a34a; color: white; border-color: #16a34a; }
                .omr-bubble-wrong { background: #dc2626; color: white; border-color: #dc2626; }
                .omr-bubble-hint { border-color: #16a34a; color: #16a34a; background: #f0fdf4; }
                .omr-bubble-unused { opacity: 0.15; pointer-events: none; border-style: dashed; }

                .omr-score-badge { width: 30px; text-align: right; font-size: 7px; font-weight: 900; }
                .omr-score-correct { color: #16a34a; }
                .omr-score-wrong { color: #dc2626; }
                .omr-score-skip { color: #94a3b8; }

                .omr-footer { border-top: 1.5px solid #e87bbf; display: flex; justify-content: space-between; align-items: center; padding: 4px 8px; background: #fff8fb; }
                .omr-footer-marks { display: flex; gap: 2px; }
                .omr-foot-bar { width: 10px; height: 4px; background: #c2185b; }
                .omr-footer-text { font-size: 6px; font-weight: 900; color: #c2185b; opacity: 0.6; }
            `}</style>
        </div>
    )
}
