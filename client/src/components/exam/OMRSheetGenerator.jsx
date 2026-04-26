import React from 'react';
import { Printer, Download, ChevronLeft } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export const OMRSheetGenerator = ({ test, questions, onBack }) => {
  const printSheet = () => {
    window.print();
  };

  const numQ = questions?.length || 100;
  const numCols = numQ <= 35 ? 1 : numQ <= 70 ? 2 : numQ <= 105 ? 3 : 4;
  const perCol = Math.ceil(numQ / numCols);

  const renderQuestionBlock = (start, end) => {
    const rows = [];
    // Groups of 5 for easier reading
    for (let i = start; i <= end; i += 5) {
      rows.push(
        <div key={i} className="flex flex-col border-[0.5px] border-[#d81b60] mb-[3px] bg-white">
           <div className="grid grid-cols-[12px_1fr] text-[5px] font-black border-b-[0.5px] border-[#ffd1dc] mb-[0.5px] opacity-40 bg-[#fffdfd]">
              <div></div>
              <div className="flex justify-around px-1"><span>A</span><span>B</span><span>C</span><span>D</span><span>E</span></div>
           </div>
           {[0, 1, 2, 3, 4].map(offset => {
             const qNum = i + offset;
             if (qNum > end || qNum > numQ) return null;
             
             const qData = questions[qNum - 1];
             const numOpts = qData?.options?.length || 4;

             return (
               <div key={qNum} className="grid grid-cols-[12px_1fr] items-center h-[13px] border-b-[0.1px] border-[#fff0f3] last:border-b-0">
                 <span className="text-[6.5px] font-black text-center">{qNum}</span>
                 <div className="flex justify-around px-1">
                   {[0, 1, 2, 3, 4].map(optIdx => {
                     const label = ['A', 'B', 'C', 'D', 'E'][optIdx];
                     const isUnused = optIdx >= numOpts;
                     return (
                       <div key={label} className={`w-[10px] h-[10px] rounded-full border border-[#d81b60] flex items-center justify-center text-[5px] font-black leading-none ${isUnused ? 'opacity-10 border-dashed' : ''}`}>
                         {label}
                       </div>
                     );
                   })}
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
    <div className="min-h-screen bg-slate-100 p-4 font-sans print:bg-white print:p-0">
      <header className="max-w-[1000px] mx-auto mb-6 flex justify-between items-center print:hidden">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-700 hover:text-black font-black transition-all bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">
          <ChevronLeft size={20} /> Back to Dashboard
        </button>
        <div className="flex gap-4">
          <button onClick={printSheet} className="px-10 py-4 bg-[#d81b60] text-white rounded-2xl font-black flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all">
            <Printer size={22} /> Print Official OMR
          </button>
        </div>
      </header>

      <div className="max-w-[210mm] mx-auto bg-white shadow-2xl print:shadow-none min-h-[297mm] p-6 border-[4px] border-[#d81b60] print:border-[#d81b60] relative overflow-hidden text-[#d81b60] select-none">
        
        {/* WATERMARK */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] rotate-[-45deg] text-[120px] font-black whitespace-nowrap">
           {test.organization || "OFFICIAL MOCKER"}
        </div>

        {/* TOP HEADER SECTION */}
        <div className="border-[2px] border-[#d81b60] mb-4">
          <div className="bg-[#fff0f3] border-b-[2px] border-[#d81b60] py-2 text-center px-4">
            <h1 className="text-2xl font-[900] tracking-[0.25em] uppercase leading-tight">
              {test.organization || "OFFICIAL ASSESSMENT BUREAU"}
            </h1>
            <p className="text-[10px] font-black tracking-[0.4em] mt-1 opacity-80">MACHINE READABLE ANSWER SHEET</p>
          </div>
          
          <div className="grid grid-cols-[1fr_200px] bg-white">
             <div className="py-2 px-4 border-r-[1.5px] border-[#d81b60] space-y-2">
                <div className="flex items-center gap-3">
                   <span className="text-[10px] font-black whitespace-nowrap">EXAMINATION NAME :</span>
                   <div className="flex-1 border-b-[1.5px] border-dotted border-[#d81b60] h-6 text-xs font-black text-slate-900 px-2 uppercase truncate">
                      {test.title}
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <span className="text-[10px] font-black whitespace-nowrap">CANDIDATE NAME :</span>
                   <div className="flex-1 border-b-[1.5px] border-dotted border-[#d81b60] h-6 text-xs font-black text-slate-900 px-2 uppercase"></div>
                </div>
             </div>
             <div className="bg-[#fffdfd] flex flex-col items-center justify-center p-2">
                <div className="bg-white p-1.5 border-[1.5px] border-[#d81b60] rounded-sm shadow-sm">
                   <QRCodeSVG value={`https://mocker.ai/v/${test._id}`} size={70} />
                </div>
                <span className="text-[6px] font-black mt-1 tracking-tighter">VERIFY AUTHENTICITY</span>
             </div>
          </div>
        </div>

        {/* METADATA GRIDS */}
        <div className="grid grid-cols-[200px_1fr_180px] gap-4 mb-6">
           {/* Roll Number */}
           <div className="border-[1.5px] border-[#d81b60] flex flex-col bg-white">
             <div className="bg-[#fff0f3] text-[9px] font-black py-1 text-center border-b-[1.5px] border-[#d81b60] tracking-widest">ROLL NUMBER</div>
             <div className="flex-1 flex p-1 gap-[1px]">
                {[...Array(7)].map((_, col) => (
                  <div key={col} className="flex-1 flex flex-col gap-[0.5px]">
                     <div className="h-[18px] border-[0.5px] border-[#d81b60] mb-1"></div>
                     {[...Array(10)].map((_, row) => (
                       <div key={row} className="flex-1 flex items-center justify-center">
                         <div className="w-[12px] h-[12px] rounded-full border-[0.8px] border-[#d81b60] text-[6px] flex items-center justify-center font-black">
                            {row}
                         </div>
                       </div>
                     ))}
                  </div>
                ))}
             </div>
           </div>

           {/* Center & Subject Code */}
           <div className="flex flex-col gap-4">
              <div className="border-[1.5px] border-[#d81b60] flex-1 flex flex-col">
                 <div className="bg-[#fff0f3] text-[8px] font-black py-1 text-center border-b-[1.5px] border-[#d81b60] uppercase">Subject Code / Code No.</div>
                 <div className="flex-1 flex p-1 gap-4 justify-center items-center">
                    <div className="flex gap-1">
                       {[...Array(3)].map((_, i) => <div key={i} className="w-6 h-7 border-[1.5px] border-[#d81b60]"></div>)}
                    </div>
                    <div className="flex gap-1">
                        {['A','B','C','D'].map(l => (
                          <div key={l} className="flex flex-col items-center">
                             <span className="text-[6px] font-black">{l}</span>
                             <div className="w-3 h-3 rounded-full border border-[#d81b60]"></div>
                          </div>
                        ))}
                    </div>
                 </div>
              </div>
              <div className="border-[1.5px] border-[#d81b60] flex-1 flex flex-col">
                 <div className="bg-[#fff0f3] text-[8px] font-black py-1 text-center border-b-[1.5px] border-[#d81b60] uppercase">Center Code</div>
                 <div className="flex-1 flex items-center justify-center gap-1.5">
                    {[...Array(5)].map((_, i) => <div key={i} className="w-6 h-7 border-[1.5px] border-[#d81b60]"></div>)}
                 </div>
              </div>
           </div>

           {/* Signatures */}
           <div className="flex flex-col gap-4">
              <div className="border-[1.5px] border-[#d81b60] flex-1 flex flex-col">
                 <div className="bg-[#fff0f3] text-[7.5px] font-black py-1 text-center border-b-[1.5px] border-[#d81b60] uppercase leading-none px-1">Signature of Invigilator<br/><span className="text-[5px] font-bold mt-1 text-slate-400 lowercase">Verified & Confirmed</span></div>
                 <div className="flex-1 bg-white"></div>
              </div>
              <div className="border-[1.5px] border-[#d81b60] flex-1 flex flex-col">
                 <div className="bg-[#fff0f3] text-[7.5px] font-black py-1 text-center border-b-[1.5px] border-[#d81b60] uppercase leading-none px-1">Candidate's Signature<br/><span className="text-[5px] font-bold mt-1 text-slate-400 lowercase">Sign within boundaries</span></div>
                 <div className="flex-1 bg-white"></div>
              </div>
           </div>
        </div>

        {/* QUESTION GRID - DYNAMIC COLUMNS */}
        <div className={`grid grid-cols-${numCols} gap-4 border-t-[2px] border-[#d81b60] pt-4`}>
           {Array.from({ length: numCols }).map((_, colIdx) => {
             const start = colIdx * perCol + 1;
             const end = Math.min(start + perCol - 1, numQ);
             if (start > numQ) return null;
             return (
               <div key={colIdx} className="flex flex-col">
                  {renderQuestionBlock(start, end)}
               </div>
             );
           })}
        </div>

        {/* BOTTOM PAGINATION/MARKER */}
        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center pt-3 border-t-[1.5px] border-[#ffd1dc] bg-white">
           <div className="flex gap-[4px]">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-5 h-2 bg-[#d81b60]"></div>
              ))}
           </div>
           <p className="text-[8px] font-black italic tracking-[0.2em] text-[#d81b60]/60 uppercase">
             MOCKER V2.0 • {test.title?.slice(0, 30)} • SHEET REF: {Math.random().toString(36).substr(2, 9).toUpperCase()}
           </p>
           <div className="flex gap-[4px]">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-5 h-2 bg-[#d81b60]"></div>
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
