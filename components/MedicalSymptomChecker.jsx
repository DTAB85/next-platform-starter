// Updated MedicalSymptomChecker.jsx with tappable multi-choice UX

'use client';

import React, { useState } from 'react';
import symptomModules from '../symptomModules';

const symptoms = [
  { id: 'chest_pain', label: 'Chest Pain' }
];

export default function MedicalSymptomChecker() {
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const module = selectedSymptom ? symptomModules[selectedSymptom] : null;
  const currentQuestion = module?.questions[questionIndex];

  const handleSymptomClick = (symptom) => {
    setSelectedSymptom(symptom);
    setQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
  };

  const handleAnswerSelect = (value) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: value }));
    if (questionIndex + 1 < module.questions.length) {
      setQuestionIndex((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const renderChoices = () => {
    const choices = module.questions[questionIndex]?.choices || ['Yes', 'No'];
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {choices.map((choice, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswerSelect(choice)}
            className="bg-purple-700 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg shadow"
          >
            {choice}
          </button>
        ))}
      </div>
    );
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

      {selectedSymptom && !showResults && (
        <div className="mt-10">
          <p className="text-xl mb-4">{currentQuestion?.text || 'Loading question...'}</p>
          {renderChoices()}
        </div>
      )}

      {showResults && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Preliminary Summary</h2>
          <ul className="list-disc ml-6 space-y-2">
            {Object.entries(answers).map(([index, value]) => (
              <li key={index}><strong>Q{+index + 1}:</strong> {value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
