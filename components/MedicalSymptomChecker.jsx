// MedicalSymptomChecker.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { questionsForSymptom } from '../data/symptomTrees'; // dynamic question trees per symptom
import diagnosisEngine from '../utils/diagnosisEngine'; // new AI-like scoring logic
import ResultCard from './ResultCard';

export default function MedicalSymptomChecker({ selectedSymptoms }) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentSymptom, setCurrentSymptom] = useState(selectedSymptoms[0]);
  const [userAnswers, setUserAnswers] = useState({});
  const [questionQueue, setQuestionQueue] = useState([]);
  const [results, setResults] = useState(null);

  useEffect(() => {
    if (currentSymptom) {
      const questions = questionsForSymptom(currentSymptom);
      setQuestionQueue(questions);
    }
  }, [currentSymptom]);

  const handleAnswer = (answerObj) => {
    const updatedAnswers = { ...userAnswers };
    const { id, answer } = answerObj;
    updatedAnswers[id] = answer;
    setUserAnswers(updatedAnswers);

    const nextQuestions = questionQueue.slice(1);

    // If no more questions OR confident result, trigger diagnosis
    if (nextQuestions.length === 0 || shouldFinishEarly(updatedAnswers)) {
      const diagnosisResults = diagnosisEngine(updatedAnswers, currentSymptom);
      setResults(diagnosisResults);
    } else {
      setQuestionQueue(nextQuestions);
      setQuestionIndex((prev) => prev + 1);
    }
  };

  const shouldFinishEarly = (answers) => {
    const scores = diagnosisEngine(answers, currentSymptom);
    const topTwo = scores.slice(0, 2);
    const confidenceGap = topTwo[0].score - topTwo[1].score;
    return confidenceGap > 30 && scores[0].score > 60;
  };

  if (results) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Top Diagnosis Matches</h2>
        {results.map((res, idx) => (
          <ResultCard key={idx} result={res} />
        ))}
      </div>
    );
  }

  if (questionQueue.length === 0) {
    return <div className="p-6 text-lg">Loading questions for {currentSymptom}...</div>;
  }

  const currentQuestion = questionQueue[0];

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-2">{currentQuestion.text}</h2>
      <div className="space-y-2">
        {currentQuestion.options.map((opt, i) => (
          <button
            key={i}
            onClick={() =>
              handleAnswer({ id: currentQuestion.id, answer: opt.value })
            }
            className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
