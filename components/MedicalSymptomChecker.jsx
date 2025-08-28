'use client';

import React, { useState } from 'react';

const symptoms = [
  { id: 'chest_pain', label: 'Chest Pain' },
  { id: 'cough', label: 'Cough' },
  { id: 'headache', label: 'Headache' },
  { id: 'abdominal_pain', label: 'Abdominal Pain' },
  { id: 'fever', label: 'Fever' },
];

export default function MedicalSymptomChecker() {
  const [selectedSymptom, setSelectedSymptom] = useState(null);

  const handleSymptomClick = (symptom) => {
    setSelectedSymptom(symptom);
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
        <div className="mt-10">
          <p className="text-xl">You selected: <strong>{selectedSymptom}</strong></p>
          {/* You can render dynamic questions here based on selectedSymptom */}
        </div>
      )}
    </div>
  );
}
