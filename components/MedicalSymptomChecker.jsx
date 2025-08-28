"use client";

import React, { useState, useEffect } from 'react';
import symptomModuleMap from '../data/symptomModules'; // ✅ Make sure this path is correct

export default function MedicalSymptomChecker() {
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [results, setResults] = useState(null);

  const symptom = 'Chest Pain'; // 🔧 You can make this dynamic later
  const module = symptomModuleMap[symptom];
  const questions = module?.questions || [];

  const handleAnswer = (questionId, answer) => {
    const updatedAnswers = { ...answers, [questionId]: answer };
    setAnswers(updatedAnswers);

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion >= questions.length) {
      // All done – run diagnosis logic
      const diagnoses = getSuggestedDiagnoses(updatedAnswers, module);
      setResults(diagnoses);
    } else {
      setCurrentQuestion(nextQuestion);
    }
  };

  if (!module || !questions.length) return <div>No module found.</div>;

  if (results) {
    return (
      <div style={styles.container}>
        <h2>Possible Conditions</h2>
        {results.length > 0 ? (
          <ul>
            {results.map((item, index) => (
              <li key={index}>
                <strong>{item.condition}</strong>: <em>{item.features}</em>
              </li>
            ))}
          </ul>
        ) : (
          <p>No matching conditions based on answers.</p>
        )}
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div style={styles.container}>
      <h2>{question.text}</h2>
      <div style={styles.options}>
        {question.options.map((opt) => (
          <button key={opt} onClick={() => handleAnswer(question.id, opt)} style={styles.button}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function getSuggestedDiagnoses(answers, module) {
  const differentials = module?.differentials || {};
  const flatConditions = Object.entries(differentials).flatMap(([category, items]) =>
    items.map((item) => ({ ...item, category }))
  );

  const keywords = Object.values(answers).flat().join(" ").toLowerCase();

  // Simple matching: return items whose `features` or `condition` contain any keyword
  const matches = flatConditions.filter((item) => {
    const haystack = `${item.condition} ${item.features}`.toLowerCase();
    return keywords.split(" ").some((kw) => haystack.includes(kw));
  });

  return matches.slice(0, 5); // Top 5 suggestions
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '600px',
    margin: 'auto',
  },
  options: {
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  button: {
    padding: '10px 16px',
    fontSize: '16px',
    cursor: 'pointer',
  },
};
