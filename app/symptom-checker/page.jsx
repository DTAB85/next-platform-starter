"use client";

import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, ChevronRight, ChevronLeft, Activity, Clock, User, AlertTriangle, CheckCircle, Info, Phone, Calendar, FileText, Heart, ChevronUp, Edit2, Stethoscope } from 'lucide-react';

// Enhanced symptom modules with more comprehensive data
const symptomModuleMap = {
  'Chest Pain': {
    questions: [
      {
        id: 'demographics',
        text: 'Please provide your basic information:',
        type: 'demographics',
        required: true
      },
      {
        id: 'onset',
        text: 'When did the chest pain start?',
        type: 'single',
        options: ['Just now (< 1 hour)', 'Today (1-24 hours)', 'Yesterday', '2-7 days ago', 'More than a week ago'],
        required: true
      },
      {
        id: 'character',
        text: 'How would you describe the pain?',
        type: 'single',
        options: ['Crushing/Pressure', 'Sharp/Stabbing', 'Burning', 'Tearing/Ripping', 'Dull ache', 'Tightness'],
        required: true
      },
      {
        id: 'severity',
        text: 'Rate your pain on a scale of 1-10:',
        type: 'slider',
        min: 1,
        max: 10,
        labels: ['Mild', 'Moderate', 'Severe', 'Unbearable'],
        required: true
      },
      {
        id: 'location',
        text: 'Where exactly is the pain located?',
        type: 'body-map',
        options: ['Center of chest', 'Left chest', 'Right chest', 'Entire chest', 'Upper chest', 'Lower chest'],
        required: true
      },
      {
        id: 'radiation',
        text: 'Does the pain spread anywhere?',
        type: 'multiple',
        options: ['Stays in chest', 'Left arm', 'Right arm', 'Both arms', 'Jaw', 'Back', 'Neck', 'Stomach'],
        required: true
      },
      {
        id: 'triggers',
        text: 'What were you doing when it started?',
        type: 'single',
        options: ['Resting', 'Walking', 'Exercising', 'Eating', 'Stressed/Anxious', 'After trauma/injury'],
        required: true
      },
      {
        id: 'associatedSymptoms',
        text: 'Are you experiencing any of these symptoms?',
        type: 'multiple',
        options: ['Shortness of breath', 'Sweating', 'Nausea/Vomiting', 'Dizziness', 'Palpitations', 'Fever', 'Cough', 'None'],
        required: true
      },
      {
        id: 'modifyingFactors',
        text: 'What makes the pain better or worse?',
        type: 'multiple',
        options: ['Rest helps', 'Sitting up helps', 'Deep breathing worsens', 'Movement worsens', 'Eating affects it', 'Nothing helps'],
        required: true
      },
      {
        id: 'medicalHistory',
        text: 'Do you have any of these conditions?',
        type: 'multiple',
        options: ['Heart disease', 'High blood pressure', 'Diabetes', 'High cholesterol', 'Lung disease', 'Acid reflux', 'None'],
        required: true
      },
      {
        id: 'medications',
        text: 'Are you taking any medications?',
        type: 'text-list',
        placeholder: 'Enter medication names (optional)',
        required: false
      },
      {
        id: 'familyHistory',
        text: 'Any family history of heart disease?',
        type: 'single',
        options: ['Yes - parent/sibling before age 55', 'Yes - other relative', 'No', 'Unknown'],
        required: true
      }
    ],
    conditions: [
      {
        name: 'Acute Coronary Syndrome (Heart Attack)',
        category: 'Cardiac Emergency',
        urgency: 'critical',
        criteria: ['crushing', 'left arm', 'jaw', 'sweating', 'shortness', 'nausea'],
        weight: 5,
        description: 'Blood flow to heart muscle is blocked',
        action: 'Call 911 immediately'
      },
      {
        name: 'Aortic Dissection',
        category: 'Vascular Emergency',
        urgency: 'critical',
        criteria: ['tearing', 'ripping', 'back', 'severe', 'sudden'],
        weight: 5,
        description: 'Tear in the major artery from the heart',
        action: 'Call 911 immediately'
      },
      {
        name: 'Pulmonary Embolism',
        category: 'Pulmonary Emergency',
        urgency: 'critical',
        criteria: ['shortness', 'sudden', 'sharp', 'cough', 'dizziness'],
        weight: 4,
        description: 'Blood clot in the lungs',
        action: 'Emergency room evaluation needed'
      },
      {
        name: 'Unstable Angina',
        category: 'Cardiac',
        urgency: 'high',
        criteria: ['pressure', 'exertion', 'rest helps', 'heart disease'],
        weight: 3,
        description: 'Reduced blood flow to heart',
        action: 'Urgent medical evaluation today'
      },
      {
        name: 'Pericarditis',
        category: 'Cardiac',
        urgency: 'moderate',
        criteria: ['sharp', 'breathing worsens', 'sitting helps', 'fever'],
        weight: 2,
        description: 'Inflammation of heart lining',
        action: 'See doctor within 24 hours'
      },
      {
        name: 'GERD/Acid Reflux',
        category: 'Gastrointestinal',
        urgency: 'low',
        criteria: ['burning', 'eating', 'lying down worse', 'acid reflux'],
        weight: 1,
        description: 'Stomach acid backing up into esophagus',
        action: 'Try antacids, schedule appointment'
      },
      {
        name: 'Costochondritis',
        category: 'Musculoskeletal',
        urgency: 'low',
        criteria: ['sharp', 'movement worsens', 'pressing', 'reproducible'],
        weight: 1,
        description: 'Inflammation of rib cartilage',
        action: 'Rest, anti-inflammatories, follow up if needed'
      },
      {
        name: 'Panic Attack/Anxiety',
        category: 'Psychological',
        urgency: 'low',
        criteria: ['anxiety', 'stressed', 'palpitations', 'dizziness', 'shortness'],
        weight: 1,
        description: 'Physical symptoms from anxiety',
        action: 'Calming techniques, consider counseling'
      },
      {
        name: 'Pneumonia',
        category: 'Pulmonary',
        urgency: 'moderate',
        criteria: ['fever', 'cough', 'sharp', 'breathing worsens'],
        weight: 2,
        description: 'Lung infection',
        action: 'See doctor today for evaluation'
      },
      {
        name: 'Pleurisy',
        category: 'Pulmonary',
        urgency: 'moderate',
        criteria: ['sharp', 'breathing worsens', 'cough', 'fever'],
        weight: 2,
        description: 'Inflammation of lung lining',
        action: 'Medical evaluation recommended'
      }
    ]
  }
};

// Calculate diagnosis probability
const calculateDiagnoses = (answers, conditions) => {
  const scoredConditions = conditions.map(condition => {
    let score = 0;
    let matchedCriteria = [];
    
    // Convert answers to searchable text
    const answerText = Object.values(answers).flat().join(' ').toLowerCase();
    
    // Check each criterion
    condition.criteria.forEach(criterion => {
      if (answerText.includes(criterion.toLowerCase())) {
        score += condition.weight;
        matchedCriteria.push(criterion);
      }
    });
    
    // Age adjustment for cardiac conditions
    const age = parseInt(answers.demographics?.age);
    if (condition.category.includes('Cardiac') && age > 50) {
      score += 1;
    }
    
    // Sex adjustment for cardiac conditions
    if (condition.category.includes('Cardiac') && answers.demographics?.sex === 'Male' && age > 40) {
      score += 0.5;
    }
    
    // Specific pattern matching
    if (condition.name.includes('Heart Attack')) {
      if (answers.character === 'Crushing/Pressure' && 
          (answers.radiation?.includes('Left arm') || answers.radiation?.includes('Jaw'))) {
        score += 3;
      }
    }
    
    if (condition.name.includes('Aortic Dissection')) {
      if (answers.character === 'Tearing/Ripping' && answers.radiation?.includes('Back')) {
        score += 4;
      }
    }
    
    if (condition.name.includes('GERD')) {
      if (answers.character === 'Burning' && answers.modifyingFactors?.includes('Eating affects it')) {
        score += 2;
      }
    }
    
    return {
      ...condition,
      score,
      matchedCriteria,
      probability: score > 0 ? Math.min((score / (condition.weight * condition.criteria.length)) * 100, 95) : 0
    };
  });
  
  return scoredConditions
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
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

// Question Card Component
function QuestionCard({ question, answer, onChange, onComplete, index, isActive, onEdit }) {
  const [localAnswer, setLocalAnswer] = useState(answer);
  const cardRef = useRef(null);
  
  useEffect(() => {
    if (isActive && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isActive]);
  
  const handleComplete = () => {
    if (question.required && !isAnswerComplete()) return;
    onChange(localAnswer);
    onComplete();
  };
  
  const isAnswerComplete = () => {
    if (question.type === 'demographics') {
      return localAnswer?.age && localAnswer?.sex;
    }
    if (question.type === 'multiple') {
      return localAnswer && localAnswer.length > 0;
    }
    return !!localAnswer;
  };
  
  const isCompleted = answer && isAnswerComplete();
  
  return (
    <div 
      ref={cardRef}
      className={`mb-6 transition-all duration-500 ${
        isActive ? 'scale-100 opacity-100' : isCompleted ? 'scale-95 opacity-100' : 'scale-95 opacity-50'
      }`}
    >
      <div className={`bg-white rounded-2xl shadow-lg overflow-hidden ${
        isActive ? 'ring-4 ring-indigo-500 ring-opacity-50' : ''
      }`}>
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <span className="text-sm font-medium text-indigo-600 mb-1 block">
                Question {index + 1}
              </span>
              <h3 className="text-xl font-semibold text-gray-800">
                {question.text}
              </h3>
            </div>
            {isCompleted && !isActive && (
              <button
                onClick={onEdit}
                className="p-2 text-gray-500 hover:text-indigo-600 transition"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {(isActive || isCompleted) && (
            <div className="space-y-4">
              {/* Demographics with Male/Female buttons */}
              {question.type === 'demographics' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={localAnswer?.age || ''}
                      onChange={(e) => setLocalAnswer({ ...localAnswer, age: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter your age"
                      disabled={!isActive}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Biological Sex <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setLocalAnswer({ ...localAnswer, sex: 'Male' })}
                        disabled={!isActive}
                        className={`py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                          localAnswer?.sex === 'Male'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        } ${!isActive ? 'cursor-not-allowed' : ''}`}
                      >
                        Male
                      </button>
                      <button
                        onClick={() => setLocalAnswer({ ...localAnswer, sex: 'Female' })}
                        disabled={!isActive}
                        className={`py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                          localAnswer?.sex === 'Female'
                            ? 'border-pink-500 bg-pink-50 text-pink-700'
                            : 'border-gray-200 hover:border-gray-300'
                        } ${!isActive ? 'cursor-not-allowed' : ''}`}
                      >
                        Female
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Single choice */}
              {question.type === 'single' && (
                <div className="space-y-2">
                  {question.options.map(option => (
                    <button
                      key={option}
                      onClick={() => setLocalAnswer(option)}
                      disabled={!isActive}
                      className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                        localAnswer === option
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${!isActive ? 'cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{option}</span>
                        {localAnswer === option && (
                          <CheckCircle className="w-5 h-5 text-indigo-600" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              {/* Multiple choice */}
              {question.type === 'multiple' && (
                <div className="space-y-2">
                  {question.options.map(option => {
                    const isSelected = localAnswer?.includes(option);
                    return (
                      <button
                        key={option}
                        onClick={() => {
                          if (!isActive) return;
                          const current = localAnswer || [];
                          if (option === 'None') {
                            setLocalAnswer(['None']);
                          } else {
                            const filtered = current.filter(o => o !== 'None');
                            if (isSelected) {
                              setLocalAnswer(filtered.filter(o => o !== option));
                            } else {
                              setLocalAnswer([...filtered, option]);
                            }
                          }
                        }}
                        disabled={!isActive}
                        className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                            : 'border-gray-200 hover:border-gray-300'
                        } ${!isActive ? 'cursor-not-allowed' : ''}`}
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
              
              {/* Slider */}
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
                    value={localAnswer || question.min}
                    onChange={(e) => setLocalAnswer(parseInt(e.target.value))}
                    disabled={!isActive}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="text-center text-3xl font-bold text-indigo-600">
                    {localAnswer || question.min}
                  </div>
                </div>
              )}
              
              {/* Body map */}
              {question.type === 'body-map' && (
                <div className="grid grid-cols-2 gap-2">
                  {question.options.map(option => (
                    <button
                      key={option}
                      onClick={() => setLocalAnswer(option)}
                      disabled={!isActive}
                      className={`px-3 py-2 rounded-lg border-2 transition-all ${
                        localAnswer === option
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${!isActive ? 'cursor-not-allowed' : ''}`}
                    >
                      <Heart className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-sm font-medium">{option}</span>
                    </button>
                  ))}
                </div>
              )}
              
              {/* Text list */}
              {question.type === 'text-list' && (
                <div>
                  <textarea
                    value={localAnswer || ''}
                    onChange={(e) => setLocalAnswer(e.target.value)}
                    placeholder={question.placeholder}
                    disabled={!isActive}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    rows={3}
                  />
                </div>
              )}
            </div>
          )}
          
          {isActive && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleComplete}
                disabled={question.required && !isAnswerComplete()}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  question.required && !isAnswerComplete()
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                Continue
                <ChevronRight className="inline-block w-5 h-5 ml-2" />
              </button>
            </div>
          )}
          
          {isCompleted && !isActive && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <div className="flex items-center text-green-700">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="font-medium">Answer saved</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MedicalSymptomChecker() {
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [urgencyLevel, setUrgencyLevel] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [topDiagnoses, setTopDiagnoses] = useState([]);
  
  const symptom = 'Chest Pain';
  const module = symptomModuleMap[symptom];
  const questions = module?.questions || [];
  
  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };
  
  const handleQuestionComplete = (index) => {
    if (index === questions.length - 1) {
      processResults();
    } else {
      setCurrentQuestion(index + 1);
    }
  };
  
  const handleEditQuestion = (index) => {
    setCurrentQuestion(index);
  };
  
  const processResults = () => {
    const { score, factors } = calculateRiskScore(answers, module);
    
    // Calculate top diagnoses
    const diagnoses = calculateDiagnoses(answers, module.conditions);
    setTopDiagnoses(diagnoses);
    
    // Determine urgency based on diagnoses and risk score
    let urgency;
    if (diagnoses[0]?.urgency === 'critical' || score >= 10) urgency = 'critical';
    else if (diagnoses[0]?.urgency === 'high' || score >= 7) urgency = 'high';
    else if (diagnoses[0]?.urgency === 'moderate' || score >= 4) urgency = 'moderate';
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
    
    setRecommendations(recs);
    setShowResults(true);
  };
  
  if (showResults) {
    const { score, factors } = calculateRiskScore(answers, module);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className={`p-6 text-white ${
              urgencyLevel === 'critical' ? 'bg-gradient-to-r from-red-600 to-red-700' :
              urgencyLevel === 'high' ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
              urgencyLevel === 'moderate' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
              'bg-gradient-to-r from-green-500 to-green-600'
            }`}>
              <h2 className="text-3xl font-bold mb-2">Assessment Complete</h2>
              <p className="text-xl opacity-90">
                Risk Level: {urgencyLevel.charAt(0).toUpperCase() + urgencyLevel.slice(1)}
              </p>
            </div>
            
            {/* Top 3 Diagnoses */}
            <div className="p-6 border-b bg-gradient-to-r from-indigo-50 to-purple-50">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Stethoscope className="w-6 h-6 mr-2 text-indigo-600" />
                Most Likely Diagnoses
              </h3>
              <div className="space-y-4">
                {topDiagnoses.map((diagnosis, idx) => (
                  <div key={idx} className={`p-4 rounded-lg border-2 ${
                    idx === 0 ? 'border-indigo-300 bg-white' : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-lg font-bold ${
                            idx === 0 ? 'text-indigo-600' : 'text-gray-600'
                          }`}>
                            #{idx + 1}
                          </span>
                          <h4 className="text-lg font-semibold">{diagnosis.name}</h4>
                        </div>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${
                          diagnosis.urgency === 'critical' ? 'bg-red-100 text-red-700' :
                          diagnosis.urgency === 'high' ? 'bg-orange-100 text-orange-700' :
                          diagnosis.urgency === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {diagnosis.category}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-indigo-600">
                          {Math.round(diagnosis.probability)}%
                        </div>
                        <div className="text-xs text-gray-500">likelihood</div>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{diagnosis.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Matched: {diagnosis.matchedCriteria.join(', ')}
                      </div>
                      <div className="text-sm font-medium text-indigo-600">
                        {diagnosis.action}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
                  const report = generateReport(answers, score, factors, urgencyLevel, topDiagnoses);
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Chest Pain Assessment</h1>
          <div className="flex items-center justify-between">
            <p className="text-gray-600">Answer all questions for accurate evaluation</p>
            <span className="text-sm font-medium text-indigo-600">
              {Object.keys(answers).length} of {questions.length} completed
            </span>
          </div>
          {/* Progress bar */}
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
              style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
            />
          </div>
        </div>
        
        {/* Questions - Vertical Stack */}
        <div className="space-y-6">
          {questions.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              answer={answers[question.id]}
              onChange={(answer) => handleAnswerChange(question.id, answer)}
              onComplete={() => handleQuestionComplete(index)}
              index={index}
              isActive={currentQuestion === index}
              onEdit={() => handleEditQuestion(index)}
            />
          ))}
        </div>
        
        {/* Submit Button */}
        {Object.keys(answers).length === questions.length && (
          <div className="mt-8 text-center">
            <button
              onClick={processResults}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl text-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
            >
              Get Your Assessment Results
            </button>
          </div>
        )}
        
        {/* Emergency Notice */}
        <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg sticky bottom-4">
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
        
        .slider:disabled::-webkit-slider-thumb {
          background: #9ca3af;
          cursor: not-allowed;
        }
        
        .slider:disabled::-moz-range-thumb {
          background: #9ca3af;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

// Helper function to generate report
function generateReport(answers, score, factors, urgencyLevel, diagnoses) {
  const timestamp = new Date().toLocaleString();
  return {
    timestamp,
    urgencyLevel,
    riskScore: score,
    riskFactors: factors,
    topDiagnoses: diagnoses.map(d => ({
      condition: d.name,
      probability: `${Math.round(d.probability)}%`,
      category: d.category,
      recommendedAction: d.action
    })),
    responses: answers,
    recommendation: urgencyLevel === 'critical' ? 'IMMEDIATE EMERGENCY CARE REQUIRED' :
                    urgencyLevel === 'high' ? 'Visit Emergency Room' :
                    urgencyLevel === 'moderate' ? 'See Doctor Today' :
                    'Monitor and Schedule Appointment if Needed'
  };
}
