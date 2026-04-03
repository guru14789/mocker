import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { OMRSheetGenerator } from '../components/exam/OMRSheetGenerator';

export default function PrintOMR() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/tests/${testId}`);
        setTest(res.data.test);
        setQuestions(res.data.questions);
      } catch (err) {
        console.error('Failed to fetch test for OMR', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [testId]);

  if (loading) return <div className="h-screen flex items-center justify-center font-bold">Generating OMR Template...</div>;
  if (!test) return <div className="h-screen flex items-center justify-center font-bold text-red-500">Test not found.</div>;

  return (
    <OMRSheetGenerator 
      test={test} 
      questions={questions} 
      onBack={() => navigate('/dashboard?tab=tests')} 
    />
  );
}
