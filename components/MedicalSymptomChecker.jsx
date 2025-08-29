"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
    AlertCircle, Activity, Clock, User, AlertTriangle, CheckCircle, Info, Phone, Calendar, 
    FileText, Heart, ChevronUp, Edit2, Stethoscope, Wind, Sun, UserCheck, BarChart2, BrainCircuit, ShieldCheck,
    ChevronRight, ChevronLeft, Droplet, Thermometer, Bone, Smile, Circle, Zap, Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- DATA STRUCTURES (EXPANDED) ---
// Expanded to include multiple conditions, lifestyle factors, and new data points for advanced analysis.

const lifestyleQuestions = [
    { id: 'diet', text: 'How would you describe your diet?', type: 'single', options: ['Healthy/Balanced', 'Average', 'Unhealthy/Processed'], risk: { 'Unhealthy/Processed': 2 } },
    { id: 'exercise', text: 'How often do you exercise?', type: 'single', options: ['Regularly (3+/week)', 'Occasionally (1-2/week)', 'Rarely/Never'], risk: { 'Rarely/Never': 2 } },
    { id: 'smoking', text: 'Do you smoke or use tobacco products?', type: 'single', options: ['Never', 'Former Smoker', 'Current Smoker'], risk: { 'Current Smoker': 3 } },
    { id: 'alcohol', text: 'How often do you consume alcohol?', type: 'single', options: ['Rarely/Never', 'Moderately (1-2 drinks/day)', 'Heavily (3+ drinks/day)'], risk: { 'Heavily (3+ drinks/day)': 2 } },
    { id: 'stress', text: 'What is your typical stress level?', type: 'single', options: ['Low', 'Moderate', 'High'], risk: { 'High': 1 } },
];

const symptomModules = {
  'Chest Discomfort': {
    icon: Heart,
    color: 'red',
    questions: [
      { id: 'demographics', text: 'First, let\'s get some basic information.', type: 'demographics', required: true },
      { id: 'onset', text: 'When did the discomfort start?', type: 'timeline', options: [
          { label: 'Just Now', value: '< 1 hour', urgency: 'critical' },
          { label: 'Today', value: '1-24 hours', urgency: 'high' },
          { label: 'This Week', value: '1-7 days', urgency: 'moderate' },
          { label: 'Awhile Ago', value: '> 1 week', urgency: 'low' },
        ], required: true },
      { id: 'character', text: 'How would you describe the feeling?', type: 'grid', options: ['Crushing/Pressure', 'Sharp/Stabbing', 'Burning', 'Tearing/Ripping', 'Dull Ache', 'Tightness'], required: true },
      { id: 'location', text: 'Pinpoint the location of the discomfort.', type: 'body-map', area: 'chest', required: true },
      { id: 'associated', text: 'Are you experiencing any other symptoms?', type: 'symptom-grid', options: ['Shortness of Breath', 'Sweating', 'Nausea/Vomiting', 'Dizziness', 'Palpitations', 'Fever', 'Cough'], required: true },
      { id: 'history', text: 'Do you have a history of any of these conditions?', type: 'multiple', options: ['Heart Disease', 'High Blood Pressure', 'Diabetes', 'High Cholesterol', 'Acid Reflux'], required: true },
    ],
    conditions: [
        { name: 'Heart Attack', urgency: 'critical', criteria: { character: ['Crushing/Pressure'], associated: ['Shortness of Breath', 'Sweating'], location: ['center-chest', 'left-chest'], history: ['Heart Disease', 'Diabetes'] }, weight: 5, age: { min: 45 }, prevalence: 'Common cause of ER visits.', seasonal: [] },
        { name: 'Aortic Dissection', urgency: 'critical', criteria: { character: ['Tearing/Ripping'] }, weight: 5, age: { min: 60 }, prevalence: 'Rare but life-threatening.', seasonal: [] },
        { name: 'Pulmonary Embolism', urgency: 'critical', criteria: { character: ['Sharp/Stabbing'], associated: ['Shortness of Breath', 'Cough'] }, weight: 4, prevalence: 'Often linked to recent surgery or long travel.', seasonal: [] },
        { name: 'GERD/Acid Reflux', urgency: 'low', criteria: { character: ['Burning'], history: ['Acid Reflux'] }, weight: 1, age: {}, prevalence: 'Very common.', seasonal: [] },
    ]
  },
  'Headache': {
    icon: BrainCircuit,
    color: 'purple',
    questions: [
      { id: 'demographics', text: 'First, let\'s get some basic information.', type: 'demographics', required: true },
      { id: 'onset', text: 'When did the headache start?', type: 'timeline', options: [
          { label: 'Just Now', value: '< 1 hour', urgency: 'critical' },
          { label: 'Today', value: '1-24 hours', urgency: 'high' },
          { label: 'This Week', value: '1-7 days', urgency: 'moderate' },
          { label: 'Awhile Ago', value: '> 1 week', urgency: 'low' },
        ], required: true },
      { id: 'character', text: 'How would you describe the pain?', type: 'grid', options: ['Throbbing/Pulsating', 'Constant Pressure', 'Sharp/Stabbing', 'Thunderclap (Sudden & Severe)'], required: true },
      { id: 'location', text: 'Where on your head do you feel it?', type: 'body-map', area: 'head', required: true },
      { id: 'associated', text: 'Any other symptoms?', type: 'symptom-grid', options: ['Nausea/Vomiting', 'Sensitivity to Light', 'Sensitivity to Sound', 'Vision Changes', 'Fever', 'Stiff Neck'], required: true },
      { id: 'history', text: 'Do you have a history of headaches?', type: 'multiple', options: ['Migraines', 'Tension Headaches', 'Sinus Issues', 'Head Injury'], required: true },
    ],
    conditions: [
        { name: 'Subarachnoid Hemorrhage', urgency: 'critical', criteria: { character: ['Thunderclap (Sudden & Severe)'], associated: ['Stiff Neck', 'Vomiting'] }, weight: 5, age: {}, prevalence: 'Extremely serious, requires immediate attention.', seasonal: [] },
        { name: 'Migraine', urgency: 'moderate', criteria: { character: ['Throbbing/Pulsating'], associated: ['Nausea/Vomiting', 'Sensitivity to Light'], history: ['Migraines'] }, weight: 3, age: { max: 50 }, prevalence: 'Common, especially in younger adults.', seasonal: [] },
        { name: 'Tension Headache', urgency: 'low', criteria: { character: ['Constant Pressure'], location: ['forehead', 'temples', 'back-head'] }, weight: 1, age: {}, prevalence: 'Most common type of headache.', seasonal: ['spring'] }, // Example seasonal link
        { name: 'Meningitis', urgency: 'high', criteria: { associated: ['Fever', 'Stiff Neck', 'Sensitivity to Light'] }, weight: 4, age: { max: 25 }, prevalence: 'Serious infection, more common in communal living.', seasonal: [] },
    ]
  },
  'Abdominal Pain': {
    icon: Droplet,
    color: 'blue',
    questions: [
        { id: 'demographics', text: 'First, let\'s get some basic information.', type: 'demographics', required: true },
        { id: 'onset', text: 'When did the pain start?', type: 'timeline', options: [
          { label: 'Just Now', value: '< 1 hour', urgency: 'critical' },
          { label: 'Today', value: '1-24 hours', urgency: 'high' },
          { label: 'This Week', value: '1-7 days', urgency: 'moderate' },
          { label: 'Awhile Ago', value: '> 1 week', urgency: 'low' },
        ], required: true },
        { id: 'character', text: 'How would you describe the pain?', type: 'grid', options: ['Sharp/Cramping', 'Dull/Achy', 'Burning', 'Bloating/Gas'], required: true },
        { id: 'location', text: 'Where is the pain located?', type: 'body-map', area: 'abdomen', required: true },
        { id: 'associated', text: 'Any other symptoms?', type: 'symptom-grid', options: ['Nausea/Vomiting', 'Fever', 'Diarrhea', 'Constipation', 'Bloody Stool'], required: true },
    ],
    conditions: [
        { name: 'Appendicitis', urgency: 'high', criteria: { location: ['right-lower-quadrant'], associated: ['Fever', 'Nausea/Vomiting'] }, weight: 4, age: { max: 40 }, prevalence: 'Common surgical emergency.', seasonal: [] },
        { name: 'Gastroenteritis', urgency: 'low', criteria: { character: ['Sharp/Cramping'], associated: ['Nausea/Vomiting', 'Diarrhea'] }, weight: 1, age: {}, prevalence: 'Very common ("stomach flu").', seasonal: ['winter'] },
    ]
  }
};


// --- UTILITY & LOGIC FUNCTIONS ---

const getSeason = () => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
};

const analysisEngine = (answers, module) => {
    if (!module || !answers.demographics) return { diagnoses: [], risk: { score: 0, factors: [] }, confidence: 0 };
    
    const { conditions } = module;
    const lifestyleRisk = Object.keys(answers.lifestyle || {}).reduce((acc, key) => {
        const question = lifestyleQuestions.find(q => q.id === key);
        const answer = answers.lifestyle[key];
        return acc + (question?.risk?.[answer] || 0);
    }, 0);

    let totalPossibleScore = 0;
    const scoredConditions = conditions.map(cond => {
        let score = 0;
        let matchedCriteria = [];

        Object.entries(cond.criteria).forEach(([key, values]) => {
            const userAnswer = answers[key];
            if (!userAnswer) return;

            const userAnswersArray = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
            if (key === 'associated') { // Handle symptom grid with severity
                userAnswersArray.forEach(symptomObj => {
                    if (values.includes(symptomObj.name)) {
                        score += cond.weight * (symptomObj.severity / 3); // Weight by severity
                        matchedCriteria.push(`${symptomObj.name} (Severity ${symptomObj.severity})`);
                    }
                });
            } else {
                 userAnswersArray.forEach(ans => {
                    if (values.includes(ans)) {
                        score += cond.weight;
                        matchedCriteria.push(ans);
                    }
                });
            }
        });

        // Age Correlation
        const age = parseInt(answers.demographics.age, 10);
        if (cond.age.min && age < cond.age.min) score *= 0.5;
        if (cond.age.max && age > cond.age.max) score *= 0.5;
        
        totalPossibleScore = Math.max(totalPossibleScore, score);
        return { ...cond, score, matchedCriteria };
    });

    const totalScoreSum = scoredConditions.reduce((sum, cond) => sum + cond.score, 0);
    if (totalScoreSum === 0) {
       return { diagnoses: [], risk: { score: 0, factors: [] }, confidence: 50 };
    }
    
    const top3 = scoredConditions
        .map(c => ({ ...c, probability: totalScoreSum > 0 ? (c.score / totalScoreSum) * 100 : 0 }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .filter(c => c.score > 0);

    // Risk Stratification
    let riskScore = lifestyleRisk;
    let riskFactors = [];
    if (lifestyleRisk > 3) riskFactors.push('Lifestyle Factors');
    if (top3[0]) {
        const primaryUrgency = top3[0].urgency;
        if (primaryUrgency === 'critical') riskScore += 10;
        if (primaryUrgency === 'high') riskScore += 7;
        if (primaryUrgency === 'moderate') riskScore += 4;
        riskFactors.push(`Top concern: ${top3[0].name}`);
    }
    const onsetUrgency = module.questions.find(q=>q.id==='onset').options.find(o=>o.value === answers.onset)?.urgency
    if (onsetUrgency === 'critical') {
        riskScore += 5;
        riskFactors.push('Sudden Onset');
    }

    // Confidence Score
    const answeredQuestions = Object.keys(answers).length - 2; // Exclude demographics & lifestyle
    const totalQuestions = module.questions.length -1;
    const completeness = (answeredQuestions / totalQuestions) * 100;
    const specificity = top3.length > 0 ? (top3[0].score / totalScoreSum) * 100 : 0; // How much the top diagnosis stands out
    const confidence = Math.min(95, Math.round((completeness * 0.6) + (specificity * 0.4)));

    return { diagnoses: top3, risk: { score: riskScore, factors: riskFactors }, confidence };
};


// --- UI COMPONENTS ---

const GlassmorphismCard = ({ children, className = '', ...props }) => (
    <motion.div
        className={`bg-white/50 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        {...props}
    >
        {children}
    </motion.div>
);

const SymptomSelector = ({ onSelect }) => (
    <GlassmorphismCard className="p-8 text-center">
        <Stethoscope size={48} className="mx-auto text-white/80 mb-4" />
        <h2 className="text-3xl font-bold text-gray-800 mb-2">SymptoSphere AI</h2>
        <p className="text-gray-700 mb-8">Please select your primary symptom to begin.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(symptomModules).map(([name, { icon: Icon, color }]) => (
                <motion.button
                    key={name}
                    onClick={() => onSelect(name)}
                    className={`p-6 rounded-xl text-left transition-all duration-300 bg-white/70 hover:bg-white shadow-md hover:shadow-2xl hover:-translate-y-2 border-t-2 border-${color}-300`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Icon size={32} className={`mb-3 text-${color}-500`} />
                    <span className="text-xl font-semibold text-gray-800">{name}</span>
                </motion.button>
            ))}
        </div>
    </GlassmorphismCard>
);

const DisclaimerModal = ({ onAccept }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <GlassmorphismCard className="max-w-lg p-8">
            <div className="flex items-center gap-4 mb-4">
                <AlertTriangle size={40} className="text-yellow-500" />
                <h2 className="text-2xl font-bold text-gray-800">Important Disclaimer</h2>
            </div>
            <p className="text-gray-700 mb-6">
                SymptoSphere is an informational tool and not a substitute for professional medical advice, diagnosis, or treatment.
                <b> If you believe you are having a medical emergency, call 911 immediately.</b>
            </p>
            <motion.button
                onClick={onAccept}
                className="w-full bg-teal-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-teal-700 transition-all"
                whileHover={{ scale: 1.02 }}
            >
                I Understand and Accept
            </motion.button>
        </GlassmorphismCard>
    </div>
);

// --- INTERACTIVE INPUT COMPONENTS ---

const InteractiveBodyMap = ({ area, selected, onSelect, disabled }) => {
    // A more detailed and anatomically correct SVG structure
    const BodySVG = () => (
        <g>
            {/* Head */}
            <path d="M 50,70 A 50,50 0 1 1 150,70 A 40,60 0 0 1 120,150 L 80,150 A 40,60 0 0 1 50,70 Z" fill="#E6E6FA" stroke="#b2b2d8" strokeWidth="1"/>
            {/* Torso */}
            <path d="M 80,150 C 60,200 60,250 80,300 L 120,300 C 140,250 140,200 120,150 Z" fill="#E6E6FA" stroke="#b2b2d8" strokeWidth="1"/>
        </g>
    );

    const locations = {
        head: [
            { id: 'forehead', label: 'Forehead', path: "M60,70 Q100,50 140,70 L130,90 L70,90Z" },
            { id: 'temples', label: 'Temples', path: "M50,70 L70,90 V110 L55,100Z M150,70 L130,90 V110 L145,100Z" },
            { id: 'back-head', label: 'Back', path: "M70,110 C 60,130 100,155 140,130 L120,150 L80,150 Z" }
        ],
        chest: [
            { id: 'left-chest', label: 'Left Chest', path: "M80,150 C65,180 70,220 85,240 L100,240 L100,150Z" },
            { id: 'center-chest', label: 'Center Chest', path: "M100,150 L100,240 L115,240 L115,150Z" },
            { id: 'right-chest', label: 'Right Chest', path: "M115,150 L115,240 L130,240 C145,220 150,180 135,150Z" }
        ],
        abdomen: [
            { id: 'right-upper-quadrant', label: 'RUQ', path: "M100,245 h15 v25 h-15 z" },
            { id: 'left-upper-quadrant', label: 'LUQ', path: "M85,245 h15 v25 h-15 z" },
            { id: 'right-lower-quadrant', label: 'RLQ', path: "M100,270 h15 v25 h-15 z" },
            { id: 'left-lower-quadrant', label: 'LLQ', path: "M85,270 h15 v25 h-15 z" },
        ]
    };

    const activeArea = locations[area];
    const color = {head: 'purple', chest: 'red', abdomen: 'blue'}[area];

    return (
        <div className="p-2 bg-slate-100/50 rounded-lg">
            <svg viewBox="20 40 160 280" className={`w-full h-auto max-h-[400px] ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}>
                <BodySVG />
                {activeArea.map(({ id, path }) => (
                    <path
                        key={id}
                        d={path}
                        onClick={() => !disabled && onSelect(id)}
                        className={`transition-all duration-200 ${selected === id ? `fill-${color}-500 stroke-${color}-700 opacity-80` : `fill-${color}-300/60 hover:fill-${color}-400/80 stroke-transparent`} ${disabled ? '' : 'cursor-pointer'}`}
                    />
                ))}
            </svg>
        </div>
    );
};

const TimelineSelector = ({ options, selected, onSelect, disabled }) => (
    <div className="flex justify-between items-center p-2 bg-slate-100/50 rounded-lg">
        {options.map(({ label, value, urgency }) => {
            const colors = {
                critical: 'bg-red-500 ring-red-300',
                high: 'bg-orange-500 ring-orange-300',
                moderate: 'bg-yellow-500 ring-yellow-300',
                low: 'bg-green-500 ring-green-300',
            };
            return (
                <div key={value} className="flex flex-col items-center flex-1">
                    <button
                        onClick={() => !disabled && onSelect(value)}
                        disabled={disabled}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${colors[urgency]} ${selected === value ? 'ring-4 scale-110' : 'hover:scale-105'} ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
                    >
                    </button>
                    <span className="text-xs mt-2 font-semibold text-gray-600">{label}</span>
                </div>
            );
        })}
    </div>
);

const SymptomGrid = ({ options, selected, onSelect, disabled }) => {
    const handleSelect = (optionName) => {
        if (disabled) return;
        const existing = selected.find(s => s.name === optionName);
        if (existing) {
            const newSeverity = (existing.severity % 3) + 1;
            onSelect(selected.map(s => s.name === optionName ? { ...s, severity: newSeverity } : s));
        } else {
            onSelect([...selected, { name: optionName, severity: 1 }]);
        }
    };
    const handleDeselect = (e, optionName) => {
        e.stopPropagation();
        if (disabled) return;
        onSelect(selected.filter(s => s.name !== optionName));
    };
    
    const handleKeyDown = (e, optionName) => {
        if (disabled) return;
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleSelect(optionName);
        }
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {options.map(option => {
                const current = selected.find(s => s.name === option);
                return (
                    <div
                        key={option}
                        onClick={() => handleSelect(option)}
                        onKeyDown={(e) => handleKeyDown(e, option)}
                        role="button"
                        tabIndex={disabled ? -1 : 0}
                        aria-pressed={!!current}
                        className={`relative p-4 rounded-lg text-center transition-all duration-200 border-2 ${current ? 'border-teal-500 bg-teal-50' : 'border-gray-200 bg-white/80 hover:border-gray-300'} ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                    >
                        <span className={`font-semibold ${current ? 'text-teal-700' : 'text-gray-700'}`}>{option}</span>
                        {current && (
                            <>
                                <button aria-label={`Remove ${option}`} onClick={(e) => handleDeselect(e, option)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs font-bold flex items-center justify-center z-10">&times;</button>
                                <div className="flex justify-center gap-1 mt-2">
                                    {[1, 2, 3].map(level => (
                                        <div key={level} className={`w-3 h-3 rounded-full ${level <= current.severity ? 'bg-teal-500' : 'bg-gray-300'}`}></div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                );
            })}
        </div>
    );
};


// --- QUESTION FLOW ---
const QuestionCard = ({ question, answer, onChange, onBack, onNext, isFirst, isLast }) => {
    const isComplete = () => {
        if (!question.required) return true;
        if (question.type === 'demographics') return answer?.age && answer?.sex;
        if (Array.isArray(answer)) return answer.length > 0;
        return !!answer;
    };
    
    const renderInput = () => {
        switch (question.type) {
            case 'demographics':
                return (
                    <div className="space-y-4">
                        <input type="number" placeholder="Age" value={answer?.age || ''} onChange={e => onChange({ ...answer, age: e.target.value })} className="w-full p-3 rounded-lg border border-gray-300" />
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => onChange({ ...answer, sex: 'Male' })} className={`py-3 px-4 rounded-lg border-2 font-medium ${answer?.sex === 'Male' ? 'border-teal-500 bg-teal-50' : 'border-gray-200'}`}>Male</button>
                            <button onClick={() => onChange({ ...answer, sex: 'Female' })} className={`py-3 px-4 rounded-lg border-2 font-medium ${answer?.sex === 'Female' ? 'border-teal-500 bg-teal-50' : 'border-gray-200'}`}>Female</button>
                        </div>
                    </div>
                );
            case 'timeline':
                return <TimelineSelector options={question.options} selected={answer} onSelect={onChange} />;
            case 'grid':
                return (<div className="grid grid-cols-2 gap-3">
                    {question.options.map(opt => <button key={opt} onClick={() => onChange(opt)} className={`p-4 rounded-lg border-2 font-medium ${answer === opt ? 'border-teal-500 bg-teal-50' : 'border-gray-200'}`}>{opt}</button>)}
                </div>)
            case 'body-map':
                return <InteractiveBodyMap area={question.area} selected={answer} onSelect={onChange} />;
            case 'symptom-grid':
                return <SymptomGrid options={question.options} selected={answer || []} onSelect={onChange} />;
            case 'single':
            case 'multiple':
                const isMultiple = question.type === 'multiple';
                const handleSelect = (option) => {
                    if (isMultiple) {
                        const current = answer || [];
                        const newAnswer = current.includes(option) ? current.filter(item => item !== option) : [...current, option];
                        onChange(newAnswer);
                    } else {
                        onChange(option);
                    }
                };
                 return (
                    <div className="space-y-2">
                        {question.options.map(option => {
                            const isSelected = isMultiple ? (answer || []).includes(option) : answer === option;
                            return (
                                <button key={option} onClick={() => handleSelect(option)} className={`w-full text-left px-4 py-3 rounded-lg border-2 ${isSelected ? 'border-teal-500 bg-teal-50' : 'border-gray-200'}`}>
                                    {option}
                                </button>
                            );
                        })}
                    </div>
                );
            default: return null;
        }
    };
    
    return (
        <GlassmorphismCard className="p-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">{question.text}</h3>
            <div>{renderInput()}</div>
            <div className="flex justify-between mt-8">
                <button onClick={onBack} disabled={isFirst} className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-white/80 text-gray-700 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed">
                    <ChevronLeft size={20} /> Back
                </button>
                <button onClick={onNext} disabled={!isComplete()} className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-teal-600 text-white hover:bg-teal-700 disabled:bg-gray-400">
                    {isLast ? 'See Results' : 'Next'} <ChevronRight size={20} />
                </button>
            </div>
        </GlassmorphismCard>
    );
};

const Questionnaire = ({ module, onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({ lifestyle: {} });

    const questions = useMemo(() => [
        ...module.questions,
        ...lifestyleQuestions.map(q => ({...q, id: `lifestyle.${q.id}`}))
    ], [module]);

    const handleNext = () => {
        if (currentStep < questions.length - 1) {
            setCurrentStep(s => s + 1);
        } else {
            const finalAnswers = Object.entries(answers).reduce((acc, [key, val]) => {
                if (key.startsWith('lifestyle.')) {
                    acc.lifestyle[key.replace('lifestyle.', '')] = val;
                } else {
                    acc[key] = val;
                }
                return acc;
            }, { lifestyle: {} });
            onComplete(finalAnswers);
        }
    };
    
    const handleBack = () => setCurrentStep(s => Math.max(0, s - 1));

    const handleAnswer = (questionId, answer) => {
        setAnswers(prev => ({...prev, [questionId]: answer}));
    };

    const currentQuestion = questions[currentStep];

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="w-full bg-white/30 rounded-full h-2.5 mb-4">
                <motion.div 
                    className="bg-gradient-to-r from-cyan-500 to-teal-500 h-2.5 rounded-full"
                    animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                />
            </div>
             <div className="space-y-2 mb-4 max-h-48 overflow-y-auto p-1">
                {questions.slice(0, currentStep).map((q, index) => (
                    <motion.button
                        key={q.id}
                        onClick={() => setCurrentStep(index)}
                        className="w-full text-left p-3 bg-white/60 rounded-lg flex justify-between items-center hover:bg-white transition shadow"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <span className="font-medium text-gray-700 text-sm truncate pr-4">{q.text}</span>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-teal-600 bg-teal-100 px-2 py-1 rounded-full">EDIT</span>
                            <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
                        </div>
                    </motion.button>
                ))}
            </div>
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.3 }}
                >
                    <QuestionCard 
                        question={currentQuestion}
                        answer={answers[currentQuestion.id]}
                        onChange={(answer) => handleAnswer(currentQuestion.id, answer)}
                        onNext={handleNext}
                        onBack={handleBack}
                        isFirst={currentStep === 0}
                        isLast={currentStep === questions.length - 1}
                    />
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

// --- RESULTS DISPLAY ---

const ProgressRing = ({ percentage, color, size = 120 }) => {
    const radius = (size / 2) - 10;
    const circumference = 2 * Math.PI * radius;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg className="w-full h-full" viewBox={`0 0 ${size} ${size}`}>
                <circle className="text-gray-200/50" strokeWidth="8" stroke="currentColor" fill="transparent" r={radius} cx={size/2} cy={size/2} />
                <motion.circle
                    className={`text-${color}-500`}
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size/2}
                    cy={size/2}
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: circumference - (percentage / 100) * circumference }}
                    transition={{ duration: 1.5, ease: 'circOut' }}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-2xl font-bold text-${color}-600`}>{Math.round(percentage)}%</span>
            </div>
        </div>
    );
};

const ResultsScreen = ({ results, module, onReset }) => {
    const { diagnoses, risk, confidence } = results;
    const riskLevel = risk.score > 12 ? 'Critical' : risk.score > 8 ? 'High' : risk.score > 4 ? 'Elevated' : 'Guarded';
    const riskColor = { Critical: 'red', High: 'orange', Elevated: 'yellow', Guarded: 'green'}[riskLevel];
    const season = getSeason();
    
    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">
            <GlassmorphismCard className="p-8 text-center">
                <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center bg-${riskColor}-100 border-4 border-${riskColor}-200 mb-4`}>
                    <AlertTriangle size={40} className={`text-${riskColor}-500`} />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Assessment Complete</h2>
                <p className={`text-xl font-semibold text-${riskColor}-600`}>Overall Risk: {riskLevel}</p>
                 {risk.score > 8 && (
                    <div className="mt-4 p-4 bg-red-100/70 border border-red-200 rounded-lg text-red-800">
                        <h4 className="font-bold">Time-Critical Information</h4>
                        <p>Based on your symptoms, seeking prompt medical evaluation is strongly recommended. For severe symptoms, this could be a "golden hour" where immediate action is vital.</p>
                    </div>
                )}
            </GlassmorphismCard>
            
            {/* Differential Diagnosis */}
            <GlassmorphismCard className="p-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">Differential Diagnosis</h3>
                <div className="grid md:grid-cols-3 gap-6 text-center">
                    {diagnoses.map((diag, i) => (
                        <div key={diag.name} className={`p-4 rounded-xl bg-white/60 ${i===0 ? 'border-2 border-teal-400' : ''}`}>
                             <ProgressRing percentage={diag.probability} color={i === 0 ? 'teal' : i === 1 ? 'cyan' : 'gray'} size={100} />
                             <h4 className="font-bold text-lg mt-3">{diag.name}</h4>
                             <p className="text-sm text-gray-600">{diag.urgency} urgency</p>
                        </div>
                    ))}
                    {diagnoses.length === 0 && <p className="text-gray-600 col-span-3">Could not determine likely conditions based on provided symptoms.</p>}
                </div>
            </GlassmorphismCard>

            {/* Smart Insights Grid */}
            <div className="grid md:grid-cols-2 gap-6">
                <GlassmorphismCard className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <ShieldCheck className="text-blue-500" size={28}/>
                        <h4 className="text-xl font-semibold text-gray-800">Confidence Score</h4>
                    </div>
                    <div className="flex items-center gap-4">
                        <ProgressRing percentage={confidence} color="blue" size={80} />
                        <p className="text-gray-700 flex-1">Our assessment is {confidence}% confident based on the specificity and completeness of your answers.</p>
                    </div>
                </GlassmorphismCard>
                <GlassmorphismCard className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <BrainCircuit className="text-green-500" size={28}/>
                        <h4 className="text-xl font-semibold text-gray-800">Pattern Recognition</h4>
                    </div>
                    {diagnoses[0] && <p className="text-gray-700">The combination of <b>{diagnoses[0].matchedCriteria.slice(0,2).join(', ')}</b> strongly suggests <b>{diagnoses[0].name}</b>.</p>}
                     {!diagnoses[0] && <p className="text-gray-700">No strong symptom patterns were detected.</p>}
                </GlassmorphismCard>
                <GlassmorphismCard className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <BarChart2 className="text-yellow-500" size={28}/>
                        <h4 className="text-xl font-semibold text-gray-800">Common Causes</h4>
                    </div>
                    {diagnoses[0] && <p className="text-gray-700">{diagnoses[0].name} is a <b>{diagnoses[0].prevalence.toLowerCase()}</b></p>}
                     {!diagnoses[0] && <p className="text-gray-700">Statistical data not available.</p>}
                </GlassmorphismCard>
                 <GlassmorphismCard className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                        {(season === 'winter' || season === 'autumn') ? <Wind className="text-teal-500" size={28}/> : <Sun className="text-orange-500" size={28}/>}
                        <h4 className="text-xl font-semibold text-gray-800">Seasonal & Age Insights</h4>
                    </div>
                    {diagnoses.map(d => d.seasonal.includes(season) ? <p key={d.name} className="text-sm text-gray-700">Note: {d.name} can be more common in the {season}.</p> : null).find(el => el) || <p className="text-gray-700">No specific seasonal or age-related patterns detected for your top conditions.</p>}
                </GlassmorphismCard>
            </div>
            
            <div className="text-center">
                 <button onClick={onReset} className="px-8 py-3 bg-white/80 font-semibold text-gray-800 rounded-lg shadow-md hover:bg-white transition">Start New Assessment</button>
            </div>
        </div>
    );
};


// --- MAIN APP COMPONENT ---

export default function SymptoSphere() {
  const [appState, setAppState] = useState('disclaimer'); // disclaimer, selector, questionnaire, results
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const [results, setResults] = useState(null);

  const activeModule = symptomModules[selectedSymptom];

  const handleSymptomSelect = (symptom) => {
    setSelectedSymptom(symptom);
    setAppState('questionnaire');
  };
  
  const handleAssessmentComplete = (answers) => {
    const analysis = analysisEngine(answers, activeModule);
    setResults(analysis);
    setAppState('results');
  };

  const handleReset = () => {
      setAppState('selector');
      setSelectedSymptom(null);
      setResults(null);
  };

  const renderContent = () => {
    switch(appState) {
        case 'selector':
            return <SymptomSelector onSelect={handleSymptomSelect} />;
        case 'questionnaire':
            return <Questionnaire module={activeModule} onComplete={handleAssessmentComplete} />;
        case 'results':
            return <ResultsScreen results={results} module={activeModule} onReset={handleReset} />;
        default:
            return null;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-100 to-teal-100 p-4 sm:p-8 flex items-center justify-center font-sans">
      <AnimatePresence mode="wait">
        {appState === 'disclaimer' && <DisclaimerModal onAccept={() => setAppState('selector')} />}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <motion.div 
            key={appState}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="w-full"
        >
            {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

