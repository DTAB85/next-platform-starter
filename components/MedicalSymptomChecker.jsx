'use client';

import React, { useState } from 'react';
import symptomModules from '../symptomModules';

const symptoms = [
  { id: 'chest_pain', label: 'Chest Pain' }
];

export default function MedicalSymptomChecker() {
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleSymptomClick = (symptomId) => {
    setSelectedSymptom(symptomId);
    setQuestionIndex(0);
    setAnswers([]);
    setShowResults(false);
  };

  const handleAnswer = (answer) => {
    setAnswers((prev) => [...prev, answer]);
    const totalQuestions = symptomModules[selectedSymptom]?.questions?.length || 0;
    if (questionIndex + 1 < totalQuestions) {
      setQuestionIndex(questionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const renderQuestion = () => {
    const module = symptomModules[selectedSymptom];
    const question = module?.questions?.[questionIndex];

    if (!question) return <p>No questions available for this symptom.</p>;

    return (
      <div>
        <p className="text-xl mb-4">{question}</p>
        <div className="space-x-4">
          <button
            onClick={() => handleAnswer('Yes')}
            className="bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded"
          >
            Yes
          </button>
          <button
            onClick={() => handleAnswer('No')}
            className="bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded"
          >
            No
          </button>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    const module = symptomModules[selectedSymptom];
    if (!module) return <p>No module data found.</p>;

    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">AI Diagnostic Insights</h2>
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Red Flags:</h3>
          <ul className="list-disc ml-5">
            {module.redFlags?.map((flag, idx) => (
              <li key={idx}>{flag}</li>
            ))}
          </ul>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Top Differentials:</h3>
          {Object.entries(module.differentials || {}).map(([category, items]) => (
            <div key={category} className="mb-3">
              <p className="font-medium text-purple-400">{category}:</p>
              <ul className="list-disc ml-5">
                {items.map((item, i) => (
                  <li key={i}><strong>{item.condition}</strong>: {item.features}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">AI Symptom Checker</h1>

      {!selectedSymptom && (
        <>
          <p className="text-gray-300 mb-4">Please select a symptom to begin:</p>
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
          {renderQuestion()}
        </div>
      )}

      {selectedSymptom && showResults && (
        <div className="mt-10">{renderResults()}</div>
      )}
    </div>
  );
}
