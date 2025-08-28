'use client';

import React from 'react';
import MedicalSymptomChecker from '../../components/MedicalSymptomChecker';

export default function SymptomCheckerPage() {
  return (
    <div>
      <h1 style={{ textAlign: 'center', marginTop: '20px' }}>🧠 Symptom Checker</h1>
      <MedicalSymptomChecker />
    </div>
  );
}
