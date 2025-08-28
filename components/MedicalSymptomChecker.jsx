import React, { useState, useEffect } from 'react';
import {
  ChevronRight, User, Clock, AlertTriangle, CheckCircle, Heart,
  Brain, Stethoscope, Activity, Search, ArrowLeft, MapPin, Calendar
} from 'lucide-react';

const MedicalSymptomChecker = () => {
  const [currentStep, setCurrentStep] = useState('welcome');
  const [userProfile, setUserProfile] = useState({
    age: '',
    gender: '',
    conditions: [],
    medications: []
  });
  const [symptoms, setSymptoms] = useState([]);
  const [primarySymptom, setPrimarySymptom] = useState('');
  const [severity, setSeverity] = useState('');
  const [duration, setDuration] = useState('');
  const [assessment, setAssessment] = useState(null);
  const [bodyArea, setBodyArea] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const handleStepChange = (newStep) => {
    if (newStep === 'results') {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setShowSuccess(true);
        setCurrentStep(newStep);
        setTimeout(() => setShowSuccess(false), 800);
      }, 2000);
    } else {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(newStep);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const PulseAnimation = ({ children, delay = 0 }) => (
    <div 
      className="animate-pulse opacity-0" 
      style={{ 
        animation: `fadeInUp 0.6s ease-out ${delay}s forwards`,
        animationFillMode: 'forwards'
      }}
    >
      {children}
    </div>
  );
  const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 max-w-sm mx-4">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center animate-pulse">
              <Brain className="w-8 h-8 text-white animate-bounce" />
            </div>
            <div className="absolute inset-0 w-16 h-16 mx-auto border-4 border-blue-200 rounded-2xl animate-ping"></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-800">Analyzing your symptoms...</h3>
            <p className="text-slate-600 font-medium">Using advanced clinical reasoning</p>
          </div>
          <div className="flex space-x-1 justify-center">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const SuccessAnimation = () => (
    <div className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center">
      <div className="animate-ping">
        <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center opacity-75">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
      </div>
    </div>
  );
    return (
    <div className="p-8 text-center text-xl">
      <h1 className="text-2xl font-bold text-blue-800">🧠 Medical Symptom Checker</h1>
      <p className="mt-4">This component is now fully live inside your Next.js site via Netlify!</p>

      {isLoading && <LoadingOverlay />}
      {showSuccess && <SuccessAnimation />}
    </div>
  );
};

export default MedicalSymptomChecker;

