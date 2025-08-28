'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, User, Clock, AlertTriangle, CheckCircle, Heart, Brain, Stethoscope, Activity, Search, ArrowLeft, MapPin, Calendar } from 'lucide-react';

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

  // Animation state for step transitions
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Enhanced step transition with loading animation
  const handleStepChange = (newStep) => {
    if (newStep === 'results') {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setShowSuccess(true);
        setCurrentStep(newStep);
        setTimeout(() => setShowSuccess(false), 800);
      }, 2000); // 2 second loading simulation
    } else {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(newStep);
        setIsTransitioning(false);
      }, 150);
    }
  };

  // Pulse animation component
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

  // Loading overlay component
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

  // Success animation component
  const SuccessAnimation = () => (
    <div className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center">
      <div className="animate-ping">
        <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center opacity-75">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
      </div>
    </div>
  );

  // Comprehensive symptom database with clinical reasoning
  const symptomDatabase = {
    'chest pain': {
      pivotalPoints: [
        'Immediate assessment for life-threatening causes (ACS, PE, aortic dissection, pneumothorax)',
        'Character, location, radiation pattern, and triggers guide differential diagnosis',
        'Cardiac risk factors significantly influence probability of ACS',
        'Associated symptoms (dyspnea, diaphoresis, nausea) increase likelihood of serious pathology'
      ],
      questions: [
        'When did the chest pain start and how did it begin (sudden vs gradual)?',
        'Where exactly is the pain located and does it radiate anywhere?',
        'What does the pain feel like (crushing, burning, sharp, tearing, pressure)?',
        'How severe is the pain on a scale of 1-10?',
        'What were you doing when the pain started (exertion, rest, emotional stress)?',
        'Does anything make the pain better or worse (rest, nitroglycerin, position, deep breathing)?',
        'Are you short of breath or having trouble breathing?',
        'Do you feel nauseous, dizzy, or are you sweating?',
        'Do you feel like your heart is racing or pounding?',
        'Any pain in your jaw, neck, arms, or back?',
        'Have you had chest pain like this before?',
        'Do you have high blood pressure, diabetes, or high cholesterol?',
        'Do you smoke or have you ever smoked?',
        'Any family history of heart attacks or heart disease?',
        'Are you taking any medications, especially for heart conditions?',
        'Any recent long travel, surgery, or prolonged immobilization?',
        'Any recent cough, fever, or leg swelling?'
      ],
      differentials: {
        'Life-Threatening (Immediate Evaluation Required)': [
          { condition: 'ST-Elevation Myocardial Infarction (STEMI)', likelihood: 'varies by risk factors', features: 'Severe crushing chest pain, diaphoresis, nausea, ST elevations on ECG' },
          { condition: 'Non-STEMI/Unstable Angina', likelihood: 'varies by risk factors', features: 'Crescendo angina, rest pain, troponin elevation' },
          { condition: 'Aortic Dissection', likelihood: 'rare but critical', features: 'Sudden tearing pain, radiation to back, pulse/BP differential' },
          { condition: 'Pulmonary Embolism', likelihood: 'moderate', features: 'Sudden dyspnea, pleuritic pain, risk factors for DVT' },
          { condition: 'Tension Pneumothorax', likelihood: 'rare', features: 'Sudden severe dyspnea, absent breath sounds, tracheal deviation' }
        ],
        'Cardiac (Non-Acute)': [
          { condition: 'Stable Angina', likelihood: 'moderate', features: 'Exertional chest pain, relieved by rest/nitroglycerin, predictable pattern' },
          { condition: 'Pericarditis', likelihood: 'low', features: 'Sharp pain, worse lying flat, better sitting forward, friction rub' },
          { condition: 'Myocarditis', likelihood: 'rare', features: 'Recent viral illness, young patient, heart failure symptoms' }
        ],
        'Pulmonary': [
          { condition: 'Pneumonia', likelihood: 'moderate', features: 'Fever, productive cough, pleuritic pain, consolidation on exam' },
          { condition: 'Pleuritis', likelihood: 'moderate', features: 'Sharp pain worse with breathing, pleural friction rub' },
          { condition: 'Spontaneous Pneumothorax', likelihood: 'low', features: 'Sudden onset, tall thin males, decreased breath sounds' }
        ],
        'Gastrointestinal': [
          { condition: 'Gastroesophageal Reflux Disease (GERD)', likelihood: 'high', features: 'Burning pain, worse lying down, response to antacids' },
          { condition: 'Esophageal Spasm', likelihood: 'low', features: 'Severe squeezing pain, may mimic MI, relieved by nitroglycerin' },
          { condition: 'Peptic Ulcer Disease', likelihood: 'moderate', features: 'Epigastric pain, relation to meals, H. pylori risk factors' }
        ],
        'Musculoskeletal': [
          { condition: 'Costochondritis', likelihood: 'moderate', features: 'Sharp pain, worse with movement, reproducible with palpation' },
          { condition: 'Muscle Strain', likelihood: 'moderate', features: 'Recent activity, worse with movement, tender to palpation' },
          { condition: 'Rib Fracture', likelihood: 'low', features: 'Recent trauma, point tenderness, worse with deep breathing' }
        ],
        'Other': [
          { condition: 'Panic Disorder', likelihood: 'moderate', features: 'Sudden onset, associated anxiety, palpitations, hyperventilation' },
          { condition: 'Herpes Zoster', likelihood: 'low', features: 'Burning pain in dermatomal distribution, vesicular rash' }
        ]
      },
      riskStratification: {
        'Very High Risk ACS': [
          'Age >65 with typical anginal symptoms',
          'Known coronary artery disease with worsening symptoms',
          'Diabetes + multiple cardiac risk factors',
          'Cocaine use with chest pain'
        ],
        'High Risk ACS': [
          'Male >45 or female >55 with typical symptoms',
          'Multiple cardiac risk factors (HTN, DM, smoking, family history)',
          'Previous MI or known CAD',
          'Typical anginal pain pattern'
        ],
        'Moderate Risk ACS': [
          'Age 30-45 (male) or 30-55 (female) with risk factors',
          'Atypical chest pain with some cardiac risk factors',
          'Exertional symptoms in at-risk patients'
        ],
        'Low Risk ACS': [
          'Young patients (<30) without risk factors',
          'Clearly reproducible with movement/palpation',
          'Sharp, stabbing pain lasting seconds',
          'No relationship to exertion'
        ]
      },
      redFlags: [
        'Sudden severe "tearing" pain radiating to back (aortic dissection)',
        'Chest pain with severe dyspnea and hypoxia (PE, tension pneumothorax)',
        'Chest pain with syncope or near-syncope',
        'Signs of cardiogenic shock (hypotension, altered mental status)',
        'Chest pain with unequal pulses or blood pressures',
        'Cocaine or methamphetamine use with chest pain',
        'Known aortic stenosis with chest pain',
        'Chest pain in setting of recent cardiac catheterization'
      ],
      diagnosticCriteria: {
        'Typical Angina': [
          'Substernal chest discomfort with characteristic quality and duration',
          'Provoked by exertion or emotional stress',
          'Relieved by rest or nitroglycerin within minutes'
        ],
        'Atypical Angina': [
          'Meets 2 of 3 typical angina criteria'
        ],
        'Non-Anginal Chest Pain': [
          'Meets 1 or none of typical angina criteria'
        ]
      },
      ageGenderFactors: {
        'Young Men (<30)': ['Pneumothorax', 'Costochondritis', 'Anxiety', 'Cocaine-induced MI'],
        'Young Women (<30)': ['Anxiety', 'Mitral valve prolapse', 'Costochondritis', 'Pregnancy-related'],
        'Middle-Aged Men (30-65)': ['Acute coronary syndrome', 'GERD', 'Musculoskeletal'],
        'Middle-Aged Women (30-65)': ['Atypical ACS presentation', 'GERD', 'Anxiety', 'Microvascular disease'],
        'Elderly (>65)': ['Acute coronary syndrome', 'Aortic stenosis', 'Pneumonia', 'Herpes zoster'],
        'Diabetics': ['Silent ischemia', 'Atypical presentations', 'Higher risk ACS']
      },
      clinicalDecisionRules: {
        'HEART Score': 'Risk stratification for ACS (History, ECG, Age, Risk factors, Troponin)',
        'Wells Score': 'Probability assessment for pulmonary embolism',
        'PERC Rule': 'Rule out PE in low-risk patients without testing'
      },
      urgency: 'immediate',
      clinicalPearls: [
        'Women and diabetics often present with atypical ACS symptoms',
        'Normal ECG and troponin do not rule out ACS in first 6 hours',
        'Cocaine-induced chest pain can cause MI even in young patients',
        'Response to GI cocktail does not rule out cardiac cause',
        '"Worst pain ever" + tearing quality + back radiation = aortic dissection until proven otherwise',
        'PE can present with pleuritic or non-pleuritic chest pain',
        'Reproducible chest pain does not exclude cardiac etiology',
        'Never discharge chest pain without ECG and appropriate risk stratification'
      ]
    },
    'wheezing': {
      pivotalPoints: [
        'Stridor indicates upper airway obstruction and is a potential airway emergency',
        'Wheezing location (inspiratory vs expiratory) helps localize airway obstruction',
        'Acute onset wheezing requires evaluation for anaphylaxis, foreign body, or pneumothorax',
        'Unilateral wheezing suggests focal obstruction rather than diffuse airway disease'
      ],
      questions: [
        'When did the wheezing start - suddenly or gradually?',
        'Do you hear the wheezing when breathing in, out, or both?',
        'Is the wheezing heard throughout both lungs or more on one side?',
        'Any difficulty breathing or feeling short of breath?',
        'Any chest tightness or chest pain?',
        'Any cough? Are you bringing up any sputum?',
        'Any fever or feeling generally unwell?',
        'Have you been exposed to any allergens, dust, or irritants?',
        'Any recent cold or respiratory infection?',
        'Do you have a history of asthma, allergies, or lung disease?',
        'Are you taking any medications or inhalers?',
        'Any family history of asthma or allergies?',
        'Do you smoke or have you been exposed to secondhand smoke?',
        'Any recent travel or unusual exposures?',
        'For children: Any possibility of swallowing a small object?',
        'Any swelling of face, lips, tongue, or throat?',
        'Any voice changes or difficulty swallowing?'
      ],
      differentials: {
        'Upper Airway Obstruction (STRIDOR - Emergency)': [
          { condition: 'Epiglottitis', likelihood: 'rare but critical', features: 'Rapid onset, drooling, muffled voice, tripod position, high fever' },
          { condition: 'Croup (Laryngotracheobronchitis)', likelihood: 'moderate', features: 'Children 6m-6y, barking cough, inspiratory stridor, viral prodrome' },
          { condition: 'Foreign Body Aspiration', likelihood: 'moderate', features: 'Sudden onset, children, choking episode, unilateral findings' },
          { condition: 'Anaphylaxis', likelihood: 'moderate', features: 'Rapid onset, known allergen, urticaria, hypotension, angioedema' },
          { condition: 'Vocal Cord Paralysis', likelihood: 'low', features: 'Voice changes, gradual onset, recent surgery/intubation' },
          { condition: 'Retropharyngeal Abscess', likelihood: 'rare', features: 'Severe sore throat, neck stiffness, drooling, fever' }
        ],
        'Lower Airway Obstruction (WHEEZING)': [
          { condition: 'Asthma Exacerbation', likelihood: 'very high', features: 'Known asthma, triggers, reversible with bronchodilators, expiratory wheeze' },
          { condition: 'Chronic Obstructive Pulmonary Disease (COPD)', likelihood: 'high', features: 'Smoking history, chronic cough, progressive dyspnea, barrel chest' },
          { condition: 'Bronchiolitis', likelihood: 'high', features: 'Infants <2 years, RSV season, fine crackles and wheeze' },
          { condition: 'Pneumonia', likelihood: 'moderate', features: 'Fever, productive cough, consolidation, unilateral findings' },
          { condition: 'Pulmonary Edema', likelihood: 'moderate', features: 'Heart failure, pink frothy sputum, bilateral crackles' },
          { condition: 'Pneumothorax', likelihood: 'low', features: 'Sudden onset, chest pain, decreased breath sounds, tall thin males' }
        ],
        'Occupational/Environmental': [
          { condition: 'Occupational Asthma', likelihood: 'moderate', features: 'Work-related triggers, improvement on weekends/vacations' },
          { condition: 'Hypersensitivity Pneumonitis', likelihood: 'low', features: 'Bird exposure, farmer\'s lung, chronic exposure' },
          { condition: 'Chemical Irritant Exposure', likelihood: 'moderate', features: 'Acute exposure, workplace incident, multiple patients' },
          { condition: 'Smoke Inhalation', likelihood: 'varies', features: 'Fire exposure, carbon monoxide, thermal injury' }
        ],
        'Cardiac Causes (Cardiac Asthma)': [
          { condition: 'Acute Heart Failure', likelihood: 'moderate', features: 'Orthopnea, PND, JVD, S3 gallop, bilateral crackles' },
          { condition: 'Mitral Stenosis', likelihood: 'low', features: 'Diastolic murmur, atrial fibrillation, pulmonary hypertension' },
          { condition: 'Pulmonary Embolism', likelihood: 'low', features: 'Sudden onset, pleuritic pain, risk factors, hypoxia' }
        ],
        'Infectious Causes': [
          { condition: 'Viral Respiratory Infection', likelihood: 'high', features: 'URI symptoms, rhinorrhea, low-grade fever, self-limiting' },
          { condition: 'Bacterial Pneumonia', likelihood: 'moderate', features: 'High fever, productive cough, consolidation, elevated WBC' },
          { condition: 'Pertussis (Whooping Cough)', likelihood: 'low', features: 'Paroxysmal cough, inspiratory whoop, unvaccinated' },
          { condition: 'Respiratory Syncytial Virus (RSV)', likelihood: 'high', features: 'Infants, bronchiolitis, seasonal pattern' }
        ]
      },
      clinicalDistinction: {
        'Stridor vs Wheezing': [
          'Stridor: Loud, audible without stethoscope, inspiratory, upper airway',
          'Wheezing: High-pitched, musical, usually expiratory, lower airway',
          'Biphasic stridor: Both inspiratory and expiratory = severe obstruction'
        ],
        'Inspiratory vs Expiratory Sounds': [
          'Inspiratory stridor: Laryngeal/tracheal obstruction above vocal cords',
          'Expiratory wheeze: Bronchial obstruction below vocal cords',
          'Biphasic: Severe obstruction at vocal cord level or below'
        ],
        'Localization by Sound': [
          'Loud stridor audible from distance: Severe upper airway obstruction',
          'Unilateral wheeze: Foreign body, pneumonia, pneumothorax',
          'Bilateral wheeze: Asthma, COPD, heart failure',
          'Silent chest: Severe bronchospasm with poor air movement'
        ]
      },
      emergencyRecognition: {
        'Immediate Airway Threats': [
          'Stridor with respiratory distress',
          'Drooling with inability to swallow',
          'Tripod positioning',
          'Cyanosis or severe hypoxia',
          'Altered mental status with respiratory distress',
          'Silent chest with severe distress',
          'Anaphylaxis with airway involvement'
        ],
        'Epiglottitis Recognition': [
          'Acute onset over hours',
          'High fever >101°F (38.3°C)',
          'Sore throat with drooling',
          'Muffled or "hot potato" voice',
          'Tripod position (sitting, leaning forward)',
          'Avoid examination that may precipitate obstruction'
        ],
        'Anaphylaxis Recognition': [
          'Rapid onset after exposure',
          'Urticaria, angioedema',
          'Respiratory distress, wheeze',
          'Hypotension, shock',
          'GI symptoms (nausea, cramping)'
        ]
      },
      redFlags: [
        'Stridor (any stridor is concerning)',
        'Drooling with respiratory distress',
        'Tripod positioning or inability to lie flat',
        'Cyanosis or oxygen saturation <90%',
        'Altered mental status with respiratory symptoms',
        'Signs of anaphylaxis (urticaria, angioedema, hypotension)',
        'Silent chest with severe respiratory distress',
        'Hemoptysis with wheezing',
        'Sudden onset in previously healthy individual',
        'Unilateral wheeze (suggests foreign body or focal pathology)'
      ],
      diagnosticApproach: {
        'Immediate Assessment': [
          'Airway patency and respiratory status',
          'Vital signs including oxygen saturation',
          'Mental status and level of distress',
          'Inspection for cyanosis, retractions',
          'Auscultation for wheeze location and quality'
        ],
        'Emergency Diagnostics': [
          'Arterial blood gas (if severe)',
          'Chest X-ray (if stable enough)',
          'Peak flow measurement (asthma)',
          'Complete blood count',
          'Consider lateral neck X-ray (epiglottitis) ONLY if stable'
        ],
        'Advanced Imaging': [
          'CT neck with contrast (stable patients with stridor)',
          'Bronchoscopy (foreign body suspected)',
          'Echocardiogram (cardiac asthma suspected)',
          'Pulmonary function tests (chronic wheeze)'
        ],
        'Laboratory Studies': [
          'Complete blood count with differential',
          'C-reactive protein or ESR',
          'Arterial blood gas',
          'BNP (if heart failure suspected)',
          'Tryptase level (anaphylaxis)'
        ]
      },
      treatmentApproach: {
        'Emergency Airway Management': [
          'High-flow oxygen',
          'Epinephrine for anaphylaxis',
          'Nebulized epinephrine for croup',
          'Corticosteroids for airway edema',
          'Prepare for emergency airway (cricothyrotomy, tracheostomy)',
          'Avoid agitating patient with epiglottitis'
        ],
        'Asthma Exacerbation': [
          'Inhaled beta-2 agonists (albuterol)',
          'Systemic corticosteroids',
          'Ipratropium bromide (anticholinergic)',
          'Magnesium sulfate (severe cases)',
          'Consider continuous nebulization'
        ],
        'COPD Exacerbation': [
          'Inhaled bronchodilators',
          'Systemic corticosteroids',
          'Antibiotics if bacterial infection suspected',
          'Non-invasive positive pressure ventilation',
          'Oxygen therapy (target 88-92%)'
        ],
        'Croup Management': [
          'Nebulized epinephrine (severe cases)',
          'Dexamethasone (oral or IM)',
          'Cool mist therapy',
          'Minimize agitation',
          'Observation for progression'
        ]
      },
      ageSpecificConsiderations: {
        'Infants (<1 year)': [
          'Bronchiolitis (RSV) most common',
          'Smaller airways more easily obstructed',
          'Congenital anomalies (vascular rings)',
          'Formula/feeding aspiration'
        ],
        'Toddlers (1-3 years)': [
          'Foreign body aspiration peak age',
          'Croup most common stridor cause',
          'Viral-induced wheeze',
          'Early asthma presentation'
        ],
        'School Age (4-12 years)': [
          'Asthma most common',
          'Exercise-induced bronchospasm',
          'Viral respiratory infections',
          'Pertussis in unvaccinated'
        ],
        'Adolescents/Adults': [
          'Asthma, exercise-induced',
          'Vocal cord dysfunction',
          'Anaphylaxis',
          'Anxiety-related symptoms'
        ],
        'Elderly': [
          'COPD exacerbations',
          'Heart failure (cardiac asthma)',
          'Aspiration pneumonia',
          'Medication-induced bronchospasm'
        ]
      },
      severityAssessment: {
        'Mild Wheeze': [
          'Audible only with stethoscope',
          'Normal oxygen saturation',
          'Able to speak in full sentences',
          'Normal mental status'
        ],
        'Moderate Wheeze': [
          'Audible without stethoscope',
          'Mild hypoxia (O2 sat 90-95%)',
          'Speaks in phrases',
          'Some respiratory distress'
        ],
        'Severe Wheeze': [
          'Loud wheeze or silent chest',
          'Significant hypoxia (O2 sat <90%)',
          'Single word responses',
          'Severe respiratory distress, accessory muscles'
        ],
        'Life-Threatening': [
          'Silent chest with poor air movement',
          'Cyanosis, altered mental status',
          'Unable to speak',
          'Exhaustion, paradoxical breathing'
        ]
      },
      specialConsiderations: {
        'Vocal Cord Dysfunction': [
          'Inspiratory wheeze',
          'Often misdiagnosed as asthma',
          'Triggered by strong emotions, exercise',
          'Does not respond to bronchodilators',
          'Laryngoscopy shows paradoxical vocal cord movement'
        ],
        'Exercise-Induced Bronchospasm': [
          'Wheeze during or after exercise',
          'Dry, cold air worsens symptoms',
          'Peak symptoms 5-10 minutes post-exercise',
          'Responds to pre-exercise bronchodilators'
        ],
        'Occupational Asthma': [
          'Work-related pattern',
          'Improvement on weekends/vacations',
          'Specific occupational triggers',
          'May become persistent even after exposure cessation'
        ]
      },
      urgency: 'immediate',
      clinicalPearls: [
        'Any stridor is concerning and suggests upper airway obstruction',
        'Biphasic stridor indicates severe obstruction requiring immediate intervention',
        'Silent chest with severe distress worse than loud wheeze',
        'Unilateral wheeze suggests foreign body or focal pathology',
        'Epiglottitis: avoid throat examination to prevent complete obstruction',
        'Croup has characteristic barking cough with inspiratory stridor',
        'Anaphylaxis can present with wheeze before other classic signs',
        'Foreign body aspiration: sudden onset in toddler with choking history',
        'Cardiac asthma: wheeze from heart failure, responds to diuretics',
        'Vocal cord dysfunction often misdiagnosed as refractory asthma',
        'Exercise-induced bronchospasm peaks 5-10 minutes after exercise',
        'RSV bronchiolitis: fine crackles and wheeze in infants <2 years',
        'Pertussis: paroxysmal cough with inspiratory whoop',
        'Always consider pneumothorax in sudden-onset wheeze with chest pain'
      ]
    },
    'weight loss': {
      pivotalPoints: [
        'Significant weight loss defined as >5% body weight in 6-12 months without trying',
        'Malignancy is the most concerning cause and must be systematically excluded',
        'Age >65 years significantly increases risk of serious underlying pathology',
        'Associated symptoms guide evaluation toward specific organ systems or diseases'
      ],
      questions: [
        'How much weight have you lost and over what time period?',
        'What was your highest weight in the past year?',
        'Have you been trying to lose weight through diet or exercise?',
        'Any changes in your appetite (increased, decreased, or normal)?',
        'Any difficulty swallowing or pain when swallowing?',
        'Any nausea, vomiting, or abdominal pain?',
        'Any changes in your bowel movements (diarrhea, constipation, blood)?',
        'Any fever, night sweats, or chills?',
        'Any unusual fatigue or weakness?',
        'Any cough, shortness of breath, or chest pain?',
        'Any lumps, bumps, or swelling anywhere on your body?',
        'Any changes in your mood (depression, anxiety)?',
        'Do you drink alcohol? How much and how often?',
        'Do you smoke or use tobacco products?',
        'Are you taking any medications or supplements?',
        'Any family history of cancer or chronic diseases?',
        'Any recent travel or unusual exposures?'
      ],
      differentials: {
        'Malignancy (Most Serious - 16-36% of cases)': [
          { condition: 'Gastrointestinal Cancers', likelihood: 'high concern', features: 'Colorectal, pancreatic, gastric, esophageal - dysphagia, GI bleeding, abdominal pain' },
          { condition: 'Lung Cancer', likelihood: 'high concern', features: 'Smoking history, cough, hemoptysis, chest pain, superior vena cava syndrome' },
          { condition: 'Hematologic Malignancies', likelihood: 'moderate concern', features: 'Lymphoma, leukemia - lymphadenopathy, fever, night sweats, bruising' },
          { condition: 'Genitourinary Cancers', likelihood: 'moderate concern', features: 'Prostate, kidney, bladder - hematuria, urinary symptoms, flank mass' },
          { condition: 'Breast Cancer', likelihood: 'moderate concern', features: 'Women, palpable mass, skin changes, lymphadenopathy' },
          { condition: 'Unknown Primary', likelihood: 'moderate concern', features: 'Metastatic disease with occult primary, constitutional symptoms' }
        ],
        'Gastrointestinal Disorders (16-19% of cases)': [
          { condition: 'Peptic Ulcer Disease', likelihood: 'moderate', features: 'Epigastric pain, H. pylori infection, NSAID use, GI bleeding' },
          { condition: 'Inflammatory Bowel Disease', likelihood: 'moderate', features: 'Bloody diarrhea, abdominal pain, young adults, extraintestinal manifestations' },
          { condition: 'Celiac Disease', likelihood: 'low', features: 'Diarrhea, steatorrhea, abdominal bloating, iron deficiency anemia' },
          { condition: 'Chronic Pancreatitis', likelihood: 'low', features: 'Alcohol history, epigastric pain, steatorrhea, diabetes' },
          { condition: 'Malabsorption Syndromes', likelihood: 'low', features: 'Steatorrhea, vitamin deficiencies, chronic diarrhea' }
        ],
        'Endocrine/Metabolic (9-14% of cases)': [
          { condition: 'Hyperthyroidism', likelihood: 'moderate', features: 'Heat intolerance, palpitations, tremor, increased appetite, anxiety' },
          { condition: 'Diabetes Mellitus (Type 1)', likelihood: 'moderate', features: 'Polyuria, polydipsia, polyphagia, young adults, ketosis' },
          { condition: 'Adrenal Insufficiency', likelihood: 'low', features: 'Fatigue, hyperpigmentation, hypotension, hyponatremia' },
          { condition: 'Pheochromocytoma', likelihood: 'rare', features: 'Hypertension, palpitations, diaphoresis, headache' }
        ],
        'Infectious Diseases (6-16% of cases)': [
          { condition: 'Tuberculosis', likelihood: 'moderate', features: 'Chronic cough, night sweats, fever, hemoptysis, risk factors' },
          { condition: 'HIV/AIDS', likelihood: 'moderate', features: 'Risk factors, opportunistic infections, lymphadenopathy' },
          { condition: 'Chronic Hepatitis', likelihood: 'low', features: 'Hepatitis B/C, elevated liver enzymes, jaundice, risk factors' },
          { condition: 'Endocarditis', likelihood: 'low', features: 'Fever, heart murmur, positive blood cultures, Janeway lesions' },
          { condition: 'Parasitic Infections', likelihood: 'low', features: 'Travel history, eosinophilia, stool parasites' }
        ],
        'Psychiatric/Behavioral (7-23% of cases)': [
          { condition: 'Major Depression', likelihood: 'high', features: 'Depressed mood, anhedonia, sleep disturbance, appetite loss' },
          { condition: 'Anorexia Nervosa', likelihood: 'moderate', features: 'Young women, body dysmorphia, restrictive eating, amenorrhea' },
          { condition: 'Dementia', likelihood: 'moderate', features: 'Elderly, cognitive decline, forgetting to eat, self-neglect' },
          { condition: 'Substance Use Disorder', likelihood: 'moderate', features: 'Alcohol, stimulants, poor nutrition, social dysfunction' }
        ],
        'Medications/Drugs (2-20% of cases)': [
          { condition: 'Medication Side Effects', likelihood: 'high', features: 'Metformin, topiramate, SSRIs, chemotherapy, stimulants' },
          { condition: 'Stimulant Use', likelihood: 'moderate', features: 'Amphetamines, cocaine, appetite suppressants, weight loss supplements' },
          { condition: 'Polypharmacy', likelihood: 'moderate', features: 'Elderly, multiple medications, drug interactions, poor appetite' }
        ],
        'Chronic Diseases (Variable %)': [
          { condition: 'Chronic Obstructive Pulmonary Disease', likelihood: 'moderate', features: 'Smoking history, dyspnea, chronic cough, hypermetabolism' },
          { condition: 'Heart Failure', likelihood: 'moderate', features: 'Dyspnea, edema, poor appetite, cardiac cachexia' },
          { condition: 'Chronic Kidney Disease', likelihood: 'low', features: 'Elevated creatinine, uremia, poor appetite, metabolic acidosis' },
          { condition: 'Rheumatologic Disorders', likelihood: 'low', features: 'RA, lupus, vasculitis - joint pain, systemic inflammation' }
        ]
      },
      riskStratification: {
        'High Risk Features (Malignancy Concern)': [
          'Age >65 years',
          'Weight loss >10% body weight',
          'Rapid weight loss (>5% in 1 month)',
          'Male gender',
          'Smoking history',
          'Family history of cancer',
          'Constitutional symptoms (fever, night sweats)',
          'Abdominal pain with weight loss',
          'Dysphagia or odynophagia'
        ],
        'Lower Risk Features': [
          'Age <50 years',
          'Gradual weight loss over >1 year',
          'Identifiable psychosocial stressors',
          'Recent medication changes',
          'Maintained appetite',
          'No constitutional symptoms'
        ]
      },
      diagnosticApproach: {
        'Initial Assessment': [
          'Accurate weight documentation and history',
          'Complete physical examination',
          'Review of systems for constitutional symptoms',
          'Medication and substance use history',
          'Functional and cognitive assessment',
          'Depression screening'
        ],
        'First-Line Laboratory Studies': [
          'Complete blood count with differential',
          'Comprehensive metabolic panel',
          'Liver function tests',
          'Thyroid stimulating hormone',
          'Erythrocyte sedimentation rate',
          'C-reactive protein',
          'Urinalysis',
          'Fecal occult blood test'
        ],
        'Second-Line Studies (Targeted)': [
          'Chest X-ray (all patients with unexplained weight loss)',
          'CT chest/abdomen/pelvis (if malignancy suspected)',
          'Colonoscopy (age >50 or GI symptoms)',
          'Upper endoscopy (dysphagia, upper GI symptoms)',
          'Tuberculin skin test or interferon-gamma release assay',
          'HIV testing (risk factors present)'
        ],
        'Specialized Testing': [
          'Tissue-transglutaminase antibodies (celiac disease)',
          'Cortisol levels (adrenal insufficiency)',
          'Tumor markers (PSA, CEA, CA 19-9, CA 125)',
          'Echocardiogram (heart failure suspected)',
          'Pulmonary function tests (COPD suspected)'
        ]
      },
      alarmSymptoms: [
        'Weight loss >10% body weight over 6 months',
        'Dysphagia or odynophagia (swallowing difficulty/pain)',
        'Persistent abdominal pain with weight loss',
        'Hemoptysis or persistent cough',
        'Hematochezia or melena (GI bleeding)',
        'Palpable abdominal mass or lymphadenopathy',
        'Night sweats with fever and weight loss',
        'Severe fatigue with weight loss',
        'New neurologic symptoms with weight loss',
        'Jaundice with weight loss'
      ],
      ageSpecificConsiderations: {
        'Elderly (>65 years)': [
          'Higher malignancy risk (up to 60% of cases)',
          'Medication effects more common',
          'Depression often overlooked',
          'Functional decline and self-neglect',
          'Polypharmacy interactions',
          'Dental problems affecting nutrition'
        ],
        'Middle Age (40-65 years)': [
          'Malignancy screening age-appropriate',
          'Stress-related eating disorders',
          'Medication-induced weight loss',
          'Early chronic disease manifestations',
          'Substance use disorders'
        ],
        'Young Adults (18-40 years)': [
          'Eating disorders more common',
          'Infectious diseases (TB, HIV)',
          'Inflammatory bowel disease',
          'Hyperthyroidism',
          'Type 1 diabetes mellitus',
          'Psychiatric disorders'
        ]
      },
      physicalExamFindings: {
        'General Appearance': [
          'Cachexia, muscle wasting',
          'Temporal wasting',
          'Skin turgor and hydration status',
          'Pallor (anemia)',
          'Jaundice (liver disease, malignancy)'
        ],
        'Lymph Node Examination': [
          'Cervical, supraclavicular, axillary, inguinal',
          'Size, consistency, mobility',
          'Virchow\'s node (left supraclavicular)',
          'Sister Mary Joseph nodule (umbilical)'
        ],
        'Abdominal Examination': [
          'Hepatomegaly, splenomegaly',
          'Abdominal masses',
          'Ascites',
          'Bowel sounds',
          'Tenderness and guarding'
        ],
        'Other Key Findings': [
          'Oral thrush (immunosuppression)',
          'Skin lesions or rashes',
          'Heart murmurs',
          'Respiratory findings',
          'Neurologic abnormalities'
        ]
      },
      workupAlgorithm: {
        'Step 1: History and Physical': [
          'Document weight loss percentage and timeline',
          'Complete review of systems',
          'Medication and substance history',
          'Comprehensive physical examination'
        ],
        'Step 2: Initial Laboratory Studies': [
          'CBC, CMP, LFTs, TSH, ESR, CRP, UA, FOBT',
          'Chest X-ray',
          'Age-appropriate cancer screening'
        ],
        'Step 3: If Initial Workup Normal': [
          'Consider psychiatric evaluation',
          'Medication review',
          'Nutritional assessment',
          'Functional evaluation',
          'Trial of treatment for reversible causes'
        ],
        'Step 4: If Concerning Features': [
          'CT chest/abdomen/pelvis',
          'Endoscopic evaluation',
          'Tissue biopsy if masses identified',
          'Specialized testing based on findings'
        ]
      },
      treatmentApproach: {
        'Treat Underlying Cause': [
          'Malignancy: Oncology referral, staging, treatment',
          'Hyperthyroidism: Antithyroid medications, radioiodine',
          'Depression: Antidepressants, psychotherapy',
          'Infections: Targeted antimicrobial therapy',
          'Medications: Discontinue or substitute offending agents'
        ],
        'Symptomatic Support': [
          'Nutritional consultation',
          'Caloric supplementation',
          'Appetite stimulants (megestrol, mirtazapine)',
          'Social services if needed',
          'Monitoring and follow-up'
        ],
        'When Cause Unknown': [
          'Close monitoring with serial weights',
          'Nutritional optimization',
          'Repeat evaluation in 3-6 months',
          'Consider empiric trial of appetite stimulants',
          'Psychological support'
        ]
      },
      redFlags: [
        'Age >65 with unexplained weight loss',
        'Weight loss >10% body weight',
        'Constitutional symptoms (fever, night sweats)',
        'Dysphagia or persistent abdominal pain',
        'Smoking history with weight loss',
        'Family history of cancer',
        'Palpable masses or lymphadenopathy',
        'Hemoptysis or GI bleeding',
        'Rapid progression over weeks',
        'Failure to respond to treatment of identified cause'
      ],
      urgency: 'high',
      clinicalPearls: [
        'Unintentional weight loss >5% body weight over 6-12 months requires investigation',
        'Malignancy found in 16-36% of cases with unexplained weight loss',
        'Age >65 years significantly increases cancer risk',
        'Normal appetite with weight loss suggests malabsorption or hyperthyroidism',
        'Weight loss with increased appetite suggests diabetes or hyperthyroidism',
        'Depression is often overlooked, especially in elderly patients',
        'Medication review is essential - many drugs cause weight loss',
        'Constitutional symptoms (fever, night sweats) increase malignancy concern',
        'Virchow\'s node (left supraclavicular) suggests GI malignancy',
        'Normal initial workup does not rule out serious disease',
        'Close follow-up essential even if initial evaluation negative',
        'Consider occult malignancy if weight loss persists without explanation',
        'Functional decline in elderly often contributes to weight loss',
        'Dental problems and swallowing difficulties often overlooked in elderly'
      ]
    },
    'sore throat': {
      pivotalPoints: [
        'Centor criteria help distinguish bacterial (strep) from viral pharyngitis',
        'Presence of exudate does not reliably indicate bacterial infection',
        'Age significantly influences likelihood of Group A strep infection',
        'Red flag symptoms identify serious complications requiring urgent evaluation'
      ],
      questions: [
        'When did your sore throat start and how severe is it?',
        'Do you have fever? What is your highest temperature?',
        'Do you see any white patches or pus on your tonsils?',
        'Are your lymph nodes swollen or tender in your neck?',
        'Do you have a cough?',
        'Any runny nose, sneezing, or nasal congestion?',
        'Any difficulty swallowing or opening your mouth fully?',
        'Any voice changes or hoarseness?',
        'Any skin rash anywhere on your body?',
        'Any nausea, vomiting, or abdominal pain?',
        'Have you been around anyone else who is sick?',
        'Any recent travel or new exposures?',
        'Are you sexually active? Any oral sexual contact recently?',
        'Do you smoke or use tobacco products?',
        'Any history of recurrent strep throat?',
        'Are you taking any medications?',
        'How old are you? (Age affects strep likelihood)'
      ],
      differentials: {
        'Viral Pharyngitis (Most Common - 85-95%)': [
          { condition: 'Common Cold (Rhinovirus)', likelihood: 'very high', features: 'Gradual onset, rhinorrhea, cough, low-grade fever, malaise' },
          { condition: 'Influenza', likelihood: 'high', features: 'Sudden onset, high fever, myalgias, headache, dry cough' },
          { condition: 'Adenovirus', likelihood: 'moderate', features: 'Pharyngoconjunctival fever, exudate present, lymphadenopathy' },
          { condition: 'Epstein-Barr Virus (Mono)', likelihood: 'moderate', features: 'Severe fatigue, lymphadenopathy, splenomegaly, atypical lymphocytes' },
          { condition: 'Parainfluenza', likelihood: 'moderate', features: 'Croup in children, gradual onset, hoarseness' },
          { condition: 'Coronavirus (including COVID-19)', likelihood: 'moderate', features: 'Sore throat, fever, cough, anosmia, exposure history' }
        ],
        'Bacterial Pharyngitis': [
          { condition: 'Group A Streptococcus (Strep Throat)', likelihood: 'moderate', features: 'Sudden onset, high fever, exudate, tender lymphadenopathy, no cough' },
          { condition: 'Group C/G Streptococcus', likelihood: 'low', features: 'Similar to Group A, food handlers, sexual transmission possible' },
          { condition: 'Neisseria gonorrhoeae', likelihood: 'low', features: 'Sexual transmission, may be asymptomatic, pharyngeal culture needed' },
          { condition: 'Corynebacterium diphtheriae', likelihood: 'rare', features: 'Gray pseudomembrane, "bull neck", unvaccinated, toxin-mediated' },
          { condition: 'Fusobacterium (Vincent\'s Angina)', likelihood: 'rare', features: 'Unilateral ulcerative pharyngitis, poor dental hygiene, anaerobic' }
        ],
        'Serious Complications/Red Flags': [
          { condition: 'Peritonsillar Abscess', likelihood: 'low but serious', features: 'Severe unilateral pain, trismus, muffled voice, uvular deviation' },
          { condition: 'Retropharyngeal Abscess', likelihood: 'rare but critical', features: 'Severe pain, drooling, neck stiffness, inspiratory stridor' },
          { condition: 'Epiglottitis', likelihood: 'rare but critical', features: 'Rapid onset, drooling, stridor, tripod position, airway emergency' },
          { condition: 'Ludwig\'s Angina', likelihood: 'rare but critical', features: 'Floor of mouth cellulitis, woody induration, airway compromise' },
          { condition: 'Lemierre Syndrome', likelihood: 'very rare', features: 'Fusobacterium, thrombophlebitis, septic emboli, post-pharyngitis' }
        ],
        'Non-Infectious Causes': [
          { condition: 'Gastroesophageal Reflux Disease', likelihood: 'moderate', features: 'Chronic symptoms, worse in morning, heartburn, hoarseness' },
          { condition: 'Allergic Rhinitis/Post-nasal Drip', likelihood: 'moderate', features: 'Seasonal pattern, nasal symptoms, throat clearing' },
          { condition: 'Vocal Cord Irritation', likelihood: 'moderate', features: 'Voice overuse, smoking, chemical irritants, hoarseness' },
          { condition: 'Kawasaki Disease', likelihood: 'rare', features: 'Children <5, fever >5 days, strawberry tongue, rash, lymphadenopathy' },
          { condition: 'Behçet\'s Disease', likelihood: 'rare', features: 'Recurrent oral ulcers, genital ulcers, eye involvement, HLA-B51' }
        ]
      },
      centorCriteria: {
        'Modified Centor Score (FeverPAIN)': [
          'Fever >38°C (100.4°F) in past 24 hours (1 point)',
          'Purulence/exudate on tonsils (1 point)',
          'Attend rapidly within 3 days of onset (1 point)',
          'Inflamed tonsils (severely inflamed = 1 point)',
          'No cough or coryza (1 point)'
        ],
        'Score Interpretation': [
          '0-1 points: <10% chance strep - no testing or antibiotics',
          '2-3 points: 11-35% chance strep - consider rapid strep test',
          '4-5 points: 51-65% chance strep - test and treat if positive'
        ],
        'Original Centor Criteria': [
          'Tonsillar exudate (1 point)',
          'Tender anterior cervical lymphadenopathy (1 point)',
          'Fever >38°C (1 point)',
          'Absence of cough (1 point)'
        ]
      },
      ageAdjustments: {
        'Age-Specific Risk': [
          'Age 3-14: Highest risk for Group A strep (add 1 point)',
          'Age 15-44: Moderate risk (0 points)',
          'Age ≥45: Lower risk (subtract 1 point)'
        ],
        'Pediatric Considerations': [
          'Strep more common in school-age children',
          'Viral causes predominant in <3 years old',
          'PANDAS (strep-associated neuropsychiatric disorders)',
          'Scarlet fever (strep with erythrogenic toxin)'
        ]
      },
      redFlags: [
        'Difficulty swallowing or breathing (airway compromise)',
        'Drooling or inability to handle secretions',
        'Severe unilateral throat pain with trismus (peritonsillar abscess)',
        'Muffled or "hot potato" voice',
        'Neck stiffness or limited neck movement',
        'Inspiratory stridor (upper airway obstruction)',
        'High fever with toxic appearance',
        'Immunocompromised patient with severe pharyngitis',
        'Persistent fever despite appropriate antibiotic treatment'
      ],
      diagnosticApproach: {
        'Clinical Decision Making': [
          'Apply Centor/FeverPAIN criteria',
          'Age-adjusted risk assessment',
          'Consider local strep prevalence',
          'Evaluate for complications'
        ],
        'Testing Strategies': [
          'Rapid Antigen Detection Test (RADT): 15-minute results, 85-95% sensitive',
          'Throat culture: Gold standard, 24-48h results, 95-99% sensitive',
          'Molecular testing (PCR): Rapid, highly sensitive and specific',
          'No testing needed if viral syndrome clear or low probability'
        ],
        'When to Test': [
          'Centor/FeverPAIN score ≥2',
          'Clinical suspicion of strep despite low score',
          'Outbreak investigation',
          'High-risk patient (rheumatic fever history)'
        ],
        'When NOT to Test': [
          'Clear viral syndrome (rhinorrhea, cough, conjunctivitis)',
          'Very low probability (Centor 0-1)',
          'Children <3 years (strep rare, rheumatic fever very rare)'
        ]
      },
      treatmentApproach: {
        'Group A Strep Treatment': [
          'First-line: Penicillin V 500mg BID x 10 days (adults)',
          'Penicillin allergy: Azithromycin 500mg x 1 day, then 250mg x 4 days',
          'Alternative: Cephalexin, clindamycin, clarithromycin',
          'Avoid macrolides if local resistance >10%'
        ],
        'Supportive Care (All Patients)': [
          'Analgesics: Acetaminophen, ibuprofen',
          'Throat lozenges, warm salt water gargles',
          'Adequate hydration',
          'Voice rest if hoarseness present',
          'Humidification'
        ],
        'Viral Pharyngitis': [
          'Symptomatic treatment only',
          'No antibiotics indicated',
          'Return if symptoms worsen or persist >7-10 days',
          'Isolation until fever-free 24 hours'
        ],
        'Complicated Cases': [
          'Peritonsillar abscess: ENT consultation, drainage, antibiotics',
          'Retropharyngeal abscess: Emergency ENT, possible airway management',
          'Epiglottitis: Emergency airway management, IV antibiotics'
        ]
      },
      complications: {
        'Suppurative (Local)': [
          'Peritonsillar abscess (most common)',
          'Retropharyngeal abscess',
          'Parapharyngeal abscess',
          'Cervical lymphadenitis',
          'Otitis media, sinusitis'
        ],
        'Non-Suppurative (Immune-Mediated)': [
          'Acute rheumatic fever (rare in developed countries)',
          'Post-streptococcal glomerulonephritis',
          'PANDAS (pediatric autoimmune neuropsychiatric disorders)',
          'Toxic shock syndrome (rare)'
        ]
      },
      specialPopulations: {
        'Immunocompromised': [
          'Higher risk of atypical organisms',
          'Candida, HSV, CMV, EBV',
          'More severe courses',
          'Consider broader testing and treatment'
        ],
        'Pregnant Women': [
          'Safe antibiotics: Penicillin, amoxicillin, cephalexin',
          'Avoid: Fluoroquinolones, tetracyclines',
          'Group B strep colonization consideration'
        ],
        'Elderly': [
          'Atypical presentations common',
          'Higher complication risk',
          'Consider broader differential',
          'Medication interactions'
        ]
      },
      differentialClues: {
        'Strep Throat Features': [
          'Sudden onset',
          'High fever (>101°F)',
          'Severe sore throat',
          'Tender cervical lymphadenopathy',
          'Tonsillar exudate',
          'Absence of cough or rhinorrhea',
          'Petechial rash on palate'
        ],
        'Viral Features': [
          'Gradual onset',
          'Low-grade fever or no fever',
          'Cough, rhinorrhea, conjunctivitis',
          'Hoarseness',
          'Myalgias (influenza)',
          'Multiple family members affected'
        ],
        'Mononucleosis Features': [
          'Severe fatigue lasting weeks',
          'Posterior cervical lymphadenopathy',
          'Splenomegaly',
          'Atypical lymphocytes on CBC',
          'Positive monospot or EBV titers'
        ]
      },
      urgency: 'varies',
      clinicalPearls: [
        'Most sore throats (85-95%) are viral and self-limiting',
        'Centor criteria help guide testing and treatment decisions',
        'Presence of cough makes strep throat less likely',
        'Exudate can be present in both viral and bacterial pharyngitis',
        'Negative rapid strep test in children should be followed by throat culture',
        'Adults with negative rapid strep test rarely need throat culture',
        'Penicillin resistance has never been documented in Group A strep',
        'Scarlet fever is strep throat with erythrogenic toxin production',
        'Rheumatic fever prevention requires 10 days of penicillin treatment',
        'Post-streptococcal glomerulonephritis cannot be prevented by antibiotics',
        'Recurrent strep throat may indicate carrier state or reinfection',
        'Family pets do not transmit Group A strep to humans',
        'Contact precautions for 24 hours after starting appropriate antibiotics',
        'Mononucleosis + amoxicillin often causes characteristic rash'
      ]
    },
    'rash': {
      pivotalPoints: [
        'Morphology and distribution pattern are key to differential diagnosis',
        'Systemic symptoms distinguish benign rashes from serious systemic disease',
        'Medication history is crucial as drug reactions are common and potentially serious',
        'Fever with petechial rash requires immediate evaluation for meningococcemia'
      ],
      questions: [
        'When did the rash first appear and how has it changed?',
        'Where on your body did the rash start and where has it spread?',
        'What does the rash look like (flat spots, raised bumps, blisters, scaling)?',
        'Is the rash itchy, painful, or burning?',
        'Any fever, chills, or feeling generally unwell?',
        'Have you started any new medications recently?',
        'Any known allergies to medications, foods, or environmental factors?',
        'Have you been exposed to anyone with a rash or illness?',
        'Any recent travel, especially to tropical areas?',
        'Any recent insect bites or animal exposures?',
        'Have you used any new soaps, detergents, cosmetics, or skin products?',
        'Any joint pain, muscle aches, or headache?',
        'Any difficulty breathing, swallowing, or tongue swelling?',
        'For children: Are immunizations up to date?',
        'Any recent sun exposure or outdoor activities?',
        'Any family history of skin conditions or autoimmune diseases?',
        'Are you sexually active? Any genital lesions?'
      ],
      differentials: {
        'Life-Threatening Rashes (Immediate Evaluation)': [
          { condition: 'Meningococcemia', likelihood: 'rare but critical', features: 'Petechial rash, fever, altered mental status, rapidly progressive' },
          { condition: 'Stevens-Johnson Syndrome/TEN', likelihood: 'rare but critical', features: 'Medication-induced, mucosal involvement, skin sloughing, fever' },
          { condition: 'Anaphylaxis', likelihood: 'moderate', features: 'Urticaria, angioedema, respiratory distress, hypotension, recent exposure' },
          { condition: 'Necrotizing Fasciitis', likelihood: 'rare', features: 'Rapidly spreading erythema, severe pain, systemic toxicity' },
          { condition: 'Staphylococcal Scalded Skin Syndrome', likelihood: 'rare', features: 'Children, fever, widespread erythema, skin exfoliation' }
        ],
        'Infectious Rashes': [
          { condition: 'Viral Exanthem', likelihood: 'very high', features: 'Fever, maculopapular, children, URI symptoms, self-limiting' },
          { condition: 'Cellulitis', likelihood: 'high', features: 'Unilateral erythema, warmth, tenderness, lymphangitis, fever' },
          { condition: 'Impetigo', likelihood: 'moderate', features: 'Honey-crusted lesions, children, superficial, contagious' },
          { condition: 'Herpes Zoster (Shingles)', likelihood: 'moderate', features: 'Dermatomal distribution, vesicles, pain before rash, unilateral' },
          { condition: 'Erythema Migrans (Lyme)', likelihood: 'low', features: 'Bull\'s eye rash, tick bite history, endemic area, expanding' },
          { condition: 'Scabies', likelihood: 'moderate', features: 'Intense itching, burrows, web spaces, family clusters' }
        ],
        'Drug Reactions': [
          { condition: 'Maculopapular Drug Eruption', likelihood: 'high', features: 'Symmetric distribution, trunk/extremities, new medication 1-3 weeks' },
          { condition: 'Urticaria (Drug-Induced)', likelihood: 'high', features: 'Raised wheals, itchy, evanescent, recent medication or food' },
          { condition: 'Fixed Drug Eruption', likelihood: 'low', features: 'Same location with re-exposure, hyperpigmentation, single/few lesions' },
          { condition: 'DRESS Syndrome', likelihood: 'rare', features: 'Fever, eosinophilia, lymphadenopathy, organ involvement, anticonvulsants' }
        ],
        'Autoimmune/Inflammatory Rashes': [
          { condition: 'Systemic Lupus Erythematosus', likelihood: 'low', features: 'Malar rash, photosensitivity, joint pain, ANA positive, young women' },
          { condition: 'Psoriasis', likelihood: 'moderate', features: 'Silvery scale, well-demarcated plaques, elbows/knees, nail changes' },
          { condition: 'Eczema/Atopic Dermatitis', likelihood: 'high', features: 'Chronic, itchy, flexural areas, family history, dry skin' },
          { condition: 'Contact Dermatitis', likelihood: 'high', features: 'Linear pattern, new exposure, vesicles, localized distribution' }
        ],
        'Childhood Exanthems': [
          { condition: 'Roseola', likelihood: 'high', features: 'High fever 3-5 days, then rash as fever breaks, infants' },
          { condition: 'Fifth Disease (Parvovirus B19)', likelihood: 'moderate', features: 'Slapped cheek appearance, lacy reticular rash, school-age children' },
          { condition: 'Hand, Foot, and Mouth Disease', likelihood: 'moderate', features: 'Vesicles on palms/soles, oral ulcers, coxsackievirus, daycare' },
          { condition: 'Chickenpox (Varicella)', likelihood: 'low', features: 'Vesicles in different stages, centripetal distribution, fever' },
          { condition: 'Measles', likelihood: 'rare', features: 'Koplik spots, cough/coryza/conjunctivitis, unvaccinated' }
        ],
        'Vascular/Purpuric Rashes': [
          { condition: 'Idiopathic Thrombocytopenic Purpura', likelihood: 'low', features: 'Petechiae, bleeding, low platelet count, no other symptoms' },
          { condition: 'Henoch-Schönlein Purpura', likelihood: 'low', features: 'Palpable purpura, children, arthritis, abdominal pain, nephritis' },
          { condition: 'Vasculitis', likelihood: 'rare', features: 'Palpable purpura, systemic symptoms, elevated ESR/CRP' },
          { condition: 'Rocky Mountain Spotted Fever', likelihood: 'rare', features: 'Petechial rash, wrists/ankles spreading centrally, tick exposure' }
        ]
      },
      morphologyClassification: {
        'Primary Lesions': [
          'Macule: Flat, <1cm, color change only',
          'Patch: Flat, >1cm, color change only',
          'Papule: Raised, <1cm, solid',
          'Plaque: Raised, >1cm, flat-topped',
          'Nodule: Raised, <1cm, deep',
          'Vesicle: Fluid-filled, <1cm',
          'Bulla: Fluid-filled, >1cm',
          'Pustule: Pus-filled',
          'Wheal: Raised, edematous, evanescent'
        ],
        'Secondary Lesions': [
          'Scale: Flaking skin',
          'Crust: Dried serum/blood',
          'Erosion: Superficial skin loss',
          'Ulcer: Deep skin loss',
          'Excoriation: Scratch marks',
          'Lichenification: Thickened skin from rubbing'
        ]
      },
      distributionPatterns: {
        'Characteristic Distributions': [
          'Flexural: Eczema, psoriasis inverse',
          'Extensor surfaces: Psoriasis, dermatitis herpetiformis',
          'Sun-exposed areas: Photodermatitis, lupus',
          'Dermatomal: Herpes zoster',
          'Palms/soles: Syphilis, hand-foot-mouth, Rocky Mountain spotted fever',
          'Centripetal: Chickenpox (starts centrally)',
          'Centrifugal: RMSF (starts peripherally)'
        ]
      },
      redFlags: [
        'Fever with petechial rash (meningococcemia)',
        'Mucosal involvement with blistering (SJS/TEN)',
        'Rapidly spreading erythema with severe pain (necrotizing fasciitis)',
        'Respiratory distress with urticaria (anaphylaxis)',
        'Skin sloughing or Nikolsky sign positive',
        'Rash with altered mental status',
        'Purpura with bleeding symptoms',
        'Rash with severe systemic symptoms',
        'Target lesions with mucosal involvement'
      ],
      emergencyRashes: {
        'Meningococcemia': [
          'Petechial rash that doesn\'t blanch',
          'Rapidly progressive',
          'Fever, altered mental status',
          'Medical emergency - immediate antibiotics'
        ],
        'Stevens-Johnson Syndrome/TEN': [
          'Medication-induced (typically 1-3 weeks after start)',
          'Target lesions, mucosal involvement',
          'Skin detachment >30% (TEN) vs <10% (SJS)',
          'Discontinue offending agent, supportive care'
        ],
        'Anaphylaxis': [
          'Rapid onset urticaria',
          'Angioedema (lips, tongue, throat)',
          'Respiratory distress, hypotension',
          'Epinephrine immediately'
        ]
      },
      diagnosticApproach: {
        'Clinical Assessment': [
          'Detailed description of morphology',
          'Distribution pattern and progression',
          'Associated symptoms',
          'Medication and exposure history',
          'Family and travel history'
        ],
        'Laboratory Studies (Selected Cases)': [
          'Complete blood count (infection, hematologic)',
          'Comprehensive metabolic panel',
          'ESR/CRP (inflammatory conditions)',
          'ANA (autoimmune conditions)',
          'Viral titers (if indicated)'
        ],
        'Specialized Testing': [
          'KOH preparation (fungal infections)',
          'Tzanck smear (viral infections)',
          'Bacterial culture (impetigo, cellulitis)',
          'Skin biopsy (unclear diagnosis)',
          'Patch testing (contact dermatitis)'
        ]
      },
      commonMedications: {
        'High-Risk Medications for Severe Reactions': [
          'Antibiotics: Penicillins, sulfonamides, quinolones',
          'Anticonvulsants: Phenytoin, carbamazepine, lamotrigine',
          'Allopurinol',
          'NSAIDs',
          'Contrast agents'
        ],
        'Common Drug Reaction Patterns': [
          'Immediate (minutes-hours): Urticaria, anaphylaxis',
          'Delayed (days-weeks): Maculopapular eruptions',
          'Late (weeks-months): SJS/TEN, DRESS syndrome'
        ]
      },
      treatmentApproach: {
        'Symptomatic Relief': [
          'Antihistamines for itching',
          'Topical corticosteroids (mild-moderate)',
          'Cool compresses',
          'Moisturizers for dry skin',
          'Avoid irritants and triggers'
        ],
        'Specific Treatments': [
          'Viral: Supportive care, antivirals for severe cases',
          'Bacterial: Topical/systemic antibiotics',
          'Fungal: Antifungal medications',
          'Allergic: Remove allergen, antihistamines, steroids',
          'Autoimmune: Immunosuppressive therapy'
        ],
        'Emergency Management': [
          'Anaphylaxis: Epinephrine, IV steroids, H1/H2 blockers',
          'SJS/TEN: Discontinue drug, supportive care, consider IVIG',
          'Meningococcemia: Immediate antibiotics, supportive care'
        ]
      },
      ageGenderFactors: {
        'Infants/Toddlers': ['Viral exanthems', 'Eczema', 'Diaper dermatitis', 'Roseola'],
        'School-Age Children': ['Viral exanthems', 'Impetigo', 'Fifth disease', 'Contact dermatitis'],
        'Adolescents': ['Acne', 'Viral exanthems', 'Drug reactions', 'Contact dermatitis'],
        'Young Adults': ['Drug reactions', 'STI-related rashes', 'Autoimmune conditions', 'Contact dermatitis'],
        'Middle Age': ['Drug reactions', 'Herpes zoster', 'Psoriasis', 'Autoimmune conditions'],
        'Elderly': ['Drug reactions', 'Herpes zoster', 'Stasis dermatitis', 'Bullous pemphigoid']
      },
      specialConsiderations: {
        'Immunocompromised Patients': [
          'Higher risk of atypical presentations',
          'Opportunistic infections',
          'More severe drug reactions',
          'Kaposi sarcoma (HIV patients)'
        ],
        'Pregnancy': [
          'Avoid teratogenic medications',
          'PUPPP (pruritic urticarial papules and plaques)',
          'Intrahepatic cholestasis of pregnancy',
          'Pemphigoid gestationis'
        ],
        'Travel-Related': [
          'Tropical diseases (dengue, chikungunya)',
          'Leishmaniasis',
          'Cutaneous larva migrans',
          'Tick-borne diseases'
        ]
      },
      urgency: 'varies',
      clinicalPearls: [
        'Fever + petechial rash = meningococcemia until proven otherwise',
        'Target lesions with mucosal involvement = Stevens-Johnson syndrome',
        'Nikolsky sign positive (skin sloughs with gentle pressure) = serious blistering disease',
        'Dermatomal distribution = herpes zoster (shingles)',
        'Bull\'s eye rash = erythema migrans (Lyme disease)',
        'Honey-crusted lesions = impetigo',
        'Vesicles in different stages = chickenpox',
        'Slapped cheek appearance = fifth disease (parvovirus B19)',
        'Linear pattern = contact dermatitis (poison ivy)',
        'Silvery scale on well-demarcated plaques = psoriasis',
        'Drug reactions typically symmetric and spare palms/soles',
        'Scabies burrows found in web spaces between fingers',
        'Cellulitis typically unilateral with warmth and tenderness',
        'Viral exanthems often have prodromal fever and URI symptoms'
      ]
    },
    'joint pain': {
      pivotalPoints: [
        'Inflammatory vs non-inflammatory pattern determines diagnostic approach and urgency',
        'Number and distribution of affected joints guide differential diagnosis',
        'Morning stiffness duration distinguishes inflammatory from mechanical causes',
        'Associated systemic symptoms suggest underlying rheumatologic disease'
      ],
      questions: [
        'Which joints are painful (hands, wrists, knees, ankles, back, shoulders)?',
        'How many joints are affected - one joint or multiple?',
        'When did the joint pain start and how did it develop?',
        'Is the pain worse in the morning or evening?',
        'Do you have morning stiffness? How long does it last?',
        'Are the joints swollen, red, or warm to touch?',
        'Does movement make the pain better or worse?',
        'Any fever, chills, or feeling generally unwell?',
        'Any skin rashes or changes?',
        'Any eye redness, dryness, or vision problems?',
        'Any recent infections, sore throat, or diarrheal illness?',
        'Any family history of arthritis or autoimmune diseases?',
        'Have you had any recent injuries or overuse of the joints?',
        'Are you taking any medications?',
        'Any recent tick bites or travel to areas with Lyme disease?',
        'For men: Any urethral discharge or burning urination?',
        'Any back pain or stiffness, especially in the morning?'
      ],
      differentials: {
        'Monoarticular (Single Joint) - Acute': [
          { condition: 'Septic Arthritis', likelihood: 'high concern', features: 'Fever, severe pain, effusion, inability to bear weight, immunocompromised' },
          { condition: 'Crystal Arthropathy (Gout)', likelihood: 'high', features: 'First MTP joint, severe pain, males >40, hyperuricemia, tophi' },
          { condition: 'Pseudogout (CPPD)', likelihood: 'moderate', features: 'Knee/wrist, elderly, chondrocalcinosis on X-ray, calcium pyrophosphate crystals' },
          { condition: 'Trauma/Hemarthrosis', likelihood: 'moderate', features: 'Recent injury, anticoagulation, bleeding disorders' },
          { condition: 'Reactive Arthritis', likelihood: 'low', features: 'Recent GU/GI infection, asymmetric, extra-articular features' }
        ],
        'Polyarticular (Multiple Joints) - Inflammatory': [
          { condition: 'Rheumatoid Arthritis', likelihood: 'high', features: 'Symmetric small joints, morning stiffness >1hr, RF/CCP positive' },
          { condition: 'Systemic Lupus Erythematosus', likelihood: 'moderate', features: 'Young women, malar rash, photosensitivity, ANA positive' },
          { condition: 'Psoriatic Arthritis', likelihood: 'moderate', features: 'Psoriasis, nail changes, asymmetric, DIP joints, enthesitis' },
          { condition: 'Viral Arthritis', likelihood: 'moderate', features: 'Recent viral illness, parvovirus B19, hepatitis B, self-limiting' },
          { condition: 'Ankylosing Spondylitis', likelihood: 'low', features: 'Young men, axial spine, morning stiffness, HLA-B27 positive' }
        ],
        'Polyarticular - Non-Inflammatory': [
          { condition: 'Osteoarthritis', likelihood: 'very high', features: 'Age >50, weight-bearing joints, bone-on-bone pain, Heberden nodes' },
          { condition: 'Fibromyalgia', likelihood: 'moderate', features: 'Widespread pain, tender points, sleep disturbance, fatigue' },
          { condition: 'Polymyalgia Rheumatica', likelihood: 'low', features: 'Age >50, shoulder/hip girdle, elevated ESR, dramatic steroid response' },
          { condition: 'Hypothyroidism', likelihood: 'low', features: 'Fatigue, weight gain, cold intolerance, elevated TSH' }
        ],
        'Axial/Spinal Involvement': [
          { condition: 'Ankylosing Spondylitis', likelihood: 'moderate', features: 'Young adults, inflammatory back pain, HLA-B27, sacroiliitis' },
          { condition: 'Psoriatic Arthritis (Axial)', likelihood: 'low', features: 'Psoriasis, asymmetric sacroiliitis, peripheral joint involvement' },
          { condition: 'Inflammatory Bowel Disease Arthritis', likelihood: 'low', features: 'IBD history, axial and peripheral joints, gut symptoms' },
          { condition: 'Mechanical Back Pain', likelihood: 'high', features: 'Activity-related, improves with rest, no morning stiffness' }
        ],
        'Infectious Arthritis': [
          { condition: 'Bacterial (Septic) Arthritis', likelihood: 'high concern', features: 'S. aureus most common, fever, single joint, rapid onset' },
          { condition: 'Gonococcal Arthritis', likelihood: 'moderate', features: 'Young sexually active, migratory arthritis, skin lesions' },
          { condition: 'Lyme Arthritis', likelihood: 'low', features: 'Endemic area, tick exposure, oligoarticular, knee involvement' },
          { condition: 'Viral Arthritis', likelihood: 'moderate', features: 'Parvovirus B19, hepatitis B, EBV, self-limiting' }
        ]
      },
      clinicalPatterns: {
        'Inflammatory vs Non-Inflammatory': [
          'Inflammatory: Morning stiffness >1hr, improves with activity, systemic symptoms',
          'Non-inflammatory: Brief morning stiffness <30min, worse with activity, no systemic symptoms'
        ],
        'Joint Distribution Patterns': [
          'Small joints: RA, SLE, psoriatic arthritis',
          'Large joints: Osteoarthritis, reactive arthritis, septic arthritis',
          'Axial spine: Ankylosing spondylitis, psoriatic arthritis, IBD arthritis',
          'First MTP: Gout (classic), but can affect any joint'
        ],
        'Symmetry Patterns': [
          'Symmetric: Rheumatoid arthritis, SLE, viral arthritis',
          'Asymmetric: Psoriatic arthritis, reactive arthritis, gout, septic arthritis'
        ]
      },
      redFlags: [
        'Fever with joint pain (septic arthritis)',
        'Single hot, swollen joint (septic arthritis until proven otherwise)',
        'Inability to bear weight or severe functional impairment',
        'Immunocompromised patient with joint pain',
        'Joint pain with neurologic deficits',
        'Prosthetic joint with pain and swelling',
        'Joint pain with signs of systemic illness',
        'Acute monoarthritis in elderly or diabetic patient',
        'Joint pain with recent joint injection or surgery'
      ],
      diagnosticApproach: {
        'Joint Aspiration (Synovial Fluid Analysis)': [
          'Mandatory for acute monoarthritis',
          'Cell count and differential',
          'Crystal analysis (polarized microscopy)',
          'Gram stain and culture',
          'Glucose and protein levels'
        ],
        'Laboratory Studies': [
          'Complete blood count with differential',
          'ESR and CRP (inflammatory markers)',
          'Rheumatoid factor (RF) and anti-CCP antibodies',
          'Antinuclear antibody (ANA)',
          'Uric acid level',
          'HLA-B27 (if spondyloarthropathy suspected)'
        ],
        'Imaging Studies': [
          'Plain radiographs (joint damage, chondrocalcinosis)',
          'Ultrasound (synovitis, effusions, erosions)',
          'MRI (early erosions, bone marrow edema)',
          'Dual-energy CT (uric acid crystal deposits)'
        ],
        'Additional Testing': [
          'Complement levels (C3, C4) if SLE suspected',
          'Anti-dsDNA, Sm, SSA/SSB (lupus-specific)',
          'ANCA (vasculitis)',
          'Lyme titers (if endemic area)',
          'Hepatitis B surface antigen'
        ]
      },
      synovialFluidAnalysis: {
        'Normal': [
          'WBC <200/μL',
          'Clear, colorless',
          'No crystals or organisms'
        ],
        'Non-Inflammatory (Osteoarthritis)': [
          'WBC 200-2000/μL',
          'Clear to slightly cloudy',
          'Predominantly mononuclear cells'
        ],
        'Inflammatory (RA, Crystal)': [
          'WBC 2000-50,000/μL',
          'Cloudy, yellow',
          'Predominantly neutrophils',
          'Crystals may be present'
        ],
        'Septic': [
          'WBC >50,000/μL (often >100,000)',
          'Purulent, opaque',
          '>90% neutrophils',
          'Positive Gram stain/culture'
        ]
      },
      crystalIdentification: {
        'Uric Acid (Gout)': [
          'Strongly negatively birefringent',
          'Yellow parallel to axis',
          'Blue perpendicular to axis',
          'Needle-shaped'
        ],
        'Calcium Pyrophosphate (Pseudogout)': [
          'Weakly positively birefringent',
          'Blue parallel to axis',
          'Yellow perpendicular to axis',
          'Rectangular/rod-shaped'
        ]
      },
      treatmentApproach: {
        'Septic Arthritis': [
          'Immediate arthrocentesis and drainage',
          'IV antibiotics (empiric then culture-directed)',
          'Orthopedic consultation',
          'Serial drainage if needed'
        ],
        'Acute Gout': [
          'NSAIDs (if no contraindications)',
          'Colchicine (within 12-24 hours)',
          'Corticosteroids (if NSAIDs/colchicine contraindicated)',
          'Avoid allopurinol during acute attack'
        ],
        'Rheumatoid Arthritis': [
          'Early DMARD therapy (methotrexate)',
          'Corticosteroids for bridging',
          'Biologic agents if refractory',
          'Physical therapy and joint protection'
        ],
        'Osteoarthritis': [
          'Weight loss if obese',
          'Physical therapy and exercise',
          'Acetaminophen first-line',
          'Topical NSAIDs, intra-articular injections'
        ]
      },
      ageGenderFactors: {
        'Young Adults (20-40)': ['Reactive arthritis', 'Ankylosing spondylitis', 'SLE', 'Viral arthritis'],
        'Middle Age (40-60)': ['Rheumatoid arthritis', 'Gout (men)', 'Early osteoarthritis', 'Psoriatic arthritis'],
        'Elderly (>60)': ['Osteoarthritis', 'Pseudogout', 'Polymyalgia rheumatica', 'Septic arthritis'],
        'Men': ['Gout', 'Ankylosing spondylitis', 'Reactive arthritis', 'Osteoarthritis (knees)'],
        'Women': ['Rheumatoid arthritis (3:1)', 'SLE (9:1)', 'Osteoarthritis (hands)', 'Fibromyalgia'],
        'Children': ['Juvenile idiopathic arthritis', 'Reactive arthritis', 'Septic arthritis', 'Viral arthritis']
      },
      specificConditions: {
        'Rheumatoid Arthritis Criteria (2010 ACR/EULAR)': [
          'Joint involvement: Small joints score higher',
          'Serology: RF and/or anti-CCP positive',
          'Acute phase reactants: Elevated ESR or CRP',
          'Symptom duration: >6 weeks'
        ],
        'Gout Diagnosis': [
          'Monosodium urate crystals in synovial fluid',
          'Tophus proven to contain urate crystals',
          'Clinical features: rapid onset, MTP-1 involvement',
          'Response to colchicine'
        ],
        'Septic Arthritis Risk Factors': [
          'Age >80 years',
          'Diabetes mellitus',
          'Rheumatoid arthritis',
          'Recent joint surgery',
          'Prosthetic joint',
          'Immunosuppression',
          'IV drug use'
        ]
      },
      urgency: 'varies',
      clinicalPearls: [
        'Any acute monoarthritis should be considered septic until proven otherwise',
        'Joint aspiration is mandatory for acute monoarthritis evaluation',
        'Morning stiffness >1 hour suggests inflammatory arthritis',
        'Gout can affect any joint, not just the big toe',
        'RF positive in 5% of healthy population - correlation with clinical findings essential',
        'Anti-CCP antibodies more specific for RA than RF',
        'Crystal arthritis and septic arthritis can coexist',
        'Osteoarthritis pain typically worse with activity, better with rest',
        'Symmetric small joint involvement suggests rheumatoid arthritis',
        'HLA-B27 positive in 8% of population but 90% of ankylosing spondylitis',
        'Psoriatic arthritis can occur before skin manifestations',
        'Polymyalgia rheumatica shows dramatic response to low-dose corticosteroids',
        'Lyme arthritis typically affects large joints, especially knees',
        'Gonococcal arthritis often presents with migratory polyarthritis'
      ]
    },
    'jaundice': {
      pivotalPoints: [
        'Pattern of liver enzymes distinguishes hepatocellular from cholestatic jaundice',
        'Presence or absence of pain helps differentiate biliary obstruction causes',
        'Associated symptoms guide evaluation for hemolytic vs hepatic causes',
        'Age and risk factors influence likelihood of malignant vs benign obstruction'
      ],
      questions: [
        'When did you first notice yellowing of your skin or eyes?',
        'Have you noticed dark urine or light-colored (clay-colored) stools?',
        'Do you have any abdominal pain? Where is it located?',
        'Any nausea, vomiting, or loss of appetite?',
        'Have you had any fever or chills?',
        'Any unusual fatigue or weakness?',
        'Have you lost weight recently without trying?',
        'Any itching of your skin?',
        'Do you drink alcohol? How much and for how long?',
        'Are you taking any medications, including over-the-counter or herbal supplements?',
        'Have you traveled recently, especially to developing countries?',
        'Any history of hepatitis or liver disease?',
        'Any recent blood transfusions or tattoos?',
        'Any family history of liver disease or blood disorders?',
        'Have you been exposed to anyone with hepatitis?',
        'Any IV drug use or high-risk sexual behavior?',
        'Any known gallbladder problems or gallstones?'
      ],
      differentials: {
        'Hepatocellular Jaundice (Liver Cell Damage)': [
          { condition: 'Viral Hepatitis (A, B, C, E)', likelihood: 'high', features: 'AST/ALT >1000, fatigue, nausea, recent exposure, travel' },
          { condition: 'Drug-Induced Liver Injury (DILI)', likelihood: 'high', features: 'Recent medication exposure, AST/ALT elevation, temporal relationship' },
          { condition: 'Alcoholic Hepatitis', likelihood: 'moderate', features: 'Heavy alcohol use, AST>ALT (2:1 ratio), fever, tender hepatomegaly' },
          { condition: 'Autoimmune Hepatitis', likelihood: 'low', features: 'Young women, ANA positive, hypergammaglobulinemia, chronic course' },
          { condition: 'Wilson\'s Disease', likelihood: 'rare', features: 'Young adults, neurologic symptoms, Kayser-Fleischer rings, low ceruloplasmin' },
          { condition: 'Acute Fatty Liver of Pregnancy', likelihood: 'rare', features: 'Third trimester, preeclampsia, microvesicular steatosis' }
        ],
        'Cholestatic Jaundice (Biliary Obstruction)': [
          { condition: 'Choledocholithiasis (Common Bile Duct Stones)', likelihood: 'high', features: 'RUQ pain, fever, elevated ALP/GGT, gallstone history' },
          { condition: 'Pancreatic Cancer', likelihood: 'moderate', features: 'Painless jaundice, weight loss, age >60, courvoisier sign' },
          { condition: 'Cholangiocarcinoma', likelihood: 'low', features: 'Painless jaundice, weight loss, PSC history, elevated CA 19-9' },
          { condition: 'Primary Sclerosing Cholangitis', likelihood: 'low', features: 'IBD history, progressive course, MRCP showing strictures' },
          { condition: 'Drug-Induced Cholestasis', likelihood: 'moderate', features: 'Antibiotics, phenothiazines, anabolic steroids, oral contraceptives' },
          { condition: 'Benign Biliary Stricture', likelihood: 'low', features: 'Prior surgery, trauma, chronic pancreatitis' }
        ],
        'Hemolytic Jaundice (Red Blood Cell Breakdown)': [
          { condition: 'Hereditary Spherocytosis', likelihood: 'low', features: 'Family history, splenomegaly, spherocytes on smear, osmotic fragility' },
          { condition: 'G6PD Deficiency', likelihood: 'low', features: 'Mediterranean/African descent, drug triggers, bite cells on smear' },
          { condition: 'Autoimmune Hemolytic Anemia', likelihood: 'low', features: 'Positive Coombs test, reticulocytosis, elevated LDH' },
          { condition: 'Transfusion Reaction', likelihood: 'rare', features: 'Recent transfusion, fever, hemoglobinuria, acute onset' },
          { condition: 'Malaria', likelihood: 'rare', features: 'Recent travel to endemic area, fever, parasites on smear' }
        ],
        'Mixed/Complex Causes': [
          { condition: 'Sepsis with Cholestasis', likelihood: 'moderate', features: 'Systemic infection, elevated bilirubin with normal ALT, SIRS criteria' },
          { condition: 'Heart Failure with Hepatic Congestion', likelihood: 'low', features: 'Known heart failure, elevated JVD, hepatomegaly, elevated BNP' },
          { condition: 'Total Parenteral Nutrition', likelihood: 'low', features: 'ICU setting, prolonged TPN, cholestatic pattern' },
          { condition: 'Benign Recurrent Intrahepatic Cholestasis', likelihood: 'rare', features: 'Episodic jaundice, family history, pruritus' }
        ],
        'Neonatal/Pediatric Causes': [
          { condition: 'Physiologic Jaundice', likelihood: 'very high', features: 'First week of life, unconjugated, breastfeeding' },
          { condition: 'Biliary Atresia', likelihood: 'rare', features: 'Conjugated hyperbilirubinemia, hepatomegaly, pale stools' },
          { condition: 'Gilbert Syndrome', likelihood: 'moderate', features: 'Mild unconjugated hyperbilirubinemia, stress/fasting triggers' }
        ]
      },
      laboratoryPatterns: {
        'Hepatocellular Pattern': [
          'AST/ALT markedly elevated (>500, often >1000)',
          'ALP/GGT mildly elevated (<3x normal)',
          'AST/ALT ratio: <2 (viral), >2 (alcoholic)',
          'Direct bilirubin predominates'
        ],
        'Cholestatic Pattern': [
          'ALP/GGT markedly elevated (>3x normal)',
          'AST/ALT mildly elevated (<500)',
          'GGT elevation confirms hepatic source of ALP',
          'Direct bilirubin predominates'
        ],
        'Hemolytic Pattern': [
          'Unconjugated (indirect) bilirubin predominates',
          'Normal AST/ALT/ALP',
          'Elevated LDH and reticulocyte count',
          'Decreased haptoglobin'
        ]
      },
      clinicalSyndromes: {
        'Charcot\'s Triad (Cholangitis)': [
          'Fever',
          'Jaundice', 
          'RUQ pain',
          'Medical emergency - requires urgent decompression'
        ],
        'Reynold\'s Pentad (Severe Cholangitis)': [
          'Charcot\'s triad PLUS',
          'Altered mental status',
          'Hypotension/shock'
        ],
        'Courvoisier\'s Sign': [
          'Painless jaundice + palpable gallbladder',
          'Suggests malignant biliary obstruction',
          '"Courvoisier\'s law": gallbladder unlikely to distend if stones present'
        ]
      },
      redFlags: [
        'Acute fulminant hepatitis (coagulopathy, encephalopathy)',
        'Charcot\'s triad (fever, jaundice, RUQ pain) - cholangitis',
        'Painless jaundice with weight loss (malignancy)',
        'Jaundice with altered mental status (hepatic encephalopathy)',
        'Jaundice with coagulopathy (PT/INR elevated)',
        'Jaundice in pregnancy (AFLP, HELLP, cholestasis of pregnancy)',
        'Acute hemolysis with kidney injury',
        'Jaundice with severe abdominal pain (pancreatitis, cholangitis)',
        'New jaundice in elderly patient (malignancy risk)'
      ],
      diagnosticApproach: {
        'Initial Laboratory Studies': [
          'Complete hepatic panel (AST, ALT, ALP, GGT, bilirubin total/direct)',
          'Complete blood count with peripheral smear',
          'Comprehensive metabolic panel',
          'Prothrombin time/INR',
          'Albumin and total protein',
          'Reticulocyte count, LDH, haptoglobin'
        ],
        'Viral Hepatitis Serologies': [
          'Hepatitis A: Anti-HAV IgM (acute), Anti-HAV IgG (immunity)',
          'Hepatitis B: HBsAg, Anti-HBc IgM, Anti-HBs, HBeAg, Anti-HBe',
          'Hepatitis C: Anti-HCV, HCV RNA',
          'Hepatitis E: Anti-HEV IgM (travel to endemic areas)',
          'EBV, CMV if indicated'
        ],
        'Imaging Studies': [
          'Right upper quadrant ultrasound (first-line)',
          'MRCP or ERCP for biliary tree evaluation',
          'CT abdomen/pelvis with contrast',
          'Endoscopic ultrasound for pancreatic masses'
        ],
        'Advanced Testing': [
          'Autoimmune markers: ANA, ASMA, LKM, AMA',
          'Wilson disease: Ceruloplasmin, 24h urine copper',
          'Alpha-1 antitrypsin level and phenotype',
          'Iron studies, transferrin saturation'
        ]
      },
      imagingInterpretation: {
        'Ultrasound Findings': [
          'Gallstones, gallbladder wall thickening',
          'Bile duct dilatation (>6mm common bile duct)',
          'Liver echogenicity and size',
          'Portal vein patency and flow'
        ],
        'CT Findings': [
          'Mass lesions in liver or pancreas',
          'Bile duct dilatation and level of obstruction',
          'Lymphadenopathy',
          'Vascular involvement'
        ],
        'MRCP/ERCP': [
          'Detailed biliary tree anatomy',
          'Strictures, stones, masses',
          'ERCP allows therapeutic intervention',
          'PSC: multifocal stricturing and beading'
        ]
      },
      drugInducedPatterns: {
        'Hepatocellular Injury': [
          'Acetaminophen (dose-dependent)',
          'Isoniazid, phenytoin',
          'Valproic acid, carbamazepine',
          'Statins, methotrexate'
        ],
        'Cholestatic Injury': [
          'Antibiotics: amoxicillin-clavulanate, macrolides',
          'Phenothiazines, tricyclic antidepressants',
          'Anabolic steroids, oral contraceptives',
          'Total parenteral nutrition'
        ],
        'Mixed Pattern': [
          'Phenytoin, sulfonamides',
          'Allopurinol, carbamazepine',
          'Some antibiotics and NSAIDs'
        ]
      },
      ageGenderFactors: {
        'Neonates': ['Physiologic jaundice', 'Biliary atresia', 'Hemolytic disease', 'Breast milk jaundice'],
        'Young Adults': ['Viral hepatitis', 'Drug-induced', 'Gilbert syndrome', 'Wilson disease'],
        'Middle Age': ['Gallstone disease', 'Drug-induced', 'Autoimmune hepatitis', 'Alcohol-related'],
        'Elderly': ['Malignancy', 'Drug-induced', 'Cholangitis', 'Pancreatic cancer'],
        'Women': ['Autoimmune hepatitis', 'Primary biliary cholangitis', 'Pregnancy-related'],
        'Men': ['Alcoholic liver disease', 'PSC (with IBD)', 'Hemochromatosis']
      },
      emergencyManagement: {
        'Acute Liver Failure': [
          'Immediate hepatology consultation',
          'ICU monitoring',
          'N-acetylcysteine if acetaminophen toxicity',
          'Evaluate for liver transplantation'
        ],
        'Cholangitis': [
          'IV antibiotics immediately',
          'Urgent biliary decompression (ERCP)',
          'Fluid resuscitation',
          'Monitor for septic shock'
        ],
        'Severe Hemolysis': [
          'Identify and remove trigger',
          'Blood transfusion if severe anemia',
          'Monitor for kidney injury',
          'Plasmapheresis if TTP/HUS'
        ]
      },
      treatmentApproach: {
        'Supportive Care': [
          'Discontinue hepatotoxic medications',
          'Avoid alcohol',
          'Nutritional support',
          'Monitor for complications'
        ],
        'Specific Treatments': [
          'Viral hepatitis: Supportive care, antivirals for HBV/HCV',
          'Autoimmune: Immunosuppression (prednisone, azathioprine)',
          'Wilson disease: Chelation therapy (penicillamine)',
          'Obstructive: ERCP with stone removal or stenting'
        ]
      },
      urgency: 'immediate',
      clinicalPearls: [
        'Jaundice becomes visible when bilirubin >2.5-3 mg/dL',
        'AST/ALT >1000 suggests acute hepatocellular injury',
        'AST>ALT (2:1 ratio) suggests alcoholic liver disease',
        'ALP >3x normal suggests cholestatic pattern',
        'Unconjugated hyperbilirubinemia suggests hemolysis or Gilbert syndrome',
        'Painless jaundice + weight loss = malignancy until proven otherwise',
        'Charcot\'s triad is a medical emergency requiring urgent decompression',
        'Drug-induced liver injury is a diagnosis of exclusion',
        'Normal bilirubin doesn\'t rule out liver disease',
        'GGT elevation confirms hepatic source of elevated ALP',
        'Viral hepatitis can present with cholestatic pattern',
        'Gilbert syndrome affects 5-10% of population (benign)',
        'ERCP is both diagnostic and therapeutic for biliary obstruction',
        'Hepatitis A and E are fecal-oral; B, C, D are blood-borne'
      ]
    },
    'blood in urine': {
      pivotalPoints: [
        'Gross vs microscopic hematuria have different evaluation approaches and urgency',
        'Painful vs painless hematuria suggests different etiologies',
        'Age and gender significantly influence differential diagnosis and malignancy risk',
        'Associated symptoms help distinguish glomerular from non-glomerular causes'
      ],
      questions: [
        'Can you see blood in your urine with the naked eye, or was it found on a test?',
        'What color is your urine (pink, red, brown, cola-colored)?',
        'When did you first notice blood in your urine?',
        'Is there pain or burning when you urinate?',
        'Do you see blood throughout urination or just at the beginning/end?',
        'Any blood clots in your urine?',
        'Any fever, chills, or feeling generally unwell?',
        'Any pain in your back, sides, or lower abdomen?',
        'Any difficulty urinating or changes in urinary stream?',
        'Have you had any recent infections or illnesses?',
        'Any recent vigorous exercise or trauma?',
        'Are you taking any medications, especially blood thinners?',
        'Any family history of kidney disease or bladder cancer?',
        'Do you smoke or have you ever smoked?',
        'Any occupational exposures to chemicals or dyes?',
        'For women: Are you currently menstruating?',
        'Any recent kidney stones or urinary tract infections?'
      ],
      differentials: {
        'Gross Hematuria (Visible Blood)': [
          { condition: 'Urinary Tract Infection', likelihood: 'high', features: 'Dysuria, frequency, urgency, fever, suprapubic pain' },
          { condition: 'Nephrolithiasis (Kidney Stones)', likelihood: 'high', features: 'Severe flank pain, nausea, vomiting, colicky pain' },
          { condition: 'Bladder Cancer', likelihood: 'moderate', features: 'Painless hematuria, age >50, smoking history, occupational exposure' },
          { condition: 'Kidney Cancer (Renal Cell Carcinoma)', likelihood: 'low', features: 'Painless hematuria, flank mass, weight loss, fever' },
          { condition: 'Trauma', likelihood: 'varies', features: 'Recent injury, accident, vigorous exercise, catheterization' },
          { condition: 'Benign Prostatic Hyperplasia', likelihood: 'moderate', features: 'Older men, urinary retention, weak stream, nocturia' }
        ],
        'Microscopic Hematuria (>3 RBCs/hpf)': [
          { condition: 'Thin Basement Membrane Disease', likelihood: 'high', features: 'Young adults, family history, isolated hematuria, benign course' },
          { condition: 'IgA Nephropathy', likelihood: 'moderate', features: 'Young adults, episodic gross hematuria with infections, proteinuria' },
          { condition: 'Alport Syndrome', likelihood: 'low', features: 'Family history, hearing loss, progressive kidney disease' },
          { condition: 'Exercise-Induced', likelihood: 'moderate', features: 'After vigorous exercise, resolves with rest' },
          { condition: 'Medications', likelihood: 'moderate', features: 'Anticoagulants, aspirin, cyclophosphamide, rifampin' }
        ],
        'Glomerular Hematuria': [
          { condition: 'IgA Nephropathy', likelihood: 'high', features: 'Most common glomerular cause, Asian males, post-infectious episodes' },
          { condition: 'Acute Post-Infectious Glomerulonephritis', likelihood: 'moderate', features: 'Recent strep infection, hypertension, edema, proteinuria' },
          { condition: 'Lupus Nephritis', likelihood: 'low', features: 'SLE history, proteinuria, hypertension, systemic symptoms' },
          { condition: 'ANCA Vasculitis', likelihood: 'rare', features: 'Pulmonary-renal syndrome, sinusitis, ANCA positive' },
          { condition: 'Anti-GBM Disease (Goodpasture\'s)', likelihood: 'rare', features: 'Pulmonary hemorrhage, rapidly progressive GN, anti-GBM positive' }
        ],
        'Non-Glomerular Hematuria': [
          { condition: 'Urolithiasis', likelihood: 'very high', features: 'Flank pain, nausea, imaging shows stones' },
          { condition: 'Urinary Tract Infection', likelihood: 'very high', features: 'Dysuria, frequency, positive urine culture' },
          { condition: 'Bladder Cancer', likelihood: 'moderate', features: 'Age >50, smoking, painless gross hematuria' },
          { condition: 'Prostate Cancer', likelihood: 'low', features: 'Older men, elevated PSA, hard prostate' },
          { condition: 'Polycystic Kidney Disease', likelihood: 'low', features: 'Family history, flank pain, hypertension, kidney enlargement' }
        ],
        'Malignancy-Associated': [
          { condition: 'Bladder Cancer (Urothelial)', likelihood: 'moderate', features: '90% of bladder cancers, smoking, occupational exposure, age >50' },
          { condition: 'Renal Cell Carcinoma', likelihood: 'low', features: 'Incidental finding on imaging, flank mass, weight loss' },
          { condition: 'Prostate Cancer', likelihood: 'low', features: 'Older men, elevated PSA, bone pain if metastatic' },
          { condition: 'Upper Tract Urothelial Cancer', likelihood: 'rare', features: 'Ureter/renal pelvis, similar risk factors to bladder cancer' }
        ]
      },
      riskStratification: {
        'High Risk for Malignancy': [
          'Age >50 years',
          'Male gender',
          'Smoking history (current or former)',
          'Occupational exposure (chemicals, dyes, rubber, leather)',
          'History of pelvic radiation',
          'Chronic indwelling catheter',
          'History of urologic cancer',
          'Painless gross hematuria'
        ],
        'Low Risk for Malignancy': [
          'Age <35 years',
          'Female gender',
          'No smoking history',
          'Recent UTI or vigorous exercise',
          'Isolated microscopic hematuria',
          'Clear secondary cause identified'
        ]
      },
      clinicalAssessment: {
        'Timing of Hematuria': [
          'Initial: Urethral bleeding (trauma, stricture)',
          'Terminal: Bladder neck/prostate bleeding',
          'Throughout: Bladder, ureter, or kidney bleeding'
        ],
        'Associated Symptoms': [
          'Dysuria + frequency: UTI, cystitis',
          'Flank pain: Stones, pyelonephritis, renal infarct',
          'Painless: Malignancy, glomerular disease',
          'Proteinuria: Glomerular disease',
          'Clots: Non-glomerular bleeding'
        ],
        'Urine Appearance': [
          'Pink/red: Fresh bleeding, lower tract',
          'Brown/cola: Upper tract, glomerular',
          'Clots present: Non-glomerular source',
          'Proteinuria: Suggests glomerular disease'
        ]
      },
      redFlags: [
        'Painless gross hematuria in adults >35 (malignancy risk)',
        'Hematuria with acute kidney injury',
        'Massive hematuria with clot retention',
        'Hematuria with signs of systemic disease (fever, weight loss)',
        'Hematuria with severe hypertension',
        'Family history of hereditary nephritis with hematuria',
        'Occupational chemical exposure with hematuria',
        'Persistent microscopic hematuria after UTI treatment',
        'Hematuria with flank mass or lymphadenopathy'
      ],
      diagnosticApproach: {
        'Initial Evaluation (All Patients)': [
          'Detailed history and physical examination',
          'Urinalysis with microscopy (confirm RBCs)',
          'Urine culture',
          'Serum creatinine and estimated GFR',
          'Complete blood count',
          'PT/PTT if on anticoagulation'
        ],
        'Gross Hematuria Workup': [
          'Cystoscopy (all patients >35 or high risk)',
          'CT urography or IV pyelogram',
          'Renal ultrasound (alternative imaging)',
          'Cytology (if high suspicion for malignancy)'
        ],
        'Microscopic Hematuria Workup': [
          'Risk stratification based on age and risk factors',
          'Cystoscopy if high risk (age >35, smoking, etc.)',
          'Imaging: CT urography, renal ultrasound, or IVP',
          'Nephrology referral if glomerular pattern'
        ],
        'Glomerular Disease Workup': [
          'Nephrology consultation',
          'Proteinuria quantification (24h urine or spot ratio)',
          'Complement levels (C3, C4)',
          'ANA, anti-dsDNA (lupus)',
          'ANCA (vasculitis)',
          'Anti-GBM antibodies',
          'Renal biopsy if indicated'
        ]
      },
      laboratoryFindings: {
        'Glomerular vs Non-Glomerular': [
          'Glomerular: RBC casts, dysmorphic RBCs, proteinuria',
          'Non-Glomerular: Normal RBC morphology, minimal proteinuria'
        ],
        'Urine Microscopy': [
          'RBC casts: Pathognomonic for glomerular disease',
          'WBC casts: Pyelonephritis, interstitial nephritis',
          'Crystals: Calcium oxalate, uric acid, cystine stones',
          'Bacteria: UTI (>10^5 CFU/mL significant)'
        ]
      },
      imagingApproach: {
        'CT Urography (Gold Standard)': [
          'Best for detecting stones, masses, structural abnormalities',
          'Contrast enhancement shows renal function',
          'Delayed images show collecting system'
        ],
        'Renal Ultrasound': [
          'No radiation, good for cysts, hydronephrosis',
          'Limited for small stones or masses',
          'First-line in pregnancy, children'
        ],
        'MR Urography': [
          'Alternative if contrast allergy',
          'Good soft tissue contrast',
          'No radiation exposure'
        ]
      },
      ageGenderFactors: {
        'Young Adults (<35)': ['UTI', 'Stones', 'Glomerular disease', 'Exercise-induced', 'Thin basement membrane'],
        'Middle Age (35-50)': ['Stones', 'UTI', 'Early malignancy screening', 'Glomerular disease'],
        'Older Adults (>50)': ['Malignancy', 'BPH', 'Stones', 'UTI', 'Medication-related'],
        'Men': ['BPH', 'Prostate cancer', 'Bladder cancer', 'Stones'],
        'Women': ['UTI', 'Menstrual contamination', 'Bladder cancer (lower risk)', 'Stones'],
        'Children': ['UTI', 'Glomerular disease', 'Hypercalciuria', 'Trauma']
      },
      specialConsiderations: {
        'Anticoagulated Patients': [
          'Hematuria in anticoagulated patients still requires full workup',
          'Anticoagulation may unmask underlying pathology',
          'Do not attribute hematuria solely to anticoagulation',
          'Consider holding anticoagulation for procedures'
        ],
        'Exercise-Induced Hematuria': [
          'Common after intense exercise',
          'Usually resolves within 24-72 hours',
          'If persistent, requires full evaluation',
          'More common in contact sports, running'
        ],
        'Menstrual Contamination': [
          'Repeat urinalysis after menstruation',
          'Use midstream clean-catch specimen',
          'Consider catheterized specimen if unclear'
        ]
      },
      treatmentApproach: {
        'UTI-Related': [
          'Appropriate antibiotics based on culture',
          'Repeat urinalysis after treatment',
          'If hematuria persists, full workup needed'
        ],
        'Stone Disease': [
          'Pain management, hydration',
          'Alpha-blockers for ureteral stones',
          'Lithotripsy or ureteroscopy if indicated',
          'Metabolic stone evaluation'
        ],
        'Malignancy': [
          'Urologic oncology referral',
          'Staging studies if cancer confirmed',
          'Multidisciplinary treatment planning'
        ],
        'Glomerular Disease': [
          'Nephrology management',
          'ACE inhibitors for proteinuria',
          'Immunosuppression if indicated',
          'Blood pressure control'
        ]
      },
      urgency: 'varies',
      clinicalPearls: [
        'Any visible blood in urine requires urgent urologic evaluation',
        'Painless gross hematuria = malignancy until proven otherwise',
        'Anticoagulation does not explain hematuria - still needs workup',
        'RBC casts are pathognomonic for glomerular disease',
        'Bladder cancer most common cause of gross hematuria in adults >50',
        'IgA nephropathy most common cause of glomerular hematuria',
        'Exercise-induced hematuria should resolve within 72 hours',
        'Smoking increases bladder cancer risk by 4-fold',
        'Occupational exposures: benzidine, aromatic amines, aniline dyes',
        'Thin basement membrane disease is benign familial hematuria',
        'Cyclophosphamide can cause hemorrhagic cystitis',
        'Upper tract imaging essential - cystoscopy alone insufficient',
        'Microscopic hematuria in young athletes often benign',
        'Persistent hematuria after UTI treatment requires full evaluation'
      ]
    },
    'fatigue': {
      pivotalPoints: [
        'Duration distinguishes acute vs chronic fatigue with different diagnostic approaches',
        'Associated symptoms help identify specific organ system involvement',
        'Sleep quality and quantity assessment is crucial for differential diagnosis',
        'Psychiatric comorbidities (depression, anxiety) are common and often overlooked'
      ],
      questions: [
        'How long have you been feeling fatigued (days, weeks, months, years)?',
        'Is the fatigue constant or does it come and go?',
        'Is it worse at certain times of day (morning, afternoon, evening)?',
        'How would you rate your energy level on a scale of 1-10?',
        'Does rest or sleep help improve your fatigue?',
        'How many hours of sleep do you get per night? Do you feel rested when you wake up?',
        'Do you snore or has anyone noticed you stop breathing during sleep?',
        'Any difficulty falling asleep or staying asleep?',
        'Do you feel sad, depressed, or have lost interest in activities you used to enjoy?',
        'Any anxiety, stress, or major life changes recently?',
        'Have you noticed any weight changes (gain or loss)?',
        'Any muscle weakness or joint pain?',
        'Any shortness of breath with activity or at rest?',
        'Any changes in your menstrual periods (for women)?',
        'Any changes in bowel movements or digestive symptoms?',
        'Do you drink alcohol or use any substances?',
        'What medications and supplements are you taking?',
        'Any recent infections or illnesses?'
      ],
      differentials: {
        'Endocrine/Metabolic Causes': [
          { condition: 'Hypothyroidism', likelihood: 'high', features: 'Weight gain, cold intolerance, dry skin, bradycardia, elevated TSH' },
          { condition: 'Diabetes Mellitus', likelihood: 'moderate', features: 'Polyuria, polydipsia, weight loss, hyperglycemia' },
          { condition: 'Adrenal Insufficiency', likelihood: 'low', features: 'Weight loss, hyperpigmentation, hypotension, hyponatremia' },
          { condition: 'Hyperthyroidism', likelihood: 'moderate', features: 'Weight loss, heat intolerance, palpitations, tremor' },
          { condition: 'Diabetes Insipidus', likelihood: 'rare', features: 'Polyuria, polydipsia, hypernatremia' }
        ],
        'Hematologic Causes': [
          { condition: 'Iron Deficiency Anemia', likelihood: 'very high', features: 'Pallor, restless legs, pica, heavy menstrual bleeding' },
          { condition: 'Vitamin B12 Deficiency', likelihood: 'moderate', features: 'Macrocytic anemia, neurologic symptoms, megaloblastic changes' },
          { condition: 'Folate Deficiency', likelihood: 'low', features: 'Macrocytic anemia, poor diet, alcohol use' },
          { condition: 'Chronic Disease Anemia', likelihood: 'moderate', features: 'Chronic illness, normal iron studies, inflammatory markers' },
          { condition: 'Hemolytic Anemia', likelihood: 'rare', features: 'Jaundice, elevated LDH, low haptoglobin' }
        ],
        'Cardiovascular Causes': [
          { condition: 'Heart Failure', likelihood: 'moderate', features: 'Dyspnea, orthopnea, edema, JVD, S3 gallop' },
          { condition: 'Coronary Artery Disease', likelihood: 'moderate', features: 'Chest pain, dyspnea on exertion, cardiac risk factors' },
          { condition: 'Arrhythmias', likelihood: 'low', features: 'Palpitations, irregular pulse, syncope' }
        ],
        'Pulmonary Causes': [
          { condition: 'Sleep Apnea', likelihood: 'high', features: 'Snoring, witnessed apneas, morning headaches, obesity' },
          { condition: 'Chronic Obstructive Pulmonary Disease', likelihood: 'moderate', features: 'Smoking history, dyspnea, chronic cough' },
          { condition: 'Asthma', likelihood: 'low', features: 'Wheezing, dyspnea, triggers, family history' }
        ],
        'Infectious Causes': [
          { condition: 'Viral Syndrome', likelihood: 'high', features: 'Recent illness, myalgias, low-grade fever, self-limiting' },
          { condition: 'Mononucleosis (EBV)', likelihood: 'moderate', features: 'Sore throat, lymphadenopathy, splenomegaly, young adults' },
          { condition: 'Hepatitis', likelihood: 'low', features: 'Jaundice, elevated liver enzymes, risk factors' },
          { condition: 'HIV', likelihood: 'low', features: 'Risk factors, weight loss, opportunistic infections' },
          { condition: 'Tuberculosis', likelihood: 'rare', features: 'Night sweats, weight loss, cough, risk factors' }
        ],
        'Psychiatric/Psychological Causes': [
          { condition: 'Major Depressive Disorder', likelihood: 'very high', features: 'Depressed mood, anhedonia, sleep disturbance, appetite changes' },
          { condition: 'Anxiety Disorders', likelihood: 'high', features: 'Worry, restlessness, muscle tension, sleep disturbance' },
          { condition: 'Seasonal Affective Disorder', likelihood: 'moderate', features: 'Seasonal pattern, light sensitivity, carbohydrate cravings' },
          { condition: 'Chronic Stress', likelihood: 'high', features: 'Life stressors, burnout, work-related factors' }
        ],
        'Autoimmune/Rheumatologic': [
          { condition: 'Systemic Lupus Erythematosus', likelihood: 'low', features: 'Joint pain, rash, photosensitivity, ANA positive' },
          { condition: 'Rheumatoid Arthritis', likelihood: 'low', features: 'Joint pain/swelling, morning stiffness, RF/CCP positive' },
          { condition: 'Fibromyalgia', likelihood: 'moderate', features: 'Widespread pain, tender points, sleep disturbance' },
          { condition: 'Polymyalgia Rheumatica', likelihood: 'low', features: 'Age >50, shoulder/hip stiffness, elevated ESR' }
        ],
        'Other Medical Causes': [
          { condition: 'Chronic Kidney Disease', likelihood: 'moderate', features: 'Elevated creatinine, proteinuria, hypertension' },
          { condition: 'Liver Disease', likelihood: 'low', features: 'Elevated liver enzymes, jaundice, alcohol history' },
          { condition: 'Malignancy', likelihood: 'low', features: 'Weight loss, night sweats, specific organ symptoms' },
          { condition: 'Medication Side Effects', likelihood: 'high', features: 'Recent medication changes, sedating medications' }
        ],
        'Lifestyle/Behavioral Causes': [
          { condition: 'Poor Sleep Hygiene', likelihood: 'very high', features: 'Irregular sleep schedule, screen time, caffeine' },
          { condition: 'Physical Deconditioning', likelihood: 'high', features: 'Sedentary lifestyle, lack of exercise' },
          { condition: 'Nutritional Deficiencies', likelihood: 'moderate', features: 'Poor diet, weight loss diets, malabsorption' },
          { condition: 'Overwork/Burnout', likelihood: 'high', features: 'Long work hours, high stress, lack of recovery time' }
        ]
      },
      fatigueCharacterization: {
        'Physical Fatigue': [
          'Muscle weakness, heaviness',
          'Difficulty with physical activities',
          'Improves with rest',
          'May suggest neuromuscular or metabolic causes'
        ],
        'Mental Fatigue': [
          'Difficulty concentrating, brain fog',
          'Memory problems',
          'Mental effort feels exhausting',
          'May suggest psychiatric or neurologic causes'
        ],
        'Mixed Fatigue': [
          'Both physical and mental components',
          'Most common presentation',
          'Suggests systemic disease'
        ]
      },
      redFlags: [
        'Unintentional weight loss >10% body weight',
        'Fever with fatigue (infection, malignancy)',
        'Night sweats (malignancy, infection)',
        'Lymphadenopathy (malignancy, infection)',
        'Severe muscle weakness (neuromuscular disease)',
        'Chest pain with fatigue (cardiac cause)',
        'Severe dyspnea (cardiac or pulmonary cause)',
        'Signs of bleeding (GI bleed, hematologic malignancy)',
        'Jaundice (liver disease, hemolysis)',
        'Neurologic deficits (CNS pathology)'
      ],
      diagnosticApproach: {
        'Initial Laboratory Studies': [
          'Complete blood count with differential',
          'Complete metabolic panel',
          'Thyroid stimulating hormone (TSH)',
          'Ferritin and iron studies',
          'Vitamin B12 and folate levels',
          'Erythrocyte sedimentation rate (ESR)',
          'C-reactive protein (CRP)',
          'Urinalysis'
        ],
        'Second-Tier Testing (If Indicated)': [
          'Hemoglobin A1C (diabetes screening)',
          'Liver function tests',
          'Creatine kinase (muscle disease)',
          'Antinuclear antibody (ANA)',
          'HIV testing (if risk factors)',
          'Cortisol levels (adrenal function)',
          'Sleep study (if sleep apnea suspected)'
        ],
        'Specialized Testing': [
          'Echocardiogram (if cardiac symptoms)',
          'Pulmonary function tests (if respiratory symptoms)',
          'Polysomnography (sleep disorders)',
          'Psychiatric evaluation (mood disorders)'
        ]
      },
      sleepAssessment: {
        'Sleep History': [
          'Sleep duration (7-9 hours recommended for adults)',
          'Sleep quality and restorative nature',
          'Snoring, witnessed apneas',
          'Restless legs, periodic limb movements',
          'Sleep hygiene practices'
        ],
        'Sleep Disorders': [
          'Obstructive sleep apnea (most common)',
          'Insomnia (difficulty initiating/maintaining sleep)',
          'Restless legs syndrome',
          'Narcolepsy (excessive daytime sleepiness)',
          'Circadian rhythm disorders'
        ]
      },
      medicationCauses: {
        'Common Fatigue-Inducing Medications': [
          'Sedating antihistamines (diphenhydramine)',
          'Beta-blockers (propranolol, metoprolol)',
          'Antidepressants (tricyclics, some SSRIs)',
          'Anticonvulsants (phenytoin, carbamazepine)',
          'Opioid pain medications',
          'Benzodiazepines',
          'Muscle relaxants',
          'Some blood pressure medications'
        ]
      },
      ageGenderFactors: {
        'Young Adults (20-35)': ['Depression/anxiety', 'Iron deficiency', 'Viral syndromes', 'Sleep disorders', 'Stress'],
        'Middle Age (35-55)': ['Hypothyroidism', 'Sleep apnea', 'Depression', 'Diabetes', 'Heart disease'],
        'Older Adults (>55)': ['Multiple medical conditions', 'Medication effects', 'Heart failure', 'Malignancy', 'Anemia'],
        'Women': ['Iron deficiency anemia', 'Hypothyroidism', 'Depression', 'Autoimmune diseases'],
        'Men': ['Sleep apnea', 'Heart disease', 'Alcohol-related', 'Diabetes'],
        'Postmenopausal Women': ['Hormonal changes', 'Sleep disturbances', 'Mood changes']
      },
      chronicFatigueSyndrome: {
        'Diagnostic Criteria': [
          'Fatigue >6 months duration',
          'Substantial reduction in activity level',
          'Not explained by other medical conditions',
          'Post-exertional malaise',
          'Unrefreshing sleep',
          'Cognitive impairment or orthostatic intolerance'
        ],
        'Management': [
          'Pacing and energy conservation',
          'Graduated exercise therapy (controversial)',
          'Cognitive behavioral therapy',
          'Symptom management',
          'Sleep optimization'
        ]
      },
      treatmentApproach: {
        'Specific Treatments': [
          'Iron supplementation (iron deficiency)',
          'Thyroid hormone replacement (hypothyroidism)',
          'Antidepressants (depression/anxiety)',
          'CPAP therapy (sleep apnea)',
          'Diabetes management (hyperglycemia)'
        ],
        'General Measures': [
          'Sleep hygiene optimization',
          'Regular exercise program',
          'Stress management techniques',
          'Nutritional counseling',
          'Medication review and optimization'
        ]
      },
      urgency: 'varies',
      clinicalPearls: [
        'Fatigue is the most common symptom in primary care (up to 25% of visits)',
        'Depression is the most common psychiatric cause of fatigue',
        'Iron deficiency is the most common nutritional cause, especially in women',
        'Sleep apnea should be considered in all obese patients with fatigue',
        'Normal TSH doesn\'t rule out thyroid disease in some patients',
        'Post-viral fatigue can last weeks to months after infection',
        'Chronic fatigue syndrome is a diagnosis of exclusion',
        'Multiple causes often coexist (depression + sleep apnea + anemia)',
        'Medication review is essential - polypharmacy common cause',
        'Red flags warrant urgent evaluation - most fatigue is benign',
        'B12 deficiency can occur with normal B12 levels (check methylmalonic acid)',
        'Fatigue without other symptoms in young adults often suggests psychiatric cause'
      ]
    },
    'swelling': {
      pivotalPoints: [
        'Distribution (bilateral vs unilateral) is key to differential diagnosis',
        'Pitting vs non-pitting edema suggests different underlying mechanisms',
        'Associated symptoms help distinguish cardiac, renal, hepatic, and other causes',
        'Onset timing (acute vs chronic) guides urgency and evaluation approach'
      ],
      questions: [
        'Where exactly is the swelling located (legs, feet, hands, face, abdomen)?',
        'Is the swelling on one side or both sides of your body?',
        'When did you first notice the swelling?',
        'Is the swelling worse at certain times of day (morning vs evening)?',
        'When you press on the swelling, does it leave an indentation (pit)?',
        'Any shortness of breath, especially when lying flat or with activity?',
        'Do you wake up at night gasping for air?',
        'Any chest pain or palpitations?',
        'Any changes in your urination (amount, color, foaming)?',
        'Any abdominal pain or bloating?',
        'Have you gained weight recently? How much?',
        'Any nausea, vomiting, or loss of appetite?',
        'Any recent leg pain, redness, or warmth?',
        'Are you taking any medications?',
        'Any history of heart, kidney, or liver problems?',
        'Any recent travel, surgery, or prolonged immobilization?',
        'For women: Any changes in your menstrual cycle or could you be pregnant?'
      ],
      differentials: {
        'Bilateral Lower Extremity Edema': [
          { condition: 'Congestive Heart Failure', likelihood: 'high', features: 'Dyspnea, orthopnea, PND, JVD, S3 gallop, fatigue' },
          { condition: 'Chronic Kidney Disease', likelihood: 'high', features: 'Proteinuria, elevated creatinine, hypertension, uremic symptoms' },
          { condition: 'Nephrotic Syndrome', likelihood: 'moderate', features: 'Massive proteinuria, hypoalbuminemia, hyperlipidemia' },
          { condition: 'Liver Disease/Cirrhosis', likelihood: 'moderate', features: 'Ascites, jaundice, spider angiomata, hepatomegaly' },
          { condition: 'Medication-Induced', likelihood: 'high', features: 'CCBs, NSAIDs, steroids, thiazolidinediones' },
          { condition: 'Venous Insufficiency', likelihood: 'moderate', features: 'Chronic, worse with standing, venous stasis changes' }
        ],
        'Unilateral Lower Extremity Edema': [
          { condition: 'Deep Vein Thrombosis (DVT)', likelihood: 'high', features: 'Acute onset, pain, warmth, erythema, risk factors' },
          { condition: 'Cellulitis', likelihood: 'moderate', features: 'Erythema, warmth, tenderness, fever, skin breakdown' },
          { condition: 'Lymphedema', likelihood: 'low', features: 'Non-pitting, chronic, post-surgical, malignancy' },
          { condition: 'Baker\'s Cyst Rupture', likelihood: 'low', features: 'Posterior knee pain, history of knee arthritis' },
          { condition: 'Chronic Venous Insufficiency', likelihood: 'moderate', features: 'Varicose veins, skin changes, ulcerations' }
        ],
        'Facial/Periorbital Edema': [
          { condition: 'Nephrotic Syndrome', likelihood: 'high', features: 'Morning predominance, proteinuria, hypoalbuminemia' },
          { condition: 'Acute Glomerulonephritis', likelihood: 'moderate', features: 'Hematuria, hypertension, recent strep infection' },
          { condition: 'Angioedema', likelihood: 'moderate', features: 'Acute onset, asymmetric, lips/tongue involvement, allergic' },
          { condition: 'Superior Vena Cava Syndrome', likelihood: 'rare', features: 'Face/arm swelling, dyspnea, malignancy history' },
          { condition: 'Hypothyroidism', likelihood: 'low', features: 'Non-pitting, fatigue, weight gain, cold intolerance' }
        ],
        'Generalized Edema (Anasarca)': [
          { condition: 'Severe Heart Failure', likelihood: 'high', features: 'Severe LV dysfunction, cardiogenic shock' },
          { condition: 'End-Stage Renal Disease', likelihood: 'high', features: 'Severe CKD, uremic symptoms, oliguria' },
          { condition: 'Severe Liver Disease', likelihood: 'moderate', features: 'Decompensated cirrhosis, ascites, encephalopathy' },
          { condition: 'Severe Malnutrition', likelihood: 'low', features: 'Hypoalbuminemia, kwashiorkor, chronic illness' },
          { condition: 'Severe Hypothyroidism (Myxedema)', likelihood: 'rare', features: 'Non-pitting, bradycardia, hypothermia' }
        ],
        'Pregnancy-Related Edema': [
          { condition: 'Physiologic Edema of Pregnancy', likelihood: 'high', features: 'Third trimester, mild, no proteinuria' },
          { condition: 'Preeclampsia', likelihood: 'moderate', features: 'Hypertension, proteinuria, headache, visual changes' },
          { condition: 'HELLP Syndrome', likelihood: 'rare', features: 'Hemolysis, elevated liver enzymes, low platelets' }
        ]
      },
      clinicalAssessment: {
        'Pitting vs Non-Pitting': [
          'Pitting: Fluid retention (heart failure, renal, venous)',
          'Non-pitting: Lymphedema, myxedema, lipedema'
        ],
        'Distribution Patterns': [
          'Dependent: Heart failure, venous insufficiency, medications',
          'Facial: Renal disease, angioedema, superior vena cava syndrome',
          'Unilateral: DVT, cellulitis, lymphedema, local obstruction',
          'Generalized: Severe heart/kidney/liver disease, malnutrition'
        ],
        'Timing Patterns': [
          'Morning: Renal disease (especially facial)',
          'Evening: Cardiac disease, venous insufficiency',
          'Acute: DVT, cellulitis, angioedema, medication reaction',
          'Chronic: Heart failure, CKD, venous insufficiency'
        ]
      },
      redFlags: [
        'Acute unilateral leg swelling with pain (DVT)',
        'Facial swelling with difficulty breathing (angioedema)',
        'Severe dyspnea with bilateral edema (acute heart failure)',
        'Edema with chest pain (MI, pulmonary embolism)',
        'Pregnant woman with edema + hypertension + proteinuria (preeclampsia)',
        'Edema with oliguria and elevated creatinine (acute kidney injury)',
        'Superior vena cava syndrome (face/arm swelling + dyspnea)',
        'Massive ascites with edema (decompensated liver disease)',
        'Edema with signs of infection (cellulitis, necrotizing fasciitis)'
      ],
      diagnosticApproach: {
        'Initial Laboratory Studies': [
          'Complete metabolic panel (kidney function, electrolytes)',
          'Urinalysis with microscopy (proteinuria, hematuria)',
          'Complete blood count',
          'Liver function tests',
          'Thyroid stimulating hormone',
          'Brain natriuretic peptide (BNP/NT-proBNP)'
        ],
        'Cardiac Evaluation': [
          'Echocardiogram (systolic/diastolic function)',
          'Chest X-ray (cardiomegaly, pulmonary edema)',
          'ECG (ischemia, arrhythmias)'
        ],
        'Renal Evaluation': [
          '24-hour urine protein or spot urine protein/creatinine ratio',
          'Renal ultrasound',
          'Consider renal biopsy if glomerular disease suspected'
        ],
        'Vascular Studies': [
          'Venous duplex ultrasound (if DVT suspected)',
          'CT or MR venography (if central obstruction suspected)'
        ]
      },
      specificConditions: {
        'Heart Failure Assessment': [
          'NYHA Class: I-IV based on functional limitation',
          'Ejection fraction: HFrEF (<40%) vs HFpEF (≥50%)',
          'BNP/NT-proBNP: >400 pg/mL suggests heart failure',
          'Chest X-ray: Cardiomegaly, pulmonary vascular redistribution'
        ],
        'Nephrotic Syndrome Criteria': [
          'Proteinuria >3.5 g/day',
          'Hypoalbuminemia <3.0 g/dL',
          'Edema (typically facial, morning predominance)',
          'Hyperlipidemia (often present)'
        ],
        'DVT Risk Assessment (Wells Score)': [
          'Active cancer (1 point)',
          'Paralysis/paresis/immobilization (1 point)',
          'Bedridden >3 days or major surgery <4 weeks (1 point)',
          'Localized tenderness along deep veins (1 point)',
          'Entire leg swollen (1 point)',
          'Calf swelling >3 cm compared to asymptomatic leg (1 point)',
          'Pitting edema (1 point)',
          'Collateral superficial veins (1 point)',
          'Alternative diagnosis as likely or more likely (-2 points)'
        ]
      },
      medicationCauses: {
        'Common Edema-Causing Medications': [
          'Calcium channel blockers (especially amlodipine)',
          'NSAIDs (fluid retention, kidney dysfunction)',
          'Corticosteroids (mineralocorticoid effects)',
          'Thiazolidinediones (pioglitazone, rosiglitazone)',
          'Hormones (estrogen, testosterone)',
          'Minoxidil (vasodilation)',
          'Gabapentin/pregabalin'
        ]
      },
      treatmentApproach: {
        'Heart Failure': [
          'Diuretics (furosemide, bumetanide)',
          'ACE inhibitors/ARBs',
          'Beta-blockers',
          'Aldosterone antagonists',
          'Sodium restriction (<2g/day)'
        ],
        'Renal Disease': [
          'ACE inhibitors/ARBs for proteinuria',
          'Diuretics for volume overload',
          'Protein restriction if advanced CKD',
          'Treatment of underlying glomerular disease'
        ],
        'Venous Insufficiency': [
          'Compression stockings (20-30 mmHg)',
          'Leg elevation',
          'Exercise program',
          'Weight loss if obese'
        ],
        'DVT': [
          'Anticoagulation (warfarin, DOACs)',
          'Compression stockings',
          'Early ambulation',
          'Consider thrombolysis if massive'
        ]
      },
      ageGenderFactors: {
        'Young Women (20-40)': ['Pregnancy-related', 'DVT (OCPs)', 'Nephrotic syndrome', 'Medication-induced'],
        'Middle Age (40-65)': ['Heart failure', 'Medication-induced', 'Venous insufficiency', 'DVT'],
        'Elderly (>65)': ['Heart failure', 'Medication-induced', 'CKD', 'Venous insufficiency'],
        'Men': ['Heart failure', 'Liver disease', 'DVT', 'Medication-induced'],
        'Pregnant Women': ['Physiologic edema', 'Preeclampsia', 'DVT', 'Peripartum cardiomyopathy']
      },
      urgency: 'varies',
      clinicalPearls: [
        'Bilateral edema suggests systemic cause; unilateral suggests local cause',
        'Facial edema in morning suggests renal disease',
        'Leg edema worse in evening suggests cardiac or venous cause',
        'Non-pitting edema suggests lymphatic or thyroid disease',
        'BNP >400 pg/mL strongly suggests heart failure as cause',
        'Proteinuria >3.5 g/day defines nephrotic syndrome',
        'CCB-induced edema doesn\'t respond well to diuretics',
        'DVT can be painless, especially in elderly or diabetics',
        'Lymphedema typically starts distally and progresses proximally',
        'Venous insufficiency edema improves with leg elevation',
        'Myxedema is non-pitting and feels doughy',
        'Lipedema spares feet and is bilateral and symmetric'
      ]
    },
    'painful urination': {
      pivotalPoints: [
        'Gender significantly influences differential diagnosis and management approach',
        'Associated symptoms distinguish simple cystitis from complicated UTI or pyelonephritis',
        'Sexual history and discharge guide evaluation for sexually transmitted infections',
        'Recurrent episodes require evaluation for anatomic abnormalities or resistant organisms'
      ],
      questions: [
        'How long have you had painful urination?',
        'Is the pain during urination, before, or after?',
        'Where exactly do you feel the pain (burning sensation, location)?',
        'Do you have increased frequency or urgency of urination?',
        'Any blood in your urine or dark/cloudy urine?',
        'Any unusual vaginal or penile discharge?',
        'Any fever, chills, or feeling generally unwell?',
        'Any back pain, especially on the sides (flank pain)?',
        'Any nausea or vomiting?',
        'Are you sexually active? Any new sexual partners recently?',
        'For women: When was your last menstrual period? Could you be pregnant?',
        'Any history of kidney stones or urinary tract infections?',
        'Do you use any contraceptives (diaphragm, spermicides)?',
        'Any recent catheter placement or urologic procedures?',
        'Are you taking any medications or antibiotics?',
        'Do you have diabetes or any immune system problems?',
        'Any recent changes in soaps, detergents, or personal hygiene products?'
      ],
      differentials: {
        'Uncomplicated UTI (Healthy Women)': [
          { condition: 'Acute Cystitis', likelihood: 'very high', features: 'Dysuria, frequency, urgency, suprapubic pain, no fever' },
          { condition: 'Acute Urethritis', likelihood: 'moderate', features: 'Dysuria, discharge, sexually active, gradual onset' }
        ],
        'Complicated UTI': [
          { condition: 'Acute Pyelonephritis', likelihood: 'moderate', features: 'Fever, flank pain, nausea/vomiting, CVA tenderness' },
          { condition: 'UTI in Pregnancy', likelihood: 'varies', features: 'Pregnant women, higher risk of progression to pyelonephritis' },
          { condition: 'UTI in Men', likelihood: 'moderate', features: 'Always considered complicated, prostate involvement possible' },
          { condition: 'UTI with Diabetes', likelihood: 'moderate', features: 'Diabetic patients, higher risk of complications' },
          { condition: 'Catheter-Associated UTI', likelihood: 'high', features: 'Recent catheterization, healthcare exposure' }
        ],
        'Sexually Transmitted Infections': [
          { condition: 'Chlamydia Urethritis', likelihood: 'high', features: 'Gradual onset, discharge, sexually active, <25 years' },
          { condition: 'Gonorrhea Urethritis', likelihood: 'moderate', features: 'Purulent discharge, sexually active, rapid onset' },
          { condition: 'Herpes Simplex Virus', likelihood: 'moderate', features: 'Vesicles, severe dysuria, first episode vs recurrent' },
          { condition: 'Trichomoniasis', likelihood: 'low', features: 'Frothy discharge, malodorous, sexually transmitted' }
        ],
        'Non-Infectious Causes': [
          { condition: 'Interstitial Cystitis/Bladder Pain Syndrome', likelihood: 'low', features: 'Chronic symptoms, sterile urine, pelvic pain' },
          { condition: 'Chemical/Irritant Cystitis', likelihood: 'moderate', features: 'New soaps, detergents, spermicides, bubble baths' },
          { condition: 'Atrophic Vaginitis', likelihood: 'moderate', features: 'Postmenopausal women, vaginal dryness, dyspareunia' },
          { condition: 'Urethral Stricture', likelihood: 'low', features: 'Men, decreased stream, history of trauma/infection' },
          { condition: 'Bladder Cancer', likelihood: 'rare', features: 'Hematuria, age >50, smoking history, painless initially' }
        ],
        'Male-Specific Causes': [
          { condition: 'Prostatitis (Acute)', likelihood: 'moderate', features: 'Fever, perineal pain, tender prostate on exam' },
          { condition: 'Prostatitis (Chronic)', likelihood: 'moderate', features: 'Chronic pelvic pain, recurrent UTIs, voiding symptoms' },
          { condition: 'Epididymitis', likelihood: 'moderate', features: 'Scrotal pain/swelling, sexually active or urinary retention' },
          { condition: 'Urethral Stricture', likelihood: 'low', features: 'Decreased stream, history of trauma, GC infection' }
        ],
        'Female-Specific Causes': [
          { condition: 'Vulvovaginal Candidiasis', likelihood: 'high', features: 'External dysuria, thick white discharge, itching' },
          { condition: 'Bacterial Vaginosis', likelihood: 'moderate', features: 'Fishy odor, thin gray discharge, clue cells' },
          { condition: 'Urethral Syndrome', likelihood: 'low', features: 'Dysuria without pyuria, frequency, negative cultures' },
          { condition: 'Pelvic Inflammatory Disease', likelihood: 'low', features: 'Pelvic pain, fever, cervical motion tenderness' }
        ]
      },
      diagnosticCriteria: {
        'Uncomplicated Cystitis (Women)': [
          'Dysuria, frequency, urgency, suprapubic pain',
          'No fever, flank pain, or vaginal discharge',
          'Healthy, non-pregnant, premenopausal women',
          'No recent UTI or antibiotic use'
        ],
        'Complicated UTI': [
          'Men with UTI symptoms',
          'Pregnant women',
          'Immunocompromised patients',
          'Anatomic abnormalities',
          'Recent instrumentation',
          'Symptoms >7 days'
        ],
        'Pyelonephritis': [
          'Fever >100.4°F (38°C)',
          'Flank pain or CVA tenderness',
          'Nausea/vomiting',
          'May have cystitis symptoms'
        ]
      },
      redFlags: [
        'Fever with flank pain (pyelonephritis)',
        'Signs of sepsis (hypotension, altered mental status)',
        'Inability to urinate (urinary retention)',
        'Gross hematuria with dysuria',
        'Severe abdominal or pelvic pain',
        'Pregnant woman with UTI symptoms',
        'Immunocompromised patient with dysuria',
        'Recent urologic procedure with new symptoms',
        'Recurrent UTIs (>3 in 12 months)',
        'Male with acute urinary retention and fever'
      ],
      riskFactors: {
        'UTI Risk Factors (Women)': [
          'Sexual activity (especially new partner)',
          'Diaphragm or spermicide use',
          'Recent antibiotic use',
          'Diabetes mellitus',
          'Pregnancy',
          'Menopause (decreased estrogen)',
          'Previous UTI',
          'Urinary retention'
        ],
        'UTI Risk Factors (Men)': [
          'Benign prostatic hyperplasia',
          'Prostatitis',
          'Urethral stricture',
          'Immunosuppression',
          'Diabetes mellitus',
          'Recent instrumentation'
        ],
        'STI Risk Factors': [
          'Age <25 years',
          'Multiple sexual partners',
          'New sexual partner',
          'Unprotected sexual activity',
          'History of STIs',
          'Partner with STI'
        ]
      },
      diagnosticApproach: {
        'Uncomplicated Cystitis (Women)': [
          'Clinical diagnosis acceptable in typical presentation',
          'Urine dipstick (nitrites, leukocyte esterase)',
          'Urine culture if recurrent or treatment failure'
        ],
        'Complicated UTI': [
          'Urine culture and sensitivity (always)',
          'Complete blood count',
          'Basic metabolic panel',
          'Blood cultures if febrile',
          'Consider imaging if severe or recurrent'
        ],
        'STI Evaluation': [
          'Nucleic acid amplification test (NAAT) for chlamydia/gonorrhea',
          'HSV PCR if vesicles present',
          'Wet mount for trichomonas',
          'Consider HIV and syphilis testing'
        ]
      },
      treatmentApproach: {
        'Uncomplicated Cystitis': [
          'Nitrofurantoin 100mg BID x 5 days (first-line)',
          'Trimethoprim-sulfamethoxazole DS BID x 3 days (if resistance <20%)',
          'Fosfomycin 3g single dose (alternative)',
          'Avoid fluoroquinolones unless no alternatives'
        ],
        'Complicated UTI/Pyelonephritis': [
          'Fluoroquinolones (ciprofloxacin, levofloxacin)',
          'Cephalexin (if mild, gram-positive coverage)',
          'Consider hospitalization if severe',
          'Duration: 7-14 days depending on severity'
        ],
        'STI Treatment': [
          'Chlamydia: Azithromycin 1g single dose or doxycycline 100mg BID x 7 days',
          'Gonorrhea: Ceftriaxone 500mg IM single dose',
          'HSV: Acyclovir, valacyclovir, or famciclovir',
          'Partner treatment essential'
        ]
      },
      ageGenderFactors: {
        'Young Women (18-35)': ['Uncomplicated cystitis', 'STIs (chlamydia, gonorrhea)', 'Honeymoon cystitis'],
        'Older Women (>50)': ['Complicated UTI', 'Atrophic vaginitis', 'Bladder cancer', 'Diabetes-related'],
        'Young Men (<35)': ['STIs', 'Urethritis', 'Trauma-related'],
        'Older Men (>50)': ['Prostatitis', 'BPH-related UTI', 'Bladder cancer'],
        'Pregnant Women': ['Asymptomatic bacteriuria', 'Complicated UTI', 'Higher pyelonephritis risk'],
        'Children': ['Anatomic abnormalities', 'Vesicoureteral reflux', 'Constipation-related']
      },
      recurrentUTI: {
        'Definition': '>2 UTIs in 6 months or >3 UTIs in 12 months',
        'Evaluation': [
          'Urine culture during and after treatment',
          'Post-void residual',
          'Consider cystoscopy',
          'Imaging (ultrasound, CT urogram) if indicated'
        ],
        'Prevention': [
          'Increased fluid intake',
          'Post-coital voiding',
          'Cranberry products',
          'Prophylactic antibiotics if frequent',
          'Topical estrogen (postmenopausal women)'
        ]
      },
      urgency: 'varies',
      clinicalPearls: [
        'Dysuria + frequency + urgency = classic cystitis triad',
        'Nitrites more specific than leukocyte esterase for bacterial UTI',
        'UTIs in men are always considered complicated',
        'Asymptomatic bacteriuria should not be treated (except pregnancy)',
        'Post-coital UTIs common in sexually active women',
        'Cranberry products may reduce recurrent UTIs in women',
        'E. coli causes 75-85% of uncomplicated cystitis',
        'Fluoroquinolone resistance increasing - avoid as first-line',
        'Always consider STIs in sexually active patients <25 years',
        'Interstitial cystitis: dysuria with sterile urine cultures',
        'Phenazopyridine provides symptomatic relief but not treatment'
      ]
    },
    'shortness of breath': {
      pivotalPoints: [
        'Acute vs chronic onset determines urgency and differential diagnosis approach',
        'Associated chest pain, fever, or hemoptysis suggest specific etiologies',
        'Exertional vs rest dyspnea helps distinguish cardiac from pulmonary causes',
        'Orthopnea and paroxysmal nocturnal dyspnea are classic heart failure symptoms'
      ],
      questions: [
        'When did your shortness of breath start (suddenly, over hours, days, weeks)?',
        'What were you doing when it started?',
        'Do you have shortness of breath at rest or only with activity?',
        'How much activity can you do before getting short of breath?',
        'Do you get short of breath lying flat? How many pillows do you sleep with?',
        'Do you wake up at night gasping for air?',
        'Any chest pain, pressure, or tightness?',
        'Any cough? Are you bringing up any sputum or blood?',
        'Any fever, chills, or feeling generally unwell?',
        'Any leg swelling, weight gain, or feeling bloated?',
        'Any palpitations or irregular heartbeat?',
        'Any recent travel, especially long flights or car rides?',
        'Any history of heart problems, lung disease, or blood clots?',
        'Do you smoke or have you ever smoked? How much?',
        'Any known allergies or recent new exposures?',
        'Are you taking any medications?',
        'Any family history of heart or lung disease?'
      ],
      differentials: {
        'Acute Life-Threatening (Emergency)': [
          { condition: 'Pulmonary Embolism', likelihood: 'moderate', features: 'Sudden onset, pleuritic chest pain, risk factors (travel, surgery, malignancy)' },
          { condition: 'Acute Myocardial Infarction', likelihood: 'moderate', features: 'Chest pain, diaphoresis, nausea, cardiac risk factors' },
          { condition: 'Pneumothorax', likelihood: 'low', features: 'Sudden onset, pleuritic pain, tall thin males, decreased breath sounds' },
          { condition: 'Acute Heart Failure/Pulmonary Edema', likelihood: 'moderate', features: 'Orthopnea, PND, rales, JVD, known heart disease' },
          { condition: 'Anaphylaxis', likelihood: 'low', features: 'Rapid onset, urticaria, angioedema, known allergen exposure' },
          { condition: 'Tension Pneumothorax', likelihood: 'rare', features: 'Severe respiratory distress, tracheal deviation, absent breath sounds' }
        ],
        'Acute Non-Life-Threatening': [
          { condition: 'Pneumonia', likelihood: 'high', features: 'Fever, productive cough, consolidation on exam, elderly or immunocompromised' },
          { condition: 'Asthma Exacerbation', likelihood: 'moderate', features: 'Wheezing, peak flow reduction, known asthma, triggers' },
          { condition: 'COPD Exacerbation', likelihood: 'moderate', features: 'Smoking history, increased sputum, wheezing, barrel chest' },
          { condition: 'Upper Respiratory Infection', likelihood: 'moderate', features: 'Gradual onset, rhinorrhea, sore throat, low-grade fever' },
          { condition: 'Anxiety/Panic Attack', likelihood: 'moderate', features: 'Sudden onset, palpitations, sweating, sense of doom' }
        ],
        'Chronic Dyspnea': [
          { condition: 'Heart Failure', likelihood: 'high', features: 'Exertional dyspnea, orthopnea, PND, edema, fatigue' },
          { condition: 'Chronic Obstructive Pulmonary Disease (COPD)', likelihood: 'high', features: 'Smoking history, chronic cough, sputum production, progressive' },
          { condition: 'Asthma', likelihood: 'moderate', features: 'Episodic, triggers, wheezing, family history, atopy' },
          { condition: 'Interstitial Lung Disease', likelihood: 'low', features: 'Progressive, dry cough, fine crackles, occupational exposure' },
          { condition: 'Pulmonary Hypertension', likelihood: 'low', features: 'Exertional dyspnea, fatigue, syncope, loud P2' },
          { condition: 'Anemia', likelihood: 'moderate', features: 'Fatigue, pallor, exertional symptoms, menorrhagia' }
        ],
        'Cardiac Causes': [
          { condition: 'Systolic Heart Failure (HFrEF)', likelihood: 'high', features: 'EF <40%, dilated ventricle, S3 gallop' },
          { condition: 'Diastolic Heart Failure (HFpEF)', likelihood: 'high', features: 'Normal EF, elderly, hypertension, diabetes' },
          { condition: 'Valvular Disease', likelihood: 'moderate', features: 'Murmur, elderly, rheumatic disease, progressive symptoms' },
          { condition: 'Arrhythmias', likelihood: 'moderate', features: 'Palpitations, irregular pulse, sudden onset' },
          { condition: 'Pericardial Disease', likelihood: 'low', features: 'Chest pain, friction rub, recent viral illness' }
        ]
      },
      clinicalAssessment: {
        'Functional Classification (NYHA)': [
          'Class I: No limitation - normal activity without symptoms',
          'Class II: Slight limitation - symptoms with ordinary activity',
          'Class III: Marked limitation - symptoms with less than ordinary activity',
          'Class IV: Severe limitation - symptoms at rest'
        ],
        'Orthopnea Assessment': [
          'Number of pillows needed to sleep comfortably',
          'Inability to lie flat due to dyspnea',
          'Suggests heart failure or severe lung disease'
        ],
        'Paroxysmal Nocturnal Dyspnea (PND)': [
          'Awakening from sleep with severe dyspnea',
          'Relief by sitting up or standing',
          'Classic for heart failure'
        ]
      },
      redFlags: [
        'Severe respiratory distress (unable to speak in full sentences)',
        'Hypoxemia (O2 saturation <90% on room air)',
        'Signs of shock (hypotension, altered mental status)',
        'Chest pain with dyspnea (MI, PE, pneumothorax)',
        'Hemoptysis with acute dyspnea (PE, pneumonia)',
        'Stridor (upper airway obstruction)',
        'Asymmetric breath sounds (pneumothorax, massive pleural effusion)',
        'Signs of anaphylaxis (urticaria, angioedema)',
        'Acute dyspnea in high-risk PE patient (recent surgery, malignancy)'
      ],
      riskStratification: {
        'Pulmonary Embolism (Wells Score)': [
          'Clinical signs of DVT (3 points)',
          'PE more likely than alternative diagnosis (3 points)',
          'Heart rate >100 (1.5 points)',
          'Immobilization/surgery in past 4 weeks (1.5 points)',
          'Previous PE/DVT (1.5 points)',
          'Hemoptysis (1 point)',
          'Malignancy (1 point)'
        ],
        'Heart Failure Risk Factors': [
          'Coronary artery disease',
          'Hypertension',
          'Diabetes mellitus',
          'Previous MI',
          'Valvular disease',
          'Cardiomyopathy'
        ]
      },
      diagnosticApproach: {
        'Acute Dyspnea Workup': [
          'Chest X-ray (pneumonia, pneumothorax, pulmonary edema)',
          'ECG (MI, arrhythmias)',
          'Arterial blood gas or pulse oximetry',
          'D-dimer (if PE suspected and low-intermediate probability)',
          'BNP/NT-proBNP (heart failure)',
          'Complete blood count (anemia)'
        ],
        'Chronic Dyspnea Workup': [
          'Echocardiogram (heart failure, valvular disease)',
          'Pulmonary function tests (asthma, COPD, restrictive disease)',
          'Chest CT (interstitial lung disease, malignancy)',
          'Exercise stress testing (cardiac vs pulmonary limitation)',
          'Cardiopulmonary exercise testing (if unclear etiology)'
        ]
      },
      physicalExamFindings: {
        'Heart Failure': [
          'Elevated JVD, S3 gallop, displaced PMI',
          'Bilateral lower extremity edema',
          'Hepatomegaly, ascites (right heart failure)'
        ],
        'Pneumonia': [
          'Fever, tachypnea, decreased breath sounds',
          'Crackles, bronchial breath sounds',
          'Dullness to percussion'
        ],
        'COPD': [
          'Barrel chest, pursed lip breathing',
          'Decreased breath sounds, wheeze',
          'Hyperresonance to percussion'
        ],
        'Asthma': [
          'Wheeze (inspiratory and expiratory)',
          'Prolonged expiratory phase',
          'Use of accessory muscles'
        ]
      },
      ageGenderFactors: {
        'Young Adults (20-40)': ['Asthma', 'Pneumothorax', 'Anxiety', 'Pulmonary embolism'],
        'Middle Age (40-65)': ['Coronary artery disease', 'Heart failure', 'COPD', 'Pulmonary embolism'],
        'Elderly (>65)': ['Heart failure', 'COPD', 'Pneumonia', 'Pulmonary embolism'],
        'Women': ['Pulmonary embolism (pregnancy, OCP)', 'Anxiety disorders', 'Autoimmune diseases'],
        'Men': ['Coronary artery disease', 'COPD (smoking)', 'Pneumothorax (tall, thin)'],
        'Pregnancy': ['Peripartum cardiomyopathy', 'Pulmonary embolism', 'Asthma exacerbation']
      },
      treatmentPriorities: {
        'Immediate (Emergency)': [
          'Oxygen therapy if hypoxemic',
          'IV access and cardiac monitoring',
          'Chest X-ray and ECG',
          'Consider thrombolytics for massive PE',
          'Diuretics for acute pulmonary edema'
        ],
        'Acute Stabilization': [
          'Bronchodilators for asthma/COPD',
          'Antibiotics for pneumonia',
          'Anticoagulation for PE',
          'Anxiolytics for panic (after excluding organic causes)'
        ],
        'Chronic Management': [
          'Heart failure medications (ACE-I, beta-blockers, diuretics)',
          'Pulmonary rehabilitation for COPD',
          'Inhaled medications for asthma',
          'Oxygen therapy if chronically hypoxemic'
        ]
      },
      urgency: 'immediate',
      clinicalPearls: [
        'Dyspnea at rest is always concerning and requires urgent evaluation',
        'BNP/NT-proBNP >400 pg/mL suggests heart failure as cause',
        'D-dimer has high sensitivity but low specificity for PE',
        'Orthopnea and PND are highly specific for heart failure',
        'Pink frothy sputum is pathognomonic for pulmonary edema',
        'Unilateral leg swelling suggests DVT; bilateral suggests heart failure',
        'Normal chest X-ray does not rule out PE or early pneumonia',
        'Anxiety can cause dyspnea but is a diagnosis of exclusion',
        'Platypnea-orthodeoxia: dyspnea when upright (hepatopulmonary syndrome)',
        'Silent MI common in diabetics and elderly - dyspnea may be only symptom'
      ]
    },
    'dizziness': {
      pivotalPoints: [
        'Four main subtypes: vertigo, presyncope, disequilibrium, and lightheadedness',
        'Timing and triggers help distinguish peripheral from central vertigo',
        'Associated neurologic symptoms suggest central (brainstem/cerebellar) pathology',
        'Orthostatic vital signs are crucial for presyncope evaluation'
      ],
      questions: [
        'Can you describe exactly what you mean by "dizzy" - do you feel like the room is spinning?',
        'Does it feel like you might faint or pass out?',
        'Do you feel unsteady on your feet or off-balance?',
        'When did the dizziness start and how long does each episode last?',
        'What triggers the dizziness (head movements, standing up, lying down)?',
        'Any nausea or vomiting with the dizziness?',
        'Any hearing loss, ringing in ears, or ear fullness?',
        'Any headache, double vision, or trouble speaking?',
        'Any numbness, tingling, or weakness anywhere?',
        'Do you feel dizzy when lying completely still?',
        'Any recent upper respiratory infection or ear infection?',
        'Any new medications or changes in medications?',
        'Do you have high blood pressure, diabetes, or heart problems?',
        'Any recent head injury or whiplash?',
        'Does the dizziness happen when you roll over in bed?',
        'Any chest pain, palpitations, or shortness of breath?',
        'Have you had any falls or near-falls?'
      ],
      differentials: {
        'Peripheral Vertigo (Inner Ear)': [
          { condition: 'Benign Paroxysmal Positional Vertigo (BPPV)', likelihood: 'very high', features: 'Brief episodes with head movement, Dix-Hallpike positive, no hearing loss' },
          { condition: 'Vestibular Neuritis/Labyrinthitis', likelihood: 'moderate', features: 'Sudden onset, continuous vertigo, nausea/vomiting, recent viral illness' },
          { condition: 'Ménière\'s Disease', likelihood: 'low', features: 'Episodic vertigo, fluctuating hearing loss, tinnitus, ear fullness' },
          { condition: 'Vestibular Migraine', likelihood: 'moderate', features: 'Episodic vertigo, migraine history, photophobia, phonophobia' },
          { condition: 'Medication-Induced (Ototoxicity)', likelihood: 'low', features: 'Aminoglycosides, loop diuretics, chemotherapy, bilateral symptoms' }
        ],
        'Central Vertigo (Brainstem/Cerebellum)': [
          { condition: 'Posterior Circulation Stroke/TIA', likelihood: 'low but critical', features: 'Acute onset, neurologic deficits, vascular risk factors' },
          { condition: 'Vestibular Migraine', likelihood: 'moderate', features: 'Episodic, migraine history, visual aura, family history' },
          { condition: 'Multiple Sclerosis', likelihood: 'low', features: 'Young adults, other neurologic symptoms, relapsing-remitting' },
          { condition: 'Acoustic Neuroma', likelihood: 'rare', features: 'Gradual unilateral hearing loss, tinnitus, facial numbness' },
          { condition: 'Cerebellar Pathology', likelihood: 'low', features: 'Ataxia, dysmetria, nystagmus, headache' }
        ],
        'Presyncope (Near-Fainting)': [
          { condition: 'Orthostatic Hypotension', likelihood: 'high', features: 'Dizziness when standing, elderly, medications, dehydration' },
          { condition: 'Vasovagal Syncope', likelihood: 'moderate', features: 'Situational triggers, prodromal symptoms, young adults' },
          { condition: 'Cardiac Arrhythmias', likelihood: 'moderate', features: 'Palpitations, structural heart disease, sudden onset' },
          { condition: 'Medication-Induced', likelihood: 'high', features: 'Antihypertensives, diuretics, antidepressants, polypharmacy' },
          { condition: 'Volume Depletion', likelihood: 'moderate', features: 'Poor oral intake, diarrhea, diuretics, heat exposure' }
        ],
        'Disequilibrium (Imbalance)': [
          { condition: 'Multisensory Dizziness', likelihood: 'high', features: 'Elderly, multiple deficits (vision, hearing, proprioception, vestibular)' },
          { condition: 'Cerebellar Dysfunction', likelihood: 'low', features: 'Ataxia, alcohol use, medications, genetic disorders' },
          { condition: 'Peripheral Neuropathy', likelihood: 'moderate', features: 'Diabetes, alcohol, B12 deficiency, stocking-glove distribution' },
          { condition: 'Parkinson\'s Disease', likelihood: 'low', features: 'Bradykinesia, rigidity, tremor, postural instability' }
        ],
        'Psychogenic/Psychiatric': [
          { condition: 'Anxiety/Panic Disorder', likelihood: 'moderate', features: 'Palpitations, sweating, fear, trigger situations' },
          { condition: 'Depression', likelihood: 'low', features: 'Persistent lightheadedness, mood symptoms, anhedonia' },
          { condition: 'Hyperventilation Syndrome', likelihood: 'low', features: 'Rapid breathing, paresthesias, carpopedal spasm' }
        ]
      },
      clinicalTests: {
        'BPPV Assessment': [
          'Dix-Hallpike Test: Head turned 45°, rapid move to lying with head hanging',
          'Supine Roll Test: For horizontal canal BPPV',
          'Positive: Rotatory nystagmus with latency, fatigue, reproduction of vertigo'
        ],
        'Vestibular Function': [
          'Head Impulse Test (HIT): Rapid head turn, catch-up saccades suggest peripheral',
          'Romberg Test: Eyes closed, increased sway suggests sensory ataxia',
          'Tandem Gait: Walking heel-to-toe, tests cerebellar function'
        ],
        'Orthostatic Vitals': [
          'Lying BP/HR → Standing BP/HR after 3 minutes',
          'Positive: SBP drop ≥20 mmHg or DBP drop ≥10 mmHg',
          'Or HR increase ≥30 bpm (POTS if no BP drop)'
        ]
      },
      redFlags: [
        'Acute vertigo with neurologic deficits (stroke/TIA)',
        'Sudden severe headache with dizziness (SAH, posterior fossa mass)',
        'Diplopia, dysarthria, or dysphagia (brainstem pathology)',
        'Focal neurologic deficits (weakness, numbness, ataxia)',
        'New-onset vertigo in elderly with vascular risk factors',
        'Hearing loss with vertigo (especially unilateral, sudden)',
        'Chest pain or palpitations with presyncope (cardiac cause)',
        'Syncope or near-syncope (especially if recurrent)',
        'Signs of increased intracranial pressure'
      ],
      differentiatingFeatures: {
        'Peripheral vs Central Vertigo': [
          'Peripheral: Horizontal/rotatory nystagmus, hearing symptoms, no neurologic deficits',
          'Central: Vertical nystagmus, neurologic deficits, no hearing loss, constant symptoms'
        ],
        'BPPV vs Vestibular Neuritis': [
          'BPPV: Brief episodes (<1 min), positional, Dix-Hallpike positive',
          'Vestibular Neuritis: Continuous vertigo, days duration, spontaneous nystagmus'
        ],
        'Ménière\'s vs Migraine': [
          'Ménière\'s: Hearing loss, tinnitus, ear fullness, 20min-24hr episodes',
          'Migraine: Headache, photophobia, phonophobia, triggers, family history'
        ]
      },
      timingPatterns: {
        'Seconds': 'BPPV (typically <60 seconds)',
        'Minutes to Hours': 'Migraine, panic attacks, TIA',
        'Hours to Days': 'Vestibular neuritis, Ménière\'s attack',
        'Continuous': 'Medication effects, central lesions, anxiety',
        'Episodic/Recurrent': 'BPPV, Ménière\'s, migraine, cardiac arrhythmias'
      },
      ageGenderFactors: {
        'Young Adults (20-40)': ['BPPV', 'Vestibular migraine', 'Anxiety/panic', 'Multiple sclerosis'],
        'Middle Age (40-65)': ['BPPV', 'Ménière\'s disease', 'Medication effects', 'Cardiac arrhythmias'],
        'Elderly (>65)': ['BPPV', 'Orthostatic hypotension', 'Multisensory dizziness', 'Medication effects'],
        'Women': ['Vestibular migraine (3:1 ratio)', 'BPPV (2:1 ratio)', 'Thyroid disorders'],
        'Men': ['Ménière\'s disease', 'Acoustic neuroma', 'Cardiovascular causes']
      },
      medicationCauses: {
        'Ototoxic': ['Aminoglycosides', 'Loop diuretics', 'Aspirin (high dose)', 'Chemotherapy agents'],
        'Hypotensive': ['ACE inhibitors', 'ARBs', 'Beta-blockers', 'Diuretics'],
        'Sedating': ['Benzodiazepines', 'Antihistamines', 'Antidepressants', 'Anticonvulsants'],
        'Other': ['Antiarrhythmics', 'Antibiotics', 'NSAIDs', 'Alcohol']
      },
      treatmentApproach: {
        'BPPV': [
          'Canalith repositioning procedures (Epley maneuver)',
          'Home exercises (Brandt-Daroff)',
          'Avoid prolonged bed rest'
        ],
        'Vestibular Neuritis': [
          'Corticosteroids (if early presentation)',
          'Vestibular suppressants (short-term only)',
          'Vestibular rehabilitation therapy'
        ],
        'Orthostatic Hypotension': [
          'Medication review and adjustment',
          'Increased fluid/salt intake',
          'Compression stockings',
          'Fludrocortisone if severe'
        ],
        'Vestibular Migraine': [
          'Migraine prophylaxis',
          'Trigger identification and avoidance',
          'Vestibular rehabilitation'
        ]
      },
      urgency: 'varies',
      clinicalPearls: [
        'BPPV is the most common cause of vertigo (35% of cases)',
        'True vertigo (spinning sensation) suggests vestibular pathology',
        'Vertical nystagmus always suggests central (brainstem) pathology',
        'Dix-Hallpike test is 79% sensitive, 75% specific for posterior canal BPPV',
        'Orthostatic hypotension is common in elderly (20% prevalence)',
        'Vestibular suppressants should be used sparingly (delay compensation)',
        'Most peripheral vertigo is self-limiting and improves with compensation',
        'HINTS exam (Head Impulse, Nystagmus, Test of Skew) helps distinguish central vs peripheral',
        'Ménière\'s triad: vertigo, hearing loss, tinnitus (but not always complete)',
        'Medication review is essential - polypharmacy common cause in elderly'
      ]
    },
    'diarrhea': {
      pivotalPoints: [
        'Duration distinguishes acute (<14 days) vs chronic (>4 weeks) diarrhea',
        'Presence of blood, fever, and systemic symptoms suggests inflammatory diarrhea',
        'Travel history and food exposure guide infectious etiology assessment',
        'Dehydration assessment is critical for determining treatment urgency'
      ],
      questions: [
        'How long have you had diarrhea (hours, days, weeks)?',
        'How many bowel movements per day are you having?',
        'What does the stool look like (watery, bloody, mucousy, greasy)?',
        'Do you have fever, chills, or feel generally unwell?',
        'Any abdominal pain or cramping? Where is it located?',
        'Any nausea or vomiting?',
        'Are you able to keep fluids down?',
        'Do you feel dizzy when standing up?',
        'Any recent travel, especially internationally?',
        'What have you eaten in the past 72 hours? Any dining out, picnics, or unusual foods?',
        'Has anyone else who ate with you become sick?',
        'Any recent antibiotic use in the past month?',
        'Do you take any medications regularly?',
        'Any known food allergies or lactose intolerance?',
        'Have you been camping or drinking untreated water?',
        'Any recent hospitalization or healthcare facility exposure?',
        'Do you have any chronic medical conditions?'
      ],
      differentials: {
        'Infectious Diarrhea (Most Common Acute)': [
          { condition: 'Viral Gastroenteritis (Norovirus, Rotavirus)', likelihood: 'very high', features: 'Watery diarrhea, vomiting, short duration (24-72h), family clusters' },
          { condition: 'Bacterial Food Poisoning', likelihood: 'high', features: 'Rapid onset (1-6h), nausea/vomiting, specific food exposure' },
          { condition: 'Campylobacter jejuni', likelihood: 'moderate', features: 'Bloody diarrhea, fever, abdominal pain, poultry exposure' },
          { condition: 'Salmonella (non-typhi)', likelihood: 'moderate', features: 'Bloody diarrhea, fever, eggs/poultry, pet reptiles' },
          { condition: 'Shigella', likelihood: 'moderate', features: 'Bloody diarrhea, fever, person-to-person spread, daycare' },
          { condition: 'E. coli (STEC/EHEC)', likelihood: 'low', features: 'Bloody diarrhea, severe cramping, ground beef, HUS risk' },
          { condition: 'C. difficile', likelihood: 'moderate', features: 'Recent antibiotics, healthcare exposure, pseudomembranous colitis' }
        ],
        'Non-Infectious Causes': [
          { condition: 'Medication-Induced', likelihood: 'high', features: 'Recent medication changes, antibiotics, laxatives, antacids' },
          { condition: 'Food Intolerance', likelihood: 'moderate', features: 'Lactose intolerance, artificial sweeteners, specific food triggers' },
          { condition: 'Inflammatory Bowel Disease Flare', likelihood: 'low', features: 'Known IBD, bloody diarrhea, extraintestinal symptoms' },
          { condition: 'Ischemic Colitis', likelihood: 'low', features: 'Elderly, vascular disease, left-sided abdominal pain' },
          { condition: 'Hyperthyroidism', likelihood: 'low', features: 'Weight loss, palpitations, heat intolerance' }
        ],
        'Traveler\'s Diarrhea': [
          { condition: 'Enterotoxigenic E. coli (ETEC)', likelihood: 'very high', features: 'Most common, watery diarrhea, developing countries' },
          { condition: 'Campylobacter', likelihood: 'moderate', features: 'Bloody diarrhea, Southeast Asia' },
          { condition: 'Shigella', likelihood: 'moderate', features: 'Bloody diarrhea, poor sanitation areas' },
          { condition: 'Parasites (Giardia, Cryptosporidium)', likelihood: 'low', features: 'Prolonged symptoms, camping, untreated water' }
        ],
        'Severe Complications': [
          { condition: 'Hemolytic Uremic Syndrome (HUS)', likelihood: 'rare', features: 'E. coli O157:H7, bloody diarrhea, kidney failure, hemolysis' },
          { condition: 'Toxic Megacolon', likelihood: 'rare', features: 'C. diff, IBD, severe illness, colonic distension' },
          { condition: 'Severe Dehydration/Shock', likelihood: 'varies', features: 'High-volume losses, elderly, comorbidities' }
        ]
      },
      clinicalAssessment: {
        'Inflammatory vs Non-inflammatory': [
          'Inflammatory: Blood/mucus, fever, fecal WBCs, severe cramping',
          'Non-inflammatory: Watery, no fever, no blood, periumbilical cramping'
        ],
        'Dehydration Assessment': [
          'Mild (3-5%): Thirst, dry mouth, decreased urine',
          'Moderate (6-9%): Orthostatic changes, sunken eyes, skin tenting',
          'Severe (>10%): Shock, altered mental status, oliguria'
        ]
      },
      redFlags: [
        'Signs of severe dehydration (hypotension, altered mental status)',
        'High fever >101.3°F (39.5°C) with bloody diarrhea',
        'Severe abdominal pain with peritoneal signs',
        'Signs of HUS (oliguria, pallor, petechiae)',
        'Age >65 with severe symptoms',
        'Immunocompromised patient with diarrhea',
        'Recent antibiotic use with severe colitis symptoms',
        'Profuse watery diarrhea (>1L/hour - cholera-like)',
        'Inability to maintain oral hydration'
      ],
      foodPoisoningTimeframes: {
        '1-6 hours (Preformed Toxins)': [
          'S. aureus (dairy, mayonnaise, cream)',
          'B. cereus (fried rice, pasta)',
          'C. perfringens (meat, poultry)'
        ],
        '8-22 hours': [
          'C. perfringens (delayed form)',
          'B. cereus (diarrheal form)'
        ],
        '1-3 days': [
          'Salmonella (eggs, poultry)',
          'Campylobacter (poultry)',
          'Shigella (person-to-person)'
        ],
        '3-5 days': [
          'E. coli O157:H7 (ground beef)',
          'Yersinia (pork, dairy)'
        ]
      },
      riskFactors: {
        'High Risk Patients': [
          'Age >65 or <2 years',
          'Immunocompromised (HIV, transplant, chemotherapy)',
          'Chronic medical conditions (diabetes, kidney disease)',
          'Pregnancy',
          'Inflammatory bowel disease'
        ],
        'Severe Disease Risk': [
          'Recent antibiotic use (C. diff risk)',
          'Proton pump inhibitor use',
          'Recent hospitalization',
          'Travel to high-risk areas'
        ]
      },
      diagnosticApproach: {
        'Stool Testing Indications': [
          'Fever + bloody diarrhea',
          'Severe dehydration',
          'Duration >7 days',
          'Recent antibiotic use (C. diff)',
          'Immunocompromised patient',
          'Food handler or healthcare worker',
          'Outbreak investigation'
        ],
        'Stool Tests': [
          'Stool culture (Salmonella, Shigella, Campylobacter)',
          'C. diff toxin (if recent antibiotics)',
          'Ova and parasites (if travel history)',
          'Fecal WBCs or lactoferrin (inflammatory markers)'
        ]
      },
      treatmentApproach: {
        'Supportive Care (Most Cases)': [
          'Oral rehydration therapy (ORS preferred)',
          'BRAT diet progression (bananas, rice, applesauce, toast)',
          'Probiotics (may reduce duration)',
          'Avoid antidiarrheals if bloody stool or fever'
        ],
        'Antibiotic Indications (Limited)': [
          'Traveler\'s diarrhea (severe)',
          'Shigella (shortens duration)',
          'C. diff colitis (oral vancomycin/fidaxomicin)',
          'Campylobacter (if early in course)'
        ],
        'Antidiarrheal Agents': [
          'Loperamide: Safe if no fever/blood',
          'Bismuth subsalicylate: Anti-inflammatory effects',
          'Avoid if bloody stool (may worsen E. coli)'
        ]
      },
      ageGenderFactors: {
        'Infants/Children': ['Rotavirus', 'Higher dehydration risk', 'Different rehydration protocols'],
        'Young Adults': ['Traveler\'s diarrhea', 'Food poisoning', 'IBD onset'],
        'Middle Age': ['C. diff (antibiotic use)', 'Medication-induced', 'Food intolerance'],
        'Elderly': ['Higher complication risk', 'Medication-induced', 'C. diff', 'Ischemic colitis'],
        'Immunocompromised': ['Opportunistic infections', 'Severe/prolonged course', 'Parasites']
      },
      preventionEducation: {
        'Food Safety': [
          'Cook meat to proper temperatures',
          'Avoid raw eggs and unpasteurized dairy',
          'Proper food storage and refrigeration',
          'Hand hygiene before eating'
        ],
        'Travel Precautions': [
          'Bottled or boiled water',
          'Avoid ice, raw vegetables, street food',
          'Peel fruits yourself',
          'Consider prophylactic antibiotics (high-risk travelers)'
        ]
      },
      urgency: 'varies',
      clinicalPearls: [
        'Most acute diarrhea is viral and self-limiting (2-3 days)',
        'Antibiotics not indicated for most cases and may worsen E. coli O157:H7',
        'ORS is superior to plain water for rehydration',
        'Bloody diarrhea always requires evaluation for bacterial causes',
        'C. diff should be suspected with recent antibiotic use',
        'Antidiarrheals contraindicated with fever or blood in stool',
        'Traveler\'s diarrhea: "Cook it, peel it, or forget it"',
        'HUS typically occurs 5-7 days after E. coli diarrhea onset',
        'Probiotics may reduce antibiotic-associated diarrhea',
        'Lactose intolerance can develop after infectious gastroenteritis'
      ]
    },
    'diabetes symptoms': {
      pivotalPoints: [
        'Classic triad: polyuria, polydipsia, polyphagia with weight loss suggests diabetes',
        'Age at onset and autoantibodies distinguish type 1 from type 2 diabetes',
        'Acute complications (DKA, HHS) are medical emergencies requiring immediate treatment',
        'Chronic complications affect multiple organ systems and require systematic screening'
      ],
      questions: [
        'How long have you been experiencing increased thirst and urination?',
        'Have you noticed increased hunger despite eating more?',
        'Any unexplained weight loss recently?',
        'Do you feel unusually tired or fatigued?',
        'Any blurred vision or changes in your eyesight?',
        'Do you have frequent infections, especially skin or urinary tract?',
        'Any slow-healing cuts or wounds?',
        'At what age did your symptoms start?',
        'Any family history of diabetes (parents, siblings)?',
        'What is your current weight and has it changed recently?',
        'Any abdominal pain, nausea, or vomiting?',
        'Have you been breathing heavily or noticed fruity breath odor?',
        'Any numbness, tingling, or burning in hands or feet?',
        'Do you check your blood sugar at home? What are typical readings?',
        'Any history of high blood pressure or high cholesterol?',
        'For women: Any history of gestational diabetes or large babies (>9 lbs)?',
        'Any medications you\'re currently taking?'
      ],
      differentials: {
        'New Diabetes Diagnosis': [
          { condition: 'Type 2 Diabetes Mellitus', likelihood: 'very high', features: 'Age >45, obesity, family history, gradual onset, insulin resistance' },
          { condition: 'Type 1 Diabetes Mellitus', likelihood: 'moderate', features: 'Age <30, lean body habitus, acute onset, autoimmune destruction' },
          { condition: 'Maturity-Onset Diabetes of Young (MODY)', likelihood: 'low', features: 'Strong family history, age <25, non-obese, autosomal dominant' },
          { condition: 'Secondary Diabetes', likelihood: 'low', features: 'Pancreatic disease, medications (steroids), endocrine disorders' },
          { condition: 'Gestational Diabetes', likelihood: 'varies', features: 'Pregnancy, previous GDM, family history, obesity' }
        ],
        'Acute Complications': [
          { condition: 'Diabetic Ketoacidosis (DKA)', likelihood: 'high risk T1DM', features: 'Glucose >250, ketones, acidosis, dehydration, Kussmaul breathing' },
          { condition: 'Hyperosmolar Hyperglycemic State (HHS)', likelihood: 'high risk T2DM', features: 'Glucose >600, severe dehydration, altered mental status, no ketosis' },
          { condition: 'Severe Hypoglycemia', likelihood: 'treated diabetics', features: 'Glucose <70, neuroglycopenic symptoms, treated with insulin/sulfonylureas' },
          { condition: 'Diabetic Lactic Acidosis', likelihood: 'low', features: 'Metformin use, kidney dysfunction, severe illness' }
        ],
        'Chronic Complications': [
          { condition: 'Diabetic Nephropathy', likelihood: 'high', features: 'Proteinuria, declining GFR, hypertension, duration >10 years' },
          { condition: 'Diabetic Retinopathy', likelihood: 'high', features: 'Microaneurysms, hemorrhages, exudates, duration-dependent' },
          { condition: 'Diabetic Neuropathy', likelihood: 'very high', features: 'Distal symmetric sensory loss, burning feet, autonomic dysfunction' },
          { condition: 'Diabetic Foot Disease', likelihood: 'high', features: 'Neuropathy + vascular disease, ulcerations, infections' },
          { condition: 'Accelerated Atherosclerosis', likelihood: 'very high', features: 'CAD, stroke, peripheral artery disease, multiple risk factors' }
        ]
      },
      diagnosticCriteria: {
        'Diabetes Diagnosis (Any One of)': [
          'Hemoglobin A1C ≥6.5% (48 mmol/mol)',
          'Fasting plasma glucose ≥126 mg/dL (7.0 mmol/L)',
          '2-hour plasma glucose ≥200 mg/dL during OGTT',
          'Random plasma glucose ≥200 mg/dL with classic symptoms'
        ],
        'Prediabetes': [
          'Hemoglobin A1C 5.7-6.4% (39-47 mmol/mol)',
          'Fasting plasma glucose 100-125 mg/dL',
          '2-hour plasma glucose 140-199 mg/dL during OGTT'
        ],
        'Type 1 vs Type 2 Distinction': [
          'Type 1: Age <30, lean, acute onset, ketosis-prone, autoantibodies positive',
          'Type 2: Age >45, obese, gradual onset, insulin resistant, autoantibodies negative'
        ]
      },
      redFlags: [
        'Signs of DKA (Kussmaul breathing, fruity breath, severe dehydration)',
        'Altered mental status with hyperglycemia (HHS)',
        'Severe hypoglycemia with altered consciousness',
        'Signs of sepsis in diabetic patient',
        'Diabetic foot ulcer with signs of infection',
        'New vision loss in diabetic patient',
        'Chest pain in diabetic (silent MI risk)',
        'Acute kidney injury in diabetic patient',
        'Gastroparesis symptoms (early satiety, vomiting)'
      ],
      acuteComplications: {
        'DKA (Diabetic Ketoacidosis)': {
          'Triggers': 'Infection, medication noncompliance, new-onset T1DM, insulin pump failure',
          'Symptoms': 'Polyuria, polydipsia, abdominal pain, vomiting, Kussmaul breathing',
          'Lab findings': 'Glucose >250, pH <7.3, bicarbonate <15, positive ketones',
          'Treatment': 'IV fluids, insulin infusion, electrolyte replacement, treat precipitant'
        },
        'HHS (Hyperosmolar Hyperglycemic State)': {
          'Triggers': 'Infection, dehydration, medications (thiazides, steroids)',
          'Symptoms': 'Severe dehydration, altered mental status, focal neurologic signs',
          'Lab findings': 'Glucose >600, osmolality >320, minimal ketosis',
          'Treatment': 'Aggressive fluid resuscitation, insulin, electrolyte management'
        }
      },
      chronicComplications: {
        'Microvascular': [
          'Diabetic retinopathy (leading cause of blindness)',
          'Diabetic nephropathy (leading cause of ESRD)',
          'Diabetic neuropathy (sensory, motor, autonomic)'
        ],
        'Macrovascular': [
          'Coronary artery disease (2-4x increased risk)',
          'Cerebrovascular disease (stroke risk)',
          'Peripheral artery disease (amputation risk)'
        ],
        'Other': [
          'Diabetic foot disease (neuropathy + vascular)',
          'Gastroparesis (autonomic neuropathy)',
          'Increased infection susceptibility'
        ]
      },
      riskFactors: {
        'Type 2 Diabetes': [
          'Age ≥45 years',
          'BMI ≥25 kg/m² (≥23 in Asian Americans)',
          'First-degree relative with diabetes',
          'High-risk ethnicity (African American, Latino, Native American, Asian, Pacific Islander)',
          'Previous gestational diabetes or baby >9 lbs',
          'Hypertension (≥140/90 or on therapy)',
          'HDL <35 mg/dL or triglycerides >250 mg/dL',
          'Polycystic ovary syndrome',
          'Physical inactivity',
          'Previous A1C ≥5.7% or prediabetes'
        ]
      },
      screeningGuidelines: {
        'Adults': 'Screen every 3 years starting age 35 (or younger if risk factors)',
        'Pregnant Women': 'Screen at 24-28 weeks gestation',
        'High Risk': 'Screen annually if prediabetes or multiple risk factors'
      },
      managementTargets: {
        'Glycemic Control': [
          'A1C <7% for most adults',
          'A1C <6.5% if achievable without hypoglycemia',
          'A1C <8% for elderly or comorbidities'
        ],
        'Blood Pressure': '<130/80 mmHg for most diabetic patients',
        'Lipids': 'LDL <70 mg/dL (high-risk patients)',
        'Weight': '5-10% weight loss if overweight/obese'
      },
      ageGenderFactors: {
        'Children/Adolescents': ['Type 1 diabetes predominant', 'Increasing Type 2 with obesity', 'DKA presentation common'],
        'Young Adults (20-40)': ['Type 1 vs Type 2 distinction important', 'MODY consideration', 'Pregnancy planning'],
        'Middle Age (40-65)': ['Type 2 diabetes peak incidence', 'Metabolic syndrome', 'Cardiovascular risk'],
        'Elderly (>65)': ['Functional status considerations', 'Hypoglycemia risk', 'Relaxed A1C targets'],
        'Pregnancy': ['Gestational diabetes screening', 'Preconception counseling', 'Tight glycemic control']
      },
      urgency: 'varies',
      clinicalPearls: [
        'Classic triad: polyuria, polydipsia, polyphagia with weight loss',
        'Type 1 diabetes can present at any age, not just children',
        'Honeymoon period in Type 1: temporary insulin independence',
        'Silent MI common in diabetics due to autonomic neuropathy',
        'Annual eye exams essential - retinopathy often asymptomatic',
        'Diabetic nephropathy: check microalbumin annually',
        'Foot exams crucial - 50% of amputations are preventable',
        'A1C reflects average glucose over 2-3 months',
        'Hypoglycemia unawareness develops with recurrent episodes',
        'Dawn phenomenon: early morning glucose rise due to hormones'
      ]
    },
    'confusion': {
      pivotalPoints: [
        'Acute vs chronic onset distinguishes delirium from dementia',
        'Fluctuating course and altered attention are hallmarks of delirium',
        'Delirium is often reversible if underlying cause identified and treated',
        'Mixed delirium-dementia is common in elderly hospitalized patients'
      ],
      questions: [
        'When did you first notice the confusion or memory problems?',
        'Did the confusion come on suddenly (hours/days) or gradually (months/years)?',
        'Does the confusion seem to come and go, or is it constant?',
        'Are there times when thinking seems clearer vs more confused?',
        'Any difficulty paying attention or following conversations?',
        'Any hallucinations (seeing/hearing things that aren\'t there)?',
        'Any changes in sleep patterns or day/night confusion?',
        'Has there been any recent illness, infection, or hospitalization?',
        'Any new medications or changes in medications recently?',
        'Any fever, urinary symptoms, or signs of infection?',
        'Any falls, head injury, or loss of consciousness recently?',
        'Any changes in eating, drinking, or bowel/bladder function?',
        'Is the person more agitated, restless, or withdrawn than usual?',
        'Any family history of Alzheimer\'s disease or dementia?',
        'What medications are currently being taken?',
        'Any history of alcohol use or substance use?',
        'How has memory and thinking been over the past few years?'
      ],
      differentials: {
        'Delirium (Acute Confusional State)': [
          { condition: 'Infection-Related Delirium', likelihood: 'very high', features: 'UTI, pneumonia, sepsis - most common cause in elderly' },
          { condition: 'Medication-Induced Delirium', likelihood: 'very high', features: 'Anticholinergics, opioids, benzodiazepines, polypharmacy' },
          { condition: 'Metabolic Delirium', likelihood: 'high', features: 'Hypoglycemia, hyponatremia, uremia, hepatic encephalopathy' },
          { condition: 'Substance Withdrawal', likelihood: 'moderate', features: 'Alcohol, benzodiazepine withdrawal, delirium tremens' },
          { condition: 'Postoperative Delirium', likelihood: 'moderate', features: 'Post-anesthesia, ICU setting, elderly patients' },
          { condition: 'Hypoxic Delirium', likelihood: 'moderate', features: 'Respiratory failure, cardiac arrest, severe anemia' }
        ],
        'Dementia (Chronic Cognitive Decline)': [
          { condition: 'Alzheimer\'s Disease', likelihood: 'very high', features: 'Gradual onset, memory predominant, age >65, family history' },
          { condition: 'Vascular Dementia', likelihood: 'high', features: 'Stepwise decline, stroke history, vascular risk factors' },
          { condition: 'Lewy Body Dementia', likelihood: 'moderate', features: 'Visual hallucinations, parkinsonism, fluctuating cognition' },
          { condition: 'Frontotemporal Dementia', likelihood: 'low', features: 'Early behavioral changes, age <65, language problems' },
          { condition: 'Normal Pressure Hydrocephalus', likelihood: 'low', features: 'Gait, cognition, incontinence triad' },
          { condition: 'Pseudodementia (Depression)', likelihood: 'moderate', features: 'Depression history, "don\'t know" answers, reversible' }
        ],
        'Reversible Causes of Cognitive Impairment': [
          { condition: 'Hypothyroidism', likelihood: 'moderate', features: 'Fatigue, weight gain, cold intolerance, elevated TSH' },
          { condition: 'Vitamin B12 Deficiency', likelihood: 'moderate', features: 'Megaloblastic anemia, peripheral neuropathy' },
          { condition: 'Depression', likelihood: 'high', features: 'Mood symptoms, poor effort on testing, reversible' },
          { condition: 'Medication Effects', likelihood: 'high', features: 'Anticholinergics, sedatives, polypharmacy' },
          { condition: 'Chronic Subdural Hematoma', likelihood: 'low', features: 'Fall history, anticoagulation, gradual decline' }
        ]
      },
      deliriumFeatures: {
        'Core Features (CAM Criteria)': [
          '1. Acute onset and fluctuating course',
          '2. Inattention (difficulty focusing)',
          '3. Disorganized thinking (incoherent speech)',
          '4. Altered level of consciousness'
        ],
        'Subtypes': [
          'Hyperactive: Agitated, restless, hypervigilant',
          'Hypoactive: Withdrawn, quiet, decreased activity',
          'Mixed: Alternating between hyperactive and hypoactive'
        ]
      },
      dementiaStaging: {
        'Mild Cognitive Impairment': [
          'Subjective cognitive complaints',
          'Objective cognitive impairment on testing',
          'Preserved functional independence',
          'Not meeting dementia criteria'
        ],
        'Mild Dementia': [
          'Difficulty with complex tasks',
          'Needs assistance with finances, medications',
          'Can still live independently with support'
        ],
        'Moderate Dementia': [
          'Difficulty with basic activities of daily living',
          'Needs supervision for safety',
          'May have behavioral symptoms'
        ],
        'Severe Dementia': [
          'Requires assistance with basic care',
          'Loss of communication abilities',
          'Complete dependence on caregivers'
        ]
      },
      redFlags: [
        'Acute change in mental status in elderly (delirium until proven otherwise)',
        'Focal neurologic deficits with confusion (stroke, mass lesion)',
        'Fever with altered mental status (meningitis, encephalitis, sepsis)',
        'Signs of increased intracranial pressure (headache, vomiting, papilledema)',
        'Recent head trauma with confusion',
        'Rapid cognitive decline over weeks to months',
        'Age <60 with dementia symptoms (atypical, investigate for reversible causes)',
        'Delirium in postoperative patient (multiple potential causes)',
        'Confusion with signs of alcohol withdrawal (medical emergency)'
      ],
      riskFactors: {
        'Delirium Risk Factors': [
          'Age >65 years',
          'Preexisting dementia',
          'Severe illness/infection',
          'Polypharmacy (>5 medications)',
          'Sensory impairment',
          'Immobilization/restraints',
          'Urinary catheter',
          'Sleep deprivation'
        ],
        'Dementia Risk Factors': [
          'Advanced age (strongest risk factor)',
          'Family history of dementia',
          'APOE4 gene variant',
          'Cardiovascular disease',
          'Diabetes mellitus',
          'Head trauma history',
          'Low education level',
          'Social isolation'
        ]
      },
      assessmentTools: {
        'Delirium Screening': [
          'CAM (Confusion Assessment Method) - most validated',
          '4AT (4 A\'s Test) - rapid screening',
          'CAM-ICU for ventilated patients'
        ],
        'Cognitive Assessment': [
          'MMSE (Mini-Mental State Exam)',
          'MoCA (Montreal Cognitive Assessment)',
          'Clock drawing test',
          'Trails A & B'
        ],
        'Functional Assessment': [
          'Activities of Daily Living (ADLs)',
          'Instrumental ADLs (IADLs)',
          'Clinical Dementia Rating (CDR)'
        ]
      },
      workupApproach: {
        'Acute Confusion (Delirium)': [
          'Complete medication review',
          'Infection workup (UA, CXR, blood cultures)',
          'Basic metabolic panel, liver function',
          'Arterial blood gas if hypoxia suspected',
          'Head CT if trauma or focal signs'
        ],
        'Chronic Confusion (Dementia)': [
          'TSH, B12, folate levels',
          'Complete metabolic panel',
          'Depression screening',
          'Brain MRI to rule out structural causes',
          'Neuropsychological testing if indicated'
        ]
      },
      ageGenderFactors: {
        'Young Adults (<40)': ['Substance use', 'Psychiatric disorders', 'Metabolic causes', 'Autoimmune'],
        'Middle Age (40-65)': ['Early dementia', 'Depression', 'Alcohol-related', 'Metabolic'],
        'Elderly (>65)': ['Delirium (multiple causes)', 'Alzheimer\'s disease', 'Vascular dementia'],
        'Hospitalized Elderly': ['Delirium (40-50% prevalence)', 'Medication effects', 'Infection'],
        'Postoperative': ['Anesthesia effects', 'Pain medications', 'Infection', 'Electrolyte abnormalities']
      },
      urgency: 'varies',
      clinicalPearls: [
        'Delirium is a medical emergency - always look for underlying cause',
        'Hypoactive delirium is often missed but more common than hyperactive',
        'UTI is the most common cause of delirium in elderly',
        'Anticholinergic medications are frequent culprits in delirium',
        'Dementia increases risk of delirium by 5-fold',
        'Normal pressure hydrocephalus: wet, wobbly, wacky triad',
        'Depression can mimic dementia ("pseudodementia") but is reversible',
        'Early-onset dementia (<65) requires extensive workup for reversible causes',
        'Sundowning (worse confusion in evening) is common in dementia',
        'Lewy body dementia: visual hallucinations + parkinsonism + fluctuating cognition'
      ]
    },
    'cough': {
      pivotalPoints: [
        'Duration distinguishes acute (<3 weeks) vs chronic (>8 weeks) cough with different etiologies',
        'Sputum characteristics help differentiate bacterial vs viral vs other causes',
        'Associated fever and systemic symptoms suggest infectious etiology',
        'Red flag symptoms identify serious complications requiring urgent evaluation'
      ],
      questions: [
        'How long have you had this cough (days, weeks, months)?',
        'Are you bringing up any sputum/phlegm when you cough?',
        'What color is the sputum (clear, white, yellow, green, blood-tinged)?',
        'Do you have fever, chills, or night sweats?',
        'What is your highest recorded temperature?',
        'Are you short of breath or having trouble breathing?',
        'Any chest pain, especially when breathing deeply or coughing?',
        'Do you feel generally unwell, fatigued, or have body aches?',
        'Any runny nose, sore throat, or sinus congestion?',
        'Have you been around anyone who has been sick recently?',
        'Do you smoke or have you been exposed to smoke/irritants?',
        'Any recent travel, especially internationally?',
        'Do you have asthma, COPD, or other lung problems?',
        'Any heart problems or taking heart medications?',
        'Are you taking any medications, especially ACE inhibitors?',
        'Any known allergies or recent new exposures?',
        'Have you tried any treatments and did they help?'
      ],
      differentials: {
        'Acute Cough with Fever (Infectious)': [
          { condition: 'Viral Upper Respiratory Infection (Common Cold)', likelihood: 'very high', features: 'Gradual onset, rhinorrhea, sore throat, low-grade fever, clear/white sputum' },
          { condition: 'Influenza', likelihood: 'high', features: 'Sudden onset, high fever, myalgias, headache, dry cough, seasonal pattern' },
          { condition: 'Acute Bronchitis', likelihood: 'high', features: 'Productive cough, normal vital signs, no pneumonia signs, mostly viral' },
          { condition: 'Community-Acquired Pneumonia', likelihood: 'moderate', features: 'Fever, productive cough, dyspnea, consolidation on exam, elevated WBC' },
          { condition: 'COVID-19', likelihood: 'moderate', features: 'Dry cough, fever, anosmia, contact exposure, variable severity' },
          { condition: 'Pertussis (Whooping Cough)', likelihood: 'low', features: 'Paroxysmal cough with whoop, post-tussive vomiting, unvaccinated' }
        ],
        'Acute Cough without Fever': [
          { condition: 'Viral Upper Respiratory Infection', likelihood: 'high', features: 'Post-nasal drip, throat clearing, recent cold symptoms' },
          { condition: 'Allergic Rhinitis', likelihood: 'moderate', features: 'Seasonal pattern, itchy eyes/nose, known allergies, eosinophilia' },
          { condition: 'Asthma Exacerbation', likelihood: 'moderate', features: 'Wheezing, dyspnea, response to bronchodilators, triggers' },
          { condition: 'COPD Exacerbation', likelihood: 'moderate', features: 'Smoking history, increased sputum, dyspnea, barrel chest' },
          { condition: 'ACE Inhibitor Cough', likelihood: 'low', features: 'Dry cough, recent medication start, no other symptoms' }
        ],
        'Chronic Cough (>8 weeks)': [
          { condition: 'Asthma/Cough-Variant Asthma', likelihood: 'high', features: 'Dry cough, worse at night, response to bronchodilators' },
          { condition: 'Gastroesophageal Reflux Disease', likelihood: 'high', features: 'Worse lying down, throat clearing, heartburn, hoarse voice' },
          { condition: 'Upper Airway Cough Syndrome', likelihood: 'high', features: 'Post-nasal drip sensation, throat clearing, rhinosinusitis' },
          { condition: 'Chronic Bronchitis (COPD)', likelihood: 'moderate', features: 'Smoking history, productive cough >3 months for 2 years' },
          { condition: 'ACE Inhibitor-Induced Cough', likelihood: 'moderate', features: 'Dry cough, medication history, resolves when stopped' },
          { condition: 'Lung Cancer', likelihood: 'low', features: 'Smoking history, age >40, hemoptysis, weight loss' }
        ],
        'Pneumonia Severity Assessment': [
          { condition: 'Outpatient Treatment Appropriate', likelihood: 'varies', features: 'CURB-65 score 0-1, stable vitals, able to take oral meds' },
          { condition: 'Hospitalization Recommended', likelihood: 'varies', features: 'CURB-65 score ≥2, hypoxia, severe symptoms, comorbidities' },
          { condition: 'ICU Consideration', likelihood: 'varies', features: 'Severe pneumonia, shock, respiratory failure, CURB-65 ≥3' }
        ]
      },
      redFlags: [
        'Hemoptysis (coughing up blood) - especially large volume',
        'Severe respiratory distress or hypoxia (O2 sat <90%)',
        'Signs of sepsis (fever >101.3°F, hypotension, altered mental status)',
        'Chest pain with fever suggesting pneumonia',
        'Immunocompromised patient with respiratory symptoms',
        'Recent travel to endemic areas (TB, fungal infections)',
        'Chronic cough with weight loss (malignancy concern)',
        'Sudden onset severe cough after aspiration event',
        'Whooping cough in infants <6 months (life-threatening)'
      ],
      sputumAnalysis: {
        'Clear/White': 'Viral infection, allergies, asthma, early bacterial infection',
        'Yellow/Green': 'Bacterial infection, neutrophilic inflammation',
        'Rust-Colored': 'Pneumococcal pneumonia, classic finding',
        'Pink/Frothy': 'Pulmonary edema, heart failure',
        'Blood-Streaked': 'Bronchitis, pneumonia, malignancy, TB',
        'Frank Blood': 'Pulmonary embolism, malignancy, severe infection, bronchiectasis'
      },
      ageGenderFactors: {
        'Infants (<6 months)': ['RSV', 'Pertussis', 'Pneumonia', 'Bronchiolitis'],
        'Children (6m-5y)': ['Viral URI', 'Croup', 'Pneumonia', 'Asthma'],
        'School Age (5-18y)': ['Viral URI', 'Mycoplasma pneumonia', 'Asthma', 'Pertussis'],
        'Young Adults (18-40)': ['Viral URI', 'Mycoplasma pneumonia', 'Asthma', 'GERD'],
        'Middle Age (40-65)': ['Pneumonia', 'COPD', 'Asthma', 'GERD', 'ACE inhibitor cough'],
        'Elderly (>65)': ['Pneumonia', 'COPD exacerbation', 'Heart failure', 'Aspiration'],
        'Smokers': ['COPD', 'Lung cancer', 'Pneumonia', 'Bronchitis'],
        'Immunocompromised': ['Opportunistic infections', 'PCP pneumonia', 'Atypical organisms']
      },
      clinicalDecisionRules: {
        'CURB-65 (Pneumonia Severity)': [
          'Confusion (new onset)',
          'Urea >20 mg/dL (BUN >19)',
          'Respiratory rate ≥30',
          'Blood pressure <90/60',
          'Age ≥65'
        ],
        'Centor Criteria (Strep Throat)': [
          'Tonsillar exudates',
          'Tender anterior cervical lymphadenopathy',
          'Fever >100.4°F',
          'Absence of cough'
        ]
      },
      treatmentGuidance: {
        'Viral URI': 'Supportive care, rest, fluids, symptomatic treatment',
        'Acute Bronchitis': 'Usually viral - avoid antibiotics, bronchodilators if wheezing',
        'Pneumonia': 'Antibiotics based on severity and risk factors, supportive care',
        'Influenza': 'Oseltamivir if <48 hours, supportive care, isolation',
        'COVID-19': 'Isolation, supportive care, consider antivirals/monoclonals',
        'Asthma': 'Bronchodilators, inhaled corticosteroids, trigger avoidance'
      },
      urgency: 'varies',
      clinicalPearls: [
        'Most acute cough illnesses are viral and self-limiting',
        'Purulent sputum alone does not indicate bacterial infection',
        'Antibiotic overuse for viral bronchitis contributes to resistance',
        'Cough can persist 2-8 weeks after viral URI (post-infectious cough)',
        'CURB-65 score guides pneumonia treatment location decisions',
        'ACE inhibitor cough affects 10-15% of patients, usually dry',
        'Chronic cough: think asthma, GERD, upper airway cough syndrome',
        'Hemoptysis always requires investigation regardless of amount',
        'Pertussis can present atypically in adults as prolonged cough'
      ]
    },
    'headache': {
      pivotalPoints: [
        'Red flag symptoms identify dangerous secondary headaches requiring urgent evaluation',
        'Headache pattern and characteristics distinguish primary headache types',
        'Age of onset and progression help differentiate benign from serious causes',
        'Associated neurologic symptoms suggest intracranial pathology'
      ],
      questions: [
        'Is this the worst headache of your life or completely different from usual headaches?',
        'When did this headache start and how did it begin (sudden vs gradual)?',
        'Where is the headache located (one side, both sides, front, back, temples)?',
        'What does the headache feel like (throbbing, stabbing, pressure, burning)?',
        'How severe is the pain on a scale of 1-10?',
        'How long do your headaches typically last?',
        'Do you have nausea, vomiting, or sensitivity to light or sound?',
        'Any visual changes (flashing lights, blind spots, double vision)?',
        'Any fever, neck stiffness, or rash?',
        'Any weakness, numbness, or difficulty speaking?',
        'What triggers your headaches (stress, foods, weather, hormones)?',
        'What makes the headache better or worse?',
        'How often do you get headaches?',
        'Do you take any headache medications? How often?',
        'Any recent head injury or trauma?',
        'Any family history of headaches or migraines?',
        'For women: Any relationship to menstrual cycle?'
      ],
      differentials: {
        'Primary Headache Disorders (90% of headaches)': [
          { condition: 'Migraine without Aura', likelihood: 'very high', features: 'Unilateral, throbbing, 4-72h duration, nausea/vomiting, photophobia/phonophobia' },
          { condition: 'Migraine with Aura', likelihood: 'high', features: 'Visual/sensory aura 5-60min before headache, family history' },
          { condition: 'Tension-Type Headache', likelihood: 'very high', features: 'Bilateral, pressing/tightening, mild-moderate, no nausea, lasts 30min-7days' },
          { condition: 'Cluster Headache', likelihood: 'low', features: 'Unilateral orbital pain, 15min-3h, seasonal clusters, autonomic symptoms' },
          { condition: 'Medication Overuse Headache', likelihood: 'moderate', features: 'Frequent analgesic use (>10-15 days/month), daily headaches' }
        ],
        'Dangerous Secondary Headaches (Red Flags)': [
          { condition: 'Subarachnoid Hemorrhage', likelihood: 'rare but critical', features: 'Sudden severe "thunderclap" headache, neck stiffness, altered consciousness' },
          { condition: 'Acute Meningitis', likelihood: 'rare but critical', features: 'Fever, neck stiffness, photophobia, altered mental status, rash' },
          { condition: 'Brain Tumor/Mass', likelihood: 'rare', features: 'Progressive headache, worse in morning, neurologic deficits, papilledema' },
          { condition: 'Temporal Arteritis (Giant Cell)', likelihood: 'low', features: 'Age >50, temporal tenderness, jaw claudication, vision changes, elevated ESR' },
          { condition: 'Acute Angle-Closure Glaucoma', likelihood: 'rare', features: 'Severe eye/head pain, vision loss, nausea, hard eye, halos around lights' },
          { condition: 'Intracranial Hypertension', likelihood: 'rare', features: 'Worse lying down/morning, papilledema, pulsatile tinnitus, diplopia' }
        ],
        'Other Secondary Headaches': [
          { condition: 'Cervicogenic Headache', likelihood: 'moderate', features: 'Neck pain, occipital location, neck movement triggers, unilateral' },
          { condition: 'Sinus Headache', likelihood: 'low', features: 'Facial pressure, purulent nasal discharge, fever, sinus tenderness' },
          { condition: 'Post-Traumatic Headache', likelihood: 'varies', features: 'Recent head trauma, may be delayed onset, associated symptoms' },
          { condition: 'Hypertensive Headache', likelihood: 'low', features: 'Severe hypertension (>180/120), occipital location, morning predominance' },
          { condition: 'Carbon Monoxide Poisoning', likelihood: 'rare', features: 'Multiple people affected, poor ventilation, cherry-red skin' }
        ],
        'Headache in Special Populations': [
          { condition: 'Pregnancy-Related Headache', likelihood: 'varies', features: 'Preeclampsia concern if new-onset, severe, with hypertension' },
          { condition: 'Pediatric Headache', likelihood: 'varies', features: 'Often tension-type or migraine, concerning if awakens child, neurologic signs' },
          { condition: 'Elderly New-Onset Headache', likelihood: 'concerning', features: 'Higher risk of secondary causes, temporal arteritis, medication effects' }
        ]
      },
      redFlagFeatures: {
        'SNOOP10 Mnemonic': [
          'S: Systemic illness (fever, weight loss, HIV, cancer)',
          'N: Neurologic deficit or altered consciousness',
          'O: Onset sudden (thunderclap headache)',
          'O: Older age (>50 years with new headache)',
          'P: Previous headache history absent (new onset)',
          'Pattern change (different from usual headaches)',
          'Positional headache (worse lying down)',
          'Papilledema',
          'Progressive headache (worsening over time)',
          'Pregnancy (new or worsening headache)'
        ]
      },
      migraineCriteria: {
        'Migraine without Aura (ICHD-3)': [
          'At least 5 attacks lasting 4-72 hours',
          'At least 2 of: unilateral, pulsating, moderate-severe intensity, aggravated by activity',
          'During headache: nausea/vomiting OR photophobia AND phonophobia',
          'Not better explained by another diagnosis'
        ],
        'Migraine with Aura': [
          'At least 2 attacks with aura',
          'Aura: gradual development ≥5 min, duration 5-60 min, fully reversible',
          'Visual, sensory, speech/language, motor, brainstem, or retinal symptoms'
        ],
        'Common Migraine Triggers': [
          'Hormonal changes (menstruation, pregnancy, menopause)',
          'Foods (aged cheese, chocolate, alcohol, MSG, nitrates)',
          'Sleep changes (too little or too much)',
          'Stress and relaxation after stress',
          'Weather changes and barometric pressure',
          'Bright lights, loud sounds, strong smells'
        ]
      },
      clusterHeadacheCriteria: {
        'Characteristics': [
          'Severe unilateral orbital/temporal pain',
          'Duration 15 minutes to 3 hours',
          'Frequency 1 every other day to 8 per day',
          'At least one autonomic symptom: conjunctival injection, lacrimation, nasal congestion, rhinorrhea, eyelid edema, miosis, ptosis, restlessness'
        ],
        'Pattern': [
          'Occur in clusters (weeks to months)',
          'Often same time of day/night',
          'Remission periods between clusters',
          'Male predominance (3:1)',
          'Often triggered by alcohol during cluster period'
        ]
      },
      diagnosticApproach: {
        'Clinical Assessment (Most Important)': [
          'Detailed headache history and characterization',
          'Complete neurologic examination',
          'Vital signs including blood pressure',
          'Fundoscopic examination for papilledema',
          'Neck examination for stiffness/tenderness'
        ],
        'Neuroimaging Indications': [
          'Sudden severe headache (thunderclap)',
          'Headache with neurologic deficits',
          'New headache in patient >50 years',
          'Progressive worsening headache',
          'Headache with fever and neck stiffness',
          'Significant change in headache pattern',
          'Headache after head trauma'
        ],
        'Laboratory Studies (Selected Cases)': [
          'ESR/CRP (temporal arteritis if age >50)',
          'Lumbar puncture (if SAH or meningitis suspected)',
          'Complete blood count (infection, anemia)',
          'Pregnancy test (women of childbearing age)'
        ]
      },
      emergencyHeadaches: {
        'Subarachnoid Hemorrhage': [
          'Sudden severe "worst headache ever"',
          'May have brief loss of consciousness',
          'Neck stiffness, photophobia',
          'CT head immediately, LP if CT negative',
          'Neurosurgical emergency'
        ],
        'Meningitis': [
          'Fever, headache, neck stiffness (classic triad)',
          'Altered mental status',
          'Petechial rash (meningococcal)',
          'Lumbar puncture for diagnosis',
          'Immediate antibiotics'
        ],
        'Temporal Arteritis': [
          'Age >50, new headache',
          'Temporal artery tenderness',
          'Jaw claudication, vision changes',
          'ESR >50, CRP elevated',
          'Immediate steroids to prevent blindness'
        ]
      },
      treatmentApproach: {
        'Acute Migraine Treatment': [
          'Mild-Moderate: NSAIDs, acetaminophen, caffeine combinations',
          'Moderate-Severe: Triptans (sumatriptan, rizatriptan, etc.)',
          'Severe/Refractory: DHE, antiemetics, steroids',
          'Avoid overuse (limit to 2-3 days per week)'
        ],
        'Migraine Prevention': [
          'First-line: Topiramate, valproate, propranolol, timolol',
          'Second-line: Amitriptyline, venlafaxine, gabapentin',
          'CGRP antagonists: Erenumab, fremanezumab, galcanezumab',
          'Botulinum toxin for chronic migraine'
        ],
        'Tension Headache': [
          'Acute: NSAIDs, acetaminophen',
          'Chronic: Amitriptyline, stress management, physical therapy',
          'Avoid medication overuse'
        ],
        'Cluster Headache': [
          'Acute: High-flow oxygen (100% O2 at 12-15 L/min)',
          'Sumatriptan injection',
          'Prevention: Verapamil, lithium, topiramate'
        ]
      },
      ageGenderFactors: {
        'Children/Adolescents': ['Tension-type headache', 'Migraine (often bilateral)', 'Secondary causes more concerning'],
        'Young Women (20-40)': ['Migraine (3:1 female predominance)', 'Hormonal triggers', 'Pregnancy considerations'],
        'Middle-Aged Adults': ['Migraine', 'Tension-type', 'Medication overuse', 'Secondary causes increase'],
        'Elderly (>50)': ['New headache concerning', 'Temporal arteritis', 'Medication effects', 'Secondary causes'],
        'Men': ['Cluster headache (3:1 male predominance)', 'Tension-type', 'Secondary causes'],
        'Postmenopausal Women': ['Migraine often improves', 'Tension-type', 'Medication-related']
      },
      medicationOveruseHeadache: {
        'Risk Factors': [
          'Frequent use of acute headache medications',
          'Simple analgesics >15 days/month',
          'Triptans/opioids >10 days/month',
          'Combination analgesics >10 days/month'
        ],
        'Management': [
          'Gradual withdrawal of overused medication',
          'Bridging therapy with steroids',
          'Preventive headache medication',
          'Patient education and follow-up'
        ]
      },
      urgency: 'varies',
      clinicalPearls: [
        'Most headaches (90%) are primary disorders - migraine or tension-type',
        '"Thunderclap" headache = subarachnoid hemorrhage until proven otherwise',
        'Normal neurologic exam doesn\'t rule out secondary headache',
        'Medication overuse headache is common and preventable',
        'Migraine often starts in adolescence/early adulthood',
        'New headache in patient >50 years requires investigation',
        'Cluster headaches have strong circadian and seasonal patterns',
        'Pregnancy can trigger new migraines or worsen existing ones',
        'Triptans contraindicated in cardiovascular disease',
        'Oxygen is first-line acute treatment for cluster headache',
        'Most "sinus headaches" are actually migraines',
        'CT scan normal in 98% of patients with chronic daily headache',
        'Caffeine withdrawal can cause severe headaches',
        'Botulinum toxin effective for chronic migraine (≥15 days/month)'
      ]
    },
    'abdominal pain': {
      pivotalPoints: [
        'Location of pain is key diagnostic feature',
        'Onset (sudden vs gradual) suggests different pathology',
        'Associated symptoms guide differential diagnosis',
        'Age and gender significantly influence likelihood of conditions'
      ],
      questions: [
        'Point to exactly where the pain is located',
        'Did the pain start suddenly or gradually over hours/days?',
        'Is the pain constant, cramping, or comes in waves?',
        'Does the pain move or radiate anywhere?',
        'What makes the pain better or worse?',
        'Do you have fever, chills, or feel generally unwell?',
        'Any nausea, vomiting, or loss of appetite?',
        'When was your last bowel movement? Any diarrhea or constipation?',
        'Any blood in vomit or stool?',
        'For women: Could you be pregnant? When was your last period?',
        'Any urinary symptoms (burning, frequency, blood in urine)?',
        'Have you had surgery or similar pain before?',
        'Any recent travel, new medications, or dietary changes?'
      ],
      differentials: {
        'Right Upper Quadrant': [
          { condition: 'Acute Cholecystitis', likelihood: 'high', features: 'RUQ pain, fever, Murphy\'s sign positive' },
          { condition: 'Biliary Colic', likelihood: 'high', features: 'Episodic RUQ pain, no fever' },
          { condition: 'Acute Hepatitis', likelihood: 'moderate', features: 'RUQ pain, jaundice, elevated transaminases' },
          { condition: 'Peptic Ulcer Disease', likelihood: 'moderate', features: 'Epigastric pain, relation to meals' }
        ],
        'Right Lower Quadrant': [
          { condition: 'Acute Appendicitis', likelihood: 'high', features: 'Periumbilical→RLQ pain, fever, leukocytosis' },
          { condition: 'Ovarian Pathology', likelihood: 'high', features: 'Women of childbearing age, adnexal mass' },
          { condition: 'Inflammatory Bowel Disease', likelihood: 'moderate', features: 'Chronic symptoms, bloody diarrhea' },
          { condition: 'Ureterolithiasis', likelihood: 'moderate', features: 'Colicky pain, hematuria, CVA tenderness' }
        ],
        'Left Lower Quadrant': [
          { condition: 'Diverticulitis', likelihood: 'high', features: 'Age >40, LLQ pain, fever, altered bowel habits' },
          { condition: 'Ovarian Pathology', likelihood: 'high', features: 'Women of childbearing age' },
          { condition: 'Inflammatory Bowel Disease', likelihood: 'moderate', features: 'Chronic bloody diarrhea' },
          { condition: 'Ureterolithiasis', likelihood: 'moderate', features: 'Colicky pain, hematuria' }
        ],
        'Epigastric': [
          { condition: 'Peptic Ulcer Disease', likelihood: 'high', features: 'Relation to meals, H. pylori risk factors' },
          { condition: 'Acute Pancreatitis', likelihood: 'high', features: 'Severe pain radiating to back, elevated lipase' },
          { condition: 'GERD/Gastritis', likelihood: 'moderate', features: 'Burning pain, relation to meals/position' },
          { condition: 'Myocardial Infarction', likelihood: 'moderate', features: 'Elderly, diabetes, cardiac risk factors' }
        ],
        'Periumbilical': [
          { condition: 'Early Appendicitis', likelihood: 'high', features: 'Pain migration to RLQ' },
          { condition: 'Small Bowel Obstruction', likelihood: 'high', features: 'Cramping, vomiting, no flatus/BM' },
          { condition: 'Gastroenteritis', likelihood: 'moderate', features: 'Diarrhea, vomiting, recent exposure' },
          { condition: 'Inflammatory Bowel Disease', likelihood: 'low', features: 'Chronic symptoms' }
        ],
        'Diffuse/Generalized': [
          { condition: 'Peritonitis', likelihood: 'high', features: 'Severe pain, rigidity, systemic toxicity' },
          { condition: 'Bowel Obstruction', likelihood: 'high', features: 'Cramping, vomiting, distension' },
          { condition: 'Gastroenteritis', likelihood: 'moderate', features: 'Diarrhea, vomiting, recent exposure' },
          { condition: 'Inflammatory Bowel Disease', likelihood: 'low', features: 'Chronic bloody diarrhea' }
        ]
      },
      redFlags: [
        'Sudden onset severe pain (consider perforation, rupture)',
        'Signs of shock (hypotension, tachycardia, altered mental status)',
        'Peritoneal signs (rigidity, rebound tenderness, guarding)',
        'High fever >101.3°F with abdominal pain',
        'Hematemesis or melena (GI bleeding)',
        'Pregnancy with abdominal pain (ectopic pregnancy)',
        'Age >65 with abdominal pain (higher risk complications)',
        'Immunocompromised patient with abdominal pain',
        'Recent abdominal surgery with new pain'
      ],
      ageGenderFactors: {
        'Children': ['Appendicitis', 'Intussusception', 'Gastroenteritis'],
        'Women 15-45': ['Ectopic pregnancy', 'Ovarian cyst/torsion', 'PID'],
        'Men >40': ['Peptic ulcer', 'Pancreatitis', 'Diverticulitis'],
        'Women >40': ['Cholecystitis', 'Diverticulitis', 'Bowel obstruction'],
        'Elderly': ['Diverticulitis', 'Bowel obstruction', 'Mesenteric ischemia']
      },
      urgency: 'varies',
      clinicalPearls: [
        'Murphy\'s sign: Inspiratory arrest during RUQ palpation suggests cholecystitis',
        'McBurney\'s point tenderness: Classic for appendicitis but only 50% sensitive',
        'Rovsing\'s sign: RLQ pain with LLQ palpation suggests appendicitis',
        'Pain out of proportion to exam suggests mesenteric ischemia',
        'Elderly patients may have minimal symptoms despite serious pathology'
      ]
    },
    'anemia': {
      pivotalPoints: [
        'MCV (mean corpuscular volume) is the key to classification',
        'Reticulocyte count distinguishes production vs destruction/loss',
        'History of bleeding (obvious or occult) is crucial',
        'Dietary history and absorption issues guide evaluation'
      ],
      questions: [
        'How long have you been feeling tired or weak?',
        'Have you noticed your skin or the inside of your eyelids looking pale?',
        'Do you get short of breath with activities you used to do easily?',
        'Do you have unusual cravings for ice, starch, or non-food items?',
        'Have you noticed your heart racing or pounding?',
        'Any dizziness, especially when standing up?',
        'Have you seen any blood in your stool, or is your stool very dark/tarry?',
        'Any heavy menstrual periods or bleeding between periods?',
        'Have you vomited blood or coffee-ground material?',
        'Any recent weight loss or poor appetite?',
        'What does your typical diet look like? Do you eat meat, vegetables, fortified cereals?',
        'Any family history of anemia or blood disorders?',
        'Do you take any medications regularly, especially aspirin or NSAIDs?',
        'Any history of stomach problems, celiac disease, or intestinal surgery?',
        'Have you traveled recently or lived in areas with malaria?',
        'Any unusual fatigue during childhood or family members with anemia?'
      ],
      differentials: {
        'Microcytic (MCV <80)': [
          { condition: 'Iron Deficiency Anemia', likelihood: 'very high', features: 'Most common cause, low ferritin, high TIBC, koilonychia, pica' },
          { condition: 'Anemia of Chronic Disease', likelihood: 'high', features: 'Chronic illness, normal/high ferritin, low TIBC' },
          { condition: 'Thalassemia Trait', likelihood: 'moderate', features: 'Family history, Mediterranean/Asian ancestry, normal iron studies' },
          { condition: 'Sideroblastic Anemia', likelihood: 'low', features: 'Ring sideroblasts on bone marrow, may be reversible if alcohol/drug-related' }
        ],
        'Macrocytic (MCV >100)': [
          { condition: 'B12 Deficiency', likelihood: 'high', features: 'Neurologic symptoms, high LDH, hypersegmented neutrophils' },
          { condition: 'Folate Deficiency', likelihood: 'high', features: 'Poor diet, alcoholism, pregnancy, no neurologic symptoms' },
          { condition: 'Hypothyroidism', likelihood: 'moderate', features: 'Fatigue, weight gain, cold intolerance, elevated TSH' },
          { condition: 'Alcohol Use Disorder', likelihood: 'moderate', features: 'History of alcohol use, liver dysfunction' },
          { condition: 'Medication-Induced', likelihood: 'moderate', features: 'Methotrexate, hydroxyurea, antiretrovirals' }
        ],
        'Normocytic (MCV 80-100)': [
          { condition: 'Anemia of Chronic Disease', likelihood: 'high', features: 'Chronic illness, inflammation, normal iron studies pattern' },
          { condition: 'Acute Blood Loss', likelihood: 'high', features: 'Recent bleeding, trauma, surgery, GI bleeding' },
          { condition: 'Chronic Kidney Disease', likelihood: 'moderate', features: 'Elevated creatinine, decreased EPO production' },
          { condition: 'Hemolytic Anemia', likelihood: 'moderate', features: 'Elevated LDH, low haptoglobin, jaundice, elevated bilirubin' },
          { condition: 'Bone Marrow Failure', likelihood: 'low', features: 'Pancytopenia, bone marrow biopsy required' }
        ]
      },
      redFlags: [
        'Hemoglobin <7 g/dL (severe anemia requiring urgent evaluation)',
        'Signs of heart failure (shortness of breath, chest pain, syncope)',
        'Active GI bleeding (hematemesis, melena, hematochezia)',
        'Neurologic symptoms with macrocytic anemia (B12 deficiency emergency)',
        'Evidence of hemolysis (jaundice, dark urine, elevated LDH)',
        'Pancytopenia (suggests bone marrow disorder)',
        'Lymphadenopathy or splenomegaly (hematologic malignancy)',
        'Weight loss >10% with anemia (malignancy concern)',
        'Age >50 with new iron deficiency (colon cancer screening needed)'
      ],
      ageGenderFactors: {
        'Premenopausal Women': ['Iron deficiency (menstrual losses)', 'Pregnancy-related', 'Fibroids with heavy bleeding'],
        'Postmenopausal Women': ['GI bleeding (colon cancer)', 'Iron deficiency', 'Anemia of chronic disease'],
        'Men': ['GI bleeding (peptic ulcer, colon cancer)', 'Anemia of chronic disease', 'B12/folate deficiency'],
        'Children': ['Iron deficiency (dietary)', 'Thalassemia trait', 'Lead poisoning'],
        'Elderly': ['Anemia of chronic disease', 'B12 deficiency', 'Myelodysplastic syndrome'],
        'Vegetarians': ['Iron deficiency', 'B12 deficiency', 'Folate deficiency']
      },
      workupApproach: {
        'Initial Labs': ['CBC with differential', 'Reticulocyte count', 'Iron studies (ferritin, TIBC, transferrin saturation)', 'B12 and folate levels'],
        'If Microcytic': ['Confirm iron deficiency vs thalassemia trait', 'Find source of iron loss if iron deficient'],
        'If Macrocytic': ['B12 and folate levels', 'TSH', 'Alcohol history', 'Medication review'],
        'If Normocytic': ['Reticulocyte count', 'LDH and haptoglobin', 'Creatinine', 'Chronic disease markers']
      },
      urgency: 'varies',
      clinicalPearls: [
        'Iron deficiency without obvious bleeding in men/postmenopausal women requires GI evaluation',
        'B12 deficiency can cause irreversible neurologic damage if untreated',
        'Anemia of chronic disease: ferritin normal/high, TIBC low, transferrin saturation low-normal',
        'Thalassemia trait: family history, normal iron studies, Hb A2 elevated on electrophoresis',
        'Reticulocyte count <2% suggests production problem; >2% suggests loss/destruction',
        'Pica (ice, starch cravings) is pathognomonic for iron deficiency',
        'Koilonychia (spoon nails) suggests severe, chronic iron deficiency'
      ]
    },
    'back pain': {
      pivotalPoints: [
        'Red flag symptoms identify serious pathology requiring urgent evaluation',
        'Mechanical vs non-mechanical pain patterns guide differential diagnosis',
        'Neurologic deficits suggest nerve root compression or spinal cord involvement',
        'Age >50 or <20 increases risk of serious underlying pathology'
      ],
      questions: [
        'Where exactly is your back pain located (upper, middle, lower back)?',
        'When did the pain start and how did it begin (sudden vs gradual)?',
        'What does the pain feel like (aching, sharp, burning, shooting)?',
        'Does the pain travel down your leg(s) or into other areas?',
        'What makes the pain better or worse (movement, rest, position)?',
        'Is the pain worse at night or when lying down?',
        'Any numbness, tingling, or weakness in your legs or feet?',
        'Any difficulty with bladder or bowel control?',
        'Have you had any recent fever, chills, or feeling unwell?',
        'Any recent weight loss without trying to lose weight?',
        'Do you have a history of cancer?',
        'Any recent infection, especially urinary tract or skin?',
        'Are you taking any blood thinners or steroids?',
        'Any recent fall, injury, or heavy lifting?',
        'Have you tried any treatments and did they help?',
        'Any morning stiffness that improves with activity?'
      ],
      differentials: {
        'Mechanical/Benign (95% of cases)': [
          { condition: 'Muscle Strain/Sprain', likelihood: 'very high', features: 'Acute onset, activity-related, improves with rest, no neurologic deficits' },
          { condition: 'Lumbar Disc Herniation', likelihood: 'high', features: 'Radicular pain, positive straight leg raise, L4-S1 distribution' },
          { condition: 'Lumbar Spinal Stenosis', likelihood: 'moderate', features: 'Age >60, neurogenic claudication, improves with forward flexion' },
          { condition: 'Facet Joint Arthropathy', likelihood: 'moderate', features: 'Extension worsens pain, morning stiffness, age-related changes' },
          { condition: 'Sacroiliac Joint Dysfunction', likelihood: 'moderate', features: 'Unilateral low back/buttock pain, positive provocative tests' }
        ],
        'Serious Pathology (Red Flags - 5% of cases)': [
          { condition: 'Cauda Equina Syndrome', likelihood: 'rare but critical', features: 'Saddle anesthesia, bowel/bladder dysfunction, bilateral leg weakness' },
          { condition: 'Spinal Epidural Abscess', likelihood: 'rare', features: 'Fever, elevated ESR/CRP, IV drug use, recent infection' },
          { condition: 'Vertebral Osteomyelitis', likelihood: 'rare', features: 'Fever, night pain, elevated ESR/CRP, immunocompromised' },
          { condition: 'Spinal Malignancy', likelihood: 'rare', features: 'Age >50, history of cancer, weight loss, night pain, failure to improve' },
          { condition: 'Compression Fracture', likelihood: 'low-moderate', features: 'Age >70, osteoporosis, steroid use, trauma history' }
        ],
        'Inflammatory': [
          { condition: 'Ankylosing Spondylitis', likelihood: 'low', features: 'Age <40, morning stiffness >1hr, improves with exercise, family history' },
          { condition: 'Inflammatory Bowel Disease', likelihood: 'low', features: 'GI symptoms, young adult, HLA-B27 positive' },
          { condition: 'Psoriatic Arthritis', likelihood: 'low', features: 'Skin psoriasis, nail changes, asymmetric joint involvement' }
        ],
        'Referred Pain': [
          { condition: 'Aortic Aneurysm', likelihood: 'rare', features: 'Sudden severe pain, pulsatile abdominal mass, vascular risk factors' },
          { condition: 'Nephrolithiasis', likelihood: 'low', features: 'Colicky flank pain, hematuria, nausea/vomiting' },
          { condition: 'Pyelonephritis', likelihood: 'low', features: 'Fever, CVA tenderness, urinary symptoms' },
          { condition: 'Pancreatitis', likelihood: 'rare', features: 'Epigastric pain radiating to back, alcohol history, elevated lipase' }
        ]
      },
      redFlags: [
        'Cauda equina syndrome (saddle anesthesia, bowel/bladder dysfunction)',
        'Progressive neurologic deficits or severe weakness',
        'Fever with back pain (infection concern)',
        'History of cancer with new back pain',
        'Age >70 with new back pain (fracture risk)',
        'Significant trauma with back pain',
        'IV drug use with back pain (epidural abscess)',
        'Immunocompromised patient with back pain',
        'Failure to improve after 6 weeks of conservative treatment',
        'Night pain that wakes patient from sleep',
        'Unexplained weight loss with back pain'
      ],
      ageGenderFactors: {
        'Young Adults (20-40)': ['Muscle strain', 'Disc herniation', 'Ankylosing spondylitis', 'Inflammatory conditions'],
        'Middle Age (40-60)': ['Disc herniation', 'Facet arthropathy', 'Muscle strain', 'Degenerative changes'],
        'Older Adults (>60)': ['Spinal stenosis', 'Compression fractures', 'Malignancy', 'Degenerative disease'],
        'Athletes': ['Muscle strain', 'Stress fractures', 'Spondylolysis', 'Disc herniation'],
        'Postmenopausal Women': ['Osteoporotic fractures', 'Degenerative changes'],
        'Immunocompromised': ['Spinal infections', 'Malignancy', 'Atypical presentations']
      },
      neurologicExam: {
        'L4 Nerve Root': ['Knee extension weakness', 'Decreased patellar reflex', 'Numbness over medial leg'],
        'L5 Nerve Root': ['Dorsiflexion weakness', 'No reliable reflex', 'Numbness over lateral leg/dorsal foot'],
        'S1 Nerve Root': ['Plantarflexion weakness', 'Decreased Achilles reflex', 'Numbness over lateral foot'],
        'Cauda Equina': ['Saddle anesthesia', 'Bowel/bladder dysfunction', 'Bilateral leg weakness']
      },
      specialTests: {
        'Straight Leg Raise': 'Positive if pain <60° suggests nerve root irritation',
        'Crossed Straight Leg Raise': 'Highly specific for disc herniation',
        'Spurling Test': 'Neck extension/rotation for cervical radiculopathy',
        'FABER Test': 'Hip pathology vs sacroiliac joint dysfunction'
      },
      urgency: 'varies',
      clinicalPearls: [
        '95% of back pain is mechanical and benign - focus on red flag screening',
        'Sciatica: pain radiating below knee is more specific than just leg pain',
        'Neurogenic claudication: leg pain with walking that improves with sitting/forward flexion',
        'Night pain that disrupts sleep suggests serious pathology',
        'Most acute back pain improves within 6 weeks with conservative treatment',
        'Imaging not indicated for acute back pain without red flags in first 6 weeks',
        'Bed rest >2 days may delay recovery - encourage early mobilization'
      ]
    },
    'syncope': {
      pivotalPoints: [
        'Cardiac syncope is life-threatening and requires immediate evaluation and monitoring',
        'Presence of structural heart disease significantly increases risk of sudden cardiac death',
        'Syncope during exertion or while supine suggests cardiac etiology',
        'Family history of sudden cardiac death or inherited cardiomyopathy is a major red flag'
      ],
      questions: [
        'Can you describe exactly what happened before, during, and after you lost consciousness?',
        'Were there any warning symptoms (chest pain, palpitations, nausea, sweating)?',
        'What were you doing when it happened (standing, sitting, lying down, exercising)?',
        'How long were you unconscious? Did anyone witness it?',
        'Did you have any jerking movements or lose control of bladder/bowel?',
        'How did you feel when you woke up (confused, tired, normal)?',
        'Any chest pain, shortness of breath, or palpitations?',
        'Have you had episodes like this before?',
        'Any recent illness, dehydration, or changes in medications?',
        'Do you have any heart problems or take heart medications?',
        'Any family history of sudden cardiac death or fainting?',
        'Any recent head trauma or neurologic symptoms?',
        'For women: Could you be pregnant? When was your last period?',
        'Do you have diabetes? When did you last eat?',
        'Any recent prolonged standing, hot environments, or emotional stress?',
        'Are you taking any medications, especially blood pressure or heart medications?'
      ],
      differentials: {
        'Cardiac Syncope (Life-Threatening - 10-30% of cases)': [
          { condition: 'Ventricular Tachycardia/Fibrillation', likelihood: 'high concern', features: 'Sudden onset, no prodrome, exercise-related, structural heart disease' },
          { condition: 'Complete Heart Block', likelihood: 'high concern', features: 'Bradycardia, elderly, known conduction disease, pacemaker malfunction' },
          { condition: 'Hypertrophic Cardiomyopathy', likelihood: 'moderate concern', features: 'Young athletes, family history, exertional syncope, murmur' },
          { condition: 'Aortic Stenosis', likelihood: 'moderate concern', features: 'Elderly, systolic murmur, exertional symptoms, heart failure' },
          { condition: 'Pulmonary Embolism', likelihood: 'moderate concern', features: 'Sudden onset, dyspnea, chest pain, risk factors for DVT' },
          { condition: 'Long QT Syndrome', likelihood: 'low but critical', features: 'Young patients, family history, medication-induced, swimming/diving' }
        ],
        'Neurally Mediated Syncope (Benign - 50-60% of cases)': [
          { condition: 'Vasovagal Syncope', likelihood: 'very high', features: 'Triggers (pain, fear, standing), prodrome, gradual onset, young patients' },
          { condition: 'Situational Syncope', likelihood: 'moderate', features: 'Coughing, micturition, defecation, swallowing-related triggers' },
          { condition: 'Carotid Sinus Hypersensitivity', likelihood: 'low', features: 'Elderly men, neck movement/pressure triggers, shaving, tight collars' }
        ],
        'Orthostatic Syncope (15-25% of cases)': [
          { condition: 'Volume Depletion', likelihood: 'high', features: 'Dehydration, bleeding, diarrhea, diuretics, poor oral intake' },
          { condition: 'Medication-Induced', likelihood: 'high', features: 'Antihypertensives, diuretics, nitrates, alpha-blockers, antidepressants' },
          { condition: 'Autonomic Neuropathy', likelihood: 'moderate', features: 'Diabetes, Parkinson disease, prolonged bed rest' },
          { condition: 'Addison Disease', likelihood: 'rare', features: 'Hyperpigmentation, hyponatremia, hyperkalemia, weight loss' }
        ],
        'Neurologic Syncope (5-10% of cases)': [
          { condition: 'Seizure', likelihood: 'moderate', features: 'Tonic-clonic movements, tongue biting, postictal confusion, incontinence' },
          { condition: 'Vertebrobasilar TIA', likelihood: 'low', features: 'Elderly, vascular risk factors, other neurologic symptoms' },
          { condition: 'Subclavian Steal Syndrome', likelihood: 'rare', features: 'Arm exercise-induced, blood pressure differential between arms' }
        ],
        'Metabolic/Other Causes': [
          { condition: 'Hypoglycemia', likelihood: 'moderate', features: 'Diabetes, insulin use, prolonged fasting, diaphoresis, confusion' },
          { condition: 'Pregnancy', likelihood: 'varies', features: 'Women of childbearing age, supine position, morning sickness' },
          { condition: 'Anemia', likelihood: 'low', features: 'Pallor, fatigue, heavy menstrual bleeding, GI bleeding' },
          { condition: 'Psychogenic Pseudosyncope', likelihood: 'low', features: 'Psychiatric history, no injury despite falls, eyes closed during episode' }
        ]
      },
      riskStratification: {
        'High Risk Features (Cardiac Syncope)': [
          'Age >60 years',
          'Known structural heart disease',
          'Family history of sudden cardiac death',
          'Syncope during exertion or while supine',
          'No prodromal symptoms',
          'Associated chest pain or palpitations',
          'Abnormal ECG',
          'Heart failure symptoms'
        ],
        'Low Risk Features (Benign Syncope)': [
          'Age <35 years',
          'Clear vasovagal triggers',
          'Prodromal symptoms (nausea, diaphoresis)',
          'Gradual onset and recovery',
          'No structural heart disease',
          'Normal ECG',
          'Prolonged standing before episode'
        ]
      },
      clinicalAssessment: {
        'Key Historical Features': [
          'Triggers: Standing, pain, fear, exertion, position change',
          'Prodrome: Nausea, diaphoresis, visual changes, palpitations',
          'Witness description: Duration, movements, color changes',
          'Recovery: Immediate vs prolonged confusion',
          'Precipitants: Medications, illness, dehydration'
        ],
        'Physical Examination': [
          'Vital signs including orthostatic measurements',
          'Cardiovascular examination (murmurs, gallops, JVD)',
          'Neurologic examination',
          'Evidence of trauma from fall',
          'Signs of volume depletion'
        ],
        'Orthostatic Vital Signs': [
          'Supine BP/HR → Standing BP/HR at 1 and 3 minutes',
          'Positive: SBP drop ≥20 mmHg or DBP drop ≥10 mmHg',
          'Or HR increase ≥30 bpm',
          'Symptoms with position change'
        ]
      },
      redFlags: [
        'Syncope during exertion or while supine',
        'Family history of sudden cardiac death <50 years old',
        'Known structural heart disease or cardiomyopathy',
        'Syncope with chest pain or palpitations',
        'Abnormal ECG (prolonged QT, heart block, Q waves)',
        'Age >60 with first episode of syncope',
        'Syncope causing significant injury',
        'Multiple episodes without clear trigger',
        'Associated neurologic deficits'
      ],
      diagnosticApproach: {
        'Initial Evaluation (All Patients)': [
          'Detailed history from patient and witnesses',
          'Complete physical examination',
          '12-lead ECG',
          'Orthostatic vital signs',
          'Basic metabolic panel and glucose',
          'Complete blood count',
          'Pregnancy test (women of childbearing age)'
        ],
        'Risk-Based Further Testing': [
          'High Risk: Echocardiogram, telemetry monitoring, cardiology consultation',
          'Intermediate Risk: Holter monitor, event recorder, stress testing',
          'Low Risk: Reassurance, trigger avoidance, follow-up'
        ],
        'Specialized Testing': [
          'Electrophysiology study (recurrent unexplained syncope)',
          'Tilt table test (suspected vasovagal syncope)',
          'Carotid massage (suspected carotid sinus hypersensitivity)',
          'Implantable loop recorder (recurrent unexplained episodes)',
          'CT/MRI head (suspected neurologic cause)'
        ]
      },
      ecgFindings: {
        'High-Risk ECG Findings': [
          'Prolonged QT interval (>450 ms men, >460 ms women)',
          'Short QT interval (<340 ms)',
          'Brugada pattern (ST elevation V1-V3)',
          'Epsilon wave or T-wave inversion V1-V3 (ARVC)',
          'Q waves suggesting prior MI',
          'Left ventricular hypertrophy with strain',
          'Complete heart block or high-grade AV block',
          'Atrial fibrillation with slow ventricular response'
        ],
        'Low-Risk ECG Findings': [
          'Normal sinus rhythm',
          'Sinus bradycardia in young athletes',
          'First-degree AV block',
          'Early repolarization',
          'Incomplete right bundle branch block'
        ]
      },
      treatmentApproach: {
        'Cardiac Syncope': [
          'Immediate cardiology consultation',
          'Continuous cardiac monitoring',
          'Pacemaker for bradyarrhythmias',
          'ICD for ventricular arrhythmias',
          'Medical therapy for heart failure',
          'Activity restriction until evaluation complete'
        ],
        'Vasovagal Syncope': [
          'Education about triggers and avoidance',
          'Increased fluid and salt intake',
          'Physical counterpressure maneuvers',
          'Tilt training exercises',
          'Medications: fludrocortisone, midodrine (refractory cases)'
        ],
        'Orthostatic Hypotension': [
          'Review and adjust medications',
          'Increase fluid and sodium intake',
          'Compression stockings',
          'Physical therapy and conditioning',
          'Medications: fludrocortisone, midodrine, droxidopa'
        ],
        'Situational Syncope': [
          'Identify and avoid specific triggers',
          'Behavioral modifications',
          'Treatment of underlying conditions',
          'Reassurance about benign nature'
        ]
      },
      dispositionGuidelines: {
        'Admit to Hospital': [
          'High-risk cardiac features',
          'Structural heart disease',
          'Abnormal ECG concerning for arrhythmia',
          'Syncope with exertion',
          'Family history of sudden cardiac death',
          'Significant injury from syncope',
          'Frequent recurrent episodes'
        ],
        'Discharge Home': [
          'Clear vasovagal episode with typical triggers',
          'Normal ECG and physical examination',
          'No high-risk features',
          'Young age (<35) with benign history',
          'Adequate follow-up arranged'
        ],
        'Observation/Short Stay': [
          'Intermediate risk features',
          'Need for brief monitoring',
          'Medication adjustment required',
          'Social issues preventing safe discharge'
        ]
      },
      specialPopulations: {
        'Athletes': [
          'Higher suspicion for genetic cardiomyopathies',
          'Detailed family history essential',
          'Exercise restriction until cleared',
          'Echocardiogram and stress testing',
          'Consider genetic testing if indicated'
        ],
        'Elderly': [
          'Higher risk of cardiac causes',
          'Medication review essential',
          'Fall risk assessment',
          'Cognitive evaluation',
          'Polypharmacy considerations'
        ],
        'Pregnancy': [
          'Usually benign vasovagal syncope',
          'Supine hypotensive syndrome',
          'Peripartum cardiomyopathy consideration',
          'Avoid prolonged supine positioning'
        ],
        'Pediatrics': [
          'Usually vasovagal syncope',
          'Breath-holding spells in toddlers',
          'Long QT syndrome consideration',
          'Detailed family history crucial'
        ]
      },
      prognosticFactors: {
        'Cardiac Syncope': [
          '1-year mortality: 18-33%',
          'High risk of sudden cardiac death',
          'Requires immediate intervention',
          'Close cardiology follow-up essential'
        ],
        'Vasovagal Syncope': [
          'Excellent prognosis',
          'Recurrence common but benign',
          'Quality of life impact main concern',
          'No increased mortality risk'
        ],
        'Orthostatic Hypotension': [
          'Prognosis depends on underlying cause',
          'Increased fall risk',
          'Medication adjustment often successful',
          'Chronic conditions may require ongoing management'
        ]
      },
      urgency: 'immediate',
      clinicalPearls: [
        'Cardiac syncope has 18-33% one-year mortality - high-risk features require immediate evaluation',
        'Exertional syncope is cardiac until proven otherwise',
        'Family history of sudden cardiac death <50 years is a major red flag',
        'Normal ECG does not rule out cardiac syncope - 50% have normal ECG',
        'Vasovagal syncope: gradual onset, triggers, prodrome, quick recovery',
        'Orthostatic hypotension: check medications first (most common cause)',
        'Seizure vs syncope: prolonged postictal confusion suggests seizure',
        'Supine syncope suggests cardiac cause (not vasovagal)',
        'Young athletes with syncope need cardiac evaluation before return to play',
        'Elderly patients: higher risk of cardiac causes and medication effects',
        'Prolonged QT >500 ms significantly increases arrhythmia risk',
        'Situational syncope (cough, micturition) is usually benign',
        'Tilt table test useful for vasovagal syncope diagnosis',
        'Implantable loop recorders have highest diagnostic yield for recurrent unexplained syncope'
      ]
    },
    'nausea and vomiting': {
      pivotalPoints: [
        'Timing and characteristics help distinguish gastric vs intestinal vs central causes',
        'Associated symptoms guide evaluation toward specific organ systems',
        'Red flag symptoms identify serious underlying pathology requiring urgent evaluation',
        'Medication history is crucial as drug-induced nausea is extremely common'
      ],
      questions: [
        'When did the nausea and vomiting start?',
        'How often are you vomiting and what does the vomit look like?',
        'Any blood in the vomit or coffee-ground appearance?',
        'Any abdominal pain? Where is it located?',
        'Any fever, chills, or feeling generally unwell?',
        'Any diarrhea or changes in bowel movements?',
        'Any headache, dizziness, or vision changes?',
        'Are you able to keep fluids down?',
        'What makes the nausea better or worse?',
        'Any recent travel or unusual food exposures?',
        'Are you taking any new medications or supplements?',
        'For women: When was your last menstrual period? Could you be pregnant?',
        'Any recent head trauma or injury?',
        'Do you have diabetes? When did you last check your blood sugar?',
        'Any history of stomach problems, gallbladder disease, or kidney stones?',
        'Any chest pain, shortness of breath, or heart palpitations?',
        'Have you been around anyone else who is sick?'
      ],
      differentials: {
        'Gastrointestinal Causes (Most Common)': [
          { condition: 'Viral Gastroenteritis', likelihood: 'very high', features: 'Acute onset, diarrhea, cramping, family clusters, self-limiting' },
          { condition: 'Food Poisoning', likelihood: 'high', features: 'Rapid onset 1-6h after eating, specific food exposure, multiple people affected' },
          { condition: 'Gastroparesis', likelihood: 'moderate', features: 'Diabetes, early satiety, bloating, delayed gastric emptying' },
          { condition: 'Peptic Ulcer Disease', likelihood: 'moderate', features: 'Epigastric pain, H. pylori, NSAID use, relation to meals' },
          { condition: 'Gastroesophageal Reflux Disease', likelihood: 'moderate', features: 'Heartburn, regurgitation, worse lying down' },
          { condition: 'Bowel Obstruction', likelihood: 'low', features: 'Cramping pain, distension, inability to pass gas/stool, prior surgery' }
        ],
        'Serious GI Emergencies': [
          { condition: 'Upper GI Bleeding', likelihood: 'moderate concern', features: 'Hematemesis, coffee-ground emesis, melena, hemodynamic instability' },
          { condition: 'Acute Pancreatitis', likelihood: 'moderate concern', features: 'Severe epigastric pain radiating to back, alcohol history, elevated lipase' },
          { condition: 'Acute Cholecystitis', likelihood: 'moderate concern', features: 'RUQ pain, fever, Murphy\'s sign, gallstone history' },
          { condition: 'Appendicitis', likelihood: 'low concern', features: 'Periumbilical→RLQ pain, fever, anorexia, leukocytosis' }
        ],
        'Central/Neurologic Causes': [
          { condition: 'Increased Intracranial Pressure', likelihood: 'rare but critical', features: 'Headache, altered mental status, papilledema, projectile vomiting' },
          { condition: 'Migraine', likelihood: 'moderate', features: 'Unilateral headache, photophobia, phonophobia, family history' },
          { condition: 'Vestibular Disorders', likelihood: 'moderate', features: 'Vertigo, motion sensitivity, nystagmus, hearing changes' },
          { condition: 'Concussion/Head Trauma', likelihood: 'varies', features: 'Recent head injury, confusion, headache, amnesia' }
        ],
        'Metabolic/Endocrine Causes': [
          { condition: 'Diabetic Ketoacidosis', likelihood: 'moderate concern', features: 'Diabetes, hyperglycemia, ketones, Kussmaul breathing, dehydration' },
          { condition: 'Uremia', likelihood: 'moderate', features: 'Chronic kidney disease, elevated creatinine, metallic taste' },
          { condition: 'Hypercalcemia', likelihood: 'low', features: 'Malignancy, kidney stones, confusion, constipation' },
          { condition: 'Adrenal Insufficiency', likelihood: 'rare', features: 'Hypotension, hyperpigmentation, hyperkalemia, hyponatremia' }
        ],
        'Infectious Causes': [
          { condition: 'Acute Hepatitis', likelihood: 'moderate', features: 'Jaundice, RUQ pain, elevated transaminases, risk factors' },
          { condition: 'Pyelonephritis', likelihood: 'moderate', features: 'Fever, flank pain, dysuria, CVA tenderness' },
          { condition: 'Meningitis', likelihood: 'rare but critical', features: 'Fever, headache, neck stiffness, photophobia, altered mental status' },
          { condition: 'Sepsis', likelihood: 'moderate concern', features: 'Fever, hypotension, altered mental status, organ dysfunction' }
        ],
        'Medication/Toxin-Induced': [
          { condition: 'Opioid Withdrawal', likelihood: 'moderate', features: 'Opioid use history, myalgias, diarrhea, anxiety, dilated pupils' },
          { condition: 'Chemotherapy-Induced', likelihood: 'high', features: 'Recent chemotherapy, delayed or immediate onset' },
          { condition: 'Antibiotic-Associated', likelihood: 'moderate', features: 'Recent antibiotic use, C. diff risk factors' },
          { condition: 'Alcohol Withdrawal', likelihood: 'moderate', features: 'Heavy alcohol use, tremor, anxiety, hallucinations' }
        ],
        'Pregnancy-Related': [
          { condition: 'Morning Sickness', likelihood: 'very high', features: 'First trimester, mild symptoms, improves with time' },
          { condition: 'Hyperemesis Gravidarum', likelihood: 'low', features: 'Severe vomiting, dehydration, weight loss, ketosis' },
          { condition: 'HELLP Syndrome', likelihood: 'rare but critical', features: 'Third trimester, hypertension, hemolysis, elevated liver enzymes' }
        ],
        'Cardiovascular Causes': [
          { condition: 'Myocardial Infarction', likelihood: 'low but critical', features: 'Chest pain, diaphoresis, elderly, diabetics, women' },
          { condition: 'Inferior Wall MI', likelihood: 'low but critical', features: 'Nausea prominent, bradycardia, ST elevation II, III, aVF' }
        ]
      },
      clinicalAssessment: {
        'Vomiting Characteristics': [
          'Bilious: Green/yellow suggests small bowel obstruction',
          'Coffee-ground: Upper GI bleeding (digested blood)',
          'Hematemesis: Active upper GI bleeding',
          'Projectile: Increased intracranial pressure, pyloric stenosis',
          'Undigested food: Gastroparesis, gastric outlet obstruction'
        ],
        'Timing Patterns': [
          'Immediate (<1h): Gastric causes, psychogenic',
          'Early (1-6h): Food poisoning, gastritis',
          'Delayed (>6h): Small bowel obstruction, gastroparesis',
          'Morning: Pregnancy, increased ICP, alcohol withdrawal'
        ]
      },
      redFlags: [
        'Hematemesis or coffee-ground emesis (GI bleeding)',
        'Severe abdominal pain with vomiting (surgical emergency)',
        'Signs of dehydration or hemodynamic instability',
        'Altered mental status with vomiting (meningitis, increased ICP)',
        'Projectile vomiting with headache (increased ICP)',
        'Bilious vomiting (bowel obstruction)',
        'Chest pain with nausea/vomiting (MI)',
        'Pregnancy with severe vomiting and inability to keep fluids down',
        'Diabetic with vomiting and hyperglycemia (DKA risk)'
      ],
      diagnosticApproach: {
        'Initial Assessment': [
          'Vital signs and hydration status',
          'Complete abdominal examination',
          'Neurologic examination if indicated',
          'Pregnancy test (women of childbearing age)',
          'Basic metabolic panel and glucose',
          'Complete blood count'
        ],
        'Targeted Testing': [
          'Liver function tests (if RUQ pain or jaundice)',
          'Lipase (if severe epigastric pain)',
          'Urinalysis (if flank pain or dysuria)',
          'Abdominal imaging (if obstruction suspected)',
          'Head CT (if altered mental status or severe headache)'
        ]
      },
      treatmentApproach: {
        'Symptomatic Management': [
          'IV fluids for dehydration',
          'Antiemetics: ondansetron, promethazine, metoclopramide',
          'Electrolyte replacement as needed',
          'Nothing by mouth initially if severe',
          'Gradual reintroduction of clear liquids'
        ],
        'Specific Treatments': [
          'Antibiotics for bacterial gastroenteritis',
          'Proton pump inhibitors for PUD/GERD',
          'Insulin for DKA',
          'Surgery for bowel obstruction',
          'Discontinue offending medications'
        ]
      },
      urgency: 'varies'
    },
    'palpitations': {
      pivotalPoints: [
        'Patient description of rhythm helps distinguish arrhythmia types',
        'Associated symptoms identify hemodynamically significant arrhythmias',
        'Structural heart disease significantly increases risk of malignant arrhythmias',
        'Triggers and timing patterns help distinguish cardiac from non-cardiac causes'
      ],
      questions: [
        'Can you describe what the palpitations feel like (fast, slow, irregular, skipping)?',
        'When did they start and how long do they last?',
        'What triggers them (exercise, stress, caffeine, lying down)?',
        'Do they start and stop suddenly or gradually?',
        'Any chest pain, shortness of breath, or dizziness with the palpitations?',
        'Have you ever fainted or nearly fainted during an episode?',
        'Any family history of heart problems or sudden cardiac death?',
        'Do you have any known heart problems?',
        'What medications are you taking, including over-the-counter and supplements?',
        'How much caffeine, alcohol, or nicotine do you use?',
        'Any recent illness, stress, or changes in sleep patterns?',
        'Any thyroid problems or unexplained weight loss?',
        'Any anxiety, panic attacks, or psychiatric conditions?',
        'For women: Any relationship to your menstrual cycle or pregnancy?',
        'Any recreational drug use (cocaine, amphetamines)?',
        'Do you exercise regularly? Any symptoms during exercise?'
      ],
      differentials: {
        'Cardiac Arrhythmias (Significant)': [
          { condition: 'Atrial Fibrillation', likelihood: 'high', features: 'Irregularly irregular, elderly, heart disease, stroke risk' },
          { condition: 'Supraventricular Tachycardia (SVT)', likelihood: 'moderate', features: 'Sudden onset/offset, regular rapid rate 150-250, young adults' },
          { condition: 'Ventricular Tachycardia', likelihood: 'low but critical', features: 'Wide complex, hemodynamic compromise, structural heart disease' },
          { condition: 'Atrial Flutter', likelihood: 'moderate', features: 'Regular rapid rate ~150 bpm, sawtooth pattern on ECG' },
          { condition: 'Premature Ventricular Contractions', likelihood: 'high', features: 'Skipping sensation, bigeminy/trigeminy, benign if no heart disease' },
          { condition: 'Sick Sinus Syndrome', likelihood: 'low', features: 'Elderly, bradycardia-tachycardia syndrome, syncope' }
        ],
        'Non-Cardiac Causes (Common)': [
          { condition: 'Anxiety/Panic Disorder', likelihood: 'very high', features: 'Associated anxiety, stress triggers, hyperventilation, normal heart' },
          { condition: 'Hyperthyroidism', likelihood: 'moderate', features: 'Weight loss, heat intolerance, tremor, elevated TSH' },
          { condition: 'Caffeine/Stimulant Use', likelihood: 'high', features: 'Temporal relationship to intake, dose-dependent' },
          { condition: 'Medication-Induced', likelihood: 'high', features: 'Beta-agonists, decongestants, antidepressants, thyroid meds' },
          { condition: 'Alcohol Withdrawal', likelihood: 'moderate', features: 'Heavy alcohol use, tremor, autonomic hyperactivity' },
          { condition: 'Anemia', likelihood: 'moderate', features: 'Fatigue, pallor, heavy menstrual bleeding, low hemoglobin' }
        ],
        'Metabolic/Endocrine Causes': [
          { condition: 'Hypoglycemia', likelihood: 'moderate', features: 'Diabetes, insulin use, diaphoresis, confusion' },
          { condition: 'Electrolyte Abnormalities', likelihood: 'moderate', features: 'Hypokalemia, hypomagnesemia, medications' },
          { condition: 'Pheochromocytoma', likelihood: 'rare', features: 'Hypertension, diaphoresis, headache, episodic symptoms' },
          { condition: 'Menopause', likelihood: 'moderate', features: 'Perimenopausal women, hot flashes, hormonal changes' }
        ],
        'Structural Heart Disease': [
          { condition: 'Mitral Valve Prolapse', likelihood: 'moderate', features: 'Young women, mid-systolic click, usually benign' },
          { condition: 'Hypertrophic Cardiomyopathy', likelihood: 'low but serious', features: 'Family history, exertional symptoms, murmur' },
          { condition: 'Coronary Artery Disease', likelihood: 'moderate', features: 'Exertional symptoms, risk factors, chest pain' },
          { condition: 'Valvular Heart Disease', likelihood: 'low', features: 'Murmur, heart failure symptoms, elderly' }
        ]
      },
      clinicalCharacterization: {
        'Rhythm Description': [
          'Regular and fast: SVT, atrial flutter, sinus tachycardia',
          'Irregular: Atrial fibrillation, frequent PVCs, multifocal atrial tachycardia',
          'Skipping/fluttering: PVCs, PACs (premature atrial contractions)',
          'Pounding: Sinus tachycardia, anxiety, hyperdynamic states'
        ],
        'Onset/Offset Patterns': [
          'Sudden start/stop: SVT, panic attacks',
          'Gradual onset: Sinus tachycardia, anxiety',
          'Persistent: Atrial fibrillation, hyperthyroidism',
          'Episodic: PACs/PVCs, panic disorder'
        ],
        'Triggers': [
          'Exercise: Appropriate sinus tachycardia vs arrhythmia',
          'Stress/emotion: Anxiety, catecholamine-induced',
          'Caffeine/alcohol: Stimulant-induced, withdrawal',
          'Position change: Orthostatic tachycardia, POTS'
        ]
      },
      redFlags: [
        'Syncope or near-syncope with palpitations',
        'Chest pain with palpitations',
        'Family history of sudden cardiac death',
        'Known structural heart disease',
        'Palpitations during exercise',
        'Hemodynamic instability (hypotension, shock)',
        'Wide complex tachycardia on ECG',
        'Palpitations with shortness of breath or heart failure symptoms',
        'Age >50 with new-onset palpitations'
      ],
      diagnosticApproach: {
        'Initial Evaluation': [
          '12-lead ECG (during and between episodes if possible)',
          'Complete history including medication/substance use',
          'Physical examination including cardiac auscultation',
          'Vital signs including orthostatic measurements',
          'Thyroid function tests',
          'Complete blood count, basic metabolic panel'
        ],
        'Rhythm Monitoring': [
          'Holter monitor (24-48 hours for frequent symptoms)',
          'Event monitor (30 days for infrequent symptoms)',
          'Mobile cardiac telemetry (real-time monitoring)',
          'Implantable loop recorder (recurrent unexplained episodes)',
          'ECG during symptoms (if possible)'
        ],
        'Additional Testing': [
          'Echocardiogram (if structural heart disease suspected)',
          'Stress testing (if exercise-induced)',
          'Electrophysiology study (recurrent SVT, VT)',
          'Tilt table test (if syncope associated)'
        ]
      },
      treatmentApproach: {
        'Acute Management': [
          'Unstable: Immediate cardioversion for hemodynamic compromise',
          'SVT: Vagal maneuvers, adenosine, beta-blockers',
          'Atrial fibrillation: Rate control, anticoagulation consideration',
          'VT: Amiodarone, lidocaine, cardioversion',
          'Anxiety: Reassurance, relaxation techniques, anxiolytics'
        ],
        'Chronic Management': [
          'Lifestyle modifications: Reduce caffeine, alcohol, stress',
          'Medications: Beta-blockers, calcium channel blockers, antiarrhythmics',
          'Ablation therapy: For recurrent SVT, atrial fibrillation',
          'Device therapy: Pacemaker, ICD for specific indications',
          'Treatment of underlying conditions: Hyperthyroidism, anemia'
        ],
        'Non-Cardiac Causes': [
          'Anxiety: Counseling, SSRIs, beta-blockers',
          'Hyperthyroidism: Antithyroid medications, beta-blockers',
          'Anemia: Iron supplementation, treat underlying cause',
          'Medications: Dose reduction, alternative agents'
        ]
      },
      riskStratification: {
        'High Risk (Immediate Evaluation)': [
          'Syncope or hemodynamic compromise',
          'Structural heart disease',
          'Family history of sudden cardiac death',
          'Wide complex tachycardia',
          'Sustained ventricular arrhythmias'
        ],
        'Intermediate Risk': [
          'Frequent symptoms affecting quality of life',
          'Age >50 with new palpitations',
          'Exertional palpitations',
          'Associated chest pain or dyspnea'
        ],
        'Low Risk': [
          'Young, healthy patients',
          'Clear anxiety/stress relationship',
          'Normal ECG and examination',
          'Infrequent, brief episodes'
        ]
      },
      urgency: 'varies',
      clinicalPearls: [
        'Most palpitations are benign, but history guides risk stratification',
        'ECG during symptoms is most valuable diagnostic test',
        'Anxiety is the most common cause in young, healthy patients',
        'Sudden onset/offset suggests SVT; gradual suggests sinus tachycardia',
        'Irregularly irregular rhythm suggests atrial fibrillation',
        'Skipping sensations usually represent PVCs or PACs',
        'Exercise-induced palpitations require cardiac evaluation',
        'Family history of sudden cardiac death is major red flag',
        'Caffeine and alcohol are common triggers',
        'Hyperthyroidism can present solely with palpitations',
        'Beta-blockers effective for both cardiac and anxiety-related palpitations',
        'Event monitors more useful than Holter for infrequent symptoms',
        'Normal ECG between episodes does not rule out arrhythmia',
        'Vagal maneuvers can terminate SVT and aid in diagnosis'
      ]
    }
  };

  const bodyAreas = [
    { name: 'Head & Neck', icon: Brain, symptoms: ['headache', 'dizziness', 'sore throat', 'neck pain'] },
    { name: 'Chest', icon: Heart, symptoms: ['chest pain', 'shortness of breath', 'cough', 'palpitations'] },
    { name: 'Abdomen', icon: Activity, symptoms: ['abdominal pain', 'nausea', 'vomiting', 'diarrhea'] },
    { name: 'Back', icon: User, symptoms: ['back pain', 'muscle spasms', 'sciatica'] }
  ];

  const performAssessment = () => {
    // Start loading animation
    setIsLoading(true);
    
    // Simulate processing time for better UX
    setTimeout(() => {
      // Handle case where user selected body area instead of specific symptom
      let selectedSymptom = primarySymptom.toLowerCase();
      
      // If no primary symptom but body area selected, use a default for that area
      if (!selectedSymptom && bodyArea) {
        const areaSymptomMap = {
          'Head & Neck': 'headache',
          'Chest': 'chest pain', 
          'Abdomen': 'abdominal pain',
          'Back': 'back pain'
        };
        selectedSymptom = areaSymptomMap[bodyArea] || 'abdominal pain';
      }

      // If still no symptom selected, default to abdominal pain for demo
      if (!selectedSymptom) {
        selectedSymptom = 'abdominal pain';
      }

      const symptomData = symptomDatabase[selectedSymptom];
      
      // Default assessment if symptom not in database
      let riskLevel = 'low';
      let urgency = 'routine';
      let recommendations = ['Monitor symptoms and seek care if worsening'];
      let differentials = ['Common benign condition', 'Viral syndrome', 'Stress-related symptoms'];

      // If we have symptom data, use it
      if (symptomData) {
        // Clinical reasoning based on red flags and severity
        if (severity === 'severe') {
          riskLevel = 'high';
          urgency = 'immediate';
          recommendations = ['Seek emergency medical attention immediately'];
        } else if (severity === 'moderate') {
          riskLevel = 'moderate';
          urgency = 'urgent';
          recommendations = ['Contact your healthcare provider today'];
        } else {
          recommendations = ['Monitor symptoms and seek care if worsening'];
        }

        // Age-based risk stratification
        if (parseInt(userProfile.age) > 65) {
          riskLevel = riskLevel === 'low' ? 'moderate' : 'high';
        }

        // Get differentials from symptom data
        if (symptomData.differentials) {
          if (Array.isArray(symptomData.differentials)) {
            differentials = symptomData.differentials;
          } else if (typeof symptomData.differentials === 'object') {
            // Handle complex differential structure
            differentials = Object.values(symptomData.differentials)
              .flat()
              .map(item => typeof item === 'string' ? item : item.condition)
              .slice(0, 4);
          }
        }
      }

      setAssessment({
        riskLevel,
        urgency,
        differentials,
        recommendations,
        followUp: generateFollowUp(riskLevel)
      });

      // End loading and show success
      setIsLoading(false);
      setShowSuccess(true);
      setTimeout(() => {
        setCurrentStep('results');
        setShowSuccess(false);
      }, 1000);
    }, 2000); // 2 second processing simulation
  };

  const generateFollowUp = (riskLevel) => {
    switch (riskLevel) {
      case 'high':
        return 'Call 911 or go to the nearest emergency room';
      case 'moderate':
        return 'Schedule appointment with primary care physician within 24-48 hours';
      case 'low':
        return 'Monitor symptoms and seek care if they persist or worsen';
      default:
        return 'Follow up as needed';
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'moderate': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (currentStep === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 font-sans overflow-hidden">
        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(3deg); }
            50% { transform: translateY(-10px) rotate(0deg); }
          }
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          .shimmer {
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            background-size: 200% 100%;
            animation: shimmer 2s infinite;
          }
        `}</style>
        
        <div className="max-w-md mx-auto">
          <PulseAnimation>
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden transform hover:scale-[1.01] transition-all duration-500">
              {/* Premium Header with Enhanced Animations */}
              <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 p-8 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 shimmer"></div>
                <PulseAnimation delay={0.2}>
                  <div className="relative z-10">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-12 hover:scale-110 transition-all duration-300 cursor-pointer">
                        <Stethoscope className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold tracking-tight hover:tracking-wide transition-all duration-300">MediCheck AI</h1>
                        <p className="text-blue-200 text-sm font-medium">Clinical Decision Support</p>
                      </div>
                    </div>
                    <div className="w-16 h-1 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full transform origin-left hover:scale-x-150 transition-transform duration-500"></div>
                  </div>
                </PulseAnimation>
              </div>
              
              <div className="p-8">
                <PulseAnimation delay={0.4}>
                  <div className="text-center mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 via-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl animate-float cursor-pointer group">
                      <Heart className="w-12 h-12 text-white group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-3 tracking-tight hover:text-blue-800 transition-colors duration-300">
                      Evidence-Based Health Insights
                    </h2>
                    <p className="text-slate-600 text-base leading-relaxed font-medium">
                      Advanced clinical reasoning powered by medical protocols trusted by healthcare professionals worldwide.
                    </p>
                  </div>
                </PulseAnimation>

                <div className="space-y-4 mb-8">
                  {[
                    { text: "Comprehensive symptom analysis", color: "emerald", delay: 0.6 },
                    { text: "Evidence-based recommendations", color: "blue", delay: 0.8 },
                    { text: "Risk stratification & triage", color: "indigo", delay: 1.0 }
                  ].map((item, index) => (
                    <PulseAnimation key={index} delay={item.delay}>
                      <div className={`flex items-center space-x-4 p-4 bg-gradient-to-r from-${item.color}-50 to-${item.color}-50 rounded-2xl border border-${item.color}-100/50 transform hover:scale-[1.02] hover:shadow-md transition-all duration-300 group cursor-pointer`}>
                        <div className={`w-10 h-10 bg-gradient-to-br from-${item.color}-400 to-${item.color}-500 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300`}>
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-slate-700 font-medium group-hover:text-slate-800 transition-colors duration-200">{item.text}</span>
                      </div>
                    </PulseAnimation>
                  ))}
                </div>

                <PulseAnimation delay={1.2}>
                  <button
                    onClick={() => handleStepChange('profile')}
                    className="w-full bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 text-white py-4 px-6 rounded-2xl font-semibold text-lg hover:from-slate-900 hover:via-blue-900 hover:to-indigo-900 transition-all duration-300 flex items-center justify-center space-x-3 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <span className="relative z-10">Begin Assessment</span>
                    <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center relative z-10 group-hover:rotate-90 transition-transform duration-300">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </button>
                </PulseAnimation>

                <PulseAnimation delay={1.4}>
                  <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl transform hover:scale-[1.01] transition-all duration-300">
                    <p className="text-xs text-amber-800 text-center font-medium leading-relaxed">
                      ⚕️ This tool provides educational information and should not replace professional medical advice.
                    </p>
                  </div>
                </PulseAnimation>
              </div>
            </div>
          </PulseAnimation>
        </div>
        
        {isLoading && <LoadingOverlay />}
        {showSuccess && <SuccessAnimation />}
      </div>
    );
  }

  if (currentStep === 'profile') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 font-sans">
        <div className="max-w-md mx-auto">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            {/* Modern Header with Back Button */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 p-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20"></div>
              <div className="relative z-10">
                <button 
                  onClick={() => setCurrentStep('welcome')} 
                  className="mb-4 p-2 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-200 group"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                </button>
                <div>
                  <h1 className="text-xl font-bold tracking-tight mb-1">Your Health Profile</h1>
                  <p className="text-blue-200 text-sm font-medium">Help us provide better guidance</p>
                </div>
                <div className="w-12 h-1 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full mt-3"></div>
              </div>
            </div>
            
            <div className="p-8 space-y-6">
              {/* Age Input */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700 tracking-wide">Age</label>
                <div className="relative">
                  <input
                    type="number"
                    value={userProfile.age}
                    onChange={(e) => setUserProfile({...userProfile, age: e.target.value})}
                    className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-800 font-medium placeholder-slate-400 bg-white/70 backdrop-blur-sm"
                    placeholder="Enter your age"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <User className="w-5 h-5 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Gender Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700 tracking-wide">Gender</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Male', 'Female', 'Other'].map((gender, index) => {
                    const gradients = [
                      'from-blue-500 to-indigo-500',
                      'from-emerald-500 to-blue-500', 
                      'from-indigo-500 to-purple-500'
                    ];
                    const hoverGradients = [
                      'hover:from-blue-600 hover:to-indigo-600',
                      'hover:from-emerald-600 hover:to-blue-600',
                      'hover:from-indigo-600 hover:to-purple-600'
                    ];
                    
                    return (
                      <button
                        key={gender}
                        onClick={() => setUserProfile({...userProfile, gender})}
                        className={`p-4 rounded-2xl border-2 text-sm font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                          userProfile.gender === gender
                            ? `bg-gradient-to-r ${gradients[index]} text-white border-transparent shadow-lg`
                            : `bg-white/70 backdrop-blur-sm text-slate-700 border-slate-200 hover:border-slate-300 ${hoverGradients[index]} hover:text-white`
                        }`}
                      >
                        {gender}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Continue Button */}
              <div className="pt-4">
                <button
                  onClick={() => setCurrentStep('symptom-select')}
                  disabled={!userProfile.age || !userProfile.gender}
                  className="w-full bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 text-white py-4 px-6 rounded-2xl font-semibold text-lg hover:from-slate-900 hover:via-blue-900 hover:to-indigo-900 transition-all duration-300 flex items-center justify-center space-x-3 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-xl"
                >
                  <span>Continue Assessment</span>
                  <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              </div>

              {/* Progress Indicator */}
              <div className="flex justify-center space-x-2 pt-2">
                <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full"></div>
                <div className="w-8 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
                <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'symptom-select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 font-sans">
        <div className="max-w-md mx-auto">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            {/* Premium Header with Enhanced Spacing */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 px-8 py-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20"></div>
              <div className="relative z-10">
                <button 
                  onClick={() => setCurrentStep('profile')} 
                  className="mb-6 p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-200 group"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                </button>
                <div className="space-y-3">
                  <h1 className="text-2xl font-bold tracking-tight leading-tight">What's concerning you?</h1>
                  <p className="text-blue-200 text-base font-medium leading-relaxed">Select the area or describe your symptoms</p>
                </div>
                <div className="w-16 h-1 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full mt-6"></div>
              </div>
            </div>
            
            <div className="px-8 py-10 space-y-8">
              {/* Enhanced Search Section */}
              <div className="space-y-4">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="w-6 h-6 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={primarySymptom}
                    onChange={(e) => setPrimarySymptom(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-slate-800 font-medium placeholder-slate-400 bg-white/80 backdrop-blur-sm text-base"
                    placeholder="Describe your symptoms..."
                  />
                </div>
                <p className="text-slate-500 text-sm font-medium leading-relaxed px-1">
                  Or choose from common areas below
                </p>
              </div>

              {/* Body Areas with Perfect Spacing */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">Select body area:</h3>
                <div className="space-y-4">
                  {bodyAreas.map((area, index) => {
                    const IconComponent = area.icon;
                    const gradientSchemes = [
                      { bg: 'from-rose-50 to-pink-50', icon: 'from-rose-500 to-pink-500', border: 'border-rose-200', hover: 'hover:border-rose-300' },
                      { bg: 'from-red-50 to-orange-50', icon: 'from-red-500 to-orange-500', border: 'border-red-200', hover: 'hover:border-red-300' },
                      { bg: 'from-amber-50 to-yellow-50', icon: 'from-amber-500 to-yellow-500', border: 'border-amber-200', hover: 'hover:border-amber-300' },
                      { bg: 'from-emerald-50 to-green-50', icon: 'from-emerald-500 to-green-500', border: 'border-emerald-200', hover: 'hover:border-emerald-300' }
                    ];
                    const scheme = gradientSchemes[index % gradientSchemes.length];
                    
                    return (
                      <button
                        key={area.name}
                        onClick={() => setBodyArea(area.name)}
                        className={`w-full p-6 rounded-2xl border-2 text-left transition-all duration-300 group transform hover:scale-[1.02] active:scale-[0.98] ${
                          bodyArea === area.name 
                            ? `bg-gradient-to-r ${scheme.bg} ${scheme.border} shadow-lg` 
                            : `bg-white/80 backdrop-blur-sm border-slate-200 hover:border-slate-300 hover:shadow-md`
                        }`}
                      >
                        <div className="flex items-center space-x-5">
                          <div className={`w-14 h-14 bg-gradient-to-br ${scheme.icon} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}>
                            <IconComponent className="w-7 h-7 text-white" />
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="text-lg font-bold text-slate-800 tracking-tight group-hover:text-slate-900">
                              {area.name}
                            </div>
                            <div className="text-sm text-slate-600 font-medium leading-relaxed">
                              {area.symptoms.slice(0, 3).join(', ')}...
                            </div>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronRight className="w-6 h-6 text-slate-400" />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Enhanced Continue Button */}
              <div className="pt-6">
                <button
                  onClick={() => setCurrentStep('severity')}
                  disabled={!primarySymptom && !bodyArea}
                  className="w-full bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 text-white py-5 px-8 rounded-2xl font-bold text-lg hover:from-slate-900 hover:via-blue-900 hover:to-indigo-900 transition-all duration-300 flex items-center justify-center space-x-4 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-xl"
                >
                  <span>Continue Assessment</span>
                  <div className="w-7 h-7 bg-white/20 rounded-xl flex items-center justify-center">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </button>
              </div>

              {/* Enhanced Progress Indicator */}
              <div className="flex justify-center items-center space-x-3 pt-4">
                <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full shadow-sm"></div>
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-sm"></div>
                <div className="w-10 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-sm"></div>
                <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'severity') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 font-sans">
        <div className="max-w-md mx-auto">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            {/* Premium Header with Perfect Hierarchy */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 px-8 py-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20"></div>
              <div className="relative z-10">
                <button 
                  onClick={() => setCurrentStep('symptom-select')} 
                  className="mb-6 p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-200 group"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                </button>
                <div className="space-y-3">
                  <h1 className="text-2xl font-bold tracking-tight leading-tight">Tell us more</h1>
                  <p className="text-blue-200 text-base font-medium leading-relaxed">Help us understand your symptoms better</p>
                </div>
                <div className="w-16 h-1 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full mt-6"></div>
              </div>
            </div>
            
            <div className="px-8 py-10 space-y-10">
              {/* Severity Assessment with Enhanced Visual Hierarchy */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <h2 className="text-xl font-bold text-slate-800 tracking-tight leading-tight">How severe is your symptom?</h2>
                  <p className="text-slate-600 font-medium leading-relaxed">This helps us provide better guidance</p>
                </div>
                
                <div className="space-y-4">
                  {[
                    { level: 'mild', label: 'Mild', description: 'Barely noticeable, doesn\'t interfere with daily activities', color: 'emerald', emoji: '😌' },
                    { level: 'moderate', label: 'Moderate', description: 'Noticeable and somewhat bothersome but manageable', color: 'amber', emoji: '😐' },
                    { level: 'severe', label: 'Severe', description: 'Significantly impacting daily life and activities', color: 'red', emoji: '😣' }
                  ].map((option) => (
                    <button
                      key={option.level}
                      onClick={() => setSeverity(option.level)}
                      className={`w-full p-6 rounded-2xl border-2 text-left transition-all duration-300 group transform hover:scale-[1.01] active:scale-[0.99] ${
                        severity === option.level
                          ? `bg-gradient-to-r from-${option.color}-50 to-${option.color}-100 border-${option.color}-300 shadow-lg`
                          : 'bg-white/80 backdrop-blur-sm border-slate-200 hover:border-slate-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 ${severity === option.level ? `bg-gradient-to-br from-${option.color}-400 to-${option.color}-500` : 'bg-slate-100'} rounded-2xl flex items-center justify-center text-xl shadow-sm group-hover:shadow-md transition-shadow`}>
                          {option.emoji}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className={`text-lg font-bold tracking-tight ${severity === option.level ? `text-${option.color}-800` : 'text-slate-800'}`}>
                            {option.label}
                          </div>
                          <div className={`text-sm font-medium leading-relaxed ${severity === option.level ? `text-${option.color}-700` : 'text-slate-600'}`}>
                            {option.description}
                          </div>
                        </div>
                        {severity === option.level && (
                          <div className={`w-6 h-6 bg-${option.color}-500 rounded-full flex items-center justify-center`}>
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration Assessment with Professional Spacing */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <h2 className="text-xl font-bold text-slate-800 tracking-tight leading-tight">How long have you had this?</h2>
                  <p className="text-slate-600 font-medium leading-relaxed">Duration helps determine urgency</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { period: '< 1 day', gradient: 'from-blue-500 to-cyan-500', bg: 'from-blue-50 to-cyan-50' },
                    { period: '1-3 days', gradient: 'from-indigo-500 to-blue-500', bg: 'from-indigo-50 to-blue-50' },
                    { period: '4-7 days', gradient: 'from-purple-500 to-indigo-500', bg: 'from-purple-50 to-indigo-50' },
                    { period: '> 1 week', gradient: 'from-pink-500 to-purple-500', bg: 'from-pink-50 to-purple-50' }
                  ].map((item) => (
                    <button
                      key={item.period}
                      onClick={() => setDuration(item.period)}
                      className={`p-5 rounded-2xl border-2 text-center font-bold text-base transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                        duration === item.period
                          ? `bg-gradient-to-r ${item.gradient} text-white border-transparent shadow-lg`
                          : `bg-gradient-to-r ${item.bg} text-slate-700 border-slate-200 hover:border-slate-300`
                      }`}
                    >
                      {item.period}
                    </button>
                  ))}
                </div>
              </div>

              {/* Enhanced Assessment Button */}
              <div className="pt-6">
                <button
                  onClick={performAssessment}
                  disabled={!severity || !duration}
                  className={`w-full py-5 px-8 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-4 shadow-xl transform ${
                    (!severity || !duration) 
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60' 
                      : 'bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 text-white hover:from-slate-900 hover:via-blue-900 hover:to-indigo-900 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]'
                  }`}
                >
                  <span>Get Assessment</span>
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${(!severity || !duration) ? 'bg-slate-400' : 'bg-white/20'}`}>
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </button>
              </div>

              {/* Progress Indicator with Perfect Alignment */}
              <div className="flex justify-center items-center space-x-3 pt-4">
                <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full shadow-sm"></div>
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-sm"></div>
                <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-sm"></div>
                <div className="w-10 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'results' && assessment) {
    const riskColorSchemes = {
      'high': {
        bg: 'from-red-50 to-rose-50',
        border: 'border-red-200',
        accent: 'from-red-500 to-rose-500',
        text: 'text-red-800',
        icon: 'text-red-600'
      },
      'moderate': {
        bg: 'from-amber-50 to-orange-50', 
        border: 'border-amber-200',
        accent: 'from-amber-500 to-orange-500',
        text: 'text-amber-800',
        icon: 'text-amber-600'
      },
      'low': {
        bg: 'from-emerald-50 to-green-50',
        border: 'border-emerald-200', 
        accent: 'from-emerald-500 to-green-500',
        text: 'text-emerald-800',
        icon: 'text-emerald-600'
      }
    };

    const scheme = riskColorSchemes[assessment.riskLevel] || riskColorSchemes.low;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 font-sans">
        <div className="max-w-md mx-auto space-y-6">
          {/* Risk Level Card */}
          <div className={`rounded-3xl shadow-2xl overflow-hidden border-2 ${scheme.border} bg-gradient-to-br ${scheme.bg} backdrop-blur-xl`}>
            <div className="p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className={`w-16 h-16 bg-gradient-to-br ${scheme.accent} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className={`text-2xl font-bold capitalize tracking-tight ${scheme.text}`}>
                    {assessment.riskLevel} Priority
                  </h2>
                  <p className={`text-base font-medium opacity-80 ${scheme.text} leading-relaxed`}>
                    {assessment.followUp}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 tracking-tight">Clinical Recommendations</h3>
              </div>
              <div className="space-y-4">
                {assessment.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start space-x-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100/50">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-slate-700 font-medium leading-relaxed">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Possible Conditions */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 tracking-tight">Differential Diagnosis</h3>
              </div>
              <div className="space-y-3">
                {assessment.differentials.slice(0, 4).map((condition, idx) => (
                  <div key={idx} className="p-4 border-2 border-slate-200 rounded-2xl hover:border-slate-300 transition-all duration-200 bg-white/70 backdrop-blur-sm">
                    <div className="font-semibold text-slate-800 tracking-wide">{condition}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={() => {
                setCurrentStep('welcome');
                setSymptoms([]);
                setPrimarySymptom('');
                setAssessment(null);
              }}
              className="flex-1 bg-white/80 backdrop-blur-xl text-slate-700 py-4 px-6 rounded-2xl font-semibold border-2 border-slate-200 hover:border-slate-300 hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
            >
              New Assessment
            </button>
            <button className="flex-1 bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 text-white py-4 px-6 rounded-2xl font-semibold hover:from-slate-900 hover:via-blue-900 hover:to-indigo-900 transition-all duration-300 flex items-center justify-center space-x-3 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98]">
              <MapPin className="w-5 h-5" />
              <span>Find Care</span>
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center space-x-2 pt-2">
            <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full"></div>
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
            <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
            <div className="w-8 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default MedicalSymptomChecker;
