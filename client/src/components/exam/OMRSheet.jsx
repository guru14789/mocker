import React from 'react'

/**
 * OMRSheet — Authentic Indian OMR sheet replica.
 *
 * Props:
 *  questions      – array of question objects { correct, marks, negativeMarks }
 *  answers        – array indexed by question index (0-based) giving the selected label ('A'|'B'|'C'|'D'|undefined)
 *  evaluations    – optional object { [idx]: { isCorrect, isWrong, isSkipped, marks, negMarks } }
 *                   when provided, bubbles are coloured correct/wrong and score badges shown
 *  currentIndex   – optional number – question being evaluated right now (renders scanning border)
 *  session        – optional session object { _id }
 *  test           – optional test object { title, organization }
 *  userName       – optional string
 */
export default function OMRSheet({
    questions = [],
    answers = [],
    evaluations = null,
    currentIndex = -1,
    session = null,
    test = null,
    userName = '',
}) {
    const numQ = questions.length

    // Dynamic column count — one column per 40 questions (max 4 visible columns like real OMR)
    const numCols = numQ <= 40 ? 1 : numQ <= 80 ? 2 : numQ <= 120 ? 3 : 4
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
                        </div>
                        <div className="omr-header-cell omr-cell-subject">
                            <span className="omr-label-en">Subject</span>
                            <span className="omr-label-hi">(विषय)</span>
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
                                    You have to mark your answer by completely blackening with black
                                    ball pen to indicate your answer.
                                </p>
                                <p className="omr-example-label">Example :</p>
                                <div className="omr-example-row">
                                    <div className="omr-ex-bubble omr-ex-empty">a</div>
                                    <div className="omr-ex-bubble omr-ex-filled">b</div>
                                    <div className="omr-ex-bubble omr-ex-empty">c</div>
                                    <div className="omr-ex-bubble omr-ex-empty">d</div>
                                </div>
                            </div>

                            <div className="omr-sidebar-section">
                                <p className="omr-sidebar-label">Booklet Series</p>
                                {['A', 'B', 'C', 'D'].map(l => (
                                    <div key={l} className="omr-series-bubble">{l}</div>
                                ))}
                            </div>

                            <div className="omr-sidebar-section">
                                <p className="omr-sidebar-label">OMR SHEET NO.</p>
                                <div className="omr-input-box" />
                            </div>

                            <div className="omr-sidebar-section">
                                <p className="omr-sidebar-label">Booklet Number</p>
                                <div className="omr-input-box" />
                            </div>

                            <div className="omr-sidebar-section omr-name-section">
                                <p className="omr-sidebar-label">NAME</p>
                                <div className="omr-name-value">{userName || ''}</div>
                            </div>

                            <div className="omr-sidebar-section">
                                <p className="omr-sidebar-label">SESSION</p>
                                <div className="omr-session-id">{session?._id?.slice(-8).toUpperCase() || '——'}</div>
                            </div>

                            <div className="omr-sidebar-section omr-sig-section">
                                <p className="omr-sidebar-label">SIGNATURE OF<br />INVIGILATOR</p>
                                <div className="omr-sig-box" />
                            </div>
                        </div>

                        {/* QUESTION COLUMNS */}
                        <div className="omr-question-area" style={{ gridTemplateColumns: `repeat(${numCols}, 1fr)` }}>
                            {columns.map((col, ci) => (
                                <div key={ci} className="omr-question-col">
                                    <div className="omr-col-header">
                                        <span className="omr-col-qno">Q</span>
                                        <span className="omr-col-bubbles">Ⓐ Ⓑ Ⓒ Ⓓ</span>
                                        {evaluations && <span className="omr-col-marks">Marks</span>}
                                    </div>

                                    {groupOf5(col).map((group, gi) => (
                                        <div key={gi} className={`omr-group ${gi % 2 === 0 ? 'omr-group-white' : 'omr-group-pink'}`}>
                                            {group.map(({ q, idx }) => {
                                                const isActive = idx === currentIndex
                                                const ev = evaluations?.[idx]
                                                const isAnalyzed = ev !== undefined
                                                const userAnswer = answers[idx]

                                                return (
                                                    <div key={idx} className={`omr-row ${isActive ? 'omr-row-active' : ''}`}>
                                                        {isActive && <div className="omr-scan-border" />}

                                                        <span className="omr-qnum">{idx + 1}</span>

                                                        <div className="omr-bubbles">
                                                            {['A', 'B', 'C', 'D'].map(label => {
                                                                const isUserSelect = userAnswer === label
                                                                const isCorrectLabel = label === q?.correct
                                                                const showResult = isAnalyzed && isUserSelect

                                                                let cls = 'omr-bubble '
                                                                if (showResult && ev?.isCorrect) cls += 'omr-bubble-correct'
                                                                else if (showResult && ev?.isWrong) cls += 'omr-bubble-wrong'
                                                                else if (isAnalyzed && isCorrectLabel && ev?.isWrong) cls += 'omr-bubble-hint'
                                                                else if (!isAnalyzed && isUserSelect) cls += 'omr-bubble-marked'
                                                                else cls += 'omr-bubble-empty'

                                                                return (
                                                                    <div key={label}
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
                            {[...Array(10)].map((_, i) => <div key={i} className="omr-foot-bar" />)}
                        </div>
                        <p className="omr-footer-text">
                            MOCKER OMR • {test?.title || 'OFFICIAL ASSESSMENT'} • DO NOT FOLD OR MUTILATE
                        </p>
                        <div className="omr-footer-marks">
                            {[...Array(10)].map((_, i) => <div key={i} className="omr-foot-bar" />)}
                        </div>
                    </div>
                </div>

                {/* Right timing marks */}
                <div className="omr-timing">
                    {[...Array(32)].map((_, i) => <div key={i} className="omr-timing-bar" />)}
                </div>
            </div>

            <style>{`
                .omr-root { font-family: Arial, sans-serif; background: #e0e0e0; padding: 16px; }
                .omr-wrapper { display: flex; align-items: stretch; box-shadow: 0 8px 40px rgba(0,0,0,0.18); }

                .omr-timing { background: white; padding: 6px 3px; display: flex; flex-direction: column; justify-content: space-between; border: 2px solid #bbb; }
                .omr-timing-bar { width: 16px; height: 7px; background: black; border-radius: 1px; }

                .omr-sheet { background: white; flex: 1; border-top: 2px solid #bbb; border-bottom: 2px solid #bbb; }

                .omr-header-top { display: flex; border-bottom: 2px solid #e87bbf; }
                .omr-header-cell { border-right: 1.5px solid #e87bbf; padding: 6px 8px; display: flex; flex-direction: column; gap: 2px; }
                .omr-cell-centre { flex: 1.2; }
                .omr-cell-subject { flex: 1.2; }
                .omr-cell-subcode { flex: 1; }
                .omr-cell-rollno { flex: 2.5; }
                .omr-label-en { font-size: 9px; font-weight: 900; color: #c2185b; text-transform: uppercase; letter-spacing: 0.05em; }
                .omr-label-hi { font-size: 8px; color: #c2185b; }

                .omr-subcode-grid { display: flex; gap: 3px; margin-top: 3px; }
                .omr-subcode-col { display: flex; flex-direction: column; gap: 1px; }
                .omr-rollno-grid { display: flex; gap: 3px; margin-top: 3px; }
                .omr-rollno-col { display: flex; flex-direction: column; gap: 1px; align-items: center; }
                .omr-rollno-box { width: 14px; height: 12px; border: 1px solid #e87bbf; background: #fff8fb; margin-bottom: 2px; }
                .omr-tiny-bubble { width: 13px; height: 13px; border-radius: 50%; border: 1px solid #e87bbf; display: flex; align-items: center; justify-content: center; font-size: 6px; font-weight: 900; color: #c2185b; }

                .omr-body { display: flex; }

                .omr-sidebar { width: 130px; border-right: 2px solid #e87bbf; display: flex; flex-direction: column; flex-shrink: 0; }
                .omr-sidebar-note { padding: 6px 8px; border-bottom: 1.5px solid #e87bbf; background: white; }
                .omr-note-title { font-size: 8px; font-weight: 900; color: #333; margin-bottom: 2px; }
                .omr-note-text { font-size: 7px; color: #555; line-height: 1.4; margin-bottom: 4px; }
                .omr-example-label { font-size: 7px; font-weight: 900; color: #333; margin-bottom: 3px; }
                .omr-example-row { display: flex; gap: 4px; }
                .omr-ex-bubble { width: 16px; height: 16px; border-radius: 50%; border: 1.5px solid #e87bbf; display: flex; align-items: center; justify-content: center; font-size: 7px; font-weight: 900; color: #c2185b; }
                .omr-ex-filled { background: #c2185b; color: white; border-color: #c2185b; }
                .omr-ex-empty { background: white; }

                .omr-sidebar-section { padding: 6px 8px; border-bottom: 1.5px solid #e87bbf; }
                .omr-sidebar-label { font-size: 7.5px; font-weight: 900; color: #c2185b; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 4px; }
                .omr-series-bubble { width: 24px; height: 24px; border-radius: 50%; border: 2px solid #e87bbf; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 900; color: #c2185b; margin-bottom: 4px; }
                .omr-input-box { height: 22px; border: 1.5px solid #e87bbf; background: white; border-radius: 2px; }
                .omr-name-section { flex: 1; }
                .omr-name-value { font-size: 8px; font-weight: 700; color: #333; min-height: 20px; border-bottom: 1px solid #e87bbf; padding-bottom: 2px; }
                .omr-session-id { font-size: 7px; font-family: monospace; font-weight: 700; color: #888; }
                .omr-sig-section { flex: 1; }
                .omr-sig-box { height: 40px; border: 1.5px solid #e87bbf; margin-top: 4px; }

                .omr-question-area { flex: 1; display: grid; }
                .omr-question-col { border-right: 1.5px solid #e87bbf; }
                .omr-question-col:last-child { border-right: none; }

                .omr-col-header { display: flex; align-items: center; padding: 3px 4px; border-bottom: 1.5px solid #e87bbf; background: #fff0f7; gap: 4px; }
                .omr-col-qno { font-size: 7px; font-weight: 900; color: #c2185b; width: 16px; }
                .omr-col-bubbles { flex: 1; font-size: 7px; font-weight: 700; color: #c2185b; text-align: center; letter-spacing: 1px; }
                .omr-col-marks { font-size: 7px; font-weight: 900; color: #c2185b; width: 32px; text-align: right; }

                .omr-group { display: flex; flex-direction: column; }
                .omr-group-white { background: white; }
                .omr-group-pink { background: #fde8f2; }

                .omr-row { display: flex; align-items: center; padding: 2px 4px; position: relative; height: 18px; border-bottom: 0.5px solid #f5c6e0; }
                .omr-row:last-child { border-bottom: none; }
                .omr-row-active { outline: 1.5px solid #6366f1; outline-offset: -1px; z-index: 2; background: rgba(99,102,241,0.07) !important; }
                .omr-scan-border { position: absolute; inset: 0; border: 1.5px solid #6366f1; pointer-events: none; z-index: 5; }
                .omr-qnum { font-size: 8px; font-weight: 900; color: #c2185b; width: 18px; flex-shrink: 0; }

                .omr-bubbles { display: flex; gap: 3px; flex: 1; justify-content: center; }
                .omr-bubble { width: 13px; height: 13px; border-radius: 50%; border: 1px solid #e87bbf; display: flex; align-items: center; justify-content: center; font-size: 6.5px; font-weight: 900; color: #c2185b; transition: all 0.15s; flex-shrink: 0; }
                .omr-bubble-empty { background: white; }
                .omr-bubble-marked { background: #c2185b; color: white; border-color: #c2185b; }
                .omr-bubble-correct { background: #16a34a; color: white; border-color: #16a34a; }
                .omr-bubble-wrong { background: #dc2626; color: white; border-color: #dc2626; }
                .omr-bubble-hint { background: #dcfce7; color: #16a34a; border-color: #16a34a; }

                .omr-score-badge { width: 28px; text-align: right; flex-shrink: 0; }
                .omr-score-correct { font-size: 8px; font-weight: 900; color: #16a34a; }
                .omr-score-wrong { font-size: 8px; font-weight: 900; color: #dc2626; }
                .omr-score-skip { font-size: 8px; font-weight: 900; color: #94a3b8; }

                .omr-footer { border-top: 2px solid #e87bbf; display: flex; justify-content: space-between; align-items: center; padding: 4px 8px; background: #fff8fb; }
                .omr-footer-marks { display: flex; gap: 2px; }
                .omr-foot-bar { width: 8px; height: 8px; background: #c2185b; }
                .omr-footer-text { font-size: 7px; font-weight: 900; color: #c2185b; letter-spacing: 0.08em; text-transform: uppercase; opacity: 0.7; font-style: italic; }
            `}</style>
        </div>
    )
}
