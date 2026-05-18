import React from 'react';

const ExamCard = ({ image, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl hover:-translate-y-2 hover:border-slate-400/50 transition-all duration-500 shadow-sm"
    >
      <div className="w-full aspect-[16/9] overflow-hidden bg-slate-100">
        <img 
          src={image} 
          alt="exam thumbnail" 
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
      </div>
    </div>
  );
};

export default ExamCard;
