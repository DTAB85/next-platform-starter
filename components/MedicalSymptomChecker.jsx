'use client';

import React, { useState } from 'react';
import symptomModules from '../symptomModules';

export default function MedicalSymptomChecker() {
  const symptoms = [
    { id: 'chest_pain', label: 'Chest Pain' },
    // Add more symptoms here later
  ];

  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const [answers, setAnswers] = useState({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const module = selectedSymptom ? symptomModules[selectedSymptom]?.[selectedSymptom.replace(/_/g, ' ')] : null;

  const handleSymptomClick = (id) => {
    setSelectedSymptom(id);
    setAnswers({});
    setQuestionIndex(0);
    setShowResults(false);
  };

  const handleAnswer = (answer) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
    if (questionIndex + 1 < module.questions.length) {
      setQuestionIndex(questionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const renderResults = () => (
    <div className="mt-10 space-y-8">
      <h2 className="text-2xl font-bold">Preliminary Clinical Summary</h2>

      <section>
        <h3 className="text-xl font-semibold mb-1">Pivotal Clinical Points</h3>
        <ul className="list-disc list-inside text-gray-300">
          {module.pivotalPoints.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-1">Red Flags to Consider</h3>
        <ul className="list-disc list-inside text-red-300">
          {module.redFlags.map((flag, i) => (
            <li key={i}>{flag}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-1">Risk Stratification (ACS)</h3>
        {Object.entries(module.riskStratification).map(([level, items]) => (
          <div key={level} className="mb-2">
            <strong className="text-indigo-300">{level}:</strong>
            <ul className="list-disc list-inside ml-4">
              {items.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
        ))}
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-1">Age/Gender Risk Modifiers</h3>
        {Object.entries(module.ageGenderFactors).map(([group, items]) => (
          <div key={group} className="mb-2">
            <strong className="text-indigo-300">{group}:</strong>
            <ul className="list-disc list-inside ml-4">
              {items.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
        ))}
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-1">Differential Diagnoses</h3>
        {Object.entries(module.differentials).map(([group, items]) => (
          <div key={group} className="mb-4">
            <strong className="text-indigo-300">{group}:</strong>
            <ul className="list-disc list-inside ml-4">
              {items.map((dx, i) => (
                <li key={i}>
                  <span className="text-white font-semibold">{dx.condition}</span>: <em>{dx.features}</em>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-1">Diagnostic Criteria</h3>
        {Object.entries(module.diagnosticCriteria).map(([label, criteria]) => (
          <div key={label} className="mb-2">
            <strong className="text-indigo-300">{label}:</strong>
            <ul className="list-disc list-inside ml-4">
              {criteria.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );

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
          <p className="text-xl mb-4">Q{questionIndex + 1}: {module.questions[questionIndex]}</p>
          <div className="flex space-x-4">
            <button
              className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded shadow"
              onClick={() => handleAnswer('Yes')}
            >
              Yes
            </button>
            <button
              className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded shadow"
              onClick={() => handleAnswer('No')}
            >
              No
            </button>
          </div>
        </div>
      )}

      {selectedSymptom && showResults && renderResults()}
    </div>
  );
}
