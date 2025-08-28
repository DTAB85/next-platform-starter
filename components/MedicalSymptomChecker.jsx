"use client";

import React, { useState, useEffect } from 'react';
import symptomModuleMap from '../data/symptomModules'; // ✅ Make sure this path is correct

export default function MedicalSymptomChecker() {
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  // Normalize the symptom name to match key in symptomModuleMap
  const rawSymptom = 'chest pain'; // example symptom selection
  const normalizedSymptom = rawSymptom
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase()); // → "Chest Pain"

  const module = symptomModuleMap[normalizedSymptom];
  const questions = module?.questions || [];

  const handleAnswer = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    setCurrentQuestion((prev) => prev + 1);
  };

  if (!module) {
    return (
      <div style={styles.container}>
        <h3>No module found for: <code>{normalizedSymptom}</code></h3>
        <p>Available modules:</p>
        <pre>{JSON.stringify(Object.keys(symptomModuleMap), null, 2)}</pre>
      </div>
    );
  }

  if (currentQuestion >= questions.length) {
    return (
      <div style={styles.container}>
        <h2>Thank you!</h2>
        <p>You’ve completed all questions.</p>
        <pre>{JSON.stringify(answers, null, 2)}</pre>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div style={styles.container}>
      <h2>{question.text}</h2>
      <div style={styles.options}>
        {question.options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleAnswer(question.id, opt)}
            style={styles.button}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '40px 20px',
    maxWidth: '600px',
    margin: '0 auto',
    textAlign: 'center',
    fontFamily: 'sans-serif',
    color: '#fff',
    background: 'linear-gradient(to bottom, #1c1c3c, #000)',
    minHeight: '100vh',
  },
  options: {
    marginTop: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  button: {
    padding: '12px 20px',
    fontSize: '16px',
    backgroundColor: '#337ab7',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
  },
};
