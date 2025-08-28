"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { AlertCircle, ChevronRight, ChevronLeft, Activity, Clock, User, AlertTriangle, CheckCircle, Info, Phone, Calendar, FileText, Heart } from 'lucide-react';

// Enhanced symptom modules with more comprehensive data
const symptomModuleMap = {
  'Chest Pain': {
    questions: [
      {
        id: 'demographics',
        text: 'Please provide your basic information:',
        type: 'multi-input',
        inputs: [
          { id: 'age', label: 'Age', type: 'number', required: true },
          { id: 'sex', label: 'Biological Sex', type: 'select', options: ['Male', 'Female', 'Other'], required: true }
        ]
      },
      {
        id: 'onset',
        text: 'When did the chest pain start?',
        type: 'single',
        options: ['Just now (< 1 hour)', 'Today (1-24 hours)', 'Yesterday', '2-7 days ago', 'More than a week ago'],
        followUp: {
          'Just now (< 1 hour)': { severity: 3 },
          'Today (1-24 hours)': { severity: 2 }
        }
      },
      {
        id: 'character',
        text: 'How would you describe the pain?',
        type: 'single',
        options: ['Crushing/Pressure', 'Sharp/Stabbing', 'Burning', 'Tearing/Ripping', 'Dull ache', 'Tightness'],
        visualAid: true
      },
      {
        id: 'severity',
        text: 'Rate your pain on a scale of 1-10:',
        type: 'slider',
        min: 1,
        max: 10,
        labels: ['Mild', 'Moderate', 'Severe', 'Unbearable']
      },
      {
        id: 'location',
        text: 'Where exactly is the pain located?',
        type: 'body-map',
        options: ['Center of chest', 'Left chest', 'Right chest', 'Entire chest', 'Upper chest', 'Lower chest']
      },
      {
        id: 'radiation',
        text: 'Does the pain spread anywhere?',
        type: 'multiple',
        options: ['Stays in chest', 'Left arm', 'Right arm', 'Both arms', 'Jaw', 'Back', 'Neck', 'Stomach']
      },
      {
        id: 'triggers',
        text: 'What were you doing when it started?',
        type: 'single',
        options: ['Resting', 'Walking', 'Exercising', 'Eating', 'Stressed/Anxious', 'After trauma/injury']
      },
      {
        id: 'associatedSymptoms',
        text: 'Are you experiencing any of these symptoms?',
        type: 'multiple',
        options: ['Shortness of breath', 'Sweating', 'Nausea/Vomiting', 'Dizziness', 'Palpitations', 'Fever', 'Cough', 'None']
      },
      {
        id: 'modifyingFactors',
        text: 'What makes the pain better or worse?',
        type: 'multiple',
        options: ['Rest helps', 'Sitting up helps', 'Deep breathing worsens', 'Movement worsens', 'Eating affects it', 'Nothing helps']
      },
      {
        id: 'medicalHistory',
        text: 'Do you have any of these conditions?',
        type: 'multiple',
        options: ['Heart disease', 'High blood pressure', 'Diabetes', 'High cholesterol', 'Lung disease', 'Acid reflux', 'None']
      },
      {
        id: 'medications',
        text: 'Are you taking any medications?',
        type: 'text-list',
        placeholder: 'Enter medication names (optional)'
      },
      {
        id: 'familyHistory',
        text: 'Any family history of heart disease?',
        type: 'single',
        options: ['Yes - parent/sibling before age 55', 'Yes - other relative', 'No', 'Unknown']
      }
    ],
    redFlags: [
      'Crushing chest pressure with arm/jaw radiation',
      'Tearing sensation radiating to back',
      'Severe shortness of breath',
      'Loss of consciousness',
      'Profuse sweating with chest pain',
      'Chest pain after trauma',
      'Sudden severe pain with dizziness'
    ],
    riskStratification: {
      'Critical - Call 911': [
        'Typical cardiac symptoms',
        'Hemodynamic instability',
        'Severe respiratory distress'
      ],
      'High - ER Visit': [
        'Multiple risk factors',
        'Concerning pattern',
        'Progressive symptoms'
      ],
      'Moderate - Urgent Care': [
        'Atypical features',
        'Some risk factors',
        'Persistent symptoms'
      ],
      'Low - Schedule Appointment': [
        'Reproducible pain',
        'Clear musculoskeletal',
        'Young without risk factors'
      ]
    },
    differentials: {
      'Cardiac': [
        {
          condition: 'Acute Coronary Syndrome',
          features: 'Crushing pain, radiation, sweating, nausea',
          urgency: 'critical'
        },
        {
          condition: 'Pericarditis',
          features: 'Sharp pain, worse lying flat, better sitting forward',
          urgency: 'high'
        }
      ],
      'Pulmonary': [
        {
          condition: 'Pulmonary Embolism',
          features: 'Sudden onset, shortness of breath, risk factors',
          urgency: 'critical'
        },
        {
          condition: 'Pneumonia',
          features: 'Fever, cough, pleuritic pain',
          urgency: 'moderate'
        }
      ],
      'GI': [
        {
          condition: 'GERD/Reflux',
          features: 'Burning, worse after eating, relief with antacids',
          urgency: 'low'
        }
      ],
      'Musculoskeletal': [
        {
          condition: 'Costochondritis',
          features: 'Reproducible with palpation, position-dependent',
          urgency: 'low'
        }
      ]
    }
  }
};

// Risk score calculator
const calculateRiskScore = (answers, module) => {
  let score = 0;
  const factors = [];
  
  // Age risk
  const age = parseInt(answers.demographics?.age);
  if (age > 65) { score += 3; factors.push('Age > 65'); }
  else if (age > 45) { score += 2; factors.push('Age > 45'); }
  
  // Sex risk for cardiac
  if (answers.demographics?.sex === 'Male' && age > 40) { score += 1; factors.push('Male > 40'); }
  
  // Character of pain
  if (answers.character === 'Crushing/Pressure') { score += 3; factors.push('Crushing pain'); }
  if (answers.character === 'Tearing/Ripping') { score += 4; factors.push('Tearing pain'); }
  
  // Severity
  if (answers.severity >= 8) { score += 2; factors.push('Severe pain'); }
  
  // Radiation
  if (answers.radiation?.includes('Left arm') || answers.radiation?.includes('Jaw')) {
    score += 3; factors.push('Classic radiation pattern');
  }
  
  // Associated symptoms
  const dangerous = ['Shortness of breath', 'Sweating', 'Dizziness'];
  const hasD = dangerous.filter(d => answers.associatedSymptoms?.includes(d));
  if (hasD.length > 0) {
    score += hasD.length * 2;
    factors.push(...hasD);
  }
  
  // Medical history
  const riskConditions = ['Heart disease', 'Diabetes', 'High blood pressure'];
  const hasRisk = riskConditions.filter(r => answers.medicalHistory?.includes(r));
  score += hasRisk.length * 2;
  if (hasRisk.length) factors.push('Cardiac risk factors');
  
  return { score, factors };
};

export default function MedicalSymptomChecker() {
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [urgencyLevel, setUrgencyLevel] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  
  const symptom = 'Chest Pain';
  const module = symptomModuleMap[symptom];
  const questions = module?.questions || [];
  
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  
  const validateCurrentQuestion = () => {
    const question = questions[currentQuestion];
    const errors = {};
    
    if (question.type === 'multi-input') {
      question.inputs.forEach(input => {
        if (input.required && !answers[question.id]?.[input.id]) {
          errors[input.id] = 'This field is required';
        }
      });
    } else if (question.required && !answers[question.id]) {
      errors[question.id] = 'Please select an option';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleNext = () => {
    if (!validateCurrentQuestion()) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        processResults();
      }
      setIsTransitioning(false);
    }, 300);
  };
  
  const handleBack = () => {
    if (currentQuestion > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuestion(currentQuestion - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };
  
  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    setValidationErrors({});
  };
  
  const handleMultiInputAnswer = (questionId, inputId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: { ...prev[questionId], [inputId]: value }
    }));
    setValidationErrors(prev => ({ ...prev, [inputId]: null }));
  };
  
  const processResults = () => {
    const { score, factors } = calculateRiskScore(answers, module);
    
    // Determine urgency
    let urgency;
    if (score >= 10) urgency = 'critical';
    else if (score >= 7) urgency = 'high';
    else if (score >= 4) urgency = 'moderate';
    else urgency = 'low';
    
    setUrgencyLevel(urgency);
    
    // Generate recommendations
    const recs = [];
    if (urgency === 'critical') {
      recs.push({
        icon: <Phone className="w-6 h-6" />,
        title: 'Call 911 Immediately',
        description: 'Your symptoms require immediate emergency evaluation.',
        action: 'tel:911'
      });
    } else if (urgency === 'high') {
      recs.push({
        icon: <AlertTriangle className="w-6 h-6" />,
        title: 'Visit Emergency Room',
        description: 'Go to the nearest ER within the next hour.',
        action: null
      });
    } else if (urgency === 'moderate') {
      recs.push({
        icon: <Calendar className="w-6 h-6" />,
        title: 'See Doctor Today',
        description: 'Schedule an urgent appointment or visit urgent care.',
        action: null
      });
    } else {
      recs.push({
        icon: <CheckCircle className="w-6 h-6" />,
        title: 'Monitor Symptoms',
        description: 'Watch for changes. Schedule routine appointment if persists.',
        action: null
      });
    }
    
    // Add specific recommendations based on answers
    if (answers.associatedSymptoms?.includes('Shortness of breath')) {
      recs.push({
        icon: <Info className="w-6 h-6" />,
        title: 'Breathing Support',
        description: 'Sit upright, try to stay calm, focus on slow breaths.',
        action: null
      });
    }
    
    setRecommendations(recs);
    setShowResults(true);
  };
  
  const question = questions[currentQuestion];
  
  if (showResults) {
    const { score, factors } = calculateRiskScore(answers, module);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className={`p-6 text-white ${
              urgencyLevel === 'critical' ? 'bg-red-600' :
              urgencyLevel === 'high' ? 'bg-orange-500' :
              urgencyLevel === 'moderate' ? 'bg-yellow-500' :
              'bg-green-500'
            }`}>
              <h2 className="text-3xl font-bold mb-2">Assessment Complete</h2>
              <p className="text-xl opacity-90">
                Risk Level: {urgencyLevel.charAt(0).toUpperCase() + urgencyLevel.slice(1)}
              </p>
            </div>
            
            {/* Risk Score */}
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Risk Score</h3>
                <div className="text-3xl font-bold text-indigo-600">{score}/20</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div 
                  className={`h-4 rounded-full transition-all duration-500 ${
                    urgencyLevel === 'critical' ? 'bg-red-500' :
                    urgencyLevel === 'high' ? 'bg-orange-500' :
                    urgencyLevel === 'moderate' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${(score / 20) * 100}%` }}
                />
              </div>
              {factors.length > 0 && (
                <div className="mt-4">
                  <p className="font-medium mb-2">Risk Factors Identified:</p>
                  <div className="flex flex-wrap gap-2">
                    {factors.map((factor, idx) => (
                      <span key={idx} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Recommendations */}
            <div className="p-6 border-b">
              <h3 className="text-xl font-semibold mb-4">Recommended Actions</h3>
              <div className="space-y-4">
                {recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
                    <div className={`p-3 rounded-full ${
                      idx === 0 && urgencyLevel === 'critical' ? 'bg-red-500 text-white' :
                      idx === 0 && urgencyLevel === 'high' ? 'bg-orange-500 text-white' :
                      'bg-blue-500 text-white'
                    }`}>
                      {rec.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{rec.title}</h4>
                      <p className="text-gray-600 mt-1">{rec.description}</p>
                      {rec.action && (
                        <a href={rec.action} className="inline-block mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                          Call Now
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Important Information */}
            <div className="p-6 bg-yellow-50 border-t border-yellow-200">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-2">Important Disclaimer</h4>
                  <p className="text-yellow-700 text-sm">
                    This assessment is not a substitute for professional medical advice. If you're experiencing severe symptoms 
                    or feel your life is in danger, call 911 immediately. Always consult with a qualified healthcare provider 
                    for proper diagnosis and treatment.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Summary Report */}
            <div className="p-6 border-t">
              <button
                onClick={() => {
                  const report = generateReport(answers, score, factors, urgencyLevel);
                  console.log(report); // In production, this would download/email
                }}
                className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                <FileText className="w-5 h-5" />
                <span>Download Summary Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold text-gray-800">Symptom Assessment</h1>
            <span className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="h-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        {/* Question Card */}
        <div className={`bg-white rounded-2xl shadow-xl overflow-hidden transition-opacity duration-300 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}>
          <div className="p-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              {question.text}
            </h2>
            
            {/* Render different question types */}
            {question.type === 'multi-input' && (
              <div className="space-y-4">
                {question.inputs.map(input => (
                  <div key={input.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {input.label} {input.required && <span className="text-red-500">*</span>}
                    </label>
                    {input.type === 'number' ? (
                      <input
                        type="number"
                        value={answers[question.id]?.[input.id] || ''}
                        onChange={(e) => handleMultiInputAnswer(question.id, input.id, e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                          validationErrors[input.id] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder={`Enter ${input.label.toLowerCase()}`}
                      />
                    ) : (
                      <select
                        value={answers[question.id]?.[input.id] || ''}
                        onChange={(e) => handleMultiInputAnswer(question.id, input.id, e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                          validationErrors[input.id] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select {input.label}</option>
                        {input.options.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    )}
                    {validationErrors[input.id] && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors[input.id]}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {question.type === 'single' && (
              <div className="space-y-3">
                {question.options.map(option => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(question.id, option)}
                    className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-all ${
                      answers[question.id] === option
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option}</span>
                      {answers[question.id] === option && (
                        <CheckCircle className="w-5 h-5 text-indigo-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            {question.type === 'multiple' && (
              <div className="space-y-3">
                {question.options.map(option => {
                  const isSelected = answers[question.id]?.includes(option);
                  return (
                    <button
                      key={option}
                      onClick={() => {
                        const current = answers[question.id] || [];
                        if (option === 'None') {
                          handleAnswer(question.id, ['None']);
                        } else {
                          const filtered = current.filter(o => o !== 'None');
                          if (isSelected) {
                            handleAnswer(question.id, filtered.filter(o => o !== option));
                          } else {
                            handleAnswer(question.id, [...filtered, option]);
                          }
                        }
                      }}
                      className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{option}</span>
                        {isSelected && (
                          <CheckCircle className="w-5 h-5 text-indigo-600" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
            
            {question.type === 'slider' && (
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-600">
                  {question.labels.map((label, idx) => (
                    <span key={idx}>{label}</span>
                  ))}
                </div>
                <input
                  type="range"
                  min={question.min}
                  max={question.max}
                  value={answers[question.id] || question.min}
                  onChange={(e) => handleAnswer(question.id, parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="text-center text-3xl font-bold text-indigo-600">
                  {answers[question.id] || question.min}
                </div>
              </div>
            )}
            
            {question.type === 'body-map' && (
              <div className="grid grid-cols-2 gap-3">
                {question.options.map(option => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(question.id, option)}
                    className={`px-4 py-3 rounded-lg border-2 transition-all ${
                      answers[question.id] === option
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Heart className="w-6 h-6 mx-auto mb-2" />
                    <span className="text-sm font-medium">{option}</span>
                  </button>
                ))}
              </div>
            )}
            
            {question.type === 'text-list' && (
              <div>
                <textarea
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswer(question.id, e.target.value)}
                  placeholder={question.placeholder}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  rows={4}
                />
                <p className="mt-2 text-sm text-gray-500">
                  Separate multiple items with commas
                </p>
              </div>
            )}
          </div>
          
          {/* Navigation */}
          <div className="px-8 py-6 bg-gray-50 border-t flex justify-between">
            <button
              onClick={handleBack}
              disabled={currentQuestion === 0}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition ${
                currentQuestion === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>
            
            <button
              onClick={handleNext}
              className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              <span>{currentQuestion === questions.length - 1 ? 'Complete Assessment' : 'Next'}</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Emergency Notice */}
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700">
              If you're experiencing severe symptoms or this is an emergency, stop this assessment and call 911 immediately.
            </p>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          background: #4f46e5;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          background: #4f46e5;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          border: none;
        }
      `}</style>
    </div>
  );
}

// Helper function to generate report
function generateReport(answers, score, factors, urgencyLevel) {
  const timestamp = new Date().toLocaleString();
  return {
    timestamp,
    urgencyLevel,
    riskScore: score,
    riskFactors: factors,
    responses: answers,
    recommendation: urgencyLevel === 'critical' ? 'IMMEDIATE EMERGENCY CARE REQUIRED' :
                    urgencyLevel === 'high' ? 'Visit Emergency Room' :
                    urgencyLevel === 'moderate' ? 'See Doctor Today' :
                    'Monitor and Schedule Appointment if Needed'
  };
}
