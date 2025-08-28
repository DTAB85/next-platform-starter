// components/ResultCard.jsx
import React from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react';

export default function ResultCard({ condition, score }) {
  const isHighConfidence = score >= 80;

  return (
    <div className="border rounded-lg p-4 shadow-md bg-white space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">{condition}</h3>
        {isHighConfidence ? (
          <CheckCircle className="text-green-600" />
        ) : (
          <AlertTriangle className="text-yellow-500" />
        )}
      </div>
      <p className="text-gray-700">Confidence Score: {score}%</p>
    </div>
  );
}
