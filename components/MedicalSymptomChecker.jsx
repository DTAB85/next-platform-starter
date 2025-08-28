'use client';

import React, { useState, useEffect } from 'react';
import { questionsForSymptom } from '../data/symptomTrees';
import diagnosisEngine from '../utils/diagnosisEngine';
import ResultCard from './ResultCard';

export default function MedicalSymptomChecker({ selectedSymptom }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [diagnosis, setDiagnosis] = useState(null);

  useEffect(() => {
    if (selectedSymptom) {
      const qList = questionsForSymptom(selectedSymptom);
      setQuestions(qList);
      setAnswers({});
      setCurrentQuestionIndex(0);
      setDiagnosis(null);
    }
  }, [selectedSymptom]);

  const handleAnswer = (value) => {
    const currentQuestion = questions[currentQuestionIndex];
    const updatedAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(updatedAnswers);

    // Run diagnosis if enough data
    if (currentQuestionIndex >= questions.length - 1) {
      const results = diagnosisEngine(updatedAnswers, selectedSymptom);
      setDiagnosis(results);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  if (!selectedSymptom) {
    return <p className="text-gray-500">Please select a symptom to begin.</p>;
  }

  if (diagnosis) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-center">Possible Diagnoses</h2>
        {diagnosis.map((d, i) => (
          <ResultCard key={i} condition={d.condition} score={d.score} />
        ))}
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium">{currentQuestion.text}</h2>
      <div className="grid gap-3">
        {currentQuestion.options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleAnswer(option.value)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
