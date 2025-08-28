'use client';

import React, { useState } from 'react';
import symptomModules from '../symptomModules'; 

const symptoms = [
  { id: 'chest_pain', label: 'Chest Pain' },
  { id: 'cough', label: 'Cough' },
  { id: 'headache', label: 'Headache' },
  { id: 'abdominal_pain', label: 'Abdominal Pain' },
  { id: 'fever', label: 'Fever' },
];

export default function MedicalSymptomChecker() {
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);

  const handleSymptomClick = (symptomId) => {
    setSelectedSymptom(symptomId);
    setQuestionIndex(0);
  };

  // Normalize selected symptom key to match symptomModules keys (e.g., "chest_pain" → "chest pain")
  const normalizedSymptom = selectedSymptom ? selectedSymptom.replace(/_/g, ' ') : null;
  const symptomModule = normalizedSymptom ? symptomModules[normalizedSymptom] : null;
  const questions = symptomModule?.questions || [];

  const handleNextQuestion = () => {
    setQuestionIndex((prev) => Math.min(prev + 1, questions.length - 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">AI Symptom Checker</h1>

      {!selectedSymptom && (
        <>
          <p className="text-gray-400 mb-4">Please select a symptom to begin:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {symptoms.map((symptom) => (
              <button
                key={symptom.id}
                onClick={() => handleSymptomClick(symptom.id)}
                className="bg-indigo-700 hover:bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md"
              >
                {symptom.label}
              </button>
            ))}
          </div>
        </>
      )}

      {selectedSymptom && (
        <div className="mt-10 space-y-6">
          <p className="text-xl">You selected: <strong>{normalizedSymptom}</strong></p>

          {questions.length > 0 ? (
            <div className="bg-indigo-800 p-6 rounded-lg shadow-md">
              <p className="text-lg mb-4">
                Question {questionIndex + 1} of {questions.length}
              </p>
              <p className="text-2xl font-medium mb-4">{questions[questionIndex]}</p>
              {questionIndex < questions.length - 1 && (
                <button
                  onClick={handleNextQuestion}
                  className="mt-4 bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-lg text-white font-semibold"
                >
                  Next
                </button>
              )}
              {questionIndex === questions.length - 1 && (
                <p className="text-green-400 mt-6">End of questions.</p>
              )}
            </div>
          ) : (
            <p className="text-red-400">No questions found for this symptom.</p>
          )}
        </div>
      )}
    </div>
  );
}
