"use client";

import React, { useState } from 'react';
import symptomModuleMap from '../data/symptomModules';

export default function MedicalSymptomChecker() {
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [matchedRedFlags, setMatchedRedFlags] = useState([]);
  const [riskCategory, setRiskCategory] = useState(null);

  const symptom = 'Chest Pain';
  const module = symptomModuleMap[symptom];
  const questions = module?.questions || [];

  const handleAnswer = (questionId, answer) => {
    const updatedAnswers = { ...answers, [questionId]: answer };
    setAnswers(updatedAnswers);

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      processResults(updatedAnswers);
      setShowResults(true);
    }
  };

  const processResults = (userAnswers) => {
    if (!module) return;

    // 🔴 RED FLAGS
    const flagged = module.redFlags.filter((flag) => {
      return (
        (flag.includes('tearing') && userAnswers.character === 'Tearing') ||
        (flag.includes('radiating to back') && userAnswers.radiation === 'Back') ||
        (flag.includes('short of breath') && userAnswers.dyspnea === 'Yes') ||
        (flag.includes('sweating') && userAnswers.associatedSymptoms?.includes('Sweating')) ||
        (flag.includes('syncope') && userAnswers.associatedSymptoms?.includes('Dizzy')) ||
        (flag.includes('cocaine') && userAnswers.modifyingFactors?.includes('Nothing helps'))
      );
    });
    setMatchedRedFlags(flagged);

    // 🟡 RISK STRATIFICATION
    const strat = module.riskStratification;
    const riskLevels = Object.keys(strat);

    for (let level of riskLevels) {
      for (let phrase of strat[level]) {
        if (
          (phrase.includes('typical') && userAnswers.character === 'Crushing') ||
          (phrase.includes('exertion') && userAnswers.onsetContext === 'Exerting') ||
          (phrase.includes('diabetes') && userAnswers.associatedSymptoms?.includes('None of these') === false) ||
          (phrase.includes('reproducible') && userAnswers.modifyingFactors === 'Position changes it') ||
          (phrase.includes('young') && userAnswers.age && parseInt(userAnswers.age) < 30)
        ) {
          setRiskCategory(level);
          return;
        }
      }
    }

    setRiskCategory('Unclear Risk Profile');
  };

  if (!questions.length) return <div>No module found.</div>;

  if (showResults) {
    return (
      <div style={styles.container}>
        <h2>Results</h2>

        {matchedRedFlags.length > 0 ? (
          <div style={{ color: 'red', marginBottom: 20 }}>
            <h3>🚨 Red Flag Warning!</h3>
            <ul>
              {matchedRedFlags.map((flag, idx) => (
                <li key={idx}>{flag}</li>
              ))}
            </ul>
          </div>
        ) : (
          <div style={{ color: 'green', marginBottom: 20 }}>
            <h3>No urgent red flags detected.</h3>
          </div>
        )}

        <h3>Risk Assessment:</h3>
        <p><strong>{riskCategory}</strong></p>

        <h3>Follow-Up Recommendation:</h3>
        <p style={{ fontWeight: 'bold', color: '#444' }}>
          {matchedRedFlags.length > 0
            ? 'Go to the emergency room immediately.'
            : riskCategory?.includes('Very High') || riskCategory?.includes('High')
            ? 'Contact your doctor as soon as possible. You may need urgent evaluation.'
            : riskCategory?.includes('Moderate')
            ? 'See your doctor soon for further testing and guidance.'
            : riskCategory?.includes('Low')
            ? 'Monitor your symptoms at home. Follow up with a provider if they worsen or persist.'
            : 'Not enough data to make a confident recommendation.'}
        </p>

        <h3>Your Answers:</h3>
        <ul>
          {Object.entries(answers).map(([key, value]) => (
            <li key={key}><strong>{key}:</strong> {value}</li>
          ))}
        </ul>
      </div>
    );
  }

  // ➡️ Question Display
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
