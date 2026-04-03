import React from 'react';
import { Printer, Download, ChevronLeft } from 'lucide-react';

export const OMRSheetGenerator = ({ test, questions, onBack }) => {
  const printSheet = () => {
    window.print();
  };

  // Helper to split questions into columns of 35
  const getQuestionByNumber = (n) => {
    return questions[n - 1] || { _id: `q${n}` }; // Real question or placeholder
  };

  const renderQuestionBlock = (start, end) => {
    const rows = [];
    for (let i = start; i <= end; i += 5) {
      rows.push(
        <div key={i} className="flex flex-col border border-[#d81b60] p-[1.5px] mb-[3px] bg-white">
           <div className="grid grid-cols-[10px_1fr] text-[5px] font-bold border-b border-[#ffd1dc] mb-[1px] opacity-60">
              <div></div>
              <div className="flex justify-around"><span>1</span><span>2</span><span>3</span><span>4</span></div>
           </div>
           {[0, 1, 2, 3, 4].map(offset => {
             const qNum = i + offset;
             if (qNum > end) return null;
             return (
               <div key={qNum} className="grid grid-cols-[12px_1fr] items-center h-[14px]">
                 <span className="text-[7px] font-black">{qNum}</span>
                 <div className="flex justify-around">
                   {[1, 2, 3, 4].map(opt => (
                     <div key={opt} className="w-[11px] h-[11px] rounded-full border border-[#d81b60] flex items-center justify-center text-[5.5px] font-bold leading-none">
                       {opt}
                     </div>
                   ))}
                 </div>
               </div>
             );
           })}
        </div>
      );
    }
    return rows;
  };

  return (
    <div className="min-h-screen bg-slate-200 p-4 font-sans print:bg-white print:p-0">
      <header className="max-w-[1000px] mx-auto mb-6 flex justify-between items-center print:hidden">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-700 hover:text-black font-black transition-all bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">
          <ChevronLeft size={20} /> Back to Dashboard
        </button>
        <div className="flex gap-4">
          <button onClick={printSheet} className="px-10 py-4 bg-[#e91e63] text-white rounded-2xl font-black flex items-center gap-2 shadow-2xl shadow-pink-200 hover:scale-105 active:scale-95 transition-all">
            <Printer size={22} /> Print Official OMR
          </button>
        </div>
      </header>

      <div className="max-w-[210mm] mx-auto bg-white shadow-2xl print:shadow-none min-h-[297mm] p-6 border-[3px] border-[#d81b60] print:border-[#d81b60] relative overflow-hidden text-[#d81b60] select-none">
        
        {/* TOP HEADER SECTION */}
        <div className="border-[1.5px] border-[#d81b60] mb-3">
          <div className="bg-[#fff0f3] border-b border-[#d81b60] py-1.5 text-center">
            <h1 className="text-xl font-[900] tracking-[0.2em] uppercase leading-tight">MAHARASHTRA PUBLIC SERVICE COMMISSION</h1>
            <p className="text-[9px] font-black tracking-widest mt-0.5">ANSWER SHEET - PART - 1</p>
          </div>
          <div className="flex text-[7.5px] font-black border-b border-[#d81b60] bg-white">
             <div className="flex-1 py-1.5 px-3 border-r border-[#d81b60]">IMPORTANT INSTRUCTIONS : PLEASE READ ALL THE INSTRUCTIONS ON LAST PAGE CAREFULLY BEFORE WRITING</div>
             <div className="w-[180px] flex items-center justify-center bg-[#fff0f3] font-black tracking-widest uppercase border-r border-[#d81b60]">ANNWER SHEET NUMBER</div>
             <div className="flex-1"></div>
          </div>
          <div className="bg-[#fff0f3] py-1 px-2 text-[8.5px] font-[900] uppercase text-center border-b border-[#d81b60] tracking-[0.1em]">
            TO BE FILLED AND ENCODED BY THE CANDIDATE
          </div>
          <div className="py-4 px-6 flex items-center gap-4 bg-white">
             <span className="text-[11px] font-[900] whitespace-nowrap">NAME OF THE EXAMINATION :</span>
             <div className="flex-1 border-b-[1.5px] border-dotted border-[#d81b60] h-6 text-sm font-black text-slate-900 px-3 uppercase tracking-wider relative bottom-1">
                {test.title}
             </div>
          </div>
        </div>

        {/* MIDDLE METADATA SECTION */}
        <div className="grid grid-cols-[200px_40px_1fr_170px] gap-3 mb-4 h-[190px]">
          {/* Roll Number */}
          <div className="border-[1.5px] border-[#d81b60] flex flex-col bg-white">
            <div className="bg-[#fff0f3] text-[9px] font-[900] py-1 text-center border-b border-[#d81b60] tracking-widest uppercase">ROLL NUMBER</div>
            <div className="flex-1 flex p-1 gap-[1px]">
               {[...Array(8)].map((_, col) => (
                 <div key={col} className="flex-1 flex flex-col gap-[0.5px] border-[0.5px] border-[#ffd1dc]">
                    <div className="h-[18px] border-b border-[#ffd1dc] bg-slate-50"></div>
                    {[...Array(10)].map((_, row) => (
                      <div key={row} className="flex-1 flex items-center justify-center">
                        <div className="w-[13px] h-[13px] rounded-full border border-[#d81b60] text-[6.5px] flex items-center justify-center font-[900] bg-white leading-none">
                           {row}
                        </div>
                      </div>
                    ))}
                 </div>
               ))}
            </div>
          </div>

          {/* Barcode */}
          <div className="flex items-center justify-center px-1">
             <div className="w-full h-[150px] flex flex-col gap-[1px]">
                {[...Array(50)].map((_, i) => (
                  <div key={i} className="bg-slate-950 w-full" style={{ height: `${[1,2,4,1,3,2,1][i%7]}px`, opacity: 0.9 }}></div>
                ))}
             </div>
          </div>

          {/* Booklet & series & Subject */}
          <div className="flex flex-col gap-3">
            <div className="border-[1.5px] border-[#d81b60] h-[75px] flex flex-col bg-white">
               <div className="bg-[#fff0f3] text-[8.5px] font-[900] py-1 text-center border-b border-[#d81b60] uppercase tracking-widest">Question Booklet Number</div>
               <div className="flex-1 flex px-3 items-center justify-center gap-1.5">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-6 h-6 border-[1.5px] border-[#d81b60] bg-slate-50"></div>
                  ))}
               </div>
            </div>
            <div className="flex gap-3 flex-1">
              <div className="border-[1.5px] border-[#d81b60] flex-1 flex flex-col bg-white">
                <div className="bg-[#fff0f3] text-[7.5px] font-[900] py-1 text-center border-b border-[#d81b60] leading-none uppercase px-1">QUESTION BOOKLET SERIES (संच)<br/><span className="text-[6px] font-bold lowercase">[To be filled by Candidate]</span></div>
                <div className="flex-1 flex items-center justify-around px-2">
                  <div className="w-6 h-6 border-[1.5px] border-[#d81b60] bg-slate-50"></div>
                  <div className="flex gap-2">
                    {['A', 'B', 'C', 'D'].map(l => (
                      <div key={l} className="flex flex-col items-center gap-[1px]">
                        <span className="text-[6.5px] font-[900] uppercase">{l}</span>
                        <div className="w-[12px] h-[12px] rounded-full border border-[#d81b60] flex items-center justify-center text-[6px] font-bold">
                           {l === 'A' ? '' : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="border-[1.5px] border-[#d81b60] flex-1 flex flex-col bg-white">
                <div className="bg-[#fff0f3] text-[8.5px] font-[900] py-1 text-center border-b border-[#d81b60] uppercase tracking-wider">Subject Code</div>
                <div className="flex-1 flex items-center justify-center gap-2">
                 {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-6 h-6 border-[1.5px] border-[#d81b60] bg-slate-50"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Attempted & Sign */}
          <div className="flex flex-col gap-3">
             <div className="border-[1.5px] border-[#d81b60] h-[85px] flex flex-col bg-white">
                <div className="bg-[#fff0f3] text-[8px] font-[900] py-1.5 px-2 border-b border-[#d81b60] uppercase leading-none text-center">TOTAL NO OF QUESTIONS ATTEMPTED</div>
                <div className="flex-1 flex items-center justify-center gap-2">
                   {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-7 h-7 border-[1.5px] border-[#d81b60] bg-slate-50"></div>
                  ))}
                </div>
             </div>
             <div className="border-[1.5px] border-[#d81b60] flex-1 flex flex-col bg-white">
                <div className="bg-[#fff0f3] text-[7.5px] font-[900] py-1.5 text-center border-b border-[#d81b60] uppercase leading-none tracking-tighter">CANDIDATE'S SIGNATURE<br/><span className="text-[6px] lowercase font-black">[SIGN WITHIN BOX ONLY]</span></div>
                <div className="flex-1"></div>
             </div>
          </div>
        </div>

        {/* QUESTIONS GRID - TWO PANELS OF 3 COLUMNS */}
        <div className="grid grid-cols-2 gap-6 border-t-[2.5px] border-[#d81b60] pt-3 bg-white">
           {[0, 1].map(panelIdx => (
             <div key={panelIdx} className="grid grid-cols-3 gap-1">
               {[0, 1, 2].map(colIdx => {
                 const start = (panelIdx * 3 + colIdx) * 35 + 1;
                 const end = Math.min(start + 34, 100); // 100 max per panel or logic
                 
                 // If panel 2 columns are meant to be 101-200, but the image shows 1-100 on both sides?
                 // Most official OMRs are 1-100 once. Let's make it 1-100 total.
                 // Panel 1: Col 1 (1-35), Col 2 (36-70), Col 3 (71-100)
                 // If panel 1 has all 100, what is panel 2 for? Redundancy?
                 // Let's assume 1-100 spread across both panels for density.
                 
                 // Recalculating spread: 100 items / 6 columns = 16.6 approx.
                 // Let's follow the image's 35-per-column spacing.
                 
                 let colStart = start;
                 let colEnd = start + 34;
                 if (colStart > 100) return <div key={colIdx} className="w-full"></div>;

                 return (
                   <div key={colIdx} className="flex flex-col">
                      <div className="grid grid-cols-[12px_1fr] text-[6.5px] font-[900] text-center mb-[2px] opacity-70">
                        <div></div>
                        <div className="flex justify-around px-1">
                          <span>1</span><span>2</span><span>3</span><span>4</span>
                        </div>
                      </div>
                      {renderQuestionBlock(colStart, Math.min(colEnd, 100))}
                   </div>
                 )
               })}
             </div>
           ))}
        </div>

        {/* BOTTOM PAGINATION/MARKER */}
        <div className="flex justify-between items-center mt-6 pt-3 border-t-[1.5px] border-[#ffd1dc] bg-white opacity-80">
           <div className="flex gap-[3px]">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-5 h-5 bg-[#d81b60]"></div>
              ))}
           </div>
           <p className="text-[9px] font-[900] italic tracking-widest text-[#d81b60]/50 uppercase">OFFICIAL MPSC OMR INTERFACE • GENERATED BY MOCKER V2.0</p>
           <div className="flex gap-[3px]">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-5 h-5 bg-[#d81b60]"></div>
              ))}
           </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background: white !important; margin: 0; padding: 0; }
          .print\\:hidden { display: none !important; }
          @page { margin: 0; size: A4; }
        }
        * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      `}} />
    </div>
  );
};
