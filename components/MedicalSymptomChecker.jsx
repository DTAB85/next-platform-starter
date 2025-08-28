'use client';

import React, { useMemo, useState } from 'react';
// ⬇️ Option A (after you rename folder to symptomModules/index.js)
import symptomModules from '../symptomModules';
// ⬇️ Option B (if you keep your current names), comment the line above and uncomment below:
// import symptomModules from '../symptommodules/Index.js';

const SYMPTOMS = [
  { id: 'chest_pain', label: 'Chest Pain' },
];

export default function MedicalSymptomChecker() {
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);

  // pull the module for the selected symptom
  const mod = useMemo(
    () => (selectedSymptom ? symptomModules?.[selectedSymptom] : null),
    [selectedSymptom]
  );

  const questions = mod?.questions ?? [];

  const startSymptom = (id) => {
    setSelectedSymptom(id);
    setQuestionIndex(0);
    setAnswers({});
    setDone(false);
  };

  const onSelectOption = (value) => {
    const next = { ...answers, [questionIndex]: value };
    setAnswers(next);

    const isLast = questionIndex >= (questions.length - 1);
    if (isLast) {
      setDone(true);
    } else {
      setQuestionIndex((i) => i + 1);
    }
  };

  const progressPct = questions.length
    ? Math.round(((questionIndex) / questions.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">AI Symptom Checker</h1>

      {!selectedSymptom && (
        <>
          <p className="text-gray-300 mb-4">Please select a symptom to begin:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {SYMPTOMS.map((s) => (
              <button
                key={s.id}
                onClick={() => startSymptom(s.id)}
                className="bg-indigo-700 hover:bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md"
              >
                {s.label}
              </button>
            ))}
          </div>
        </>
      )}

      {selectedSymptom && !done && (
        <div className="mt-10 max-w-3xl">
          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-indigo-200 mb-1">
              <span>Question {questionIndex + 1} of {questions.length}</span>
              <span>{progressPct}%</span>
            </div>
            <div className="w-full h-2 bg-indigo-950/60 rounded">
              <div
                className="h-2 bg-indigo-500 rounded transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <p className="text-xl font-semibold mb-6">
            {questions?.[questionIndex]?.text ?? 'Loading...'}
          </p>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(questions?.[questionIndex]?.options ?? ['Yes', 'No']).map((opt, idx) => (
              <button
                key={idx}
                onClick={() => onSelectOption(opt)}
                className="bg-purple-700 hover:bg-purple-600 text-white py-3 px-4 rounded-lg shadow-md text-left"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedSymptom && done && (
        <div className="mt-10 max-w-3xl space-y-8">
          <h2 className="text-2xl font-bold">Preliminary Summary</h2>

          {/* Answers recap */}
          <section>
            <h3 className="text-lg font-semibold mb-2">Your answers</h3>
            <ul className="list-disc ml-6 space-y-2">
              {questions.map((q, i) => (
                <li key={i}>
                  <span className="text-indigo-200">{q.text}</span>{' '}
                  <span className="font-semibold">— {answers[i]}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Pivotal points */}
          {mod?.pivotalPoints?.length ? (
            <section>
              <h3 className="text-lg font-semibold mb-2">Pivotal clinical points</h3>
              <ul className="list-disc ml-6 space-y-1">
                {mod.pivotalPoints.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </section>
          ) : null}

          {/* Red flags */}
          {mod?.redFlags?.length ? (
            <section>
              <h3 className="text-lg font-semibold mb-2 text-red-300">Red flags</h3>
              <ul className="list-disc ml-6 space-y-1">
                {mod.redFlags.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </section>
          ) : null}

          {/* Differentials */}
          {mod?.differentials ? (
            <section>
              <h3 className="text-lg font-semibold mb-2">Differential diagnoses</h3>
              {Object.entries(mod.differentials).map(([group, items]) => (
                <div key={group} className="mb-3">
                  <p className="font-medium text-indigo-300">{group}</p>
                  <ul className="list-disc ml-6">
                    {items.map((dx, i) => (
                      <li key={i}>
                        <span className="font-semibold">{dx.condition}</span>
                        {dx.features ? `: ${dx.features}` : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          ) : null}

          <div className="pt-4">
            <button
              onClick={() => {
                setSelectedSymptom(null);
                setAnswers({});
                setDone(false);
                setQuestionIndex(0);
              }}
              className="bg-indigo-600 hover:bg-indigo-500 py-2 px-4 rounded"
            >
              Start over
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
