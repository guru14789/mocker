import React, { useEffect, useRef, useState } from 'react'

export function SecureQuestionRenderer({ question, questionNumber, selectedOption, onSelect }) {
    const canvasRef = useRef(null)
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setIsReady(true), 100)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        if (!isReady || !question) return

        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const width = 700
        const height = 500
        canvas.width = width
        canvas.height = height

        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, width, height)

        ctx.fillStyle = '#0F172A'
        ctx.font = 'bold 14px system-ui'
        ctx.fillText(`QUESTION ${questionNumber} / ${question.marks} MARKS`, 20, 30)

        ctx.font = 'bold 20px system-ui'
        ctx.fillText(question.questionText || 'Question text', 20, 60)

        ctx.font = '16px system-ui'
        question.options.forEach((opt, idx) => {
            const y = 120 + idx * 60
            const isSelected = selectedOption === opt.label

            if (isSelected) {
                ctx.fillStyle = '#0F172A'
                ctx.fillRect(20, y - 25, width - 40, 50)
                ctx.fillStyle = '#ffffff'
                ctx.fillText(`${opt.label}. ${opt.text}`, 40, y + 5)
            } else {
                ctx.fillStyle = '#f1f5f9'
                ctx.strokeStyle = '#e2e8f0'
                ctx.lineWidth = 2
                ctx.fillRect(20, y - 25, width - 40, 50)
                ctx.strokeRect(20, y - 25, width - 40, 50)
                ctx.fillStyle = '#475569'
                ctx.fillText(`${opt.label}. ${opt.text}`, 40, y + 5)
            }
        })
    }, [question, questionNumber, selectedOption, isReady])

    const handleClick = (e) => {
        if (!question) return
        const canvas = canvasRef.current
        const rect = canvas.getBoundingClientRect()
        const scaleY = canvas.height / rect.height
        const canvasY = (e.clientY - rect.top) * scaleY

        // Hit detection matching the rendering logic (120 + idx * 60)
        question.options.forEach((opt, idx) => {
            const centerY = 120 + idx * 60
            const top = centerY - 25
            const bottom = centerY + 25
            
            if (canvasY >= top && canvasY <= bottom) {
                onSelect(opt.label)
            }
        })
    }

    if (!question) {
        return (
            <div className="w-full h-96 flex items-center justify-center text-slate-400">
                Loading question...
            </div>
        )
    }

    return (
        <div className="w-full select-none" style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
            <canvas
                ref={canvasRef}
                onClick={handleClick}
                style={{ cursor: 'pointer', borderRadius: '16px', display: 'block', width: '100%', maxWidth: '700px' }}
            />
        </div>
    )
}