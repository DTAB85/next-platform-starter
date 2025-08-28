"use client";

import React, { useState, useEffect } from 'react';
import symptomModuleMap from '../data/symptomModules'; // double check the path!

export default function MedicalSymptomChecker() {
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const symptom = 'chest pain'; // example
  const module = symptomModuleMap[symptom];
  const questions = module?.questions || [];

  const handleAnswer = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    setCurrentQuestion((prev) => prev + 1);
  };

  if (!questions.length) return <div>No module found.</div>;

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
