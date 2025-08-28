'use client';

import React, { useState, useEffect } from 'react';
import { Search, AlertTriangle, CheckCircle, User } from 'lucide-react';

const symptomsDatabase = {
  headache: ['Migraine', 'Tension Headache', 'Brain Tumor'],
  fever: ['Flu', 'COVID-19', 'Infection'],
  cough: ['Bronchitis', 'Pneumonia', 'Asthma'],
  fatigue: ['Anemia', 'Thyroid Disorder', 'Depression'],
};

export default function MedicalSymptomChecker() {
  const [input, setInput] = useState('');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (input.trim() === '') {
      setMatches([]);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const match = Object.entries(symptomsDatabase).find(([symptom]) =>
        symptom.toLowerCase().includes(input.toLowerCase())
      );

      setMatches(match ? match[1] : []);
      setLoading(false);
    }, 500);
  }, [input]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}><User size={24} /> Symptom Checker</h1>
      <div style={styles.searchContainer}>
        <Search />
        <input
          type="text"
          placeholder="Type a symptom..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={styles.input}
        />
      </div>
      {loading ? (
        <p style={styles.loading}>Checking symptoms...</p>
      ) : matches.length > 0 ? (
        <ul style={styles.resultList}>
          {matches.map((diagnosis, i) => (
            <li key={i} style={styles.resultItem}>
              <CheckCircle size={16} style={{ marginRight: 8 }} />
              {diagnosis}
            </li>
          ))}
        </ul>
      ) : (
        input && (
          <p style={styles.noMatch}>
            <AlertTriangle size={16} style={{ marginRight: 6 }} />
            No matches found.
          </p>
        )
      )}
    </div>
  );
}

const styles = {
  container: {
    margin: '2rem auto',
    maxWidth: '500px',
    padding: '2rem',
    borderRadius: '12px',
    backgroundColor: '#1a1a2e',
    color: 'white',
    boxShadow: '0 0 30px rgba(0,0,0,0.2)',
    fontFamily: 'sans-serif',
  },
  title: {
    fontSize: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#282c34',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
  },
  input: {
    flex: 1,
    marginLeft: '0.5rem',
    background: 'transparent',
    border: 'none',
    color: 'white',
    outline: 'none',
    fontSize: '1rem',
  },
  loading: {
    fontStyle: 'italic',
    color: '#bbb',
  },
  resultList: {
    listStyle: 'none',
    padding: 0,
    marginTop: '1rem',
  },
  resultItem: {
    background: '#232946',
    padding: '0.5rem',
    borderRadius: '6px',
    marginBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center',
  },
  noMatch: {
    color: '#ff6b6b',
    marginTop: '1rem',
    display: 'flex',
    alignItems: 'center',
  },
};
