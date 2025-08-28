'use client';

import React, { useState } from 'react';
import chestpain from '../symptomModules/chestpain.js';

const symptoms = [
  { id: 'chestpain', label: 'Chest Pain', module: chestpain }
];

export default function MedicalSymptomChecker() {
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [completed, setCompleted] = useState(false);

  const handleSymptomClick = (symptomId) => {
    setSelectedSymptom(symptomId);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setCompleted(false);
  };

  const handleAnswerClick = (answer) => {
    const updatedAnswers = [...answers, answer];
    setAnswers(updatedAnswers);

    const module = symptoms.find(sym => sym.id === selectedSymptom)?.module;
    const isLastQuestion = currentQuestionIndex >= module.questions.length - 1;

    if (isLastQuestion) {
      setCompleted(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const currentSymptom = symptoms.find(sym => sym.id === selectedSymptom);
  const currentModule = currentSymptom?.module;
  const currentQuestion = currentModule?.questions[currentQuestionIndex];

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

      {selectedSymptom && !completed && currentQuestion && (
        <div className="mt-10">
          <p className="text-xl font-semibold mb-6">{currentQuestion.text}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswerClick(option)}
                className="bg-purple-700 hover:bg-purple-600 text-white py-3 px-4 rounded-lg shadow-md"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedSymptom && completed && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Thanks for your answers!</h2>
          <p className="text-gray-300 mb-6">Our system is reviewing your inputs and will provide tailored insights shortly.</p>
          <ul className="list-disc ml-6 space-y-1">
            {answers.map((ans, i) => (
              <li key={i}>{currentModule.questions[i].text}: <strong>{ans}</strong></li>
            ))}
          </ul>
          <button
            onClick={() => {
              setSelectedSymptom(null);
              setAnswers([]);
              setCompleted(false);
            }}
            className="mt-6 bg-indigo-600 hover:bg-indigo-500 py-2 px-4 rounded"
          >
            Start Over
          </button>
        </div>
      )}
    </div>
  );
}
