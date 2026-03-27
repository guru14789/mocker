import React from 'react';
const OPTIONS = ['A', 'B', 'C', 'D'];

export const OMRSheet = ({ questions, answers, onSelect, currentQ }) => {
  return (
    <div className="p-8 space-y-3">
      {questions.map((q, index) => (
        <div
          key={q._id || index}
          className={`flex items-center gap-6 p-4 rounded-2xl transition-all duration-300
            ${index === currentQ ? 'bg-slate-900 text-white shadow-xl translate-x-1 outline outline-slate-100 outline-offset-4 scale-105 z-10' : 'bg-white border border-slate-50 hover:bg-slate-50'}`}
        >
          <span className={`text-xs font-black w-6 text-center shrink-0 ${index === currentQ ? 'text-white' : 'text-slate-400'}`}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="flex gap-3">
            {OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => onSelect(index, opt)}
                className={`w-10 h-10 rounded-full border-2 text-xs font-black transition-all duration-200
                  ${answers[index] === opt
                    ? (index === currentQ ? 'bg-white border-white text-slate-900 rotate-12 scale-110 shadow-lg' : 'bg-slate-900 border-slate-900 text-white shadow-md active:scale-95')
                    : (index === currentQ ? 'border-indigo-500/50 text-indigo-200 hover:border-white hover:text-white' : 'border-slate-100 text-slate-300 hover:border-slate-400 hover:text-slate-950')
                  }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
