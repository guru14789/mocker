import React from 'react';
import { OMRSheetGenerator } from '../components/exam/OMRSheetGenerator';
import { useNavigate } from 'react-router-dom';

const DebugOMR = () => {
    const navigate = useNavigate();
  const mockTest = {
    title: 'MPSC STATE SERVICE PRELIMINARY EXAM 2026',
    description: 'General Studies Paper I',
    organization: 'CENTRAL SELECTION COMMITTEE',
    organizationCode: 'CSC'
  };

  const mockQuestions = Array.from({ length: 100 }, (_, i) => ({
    _id: `q${i + 1}`,
    questionText: `Sample Question ${i + 1}`,
  }));

  return (
    <OMRSheetGenerator 
      test={mockTest} 
      questions={mockQuestions} 
      onBack={() => {
          console.log('Back clicked');
          navigate('/dashboard');
      }} 
    />
  );
};

export default DebugOMR;
