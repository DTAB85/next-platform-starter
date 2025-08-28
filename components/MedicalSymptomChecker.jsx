&apos;use client&apos;;

import React, { useState, useEffect } from &apos;react&apos;;
import { ChevronRight, User, Clock, AlertTriangle, CheckCircle, Heart, Brain, Stethoscope, Activity, Search, ArrowLeft, MapPin, Calendar } from &apos;lucide-react&apos;;

const MedicalSymptomChecker = () => {
  const [currentStep, setCurrentStep] = useState(&apos;welcome&apos;);
  const [userProfile, setUserProfile] = useState({
    age: &apos;&apos;,
    gender: &apos;&apos;,
    conditions: [],
    medications: []
  });
  const [symptoms, setSymptoms] = useState([]);
  const [primarySymptom, setPrimarySymptom] = useState(&apos;&apos;);
  const [severity, setSeverity] = useState(&apos;&apos;);
  const [duration, setDuration] = useState(&apos;&apos;);
  const [assessment, setAssessment] = useState(null);
  const [bodyArea, setBodyArea] = useState(&apos;&apos;);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Animation state for step transitions
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Enhanced step transition with loading animation
  const handleStepChange = (newStep) => {
    if (newStep === &apos;results&apos;) {
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
        animationFillMode: &apos;forwards&apos;
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
    &apos;chest pain&apos;: {
      pivotalPoints: [
        &apos;Immediate assessment for life-threatening causes (ACS, PE, aortic dissection, pneumothorax)&apos;,
        &apos;Character, location, radiation pattern, and triggers guide differential diagnosis&apos;,
        &apos;Cardiac risk factors significantly influence probability of ACS&apos;,
        &apos;Associated symptoms (dyspnea, diaphoresis, nausea) increase likelihood of serious pathology&apos;
      ],
      questions: [
        &apos;When did the chest pain start and how did it begin (sudden vs gradual)?&apos;,
        &apos;Where exactly is the pain located and does it radiate anywhere?&apos;,
        &apos;What does the pain feel like (crushing, burning, sharp, tearing, pressure)?&apos;,
        &apos;How severe is the pain on a scale of 1-10?&apos;,
        &apos;What were you doing when the pain started (exertion, rest, emotional stress)?&apos;,
        &apos;Does anything make the pain better or worse (rest, nitroglycerin, position, deep breathing)?&apos;,
        &apos;Are you short of breath or having trouble breathing?&apos;,
        &apos;Do you feel nauseous, dizzy, or are you sweating?&apos;,
        &apos;Do you feel like your heart is racing or pounding?&apos;,
        &apos;Any pain in your jaw, neck, arms, or back?&apos;,
        &apos;Have you had chest pain like this before?&apos;,
        &apos;Do you have high blood pressure, diabetes, or high cholesterol?&apos;,
        &apos;Do you smoke or have you ever smoked?&apos;,
        &apos;Any family history of heart attacks or heart disease?&apos;,
        &apos;Are you taking any medications, especially for heart conditions?&apos;,
        &apos;Any recent long travel, surgery, or prolonged immobilization?&apos;,
        &apos;Any recent cough, fever, or leg swelling?&apos;
      ],
      differentials: {
        &apos;Life-Threatening (Immediate Evaluation Required)&apos;: [
          { condition: &apos;ST-Elevation Myocardial Infarction (STEMI)&apos;, likelihood: &apos;varies by risk factors&apos;, features: &apos;Severe crushing chest pain, diaphoresis, nausea, ST elevations on ECG&apos; },
          { condition: &apos;Non-STEMI/Unstable Angina&apos;, likelihood: &apos;varies by risk factors&apos;, features: &apos;Crescendo angina, rest pain, troponin elevation&apos; },
          { condition: &apos;Aortic Dissection&apos;, likelihood: &apos;rare but critical&apos;, features: &apos;Sudden tearing pain, radiation to back, pulse/BP differential&apos; },
          { condition: &apos;Pulmonary Embolism&apos;, likelihood: &apos;moderate&apos;, features: &apos;Sudden dyspnea, pleuritic pain, risk factors for DVT&apos; },
          { condition: &apos;Tension Pneumothorax&apos;, likelihood: &apos;rare&apos;, features: &apos;Sudden severe dyspnea, absent breath sounds, tracheal deviation&apos; }
        ],
        &apos;Cardiac (Non-Acute)&apos;: [
          { condition: &apos;Stable Angina&apos;, likelihood: &apos;moderate&apos;, features: &apos;Exertional chest pain, relieved by rest/nitroglycerin, predictable pattern&apos; },
          { condition: &apos;Pericarditis&apos;, likelihood: &apos;low&apos;, features: &apos;Sharp pain, worse lying flat, better sitting forward, friction rub&apos; },
          { condition: &apos;Myocarditis&apos;, likelihood: &apos;rare&apos;, features: &apos;Recent viral illness, young patient, heart failure symptoms&apos; }
        ],
        &apos;Pulmonary&apos;: [
          { condition: &apos;Pneumonia&apos;, likelihood: &apos;moderate&apos;, features: &apos;Fever, productive cough, pleuritic pain, consolidation on exam&apos; },
          { condition: &apos;Pleuritis&apos;, likelihood: &apos;moderate&apos;, features: &apos;Sharp pain worse with breathing, pleural friction rub&apos; },
          { condition: &apos;Spontaneous Pneumothorax&apos;, likelihood: &apos;low&apos;, features: &apos;Sudden onset, tall thin males, decreased breath sounds&apos; }
        ],
        &apos;Gastrointestinal&apos;: [
          { condition: &apos;Gastroesophageal Reflux Disease (GERD)&apos;, likelihood: &apos;high&apos;, features: &apos;Burning pain, worse lying down, response to antacids&apos; },
          { condition: &apos;Esophageal Spasm&apos;, likelihood: &apos;low&apos;, features: &apos;Severe squeezing pain, may mimic MI, relieved by nitroglycerin&apos; },
          { condition: &apos;Peptic Ulcer Disease&apos;, likelihood: &apos;moderate&apos;, features: &apos;Epigastric pain, relation to meals, H. pylori risk factors&apos; }
        ],
        &apos;Musculoskeletal&apos;: [
          { condition: &apos;Costochondritis&apos;, likelihood: &apos;moderate&apos;, features: &apos;Sharp pain, worse with movement, reproducible with palpation&apos; },
          { condition: &apos;Muscle Strain&apos;, likelihood: &apos;moderate&apos;, features: &apos;Recent activity, worse with movement, tender to palpation&apos; },
          { condition: &apos;Rib Fracture&apos;, likelihood: &apos;low&apos;, features: &apos;Recent trauma, point tenderness, worse with deep breathing&apos; }
        ],
        &apos;Other&apos;: [
          { condition: &apos;Panic Disorder&apos;, likelihood: &apos;moderate&apos;, features: &apos;Sudden onset, associated anxiety, palpitations, hyperventilation&apos; },
          { condition: &apos;Herpes Zoster&apos;, likelihood: &apos;low&apos;, features: &apos;Burning pain in dermatomal distribution, vesicular rash&apos; }
        ]
      },
      riskStratification: {
        &apos;Very High Risk ACS&apos;: [
          &apos;Age >65 with typical anginal symptoms&apos;,
          &apos;Known coronary artery disease with worsening symptoms&apos;,
          &apos;Diabetes + multiple cardiac risk factors&apos;,
          &apos;Cocaine use with chest pain&apos;
        ],
        &apos;High Risk ACS&apos;: [
          &apos;Male >45 or female >55 with typical symptoms&apos;,
          &apos;Multiple cardiac risk factors (HTN, DM, smoking, family history)&apos;,
          &apos;Previous MI or known CAD&apos;,
          &apos;Typical anginal pain pattern&apos;
        ],
        &apos;Moderate Risk ACS&apos;: [
          &apos;Age 30-45 (male) or 30-55 (female) with risk factors&apos;,
          &apos;Atypical chest pain with some cardiac risk factors&apos;,
          &apos;Exertional symptoms in at-risk patients&apos;
        ],
        &apos;Low Risk ACS&apos;: [
          &apos;Young patients (<30) without risk factors&apos;,
          &apos;Clearly reproducible with movement/palpation&apos;,
          &apos;Sharp, stabbing pain lasting seconds&apos;,
          &apos;No relationship to exertion&apos;
        ]
      },
      redFlags: [
        &apos;Sudden severe "tearing" pain radiating to back (aortic dissection)&apos;,
        &apos;Chest pain with severe dyspnea and hypoxia (PE, tension pneumothorax)&apos;,
        &apos;Chest pain with syncope or near-syncope&apos;,
        &apos;Signs of cardiogenic shock (hypotension, altered mental status)&apos;,
        &apos;Chest pain with unequal pulses or blood pressures&apos;,
        &apos;Cocaine or methamphetamine use with chest pain&apos;,
        &apos;Known aortic stenosis with chest pain&apos;,
        &apos;Chest pain in setting of recent cardiac catheterization&apos;
      ],
      diagnosticCriteria: {
        &apos;Typical Angina&apos;: [
          &apos;Substernal chest discomfort with characteristic quality and duration&apos;,
          &apos;Provoked by exertion or emotional stress&apos;,
          &apos;Relieved by rest or nitroglycerin within minutes&apos;
        ],
        &apos;Atypical Angina&apos;: [
          &apos;Meets 2 of 3 typical angina criteria&apos;
        ],
        &apos;Non-Anginal Chest Pain&apos;: [
          &apos;Meets 1 or none of typical angina criteria&apos;
        ]
      },
      ageGenderFactors: {
        &apos;Young Men (<30)&apos;: [&apos;Pneumothorax&apos;, &apos;Costochondritis&apos;, &apos;Anxiety&apos;, &apos;Cocaine-induced MI&apos;],
        &apos;Young Women (<30)&apos;: [&apos;Anxiety&apos;, &apos;Mitral valve prolapse&apos;, &apos;Costochondritis&apos;, &apos;Pregnancy-related&apos;],
        &apos;Middle-Aged Men (30-65)&apos;: [&apos;Acute coronary syndrome&apos;, &apos;GERD&apos;, &apos;Musculoskeletal&apos;],
        &apos;Middle-Aged Women (30-65)&apos;: [&apos;Atypical ACS presentation&apos;, &apos;GERD&apos;, &apos;Anxiety&apos;, &apos;Microvascular disease&apos;],
        &apos;Elderly (>65)&apos;: [&apos;Acute coronary syndrome&apos;, &apos;Aortic stenosis&apos;, &apos;Pneumonia&apos;, &apos;Herpes zoster&apos;],
        &apos;Diabetics&apos;: [&apos;Silent ischemia&apos;, &apos;Atypical presentations&apos;, &apos;Higher risk ACS&apos;]
      },
      clinicalDecisionRules: {
        &apos;HEART Score&apos;: &apos;Risk stratification for ACS (History, ECG, Age, Risk factors, Troponin)&apos;,
        &apos;Wells Score&apos;: &apos;Probability assessment for pulmonary embolism&apos;,
        &apos;PERC Rule&apos;: &apos;Rule out PE in low-risk patients without testing&apos;
      },
      urgency: &apos;immediate&apos;,
      clinicalPearls: [
        &apos;Women and diabetics often present with atypical ACS symptoms&apos;,
        &apos;Normal ECG and troponin do not rule out ACS in first 6 hours&apos;,
        &apos;Cocaine-induced chest pain can cause MI even in young patients&apos;,
        &apos;Response to GI cocktail does not rule out cardiac cause&apos;,
        &apos;"Worst pain ever" + tearing quality + back radiation = aortic dissection until proven otherwise&apos;,
        &apos;PE can present with pleuritic or non-pleuritic chest pain&apos;,
        &apos;Reproducible chest pain does not exclude cardiac etiology&apos;,
        &apos;Never discharge chest pain without ECG and appropriate risk stratification&apos;
      ]
    },
    &apos;wheezing&apos;: {
      pivotalPoints: [
        &apos;Stridor indicates upper airway obstruction and is a potential airway emergency&apos;,
        &apos;Wheezing location (inspiratory vs expiratory) helps localize airway obstruction&apos;,
        &apos;Acute onset wheezing requires evaluation for anaphylaxis, foreign body, or pneumothorax&apos;,
        &apos;Unilateral wheezing suggests focal obstruction rather than diffuse airway disease&apos;
      ],
      questions: [
        &apos;When did the wheezing start - suddenly or gradually?&apos;,
        &apos;Do you hear the wheezing when breathing in, out, or both?&apos;,
        &apos;Is the wheezing heard throughout both lungs or more on one side?&apos;,
        &apos;Any difficulty breathing or feeling short of breath?&apos;,
        &apos;Any chest tightness or chest pain?&apos;,
        &apos;Any cough? Are you bringing up any sputum?&apos;,
        &apos;Any fever or feeling generally unwell?&apos;,
        &apos;Have you been exposed to any allergens, dust, or irritants?&apos;,
        &apos;Any recent cold or respiratory infection?&apos;,
        &apos;Do you have a history of asthma, allergies, or lung disease?&apos;,
        &apos;Are you taking any medications or inhalers?&apos;,
        &apos;Any family history of asthma or allergies?&apos;,
        &apos;Do you smoke or have you been exposed to secondhand smoke?&apos;,
        &apos;Any recent travel or unusual exposures?&apos;,
        &apos;For children: Any possibility of swallowing a small object?&apos;,
        &apos;Any swelling of face, lips, tongue, or throat?&apos;,
        &apos;Any voice changes or difficulty swallowing?&apos;
      ],
      differentials: {
        &apos;Upper Airway Obstruction (STRIDOR - Emergency)&apos;: [
          { condition: &apos;Epiglottitis&apos;, likelihood: &apos;rare but critical&apos;, features: &apos;Rapid onset, drooling, muffled voice, tripod position, high fever&apos; },
          { condition: &apos;Croup (Laryngotracheobronchitis)&apos;, likelihood: &apos;moderate&apos;, features: &apos;Children 6m-6y, barking cough, inspiratory stridor, viral prodrome&apos; },
          { condition: &apos;Foreign Body Aspiration&apos;, likelihood: &apos;moderate&apos;, features: &apos;Sudden onset, children, choking episode, unilateral findings&apos; },
          { condition: &apos;Anaphylaxis&apos;, likelihood: &apos;moderate&apos;, features: &apos;Rapid onset, known allergen, urticaria, hypotension, angioedema&apos; },
          { condition: &apos;Vocal Cord Paralysis&apos;, likelihood: &apos;low&apos;, features: &apos;Voice changes, gradual onset, recent surgery/intubation&apos; },
          { condition: &apos;Retropharyngeal Abscess&apos;, likelihood: &apos;rare&apos;, features: &apos;Severe sore throat, neck stiffness, drooling, fever&apos; }
        ],
        &apos;Lower Airway Obstruction (WHEEZING)&apos;: [
          { condition: &apos;Asthma Exacerbation&apos;, likelihood: &apos;very high&apos;, features: &apos;Known asthma, triggers, reversible with bronchodilators, expiratory wheeze&apos; },
          { condition: &apos;Chronic Obstructive Pulmonary Disease (COPD)&apos;, likelihood: &apos;high&apos;, features: &apos;Smoking history, chronic cough, progressive dyspnea, barrel chest&apos; },
          { condition: &apos;Bronchiolitis&apos;, likelihood: &apos;high&apos;, features: &apos;Infants <2 years, RSV season, fine crackles and wheeze&apos; },
          { condition: &apos;Pneumonia&apos;, likelihood: &apos;moderate&apos;, features: &apos;Fever, productive cough, consolidation, unilateral findings&apos; },
          { condition: &apos;Pulmonary Edema&apos;, likelihood: &apos;moderate&apos;, features: &apos;Heart failure, pink frothy sputum, bilateral crackles&apos; },
          { condition: &apos;Pneumothorax&apos;, likelihood: &apos;low&apos;, features: &apos;Sudden onset, chest pain, decreased breath sounds, tall thin males&apos; }
        ],
        &apos;Occupational/Environmental&apos;: [
          { condition: &apos;Occupational Asthma&apos;, likelihood: &apos;moderate&apos;, features: &apos;Work-related triggers, improvement on weekends/vacations&apos; },
          { condition: &apos;Hypersensitivity Pneumonitis&apos;, likelihood: &apos;low&apos;, features: &apos;Bird exposure, farmer\&apos;s lung, chronic exposure&apos; },
          { condition: &apos;Chemical Irritant Exposure&apos;, likelihood: &apos;moderate&apos;, features: &apos;Acute exposure, workplace incident, multiple patients&apos; },
          { condition: &apos;Smoke Inhalation&apos;, likelihood: &apos;varies&apos;, features: &apos;Fire exposure, carbon monoxide, thermal injury&apos; }
        ],
        &apos;Cardiac Causes (Cardiac Asthma)&apos;: [
          { condition: &apos;Acute Heart Failure&apos;, likelihood: &apos;moderate&apos;, features: &apos;Orthopnea, PND, JVD, S3 gallop, bilateral crackles&apos; },
          { condition: &apos;Mitral Stenosis&apos;, likelihood: &apos;low&apos;, features: &apos;Diastolic murmur, atrial fibrillation, pulmonary hypertension&apos; },
          { condition: &apos;Pulmonary Embolism&apos;, likelihood: &apos;low&apos;, features: &apos;Sudden onset, pleuritic pain, risk factors, hypoxia&apos; }
        ],
        &apos;Infectious Causes&apos;: [
          { condition: &apos;Viral Respiratory Infection&apos;, likelihood: &apos;high&apos;, features: &apos;URI symptoms, rhinorrhea, low-grade fever, self-limiting&apos; },
          { condition: &apos;Bacterial Pneumonia&apos;, likelihood: &apos;moderate&apos;, features: &apos;High fever, productive cough, consolidation, elevated WBC&apos; },
          { condition: &apos;Pertussis (Whooping Cough)&apos;, likelihood: &apos;low&apos;, features: &apos;Paroxysmal cough, inspiratory whoop, unvaccinated&apos; },
          { condition: &apos;Respiratory Syncytial Virus (RSV)&apos;, likelihood: &apos;high&apos;, features: &apos;Infants, bronchiolitis, seasonal pattern&apos; }
        ]
      },
      clinicalDistinction: {
        &apos;Stridor vs Wheezing&apos;: [
          &apos;Stridor: Loud, audible without stethoscope, inspiratory, upper airway&apos;,
          &apos;Wheezing: High-pitched, musical, usually expiratory, lower airway&apos;,
          &apos;Biphasic stridor: Both inspiratory and expiratory = severe obstruction&apos;
        ],
        &apos;Inspiratory vs Expiratory Sounds&apos;: [
          &apos;Inspiratory stridor: Laryngeal/tracheal obstruction above vocal cords&apos;,
          &apos;Expiratory wheeze: Bronchial obstruction below vocal cords&apos;,
          &apos;Biphasic: Severe obstruction at vocal cord level or below&apos;
        ],
        &apos;Localization by Sound&apos;: [
          &apos;Loud stridor audible from distance: Severe upper airway obstruction&apos;,
          &apos;Unilateral wheeze: Foreign body, pneumonia, pneumothorax&apos;,
          &apos;Bilateral wheeze: Asthma, COPD, heart failure&apos;,
          &apos;Silent chest: Severe bronchospasm with poor air movement&apos;
        ]
      },
      emergencyRecognition: {
        &apos;Immediate Airway Threats&apos;: [
          &apos;Stridor with respiratory distress&apos;,
          &apos;Drooling with inability to swallow&apos;,
          &apos;Tripod positioning&apos;,
          &apos;Cyanosis or severe hypoxia&apos;,
          &apos;Altered mental status with respiratory distress&apos;,
          &apos;Silent chest with severe distress&apos;,
          &apos;Anaphylaxis with airway involvement&apos;
        ],
        &apos;Epiglottitis Recognition&apos;: [
          &apos;Acute onset over hours&apos;,
          &apos;High fever >101°F (38.3°C)&apos;,
          &apos;Sore throat with drooling&apos;,
          &apos;Muffled or "hot potato" voice&apos;,
          &apos;Tripod position (sitting, leaning forward)&apos;,
          &apos;Avoid examination that may precipitate obstruction&apos;
        ],
        &apos;Anaphylaxis Recognition&apos;: [
          &apos;Rapid onset after exposure&apos;,
          &apos;Urticaria, angioedema&apos;,
          &apos;Respiratory distress, wheeze&apos;,
          &apos;Hypotension, shock&apos;,
          &apos;GI symptoms (nausea, cramping)&apos;
        ]
      },
      redFlags: [
        &apos;Stridor (any stridor is concerning)&apos;,
        &apos;Drooling with respiratory distress&apos;,
        &apos;Tripod positioning or inability to lie flat&apos;,
        &apos;Cyanosis or oxygen saturation <90%&apos;,
        &apos;Altered mental status with respiratory symptoms&apos;,
        &apos;Signs of anaphylaxis (urticaria, angioedema, hypotension)&apos;,
        &apos;Silent chest with severe respiratory distress&apos;,
        &apos;Hemoptysis with wheezing&apos;,
        &apos;Sudden onset in previously healthy individual&apos;,
        &apos;Unilateral wheeze (suggests foreign body or focal pathology)&apos;
      ],
      diagnosticApproach: {
        &apos;Immediate Assessment&apos;: [
          &apos;Airway patency and respiratory status&apos;,
          &apos;Vital signs including oxygen saturation&apos;,
          &apos;Mental status and level of distress&apos;,
          &apos;Inspection for cyanosis, retractions&apos;,
          &apos;Auscultation for wheeze location and quality&apos;
        ],
        &apos;Emergency Diagnostics&apos;: [
          &apos;Arterial blood gas (if severe)&apos;,
          &apos;Chest X-ray (if stable enough)&apos;,
          &apos;Peak flow measurement (asthma)&apos;,
          &apos;Complete blood count&apos;,
          &apos;Consider lateral neck X-ray (epiglottitis) ONLY if stable&apos;
        ],
        &apos;Advanced Imaging&apos;: [
          &apos;CT neck with contrast (stable patients with stridor)&apos;,
          &apos;Bronchoscopy (foreign body suspected)&apos;,
          &apos;Echocardiogram (cardiac asthma suspected)&apos;,
          &apos;Pulmonary function tests (chronic wheeze)&apos;
        ],
        &apos;Laboratory Studies&apos;: [
          &apos;Complete blood count with differential&apos;,
          &apos;C-reactive protein or ESR&apos;,
          &apos;Arterial blood gas&apos;,
          &apos;BNP (if heart failure suspected)&apos;,
          &apos;Tryptase level (anaphylaxis)&apos;
        ]
      },
      treatmentApproach: {
        &apos;Emergency Airway Management&apos;: [
          &apos;High-flow oxygen&apos;,
          &apos;Epinephrine for anaphylaxis&apos;,
          &apos;Nebulized epinephrine for croup&apos;,
          &apos;Corticosteroids for airway edema&apos;,
          &apos;Prepare for emergency airway (cricothyrotomy, tracheostomy)&apos;,
          &apos;Avoid agitating patient with epiglottitis&apos;
        ],
        &apos;Asthma Exacerbation&apos;: [
          &apos;Inhaled beta-2 agonists (albuterol)&apos;,
          &apos;Systemic corticosteroids&apos;,
          &apos;Ipratropium bromide (anticholinergic)&apos;,
          &apos;Magnesium sulfate (severe cases)&apos;,
          &apos;Consider continuous nebulization&apos;
        ],
        &apos;COPD Exacerbation&apos;: [
          &apos;Inhaled bronchodilators&apos;,
          &apos;Systemic corticosteroids&apos;,
          &apos;Antibiotics if bacterial infection suspected&apos;,
          &apos;Non-invasive positive pressure ventilation&apos;,
          &apos;Oxygen therapy (target 88-92%)&apos;
        ],
        &apos;Croup Management&apos;: [
          &apos;Nebulized epinephrine (severe cases)&apos;,
          &apos;Dexamethasone (oral or IM)&apos;,
          &apos;Cool mist therapy&apos;,
          &apos;Minimize agitation&apos;,
          &apos;Observation for progression&apos;
        ]
      },
      ageSpecificConsiderations: {
        &apos;Infants (<1 year)&apos;: [
          &apos;Bronchiolitis (RSV) most common&apos;,
          &apos;Smaller airways more easily obstructed&apos;,
          &apos;Congenital anomalies (vascular rings)&apos;,
          &apos;Formula/feeding aspiration&apos;
        ],
        &apos;Toddlers (1-3 years)&apos;: [
          &apos;Foreign body aspiration peak age&apos;,
          &apos;Croup most common stridor cause&apos;,
          &apos;Viral-induced wheeze&apos;,
          &apos;Early asthma presentation&apos;
        ],
        &apos;School Age (4-12 years)&apos;: [
          &apos;Asthma most common&apos;,
          &apos;Exercise-induced bronchospasm&apos;,
          &apos;Viral respiratory infections&apos;,
          &apos;Pertussis in unvaccinated&apos;
        ],
        &apos;Adolescents/Adults&apos;: [
          &apos;Asthma, exercise-induced&apos;,
          &apos;Vocal cord dysfunction&apos;,
          &apos;Anaphylaxis&apos;,
          &apos;Anxiety-related symptoms&apos;
        ],
        &apos;Elderly&apos;: [
          &apos;COPD exacerbations&apos;,
          &apos;Heart failure (cardiac asthma)&apos;,
          &apos;Aspiration pneumonia&apos;,
          &apos;Medication-induced bronchospasm&apos;
        ]
      },
      severityAssessment: {
        &apos;Mild Wheeze&apos;: [
          &apos;Audible only with stethoscope&apos;,
          &apos;Normal oxygen saturation&apos;,
          &apos;Able to speak in full sentences&apos;,
          &apos;Normal mental status&apos;
        ],
        &apos;Moderate Wheeze&apos;: [
          &apos;Audible without stethoscope&apos;,
          &apos;Mild hypoxia (O2 sat 90-95%)&apos;,
          &apos;Speaks in phrases&apos;,
          &apos;Some respiratory distress&apos;
        ],
        &apos;Severe Wheeze&apos;: [
          &apos;Loud wheeze or silent chest&apos;,
          &apos;Significant hypoxia (O2 sat <90%)&apos;,
          &apos;Single word responses&apos;,
          &apos;Severe respiratory distress, accessory muscles&apos;
        ],
        &apos;Life-Threatening&apos;: [
          &apos;Silent chest with poor air movement&apos;,
          &apos;Cyanosis, altered mental status&apos;,
          &apos;Unable to speak&apos;,
          &apos;Exhaustion, paradoxical breathing&apos;
        ]
      },
      specialConsiderations: {
        &apos;Vocal Cord Dysfunction&apos;: [
          &apos;Inspiratory wheeze&apos;,
          &apos;Often misdiagnosed as asthma&apos;,
          &apos;Triggered by strong emotions, exercise&apos;,
          &apos;Does not respond to bronchodilators&apos;,
          &apos;Laryngoscopy shows paradoxical vocal cord movement&apos;
        ],
        &apos;Exercise-Induced Bronchospasm&apos;: [
          &apos;Wheeze during or after exercise&apos;,
          &apos;Dry, cold air worsens symptoms&apos;,
          &apos;Peak symptoms 5-10 minutes post-exercise&apos;,
          &apos;Responds to pre-exercise bronchodilators&apos;
        ],
        &apos;Occupational Asthma&apos;: [
          &apos;Work-related pattern&apos;,
          &apos;Improvement on weekends/vacations&apos;,
          &apos;Specific occupational triggers&apos;,
          &apos;May become persistent even after exposure cessation&apos;
        ]
      },
      urgency: &apos;immediate&apos;,
      clinicalPearls: [
        &apos;Any stridor is concerning and suggests upper airway obstruction&apos;,
        &apos;Biphasic stridor indicates severe obstruction requiring immediate intervention&apos;,
        &apos;Silent chest with severe distress worse than loud wheeze&apos;,
        &apos;Unilateral wheeze suggests foreign body or focal pathology&apos;,
        &apos;Epiglottitis: avoid throat examination to prevent complete obstruction&apos;,
        &apos;Croup has characteristic barking cough with inspiratory stridor&apos;,
        &apos;Anaphylaxis can present with wheeze before other classic signs&apos;,
        &apos;Foreign body aspiration: sudden onset in toddler with choking history&apos;,
        &apos;Cardiac asthma: wheeze from heart failure, responds to diuretics&apos;,
        &apos;Vocal cord dysfunction often misdiagnosed as refractory asthma&apos;,
        &apos;Exercise-induced bronchospasm peaks 5-10 minutes after exercise&apos;,
        &apos;RSV bronchiolitis: fine crackles and wheeze in infants <2 years&apos;,
        &apos;Pertussis: paroxysmal cough with inspiratory whoop&apos;,
        &apos;Always consider pneumothorax in sudden-onset wheeze with chest pain&apos;
      ]
    },
    &apos;weight loss&apos;: {
      pivotalPoints: [
        &apos;Significant weight loss defined as >5% body weight in 6-12 months without trying&apos;,
        &apos;Malignancy is the most concerning cause and must be systematically excluded&apos;,
        &apos;Age >65 years significantly increases risk of serious underlying pathology&apos;,
        &apos;Associated symptoms guide evaluation toward specific organ systems or diseases&apos;
      ],
      questions: [
        &apos;How much weight have you lost and over what time period?&apos;,
        &apos;What was your highest weight in the past year?&apos;,
        &apos;Have you been trying to lose weight through diet or exercise?&apos;,
        &apos;Any changes in your appetite (increased, decreased, or normal)?&apos;,
        &apos;Any difficulty swallowing or pain when swallowing?&apos;,
        &apos;Any nausea, vomiting, or abdominal pain?&apos;,
        &apos;Any changes in your bowel movements (diarrhea, constipation, blood)?&apos;,
        &apos;Any fever, night sweats, or chills?&apos;,
        &apos;Any unusual fatigue or weakness?&apos;,
        &apos;Any cough, shortness of breath, or chest pain?&apos;,
        &apos;Any lumps, bumps, or swelling anywhere on your body?&apos;,
        &apos;Any changes in your mood (depression, anxiety)?&apos;,
        &apos;Do you drink alcohol? How much and how often?&apos;,
        &apos;Do you smoke or use tobacco products?&apos;,
        &apos;Are you taking any medications or supplements?&apos;,
        &apos;Any family history of cancer or chronic diseases?&apos;,
        &apos;Any recent travel or unusual exposures?&apos;
      ],
      differentials: {
        &apos;Malignancy (Most Serious - 16-36% of cases)&apos;: [
          { condition: &apos;Gastrointestinal Cancers&apos;, likelihood: &apos;high concern&apos;, features: &apos;Colorectal, pancreatic, gastric, esophageal - dysphagia, GI bleeding, abdominal pain&apos; },
          { condition: &apos;Lung Cancer&apos;, likelihood: &apos;high concern&apos;, features: &apos;Smoking history, cough, hemoptysis, chest pain, superior vena cava syndrome&apos; },
          { condition: &apos;Hematologic Malignancies&apos;, likelihood: &apos;moderate concern&apos;, features: &apos;Lymphoma, leukemia - lymphadenopathy, fever, night sweats, bruising&apos; },
          { condition: &apos;Genitourinary Cancers&apos;, likelihood: &apos;moderate concern&apos;, features: &apos;Prostate, kidney, bladder - hematuria, urinary symptoms, flank mass&apos; },
          { condition: &apos;Breast Cancer&apos;, likelihood: &apos;moderate concern&apos;, features: &apos;Women, palpable mass, skin changes, lymphadenopathy&apos; },
          { condition: &apos;Unknown Primary&apos;, likelihood: &apos;moderate concern&apos;, features: &apos;Metastatic disease with occult primary, constitutional symptoms&apos; }
        ],
        &apos;Gastrointestinal Disorders (16-19% of cases)&apos;: [
          { condition: &apos;Peptic Ulcer Disease&apos;, likelihood: &apos;moderate&apos;, features: &apos;Epigastric pain, H. pylori infection, NSAID use, GI bleeding&apos; },
          { condition: &apos;Inflammatory Bowel Disease&apos;, likelihood: &apos;moderate&apos;, features: &apos;Bloody diarrhea, abdominal pain, young adults, extraintestinal manifestations&apos; },
          { condition: &apos;Celiac Disease&apos;, likelihood: &apos;low&apos;, features: &apos;Diarrhea, steatorrhea, abdominal bloating, iron deficiency anemia&apos; },
          { condition: &apos;Chronic Pancreatitis&apos;, likelihood: &apos;low&apos;, features: &apos;Alcohol history, epigastric pain, steatorrhea, diabetes&apos; },
          { condition: &apos;Malabsorption Syndromes&apos;, likelihood: &apos;low&apos;, features: &apos;Steatorrhea, vitamin deficiencies, chronic diarrhea&apos; }
        ],
        &apos;Endocrine/Metabolic (9-14% of cases)&apos;: [
          { condition: &apos;Hyperthyroidism&apos;, likelihood: &apos;moderate&apos;, features: &apos;Heat intolerance, palpitations, tremor, increased appetite, anxiety&apos; },
          { condition: &apos;Diabetes Mellitus (Type 1)&apos;, likelihood: &apos;moderate&apos;, features: &apos;Polyuria, polydipsia, polyphagia, young adults, ketosis&apos; },
          { condition: &apos;Adrenal Insufficiency&apos;, likelihood: &apos;low&apos;, features: &apos;Fatigue, hyperpigmentation, hypotension, hyponatremia&apos; },
          { condition: &apos;Pheochromocytoma&apos;, likelihood: &apos;rare&apos;, features: &apos;Hypertension, palpitations, diaphoresis, headache&apos; }
        ],
        &apos;Infectious Diseases (6-16% of cases)&apos;: [
          { condition: &apos;Tuberculosis&apos;, likelihood: &apos;moderate&apos;, features: &apos;Chronic cough, night sweats, fever, hemoptysis, risk factors&apos; },
          { condition: &apos;HIV/AIDS&apos;, likelihood: &apos;moderate&apos;, features: &apos;Risk factors, opportunistic infections, lymphadenopathy&apos; },
          { condition: &apos;Chronic Hepatitis&apos;, likelihood: &apos;low&apos;, features: &apos;Hepatitis B/C, elevated liver enzymes, jaundice, risk factors&apos; },
          { condition: &apos;Endocarditis&apos;, likelihood: &apos;low&apos;, features: &apos;Fever, heart murmur, positive blood cultures, Janeway lesions&apos; },
          { condition: &apos;Parasitic Infections&apos;, likelihood: &apos;low&apos;, features: &apos;Travel history, eosinophilia, stool parasites&apos; }
        ],
        &apos;Psychiatric/Behavioral (7-23% of cases)&apos;: [
          { condition: &apos;Major Depression&apos;, likelihood: &apos;high&apos;, features: &apos;Depressed mood, anhedonia, sleep disturbance, appetite loss&apos; },
          { condition: &apos;Anorexia Nervosa&apos;, likelihood: &apos;moderate&apos;, features: &apos;Young women, body dysmorphia, restrictive eating, amenorrhea&apos; },
          { condition: &apos;Dementia&apos;, likelihood: &apos;moderate&apos;, features: &apos;Elderly, cognitive decline, forgetting to eat, self-neglect&apos; },
          { condition: &apos;Substance Use Disorder&apos;, likelihood: &apos;moderate&apos;, features: &apos;Alcohol, stimulants, poor nutrition, social dysfunction&apos; }
        ],
        &apos;Medications/Drugs (2-20% of cases)&apos;: [
          { condition: &apos;Medication Side Effects&apos;, likelihood: &apos;high&apos;, features: &apos;Metformin, topiramate, SSRIs, chemotherapy, stimulants&apos; },
          { condition: &apos;Stimulant Use&apos;, likelihood: &apos;moderate&apos;, features: &apos;Amphetamines, cocaine, appetite suppressants, weight loss supplements&apos; },
          { condition: &apos;Polypharmacy&apos;, likelihood: &apos;moderate&apos;, features: &apos;Elderly, multiple medications, drug interactions, poor appetite&apos; }
        ],
        &apos;Chronic Diseases (Variable %)&apos;: [
          { condition: &apos;Chronic Obstructive Pulmonary Disease&apos;, likelihood: &apos;moderate&apos;, features: &apos;Smoking history, dyspnea, chronic cough, hypermetabolism&apos; },
          { condition: &apos;Heart Failure&apos;, likelihood: &apos;moderate&apos;, features: &apos;Dyspnea, edema, poor appetite, cardiac cachexia&apos; },
          { condition: &apos;Chronic Kidney Disease&apos;, likelihood: &apos;low&apos;, features: &apos;Elevated creatinine, uremia, poor appetite, metabolic acidosis&apos; },
          { condition: &apos;Rheumatologic Disorders&apos;, likelihood: &apos;low&apos;, features: &apos;RA, lupus, vasculitis - joint pain, systemic inflammation&apos; }
        ]
      },
      riskStratification: {
        &apos;High Risk Features (Malignancy Concern)&apos;: [
          &apos;Age >65 years&apos;,
          &apos;Weight loss >10% body weight&apos;,
          &apos;Rapid weight loss (>5% in 1 month)&apos;,
          &apos;Male gender&apos;,
          &apos;Smoking history&apos;,
          &apos;Family history of cancer&apos;,
          &apos;Constitutional symptoms (fever, night sweats)&apos;,
          &apos;Abdominal pain with weight loss&apos;,
          &apos;Dysphagia or odynophagia&apos;
        ],
        &apos;Lower Risk Features&apos;: [
          &apos;Age <50 years&apos;,
          &apos;Gradual weight loss over >1 year&apos;,
          &apos;Identifiable psychosocial stressors&apos;,
          &apos;Recent medication changes&apos;,
          &apos;Maintained appetite&apos;,
          &apos;No constitutional symptoms&apos;
        ]
      },
      diagnosticApproach: {
        &apos;Initial Assessment&apos;: [
          &apos;Accurate weight documentation and history&apos;,
          &apos;Complete physical examination&apos;,
          &apos;Review of systems for constitutional symptoms&apos;,
          &apos;Medication and substance use history&apos;,
          &apos;Functional and cognitive assessment&apos;,
          &apos;Depression screening&apos;
        ],
        &apos;First-Line Laboratory Studies&apos;: [
          &apos;Complete blood count with differential&apos;,
          &apos;Comprehensive metabolic panel&apos;,
          &apos;Liver function tests&apos;,
          &apos;Thyroid stimulating hormone&apos;,
          &apos;Erythrocyte sedimentation rate&apos;,
          &apos;C-reactive protein&apos;,
          &apos;Urinalysis&apos;,
          &apos;Fecal occult blood test&apos;
        ],
        &apos;Second-Line Studies (Targeted)&apos;: [
          &apos;Chest X-ray (all patients with unexplained weight loss)&apos;,
          &apos;CT chest/abdomen/pelvis (if malignancy suspected)&apos;,
          &apos;Colonoscopy (age >50 or GI symptoms)&apos;,
          &apos;Upper endoscopy (dysphagia, upper GI symptoms)&apos;,
          &apos;Tuberculin skin test or interferon-gamma release assay&apos;,
          &apos;HIV testing (risk factors present)&apos;
        ],
        &apos;Specialized Testing&apos;: [
          &apos;Tissue-transglutaminase antibodies (celiac disease)&apos;,
          &apos;Cortisol levels (adrenal insufficiency)&apos;,
          &apos;Tumor markers (PSA, CEA, CA 19-9, CA 125)&apos;,
          &apos;Echocardiogram (heart failure suspected)&apos;,
          &apos;Pulmonary function tests (COPD suspected)&apos;
        ]
      },
      alarmSymptoms: [
        &apos;Weight loss >10% body weight over 6 months&apos;,
        &apos;Dysphagia or odynophagia (swallowing difficulty/pain)&apos;,
        &apos;Persistent abdominal pain with weight loss&apos;,
        &apos;Hemoptysis or persistent cough&apos;,
        &apos;Hematochezia or melena (GI bleeding)&apos;,
        &apos;Palpable abdominal mass or lymphadenopathy&apos;,
        &apos;Night sweats with fever and weight loss&apos;,
        &apos;Severe fatigue with weight loss&apos;,
        &apos;New neurologic symptoms with weight loss&apos;,
        &apos;Jaundice with weight loss&apos;
      ],
      ageSpecificConsiderations: {
        &apos;Elderly (>65 years)&apos;: [
          &apos;Higher malignancy risk (up to 60% of cases)&apos;,
          &apos;Medication effects more common&apos;,
          &apos;Depression often overlooked&apos;,
          &apos;Functional decline and self-neglect&apos;,
          &apos;Polypharmacy interactions&apos;,
          &apos;Dental problems affecting nutrition&apos;
        ],
        &apos;Middle Age (40-65 years)&apos;: [
          &apos;Malignancy screening age-appropriate&apos;,
          &apos;Stress-related eating disorders&apos;,
          &apos;Medication-induced weight loss&apos;,
          &apos;Early chronic disease manifestations&apos;,
          &apos;Substance use disorders&apos;
        ],
        &apos;Young Adults (18-40 years)&apos;: [
          &apos;Eating disorders more common&apos;,
          &apos;Infectious diseases (TB, HIV)&apos;,
          &apos;Inflammatory bowel disease&apos;,
          &apos;Hyperthyroidism&apos;,
          &apos;Type 1 diabetes mellitus&apos;,
          &apos;Psychiatric disorders&apos;
        ]
      },
      physicalExamFindings: {
        &apos;General Appearance&apos;: [
          &apos;Cachexia, muscle wasting&apos;,
          &apos;Temporal wasting&apos;,
          &apos;Skin turgor and hydration status&apos;,
          &apos;Pallor (anemia)&apos;,
          &apos;Jaundice (liver disease, malignancy)&apos;
        ],
        &apos;Lymph Node Examination&apos;: [
          &apos;Cervical, supraclavicular, axillary, inguinal&apos;,
          &apos;Size, consistency, mobility&apos;,
          &apos;Virchow\&apos;s node (left supraclavicular)&apos;,
          &apos;Sister Mary Joseph nodule (umbilical)&apos;
        ],
        &apos;Abdominal Examination&apos;: [
          &apos;Hepatomegaly, splenomegaly&apos;,
          &apos;Abdominal masses&apos;,
          &apos;Ascites&apos;,
          &apos;Bowel sounds&apos;,
          &apos;Tenderness and guarding&apos;
        ],
        &apos;Other Key Findings&apos;: [
          &apos;Oral thrush (immunosuppression)&apos;,
          &apos;Skin lesions or rashes&apos;,
          &apos;Heart murmurs&apos;,
          &apos;Respiratory findings&apos;,
          &apos;Neurologic abnormalities&apos;
        ]
      },
      workupAlgorithm: {
        &apos;Step 1: History and Physical&apos;: [
          &apos;Document weight loss percentage and timeline&apos;,
          &apos;Complete review of systems&apos;,
          &apos;Medication and substance history&apos;,
          &apos;Comprehensive physical examination&apos;
        ],
        &apos;Step 2: Initial Laboratory Studies&apos;: [
          &apos;CBC, CMP, LFTs, TSH, ESR, CRP, UA, FOBT&apos;,
          &apos;Chest X-ray&apos;,
          &apos;Age-appropriate cancer screening&apos;
        ],
        &apos;Step 3: If Initial Workup Normal&apos;: [
          &apos;Consider psychiatric evaluation&apos;,
          &apos;Medication review&apos;,
          &apos;Nutritional assessment&apos;,
          &apos;Functional evaluation&apos;,
          &apos;Trial of treatment for reversible causes&apos;
        ],
        &apos;Step 4: If Concerning Features&apos;: [
          &apos;CT chest/abdomen/pelvis&apos;,
          &apos;Endoscopic evaluation&apos;,
          &apos;Tissue biopsy if masses identified&apos;,
          &apos;Specialized testing based on findings&apos;
        ]
      },
      treatmentApproach: {
        &apos;Treat Underlying Cause&apos;: [
          &apos;Malignancy: Oncology referral, staging, treatment&apos;,
          &apos;Hyperthyroidism: Antithyroid medications, radioiodine&apos;,
          &apos;Depression: Antidepressants, psychotherapy&apos;,
          &apos;Infections: Targeted antimicrobial therapy&apos;,
          &apos;Medications: Discontinue or substitute offending agents&apos;
        ],
        &apos;Symptomatic Support&apos;: [
          &apos;Nutritional consultation&apos;,
          &apos;Caloric supplementation&apos;,
          &apos;Appetite stimulants (megestrol, mirtazapine)&apos;,
          &apos;Social services if needed&apos;,
          &apos;Monitoring and follow-up&apos;
        ],
        &apos;When Cause Unknown&apos;: [
          &apos;Close monitoring with serial weights&apos;,
          &apos;Nutritional optimization&apos;,
          &apos;Repeat evaluation in 3-6 months&apos;,
          &apos;Consider empiric trial of appetite stimulants&apos;,
          &apos;Psychological support&apos;
        ]
      },
      redFlags: [
        &apos;Age >65 with unexplained weight loss&apos;,
        &apos;Weight loss >10% body weight&apos;,
        &apos;Constitutional symptoms (fever, night sweats)&apos;,
        &apos;Dysphagia or persistent abdominal pain&apos;,
        &apos;Smoking history with weight loss&apos;,
        &apos;Family history of cancer&apos;,
        &apos;Palpable masses or lymphadenopathy&apos;,
        &apos;Hemoptysis or GI bleeding&apos;,
        &apos;Rapid progression over weeks&apos;,
        &apos;Failure to respond to treatment of identified cause&apos;
      ],
      urgency: &apos;high&apos;,
      clinicalPearls: [
        &apos;Unintentional weight loss >5% body weight over 6-12 months requires investigation&apos;,
        &apos;Malignancy found in 16-36% of cases with unexplained weight loss&apos;,
        &apos;Age >65 years significantly increases cancer risk&apos;,
        &apos;Normal appetite with weight loss suggests malabsorption or hyperthyroidism&apos;,
        &apos;Weight loss with increased appetite suggests diabetes or hyperthyroidism&apos;,
        &apos;Depression is often overlooked, especially in elderly patients&apos;,
        &apos;Medication review is essential - many drugs cause weight loss&apos;,
        &apos;Constitutional symptoms (fever, night sweats) increase malignancy concern&apos;,
        &apos;Virchow\&apos;s node (left supraclavicular) suggests GI malignancy&apos;,
        &apos;Normal initial workup does not rule out serious disease&apos;,
        &apos;Close follow-up essential even if initial evaluation negative&apos;,
        &apos;Consider occult malignancy if weight loss persists without explanation&apos;,
        &apos;Functional decline in elderly often contributes to weight loss&apos;,
        &apos;Dental problems and swallowing difficulties often overlooked in elderly&apos;
      ]
    },
    &apos;sore throat&apos;: {
      pivotalPoints: [
        &apos;Centor criteria help distinguish bacterial (strep) from viral pharyngitis&apos;,
        &apos;Presence of exudate does not reliably indicate bacterial infection&apos;,
        &apos;Age significantly influences likelihood of Group A strep infection&apos;,
        &apos;Red flag symptoms identify serious complications requiring urgent evaluation&apos;
      ],
      questions: [
        &apos;When did your sore throat start and how severe is it?&apos;,
        &apos;Do you have fever? What is your highest temperature?&apos;,
        &apos;Do you see any white patches or pus on your tonsils?&apos;,
        &apos;Are your lymph nodes swollen or tender in your neck?&apos;,
        &apos;Do you have a cough?&apos;,
        &apos;Any runny nose, sneezing, or nasal congestion?&apos;,
        &apos;Any difficulty swallowing or opening your mouth fully?&apos;,
        &apos;Any voice changes or hoarseness?&apos;,
        &apos;Any skin rash anywhere on your body?&apos;,
        &apos;Any nausea, vomiting, or abdominal pain?&apos;,
        &apos;Have you been around anyone else who is sick?&apos;,
        &apos;Any recent travel or new exposures?&apos;,
        &apos;Are you sexually active? Any oral sexual contact recently?&apos;,
        &apos;Do you smoke or use tobacco products?&apos;,
        &apos;Any history of recurrent strep throat?&apos;,
        &apos;Are you taking any medications?&apos;,
        &apos;How old are you? (Age affects strep likelihood)&apos;
      ],
      differentials: {
        &apos;Viral Pharyngitis (Most Common - 85-95%)&apos;: [
          { condition: &apos;Common Cold (Rhinovirus)&apos;, likelihood: &apos;very high&apos;, features: &apos;Gradual onset, rhinorrhea, cough, low-grade fever, malaise&apos; },
          { condition: &apos;Influenza&apos;, likelihood: &apos;high&apos;, features: &apos;Sudden onset, high fever, myalgias, headache, dry cough&apos; },
          { condition: &apos;Adenovirus&apos;, likelihood: &apos;moderate&apos;, features: &apos;Pharyngoconjunctival fever, exudate present, lymphadenopathy&apos; },
          { condition: &apos;Epstein-Barr Virus (Mono)&apos;, likelihood: &apos;moderate&apos;, features: &apos;Severe fatigue, lymphadenopathy, splenomegaly, atypical lymphocytes&apos; },
          { condition: &apos;Parainfluenza&apos;, likelihood: &apos;moderate&apos;, features: &apos;Croup in children, gradual onset, hoarseness&apos; },
          { condition: &apos;Coronavirus (including COVID-19)&apos;, likelihood: &apos;moderate&apos;, features: &apos;Sore throat, fever, cough, anosmia, exposure history&apos; }
        ],
        &apos;Bacterial Pharyngitis&apos;: [
          { condition: &apos;Group A Streptococcus (Strep Throat)&apos;, likelihood: &apos;moderate&apos;, features: &apos;Sudden onset, high fever, exudate, tender lymphadenopathy, no cough&apos; },
          { condition: &apos;Group C/G Streptococcus&apos;, likelihood: &apos;low&apos;, features: &apos;Similar to Group A, food handlers, sexual transmission possible&apos; },
          { condition: &apos;Neisseria gonorrhoeae&apos;, likelihood: &apos;low&apos;, features: &apos;Sexual transmission, may be asymptomatic, pharyngeal culture needed&apos; },
          { condition: &apos;Corynebacterium diphtheriae&apos;, likelihood: &apos;rare&apos;, features: &apos;Gray pseudomembrane, "bull neck", unvaccinated, toxin-mediated&apos; },
          { condition: &apos;Fusobacterium (Vincent\&apos;s Angina)&apos;, likelihood: &apos;rare&apos;, features: &apos;Unilateral ulcerative pharyngitis, poor dental hygiene, anaerobic&apos; }
        ],
        &apos;Serious Complications/Red Flags&apos;: [
          { condition: &apos;Peritonsillar Abscess&apos;, likelihood: &apos;low but serious&apos;, features: &apos;Severe unilateral pain, trismus, muffled voice, uvular deviation&apos; },
          { condition: &apos;Retropharyngeal Abscess&apos;, likelihood: &apos;rare but critical&apos;, features: &apos;Severe pain, drooling, neck stiffness, inspiratory stridor&apos; },
          { condition: &apos;Epiglottitis&apos;, likelihood: &apos;rare but critical&apos;, features: &apos;Rapid onset, drooling, stridor, tripod position, airway emergency&apos; },
          { condition: &apos;Ludwig\&apos;s Angina&apos;, likelihood: &apos;rare but critical&apos;, features: &apos;Floor of mouth cellulitis, woody induration, airway compromise&apos; },
          { condition: &apos;Lemierre Syndrome&apos;, likelihood: &apos;very rare&apos;, features: &apos;Fusobacterium, thrombophlebitis, septic emboli, post-pharyngitis&apos; }
        ],
        &apos;Non-Infectious Causes&apos;: [
          { condition: &apos;Gastroesophageal Reflux Disease&apos;, likelihood: &apos;moderate&apos;, features: &apos;Chronic symptoms, worse in morning, heartburn, hoarseness&apos; },
          { condition: &apos;Allergic Rhinitis/Post-nasal Drip&apos;, likelihood: &apos;moderate&apos;, features: &apos;Seasonal pattern, nasal symptoms, throat clearing&apos; },
          { condition: &apos;Vocal Cord Irritation&apos;, likelihood: &apos;moderate&apos;, features: &apos;Voice overuse, smoking, chemical irritants, hoarseness&apos; },
          { condition: &apos;Kawasaki Disease&apos;, likelihood: &apos;rare&apos;, features: &apos;Children <5, fever >5 days, strawberry tongue, rash, lymphadenopathy&apos; },
          { condition: &apos;Behçet\&apos;s Disease&apos;, likelihood: &apos;rare&apos;, features: &apos;Recurrent oral ulcers, genital ulcers, eye involvement, HLA-B51&apos; }
        ]
      },
      centorCriteria: {
        &apos;Modified Centor Score (FeverPAIN)&apos;: [
          &apos;Fever >38°C (100.4°F) in past 24 hours (1 point)&apos;,
          &apos;Purulence/exudate on tonsils (1 point)&apos;,
          &apos;Attend rapidly within 3 days of onset (1 point)&apos;,
          &apos;Inflamed tonsils (severely inflamed = 1 point)&apos;,
          &apos;No cough or coryza (1 point)&apos;
        ],
        &apos;Score Interpretation&apos;: [
          &apos;0-1 points: <10% chance strep - no testing or antibiotics&apos;,
          &apos;2-3 points: 11-35% chance strep - consider rapid strep test&apos;,
          &apos;4-5 points: 51-65% chance strep - test and treat if positive&apos;
        ],
        &apos;Original Centor Criteria&apos;: [
          &apos;Tonsillar exudate (1 point)&apos;,
          &apos;Tender anterior cervical lymphadenopathy (1 point)&apos;,
          &apos;Fever >38°C (1 point)&apos;,
          &apos;Absence of cough (1 point)&apos;
        ]
      },
      ageAdjustments: {
        &apos;Age-Specific Risk&apos;: [
          &apos;Age 3-14: Highest risk for Group A strep (add 1 point)&apos;,
          &apos;Age 15-44: Moderate risk (0 points)&apos;,
          &apos;Age ≥45: Lower risk (subtract 1 point)&apos;
        ],
        &apos;Pediatric Considerations&apos;: [
          &apos;Strep more common in school-age children&apos;,
          &apos;Viral causes predominant in <3 years old&apos;,
          &apos;PANDAS (strep-associated neuropsychiatric disorders)&apos;,
          &apos;Scarlet fever (strep with erythrogenic toxin)&apos;
        ]
      },
      redFlags: [
        &apos;Difficulty swallowing or breathing (airway compromise)&apos;,
        &apos;Drooling or inability to handle secretions&apos;,
        &apos;Severe unilateral throat pain with trismus (peritonsillar abscess)&apos;,
        &apos;Muffled or "hot potato" voice&apos;,
        &apos;Neck stiffness or limited neck movement&apos;,
        &apos;Inspiratory stridor (upper airway obstruction)&apos;,
        &apos;High fever with toxic appearance&apos;,
        &apos;Immunocompromised patient with severe pharyngitis&apos;,
        &apos;Persistent fever despite appropriate antibiotic treatment&apos;
      ],
      diagnosticApproach: {
        &apos;Clinical Decision Making&apos;: [
          &apos;Apply Centor/FeverPAIN criteria&apos;,
          &apos;Age-adjusted risk assessment&apos;,
          &apos;Consider local strep prevalence&apos;,
          &apos;Evaluate for complications&apos;
        ],
        &apos;Testing Strategies&apos;: [
          &apos;Rapid Antigen Detection Test (RADT): 15-minute results, 85-95% sensitive&apos;,
          &apos;Throat culture: Gold standard, 24-48h results, 95-99% sensitive&apos;,
          &apos;Molecular testing (PCR): Rapid, highly sensitive and specific&apos;,
          &apos;No testing needed if viral syndrome clear or low probability&apos;
        ],
        &apos;When to Test&apos;: [
          &apos;Centor/FeverPAIN score ≥2&apos;,
          &apos;Clinical suspicion of strep despite low score&apos;,
          &apos;Outbreak investigation&apos;,
          &apos;High-risk patient (rheumatic fever history)&apos;
        ],
        &apos;When NOT to Test&apos;: [
          &apos;Clear viral syndrome (rhinorrhea, cough, conjunctivitis)&apos;,
          &apos;Very low probability (Centor 0-1)&apos;,
          &apos;Children <3 years (strep rare, rheumatic fever very rare)&apos;
        ]
      },
      treatmentApproach: {
        &apos;Group A Strep Treatment&apos;: [
          &apos;First-line: Penicillin V 500mg BID x 10 days (adults)&apos;,
          &apos;Penicillin allergy: Azithromycin 500mg x 1 day, then 250mg x 4 days&apos;,
          &apos;Alternative: Cephalexin, clindamycin, clarithromycin&apos;,
          &apos;Avoid macrolides if local resistance >10%&apos;
        ],
        &apos;Supportive Care (All Patients)&apos;: [
          &apos;Analgesics: Acetaminophen, ibuprofen&apos;,
          &apos;Throat lozenges, warm salt water gargles&apos;,
          &apos;Adequate hydration&apos;,
          &apos;Voice rest if hoarseness present&apos;,
          &apos;Humidification&apos;
        ],
        &apos;Viral Pharyngitis&apos;: [
          &apos;Symptomatic treatment only&apos;,
          &apos;No antibiotics indicated&apos;,
          &apos;Return if symptoms worsen or persist >7-10 days&apos;,
          &apos;Isolation until fever-free 24 hours&apos;
        ],
        &apos;Complicated Cases&apos;: [
          &apos;Peritonsillar abscess: ENT consultation, drainage, antibiotics&apos;,
          &apos;Retropharyngeal abscess: Emergency ENT, possible airway management&apos;,
          &apos;Epiglottitis: Emergency airway management, IV antibiotics&apos;
        ]
      },
      complications: {
        &apos;Suppurative (Local)&apos;: [
          &apos;Peritonsillar abscess (most common)&apos;,
          &apos;Retropharyngeal abscess&apos;,
          &apos;Parapharyngeal abscess&apos;,
          &apos;Cervical lymphadenitis&apos;,
          &apos;Otitis media, sinusitis&apos;
        ],
        &apos;Non-Suppurative (Immune-Mediated)&apos;: [
          &apos;Acute rheumatic fever (rare in developed countries)&apos;,
          &apos;Post-streptococcal glomerulonephritis&apos;,
          &apos;PANDAS (pediatric autoimmune neuropsychiatric disorders)&apos;,
          &apos;Toxic shock syndrome (rare)&apos;
        ]
      },
      specialPopulations: {
        &apos;Immunocompromised&apos;: [
          &apos;Higher risk of atypical organisms&apos;,
          &apos;Candida, HSV, CMV, EBV&apos;,
          &apos;More severe courses&apos;,
          &apos;Consider broader testing and treatment&apos;
        ],
        &apos;Pregnant Women&apos;: [
          &apos;Safe antibiotics: Penicillin, amoxicillin, cephalexin&apos;,
          &apos;Avoid: Fluoroquinolones, tetracyclines&apos;,
          &apos;Group B strep colonization consideration&apos;
        ],
        &apos;Elderly&apos;: [
          &apos;Atypical presentations common&apos;,
          &apos;Higher complication risk&apos;,
          &apos;Consider broader differential&apos;,
          &apos;Medication interactions&apos;
        ]
      },
      differentialClues: {
        &apos;Strep Throat Features&apos;: [
          &apos;Sudden onset&apos;,
          &apos;High fever (>101°F)&apos;,
          &apos;Severe sore throat&apos;,
          &apos;Tender cervical lymphadenopathy&apos;,
          &apos;Tonsillar exudate&apos;,
          &apos;Absence of cough or rhinorrhea&apos;,
          &apos;Petechial rash on palate&apos;
        ],
        &apos;Viral Features&apos;: [
          &apos;Gradual onset&apos;,
          &apos;Low-grade fever or no fever&apos;,
          &apos;Cough, rhinorrhea, conjunctivitis&apos;,
          &apos;Hoarseness&apos;,
          &apos;Myalgias (influenza)&apos;,
          &apos;Multiple family members affected&apos;
        ],
        &apos;Mononucleosis Features&apos;: [
          &apos;Severe fatigue lasting weeks&apos;,
          &apos;Posterior cervical lymphadenopathy&apos;,
          &apos;Splenomegaly&apos;,
          &apos;Atypical lymphocytes on CBC&apos;,
          &apos;Positive monospot or EBV titers&apos;
        ]
      },
      urgency: &apos;varies&apos;,
      clinicalPearls: [
        &apos;Most sore throats (85-95%) are viral and self-limiting&apos;,
        &apos;Centor criteria help guide testing and treatment decisions&apos;,
        &apos;Presence of cough makes strep throat less likely&apos;,
        &apos;Exudate can be present in both viral and bacterial pharyngitis&apos;,
        &apos;Negative rapid strep test in children should be followed by throat culture&apos;,
        &apos;Adults with negative rapid strep test rarely need throat culture&apos;,
        &apos;Penicillin resistance has never been documented in Group A strep&apos;,
        &apos;Scarlet fever is strep throat with erythrogenic toxin production&apos;,
        &apos;Rheumatic fever prevention requires 10 days of penicillin treatment&apos;,
        &apos;Post-streptococcal glomerulonephritis cannot be prevented by antibiotics&apos;,
        &apos;Recurrent strep throat may indicate carrier state or reinfection&apos;,
        &apos;Family pets do not transmit Group A strep to humans&apos;,
        &apos;Contact precautions for 24 hours after starting appropriate antibiotics&apos;,
        &apos;Mononucleosis + amoxicillin often causes characteristic rash&apos;
      ]
    },
    &apos;rash&apos;: {
      pivotalPoints: [
        &apos;Morphology and distribution pattern are key to differential diagnosis&apos;,
        &apos;Systemic symptoms distinguish benign rashes from serious systemic disease&apos;,
        &apos;Medication history is crucial as drug reactions are common and potentially serious&apos;,
        &apos;Fever with petechial rash requires immediate evaluation for meningococcemia&apos;
      ],
      questions: [
        &apos;When did the rash first appear and how has it changed?&apos;,
        &apos;Where on your body did the rash start and where has it spread?&apos;,
        &apos;What does the rash look like (flat spots, raised bumps, blisters, scaling)?&apos;,
        &apos;Is the rash itchy, painful, or burning?&apos;,
        &apos;Any fever, chills, or feeling generally unwell?&apos;,
        &apos;Have you started any new medications recently?&apos;,
        &apos;Any known allergies to medications, foods, or environmental factors?&apos;,
        &apos;Have you been exposed to anyone with a rash or illness?&apos;,
        &apos;Any recent travel, especially to tropical areas?&apos;,
        &apos;Any recent insect bites or animal exposures?&apos;,
        &apos;Have you used any new soaps, detergents, cosmetics, or skin products?&apos;,
        &apos;Any joint pain, muscle aches, or headache?&apos;,
        &apos;Any difficulty breathing, swallowing, or tongue swelling?&apos;,
        &apos;For children: Are immunizations up to date?&apos;,
        &apos;Any recent sun exposure or outdoor activities?&apos;,
        &apos;Any family history of skin conditions or autoimmune diseases?&apos;,
        &apos;Are you sexually active? Any genital lesions?&apos;
      ],
      differentials: {
        &apos;Life-Threatening Rashes (Immediate Evaluation)&apos;: [
          { condition: &apos;Meningococcemia&apos;, likelihood: &apos;rare but critical&apos;, features: &apos;Petechial rash, fever, altered mental status, rapidly progressive&apos; },
          { condition: &apos;Stevens-Johnson Syndrome/TEN&apos;, likelihood: &apos;rare but critical&apos;, features: &apos;Medication-induced, mucosal involvement, skin sloughing, fever&apos; },
          { condition: &apos;Anaphylaxis&apos;, likelihood: &apos;moderate&apos;, features: &apos;Urticaria, angioedema, respiratory distress, hypotension, recent exposure&apos; },
          { condition: &apos;Necrotizing Fasciitis&apos;, likelihood: &apos;rare&apos;, features: &apos;Rapidly spreading erythema, severe pain, systemic toxicity&apos; },
          { condition: &apos;Staphylococcal Scalded Skin Syndrome&apos;, likelihood: &apos;rare&apos;, features: &apos;Children, fever, widespread erythema, skin exfoliation&apos; }
        ],
        &apos;Infectious Rashes&apos;: [
          { condition: &apos;Viral Exanthem&apos;, likelihood: &apos;very high&apos;, features: &apos;Fever, maculopapular, children, URI symptoms, self-limiting&apos; },
          { condition: &apos;Cellulitis&apos;, likelihood: &apos;high&apos;, features: &apos;Unilateral erythema, warmth, tenderness, lymphangitis, fever&apos; },
          { condition: &apos;Impetigo&apos;, likelihood: &apos;moderate&apos;, features: &apos;Honey-crusted lesions, children, superficial, contagious&apos; },
          { condition: &apos;Herpes Zoster (Shingles)&apos;, likelihood: &apos;moderate&apos;, features: &apos;Dermatomal distribution, vesicles, pain before rash, unilateral&apos; },
          { condition: &apos;Erythema Migrans (Lyme)&apos;, likelihood: &apos;low&apos;, features: &apos;Bull\&apos;s eye rash, tick bite history, endemic area, expanding&apos; },
          { condition: &apos;Scabies&apos;, likelihood: &apos;moderate&apos;, features: &apos;Intense itching, burrows, web spaces, family clusters&apos; }
        ],
        &apos;Drug Reactions&apos;: [
          { condition: &apos;Maculopapular Drug Eruption&apos;, likelihood: &apos;high&apos;, features: &apos;Symmetric distribution, trunk/extremities, new medication 1-3 weeks&apos; },
          { condition: &apos;Urticaria (Drug-Induced)&apos;, likelihood: &apos;high&apos;, features: &apos;Raised wheals, itchy, evanescent, recent medication or food&apos; },
          { condition: &apos;Fixed Drug Eruption&apos;, likelihood: &apos;low&apos;, features: &apos;Same location with re-exposure, hyperpigmentation, single/few lesions&apos; },
          { condition: &apos;DRESS Syndrome&apos;, likelihood: &apos;rare&apos;, features: &apos;Fever, eosinophilia, lymphadenopathy, organ involvement, anticonvulsants&apos; }
        ],
        &apos;Autoimmune/Inflammatory Rashes&apos;: [
          { condition: &apos;Systemic Lupus Erythematosus&apos;, likelihood: &apos;low&apos;, features: &apos;Malar rash, photosensitivity, joint pain, ANA positive, young women&apos; },
          { condition: &apos;Psoriasis&apos;, likelihood: &apos;moderate&apos;, features: &apos;Silvery scale, well-demarcated plaques, elbows/knees, nail changes&apos; },
          { condition: &apos;Eczema/Atopic Dermatitis&apos;, likelihood: &apos;high&apos;, features: &apos;Chronic, itchy, flexural areas, family history, dry skin&apos; },
          { condition: &apos;Contact Dermatitis&apos;, likelihood: &apos;high&apos;, features: &apos;Linear pattern, new exposure, vesicles, localized distribution&apos; }
        ],
        &apos;Childhood Exanthems&apos;: [
          { condition: &apos;Roseola&apos;, likelihood: &apos;high&apos;, features: &apos;High fever 3-5 days, then rash as fever breaks, infants&apos; },
          { condition: &apos;Fifth Disease (Parvovirus B19)&apos;, likelihood: &apos;moderate&apos;, features: &apos;Slapped cheek appearance, lacy reticular rash, school-age children&apos; },
          { condition: &apos;Hand, Foot, and Mouth Disease&apos;, likelihood: &apos;moderate&apos;, features: &apos;Vesicles on palms/soles, oral ulcers, coxsackievirus, daycare&apos; },
          { condition: &apos;Chickenpox (Varicella)&apos;, likelihood: &apos;low&apos;, features: &apos;Vesicles in different stages, centripetal distribution, fever&apos; },
          { condition: &apos;Measles&apos;, likelihood: &apos;rare&apos;, features: &apos;Koplik spots, cough/coryza/conjunctivitis, unvaccinated&apos; }
        ],
        &apos;Vascular/Purpuric Rashes&apos;: [
          { condition: &apos;Idiopathic Thrombocytopenic Purpura&apos;, likelihood: &apos;low&apos;, features: &apos;Petechiae, bleeding, low platelet count, no other symptoms&apos; },
          { condition: &apos;Henoch-Schönlein Purpura&apos;, likelihood: &apos;low&apos;, features: &apos;Palpable purpura, children, arthritis, abdominal pain, nephritis&apos; },
          { condition: &apos;Vasculitis&apos;, likelihood: &apos;rare&apos;, features: &apos;Palpable purpura, systemic symptoms, elevated ESR/CRP&apos; },
          { condition: &apos;Rocky Mountain Spotted Fever&apos;, likelihood: &apos;rare&apos;, features: &apos;Petechial rash, wrists/ankles spreading centrally, tick exposure&apos; }
        ]
      },
      morphologyClassification: {
        &apos;Primary Lesions&apos;: [
          &apos;Macule: Flat, <1cm, color change only&apos;,
          &apos;Patch: Flat, >1cm, color change only&apos;,
          &apos;Papule: Raised, <1cm, solid&apos;,
          &apos;Plaque: Raised, >1cm, flat-topped&apos;,
          &apos;Nodule: Raised, <1cm, deep&apos;,
          &apos;Vesicle: Fluid-filled, <1cm&apos;,
          &apos;Bulla: Fluid-filled, >1cm&apos;,
          &apos;Pustule: Pus-filled&apos;,
          &apos;Wheal: Raised, edematous, evanescent&apos;
        ],
        &apos;Secondary Lesions&apos;: [
          &apos;Scale: Flaking skin&apos;,
          &apos;Crust: Dried serum/blood&apos;,
          &apos;Erosion: Superficial skin loss&apos;,
          &apos;Ulcer: Deep skin loss&apos;,
          &apos;Excoriation: Scratch marks&apos;,
          &apos;Lichenification: Thickened skin from rubbing&apos;
        ]
      },
      distributionPatterns: {
        &apos;Characteristic Distributions&apos;: [
          &apos;Flexural: Eczema, psoriasis inverse&apos;,
          &apos;Extensor surfaces: Psoriasis, dermatitis herpetiformis&apos;,
          &apos;Sun-exposed areas: Photodermatitis, lupus&apos;,
          &apos;Dermatomal: Herpes zoster&apos;,
          &apos;Palms/soles: Syphilis, hand-foot-mouth, Rocky Mountain spotted fever&apos;,
          &apos;Centripetal: Chickenpox (starts centrally)&apos;,
          &apos;Centrifugal: RMSF (starts peripherally)&apos;
        ]
      },
      redFlags: [
        &apos;Fever with petechial rash (meningococcemia)&apos;,
        &apos;Mucosal involvement with blistering (SJS/TEN)&apos;,
        &apos;Rapidly spreading erythema with severe pain (necrotizing fasciitis)&apos;,
        &apos;Respiratory distress with urticaria (anaphylaxis)&apos;,
        &apos;Skin sloughing or Nikolsky sign positive&apos;,
        &apos;Rash with altered mental status&apos;,
        &apos;Purpura with bleeding symptoms&apos;,
        &apos;Rash with severe systemic symptoms&apos;,
        &apos;Target lesions with mucosal involvement&apos;
      ],
      emergencyRashes: {
        &apos;Meningococcemia&apos;: [
          &apos;Petechial rash that doesn\&apos;t blanch&apos;,
          &apos;Rapidly progressive&apos;,
          &apos;Fever, altered mental status&apos;,
          &apos;Medical emergency - immediate antibiotics&apos;
        ],
        &apos;Stevens-Johnson Syndrome/TEN&apos;: [
          &apos;Medication-induced (typically 1-3 weeks after start)&apos;,
          &apos;Target lesions, mucosal involvement&apos;,
          &apos;Skin detachment >30% (TEN) vs <10% (SJS)&apos;,
          &apos;Discontinue offending agent, supportive care&apos;
        ],
        &apos;Anaphylaxis&apos;: [
          &apos;Rapid onset urticaria&apos;,
          &apos;Angioedema (lips, tongue, throat)&apos;,
          &apos;Respiratory distress, hypotension&apos;,
          &apos;Epinephrine immediately&apos;
        ]
      },
      diagnosticApproach: {
        &apos;Clinical Assessment&apos;: [
          &apos;Detailed description of morphology&apos;,
          &apos;Distribution pattern and progression&apos;,
          &apos;Associated symptoms&apos;,
          &apos;Medication and exposure history&apos;,
          &apos;Family and travel history&apos;
        ],
        &apos;Laboratory Studies (Selected Cases)&apos;: [
          &apos;Complete blood count (infection, hematologic)&apos;,
          &apos;Comprehensive metabolic panel&apos;,
          &apos;ESR/CRP (inflammatory conditions)&apos;,
          &apos;ANA (autoimmune conditions)&apos;,
          &apos;Viral titers (if indicated)&apos;
        ],
        &apos;Specialized Testing&apos;: [
          &apos;KOH preparation (fungal infections)&apos;,
          &apos;Tzanck smear (viral infections)&apos;,
          &apos;Bacterial culture (impetigo, cellulitis)&apos;,
          &apos;Skin biopsy (unclear diagnosis)&apos;,
          &apos;Patch testing (contact dermatitis)&apos;
        ]
      },
      commonMedications: {
        &apos;High-Risk Medications for Severe Reactions&apos;: [
          &apos;Antibiotics: Penicillins, sulfonamides, quinolones&apos;,
          &apos;Anticonvulsants: Phenytoin, carbamazepine, lamotrigine&apos;,
          &apos;Allopurinol&apos;,
          &apos;NSAIDs&apos;,
          &apos;Contrast agents&apos;
        ],
        &apos;Common Drug Reaction Patterns&apos;: [
          &apos;Immediate (minutes-hours): Urticaria, anaphylaxis&apos;,
          &apos;Delayed (days-weeks): Maculopapular eruptions&apos;,
          &apos;Late (weeks-months): SJS/TEN, DRESS syndrome&apos;
        ]
      },
      treatmentApproach: {
        &apos;Symptomatic Relief&apos;: [
          &apos;Antihistamines for itching&apos;,
          &apos;Topical corticosteroids (mild-moderate)&apos;,
          &apos;Cool compresses&apos;,
          &apos;Moisturizers for dry skin&apos;,
          &apos;Avoid irritants and triggers&apos;
        ],
        &apos;Specific Treatments&apos;: [
          &apos;Viral: Supportive care, antivirals for severe cases&apos;,
          &apos;Bacterial: Topical/systemic antibiotics&apos;,
          &apos;Fungal: Antifungal medications&apos;,
          &apos;Allergic: Remove allergen, antihistamines, steroids&apos;,
          &apos;Autoimmune: Immunosuppressive therapy&apos;
        ],
        &apos;Emergency Management&apos;: [
          &apos;Anaphylaxis: Epinephrine, IV steroids, H1/H2 blockers&apos;,
          &apos;SJS/TEN: Discontinue drug, supportive care, consider IVIG&apos;,
          &apos;Meningococcemia: Immediate antibiotics, supportive care&apos;
        ]
      },
      ageGenderFactors: {
        &apos;Infants/Toddlers&apos;: [&apos;Viral exanthems&apos;, &apos;Eczema&apos;, &apos;Diaper dermatitis&apos;, &apos;Roseola&apos;],
        &apos;School-Age Children&apos;: [&apos;Viral exanthems&apos;, &apos;Impetigo&apos;, &apos;Fifth disease&apos;, &apos;Contact dermatitis&apos;],
        &apos;Adolescents&apos;: [&apos;Acne&apos;, &apos;Viral exanthems&apos;, &apos;Drug reactions&apos;, &apos;Contact dermatitis&apos;],
        &apos;Young Adults&apos;: [&apos;Drug reactions&apos;, &apos;STI-related rashes&apos;, &apos;Autoimmune conditions&apos;, &apos;Contact dermatitis&apos;],
        &apos;Middle Age&apos;: [&apos;Drug reactions&apos;, &apos;Herpes zoster&apos;, &apos;Psoriasis&apos;, &apos;Autoimmune conditions&apos;],
        &apos;Elderly&apos;: [&apos;Drug reactions&apos;, &apos;Herpes zoster&apos;, &apos;Stasis dermatitis&apos;, &apos;Bullous pemphigoid&apos;]
      },
      specialConsiderations: {
        &apos;Immunocompromised Patients&apos;: [
          &apos;Higher risk of atypical presentations&apos;,
          &apos;Opportunistic infections&apos;,
          &apos;More severe drug reactions&apos;,
          &apos;Kaposi sarcoma (HIV patients)&apos;
        ],
        &apos;Pregnancy&apos;: [
          &apos;Avoid teratogenic medications&apos;,
          &apos;PUPPP (pruritic urticarial papules and plaques)&apos;,
          &apos;Intrahepatic cholestasis of pregnancy&apos;,
          &apos;Pemphigoid gestationis&apos;
        ],
        &apos;Travel-Related&apos;: [
          &apos;Tropical diseases (dengue, chikungunya)&apos;,
          &apos;Leishmaniasis&apos;,
          &apos;Cutaneous larva migrans&apos;,
          &apos;Tick-borne diseases&apos;
        ]
      },
      urgency: &apos;varies&apos;,
      clinicalPearls: [
        &apos;Fever + petechial rash = meningococcemia until proven otherwise&apos;,
        &apos;Target lesions with mucosal involvement = Stevens-Johnson syndrome&apos;,
        &apos;Nikolsky sign positive (skin sloughs with gentle pressure) = serious blistering disease&apos;,
        &apos;Dermatomal distribution = herpes zoster (shingles)&apos;,
        &apos;Bull\&apos;s eye rash = erythema migrans (Lyme disease)&apos;,
        &apos;Honey-crusted lesions = impetigo&apos;,
        &apos;Vesicles in different stages = chickenpox&apos;,
        &apos;Slapped cheek appearance = fifth disease (parvovirus B19)&apos;,
        &apos;Linear pattern = contact dermatitis (poison ivy)&apos;,
        &apos;Silvery scale on well-demarcated plaques = psoriasis&apos;,
        &apos;Drug reactions typically symmetric and spare palms/soles&apos;,
        &apos;Scabies burrows found in web spaces between fingers&apos;,
        &apos;Cellulitis typically unilateral with warmth and tenderness&apos;,
        &apos;Viral exanthems often have prodromal fever and URI symptoms&apos;
      ]
    },
    &apos;joint pain&apos;: {
      pivotalPoints: [
        &apos;Inflammatory vs non-inflammatory pattern determines diagnostic approach and urgency&apos;,
        &apos;Number and distribution of affected joints guide differential diagnosis&apos;,
        &apos;Morning stiffness duration distinguishes inflammatory from mechanical causes&apos;,
        &apos;Associated systemic symptoms suggest underlying rheumatologic disease&apos;
      ],
      questions: [
        &apos;Which joints are painful (hands, wrists, knees, ankles, back, shoulders)?&apos;,
        &apos;How many joints are affected - one joint or multiple?&apos;,
        &apos;When did the joint pain start and how did it develop?&apos;,
        &apos;Is the pain worse in the morning or evening?&apos;,
        &apos;Do you have morning stiffness? How long does it last?&apos;,
        &apos;Are the joints swollen, red, or warm to touch?&apos;,
        &apos;Does movement make the pain better or worse?&apos;,
        &apos;Any fever, chills, or feeling generally unwell?&apos;,
        &apos;Any skin rashes or changes?&apos;,
        &apos;Any eye redness, dryness, or vision problems?&apos;,
        &apos;Any recent infections, sore throat, or diarrheal illness?&apos;,
        &apos;Any family history of arthritis or autoimmune diseases?&apos;,
        &apos;Have you had any recent injuries or overuse of the joints?&apos;,
        &apos;Are you taking any medications?&apos;,
        &apos;Any recent tick bites or travel to areas with Lyme disease?&apos;,
        &apos;For men: Any urethral discharge or burning urination?&apos;,
        &apos;Any back pain or stiffness, especially in the morning?&apos;
      ],
      differentials: {
        &apos;Monoarticular (Single Joint) - Acute&apos;: [
          { condition: &apos;Septic Arthritis&apos;, likelihood: &apos;high concern&apos;, features: &apos;Fever, severe pain, effusion, inability to bear weight, immunocompromised&apos; },
          { condition: &apos;Crystal Arthropathy (Gout)&apos;, likelihood: &apos;high&apos;, features: &apos;First MTP joint, severe pain, males >40, hyperuricemia, tophi&apos; },
          { condition: &apos;Pseudogout (CPPD)&apos;, likelihood: &apos;moderate&apos;, features: &apos;Knee/wrist, elderly, chondrocalcinosis on X-ray, calcium pyrophosphate crystals&apos; },
          { condition: &apos;Trauma/Hemarthrosis&apos;, likelihood: &apos;moderate&apos;, features: &apos;Recent injury, anticoagulation, bleeding disorders&apos; },
          { condition: &apos;Reactive Arthritis&apos;, likelihood: &apos;low&apos;, features: &apos;Recent GU/GI infection, asymmetric, extra-articular features&apos; }
        ],
        &apos;Polyarticular (Multiple Joints) - Inflammatory&apos;: [
          { condition: &apos;Rheumatoid Arthritis&apos;, likelihood: &apos;high&apos;, features: &apos;Symmetric small joints, morning stiffness >1hr, RF/CCP positive&apos; },
          { condition: &apos;Systemic Lupus Erythematosus&apos;, likelihood: &apos;moderate&apos;, features: &apos;Young women, malar rash, photosensitivity, ANA positive&apos; },
          { condition: &apos;Psoriatic Arthritis&apos;, likelihood: &apos;moderate&apos;, features: &apos;Psoriasis, nail changes, asymmetric, DIP joints, enthesitis&apos; },
          { condition: &apos;Viral Arthritis&apos;, likelihood: &apos;moderate&apos;, features: &apos;Recent viral illness, parvovirus B19, hepatitis B, self-limiting&apos; },
          { condition: &apos;Ankylosing Spondylitis&apos;, likelihood: &apos;low&apos;, features: &apos;Young men, axial spine, morning stiffness, HLA-B27 positive&apos; }
        ],
        &apos;Polyarticular - Non-Inflammatory&apos;: [
          { condition: &apos;Osteoarthritis&apos;, likelihood: &apos;very high&apos;, features: &apos;Age >50, weight-bearing joints, bone-on-bone pain, Heberden nodes&apos; },
          { condition: &apos;Fibromyalgia&apos;, likelihood: &apos;moderate&apos;, features: &apos;Widespread pain, tender points, sleep disturbance, fatigue&apos; },
          { condition: &apos;Polymyalgia Rheumatica&apos;, likelihood: &apos;low&apos;, features: &apos;Age >50, shoulder/hip girdle, elevated ESR, dramatic steroid response&apos; },
          { condition: &apos;Hypothyroidism&apos;, likelihood: &apos;low&apos;, features: &apos;Fatigue, weight gain, cold intolerance, elevated TSH&apos; }
        ],
        &apos;Axial/Spinal Involvement&apos;: [
          { condition: &apos;Ankylosing Spondylitis&apos;, likelihood: &apos;moderate&apos;, features: &apos;Young adults, inflammatory back pain, HLA-B27, sacroiliitis&apos; },
          { condition: &apos;Psoriatic Arthritis (Axial)&apos;, likelihood: &apos;low&apos;, features: &apos;Psoriasis, asymmetric sacroiliitis, peripheral joint involvement&apos; },
          { condition: &apos;Inflammatory Bowel Disease Arthritis&apos;, likelihood: &apos;low&apos;, features: &apos;IBD history, axial and peripheral joints, gut symptoms&apos; },
          { condition: &apos;Mechanical Back Pain&apos;, likelihood: &apos;high&apos;, features: &apos;Activity-related, improves with rest, no morning stiffness&apos; }
        ],
        &apos;Infectious Arthritis&apos;: [
          { condition: &apos;Bacterial (Septic) Arthritis&apos;, likelihood: &apos;high concern&apos;, features: &apos;S. aureus most common, fever, single joint, rapid onset&apos; },
          { condition: &apos;Gonococcal Arthritis&apos;, likelihood: &apos;moderate&apos;, features: &apos;Young sexually active, migratory arthritis, skin lesions&apos; },
          { condition: &apos;Lyme Arthritis&apos;, likelihood: &apos;low&apos;, features: &apos;Endemic area, tick exposure, oligoarticular, knee involvement&apos; },
          { condition: &apos;Viral Arthritis&apos;, likelihood: &apos;moderate&apos;, features: &apos;Parvovirus B19, hepatitis B, EBV, self-limiting&apos; }
        ]
      },
      clinicalPatterns: {
        &apos;Inflammatory vs Non-Inflammatory&apos;: [
          &apos;Inflammatory: Morning stiffness >1hr, improves with activity, systemic symptoms&apos;,
          &apos;Non-inflammatory: Brief morning stiffness <30min, worse with activity, no systemic symptoms&apos;
        ],
        &apos;Joint Distribution Patterns&apos;: [
          &apos;Small joints: RA, SLE, psoriatic arthritis&apos;,
          &apos;Large joints: Osteoarthritis, reactive arthritis, septic arthritis&apos;,
          &apos;Axial spine: Ankylosing spondylitis, psoriatic arthritis, IBD arthritis&apos;,
          &apos;First MTP: Gout (classic), but can affect any joint&apos;
        ],
        &apos;Symmetry Patterns&apos;: [
          &apos;Symmetric: Rheumatoid arthritis, SLE, viral arthritis&apos;,
          &apos;Asymmetric: Psoriatic arthritis, reactive arthritis, gout, septic arthritis&apos;
        ]
      },
      redFlags: [
        &apos;Fever with joint pain (septic arthritis)&apos;,
        &apos;Single hot, swollen joint (septic arthritis until proven otherwise)&apos;,
        &apos;Inability to bear weight or severe functional impairment&apos;,
        &apos;Immunocompromised patient with joint pain&apos;,
        &apos;Joint pain with neurologic deficits&apos;,
        &apos;Prosthetic joint with pain and swelling&apos;,
        &apos;Joint pain with signs of systemic illness&apos;,
        &apos;Acute monoarthritis in elderly or diabetic patient&apos;,
        &apos;Joint pain with recent joint injection or surgery&apos;
      ],
      diagnosticApproach: {
        &apos;Joint Aspiration (Synovial Fluid Analysis)&apos;: [
          &apos;Mandatory for acute monoarthritis&apos;,
          &apos;Cell count and differential&apos;,
          &apos;Crystal analysis (polarized microscopy)&apos;,
          &apos;Gram stain and culture&apos;,
          &apos;Glucose and protein levels&apos;
        ],
        &apos;Laboratory Studies&apos;: [
          &apos;Complete blood count with differential&apos;,
          &apos;ESR and CRP (inflammatory markers)&apos;,
          &apos;Rheumatoid factor (RF) and anti-CCP antibodies&apos;,
          &apos;Antinuclear antibody (ANA)&apos;,
          &apos;Uric acid level&apos;,
          &apos;HLA-B27 (if spondyloarthropathy suspected)&apos;
        ],
        &apos;Imaging Studies&apos;: [
          &apos;Plain radiographs (joint damage, chondrocalcinosis)&apos;,
          &apos;Ultrasound (synovitis, effusions, erosions)&apos;,
          &apos;MRI (early erosions, bone marrow edema)&apos;,
          &apos;Dual-energy CT (uric acid crystal deposits)&apos;
        ],
        &apos;Additional Testing&apos;: [
          &apos;Complement levels (C3, C4) if SLE suspected&apos;,
          &apos;Anti-dsDNA, Sm, SSA/SSB (lupus-specific)&apos;,
          &apos;ANCA (vasculitis)&apos;,
          &apos;Lyme titers (if endemic area)&apos;,
          &apos;Hepatitis B surface antigen&apos;
        ]
      },
      synovialFluidAnalysis: {
        &apos;Normal&apos;: [
          &apos;WBC <200/μL&apos;,
          &apos;Clear, colorless&apos;,
          &apos;No crystals or organisms&apos;
        ],
        &apos;Non-Inflammatory (Osteoarthritis)&apos;: [
          &apos;WBC 200-2000/μL&apos;,
          &apos;Clear to slightly cloudy&apos;,
          &apos;Predominantly mononuclear cells&apos;
        ],
        &apos;Inflammatory (RA, Crystal)&apos;: [
          &apos;WBC 2000-50,000/μL&apos;,
          &apos;Cloudy, yellow&apos;,
          &apos;Predominantly neutrophils&apos;,
          &apos;Crystals may be present&apos;
        ],
        &apos;Septic&apos;: [
          &apos;WBC >50,000/μL (often >100,000)&apos;,
          &apos;Purulent, opaque&apos;,
          &apos;>90% neutrophils&apos;,
          &apos;Positive Gram stain/culture&apos;
        ]
      },
      crystalIdentification: {
        &apos;Uric Acid (Gout)&apos;: [
          &apos;Strongly negatively birefringent&apos;,
          &apos;Yellow parallel to axis&apos;,
          &apos;Blue perpendicular to axis&apos;,
          &apos;Needle-shaped&apos;
        ],
        &apos;Calcium Pyrophosphate (Pseudogout)&apos;: [
          &apos;Weakly positively birefringent&apos;,
          &apos;Blue parallel to axis&apos;,
          &apos;Yellow perpendicular to axis&apos;,
          &apos;Rectangular/rod-shaped&apos;
        ]
      },
      treatmentApproach: {
        &apos;Septic Arthritis&apos;: [
          &apos;Immediate arthrocentesis and drainage&apos;,
          &apos;IV antibiotics (empiric then culture-directed)&apos;,
          &apos;Orthopedic consultation&apos;,
          &apos;Serial drainage if needed&apos;
        ],
        &apos;Acute Gout&apos;: [
          &apos;NSAIDs (if no contraindications)&apos;,
          &apos;Colchicine (within 12-24 hours)&apos;,
          &apos;Corticosteroids (if NSAIDs/colchicine contraindicated)&apos;,
          &apos;Avoid allopurinol during acute attack&apos;
        ],
        &apos;Rheumatoid Arthritis&apos;: [
          &apos;Early DMARD therapy (methotrexate)&apos;,
          &apos;Corticosteroids for bridging&apos;,
          &apos;Biologic agents if refractory&apos;,
          &apos;Physical therapy and joint protection&apos;
        ],
        &apos;Osteoarthritis&apos;: [
          &apos;Weight loss if obese&apos;,
          &apos;Physical therapy and exercise&apos;,
          &apos;Acetaminophen first-line&apos;,
          &apos;Topical NSAIDs, intra-articular injections&apos;
        ]
      },
      ageGenderFactors: {
        &apos;Young Adults (20-40)&apos;: [&apos;Reactive arthritis&apos;, &apos;Ankylosing spondylitis&apos;, &apos;SLE&apos;, &apos;Viral arthritis&apos;],
        &apos;Middle Age (40-60)&apos;: [&apos;Rheumatoid arthritis&apos;, &apos;Gout (men)&apos;, &apos;Early osteoarthritis&apos;, &apos;Psoriatic arthritis&apos;],
        &apos;Elderly (>60)&apos;: [&apos;Osteoarthritis&apos;, &apos;Pseudogout&apos;, &apos;Polymyalgia rheumatica&apos;, &apos;Septic arthritis&apos;],
        &apos;Men&apos;: [&apos;Gout&apos;, &apos;Ankylosing spondylitis&apos;, &apos;Reactive arthritis&apos;, &apos;Osteoarthritis (knees)&apos;],
        &apos;Women&apos;: [&apos;Rheumatoid arthritis (3:1)&apos;, &apos;SLE (9:1)&apos;, &apos;Osteoarthritis (hands)&apos;, &apos;Fibromyalgia&apos;],
        &apos;Children&apos;: [&apos;Juvenile idiopathic arthritis&apos;, &apos;Reactive arthritis&apos;, &apos;Septic arthritis&apos;, &apos;Viral arthritis&apos;]
      },
      specificConditions: {
        &apos;Rheumatoid Arthritis Criteria (2010 ACR/EULAR)&apos;: [
          &apos;Joint involvement: Small joints score higher&apos;,
          &apos;Serology: RF and/or anti-CCP positive&apos;,
          &apos;Acute phase reactants: Elevated ESR or CRP&apos;,
          &apos;Symptom duration: >6 weeks&apos;
        ],
        &apos;Gout Diagnosis&apos;: [
          &apos;Monosodium urate crystals in synovial fluid&apos;,
          &apos;Tophus proven to contain urate crystals&apos;,
          &apos;Clinical features: rapid onset, MTP-1 involvement&apos;,
          &apos;Response to colchicine&apos;
        ],
        &apos;Septic Arthritis Risk Factors&apos;: [
          &apos;Age >80 years&apos;,
          &apos;Diabetes mellitus&apos;,
          &apos;Rheumatoid arthritis&apos;,
          &apos;Recent joint surgery&apos;,
          &apos;Prosthetic joint&apos;,
          &apos;Immunosuppression&apos;,
          &apos;IV drug use&apos;
        ]
      },
      urgency: &apos;varies&apos;,
      clinicalPearls: [
        &apos;Any acute monoarthritis should be considered septic until proven otherwise&apos;,
        &apos;Joint aspiration is mandatory for acute monoarthritis evaluation&apos;,
        &apos;Morning stiffness >1 hour suggests inflammatory arthritis&apos;,
        &apos;Gout can affect any joint, not just the big toe&apos;,
        &apos;RF positive in 5% of healthy population - correlation with clinical findings essential&apos;,
        &apos;Anti-CCP antibodies more specific for RA than RF&apos;,
        &apos;Crystal arthritis and septic arthritis can coexist&apos;,
        &apos;Osteoarthritis pain typically worse with activity, better with rest&apos;,
        &apos;Symmetric small joint involvement suggests rheumatoid arthritis&apos;,
        &apos;HLA-B27 positive in 8% of population but 90% of ankylosing spondylitis&apos;,
        &apos;Psoriatic arthritis can occur before skin manifestations&apos;,
        &apos;Polymyalgia rheumatica shows dramatic response to low-dose corticosteroids&apos;,
        &apos;Lyme arthritis typically affects large joints, especially knees&apos;,
        &apos;Gonococcal arthritis often presents with migratory polyarthritis&apos;
      ]
    },
    &apos;jaundice&apos;: {
      pivotalPoints: [
        &apos;Pattern of liver enzymes distinguishes hepatocellular from cholestatic jaundice&apos;,
        &apos;Presence or absence of pain helps differentiate biliary obstruction causes&apos;,
        &apos;Associated symptoms guide evaluation for hemolytic vs hepatic causes&apos;,
        &apos;Age and risk factors influence likelihood of malignant vs benign obstruction&apos;
      ],
      questions: [
        &apos;When did you first notice yellowing of your skin or eyes?&apos;,
        &apos;Have you noticed dark urine or light-colored (clay-colored) stools?&apos;,
        &apos;Do you have any abdominal pain? Where is it located?&apos;,
        &apos;Any nausea, vomiting, or loss of appetite?&apos;,
        &apos;Have you had any fever or chills?&apos;,
        &apos;Any unusual fatigue or weakness?&apos;,
        &apos;Have you lost weight recently without trying?&apos;,
        &apos;Any itching of your skin?&apos;,
        &apos;Do you drink alcohol? How much and for how long?&apos;,
        &apos;Are you taking any medications, including over-the-counter or herbal supplements?&apos;,
        &apos;Have you traveled recently, especially to developing countries?&apos;,
        &apos;Any history of hepatitis or liver disease?&apos;,
        &apos;Any recent blood transfusions or tattoos?&apos;,
        &apos;Any family history of liver disease or blood disorders?&apos;,
        &apos;Have you been exposed to anyone with hepatitis?&apos;,
        &apos;Any IV drug use or high-risk sexual behavior?&apos;,
        &apos;Any known gallbladder problems or gallstones?&apos;
      ],
      differentials: {
        &apos;Hepatocellular Jaundice (Liver Cell Damage)&apos;: [
          { condition: &apos;Viral Hepatitis (A, B, C, E)&apos;, likelihood: &apos;high&apos;, features: &apos;AST/ALT >1000, fatigue, nausea, recent exposure, travel&apos; },
          { condition: &apos;Drug-Induced Liver Injury (DILI)&apos;, likelihood: &apos;high&apos;, features: &apos;Recent medication exposure, AST/ALT elevation, temporal relationship&apos; },
          { condition: &apos;Alcoholic Hepatitis&apos;, likelihood: &apos;moderate&apos;, features: &apos;Heavy alcohol use, AST>ALT (2:1 ratio), fever, tender hepatomegaly&apos; },
          { condition: &apos;Autoimmune Hepatitis&apos;, likelihood: &apos;low&apos;, features: &apos;Young women, ANA positive, hypergammaglobulinemia, chronic course&apos; },
          { condition: &apos;Wilson\&apos;s Disease&apos;, likelihood: &apos;rare&apos;, features: &apos;Young adults, neurologic symptoms, Kayser-Fleischer rings, low ceruloplasmin&apos; },
          { condition: &apos;Acute Fatty Liver of Pregnancy&apos;, likelihood: &apos;rare&apos;, features: &apos;Third trimester, preeclampsia, microvesicular steatosis&apos; }
        ],
        &apos;Cholestatic Jaundice (Biliary Obstruction)&apos;: [
          { condition: &apos;Choledocholithiasis (Common Bile Duct Stones)&apos;, likelihood: &apos;high&apos;, features: &apos;RUQ pain, fever, elevated ALP/GGT, gallstone history&apos; },
          { condition: &apos;Pancreatic Cancer&apos;, likelihood: &apos;moderate&apos;, features: &apos;Painless jaundice, weight loss, age >60, courvoisier sign&apos; },
          { condition: &apos;Cholangiocarcinoma&apos;, likelihood: &apos;low&apos;, features: &apos;Painless jaundice, weight loss, PSC history, elevated CA 19-9&apos; },
          { condition: &apos;Primary Sclerosing Cholangitis&apos;, likelihood: &apos;low&apos;, features: &apos;IBD history, progressive course, MRCP showing strictures&apos; },
          { condition: &apos;Drug-Induced Cholestasis&apos;, likelihood: &apos;moderate&apos;, features: &apos;Antibiotics, phenothiazines, anabolic steroids, oral contraceptives&apos; },
          { condition: &apos;Benign Biliary Stricture&apos;, likelihood: &apos;low&apos;, features: &apos;Prior surgery, trauma, chronic pancreatitis&apos; }
        ],
        &apos;Hemolytic Jaundice (Red Blood Cell Breakdown)&apos;: [
          { condition: &apos;Hereditary Spherocytosis&apos;, likelihood: &apos;low&apos;, features: &apos;Family history, splenomegaly, spherocytes on smear, osmotic fragility&apos; },
          { condition: &apos;G6PD Deficiency&apos;, likelihood: &apos;low&apos;, features: &apos;Mediterranean/African descent, drug triggers, bite cells on smear&apos; },
          { condition: &apos;Autoimmune Hemolytic Anemia&apos;, likelihood: &apos;low&apos;, features: &apos;Positive Coombs test, reticulocytosis, elevated LDH&apos; },
          { condition: &apos;Transfusion Reaction&apos;, likelihood: &apos;rare&apos;, features: &apos;Recent transfusion, fever, hemoglobinuria, acute onset&apos; },
          { condition: &apos;Malaria&apos;, likelihood: &apos;rare&apos;, features: &apos;Recent travel to endemic area, fever, parasites on smear&apos; }
        ],
        &apos;Mixed/Complex Causes&apos;: [
          { condition: &apos;Sepsis with Cholestasis&apos;, likelihood: &apos;moderate&apos;, features: &apos;Systemic infection, elevated bilirubin with normal ALT, SIRS criteria&apos; },
          { condition: &apos;Heart Failure with Hepatic Congestion&apos;, likelihood: &apos;low&apos;, features: &apos;Known heart failure, elevated JVD, hepatomegaly, elevated BNP&apos; },
          { condition: &apos;Total Parenteral Nutrition&apos;, likelihood: &apos;low&apos;, features: &apos;ICU setting, prolonged TPN, cholestatic pattern&apos; },
          { condition: &apos;Benign Recurrent Intrahepatic Cholestasis&apos;, likelihood: &apos;rare&apos;, features: &apos;Episodic jaundice, family history, pruritus&apos; }
        ],
        &apos;Neonatal/Pediatric Causes&apos;: [
          { condition: &apos;Physiologic Jaundice&apos;, likelihood: &apos;very high&apos;, features: &apos;First week of life, unconjugated, breastfeeding&apos; },
          { condition: &apos;Biliary Atresia&apos;, likelihood: &apos;rare&apos;, features: &apos;Conjugated hyperbilirubinemia, hepatomegaly, pale stools&apos; },
          { condition: &apos;Gilbert Syndrome&apos;, likelihood: &apos;moderate&apos;, features: &apos;Mild unconjugated hyperbilirubinemia, stress/fasting triggers&apos; }
        ]
      },
      laboratoryPatterns: {
        &apos;Hepatocellular Pattern&apos;: [
          &apos;AST/ALT markedly elevated (>500, often >1000)&apos;,
          &apos;ALP/GGT mildly elevated (<3x normal)&apos;,
          &apos;AST/ALT ratio: <2 (viral), >2 (alcoholic)&apos;,
          &apos;Direct bilirubin predominates&apos;
        ],
        &apos;Cholestatic Pattern&apos;: [
          &apos;ALP/GGT markedly elevated (>3x normal)&apos;,
          &apos;AST/ALT mildly elevated (<500)&apos;,
          &apos;GGT elevation confirms hepatic source of ALP&apos;,
          &apos;Direct bilirubin predominates&apos;
        ],
        &apos;Hemolytic Pattern&apos;: [
          &apos;Unconjugated (indirect) bilirubin predominates&apos;,
          &apos;Normal AST/ALT/ALP&apos;,
          &apos;Elevated LDH and reticulocyte count&apos;,
          &apos;Decreased haptoglobin&apos;
        ]
      },
      clinicalSyndromes: {
        &apos;Charcot\&apos;s Triad (Cholangitis)&apos;: [
          &apos;Fever&apos;,
          &apos;Jaundice&apos;, 
          &apos;RUQ pain&apos;,
          &apos;Medical emergency - requires urgent decompression&apos;
        ],
        &apos;Reynold\&apos;s Pentad (Severe Cholangitis)&apos;: [
          &apos;Charcot\&apos;s triad PLUS&apos;,
          &apos;Altered mental status&apos;,
          &apos;Hypotension/shock&apos;
        ],
        &apos;Courvoisier\&apos;s Sign&apos;: [
          &apos;Painless jaundice + palpable gallbladder&apos;,
          &apos;Suggests malignant biliary obstruction&apos;,
          &apos;"Courvoisier\&apos;s law": gallbladder unlikely to distend if stones present&apos;
        ]
      },
      redFlags: [
        &apos;Acute fulminant hepatitis (coagulopathy, encephalopathy)&apos;,
        &apos;Charcot\&apos;s triad (fever, jaundice, RUQ pain) - cholangitis&apos;,
        &apos;Painless jaundice with weight loss (malignancy)&apos;,
        &apos;Jaundice with altered mental status (hepatic encephalopathy)&apos;,
        &apos;Jaundice with coagulopathy (PT/INR elevated)&apos;,
        &apos;Jaundice in pregnancy (AFLP, HELLP, cholestasis of pregnancy)&apos;,
        &apos;Acute hemolysis with kidney injury&apos;,
        &apos;Jaundice with severe abdominal pain (pancreatitis, cholangitis)&apos;,
        &apos;New jaundice in elderly patient (malignancy risk)&apos;
      ],
      diagnosticApproach: {
        &apos;Initial Laboratory Studies&apos;: [
          &apos;Complete hepatic panel (AST, ALT, ALP, GGT, bilirubin total/direct)&apos;,
          &apos;Complete blood count with peripheral smear&apos;,
          &apos;Comprehensive metabolic panel&apos;,
          &apos;Prothrombin time/INR&apos;,
          &apos;Albumin and total protein&apos;,
          &apos;Reticulocyte count, LDH, haptoglobin&apos;
        ],
        &apos;Viral Hepatitis Serologies&apos;: [
          &apos;Hepatitis A: Anti-HAV IgM (acute), Anti-HAV IgG (immunity)&apos;,
          &apos;Hepatitis B: HBsAg, Anti-HBc IgM, Anti-HBs, HBeAg, Anti-HBe&apos;,
          &apos;Hepatitis C: Anti-HCV, HCV RNA&apos;,
          &apos;Hepatitis E: Anti-HEV IgM (travel to endemic areas)&apos;,
          &apos;EBV, CMV if indicated&apos;
        ],
        &apos;Imaging Studies&apos;: [
          &apos;Right upper quadrant ultrasound (first-line)&apos;,
          &apos;MRCP or ERCP for biliary tree evaluation&apos;,
          &apos;CT abdomen/pelvis with contrast&apos;,
          &apos;Endoscopic ultrasound for pancreatic masses&apos;
        ],
        &apos;Advanced Testing&apos;: [
          &apos;Autoimmune markers: ANA, ASMA, LKM, AMA&apos;,
          &apos;Wilson disease: Ceruloplasmin, 24h urine copper&apos;,
          &apos;Alpha-1 antitrypsin level and phenotype&apos;,
          &apos;Iron studies, transferrin saturation&apos;
        ]
      },
      imagingInterpretation: {
        &apos;Ultrasound Findings&apos;: [
          &apos;Gallstones, gallbladder wall thickening&apos;,
          &apos;Bile duct dilatation (>6mm common bile duct)&apos;,
          &apos;Liver echogenicity and size&apos;,
          &apos;Portal vein patency and flow&apos;
        ],
        &apos;CT Findings&apos;: [
          &apos;Mass lesions in liver or pancreas&apos;,
          &apos;Bile duct dilatation and level of obstruction&apos;,
          &apos;Lymphadenopathy&apos;,
          &apos;Vascular involvement&apos;
        ],
        &apos;MRCP/ERCP&apos;: [
          &apos;Detailed biliary tree anatomy&apos;,
          &apos;Strictures, stones, masses&apos;,
          &apos;ERCP allows therapeutic intervention&apos;,
          &apos;PSC: multifocal stricturing and beading&apos;
        ]
      },
      drugInducedPatterns: {
        &apos;Hepatocellular Injury&apos;: [
          &apos;Acetaminophen (dose-dependent)&apos;,
          &apos;Isoniazid, phenytoin&apos;,
          &apos;Valproic acid, carbamazepine&apos;,
          &apos;Statins, methotrexate&apos;
        ],
        &apos;Cholestatic Injury&apos;: [
          &apos;Antibiotics: amoxicillin-clavulanate, macrolides&apos;,
          &apos;Phenothiazines, tricyclic antidepressants&apos;,
          &apos;Anabolic steroids, oral contraceptives&apos;,
          &apos;Total parenteral nutrition&apos;
        ],
        &apos;Mixed Pattern&apos;: [
          &apos;Phenytoin, sulfonamides&apos;,
          &apos;Allopurinol, carbamazepine&apos;,
          &apos;Some antibiotics and NSAIDs&apos;
        ]
      },
      ageGenderFactors: {
        &apos;Neonates&apos;: [&apos;Physiologic jaundice&apos;, &apos;Biliary atresia&apos;, &apos;Hemolytic disease&apos;, &apos;Breast milk jaundice&apos;],
        &apos;Young Adults&apos;: [&apos;Viral hepatitis&apos;, &apos;Drug-induced&apos;, &apos;Gilbert syndrome&apos;, &apos;Wilson disease&apos;],
        &apos;Middle Age&apos;: [&apos;Gallstone disease&apos;, &apos;Drug-induced&apos;, &apos;Autoimmune hepatitis&apos;, &apos;Alcohol-related&apos;],
        &apos;Elderly&apos;: [&apos;Malignancy&apos;, &apos;Drug-induced&apos;, &apos;Cholangitis&apos;, &apos;Pancreatic cancer&apos;],
        &apos;Women&apos;: [&apos;Autoimmune hepatitis&apos;, &apos;Primary biliary cholangitis&apos;, &apos;Pregnancy-related&apos;],
        &apos;Men&apos;: [&apos;Alcoholic liver disease&apos;, &apos;PSC (with IBD)&apos;, &apos;Hemochromatosis&apos;]
      },
      emergencyManagement: {
        &apos;Acute Liver Failure&apos;: [
          &apos;Immediate hepatology consultation&apos;,
          &apos;ICU monitoring&apos;,
          &apos;N-acetylcysteine if acetaminophen toxicity&apos;,
          &apos;Evaluate for liver transplantation&apos;
        ],
        &apos;Cholangitis&apos;: [
          &apos;IV antibiotics immediately&apos;,
          &apos;Urgent biliary decompression (ERCP)&apos;,
          &apos;Fluid resuscitation&apos;,
          &apos;Monitor for septic shock&apos;
        ],
        &apos;Severe Hemolysis&apos;: [
          &apos;Identify and remove trigger&apos;,
          &apos;Blood transfusion if severe anemia&apos;,
          &apos;Monitor for kidney injury&apos;,
          &apos;Plasmapheresis if TTP/HUS&apos;
        ]
      },
      treatmentApproach: {
        &apos;Supportive Care&apos;: [
          &apos;Discontinue hepatotoxic medications&apos;,
          &apos;Avoid alcohol&apos;,
          &apos;Nutritional support&apos;,
          &apos;Monitor for complications&apos;
        ],
        &apos;Specific Treatments&apos;: [
          &apos;Viral hepatitis: Supportive care, antivirals for HBV/HCV&apos;,
          &apos;Autoimmune: Immunosuppression (prednisone, azathioprine)&apos;,
          &apos;Wilson disease: Chelation therapy (penicillamine)&apos;,
          &apos;Obstructive: ERCP with stone removal or stenting&apos;
        ]
      },
      urgency: &apos;immediate&apos;,
      clinicalPearls: [
        &apos;Jaundice becomes visible when bilirubin >2.5-3 mg/dL&apos;,
        &apos;AST/ALT >1000 suggests acute hepatocellular injury&apos;,
        &apos;AST>ALT (2:1 ratio) suggests alcoholic liver disease&apos;,
        &apos;ALP >3x normal suggests cholestatic pattern&apos;,
        &apos;Unconjugated hyperbilirubinemia suggests hemolysis or Gilbert syndrome&apos;,
        &apos;Painless jaundice + weight loss = malignancy until proven otherwise&apos;,
        &apos;Charcot\&apos;s triad is a medical emergency requiring urgent decompression&apos;,
        &apos;Drug-induced liver injury is a diagnosis of exclusion&apos;,
        &apos;Normal bilirubin doesn\&apos;t rule out liver disease&apos;,
        &apos;GGT elevation confirms hepatic source of elevated ALP&apos;,
        &apos;Viral hepatitis can present with cholestatic pattern&apos;,
        &apos;Gilbert syndrome affects 5-10% of population (benign)&apos;,
        &apos;ERCP is both diagnostic and therapeutic for biliary obstruction&apos;,
        &apos;Hepatitis A and E are fecal-oral; B, C, D are blood-borne&apos;
      ]
    },
    &apos;blood in urine&apos;: {
      pivotalPoints: [
        &apos;Gross vs microscopic hematuria have different evaluation approaches and urgency&apos;,
        &apos;Painful vs painless hematuria suggests different etiologies&apos;,
        &apos;Age and gender significantly influence differential diagnosis and malignancy risk&apos;,
        &apos;Associated symptoms help distinguish glomerular from non-glomerular causes&apos;
      ],
      questions: [
        &apos;Can you see blood in your urine with the naked eye, or was it found on a test?&apos;,
        &apos;What color is your urine (pink, red, brown, cola-colored)?&apos;,
        &apos;When did you first notice blood in your urine?&apos;,
        &apos;Is there pain or burning when you urinate?&apos;,
        &apos;Do you see blood throughout urination or just at the beginning/end?&apos;,
        &apos;Any blood clots in your urine?&apos;,
        &apos;Any fever, chills, or feeling generally unwell?&apos;,
        &apos;Any pain in your back, sides, or lower abdomen?&apos;,
        &apos;Any difficulty urinating or changes in urinary stream?&apos;,
        &apos;Have you had any recent infections or illnesses?&apos;,
        &apos;Any recent vigorous exercise or trauma?&apos;,
        &apos;Are you taking any medications, especially blood thinners?&apos;,
        &apos;Any family history of kidney disease or bladder cancer?&apos;,
        &apos;Do you smoke or have you ever smoked?&apos;,
        &apos;Any occupational exposures to chemicals or dyes?&apos;,
        &apos;For women: Are you currently menstruating?&apos;,
        &apos;Any recent kidney stones or urinary tract infections?&apos;
      ],
      differentials: {
        &apos;Gross Hematuria (Visible Blood)&apos;: [
          { condition: &apos;Urinary Tract Infection&apos;, likelihood: &apos;high&apos;, features: &apos;Dysuria, frequency, urgency, fever, suprapubic pain&apos; },
          { condition: &apos;Nephrolithiasis (Kidney Stones)&apos;, likelihood: &apos;high&apos;, features: &apos;Severe flank pain, nausea, vomiting, colicky pain&apos; },
          { condition: &apos;Bladder Cancer&apos;, likelihood: &apos;moderate&apos;, features: &apos;Painless hematuria, age >50, smoking history, occupational exposure&apos; },
          { condition: &apos;Kidney Cancer (Renal Cell Carcinoma)&apos;, likelihood: &apos;low&apos;, features: &apos;Painless hematuria, flank mass, weight loss, fever&apos; },
          { condition: &apos;Trauma&apos;, likelihood: &apos;varies&apos;, features: &apos;Recent injury, accident, vigorous exercise, catheterization&apos; },
          { condition: &apos;Benign Prostatic Hyperplasia&apos;, likelihood: &apos;moderate&apos;, features: &apos;Older men, urinary retention, weak stream, nocturia&apos; }
        ],
        &apos;Microscopic Hematuria (>3 RBCs/hpf)&apos;: [
          { condition: &apos;Thin Basement Membrane Disease&apos;, likelihood: &apos;high&apos;, features: &apos;Young adults, family history, isolated hematuria, benign course&apos; },
          { condition: &apos;IgA Nephropathy&apos;, likelihood: &apos;moderate&apos;, features: &apos;Young adults, episodic gross hematuria with infections, proteinuria&apos; },
          { condition: &apos;Alport Syndrome&apos;, likelihood: &apos;low&apos;, features: &apos;Family history, hearing loss, progressive kidney disease&apos; },
          { condition: &apos;Exercise-Induced&apos;, likelihood: &apos;moderate&apos;, features: &apos;After vigorous exercise, resolves with rest&apos; },
          { condition: &apos;Medications&apos;, likelihood: &apos;moderate&apos;, features: &apos;Anticoagulants, aspirin, cyclophosphamide, rifampin&apos; }
        ],
        &apos;Glomerular Hematuria&apos;: [
          { condition: &apos;IgA Nephropathy&apos;, likelihood: &apos;high&apos;, features: &apos;Most common glomerular cause, Asian males, post-infectious episodes&apos; },
          { condition: &apos;Acute Post-Infectious Glomerulonephritis&apos;, likelihood: &apos;moderate&apos;, features: &apos;Recent strep infection, hypertension, edema, proteinuria&apos; },
          { condition: &apos;Lupus Nephritis&apos;, likelihood: &apos;low&apos;, features: &apos;SLE history, proteinuria, hypertension, systemic symptoms&apos; },
          { condition: &apos;ANCA Vasculitis&apos;, likelihood: &apos;rare&apos;, features: &apos;Pulmonary-renal syndrome, sinusitis, ANCA positive&apos; },
          { condition: &apos;Anti-GBM Disease (Goodpasture\&apos;s)&apos;, likelihood: &apos;rare&apos;, features: &apos;Pulmonary hemorrhage, rapidly progressive GN, anti-GBM positive&apos; }
        ],
        &apos;Non-Glomerular Hematuria&apos;: [
          { condition: &apos;Urolithiasis&apos;, likelihood: &apos;very high&apos;, features: &apos;Flank pain, nausea, imaging shows stones&apos; },
          { condition: &apos;Urinary Tract Infection&apos;, likelihood: &apos;very high&apos;, features: &apos;Dysuria, frequency, positive urine culture&apos; },
          { condition: &apos;Bladder Cancer&apos;, likelihood: &apos;moderate&apos;, features: &apos;Age >50, smoking, painless gross hematuria&apos; },
          { condition: &apos;Prostate Cancer&apos;, likelihood: &apos;low&apos;, features: &apos;Older men, elevated PSA, hard prostate&apos; },
          { condition: &apos;Polycystic Kidney Disease&apos;, likelihood: &apos;low&apos;, features: &apos;Family history, flank pain, hypertension, kidney enlargement&apos; }
        ],
        &apos;Malignancy-Associated&apos;: [
          { condition: &apos;Bladder Cancer (Urothelial)&apos;, likelihood: &apos;moderate&apos;, features: &apos;90% of bladder cancers, smoking, occupational exposure, age >50&apos; },
          { condition: &apos;Renal Cell Carcinoma&apos;, likelihood: &apos;low&apos;, features: &apos;Incidental finding on imaging, flank mass, weight loss&apos; },
          { condition: &apos;Prostate Cancer&apos;, likelihood: &apos;low&apos;, features: &apos;Older men, elevated PSA, bone pain if metastatic&apos; },
          { condition: &apos;Upper Tract Urothelial Cancer&apos;, likelihood: &apos;rare&apos;, features: &apos;Ureter/renal pelvis, similar risk factors to bladder cancer&apos; }
        ]
      },
      riskStratification: {
        &apos;High Risk for Malignancy&apos;: [
          &apos;Age >50 years&apos;,
          &apos;Male gender&apos;,
          &apos;Smoking history (current or former)&apos;,
          &apos;Occupational exposure (chemicals, dyes, rubber, leather)&apos;,
          &apos;History of pelvic radiation&apos;,
          &apos;Chronic indwelling catheter&apos;,
          &apos;History of urologic cancer&apos;,
          &apos;Painless gross hematuria&apos;
        ],
        &apos;Low Risk for Malignancy&apos;: [
          &apos;Age <35 years&apos;,
          &apos;Female gender&apos;,
          &apos;No smoking history&apos;,
          &apos;Recent UTI or vigorous exercise&apos;,
          &apos;Isolated microscopic hematuria&apos;,
          &apos;Clear secondary cause identified&apos;
        ]
      },
      clinicalAssessment: {
        &apos;Timing of Hematuria&apos;: [
          &apos;Initial: Urethral bleeding (trauma, stricture)&apos;,
          &apos;Terminal: Bladder neck/prostate bleeding&apos;,
          &apos;Throughout: Bladder, ureter, or kidney bleeding&apos;
        ],
        &apos;Associated Symptoms&apos;: [
          &apos;Dysuria + frequency: UTI, cystitis&apos;,
          &apos;Flank pain: Stones, pyelonephritis, renal infarct&apos;,
          &apos;Painless: Malignancy, glomerular disease&apos;,
          &apos;Proteinuria: Glomerular disease&apos;,
          &apos;Clots: Non-glomerular bleeding&apos;
        ],
        &apos;Urine Appearance&apos;: [
          &apos;Pink/red: Fresh bleeding, lower tract&apos;,
          &apos;Brown/cola: Upper tract, glomerular&apos;,
          &apos;Clots present: Non-glomerular source&apos;,
          &apos;Proteinuria: Suggests glomerular disease&apos;
        ]
      },
      redFlags: [
        &apos;Painless gross hematuria in adults >35 (malignancy risk)&apos;,
        &apos;Hematuria with acute kidney injury&apos;,
        &apos;Massive hematuria with clot retention&apos;,
        &apos;Hematuria with signs of systemic disease (fever, weight loss)&apos;,
        &apos;Hematuria with severe hypertension&apos;,
        &apos;Family history of hereditary nephritis with hematuria&apos;,
        &apos;Occupational chemical exposure with hematuria&apos;,
        &apos;Persistent microscopic hematuria after UTI treatment&apos;,
        &apos;Hematuria with flank mass or lymphadenopathy&apos;
      ],
      diagnosticApproach: {
        &apos;Initial Evaluation (All Patients)&apos;: [
          &apos;Detailed history and physical examination&apos;,
          &apos;Urinalysis with microscopy (confirm RBCs)&apos;,
          &apos;Urine culture&apos;,
          &apos;Serum creatinine and estimated GFR&apos;,
          &apos;Complete blood count&apos;,
          &apos;PT/PTT if on anticoagulation&apos;
        ],
        &apos;Gross Hematuria Workup&apos;: [
          &apos;Cystoscopy (all patients >35 or high risk)&apos;,
          &apos;CT urography or IV pyelogram&apos;,
          &apos;Renal ultrasound (alternative imaging)&apos;,
          &apos;Cytology (if high suspicion for malignancy)&apos;
        ],
        &apos;Microscopic Hematuria Workup&apos;: [
          &apos;Risk stratification based on age and risk factors&apos;,
          &apos;Cystoscopy if high risk (age >35, smoking, etc.)&apos;,
          &apos;Imaging: CT urography, renal ultrasound, or IVP&apos;,
          &apos;Nephrology referral if glomerular pattern&apos;
        ],
        &apos;Glomerular Disease Workup&apos;: [
          &apos;Nephrology consultation&apos;,
          &apos;Proteinuria quantification (24h urine or spot ratio)&apos;,
          &apos;Complement levels (C3, C4)&apos;,
          &apos;ANA, anti-dsDNA (lupus)&apos;,
          &apos;ANCA (vasculitis)&apos;,
          &apos;Anti-GBM antibodies&apos;,
          &apos;Renal biopsy if indicated&apos;
        ]
      },
      laboratoryFindings: {
        &apos;Glomerular vs Non-Glomerular&apos;: [
          &apos;Glomerular: RBC casts, dysmorphic RBCs, proteinuria&apos;,
          &apos;Non-Glomerular: Normal RBC morphology, minimal proteinuria&apos;
        ],
        &apos;Urine Microscopy&apos;: [
          &apos;RBC casts: Pathognomonic for glomerular disease&apos;,
          &apos;WBC casts: Pyelonephritis, interstitial nephritis&apos;,
          &apos;Crystals: Calcium oxalate, uric acid, cystine stones&apos;,
          &apos;Bacteria: UTI (>10^5 CFU/mL significant)&apos;
        ]
      },
      imagingApproach: {
        &apos;CT Urography (Gold Standard)&apos;: [
          &apos;Best for detecting stones, masses, structural abnormalities&apos;,
          &apos;Contrast enhancement shows renal function&apos;,
          &apos;Delayed images show collecting system&apos;
        ],
        &apos;Renal Ultrasound&apos;: [
          &apos;No radiation, good for cysts, hydronephrosis&apos;,
          &apos;Limited for small stones or masses&apos;,
          &apos;First-line in pregnancy, children&apos;
        ],
        &apos;MR Urography&apos;: [
          &apos;Alternative if contrast allergy&apos;,
          &apos;Good soft tissue contrast&apos;,
          &apos;No radiation exposure&apos;
        ]
      },
      ageGenderFactors: {
        &apos;Young Adults (<35)&apos;: [&apos;UTI&apos;, &apos;Stones&apos;, &apos;Glomerular disease&apos;, &apos;Exercise-induced&apos;, &apos;Thin basement membrane&apos;],
        &apos;Middle Age (35-50)&apos;: [&apos;Stones&apos;, &apos;UTI&apos;, &apos;Early malignancy screening&apos;, &apos;Glomerular disease&apos;],
        &apos;Older Adults (>50)&apos;: [&apos;Malignancy&apos;, &apos;BPH&apos;, &apos;Stones&apos;, &apos;UTI&apos;, &apos;Medication-related&apos;],
        &apos;Men&apos;: [&apos;BPH&apos;, &apos;Prostate cancer&apos;, &apos;Bladder cancer&apos;, &apos;Stones&apos;],
        &apos;Women&apos;: [&apos;UTI&apos;, &apos;Menstrual contamination&apos;, &apos;Bladder cancer (lower risk)&apos;, &apos;Stones&apos;],
        &apos;Children&apos;: [&apos;UTI&apos;, &apos;Glomerular disease&apos;, &apos;Hypercalciuria&apos;, &apos;Trauma&apos;]
      },
      specialConsiderations: {
        &apos;Anticoagulated Patients&apos;: [
          &apos;Hematuria in anticoagulated patients still requires full workup&apos;,
          &apos;Anticoagulation may unmask underlying pathology&apos;,
          &apos;Do not attribute hematuria solely to anticoagulation&apos;,
          &apos;Consider holding anticoagulation for procedures&apos;
        ],
        &apos;Exercise-Induced Hematuria&apos;: [
          &apos;Common after intense exercise&apos;,
          &apos;Usually resolves within 24-72 hours&apos;,
          &apos;If persistent, requires full evaluation&apos;,
          &apos;More common in contact sports, running&apos;
        ],
        &apos;Menstrual Contamination&apos;: [
          &apos;Repeat urinalysis after menstruation&apos;,
          &apos;Use midstream clean-catch specimen&apos;,
          &apos;Consider catheterized specimen if unclear&apos;
        ]
      },
      treatmentApproach: {
        &apos;UTI-Related&apos;: [
          &apos;Appropriate antibiotics based on culture&apos;,
          &apos;Repeat urinalysis after treatment&apos;,
          &apos;If hematuria persists, full workup needed&apos;
        ],
        &apos;Stone Disease&apos;: [
          &apos;Pain management, hydration&apos;,
          &apos;Alpha-blockers for ureteral stones&apos;,
          &apos;Lithotripsy or ureteroscopy if indicated&apos;,
          &apos;Metabolic stone evaluation&apos;
        ],
        &apos;Malignancy&apos;: [
          &apos;Urologic oncology referral&apos;,
          &apos;Staging studies if cancer confirmed&apos;,
          &apos;Multidisciplinary treatment planning&apos;
        ],
        &apos;Glomerular Disease&apos;: [
          &apos;Nephrology management&apos;,
          &apos;ACE inhibitors for proteinuria&apos;,
          &apos;Immunosuppression if indicated&apos;,
          &apos;Blood pressure control&apos;
        ]
      },
      urgency: &apos;varies&apos;,
      clinicalPearls: [
        &apos;Any visible blood in urine requires urgent urologic evaluation&apos;,
        &apos;Painless gross hematuria = malignancy until proven otherwise&apos;,
        &apos;Anticoagulation does not explain hematuria - still needs workup&apos;,
        &apos;RBC casts are pathognomonic for glomerular disease&apos;,
        &apos;Bladder cancer most common cause of gross hematuria in adults >50&apos;,
        &apos;IgA nephropathy most common cause of glomerular hematuria&apos;,
        &apos;Exercise-induced hematuria should resolve within 72 hours&apos;,
        &apos;Smoking increases bladder cancer risk by 4-fold&apos;,
        &apos;Occupational exposures: benzidine, aromatic amines, aniline dyes&apos;,
        &apos;Thin basement membrane disease is benign familial hematuria&apos;,
        &apos;Cyclophosphamide can cause hemorrhagic cystitis&apos;,
        &apos;Upper tract imaging essential - cystoscopy alone insufficient&apos;,
        &apos;Microscopic hematuria in young athletes often benign&apos;,
        &apos;Persistent hematuria after UTI treatment requires full evaluation&apos;
      ]
    },
    &apos;fatigue&apos;: {
      pivotalPoints: [
        &apos;Duration distinguishes acute vs chronic fatigue with different diagnostic approaches&apos;,
        &apos;Associated symptoms help identify specific organ system involvement&apos;,
        &apos;Sleep quality and quantity assessment is crucial for differential diagnosis&apos;,
        &apos;Psychiatric comorbidities (depression, anxiety) are common and often overlooked&apos;
      ],
      questions: [
        &apos;How long have you been feeling fatigued (days, weeks, months, years)?&apos;,
        &apos;Is the fatigue constant or does it come and go?&apos;,
        &apos;Is it worse at certain times of day (morning, afternoon, evening)?&apos;,
        &apos;How would you rate your energy level on a scale of 1-10?&apos;,
        &apos;Does rest or sleep help improve your fatigue?&apos;,
        &apos;How many hours of sleep do you get per night? Do you feel rested when you wake up?&apos;,
        &apos;Do you snore or has anyone noticed you stop breathing during sleep?&apos;,
        &apos;Any difficulty falling asleep or staying asleep?&apos;,
        &apos;Do you feel sad, depressed, or have lost interest in activities you used to enjoy?&apos;,
        &apos;Any anxiety, stress, or major life changes recently?&apos;,
        &apos;Have you noticed any weight changes (gain or loss)?&apos;,
        &apos;Any muscle weakness or joint pain?&apos;,
        &apos;Any shortness of breath with activity or at rest?&apos;,
        &apos;Any changes in your menstrual periods (for women)?&apos;,
        &apos;Any changes in bowel movements or digestive symptoms?&apos;,
        &apos;Do you drink alcohol or use any substances?&apos;,
        &apos;What medications and supplements are you taking?&apos;,
        &apos;Any recent infections or illnesses?&apos;
      ],
      differentials: {
        &apos;Endocrine/Metabolic Causes&apos;: [
          { condition: &apos;Hypothyroidism&apos;, likelihood: &apos;high&apos;, features: &apos;Weight gain, cold intolerance, dry skin, bradycardia, elevated TSH&apos; },
          { condition: &apos;Diabetes Mellitus&apos;, likelihood: &apos;moderate&apos;, features: &apos;Polyuria, polydipsia, weight loss, hyperglycemia&apos; },
          { condition: &apos;Adrenal Insufficiency&apos;, likelihood: &apos;low&apos;, features: &apos;Weight loss, hyperpigmentation, hypotension, hyponatremia&apos; },
          { condition: &apos;Hyperthyroidism&apos;, likelihood: &apos;moderate&apos;, features: &apos;Weight loss, heat intolerance, palpitations, tremor&apos; },
          { condition: &apos;Diabetes Insipidus&apos;, likelihood: &apos;rare&apos;, features: &apos;Polyuria, polydipsia, hypernatremia&apos; }
        ],
        &apos;Hematologic Causes&apos;: [
          { condition: &apos;Iron Deficiency Anemia&apos;, likelihood: &apos;very high&apos;, features: &apos;Pallor, restless legs, pica, heavy menstrual bleeding&apos; },
          { condition: &apos;Vitamin B12 Deficiency&apos;, likelihood: &apos;moderate&apos;, features: &apos;Macrocytic anemia, neurologic symptoms, megaloblastic changes&apos; },
          { condition: &apos;Folate Deficiency&apos;, likelihood: &apos;low&apos;, features: &apos;Macrocytic anemia, poor diet, alcohol use&apos; },
          { condition: &apos;Chronic Disease Anemia&apos;, likelihood: &apos;moderate&apos;, features: &apos;Chronic illness, normal iron studies, inflammatory markers&apos; },
          { condition: &apos;Hemolytic Anemia&apos;, likelihood: &apos;rare&apos;, features: &apos;Jaundice, elevated LDH, low haptoglobin&apos; }
        ],
        &apos;Cardiovascular Causes&apos;: [
          { condition: &apos;Heart Failure&apos;, likelihood: &apos;moderate&apos;, features: &apos;Dyspnea, orthopnea, edema, JVD, S3 gallop&apos; },
          { condition: &apos;Coronary Artery Disease&apos;, likelihood: &apos;moderate&apos;, features: &apos;Chest pain, dyspnea on exertion, cardiac risk factors&apos; },
          { condition: &apos;Arrhythmias&apos;, likelihood: &apos;low&apos;, features: &apos;Palpitations, irregular pulse, syncope&apos; }
        ],
        &apos;Pulmonary Causes&apos;: [
          { condition: &apos;Sleep Apnea&apos;, likelihood: &apos;high&apos;, features: &apos;Snoring, witnessed apneas, morning headaches, obesity&apos; },
          { condition: &apos;Chronic Obstructive Pulmonary Disease&apos;, likelihood: &apos;moderate&apos;, features: &apos;Smoking history, dyspnea, chronic cough&apos; },
          { condition: &apos;Asthma&apos;, likelihood: &apos;low&apos;, features: &apos;Wheezing, dyspnea, triggers, family history&apos; }
        ],
        &apos;Infectious Causes&apos;: [
          { condition: &apos;Viral Syndrome&apos;, likelihood: &apos;high&apos;, features: &apos;Recent illness, myalgias, low-grade fever, self-limiting&apos; },
          { condition: &apos;Mononucleosis (EBV)&apos;, likelihood: &apos;moderate&apos;, features: &apos;Sore throat, lymphadenopathy, splenomegaly, young adults&apos; },
          { condition: &apos;Hepatitis&apos;, likelihood: &apos;low&apos;, features: &apos;Jaundice, elevated liver enzymes, risk factors&apos; },
          { condition: &apos;HIV&apos;, likelihood: &apos;low&apos;, features: &apos;Risk factors, weight loss, opportunistic infections&apos; },
          { condition: &apos;Tuberculosis&apos;, likelihood: &apos;rare&apos;, features: &apos;Night sweats, weight loss, cough, risk factors&apos; }
        ],
        &apos;Psychiatric/Psychological Causes&apos;: [
          { condition: &apos;Major Depressive Disorder&apos;, likelihood: &apos;very high&apos;, features: &apos;Depressed mood, anhedonia, sleep disturbance, appetite changes&apos; },
          { condition: &apos;Anxiety Disorders&apos;, likelihood: &apos;high&apos;, features: &apos;Worry, restlessness, muscle tension, sleep disturbance&apos; },
          { condition: &apos;Seasonal Affective Disorder&apos;, likelihood: &apos;moderate&apos;, features: &apos;Seasonal pattern, light sensitivity, carbohydrate cravings&apos; },
          { condition: &apos;Chronic Stress&apos;, likelihood: &apos;high&apos;, features: &apos;Life stressors, burnout, work-related factors&apos; }
        ],
        &apos;Autoimmune/Rheumatologic&apos;: [
          { condition: &apos;Systemic Lupus Erythematosus&apos;, likelihood: &apos;low&apos;, features: &apos;Joint pain, rash, photosensitivity, ANA positive&apos; },
          { condition: &apos;Rheumatoid Arthritis&apos;, likelihood: &apos;low&apos;, features: &apos;Joint pain/swelling, morning stiffness, RF/CCP positive&apos; },
          { condition: &apos;Fibromyalgia&apos;, likelihood: &apos;moderate&apos;, features: &apos;Widespread pain, tender points, sleep disturbance&apos; },
          { condition: &apos;Polymyalgia Rheumatica&apos;, likelihood: &apos;low&apos;, features: &apos;Age >50, shoulder/hip stiffness, elevated ESR&apos; }
        ],
        &apos;Other Medical Causes&apos;: [
          { condition: &apos;Chronic Kidney Disease&apos;, likelihood: &apos;moderate&apos;, features: &apos;Elevated creatinine, proteinuria, hypertension&apos; },
          { condition: &apos;Liver Disease&apos;, likelihood: &apos;low&apos;, features: &apos;Elevated liver enzymes, jaundice, alcohol history&apos; },
          { condition: &apos;Malignancy&apos;, likelihood: &apos;low&apos;, features: &apos;Weight loss, night sweats, specific organ symptoms&apos; },
          { condition: &apos;Medication Side Effects&apos;, likelihood: &apos;high&apos;, features: &apos;Recent medication changes, sedating medications&apos; }
        ],
        &apos;Lifestyle/Behavioral Causes&apos;: [
          { condition: &apos;Poor Sleep Hygiene&apos;, likelihood: &apos;very high&apos;, features: &apos;Irregular sleep schedule, screen time, caffeine&apos; },
          { condition: &apos;Physical Deconditioning&apos;, likelihood: &apos;high&apos;, features: &apos;Sedentary lifestyle, lack of exercise&apos; },
          { condition: &apos;Nutritional Deficiencies&apos;, likelihood: &apos;moderate&apos;, features: &apos;Poor diet, weight loss diets, malabsorption&apos; },
          { condition: &apos;Overwork/Burnout&apos;, likelihood: &apos;high&apos;, features: &apos;Long work hours, high stress, lack of recovery time&apos; }
        ]
      },
      fatigueCharacterization: {
        &apos;Physical Fatigue&apos;: [
          &apos;Muscle weakness, heaviness&apos;,
          &apos;Difficulty with physical activities&apos;,
          &apos;Improves with rest&apos;,
          &apos;May suggest neuromuscular or metabolic causes&apos;
        ],
        &apos;Mental Fatigue&apos;: [
          &apos;Difficulty concentrating, brain fog&apos;,
          &apos;Memory problems&apos;,
          &apos;Mental effort feels exhausting&apos;,
          &apos;May suggest psychiatric or neurologic causes&apos;
        ],
        &apos;Mixed Fatigue&apos;: [
          &apos;Both physical and mental components&apos;,
          &apos;Most common presentation&apos;,
          &apos;Suggests systemic disease&apos;
        ]
      },
      redFlags: [
        &apos;Unintentional weight loss >10% body weight&apos;,
        &apos;Fever with fatigue (infection, malignancy)&apos;,
        &apos;Night sweats (malignancy, infection)&apos;,
        &apos;Lymphadenopathy (malignancy, infection)&apos;,
        &apos;Severe muscle weakness (neuromuscular disease)&apos;,
        &apos;Chest pain with fatigue (cardiac cause)&apos;,
        &apos;Severe dyspnea (cardiac or pulmonary cause)&apos;,
        &apos;Signs of bleeding (GI bleed, hematologic malignancy)&apos;,
        &apos;Jaundice (liver disease, hemolysis)&apos;,
        &apos;Neurologic deficits (CNS pathology)&apos;
      ],
      diagnosticApproach: {
        &apos;Initial Laboratory Studies&apos;: [
          &apos;Complete blood count with differential&apos;,
          &apos;Complete metabolic panel&apos;,
          &apos;Thyroid stimulating hormone (TSH)&apos;,
          &apos;Ferritin and iron studies&apos;,
          &apos;Vitamin B12 and folate levels&apos;,
          &apos;Erythrocyte sedimentation rate (ESR)&apos;,
          &apos;C-reactive protein (CRP)&apos;,
          &apos;Urinalysis&apos;
        ],
        &apos;Second-Tier Testing (If Indicated)&apos;: [
          &apos;Hemoglobin A1C (diabetes screening)&apos;,
          &apos;Liver function tests&apos;,
          &apos;Creatine kinase (muscle disease)&apos;,
          &apos;Antinuclear antibody (ANA)&apos;,
          &apos;HIV testing (if risk factors)&apos;,
          &apos;Cortisol levels (adrenal function)&apos;,
          &apos;Sleep study (if sleep apnea suspected)&apos;
        ],
        &apos;Specialized Testing&apos;: [
          &apos;Echocardiogram (if cardiac symptoms)&apos;,
          &apos;Pulmonary function tests (if respiratory symptoms)&apos;,
          &apos;Polysomnography (sleep disorders)&apos;,
          &apos;Psychiatric evaluation (mood disorders)&apos;
        ]
      },
      sleepAssessment: {
        &apos;Sleep History&apos;: [
          &apos;Sleep duration (7-9 hours recommended for adults)&apos;,
          &apos;Sleep quality and restorative nature&apos;,
          &apos;Snoring, witnessed apneas&apos;,
          &apos;Restless legs, periodic limb movements&apos;,
          &apos;Sleep hygiene practices&apos;
        ],
        &apos;Sleep Disorders&apos;: [
          &apos;Obstructive sleep apnea (most common)&apos;,
          &apos;Insomnia (difficulty initiating/maintaining sleep)&apos;,
          &apos;Restless legs syndrome&apos;,
          &apos;Narcolepsy (excessive daytime sleepiness)&apos;,
          &apos;Circadian rhythm disorders&apos;
        ]
      },
      medicationCauses: {
        &apos;Common Fatigue-Inducing Medications&apos;: [
          &apos;Sedating antihistamines (diphenhydramine)&apos;,
          &apos;Beta-blockers (propranolol, metoprolol)&apos;,
          &apos;Antidepressants (tricyclics, some SSRIs)&apos;,
          &apos;Anticonvulsants (phenytoin, carbamazepine)&apos;,
          &apos;Opioid pain medications&apos;,
          &apos;Benzodiazepines&apos;,
          &apos;Muscle relaxants&apos;,
          &apos;Some blood pressure medications&apos;
        ]
      },
      ageGenderFactors: {
        &apos;Young Adults (20-35)&apos;: [&apos;Depression/anxiety&apos;, &apos;Iron deficiency&apos;, &apos;Viral syndromes&apos;, &apos;Sleep disorders&apos;, &apos;Stress&apos;],
        &apos;Middle Age (35-55)&apos;: [&apos;Hypothyroidism&apos;, &apos;Sleep apnea&apos;, &apos;Depression&apos;, &apos;Diabetes&apos;, &apos;Heart disease&apos;],
        &apos;Older Adults (>55)&apos;: [&apos;Multiple medical conditions&apos;, &apos;Medication effects&apos;, &apos;Heart failure&apos;, &apos;Malignancy&apos;, &apos;Anemia&apos;],
        &apos;Women&apos;: [&apos;Iron deficiency anemia&apos;, &apos;Hypothyroidism&apos;, &apos;Depression&apos;, &apos;Autoimmune diseases&apos;],
        &apos;Men&apos;: [&apos;Sleep apnea&apos;, &apos;Heart disease&apos;, &apos;Alcohol-related&apos;, &apos;Diabetes&apos;],
        &apos;Postmenopausal Women&apos;: [&apos;Hormonal changes&apos;, &apos;Sleep disturbances&apos;, &apos;Mood changes&apos;]
      },
      chronicFatigueSyndrome: {
        &apos;Diagnostic Criteria&apos;: [
          &apos;Fatigue >6 months duration&apos;,
          &apos;Substantial reduction in activity level&apos;,
          &apos;Not explained by other medical conditions&apos;,
          &apos;Post-exertional malaise&apos;,
          &apos;Unrefreshing sleep&apos;,
          &apos;Cognitive impairment or orthostatic intolerance&apos;
        ],
        &apos;Management&apos;: [
          &apos;Pacing and energy conservation&apos;,
          &apos;Graduated exercise therapy (controversial)&apos;,
          &apos;Cognitive behavioral therapy&apos;,
          &apos;Symptom management&apos;,
          &apos;Sleep optimization&apos;
        ]
      },
      treatmentApproach: {
        &apos;Specific Treatments&apos;: [
          &apos;Iron supplementation (iron deficiency)&apos;,
          &apos;Thyroid hormone replacement (hypothyroidism)&apos;,
          &apos;Antidepressants (depression/anxiety)&apos;,
          &apos;CPAP therapy (sleep apnea)&apos;,
          &apos;Diabetes management (hyperglycemia)&apos;
        ],
        &apos;General Measures&apos;: [
          &apos;Sleep hygiene optimization&apos;,
          &apos;Regular exercise program&apos;,
          &apos;Stress management techniques&apos;,
          &apos;Nutritional counseling&apos;,
          &apos;Medication review and optimization&apos;
        ]
      },
      urgency: &apos;varies&apos;,
      clinicalPearls: [
        &apos;Fatigue is the most common symptom in primary care (up to 25% of visits)&apos;,
        &apos;Depression is the most common psychiatric cause of fatigue&apos;,
        &apos;Iron deficiency is the most common nutritional cause, especially in women&apos;,
        &apos;Sleep apnea should be considered in all obese patients with fatigue&apos;,
        &apos;Normal TSH doesn\&apos;t rule out thyroid disease in some patients&apos;,
        &apos;Post-viral fatigue can last weeks to months after infection&apos;,
        &apos;Chronic fatigue syndrome is a diagnosis of exclusion&apos;,
        &apos;Multiple causes often coexist (depression + sleep apnea + anemia)&apos;,
        &apos;Medication review is essential - polypharmacy common cause&apos;,
        &apos;Red flags warrant urgent evaluation - most fatigue is benign&apos;,
        &apos;B12 deficiency can occur with normal B12 levels (check methylmalonic acid)&apos;,
        &apos;Fatigue without other symptoms in young adults often suggests psychiatric cause&apos;
      ]
    },
    &apos;swelling&apos;: {
      pivotalPoints: [
        &apos;Distribution (bilateral vs unilateral) is key to differential diagnosis&apos;,
        &apos;Pitting vs non-pitting edema suggests different underlying mechanisms&apos;,
        &apos;Associated symptoms help distinguish cardiac, renal, hepatic, and other causes&apos;,
        &apos;Onset timing (acute vs chronic) guides urgency and evaluation approach&apos;
      ],
      questions: [
        &apos;Where exactly is the swelling located (legs, feet, hands, face, abdomen)?&apos;,
        &apos;Is the swelling on one side or both sides of your body?&apos;,
        &apos;When did you first notice the swelling?&apos;,
        &apos;Is the swelling worse at certain times of day (morning vs evening)?&apos;,
        &apos;When you press on the swelling, does it leave an indentation (pit)?&apos;,
        &apos;Any shortness of breath, especially when lying flat or with activity?&apos;,
        &apos;Do you wake up at night gasping for air?&apos;,
        &apos;Any chest pain or palpitations?&apos;,
        &apos;Any changes in your urination (amount, color, foaming)?&apos;,
        &apos;Any abdominal pain or bloating?&apos;,
        &apos;Have you gained weight recently? How much?&apos;,
        &apos;Any nausea, vomiting, or loss of appetite?&apos;,
        &apos;Any recent leg pain, redness, or warmth?&apos;,
        &apos;Are you taking any medications?&apos;,
        &apos;Any history of heart, kidney, or liver problems?&apos;,
        &apos;Any recent travel, surgery, or prolonged immobilization?&apos;,
        &apos;For women: Any changes in your menstrual cycle or could you be pregnant?&apos;
      ],
      differentials: {
        &apos;Bilateral Lower Extremity Edema&apos;: [
          { condition: &apos;Congestive Heart Failure&apos;, likelihood: &apos;high&apos;, features: &apos;Dyspnea, orthopnea, PND, JVD, S3 gallop, fatigue&apos; },
          { condition: &apos;Chronic Kidney Disease&apos;, likelihood: &apos;high&apos;, features: &apos;Proteinuria, elevated creatinine, hypertension, uremic symptoms&apos; },
          { condition: &apos;Nephrotic Syndrome&apos;, likelihood: &apos;moderate&apos;, features: &apos;Massive proteinuria, hypoalbuminemia, hyperlipidemia&apos; },
          { condition: &apos;Liver Disease/Cirrhosis&apos;, likelihood: &apos;moderate&apos;, features: &apos;Ascites, jaundice, spider angiomata, hepatomegaly&apos; },
          { condition: &apos;Medication-Induced&apos;, likelihood: &apos;high&apos;, features: &apos;CCBs, NSAIDs, steroids, thiazolidinediones&apos; },
          { condition: &apos;Venous Insufficiency&apos;, likelihood: &apos;moderate&apos;, features: &apos;Chronic, worse with standing, venous stasis changes&apos; }
        ],
        &apos;Unilateral Lower Extremity Edema&apos;: [
          { condition: &apos;Deep Vein Thrombosis (DVT)&apos;, likelihood: &apos;high&apos;, features: &apos;Acute onset, pain, warmth, erythema, risk factors&apos; },
          { condition: &apos;Cellulitis&apos;, likelihood: &apos;moderate&apos;, features: &apos;Erythema, warmth, tenderness, fever, skin breakdown&apos; },
          { condition: &apos;Lymphedema&apos;, likelihood: &apos;low&apos;, features: &apos;Non-pitting, chronic, post-surgical, malignancy&apos; },
          { condition: &apos;Baker\&apos;s Cyst Rupture&apos;, likelihood: &apos;low&apos;, features: &apos;Posterior knee pain, history of knee arthritis&apos; },
          { condition: &apos;Chronic Venous Insufficiency&apos;, likelihood: &apos;moderate&apos;, features: &apos;Varicose veins, skin changes, ulcerations&apos; }
        ],
        &apos;Facial/Periorbital Edema&apos;: [
          { condition: &apos;Nephrotic Syndrome&apos;, likelihood: &apos;high&apos;, features: &apos;Morning predominance, proteinuria, hypoalbuminemia&apos; },
          { condition: &apos;Acute Glomerulonephritis&apos;, likelihood: &apos;moderate&apos;, features: &apos;Hematuria, hypertension, recent strep infection&apos; },
          { condition: &apos;Angioedema&apos;, likelihood: &apos;moderate&apos;, features: &apos;Acute onset, asymmetric, lips/tongue involvement, allergic&apos; },
          { condition: &apos;Superior Vena Cava Syndrome&apos;, likelihood: &apos;rare&apos;, features: &apos;Face/arm swelling, dyspnea, malignancy history&apos; },
          { condition: &apos;Hypothyroidism&apos;, likelihood: &apos;low&apos;, features: &apos;Non-pitting, fatigue, weight gain, cold intolerance&apos; }
        ],
        &apos;Generalized Edema (Anasarca)&apos;: [
          { condition: &apos;Severe Heart Failure&apos;, likelihood: &apos;high&apos;, features: &apos;Severe LV dysfunction, cardiogenic shock&apos; },
          { condition: &apos;End-Stage Renal Disease&apos;, likelihood: &apos;high&apos;, features: &apos;Severe CKD, uremic symptoms, oliguria&apos; },
          { condition: &apos;Severe Liver Disease&apos;, likelihood: &apos;moderate&apos;, features: &apos;Decompensated cirrhosis, ascites, encephalopathy&apos; },
          { condition: &apos;Severe Malnutrition&apos;, likelihood: &apos;low&apos;, features: &apos;Hypoalbuminemia, kwashiorkor, chronic illness&apos; },
          { condition: &apos;Severe Hypothyroidism (Myxedema)&apos;, likelihood: &apos;rare&apos;, features: &apos;Non-pitting, bradycardia, hypothermia&apos; }
        ],
        &apos;Pregnancy-Related Edema&apos;: [
          { condition: &apos;Physiologic Edema of Pregnancy&apos;, likelihood: &apos;high&apos;, features: &apos;Third trimester, mild, no proteinuria&apos; },
          { condition: &apos;Preeclampsia&apos;, likelihood: &apos;moderate&apos;, features: &apos;Hypertension, proteinuria, headache, visual changes&apos; },
          { condition: &apos;HELLP Syndrome&apos;, likelihood: &apos;rare&apos;, features: &apos;Hemolysis, elevated liver enzymes, low platelets&apos; }
        ]
      },
      clinicalAssessment: {
        &apos;Pitting vs Non-Pitting&apos;: [
          &apos;Pitting: Fluid retention (heart failure, renal, venous)&apos;,
          &apos;Non-pitting: Lymphedema, myxedema, lipedema&apos;
        ],
        &apos;Distribution Patterns&apos;: [
          &apos;Dependent: Heart failure, venous insufficiency, medications&apos;,
          &apos;Facial: Renal disease, angioedema, superior vena cava syndrome&apos;,
          &apos;Unilateral: DVT, cellulitis, lymphedema, local obstruction&apos;,
          &apos;Generalized: Severe heart/kidney/liver disease, malnutrition&apos;
        ],
        &apos;Timing Patterns&apos;: [
          &apos;Morning: Renal disease (especially facial)&apos;,
          &apos;Evening: Cardiac disease, venous insufficiency&apos;,
          &apos;Acute: DVT, cellulitis, angioedema, medication reaction&apos;,
          &apos;Chronic: Heart failure, CKD, venous insufficiency&apos;
        ]
      },
      redFlags: [
        &apos;Acute unilateral leg swelling with pain (DVT)&apos;,
        &apos;Facial swelling with difficulty breathing (angioedema)&apos;,
        &apos;Severe dyspnea with bilateral edema (acute heart failure)&apos;,
        &apos;Edema with chest pain (MI, pulmonary embolism)&apos;,
        &apos;Pregnant woman with edema + hypertension + proteinuria (preeclampsia)&apos;,
        &apos;Edema with oliguria and elevated creatinine (acute kidney injury)&apos;,
        &apos;Superior vena cava syndrome (face/arm swelling + dyspnea)&apos;,
        &apos;Massive ascites with edema (decompensated liver disease)&apos;,
        &apos;Edema with signs of infection (cellulitis, necrotizing fasciitis)&apos;
      ],
      diagnosticApproach: {
        &apos;Initial Laboratory Studies&apos;: [
          &apos;Complete metabolic panel (kidney function, electrolytes)&apos;,
          &apos;Urinalysis with microscopy (proteinuria, hematuria)&apos;,
          &apos;Complete blood count&apos;,
          &apos;Liver function tests&apos;,
          &apos;Thyroid stimulating hormone&apos;,
          &apos;Brain natriuretic peptide (BNP/NT-proBNP)&apos;
        ],
        &apos;Cardiac Evaluation&apos;: [
          &apos;Echocardiogram (systolic/diastolic function)&apos;,
          &apos;Chest X-ray (cardiomegaly, pulmonary edema)&apos;,
          &apos;ECG (ischemia, arrhythmias)&apos;
        ],
        &apos;Renal Evaluation&apos;: [
          &apos;24-hour urine protein or spot urine protein/creatinine ratio&apos;,
          &apos;Renal ultrasound&apos;,
          &apos;Consider renal biopsy if glomerular disease suspected&apos;
        ],
        &apos;Vascular Studies&apos;: [
          &apos;Venous duplex ultrasound (if DVT suspected)&apos;,
          &apos;CT or MR venography (if central obstruction suspected)&apos;
        ]
      },
      specificConditions: {
        &apos;Heart Failure Assessment&apos;: [
          &apos;NYHA Class: I-IV based on functional limitation&apos;,
          &apos;Ejection fraction: HFrEF (<40%) vs HFpEF (≥50%)&apos;,
          &apos;BNP/NT-proBNP: >400 pg/mL suggests heart failure&apos;,
          &apos;Chest X-ray: Cardiomegaly, pulmonary vascular redistribution&apos;
        ],
        &apos;Nephrotic Syndrome Criteria&apos;: [
          &apos;Proteinuria >3.5 g/day&apos;,
          &apos;Hypoalbuminemia <3.0 g/dL&apos;,
          &apos;Edema (typically facial, morning predominance)&apos;,
          &apos;Hyperlipidemia (often present)&apos;
        ],
        &apos;DVT Risk Assessment (Wells Score)&apos;: [
          &apos;Active cancer (1 point)&apos;,
          &apos;Paralysis/paresis/immobilization (1 point)&apos;,
          &apos;Bedridden >3 days or major surgery <4 weeks (1 point)&apos;,
          &apos;Localized tenderness along deep veins (1 point)&apos;,
          &apos;Entire leg swollen (1 point)&apos;,
          &apos;Calf swelling >3 cm compared to asymptomatic leg (1 point)&apos;,
          &apos;Pitting edema (1 point)&apos;,
          &apos;Collateral superficial veins (1 point)&apos;,
          &apos;Alternative diagnosis as likely or more likely (-2 points)&apos;
        ]
      },
      medicationCauses: {
        &apos;Common Edema-Causing Medications&apos;: [
          &apos;Calcium channel blockers (especially amlodipine)&apos;,
          &apos;NSAIDs (fluid retention, kidney dysfunction)&apos;,
          &apos;Corticosteroids (mineralocorticoid effects)&apos;,
          &apos;Thiazolidinediones (pioglitazone, rosiglitazone)&apos;,
          &apos;Hormones (estrogen, testosterone)&apos;,
          &apos;Minoxidil (vasodilation)&apos;,
          &apos;Gabapentin/pregabalin&apos;
        ]
      },
      treatmentApproach: {
        &apos;Heart Failure&apos;: [
          &apos;Diuretics (furosemide, bumetanide)&apos;,
          &apos;ACE inhibitors/ARBs&apos;,
          &apos;Beta-blockers&apos;,
          &apos;Aldosterone antagonists&apos;,
          &apos;Sodium restriction (<2g/day)&apos;
        ],
        &apos;Renal Disease&apos;: [
          &apos;ACE inhibitors/ARBs for proteinuria&apos;,
          &apos;Diuretics for volume overload&apos;,
          &apos;Protein restriction if advanced CKD&apos;,
          &apos;Treatment of underlying glomerular disease&apos;
        ],
        &apos;Venous Insufficiency&apos;: [
          &apos;Compression stockings (20-30 mmHg)&apos;,
          &apos;Leg elevation&apos;,
          &apos;Exercise program&apos;,
          &apos;Weight loss if obese&apos;
        ],
        &apos;DVT&apos;: [
          &apos;Anticoagulation (warfarin, DOACs)&apos;,
          &apos;Compression stockings&apos;,
          &apos;Early ambulation&apos;,
          &apos;Consider thrombolysis if massive&apos;
        ]
      },
      ageGenderFactors: {
        &apos;Young Women (20-40)&apos;: [&apos;Pregnancy-related&apos;, &apos;DVT (OCPs)&apos;, &apos;Nephrotic syndrome&apos;, &apos;Medication-induced&apos;],
        &apos;Middle Age (40-65)&apos;: [&apos;Heart failure&apos;, &apos;Medication-induced&apos;, &apos;Venous insufficiency&apos;, &apos;DVT&apos;],
        &apos;Elderly (>65)&apos;: [&apos;Heart failure&apos;, &apos;Medication-induced&apos;, &apos;CKD&apos;, &apos;Venous insufficiency&apos;],
        &apos;Men&apos;: [&apos;Heart failure&apos;, &apos;Liver disease&apos;, &apos;DVT&apos;, &apos;Medication-induced&apos;],
        &apos;Pregnant Women&apos;: [&apos;Physiologic edema&apos;, &apos;Preeclampsia&apos;, &apos;DVT&apos;, &apos;Peripartum cardiomyopathy&apos;]
      },
      urgency: &apos;varies&apos;,
      clinicalPearls: [
        &apos;Bilateral edema suggests systemic cause; unilateral suggests local cause&apos;,
        &apos;Facial edema in morning suggests renal disease&apos;,
        &apos;Leg edema worse in evening suggests cardiac or venous cause&apos;,
        &apos;Non-pitting edema suggests lymphatic or thyroid disease&apos;,
        &apos;BNP >400 pg/mL strongly suggests heart failure as cause&apos;,
        &apos;Proteinuria >3.5 g/day defines nephrotic syndrome&apos;,
        &apos;CCB-induced edema doesn\&apos;t respond well to diuretics&apos;,
        &apos;DVT can be painless, especially in elderly or diabetics&apos;,
        &apos;Lymphedema typically starts distally and progresses proximally&apos;,
        &apos;Venous insufficiency edema improves with leg elevation&apos;,
        &apos;Myxedema is non-pitting and feels doughy&apos;,
        &apos;Lipedema spares feet and is bilateral and symmetric&apos;
      ]
    },
    &apos;painful urination&apos;: {
      pivotalPoints: [
        &apos;Gender significantly influences differential diagnosis and management approach&apos;,
        &apos;Associated symptoms distinguish simple cystitis from complicated UTI or pyelonephritis&apos;,
        &apos;Sexual history and discharge guide evaluation for sexually transmitted infections&apos;,
        &apos;Recurrent episodes require evaluation for anatomic abnormalities or resistant organisms&apos;
      ],
      questions: [
        &apos;How long have you had painful urination?&apos;,
        &apos;Is the pain during urination, before, or after?&apos;,
        &apos;Where exactly do you feel the pain (burning sensation, location)?&apos;,
        &apos;Do you have increased frequency or urgency of urination?&apos;,
        &apos;Any blood in your urine or dark/cloudy urine?&apos;,
        &apos;Any unusual vaginal or penile discharge?&apos;,
        &apos;Any fever, chills, or feeling generally unwell?&apos;,
        &apos;Any back pain, especially on the sides (flank pain)?&apos;,
        &apos;Any nausea or vomiting?&apos;,
        &apos;Are you sexually active? Any new sexual partners recently?&apos;,
        &apos;For women: When was your last menstrual period? Could you be pregnant?&apos;,
        &apos;Any history of kidney stones or urinary tract infections?&apos;,
        &apos;Do you use any contraceptives (diaphragm, spermicides)?&apos;,
        &apos;Any recent catheter placement or urologic procedures?&apos;,
        &apos;Are you taking any medications or antibiotics?&apos;,
        &apos;Do you have diabetes or any immune system problems?&apos;,
        &apos;Any recent changes in soaps, detergents, or personal hygiene products?&apos;
      ],
      differentials: {
        &apos;Uncomplicated UTI (Healthy Women)&apos;: [
          { condition: &apos;Acute Cystitis&apos;, likelihood: &apos;very high&apos;, features: &apos;Dysuria, frequency, urgency, suprapubic pain, no fever&apos; },
          { condition: &apos;Acute Urethritis&apos;, likelihood: &apos;moderate&apos;, features: &apos;Dysuria, discharge, sexually active, gradual onset&apos; }
        ],
        &apos;Complicated UTI&apos;: [
          { condition: &apos;Acute Pyelonephritis&apos;, likelihood: &apos;moderate&apos;, features: &apos;Fever, flank pain, nausea/vomiting, CVA tenderness&apos; },
          { condition: &apos;UTI in Pregnancy&apos;, likelihood: &apos;varies&apos;, features: &apos;Pregnant women, higher risk of progression to pyelonephritis&apos; },
          { condition: &apos;UTI in Men&apos;, likelihood: &apos;moderate&apos;, features: &apos;Always considered complicated, prostate involvement possible&apos; },
          { condition: &apos;UTI with Diabetes&apos;, likelihood: &apos;moderate&apos;, features: &apos;Diabetic patients, higher risk of complications&apos; },
          { condition: &apos;Catheter-Associated UTI&apos;, likelihood: &apos;high&apos;, features: &apos;Recent catheterization, healthcare exposure&apos; }
        ],
        &apos;Sexually Transmitted Infections&apos;: [
          { condition: &apos;Chlamydia Urethritis&apos;, likelihood: &apos;high&apos;, features: &apos;Gradual onset, discharge, sexually active, <25 years&apos; },
          { condition: &apos;Gonorrhea Urethritis&apos;, likelihood: &apos;moderate&apos;, features: &apos;Purulent discharge, sexually active, rapid onset&apos; },
          { condition: &apos;Herpes Simplex Virus&apos;, likelihood: &apos;moderate&apos;, features: &apos;Vesicles, severe dysuria, first episode vs recurrent&apos; },
          { condition: &apos;Trichomoniasis&apos;, likelihood: &apos;low&apos;, features: &apos;Frothy discharge, malodorous, sexually transmitted&apos; }
        ],
        &apos;Non-Infectious Causes&apos;: [
          { condition: &apos;Interstitial Cystitis/Bladder Pain Syndrome&apos;, likelihood: &apos;low&apos;, features: &apos;Chronic symptoms, sterile urine, pelvic pain&apos; },
          { condition: &apos;Chemical/Irritant Cystitis&apos;, likelihood: &apos;moderate&apos;, features: &apos;New soaps, detergents, spermicides, bubble baths&apos; },
          { condition: &apos;Atrophic Vaginitis&apos;, likelihood: &apos;moderate&apos;, features: &apos;Postmenopausal women, vaginal dryness, dyspareunia&apos; },
          { condition: &apos;Urethral Stricture&apos;, likelihood: &apos;low&apos;, features: &apos;Men, decreased stream, history of trauma/infection&apos; },
          { condition: &apos;Bladder Cancer&apos;, likelihood: &apos;rare&apos;, features: &apos;Hematuria, age >50, smoking history, painless initially&apos; }
        ],
        &apos;Male-Specific Causes&apos;: [
          { condition: &apos;Prostatitis (Acute)&apos;, likelihood: &apos;moderate&apos;, features: &apos;Fever, perineal pain, tender prostate on exam&apos; },
          { condition: &apos;Prostatitis (Chronic)&apos;, likelihood: &apos;moderate&apos;, features: &apos;Chronic pelvic pain, recurrent UTIs, voiding symptoms&apos; },
          { condition: &apos;Epididymitis&apos;, likelihood: &apos;moderate&apos;, features: &apos;Scrotal pain/swelling, sexually active or urinary retention&apos; },
          { condition: &apos;Urethral Stricture&apos;, likelihood: &apos;low&apos;, features: &apos;Decreased stream, history of trauma, GC infection&apos; }
        ],
        &apos;Female-Specific Causes&apos;: [
          { condition: &apos;Vulvovaginal Candidiasis&apos;, likelihood: &apos;high&apos;, features: &apos;External dysuria, thick white discharge, itching&apos; },
          { condition: &apos;Bacterial Vaginosis&apos;, likelihood: &apos;moderate&apos;, features: &apos;Fishy odor, thin gray discharge, clue cells&apos; },
          { condition: &apos;Urethral Syndrome&apos;, likelihood: &apos;low&apos;, features: &apos;Dysuria without pyuria, frequency, negative cultures&apos; },
          { condition: &apos;Pelvic Inflammatory Disease&apos;, likelihood: &apos;low&apos;, features: &apos;Pelvic pain, fever, cervical motion tenderness&apos; }
        ]
      },
      diagnosticCriteria: {
        &apos;Uncomplicated Cystitis (Women)&apos;: [
          &apos;Dysuria, frequency, urgency, suprapubic pain&apos;,
          &apos;No fever, flank pain, or vaginal discharge&apos;,
          &apos;Healthy, non-pregnant, premenopausal women&apos;,
          &apos;No recent UTI or antibiotic use&apos;
        ],
        &apos;Complicated UTI&apos;: [
          &apos;Men with UTI symptoms&apos;,
          &apos;Pregnant women&apos;,
          &apos;Immunocompromised patients&apos;,
          &apos;Anatomic abnormalities&apos;,
          &apos;Recent instrumentation&apos;,
          &apos;Symptoms >7 days&apos;
        ],
        &apos;Pyelonephritis&apos;: [
          &apos;Fever >100.4°F (38°C)&apos;,
          &apos;Flank pain or CVA tenderness&apos;,
          &apos;Nausea/vomiting&apos;,
          &apos;May have cystitis symptoms&apos;
        ]
      },
      redFlags: [
        &apos;Fever with flank pain (pyelonephritis)&apos;,
        &apos;Signs of sepsis (hypotension, altered mental status)&apos;,
        &apos;Inability to urinate (urinary retention)&apos;,
        &apos;Gross hematuria with dysuria&apos;,
        &apos;Severe abdominal or pelvic pain&apos;,
        &apos;Pregnant woman with UTI symptoms&apos;,
        &apos;Immunocompromised patient with dysuria&apos;,
        &apos;Recent urologic procedure with new symptoms&apos;,
        &apos;Recurrent UTIs (>3 in 12 months)&apos;,
        &apos;Male with acute urinary retention and fever&apos;
      ],
      riskFactors: {
        &apos;UTI Risk Factors (Women)&apos;: [
          &apos;Sexual activity (especially new partner)&apos;,
          &apos;Diaphragm or spermicide use&apos;,
          &apos;Recent antibiotic use&apos;,
          &apos;Diabetes mellitus&apos;,
          &apos;Pregnancy&apos;,
          &apos;Menopause (decreased estrogen)&apos;,
          &apos;Previous UTI&apos;,
          &apos;Urinary retention&apos;
        ],
        &apos;UTI Risk Factors (Men)&apos;: [
          &apos;Benign prostatic hyperplasia&apos;,
          &apos;Prostatitis&apos;,
          &apos;Urethral stricture&apos;,
          &apos;Immunosuppression&apos;,
          &apos;Diabetes mellitus&apos;,
          &apos;Recent instrumentation&apos;
        ],
        &apos;STI Risk Factors&apos;: [
          &apos;Age <25 years&apos;,
          &apos;Multiple sexual partners&apos;,
          &apos;New sexual partner&apos;,
          &apos;Unprotected sexual activity&apos;,
          &apos;History of STIs&apos;,
          &apos;Partner with STI&apos;
        ]
      },
      diagnosticApproach: {
        &apos;Uncomplicated Cystitis (Women)&apos;: [
          &apos;Clinical diagnosis acceptable in typical presentation&apos;,
          &apos;Urine dipstick (nitrites, leukocyte esterase)&apos;,
          &apos;Urine culture if recurrent or treatment failure&apos;
        ],
        &apos;Complicated UTI&apos;: [
          &apos;Urine culture and sensitivity (always)&apos;,
          &apos;Complete blood count&apos;,
          &apos;Basic metabolic panel&apos;,
          &apos;Blood cultures if febrile&apos;,
          &apos;Consider imaging if severe or recurrent&apos;
        ],
        &apos;STI Evaluation&apos;: [
          &apos;Nucleic acid amplification test (NAAT) for chlamydia/gonorrhea&apos;,
          &apos;HSV PCR if vesicles present&apos;,
          &apos;Wet mount for trichomonas&apos;,
          &apos;Consider HIV and syphilis testing&apos;
        ]
      },
      treatmentApproach: {
        &apos;Uncomplicated Cystitis&apos;: [
          &apos;Nitrofurantoin 100mg BID x 5 days (first-line)&apos;,
          &apos;Trimethoprim-sulfamethoxazole DS BID x 3 days (if resistance <20%)&apos;,
          &apos;Fosfomycin 3g single dose (alternative)&apos;,
          &apos;Avoid fluoroquinolones unless no alternatives&apos;
        ],
        &apos;Complicated UTI/Pyelonephritis&apos;: [
          &apos;Fluoroquinolones (ciprofloxacin, levofloxacin)&apos;,
          &apos;Cephalexin (if mild, gram-positive coverage)&apos;,
          &apos;Consider hospitalization if severe&apos;,
          &apos;Duration: 7-14 days depending on severity&apos;
        ],
        &apos;STI Treatment&apos;: [
          &apos;Chlamydia: Azithromycin 1g single dose or doxycycline 100mg BID x 7 days&apos;,
          &apos;Gonorrhea: Ceftriaxone 500mg IM single dose&apos;,
          &apos;HSV: Acyclovir, valacyclovir, or famciclovir&apos;,
          &apos;Partner treatment essential&apos;
        ]
      },
      ageGenderFactors: {
        &apos;Young Women (18-35)&apos;: [&apos;Uncomplicated cystitis&apos;, &apos;STIs (chlamydia, gonorrhea)&apos;, &apos;Honeymoon cystitis&apos;],
        &apos;Older Women (>50)&apos;: [&apos;Complicated UTI&apos;, &apos;Atrophic vaginitis&apos;, &apos;Bladder cancer&apos;, &apos;Diabetes-related&apos;],
        &apos;Young Men (<35)&apos;: [&apos;STIs&apos;, &apos;Urethritis&apos;, &apos;Trauma-related&apos;],
        &apos;Older Men (>50)&apos;: [&apos;Prostatitis&apos;, &apos;BPH-related UTI&apos;, &apos;Bladder cancer&apos;],
        &apos;Pregnant Women&apos;: [&apos;Asymptomatic bacteriuria&apos;, &apos;Complicated UTI&apos;, &apos;Higher pyelonephritis risk&apos;],
        &apos;Children&apos;: [&apos;Anatomic abnormalities&apos;, &apos;Vesicoureteral reflux&apos;, &apos;Constipation-related&apos;]
      },
      recurrentUTI: {
        &apos;Definition&apos;: &apos;>2 UTIs in 6 months or >3 UTIs in 12 months&apos;,
        &apos;Evaluation&apos;: [
          &apos;Urine culture during and after treatment&apos;,
          &apos;Post-void residual&apos;,
          &apos;Consider cystoscopy&apos;,
          &apos;Imaging (ultrasound, CT urogram) if indicated&apos;
        ],
        &apos;Prevention&apos;: [
          &apos;Increased fluid intake&apos;,
          &apos;Post-coital voiding&apos;,
          &apos;Cranberry products&apos;,
          &apos;Prophylactic antibiotics if frequent&apos;,
          &apos;Topical estrogen (postmenopausal women)&apos;
        ]
      },
      urgency: &apos;varies&apos;,
      clinicalPearls: [
        &apos;Dysuria + frequency + urgency = classic cystitis triad&apos;,
        &apos;Nitrites more specific than leukocyte esterase for bacterial UTI&apos;,
        &apos;UTIs in men are always considered complicated&apos;,
        &apos;Asymptomatic bacteriuria should not be treated (except pregnancy)&apos;,
        &apos;Post-coital UTIs common in sexually active women&apos;,
        &apos;Cranberry products may reduce recurrent UTIs in women&apos;,
        &apos;E. coli causes 75-85% of uncomplicated cystitis&apos;,
        &apos;Fluoroquinolone resistance increasing - avoid as first-line&apos;,
        &apos;Always consider STIs in sexually active patients <25 years&apos;,
        &apos;Interstitial cystitis: dysuria with sterile urine cultures&apos;,
        &apos;Phenazopyridine provides symptomatic relief but not treatment&apos;
      ]
    },
    &apos;shortness of breath&apos;: {
      pivotalPoints: [
        &apos;Acute vs chronic onset determines urgency and differential diagnosis approach&apos;,
        &apos;Associated chest pain, fever, or hemoptysis suggest specific etiologies&apos;,
        &apos;Exertional vs rest dyspnea helps distinguish cardiac from pulmonary causes&apos;,
        &apos;Orthopnea and paroxysmal nocturnal dyspnea are classic heart failure symptoms&apos;
      ],
      questions: [
        &apos;When did your shortness of breath start (suddenly, over hours, days, weeks)?&apos;,
        &apos;What were you doing when it started?&apos;,
        &apos;Do you have shortness of breath at rest or only with activity?&apos;,
        &apos;How much activity can you do before getting short of breath?&apos;,
        &apos;Do you get short of breath lying flat? How many pillows do you sleep with?&apos;,
        &apos;Do you wake up at night gasping for air?&apos;,
        &apos;Any chest pain, pressure, or tightness?&apos;,
        &apos;Any cough? Are you bringing up any sputum or blood?&apos;,
        &apos;Any fever, chills, or feeling generally unwell?&apos;,
        &apos;Any leg swelling, weight gain, or feeling bloated?&apos;,
        &apos;Any palpitations or irregular heartbeat?&apos;,
        &apos;Any recent travel, especially long flights or car rides?&apos;,
        &apos;Any history of heart problems, lung disease, or blood clots?&apos;,
        &apos;Do you smoke or have you ever smoked? How much?&apos;,
        &apos;Any known allergies or recent new exposures?&apos;,
        &apos;Are you taking any medications?&apos;,
        &apos;Any family history of heart or lung disease?&apos;
      ],
      differentials: {
        &apos;Acute Life-Threatening (Emergency)&apos;: [
          { condition: &apos;Pulmonary Embolism&apos;, likelihood: &apos;moderate&apos;, features: &apos;Sudden onset, pleuritic chest pain, risk factors (travel, surgery, malignancy)&apos; },
          { condition: &apos;Acute Myocardial Infarction&apos;, likelihood: &apos;moderate&apos;, features: &apos;Chest pain, diaphoresis, nausea, cardiac risk factors&apos; },
          { condition: &apos;Pneumothorax&apos;, likelihood: &apos;low&apos;, features: &apos;Sudden onset, pleuritic pain, tall thin males, decreased breath sounds&apos; },
          { condition: &apos;Acute Heart Failure/Pulmonary Edema&apos;, likelihood: &apos;moderate&apos;, features: &apos;Orthopnea, PND, rales, JVD, known heart disease&apos; },
          { condition: &apos;Anaphylaxis&apos;, likelihood: &apos;low&apos;, features: &apos;Rapid onset, urticaria, angioedema, known allergen exposure&apos; },
          { condition: &apos;Tension Pneumothorax&apos;, likelihood: &apos;rare&apos;, features: &apos;Severe respiratory distress, tracheal deviation, absent breath sounds&apos; }
        ],
        &apos;Acute Non-Life-Threatening&apos;: [
          { condition: &apos;Pneumonia&apos;, likelihood: &apos;high&apos;, features: &apos;Fever, productive cough, consolidation on exam, elderly or immunocompromised&apos; },
          { condition: &apos;Asthma Exacerbation&apos;, likelihood: &apos;moderate&apos;, features: &apos;Wheezing, peak flow reduction, known asthma, triggers&apos; },
          { condition: &apos;COPD Exacerbation&apos;, likelihood: &apos;moderate&apos;, features: &apos;Smoking history, increased sputum, wheezing, barrel chest&apos; },
          { condition: &apos;Upper Respiratory Infection&apos;, likelihood: &apos;moderate&apos;, features: &apos;Gradual onset, rhinorrhea, sore throat, low-grade fever&apos; },
          { condition: &apos;Anxiety/Panic Attack&apos;, likelihood: &apos;moderate&apos;, features: &apos;Sudden onset, palpitations, sweating, sense of doom&apos; }
        ],
        &apos;Chronic Dyspnea&apos;: [
          { condition: &apos;Heart Failure&apos;, likelihood: &apos;high&apos;, features: &apos;Exertional dyspnea, orthopnea, PND, edema, fatigue&apos; },
          { condition: &apos;Chronic Obstructive Pulmonary Disease (COPD)&apos;, likelihood: &apos;high&apos;, features: &apos;Smoking history, chronic cough, sputum production, progressive&apos; },
          { condition: &apos;Asthma&apos;, likelihood: &apos;moderate&apos;, features: &apos;Episodic, triggers, wheezing, family history, atopy&apos; },
          { condition: &apos;Interstitial Lung Disease&apos;, likelihood: &apos;low&apos;, features: &apos;Progressive, dry cough, fine crackles, occupational exposure&apos; },
          { condition: &apos;Pulmonary Hypertension&apos;, likelihood: &apos;low&apos;, features: &apos;Exertional dyspnea, fatigue, syncope, loud P2&apos; },
          { condition: &apos;Anemia&apos;, likelihood: &apos;moderate&apos;, features: &apos;Fatigue, pallor, exertional symptoms, menorrhagia&apos; }
        ],
        &apos;Cardiac Causes&apos;: [
          { condition: &apos;Systolic Heart Failure (HFrEF)&apos;, likelihood: &apos;high&apos;, features: &apos;EF <40%, dilated ventricle, S3 gallop&apos; },
          { condition: &apos;Diastolic Heart Failure (HFpEF)&apos;, likelihood: &apos;high&apos;, features: &apos;Normal EF, elderly, hypertension, diabetes&apos; },
          { condition: &apos;Valvular Disease&apos;, likelihood: &apos;moderate&apos;, features: &apos;Murmur, elderly, rheumatic disease, progressive symptoms&apos; },
          { condition: &apos;Arrhythmias&apos;, likelihood: &apos;moderate&apos;, features: &apos;Palpitations, irregular pulse, sudden onset&apos; },
          { condition: &apos;Pericardial Disease&apos;, likelihood: &apos;low&apos;, features: &apos;Chest pain, friction rub, recent viral illness&apos; }
        ]
      },
      clinicalAssessment: {
        &apos;Functional Classification (NYHA)&apos;: [
          &apos;Class I: No limitation - normal activity without symptoms&apos;,
          &apos;Class II: Slight limitation - symptoms with ordinary activity&apos;,
          &apos;Class III: Marked limitation - symptoms with less than ordinary activity&apos;,
          &apos;Class IV: Severe limitation - symptoms at rest&apos;
        ],
        &apos;Orthopnea Assessment&apos;: [
          &apos;Number of pillows needed to sleep comfortably&apos;,
          &apos;Inability to lie flat due to dyspnea&apos;,
          &apos;Suggests heart failure or severe lung disease&apos;
        ],
        &apos;Paroxysmal Nocturnal Dyspnea (PND)&apos;: [
          &apos;Awakening from sleep with severe dyspnea&apos;,
          &apos;Relief by sitting up or standing&apos;,
          &apos;Classic for heart failure&apos;
        ]
      },
      redFlags: [
        &apos;Severe respiratory distress (unable to speak in full sentences)&apos;,
        &apos;Hypoxemia (O2 saturation <90% on room air)&apos;,
        &apos;Signs of shock (hypotension, altered mental status)&apos;,
        &apos;Chest pain with dyspnea (MI, PE, pneumothorax)&apos;,
        &apos;Hemoptysis with acute dyspnea (PE, pneumonia)&apos;,
        &apos;Stridor (upper airway obstruction)&apos;,
        &apos;Asymmetric breath sounds (pneumothorax, massive pleural effusion)&apos;,
        &apos;Signs of anaphylaxis (urticaria, angioedema)&apos;,
        &apos;Acute dyspnea in high-risk PE patient (recent surgery, malignancy)&apos;
      ],
      riskStratification: {
        &apos;Pulmonary Embolism (Wells Score)&apos;: [
          &apos;Clinical signs of DVT (3 points)&apos;,
          &apos;PE more likely than alternative diagnosis (3 points)&apos;,
          &apos;Heart rate >100 (1.5 points)&apos;,
          &apos;Immobilization/surgery in past 4 weeks (1.5 points)&apos;,
          &apos;Previous PE/DVT (1.5 points)&apos;,
          &apos;Hemoptysis (1 point)&apos;,
          &apos;Malignancy (1 point)&apos;
        ],
        &apos;Heart Failure Risk Factors&apos;: [
          &apos;Coronary artery disease&apos;,
          &apos;Hypertension&apos;,
          &apos;Diabetes mellitus&apos;,
          &apos;Previous MI&apos;,
          &apos;Valvular disease&apos;,
          &apos;Cardiomyopathy&apos;
        ]
      },
      diagnosticApproach: {
        &apos;Acute Dyspnea Workup&apos;: [
          &apos;Chest X-ray (pneumonia, pneumothorax, pulmonary edema)&apos;,
          &apos;ECG (MI, arrhythmias)&apos;,
          &apos;Arterial blood gas or pulse oximetry&apos;,
          &apos;D-dimer (if PE suspected and low-intermediate probability)&apos;,
          &apos;BNP/NT-proBNP (heart failure)&apos;,
          &apos;Complete blood count (anemia)&apos;
        ],
        &apos;Chronic Dyspnea Workup&apos;: [
          &apos;Echocardiogram (heart failure, valvular disease)&apos;,
          &apos;Pulmonary function tests (asthma, COPD, restrictive disease)&apos;,
          &apos;Chest CT (interstitial lung disease, malignancy)&apos;,
          &apos;Exercise stress testing (cardiac vs pulmonary limitation)&apos;,
          &apos;Cardiopulmonary exercise testing (if unclear etiology)&apos;
        ]
      },
      physicalExamFindings: {
        &apos;Heart Failure&apos;: [
          &apos;Elevated JVD, S3 gallop, displaced PMI&apos;,
          &apos;Bilateral lower extremity edema&apos;,
          &apos;Hepatomegaly, ascites (right heart failure)&apos;
        ],
        &apos;Pneumonia&apos;: [
          &apos;Fever, tachypnea, decreased breath sounds&apos;,
          &apos;Crackles, bronchial breath sounds&apos;,
          &apos;Dullness to percussion&apos;
        ],
        &apos;COPD&apos;: [
          &apos;Barrel chest, pursed lip breathing&apos;,
          &apos;Decreased breath sounds, wheeze&apos;,
          &apos;Hyperresonance to percussion&apos;
        ],
        &apos;Asthma&apos;: [
          &apos;Wheeze (inspiratory and expiratory)&apos;,
          &apos;Prolonged expiratory phase&apos;,
          &apos;Use of accessory muscles&apos;
        ]
      },
      ageGenderFactors: {
        &apos;Young Adults (20-40)&apos;: [&apos;Asthma&apos;, &apos;Pneumothorax&apos;, &apos;Anxiety&apos;, &apos;Pulmonary embolism&apos;],
        &apos;Middle Age (40-65)&apos;: [&apos;Coronary artery disease&apos;, &apos;Heart failure&apos;, &apos;COPD&apos;, &apos;Pulmonary embolism&apos;],
        &apos;Elderly (>65)&apos;: [&apos;Heart failure&apos;, &apos;COPD&apos;, &apos;Pneumonia&apos;, &apos;Pulmonary embolism&apos;],
        &apos;Women&apos;: [&apos;Pulmonary embolism (pregnancy, OCP)&apos;, &apos;Anxiety disorders&apos;, &apos;Autoimmune diseases&apos;],
        &apos;Men&apos;: [&apos;Coronary artery disease&apos;, &apos;COPD (smoking)&apos;, &apos;Pneumothorax (tall, thin)&apos;],
        &apos;Pregnancy&apos;: [&apos;Peripartum cardiomyopathy&apos;, &apos;Pulmonary embolism&apos;, &apos;Asthma exacerbation&apos;]
      },
      treatmentPriorities: {
        &apos;Immediate (Emergency)&apos;: [
          &apos;Oxygen therapy if hypoxemic&apos;,
          &apos;IV access and cardiac monitoring&apos;,
          &apos;Chest X-ray and ECG&apos;,
          &apos;Consider thrombolytics for massive PE&apos;,
          &apos;Diuretics for acute pulmonary edema&apos;
        ],
        &apos;Acute Stabilization&apos;: [
          &apos;Bronchodilators for asthma/COPD&apos;,
          &apos;Antibiotics for pneumonia&apos;,
          &apos;Anticoagulation for PE&apos;,
          &apos;Anxiolytics for panic (after excluding organic causes)&apos;
        ],
        &apos;Chronic Management&apos;: [
          &apos;Heart failure medications (ACE-I, beta-blockers, diuretics)&apos;,
          &apos;Pulmonary rehabilitation for COPD&apos;,
          &apos;Inhaled medications for asthma&apos;,
          &apos;Oxygen therapy if chronically hypoxemic&apos;
        ]
      },
      urgency: &apos;immediate&apos;,
      clinicalPearls: [
        &apos;Dyspnea at rest is always concerning and requires urgent evaluation&apos;,
        &apos;BNP/NT-proBNP >400 pg/mL suggests heart failure as cause&apos;,
        &apos;D-dimer has high sensitivity but low specificity for PE&apos;,
        &apos;Orthopnea and PND are highly specific for heart failure&apos;,
        &apos;Pink frothy sputum is pathognomonic for pulmonary edema&apos;,
        &apos;Unilateral leg swelling suggests DVT; bilateral suggests heart failure&apos;,
        &apos;Normal chest X-ray does not rule out PE or early pneumonia&apos;,
        &apos;Anxiety can cause dyspnea but is a diagnosis of exclusion&apos;,
        &apos;Platypnea-orthodeoxia: dyspnea when upright (hepatopulmonary syndrome)&apos;,
        &apos;Silent MI common in diabetics and elderly - dyspnea may be only symptom&apos;
      ]
    },
    &apos;dizziness&apos;: {
      pivotalPoints: [
        &apos;Four main subtypes: vertigo, presyncope, disequilibrium, and lightheadedness&apos;,
        &apos;Timing and triggers help distinguish peripheral from central vertigo&apos;,
        &apos;Associated neurologic symptoms suggest central (brainstem/cerebellar) pathology&apos;,
        &apos;Orthostatic vital signs are crucial for presyncope evaluation&apos;
      ],
      questions: [
        &apos;Can you describe exactly what you mean by "dizzy" - do you feel like the room is spinning?&apos;,
        &apos;Does it feel like you might faint or pass out?&apos;,
        &apos;Do you feel unsteady on your feet or off-balance?&apos;,
        &apos;When did the dizziness start and how long does each episode last?&apos;,
        &apos;What triggers the dizziness (head movements, standing up, lying down)?&apos;,
        &apos;Any nausea or vomiting with the dizziness?&apos;,
        &apos;Any hearing loss, ringing in ears, or ear fullness?&apos;,
        &apos;Any headache, double vision, or trouble speaking?&apos;,
        &apos;Any numbness, tingling, or weakness anywhere?&apos;,
        &apos;Do you feel dizzy when lying completely still?&apos;,
        &apos;Any recent upper respiratory infection or ear infection?&apos;,
        &apos;Any new medications or changes in medications?&apos;,
        &apos;Do you have high blood pressure, diabetes, or heart problems?&apos;,
        &apos;Any recent head injury or whiplash?&apos;,
        &apos;Does the dizziness happen when you roll over in bed?&apos;,
        &apos;Any chest pain, palpitations, or shortness of breath?&apos;,
        &apos;Have you had any falls or near-falls?&apos;
      ],
      differentials: {
        &apos;Peripheral Vertigo (Inner Ear)&apos;: [
          { condition: &apos;Benign Paroxysmal Positional Vertigo (BPPV)&apos;, likelihood: &apos;very high&apos;, features: &apos;Brief episodes with head movement, Dix-Hallpike positive, no hearing loss&apos; },
          { condition: &apos;Vestibular Neuritis/Labyrinthitis&apos;, likelihood: &apos;moderate&apos;, features: &apos;Sudden onset, continuous vertigo, nausea/vomiting, recent viral illness&apos; },
          { condition: &apos;Ménière\&apos;s Disease&apos;, likelihood: &apos;low&apos;, features: &apos;Episodic vertigo, fluctuating hearing loss, tinnitus, ear fullness&apos; },
          { condition: &apos;Vestibular Migraine&apos;, likelihood: &apos;moderate&apos;, features: &apos;Episodic vertigo, migraine history, photophobia, phonophobia&apos; },
          { condition: &apos;Medication-Induced (Ototoxicity)&apos;, likelihood: &apos;low&apos;, features: &apos;Aminoglycosides, loop diuretics, chemotherapy, bilateral symptoms&apos; }
        ],
        &apos;Central Vertigo (Brainstem/Cerebellum)&apos;: [
          { condition: &apos;Posterior Circulation Stroke/TIA&apos;, likelihood: &apos;low but critical&apos;, features: &apos;Acute onset, neurologic deficits, vascular risk factors&apos; },
          { condition: &apos;Vestibular Migraine&apos;, likelihood: &apos;moderate&apos;, features: &apos;Episodic, migraine history, visual aura, family history&apos; },
          { condition: &apos;Multiple Sclerosis&apos;, likelihood: &apos;low&apos;, features: &apos;Young adults, other neurologic symptoms, relapsing-remitting&apos; },
          { condition: &apos;Acoustic Neuroma&apos;, likelihood: &apos;rare&apos;, features: &apos;Gradual unilateral hearing loss, tinnitus, facial numbness&apos; },
          { condition: &apos;Cerebellar Pathology&apos;, likelihood: &apos;low&apos;, features: &apos;Ataxia, dysmetria, nystagmus, headache&apos; }
        ],
        &apos;Presyncope (Near-Fainting)&apos;: [
          { condition: &apos;Orthostatic Hypotension&apos;, likelihood: &apos;high&apos;, features: &apos;Dizziness when standing, elderly, medications, dehydration&apos; },
          { condition: &apos;Vasovagal Syncope&apos;, likelihood: &apos;moderate&apos;, features: &apos;Situational triggers, prodromal symptoms, young adults&apos; },
          { condition: &apos;Cardiac Arrhythmias&apos;, likelihood: &apos;moderate&apos;, features: &apos;Palpitations, structural heart disease, sudden onset&apos; },
          { condition: &apos;Medication-Induced&apos;, likelihood: &apos;high&apos;, features: &apos;Antihypertensives, diuretics, antidepressants, polypharmacy&apos; },
          { condition: &apos;Volume Depletion&apos;, likelihood: &apos;moderate&apos;, features: &apos;Poor oral intake, diarrhea, diuretics, heat exposure&apos; }
        ],
        &apos;Disequilibrium (Imbalance)&apos;: [
          { condition: &apos;Multisensory Dizziness&apos;, likelihood: &apos;high&apos;, features: &apos;Elderly, multiple deficits (vision, hearing, proprioception, vestibular)&apos; },
          { condition: &apos;Cerebellar Dysfunction&apos;, likelihood: &apos;low&apos;, features: &apos;Ataxia, alcohol use, medications, genetic disorders&apos; },
          { condition: &apos;Peripheral Neuropathy&apos;, likelihood: &apos;moderate&apos;, features: &apos;Diabetes, alcohol, B12 deficiency, stocking-glove distribution&apos; },
          { condition: &apos;Parkinson\&apos;s Disease&apos;, likelihood: &apos;low&apos;, features: &apos;Bradykinesia, rigidity, tremor, postural instability&apos; }
        ],
        &apos;Psychogenic/Psychiatric&apos;: [
          { condition: &apos;Anxiety/Panic Disorder&apos;, likelihood: &apos;moderate&apos;, features: &apos;Palpitations, sweating, fear, trigger situations&apos; },
          { condition: &apos;Depression&apos;, likelihood: &apos;low&apos;, features: &apos;Persistent lightheadedness, mood symptoms, anhedonia&apos; },
          { condition: &apos;Hyperventilation Syndrome&apos;, likelihood: &apos;low&apos;, features: &apos;Rapid breathing, paresthesias, carpopedal spasm&apos; }
        ]
      },
      clinicalTests: {
        &apos;BPPV Assessment&apos;: [
          &apos;Dix-Hallpike Test: Head turned 45°, rapid move to lying with head hanging&apos;,
          &apos;Supine Roll Test: For horizontal canal BPPV&apos;,
          &apos;Positive: Rotatory nystagmus with latency, fatigue, reproduction of vertigo&apos;
        ],
        &apos;Vestibular Function&apos;: [
          &apos;Head Impulse Test (HIT): Rapid head turn, catch-up saccades suggest peripheral&apos;,
          &apos;Romberg Test: Eyes closed, increased sway suggests sensory ataxia&apos;,
          &apos;Tandem Gait: Walking heel-to-toe, tests cerebellar function&apos;
        ],
        &apos;Orthostatic Vitals&apos;: [
          &apos;Lying BP/HR → Standing BP/HR after 3 minutes&apos;,
          &apos;Positive: SBP drop ≥20 mmHg or DBP drop ≥10 mmHg&apos;,
          &apos;Or HR increase ≥30 bpm (POTS if no BP drop)&apos;
        ]
      },
      redFlags: [
        &apos;Acute vertigo with neurologic deficits (stroke/TIA)&apos;,
        &apos;Sudden severe headache with dizziness (SAH, posterior fossa mass)&apos;,
        &apos;Diplopia, dysarthria, or dysphagia (brainstem pathology)&apos;,
        &apos;Focal neurologic deficits (weakness, numbness, ataxia)&apos;,
        &apos;New-onset vertigo in elderly with vascular risk factors&apos;,
        &apos;Hearing loss with vertigo (especially unilateral, sudden)&apos;,
        &apos;Chest pain or palpitations with presyncope (cardiac cause)&apos;,
        &apos;Syncope or near-syncope (especially if recurrent)&apos;,
        &apos;Signs of increased intracranial pressure&apos;
      ],
      differentiatingFeatures: {
        &apos;Peripheral vs Central Vertigo&apos;: [
          &apos;Peripheral: Horizontal/rotatory nystagmus, hearing symptoms, no neurologic deficits&apos;,
          &apos;Central: Vertical nystagmus, neurologic deficits, no hearing loss, constant symptoms&apos;
        ],
        &apos;BPPV vs Vestibular Neuritis&apos;: [
          &apos;BPPV: Brief episodes (<1 min), positional, Dix-Hallpike positive&apos;,
          &apos;Vestibular Neuritis: Continuous vertigo, days duration, spontaneous nystagmus&apos;
        ],
        &apos;Ménière\&apos;s vs Migraine&apos;: [
          &apos;Ménière\&apos;s: Hearing loss, tinnitus, ear fullness, 20min-24hr episodes&apos;,
          &apos;Migraine: Headache, photophobia, phonophobia, triggers, family history&apos;
        ]
      },
      timingPatterns: {
        &apos;Seconds&apos;: &apos;BPPV (typically <60 seconds)&apos;,
        &apos;Minutes to Hours&apos;: &apos;Migraine, panic attacks, TIA&apos;,
        &apos;Hours to Days&apos;: &apos;Vestibular neuritis, Ménière\&apos;s attack&apos;,
        &apos;Continuous&apos;: &apos;Medication effects, central lesions, anxiety&apos;,
        &apos;Episodic/Recurrent&apos;: &apos;BPPV, Ménière\&apos;s, migraine, cardiac arrhythmias&apos;
      },
      ageGenderFactors: {
        &apos;Young Adults (20-40)&apos;: [&apos;BPPV&apos;, &apos;Vestibular migraine&apos;, &apos;Anxiety/panic&apos;, &apos;Multiple sclerosis&apos;],
        &apos;Middle Age (40-65)&apos;: [&apos;BPPV&apos;, &apos;Ménière\&apos;s disease&apos;, &apos;Medication effects&apos;, &apos;Cardiac arrhythmias&apos;],
        &apos;Elderly (>65)&apos;: [&apos;BPPV&apos;, &apos;Orthostatic hypotension&apos;, &apos;Multisensory dizziness&apos;, &apos;Medication effects&apos;],
        &apos;Women&apos;: [&apos;Vestibular migraine (3:1 ratio)&apos;, &apos;BPPV (2:1 ratio)&apos;, &apos;Thyroid disorders&apos;],
        &apos;Men&apos;: [&apos;Ménière\&apos;s disease&apos;, &apos;Acoustic neuroma&apos;, &apos;Cardiovascular causes&apos;]
      },
      medicationCauses: {
        &apos;Ototoxic&apos;: [&apos;Aminoglycosides&apos;, &apos;Loop diuretics&apos;, &apos;Aspirin (high dose)&apos;, &apos;Chemotherapy agents&apos;],
        &apos;Hypotensive&apos;: [&apos;ACE inhibitors&apos;, &apos;ARBs&apos;, &apos;Beta-blockers&apos;, &apos;Diuretics&apos;],
        &apos;Sedating&apos;: [&apos;Benzodiazepines&apos;, &apos;Antihistamines&apos;, &apos;Antidepressants&apos;, &apos;Anticonvulsants&apos;],
        &apos;Other&apos;: [&apos;Antiarrhythmics&apos;, &apos;Antibiotics&apos;, &apos;NSAIDs&apos;, &apos;Alcohol&apos;]
      },
      treatmentApproach: {
        &apos;BPPV&apos;: [
          &apos;Canalith repositioning procedures (Epley maneuver)&apos;,
          &apos;Home exercises (Brandt-Daroff)&apos;,
          &apos;Avoid prolonged bed rest&apos;
        ],
        &apos;Vestibular Neuritis&apos;: [
          &apos;Corticosteroids (if early presentation)&apos;,
          &apos;Vestibular suppressants (short-term only)&apos;,
          &apos;Vestibular rehabilitation therapy&apos;
        ],
        &apos;Orthostatic Hypotension&apos;: [
          &apos;Medication review and adjustment&apos;,
          &apos;Increased fluid/salt intake&apos;,
          &apos;Compression stockings&apos;,
          &apos;Fludrocortisone if severe&apos;
        ],
        &apos;Vestibular Migraine&apos;: [
          &apos;Migraine prophylaxis&apos;,
          &apos;Trigger identification and avoidance&apos;,
          &apos;Vestibular rehabilitation&apos;
        ]
      },
      urgency: &apos;varies&apos;,
      clinicalPearls: [
        &apos;BPPV is the most common cause of vertigo (35% of cases)&apos;,
        &apos;True vertigo (spinning sensation) suggests vestibular pathology&apos;,
        &apos;Vertical nystagmus always suggests central (brainstem) pathology&apos;,
        &apos;Dix-Hallpike test is 79% sensitive, 75% specific for posterior canal BPPV&apos;,
        &apos;Orthostatic hypotension is common in elderly (20% prevalence)&apos;,
        &apos;Vestibular suppressants should be used sparingly (delay compensation)&apos;,
        &apos;Most peripheral vertigo is self-limiting and improves with compensation&apos;,
        &apos;HINTS exam (Head Impulse, Nystagmus, Test of Skew) helps distinguish central vs peripheral&apos;,
        &apos;Ménière\&apos;s triad: vertigo, hearing loss, tinnitus (but not always complete)&apos;,
        &apos;Medication review is essential - polypharmacy common cause in elderly&apos;
      ]
    },
    &apos;diarrhea&apos;: {
      pivotalPoints: [
        &apos;Duration distinguishes acute (<14 days) vs chronic (>4 weeks) diarrhea&apos;,
        &apos;Presence of blood, fever, and systemic symptoms suggests inflammatory diarrhea&apos;,
        &apos;Travel history and food exposure guide infectious etiology assessment&apos;,
        &apos;Dehydration assessment is critical for determining treatment urgency&apos;
      ],
      questions: [
        &apos;How long have you had diarrhea (hours, days, weeks)?&apos;,
        &apos;How many bowel movements per day are you having?&apos;,
        &apos;What does the stool look like (watery, bloody, mucousy, greasy)?&apos;,
        &apos;Do you have fever, chills, or feel generally unwell?&apos;,
        &apos;Any abdominal pain or cramping? Where is it located?&apos;,
        &apos;Any nausea or vomiting?&apos;,
        &apos;Are you able to keep fluids down?&apos;,
        &apos;Do you feel dizzy when standing up?&apos;,
        &apos;Any recent travel, especially internationally?&apos;,
        &apos;What have you eaten in the past 72 hours? Any dining out, picnics, or unusual foods?&apos;,
        &apos;Has anyone else who ate with you become sick?&apos;,
        &apos;Any recent antibiotic use in the past month?&apos;,
        &apos;Do you take any medications regularly?&apos;,
        &apos;Any known food allergies or lactose intolerance?&apos;,
        &apos;Have you been camping or drinking untreated water?&apos;,
        &apos;Any recent hospitalization or healthcare facility exposure?&apos;,
        &apos;Do you have any chronic medical conditions?&apos;
      ],
      differentials: {
        &apos;Infectious Diarrhea (Most Common Acute)&apos;: [
          { condition: &apos;Viral Gastroenteritis (Norovirus, Rotavirus)&apos;, likelihood: &apos;very high&apos;, features: &apos;Watery diarrhea, vomiting, short duration (24-72h), family clusters&apos; },
          { condition: &apos;Bacterial Food Poisoning&apos;, likelihood: &apos;high&apos;, features: &apos;Rapid onset (1-6h), nausea/vomiting, specific food exposure&apos; },
          { condition: &apos;Campylobacter jejuni&apos;, likelihood: &apos;moderate&apos;, features: &apos;Bloody diarrhea, fever, abdominal pain, poultry exposure&apos; },
          { condition: &apos;Salmonella (non-typhi)&apos;, likelihood: &apos;moderate&apos;, features: &apos;Bloody diarrhea, fever, eggs/poultry, pet reptiles&apos; },
          { condition: &apos;Shigella&apos;, likelihood: &apos;moderate&apos;, features: &apos;Bloody diarrhea, fever, person-to-person spread, daycare&apos; },
          { condition: &apos;E. coli (STEC/EHEC)&apos;, likelihood: &apos;low&apos;, features: &apos;Bloody diarrhea, severe cramping, ground beef, HUS risk&apos; },
          { condition: &apos;C. difficile&apos;, likelihood: &apos;moderate&apos;, features: &apos;Recent antibiotics, healthcare exposure, pseudomembranous colitis&apos; }
        ],
        &apos;Non-Infectious Causes&apos;: [
          { condition: &apos;Medication-Induced&apos;, likelihood: &apos;high&apos;, features: &apos;Recent medication changes, antibiotics, laxatives, antacids&apos; },
          { condition: &apos;Food Intolerance&apos;, likelihood: &apos;moderate&apos;, features: &apos;Lactose intolerance, artificial sweeteners, specific food triggers&apos; },
          { condition: &apos;Inflammatory Bowel Disease Flare&apos;, likelihood: &apos;low&apos;, features: &apos;Known IBD, bloody diarrhea, extraintestinal symptoms&apos; },
          { condition: &apos;Ischemic Colitis&apos;, likelihood: &apos;low&apos;, features: &apos;Elderly, vascular disease, left-sided abdominal pain&apos; },
          { condition: &apos;Hyperthyroidism&apos;, likelihood: &apos;low&apos;, features: &apos;Weight loss, palpitations, heat intolerance&apos; }
        ],
        &apos;Traveler\&apos;s Diarrhea&apos;: [
          { condition: &apos;Enterotoxigenic E. coli (ETEC)&apos;, likelihood: &apos;very high&apos;, features: &apos;Most common, watery diarrhea, developing countries&apos; },
          { condition: &apos;Campylobacter&apos;, likelihood: &apos;moderate&apos;, features: &apos;Bloody diarrhea, Southeast Asia&apos; },
          { condition: &apos;Shigella&apos;, likelihood: &apos;moderate&apos;, features: &apos;Bloody diarrhea, poor sanitation areas&apos; },
          { condition: &apos;Parasites (Giardia, Cryptosporidium)&apos;, likelihood: &apos;low&apos;, features: &apos;Prolonged symptoms, camping, untreated water&apos; }
        ],
        &apos;Severe Complications&apos;: [
          { condition: &apos;Hemolytic Uremic Syndrome (HUS)&apos;, likelihood: &apos;rare&apos;, features: &apos;E. coli O157:H7, bloody diarrhea, kidney failure, hemolysis&apos; },
          { condition: &apos;Toxic Megacolon&apos;, likelihood: &apos;rare&apos;, features: &apos;C. diff, IBD, severe illness, colonic distension&apos; },
          { condition: &apos;Severe Dehydration/Shock&apos;, likelihood: &apos;varies&apos;, features: &apos;High-volume losses, elderly, comorbidities&apos; }
        ]
      },
      clinicalAssessment: {
        &apos;Inflammatory vs Non-inflammatory&apos;: [
          &apos;Inflammatory: Blood/mucus, fever, fecal WBCs, severe cramping&apos;,
          &apos;Non-inflammatory: Watery, no fever, no blood, periumbilical cramping&apos;
        ],
        &apos;Dehydration Assessment&apos;: [
          &apos;Mild (3-5%): Thirst, dry mouth, decreased urine&apos;,
          &apos;Moderate (6-9%): Orthostatic changes, sunken eyes, skin tenting&apos;,
          &apos;Severe (>10%): Shock, altered mental status, oliguria&apos;
        ]
      },
      redFlags: [
        &apos;Signs of severe dehydration (hypotension, altered mental status)&apos;,
        &apos;High fever >101.3°F (39.5°C) with bloody diarrhea&apos;,
        &apos;Severe abdominal pain with peritoneal signs&apos;,
        &apos;Signs of HUS (oliguria, pallor, petechiae)&apos;,
        &apos;Age >65 with severe symptoms&apos;,
        &apos;Immunocompromised patient with diarrhea&apos;,
        &apos;Recent antibiotic use with severe colitis symptoms&apos;,
        &apos;Profuse watery diarrhea (>1L/hour - cholera-like)&apos;,
        &apos;Inability to maintain oral hydration&apos;
      ],
      foodPoisoningTimeframes: {
        &apos;1-6 hours (Preformed Toxins)&apos;: [
          &apos;S. aureus (dairy, mayonnaise, cream)&apos;,
          &apos;B. cereus (fried rice, pasta)&apos;,
          &apos;C. perfringens (meat, poultry)&apos;
        ],
        &apos;8-22 hours&apos;: [
          &apos;C. perfringens (delayed form)&apos;,
          &apos;B. cereus (diarrheal form)&apos;
        ],
        &apos;1-3 days&apos;: [
          &apos;Salmonella (eggs, poultry)&apos;,
          &apos;Campylobacter (poultry)&apos;,
          &apos;Shigella (person-to-person)&apos;
        ],
        &apos;3-5 days&apos;: [
          &apos;E. coli O157:H7 (ground beef)&apos;,
          &apos;Yersinia (pork, dairy)&apos;
        ]
      },
      riskFactors: {
        &apos;High Risk Patients&apos;: [
          &apos;Age >65 or <2 years&apos;,
          &apos;Immunocompromised (HIV, transplant, chemotherapy)&apos;,
          &apos;Chronic medical conditions (diabetes, kidney disease)&apos;,
          &apos;Pregnancy&apos;,
          &apos;Inflammatory bowel disease&apos;
        ],
        &apos;Severe Disease Risk&apos;: [
          &apos;Recent antibiotic use (C. diff risk)&apos;,
          &apos;Proton pump inhibitor use&apos;,
          &apos;Recent hospitalization&apos;,
          &apos;Travel to high-risk areas&apos;
        ]
      },
      diagnosticApproach: {
        &apos;Stool Testing Indications&apos;: [
          &apos;Fever + bloody diarrhea&apos;,
          &apos;Severe dehydration&apos;,
          &apos;Duration >7 days&apos;,
          &apos;Recent antibiotic use (C. diff)&apos;,
          &apos;Immunocompromised patient&apos;,
          &apos;Food handler or healthcare worker&apos;,
          &apos;Outbreak investigation&apos;
        ],
        &apos;Stool Tests&apos;: [
          &apos;Stool culture (Salmonella, Shigella, Campylobacter)&apos;,
          &apos;C. diff toxin (if recent antibiotics)&apos;,
          &apos;Ova and parasites (if travel history)&apos;,
          &apos;Fecal WBCs or lactoferrin (inflammatory markers)&apos;
        ]
      },
      treatmentApproach: {
        &apos;Supportive Care (Most Cases)&apos;: [
          &apos;Oral rehydration therapy (ORS preferred)&apos;,
          &apos;BRAT diet progression (bananas, rice, applesauce, toast)&apos;,
          &apos;Probiotics (may reduce duration)&apos;,
          &apos;Avoid antidiarrheals if bloody stool or fever&apos;
        ],
        &apos;Antibiotic Indications (Limited)&apos;: [
          &apos;Traveler\&apos;s diarrhea (severe)&apos;,
          &apos;Shigella (shortens duration)&apos;,
          &apos;C. diff colitis (oral vancomycin/fidaxomicin)&apos;,
          &apos;Campylobacter (if early in course)&apos;
        ],
        &apos;Antidiarrheal Agents&apos;: [
          &apos;Loperamide: Safe if no fever/blood&apos;,
          &apos;Bismuth subsalicylate: Anti-inflammatory effects&apos;,
          &apos;Avoid if bloody stool (may worsen E. coli)&apos;
        ]
      },
      ageGenderFactors: {
        &apos;Infants/Children&apos;: [&apos;Rotavirus&apos;, &apos;Higher dehydration risk&apos;, &apos;Different rehydration protocols&apos;],
        &apos;Young Adults&apos;: [&apos;Traveler\&apos;s diarrhea&apos;, &apos;Food poisoning&apos;, &apos;IBD onset&apos;],
        &apos;Middle Age&apos;: [&apos;C. diff (antibiotic use)&apos;, &apos;Medication-induced&apos;, &apos;Food intolerance&apos;],
        &apos;Elderly&apos;: [&apos;Higher complication risk&apos;, &apos;Medication-induced&apos;, &apos;C. diff&apos;, &apos;Ischemic colitis&apos;],
        &apos;Immunocompromised&apos;: [&apos;Opportunistic infections&apos;, &apos;Severe/prolonged course&apos;, &apos;Parasites&apos;]
      },
      preventionEducation: {
        &apos;Food Safety&apos;: [
          &apos;Cook meat to proper temperatures&apos;,
          &apos;Avoid raw eggs and unpasteurized dairy&apos;,
          &apos;Proper food storage and refrigeration&apos;,
          &apos;Hand hygiene before eating&apos;
        ],
        &apos;Travel Precautions&apos;: [
          &apos;Bottled or boiled water&apos;,
          &apos;Avoid ice, raw vegetables, street food&apos;,
          &apos;Peel fruits yourself&apos;,
          &apos;Consider prophylactic antibiotics (high-risk travelers)&apos;
        ]
      },
      urgency: &apos;varies&apos;,
      clinicalPearls: [
        &apos;Most acute diarrhea is viral and self-limiting (2-3 days)&apos;,
        &apos;Antibiotics not indicated for most cases and may worsen E. coli O157:H7&apos;,
        &apos;ORS is superior to plain water for rehydration&apos;,
        &apos;Bloody diarrhea always requires evaluation for bacterial causes&apos;,
        &apos;C. diff should be suspected with recent antibiotic use&apos;,
        &apos;Antidiarrheals contraindicated with fever or blood in stool&apos;,
        &apos;Traveler\&apos;s diarrhea: "Cook it, peel it, or forget it"&apos;,
        &apos;HUS typically occurs 5-7 days after E. coli diarrhea onset&apos;,
        &apos;Probiotics may reduce antibiotic-associated diarrhea&apos;,
        &apos;Lactose intolerance can develop after infectious gastroenteritis&apos;
      ]
    },
    &apos;diabetes symptoms&apos;: {
      pivotalPoints: [
        &apos;Classic triad: polyuria, polydipsia, polyphagia with weight loss suggests diabetes&apos;,
        &apos;Age at onset and autoantibodies distinguish type 1 from type 2 diabetes&apos;,
        &apos;Acute complications (DKA, HHS) are medical emergencies requiring immediate treatment&apos;,
        &apos;Chronic complications affect multiple organ systems and require systematic screening&apos;
      ],
      questions: [
        &apos;How long have you been experiencing increased thirst and urination?&apos;,
        &apos;Have you noticed increased hunger despite eating more?&apos;,
        &apos;Any unexplained weight loss recently?&apos;,
        &apos;Do you feel unusually tired or fatigued?&apos;,
        &apos;Any blurred vision or changes in your eyesight?&apos;,
        &apos;Do you have frequent infections, especially skin or urinary tract?&apos;,
        &apos;Any slow-healing cuts or wounds?&apos;,
        &apos;At what age did your symptoms start?&apos;,
        &apos;Any family history of diabetes (parents, siblings)?&apos;,
        &apos;What is your current weight and has it changed recently?&apos;,
        &apos;Any abdominal pain, nausea, or vomiting?&apos;,
        &apos;Have you been breathing heavily or noticed fruity breath odor?&apos;,
        &apos;Any numbness, tingling, or burning in hands or feet?&apos;,
        &apos;Do you check your blood sugar at home? What are typical readings?&apos;,
        &apos;Any history of high blood pressure or high cholesterol?&apos;,
        &apos;For women: Any history of gestational diabetes or large babies (>9 lbs)?&apos;,
        &apos;Any medications you\&apos;re currently taking?&apos;
      ],
      differentials: {
        &apos;New Diabetes Diagnosis&apos;: [
          { condition: &apos;Type 2 Diabetes Mellitus&apos;, likelihood: &apos;very high&apos;, features: &apos;Age >45, obesity, family history, gradual onset, insulin resistance&apos; },
          { condition: &apos;Type 1 Diabetes Mellitus&apos;, likelihood: &apos;moderate&apos;, features: &apos;Age <30, lean body habitus, acute onset, autoimmune destruction&apos; },
          { condition: &apos;Maturity-Onset Diabetes of Young (MODY)&apos;, likelihood: &apos;low&apos;, features: &apos;Strong family history, age <25, non-obese, autosomal dominant&apos; },
          { condition: &apos;Secondary Diabetes&apos;, likelihood: &apos;low&apos;, features: &apos;Pancreatic disease, medications (steroids), endocrine disorders&apos; },
          { condition: &apos;Gestational Diabetes&apos;, likelihood: &apos;varies&apos;, features: &apos;Pregnancy, previous GDM, family history, obesity&apos; }
        ],
        &apos;Acute Complications&apos;: [
          { condition: &apos;Diabetic Ketoacidosis (DKA)&apos;, likelihood: &apos;high risk T1DM&apos;, features: &apos;Glucose >250, ketones, acidosis, dehydration, Kussmaul breathing&apos; },
          { condition: &apos;Hyperosmolar Hyperglycemic State (HHS)&apos;, likelihood: &apos;high risk T2DM&apos;, features: &apos;Glucose >600, severe dehydration, altered mental status, no ketosis&apos; },
          { condition: &apos;Severe Hypoglycemia&apos;, likelihood: &apos;treated diabetics&apos;, features: &apos;Glucose <70, neuroglycopenic symptoms, treated with insulin/sulfonylureas&apos; },
          { condition: &apos;Diabetic Lactic Acidosis&apos;, likelihood: &apos;low&apos;, features: &apos;Metformin use, kidney dysfunction, severe illness&apos; }
        ],
        &apos;Chronic Complications&apos;: [
          { condition: &apos;Diabetic Nephropathy&apos;, likelihood: &apos;high&apos;, features: &apos;Proteinuria, declining GFR, hypertension, duration >10 years&apos; },
          { condition: &apos;Diabetic Retinopathy&apos;, likelihood: &apos;high&apos;, features: &apos;Microaneurysms, hemorrhages, exudates, duration-dependent&apos; },
          { condition: &apos;Diabetic Neuropathy&apos;, likelihood: &apos;very high&apos;, features: &apos;Distal symmetric sensory loss, burning feet, autonomic dysfunction&apos; },
          { condition: &apos;Diabetic Foot Disease&apos;, likelihood: &apos;high&apos;, features: &apos;Neuropathy + vascular disease, ulcerations, infections&apos; },
          { condition: &apos;Accelerated Atherosclerosis&apos;, likelihood: &apos;very high&apos;, features: &apos;CAD, stroke, peripheral artery disease, multiple risk factors&apos; }
        ]
      },
      diagnosticCriteria: {
        &apos;Diabetes Diagnosis (Any One of)&apos;: [
          &apos;Hemoglobin A1C ≥6.5% (48 mmol/mol)&apos;,
          &apos;Fasting plasma glucose ≥126 mg/dL (7.0 mmol/L)&apos;,
          &apos;2-hour plasma glucose ≥200 mg/dL during OGTT&apos;,
          &apos;Random plasma glucose ≥200 mg/dL with classic symptoms&apos;
        ],
        &apos;Prediabetes&apos;: [
          &apos;Hemoglobin A1C 5.7-6.4% (39-47 mmol/mol)&apos;,
          &apos;Fasting plasma glucose 100-125 mg/dL&apos;,
          &apos;2-hour plasma glucose 140-199 mg/dL during OGTT&apos;
        ],
        &apos;Type 1 vs Type 2 Distinction&apos;: [
          &apos;Type 1: Age <30, lean, acute onset, ketosis-prone, autoantibodies positive&apos;,
          &apos;Type 2: Age >45, obese, gradual onset, insulin resistant, autoantibodies negative&apos;
        ]
      },
      redFlags: [
        &apos;Signs of DKA (Kussmaul breathing, fruity breath, severe dehydration)&apos;,
        &apos;Altered mental status with hyperglycemia (HHS)&apos;,
        &apos;Severe hypoglycemia with altered consciousness&apos;,
        &apos;Signs of sepsis in diabetic patient&apos;,
        &apos;Diabetic foot ulcer with signs of infection&apos;,
        &apos;New vision loss in diabetic patient&apos;,
        &apos;Chest pain in diabetic (silent MI risk)&apos;,
        &apos;Acute kidney injury in diabetic patient&apos;,
        &apos;Gastroparesis symptoms (early satiety, vomiting)&apos;
      ],
      acuteComplications: {
        &apos;DKA (Diabetic Ketoacidosis)&apos;: {
          &apos;Triggers&apos;: &apos;Infection, medication noncompliance, new-onset T1DM, insulin pump failure&apos;,
          &apos;Symptoms&apos;: &apos;Polyuria, polydipsia, abdominal pain, vomiting, Kussmaul breathing&apos;,
          &apos;Lab findings&apos;: &apos;Glucose >250, pH <7.3, bicarbonate <15, positive ketones&apos;,
          &apos;Treatment&apos;: &apos;IV fluids, insulin infusion, electrolyte replacement, treat precipitant&apos;
        },
        &apos;HHS (Hyperosmolar Hyperglycemic State)&apos;: {
          &apos;Triggers&apos;: &apos;Infection, dehydration, medications (thiazides, steroids)&apos;,
          &apos;Symptoms&apos;: &apos;Severe dehydration, altered mental status, focal neurologic signs&apos;,
          &apos;Lab findings&apos;: &apos;Glucose >600, osmolality >320, minimal ketosis&apos;,
          &apos;Treatment&apos;: &apos;Aggressive fluid resuscitation, insulin, electrolyte management&apos;
        }
      },
      chronicComplications: {
        &apos;Microvascular&apos;: [
          &apos;Diabetic retinopathy (leading cause of blindness)&apos;,
          &apos;Diabetic nephropathy (leading cause of ESRD)&apos;,
          &apos;Diabetic neuropathy (sensory, motor, autonomic)&apos;
        ],
        &apos;Macrovascular&apos;: [
          &apos;Coronary artery disease (2-4x increased risk)&apos;,
          &apos;Cerebrovascular disease (stroke risk)&apos;,
          &apos;Peripheral artery disease (amputation risk)&apos;
        ],
        &apos;Other&apos;: [
          &apos;Diabetic foot disease (neuropathy + vascular)&apos;,
          &apos;Gastroparesis (autonomic neuropathy)&apos;,
          &apos;Increased infection susceptibility&apos;
        ]
      },
      riskFactors: {
        &apos;Type 2 Diabetes&apos;: [
          &apos;Age ≥45 years&apos;,
          &apos;BMI ≥25 kg/m² (≥23 in Asian Americans)&apos;,
          &apos;First-degree relative with diabetes&apos;,
          &apos;High-risk ethnicity (African American, Latino, Native American, Asian, Pacific Islander)&apos;,
          &apos;Previous gestational diabetes or baby >9 lbs&apos;,
          &apos;Hypertension (≥140/90 or on therapy)&apos;,
          &apos;HDL <35 mg/dL or triglycerides >250 mg/dL&apos;,
          &apos;Polycystic ovary syndrome&apos;,
          &apos;Physical inactivity&apos;,
          &apos;Previous A1C ≥5.7% or prediabetes&apos;
        ]
      },
      screeningGuidelines: {
        &apos;Adults&apos;: &apos;Screen every 3 years starting age 35 (or younger if risk factors)&apos;,
        &apos;Pregnant Women&apos;: &apos;Screen at 24-28 weeks gestation&apos;,
        &apos;High Risk&apos;: &apos;Screen annually if prediabetes or multiple risk factors&apos;
      },
      managementTargets: {
        &apos;Glycemic Control&apos;: [
          &apos;A1C <7% for most adults&apos;,
          &apos;A1C <6.5% if achievable without hypoglycemia&apos;,
          &apos;A1C <8% for elderly or comorbidities&apos;
        ],
        &apos;Blood Pressure&apos;: &apos;<130/80 mmHg for most diabetic patients&apos;,
        &apos;Lipids&apos;: &apos;LDL <70 mg/dL (high-risk patients)&apos;,
        &apos;Weight&apos;: &apos;5-10% weight loss if overweight/obese&apos;
      },
      ageGenderFactors: {
        &apos;Children/Adolescents&apos;: [&apos;Type 1 diabetes predominant&apos;, &apos;Increasing Type 2 with obesity&apos;, &apos;DKA presentation common&apos;],
        &apos;Young Adults (20-40)&apos;: [&apos;Type 1 vs Type 2 distinction important&apos;, &apos;MODY consideration&apos;, &apos;Pregnancy planning&apos;],
        &apos;Middle Age (40-65)&apos;: [&apos;Type 2 diabetes peak incidence&apos;, &apos;Metabolic syndrome&apos;, &apos;Cardiovascular risk&apos;],
        &apos;Elderly (>65)&apos;: [&apos;Functional status considerations&apos;, &apos;Hypoglycemia risk&apos;, &apos;Relaxed A1C targets&apos;],
        &apos;Pregnancy&apos;: [&apos;Gestational diabetes screening&apos;, &apos;Preconception counseling&apos;, &apos;Tight glycemic control&apos;]
      },
      urgency: &apos;varies&apos;,
      clinicalPearls: [
        &apos;Classic triad: polyuria, polydipsia, polyphagia with weight loss&apos;,
        &apos;Type 1 diabetes can present at any age, not just children&apos;,
        &apos;Honeymoon period in Type 1: temporary insulin independence&apos;,
        &apos;Silent MI common in diabetics due to autonomic neuropathy&apos;,
        &apos;Annual eye exams essential - retinopathy often asymptomatic&apos;,
        &apos;Diabetic nephropathy: check microalbumin annually&apos;,
        &apos;Foot exams crucial - 50% of amputations are preventable&apos;,
        &apos;A1C reflects average glucose over 2-3 months&apos;,
        &apos;Hypoglycemia unawareness develops with recurrent episodes&apos;,
        &apos;Dawn phenomenon: early morning glucose rise due to hormones&apos;
      ]
    },
    &apos;confusion&apos;: {
      pivotalPoints: [
        &apos;Acute vs chronic onset distinguishes delirium from dementia&apos;,
        &apos;Fluctuating course and altered attention are hallmarks of delirium&apos;,
        &apos;Delirium is often reversible if underlying cause identified and treated&apos;,
        &apos;Mixed delirium-dementia is common in elderly hospitalized patients&apos;
      ],
      questions: [
        &apos;When did you first notice the confusion or memory problems?&apos;,
        &apos;Did the confusion come on suddenly (hours/days) or gradually (months/years)?&apos;,
        &apos;Does the confusion seem to come and go, or is it constant?&apos;,
        &apos;Are there times when thinking seems clearer vs more confused?&apos;,
        &apos;Any difficulty paying attention or following conversations?&apos;,
        &apos;Any hallucinations (seeing/hearing things that aren\&apos;t there)?&apos;,
        &apos;Any changes in sleep patterns or day/night confusion?&apos;,
        &apos;Has there been any recent illness, infection, or hospitalization?&apos;,
        &apos;Any new medications or changes in medications recently?&apos;,
        &apos;Any fever, urinary symptoms, or signs of infection?&apos;,
        &apos;Any falls, head injury, or loss of consciousness recently?&apos;,
        &apos;Any changes in eating, drinking, or bowel/bladder function?&apos;,
        &apos;Is the person more agitated, restless, or withdrawn than usual?&apos;,
        &apos;Any family history of Alzheimer\&apos;s disease or dementia?&apos;,
        &apos;What medications are currently being taken?&apos;,
        &apos;Any history of alcohol use or substance use?&apos;,
        &apos;How has memory and thinking been over the past few years?&apos;
      ],
      differentials: {
        &apos;Delirium (Acute Confusional State)&apos;: [
          { condition: &apos;Infection-Related Delirium&apos;, likelihood: &apos;very high&apos;, features: &apos;UTI, pneumonia, sepsis - most common cause in elderly&apos; },
          { condition: &apos;Medication-Induced Delirium&apos;, likelihood: &apos;very high&apos;, features: &apos;Anticholinergics, opioids, benzodiazepines, polypharmacy&apos; },
          { condition: &apos;Metabolic Delirium&apos;, likelihood: &apos;high&apos;, features: &apos;Hypoglycemia, hyponatremia, uremia, hepatic encephalopathy&apos; },
          { condition: &apos;Substance Withdrawal&apos;, likelihood: &apos;moderate&apos;, features: &apos;Alcohol, benzodiazepine withdrawal, delirium tremens&apos; },
          { condition: &apos;Postoperative Delirium&apos;, likelihood: &apos;moderate&apos;, features: &apos;Post-anesthesia, ICU setting, elderly patients&apos; },
          { condition: &apos;Hypoxic Delirium&apos;, likelihood: &apos;moderate&apos;, features: &apos;Respiratory failure, cardiac arrest, severe anemia&apos; }
        ],
        &apos;Dementia (Chronic Cognitive Decline)&apos;: [
          { condition: &apos;Alzheimer\&apos;s Disease&apos;, likelihood: &apos;very high&apos;, features: &apos;Gradual onset, memory predominant, age >65, family history&apos; },
          { condition: &apos;Vascular Dementia&apos;, likelihood: &apos;high&apos;, features: &apos;Stepwise decline, stroke history, vascular risk factors&apos; },
          { condition: &apos;Lewy Body Dementia&apos;, likelihood: &apos;moderate&apos;, features: &apos;Visual hallucinations, parkinsonism, fluctuating cognition&apos; },
          { condition: &apos;Frontotemporal Dementia&apos;, likelihood: &apos;low&apos;, features: &apos;Early behavioral changes, age <65, language problems&apos; },
          { condition: &apos;Normal Pressure Hydrocephalus&apos;, likelihood: &apos;low&apos;, features: &apos;Gait, cognition, incontinence triad&apos; },
          { condition: &apos;Pseudodementia (Depression)&apos;, likelihood: &apos;moderate&apos;, features: &apos;Depression history, "don\&apos;t know" answers, reversible&apos; }
        ],
        &apos;Reversible Causes of Cognitive Impairment&apos;: [
          { condition: &apos;Hypothyroidism&apos;, likelihood: &apos;moderate&apos;, features: &apos;Fatigue, weight gain, cold intolerance, elevated TSH&apos; },
          { condition: &apos;Vitamin B12 Deficiency&apos;, likelihood: &apos;moderate&apos;, features: &apos;Megaloblastic anemia, peripheral neuropathy&apos; },
          { condition: &apos;Depression&apos;, likelihood: &apos;high&apos;, features: &apos;Mood symptoms, poor effort on testing, reversible&apos; },
          { condition: &apos;Medication Effects&apos;, likelihood: &apos;high&apos;, features: &apos;Anticholinergics, sedatives, polypharmacy&apos; },
          { condition: &apos;Chronic Subdural Hematoma&apos;, likelihood: &apos;low&apos;, features: &apos;Fall history, anticoagulation, gradual decline&apos; }
        ]
      },
      deliriumFeatures: {
        &apos;Core Features (CAM Criteria)&apos;: [
          &apos;1. Acute onset and fluctuating course&apos;,
          &apos;2. Inattention (difficulty focusing)&apos;,
          &apos;3. Disorganized thinking (incoherent speech)&apos;,
          &apos;4. Altered level of consciousness&apos;
        ],
        &apos;Subtypes&apos;: [
          &apos;Hyperactive: Agitated, restless, hypervigilant&apos;,
          &apos;Hypoactive: Withdrawn, quiet, decreased activity&apos;,
          &apos;Mixed: Alternating between hyperactive and hypoactive&apos;
        ]
      },
      dementiaStaging: {
        &apos;Mild Cognitive Impairment&apos;: [
          &apos;Subjective cognitive complaints&apos;,
          &apos;Objective cognitive impairment on testing&apos;,
          &apos;Preserved functional independence&apos;,
          &apos;Not meeting dementia criteria&apos;
        ],
        &apos;Mild Dementia&apos;: [
          &apos;Difficulty with complex tasks&apos;,
          &apos;Needs assistance with finances, medications&apos;,
          &apos;Can still live independently with support&apos;
        ],
        &apos;Moderate Dementia&apos;: [
          &apos;Difficulty with basic activities of daily living&apos;,
          &apos;Needs supervision for safety&apos;,
          &apos;May have behavioral symptoms&apos;
        ],
        &apos;Severe Dementia&apos;: [
          &apos;Requires assistance with basic care&apos;,
          &apos;Loss of communication abilities&apos;,
          &apos;Complete dependence on caregivers&apos;
        ]
      },
      redFlags: [
        &apos;Acute change in mental status in elderly (delirium until proven otherwise)&apos;,
        &apos;Focal neurologic deficits with confusion (stroke, mass lesion)&apos;,
        &apos;Fever with altered mental status (meningitis, encephalitis, sepsis)&apos;,
        &apos;Signs of increased intracranial pressure (headache, vomiting, papilledema)&apos;,
        &apos;Recent head trauma with confusion&apos;,
        &apos;Rapid cognitive decline over weeks to months&apos;,
        &apos;Age <60 with dementia symptoms (atypical, investigate for reversible causes)&apos;,
        &apos;Delirium in postoperative patient (multiple potential causes)&apos;,
        &apos;Confusion with signs of alcohol withdrawal (medical emergency)&apos;
      ],
      riskFactors: {
        &apos;Delirium Risk Factors&apos;: [
          &apos;Age >65 years&apos;,
          &apos;Preexisting dementia&apos;,
          &apos;Severe illness/infection&apos;,
          &apos;Polypharmacy (>5 medications)&apos;,
          &apos;Sensory impairment&apos;,
          &apos;Immobilization/restraints&apos;,
          &apos;Urinary catheter&apos;,
          &apos;Sleep deprivation&apos;
        ],
        &apos;Dementia Risk Factors&apos;: [
          &apos;Advanced age (strongest risk factor)&apos;,
          &apos;Family history of dementia&apos;,
          &apos;APOE4 gene variant&apos;,
          &apos;Cardiovascular disease&apos;,
          &apos;Diabetes mellitus&apos;,
          &apos;Head trauma history&apos;,
          &apos;Low education level&apos;,
          &apos;Social isolation&apos;
        ]
      },
      assessmentTools: {
        &apos;Delirium Screening&apos;: [
          &apos;CAM (Confusion Assessment Method) - most validated&apos;,
          &apos;4AT (4 A\&apos;s Test) - rapid screening&apos;,
          &apos;CAM-ICU for ventilated patients&apos;
        ],
        &apos;Cognitive Assessment&apos;: [
          &apos;MMSE (Mini-Mental State Exam)&apos;,
          &apos;MoCA (Montreal Cognitive Assessment)&apos;,
          &apos;Clock drawing test&apos;,
          &apos;Trails A & B&apos;
        ],
        &apos;Functional Assessment&apos;: [
          &apos;Activities of Daily Living (ADLs)&apos;,
          &apos;Instrumental ADLs (IADLs)&apos;,
          &apos;Clinical Dementia Rating (CDR)&apos;
        ]
      },
      workupApproach: {
        &apos;Acute Confusion (Delirium)&apos;: [
          &apos;Complete medication review&apos;,
          &apos;Infection workup (UA, CXR, blood cultures)&apos;,
          &apos;Basic metabolic panel, liver function&apos;,
          &apos;Arterial blood gas if hypoxia suspected&apos;,
          &apos;Head CT if trauma or focal signs&apos;
        ],
        &apos;Chronic Confusion (Dementia)&apos;: [
          &apos;TSH, B12, folate levels&apos;,
          &apos;Complete metabolic panel&apos;,
          &apos;Depression screening&apos;,
          &apos;Brain MRI to rule out structural causes&apos;,
          &apos;Neuropsychological testing if indicated&apos;
        ]
      },
      ageGenderFactors: {
        &apos;Young Adults (<40)&apos;: [&apos;Substance use&apos;, &apos;Psychiatric disorders&apos;, &apos;Metabolic causes&apos;, &apos;Autoimmune&apos;],
        &apos;Middle Age (40-65)&apos;: [&apos;Early dementia&apos;, &apos;Depression&apos;, &apos;Alcohol-related&apos;, &apos;Metabolic&apos;],
        &apos;Elderly (>65)&apos;: [&apos;Delirium (multiple causes)&apos;, &apos;Alzheimer\&apos;s disease&apos;, &apos;Vascular dementia&apos;],
        &apos;Hospitalized Elderly&apos;: [&apos;Delirium (40-50% prevalence)&apos;, &apos;Medication effects&apos;, &apos;Infection&apos;],
        &apos;Postoperative&apos;: [&apos;Anesthesia effects&apos;, &apos;Pain medications&apos;, &apos;Infection&apos;, &apos;Electrolyte abnormalities&apos;]
      },
      urgency: &apos;varies&apos;,
      clinicalPearls: [
        &apos;Delirium is a medical emergency - always look for underlying cause&apos;,
        &apos;Hypoactive delirium is often missed but more common than hyperactive&apos;,
        &apos;UTI is the most common cause of delirium in elderly&apos;,
        &apos;Anticholinergic medications are frequent culprits in delirium&apos;,
        &apos;Dementia increases risk of delirium by 5-fold&apos;,
        &apos;Normal pressure hydrocephalus: wet, wobbly, wacky triad&apos;,
        &apos;Depression can mimic dementia ("pseudodementia") but is reversible&apos;,
        &apos;Early-onset dementia (<65) requires extensive workup for reversible causes&apos;,
        &apos;Sundowning (worse confusion in evening) is common in dementia&apos;,
        &apos;Lewy body dementia: visual hallucinations + parkinsonism + fluctuating cognition&apos;
      ]
    },
    &apos;cough&apos;: {
      pivotalPoints: [
        &apos;Duration distinguishes acute (<3 weeks) vs chronic (>8 weeks) cough with different etiologies&apos;,
        &apos;Sputum characteristics help differentiate bacterial vs viral vs other causes&apos;,
        &apos;Associated fever and systemic symptoms suggest infectious etiology&apos;,
        &apos;Red flag symptoms identify serious complications requiring urgent evaluation&apos;
      ],
      questions: [
        &apos;How long have you had this cough (days, weeks, months)?&apos;,
        &apos;Are you bringing up any sputum/phlegm when you cough?&apos;,
        &apos;What color is the sputum (clear, white, yellow, green, blood-tinged)?&apos;,
        &apos;Do you have fever, chills, or night sweats?&apos;,
        &apos;What is your highest recorded temperature?&apos;,
        &apos;Are you short of breath or having trouble breathing?&apos;,
        &apos;Any chest pain, especially when breathing deeply or coughing?&apos;,
        &apos;Do you feel generally unwell, fatigued, or have body aches?&apos;,
        &apos;Any runny nose, sore throat, or sinus congestion?&apos;,
        &apos;Have you been around anyone who has been sick recently?&apos;,
        &apos;Do you smoke or have you been exposed to smoke/irritants?&apos;,
        &apos;Any recent travel, especially internationally?&apos;,
        &apos;Do you have asthma, COPD, or other lung problems?&apos;,
        &apos;Any heart problems or taking heart medications?&apos;,
        &apos;Are you taking any medications, especially ACE inhibitors?&apos;,
        &apos;Any known allergies or recent new exposures?&apos;,
        &apos;Have you tried any treatments and did they help?&apos;
      ],
      differentials: {
        &apos;Acute Cough with Fever (Infectious)&apos;: [
          { condition: &apos;Viral Upper Respiratory Infection (Common Cold)&apos;, likelihood: &apos;very high&apos;, features: &apos;Gradual onset, rhinorrhea, sore throat, low-grade fever, clear/white sputum&apos; },
          { condition: &apos;Influenza&apos;, likelihood: &apos;high&apos;, features: &apos;Sudden onset, high fever, myalgias, headache, dry cough, seasonal pattern&apos; },
          { condition: &apos;Acute Bronchitis&apos;, likelihood: &apos;high&apos;, features: &apos;Productive cough, normal vital signs, no pneumonia signs, mostly viral&apos; },
          { condition: &apos;Community-Acquired Pneumonia&apos;, likelihood: &apos;moderate&apos;, features: &apos;Fever, productive cough, dyspnea, consolidation on exam, elevated WBC&apos; },
          { condition: &apos;COVID-19&apos;, likelihood: &apos;moderate&apos;, features: &apos;Dry cough, fever, anosmia, contact exposure, variable severity&apos; },
          { condition: &apos;Pertussis (Whooping Cough)&apos;, likelihood: &apos;low&apos;, features: &apos;Paroxysmal cough with whoop, post-tussive vomiting, unvaccinated&apos; }
        ],
        &apos;Acute Cough without Fever&apos;: [
          { condition: &apos;Viral Upper Respiratory Infection&apos;, likelihood: &apos;high&apos;, features: &apos;Post-nasal drip, throat clearing, recent cold symptoms&apos; },
          { condition: &apos;Allergic Rhinitis&apos;, likelihood: &apos;moderate&apos;, features: &apos;Seasonal pattern, itchy eyes/nose, known allergies, eosinophilia&apos; },
          { condition: &apos;Asthma Exacerbation&apos;, likelihood: &apos;moderate&apos;, features: &apos;Wheezing, dyspnea, response to bronchodilators, triggers&apos; },
          { condition: &apos;COPD Exacerbation&apos;, likelihood: &apos;moderate&apos;, features: &apos;Smoking history, increased sputum, dyspnea, barrel chest&apos; },
          { condition: &apos;ACE Inhibitor Cough&apos;, likelihood: &apos;low&apos;, features: &apos;Dry cough, recent medication start, no other symptoms&apos; }
        ],
        &apos;Chronic Cough (>8 weeks)&apos;: [
          { condition: &apos;Asthma/Cough-Variant Asthma&apos;, likelihood: &apos;high&apos;, features: &apos;Dry cough, worse at night, response to bronchodilators&apos; },
          { condition: &apos;Gastroesophageal Reflux Disease&apos;, likelihood: &apos;high&apos;, features: &apos;Worse lying down, throat clearing, heartburn, hoarse voice&apos; },
          { condition: &apos;Upper Airway Cough Syndrome&apos;, likelihood: &apos;high&apos;, features: &apos;Post-nasal drip sensation, throat clearing, rhinosinusitis&apos; },
          { condition: &apos;Chronic Bronchitis (COPD)&apos;, likelihood: &apos;moderate&apos;, features: &apos;Smoking history, productive cough >3 months for 2 years&apos; },
          { condition: &apos;ACE Inhibitor-Induced Cough&apos;, likelihood: &apos;moderate&apos;, features: &apos;Dry cough, medication history, resolves when stopped&apos; },
          { condition: &apos;Lung Cancer&apos;, likelihood: &apos;low&apos;, features: &apos;Smoking history, age >40, hemoptysis, weight loss&apos; }
        ],
        &apos;Pneumonia Severity Assessment&apos;: [
          { condition: &apos;Outpatient Treatment Appropriate&apos;, likelihood: &apos;varies&apos;, features: &apos;CURB-65 score 0-1, stable vitals, able to take oral meds&apos; },
          { condition: &apos;Hospitalization Recommended&apos;, likelihood: &apos;varies&apos;, features: &apos;CURB-65 score ≥2, hypoxia, severe symptoms, comorbidities&apos; },
          { condition: &apos;ICU Consideration&apos;, likelihood: &apos;varies&apos;, features: &apos;Severe pneumonia, shock, respiratory failure, CURB-65 ≥3&apos; }
        ]
      },
      redFlags: [
        &apos;Hemoptysis (coughing up blood) - especially large volume&apos;,
        &apos;Severe respiratory distress or hypoxia (O2 sat <90%)&apos;,
        &apos;Signs of sepsis (fever >101.3°F, hypotension, altered mental status)&apos;,
        &apos;Chest pain with fever suggesting pneumonia&apos;,
        &apos;Immunocompromised patient with respiratory symptoms&apos;,
        &apos;Recent travel to endemic areas (TB, fungal infections)&apos;,
        &apos;Chronic cough with weight loss (malignancy concern)&apos;,
        &apos;Sudden onset severe cough after aspiration event&apos;,
        &apos;Whooping cough in infants <6 months (life-threatening)&apos;
      ],
      sputumAnalysis: {
        &apos;Clear/White&apos;: &apos;Viral infection, allergies, asthma, early bacterial infection&apos;,
        &apos;Yellow/Green&apos;: &apos;Bacterial infection, neutrophilic inflammation&apos;,
        &apos;Rust-Colored&apos;: &apos;Pneumococcal pneumonia, classic finding&apos;,
        &apos;Pink/Frothy&apos;: &apos;Pulmonary edema, heart failure&apos;,
        &apos;Blood-Streaked&apos;: &apos;Bronchitis, pneumonia, malignancy, TB&apos;,
        &apos;Frank Blood&apos;: &apos;Pulmonary embolism, malignancy, severe infection, bronchiectasis&apos;
      },
      ageGenderFactors: {
        &apos;Infants (<6 months)&apos;: [&apos;RSV&apos;, &apos;Pertussis&apos;, &apos;Pneumonia&apos;, &apos;Bronchiolitis&apos;],
        &apos;Children (6m-5y)&apos;: [&apos;Viral URI&apos;, &apos;Croup&apos;, &apos;Pneumonia&apos;, &apos;Asthma&apos;],
        &apos;School Age (5-18y)&apos;: [&apos;Viral URI&apos;, &apos;Mycoplasma pneumonia&apos;, &apos;Asthma&apos;, &apos;Pertussis&apos;],
        &apos;Young Adults (18-40)&apos;: [&apos;Viral URI&apos;, &apos;Mycoplasma pneumonia&apos;, &apos;Asthma&apos;, &apos;GERD&apos;],
        &apos;Middle Age (40-65)&apos;: [&apos;Pneumonia&apos;, &apos;COPD&apos;, &apos;Asthma&apos;, &apos;GERD&apos;, &apos;ACE inhibitor cough&apos;],
        &apos;Elderly (>65)&apos;: [&apos;Pneumonia&apos;, &apos;COPD exacerbation&apos;, &apos;Heart failure&apos;, &apos;Aspiration&apos;],
        &apos;Smokers&apos;: [&apos;COPD&apos;, &apos;Lung cancer&apos;, &apos;Pneumonia&apos;, &apos;Bronchitis&apos;],
        &apos;Immunocompromised&apos;: [&apos;Opportunistic infections&apos;, &apos;PCP pneumonia&apos;, &apos;Atypical organisms&apos;]
      },
      clinicalDecisionRules: {
        &apos;CURB-65 (Pneumonia Severity)&apos;: [
          &apos;Confusion (new onset)&apos;,
          &apos;Urea >20 mg/dL (BUN >19)&apos;,
          &apos;Respiratory rate ≥30&apos;,
          &apos;Blood pressure <90/60&apos;,
          &apos;Age ≥65&apos;
        ],
        &apos;Centor Criteria (Strep Throat)&apos;: [
          &apos;Tonsillar exudates&apos;,
          &apos;Tender anterior cervical lymphadenopathy&apos;,
          &apos;Fever >100.4°F&apos;,
          &apos;Absence of cough&apos;
        ]
      },
      treatmentGuidance: {
        &apos;Viral URI&apos;: &apos;Supportive care, rest, fluids, symptomatic treatment&apos;,
        &apos;Acute Bronchitis&apos;: &apos;Usually viral - avoid antibiotics, bronchodilators if wheezing&apos;,
        &apos;Pneumonia&apos;: &apos;Antibiotics based on severity and risk factors, supportive care&apos;,
        &apos;Influenza&apos;: &apos;Oseltamivir if <48 hours, supportive care, isolation&apos;,
        &apos;COVID-19&apos;: &apos;Isolation, supportive care, consider antivirals/monoclonals&apos;,
        &apos;Asthma&apos;: &apos;Bronchodilators, inhaled corticosteroids, trigger avoidance&apos;
      },
      urgency: &apos;varies&apos;,
      clinicalPearls: [
        &apos;Most acute cough illnesses are viral and self-limiting&apos;,
        &apos;Purulent sputum alone does not indicate bacterial infection&apos;,
        &apos;Antibiotic overuse for viral bronchitis contributes to resistance&apos;,
        &apos;Cough can persist 2-8 weeks after viral URI (post-infectious cough)&apos;,
        &apos;CURB-65 score guides pneumonia treatment location decisions&apos;,
        &apos;ACE inhibitor cough affects 10-15% of patients, usually dry&apos;,
        &apos;Chronic cough: think asthma, GERD, upper airway cough syndrome&apos;,
        &apos;Hemoptysis always requires investigation regardless of amount&apos;,
        &apos;Pertussis can present atypically in adults as prolonged cough&apos;
      ]
    },
    &apos;headache&apos;: {
      pivotalPoints: [
        &apos;Red flag symptoms identify dangerous secondary headaches requiring urgent evaluation&apos;,
        &apos;Headache pattern and characteristics distinguish primary headache types&apos;,
        &apos;Age of onset and progression help differentiate benign from serious causes&apos;,
        &apos;Associated neurologic symptoms suggest intracranial pathology&apos;
      ],
      questions: [
        &apos;Is this the worst headache of your life or completely different from usual headaches?&apos;,
        &apos;When did this headache start and how did it begin (sudden vs gradual)?&apos;,
        &apos;Where is the headache located (one side, both sides, front, back, temples)?&apos;,
        &apos;What does the headache feel like (throbbing, stabbing, pressure, burning)?&apos;,
        &apos;How severe is the pain on a scale of 1-10?&apos;,
        &apos;How long do your headaches typically last?&apos;,
        &apos;Do you have nausea, vomiting, or sensitivity to light or sound?&apos;,
        &apos;Any visual changes (flashing lights, blind spots, double vision)?&apos;,
        &apos;Any fever, neck stiffness, or rash?&apos;,
        &apos;Any weakness, numbness, or difficulty speaking?&apos;,
        &apos;What triggers your headaches (stress, foods, weather, hormones)?&apos;,
        &apos;What makes the headache better or worse?&apos;,
        &apos;How often do you get headaches?&apos;,
        &apos;Do you take any headache medications? How often?&apos;,
        &apos;Any recent head injury or trauma?&apos;,
        &apos;Any family history of headaches or migraines?&apos;,
        &apos;For women: Any relationship to menstrual cycle?&apos;
      ],
      differentials: {
        &apos;Primary Headache Disorders (90% of headaches)&apos;: [
          { condition: &apos;Migraine without Aura&apos;, likelihood: &apos;very high&apos;, features: &apos;Unilateral, throbbing, 4-72h duration, nausea/vomiting, photophobia/phonophobia&apos; },
          { condition: &apos;Migraine with Aura&apos;, likelihood: &apos;high&apos;, features: &apos;Visual/sensory aura 5-60min before headache, family history&apos; },
          { condition: &apos;Tension-Type Headache&apos;, likelihood: &apos;very high&apos;, features: &apos;Bilateral, pressing/tightening, mild-moderate, no nausea, lasts 30min-7days&apos; },
          { condition: &apos;Cluster Headache&apos;, likelihood: &apos;low&apos;, features: &apos;Unilateral orbital pain, 15min-3h, seasonal clusters, autonomic symptoms&apos; },
          { condition: &apos;Medication Overuse Headache&apos;, likelihood: &apos;moderate&apos;, features: &apos;Frequent analgesic use (>10-15 days/month), daily headaches&apos; }
        ],
        &apos;Dangerous Secondary Headaches (Red Flags)&apos;: [
          { condition: &apos;Subarachnoid Hemorrhage&apos;, likelihood: &apos;rare but critical&apos;, features: &apos;Sudden severe "thunderclap" headache, neck stiffness, altered consciousness&apos; },
          { condition: &apos;Acute Meningitis&apos;, likelihood: &apos;rare but critical&apos;, features: &apos;Fever, neck stiffness, photophobia, altered mental status, rash&apos; },
          { condition: &apos;Brain Tumor/Mass&apos;, likelihood: &apos;rare&apos;, features: &apos;Progressive headache, worse in morning, neurologic deficits, papilledema&apos; },
          { condition: &apos;Temporal Arteritis (Giant Cell)&apos;, likelihood: &apos;low&apos;, features: &apos;Age >50, temporal tenderness, jaw claudication, vision changes, elevated ESR&apos; },
          { condition: &apos;Acute Angle-Closure Glaucoma&apos;, likelihood: &apos;rare&apos;, features: &apos;Severe eye/head pain, vision loss, nausea, hard eye, halos around lights&apos; },
          { condition: &apos;Intracranial Hypertension&apos;, likelihood: &apos;rare&apos;, features: &apos;Worse lying down/morning, papilledema, pulsatile tinnitus, diplopia&apos; }
        ],
        &apos;Other Secondary Headaches&apos;: [
          { condition: &apos;Cervicogenic Headache&apos;, likelihood: &apos;moderate&apos;, features: &apos;Neck pain, occipital location, neck movement triggers, unilateral&apos; },
          { condition: &apos;Sinus Headache&apos;, likelihood: &apos;low&apos;, features: &apos;Facial pressure, purulent nasal discharge, fever, sinus tenderness&apos; },
          { condition: &apos;Post-Traumatic Headache&apos;, likelihood: &apos;varies&apos;, features: &apos;Recent head trauma, may be delayed onset, associated symptoms&apos; },
          { condition: &apos;Hypertensive Headache&apos;, likelihood: &apos;low&apos;, features: &apos;Severe hypertension (>180/120), occipital location, morning predominance&apos; },
          { condition: &apos;Carbon Monoxide Poisoning&apos;, likelihood: &apos;rare&apos;, features: &apos;Multiple people affected, poor ventilation, cherry-red skin&apos; }
        ],
        &apos;Headache in Special Populations&apos;: [
          { condition: &apos;Pregnancy-Related Headache&apos;, likelihood: &apos;varies&apos;, features: &apos;Preeclampsia concern if new-onset, severe, with hypertension&apos; },
          { condition: &apos;Pediatric Headache&apos;, likelihood: &apos;varies&apos;, features: &apos;Often tension-type or migraine, concerning if awakens child, neurologic signs&apos; },
          { condition: &apos;Elderly New-Onset Headache&apos;, likelihood: &apos;concerning&apos;, features: &apos;Higher risk of secondary causes, temporal arteritis, medication effects&apos; }
        ]
      },
      redFlagFeatures: {
        &apos;SNOOP10 Mnemonic&apos;: [
          &apos;S: Systemic illness (fever, weight loss, HIV, cancer)&apos;,
          &apos;N: Neurologic deficit or altered consciousness&apos;,
          &apos;O: Onset sudden (thunderclap headache)&apos;,
          &apos;O: Older age (>50 years with new headache)&apos;,
          &apos;P: Previous headache history absent (new onset)&apos;,
          &apos;Pattern change (different from usual headaches)&apos;,
          &apos;Positional headache (worse lying down)&apos;,
          &apos;Papilledema&apos;,
          &apos;Progressive headache (worsening over time)&apos;,
          &apos;Pregnancy (new or worsening headache)&apos;
        ]
      },
      migraineCriteria: {
        &apos;Migraine without Aura (ICHD-3)&apos;: [
          &apos;At least 5 attacks lasting 4-72 hours&apos;,
          &apos;At least 2 of: unilateral, pulsating, moderate-severe intensity, aggravated by activity&apos;,
          &apos;During headache: nausea/vomiting OR photophobia AND phonophobia&apos;,
          &apos;Not better explained by another diagnosis&apos;
        ],
        &apos;Migraine with Aura&apos;: [
          &apos;At least 2 attacks with aura&apos;,
          &apos;Aura: gradual development ≥5 min, duration 5-60 min, fully reversible&apos;,
          &apos;Visual, sensory, speech/language, motor, brainstem, or retinal symptoms&apos;
        ],
        &apos;Common Migraine Triggers&apos;: [
          &apos;Hormonal changes (menstruation, pregnancy, menopause)&apos;,
          &apos;Foods (aged cheese, chocolate, alcohol, MSG, nitrates)&apos;,
          &apos;Sleep changes (too little or too much)&apos;,
          &apos;Stress and relaxation after stress&apos;,
          &apos;Weather changes and barometric pressure&apos;,
          &apos;Bright lights, loud sounds, strong smells&apos;
        ]
      },
      clusterHeadacheCriteria: {
        &apos;Characteristics&apos;: [
          &apos;Severe unilateral orbital/temporal pain&apos;,
          &apos;Duration 15 minutes to 3 hours&apos;,
          &apos;Frequency 1 every other day to 8 per day&apos;,
          &apos;At least one autonomic symptom: conjunctival injection, lacrimation, nasal congestion, rhinorrhea, eyelid edema, miosis, ptosis, restlessness&apos;
        ],
        &apos;Pattern&apos;: [
          &apos;Occur in clusters (weeks to months)&apos;,
          &apos;Often same time of day/night&apos;,
          &apos;Remission periods between clusters&apos;,
          &apos;Male predominance (3:1)&apos;,
          &apos;Often triggered by alcohol during cluster period&apos;
        ]
      },
      diagnosticApproach: {
        &apos;Clinical Assessment (Most Important)&apos;: [
          &apos;Detailed headache history and characterization&apos;,
          &apos;Complete neurologic examination&apos;,
          &apos;Vital signs including blood pressure&apos;,
          &apos;Fundoscopic examination for papilledema&apos;,
          &apos;Neck examination for stiffness/tenderness&apos;
        ],
        &apos;Neuroimaging Indications&apos;: [
          &apos;Sudden severe headache (thunderclap)&apos;,
          &apos;Headache with neurologic deficits&apos;,
          &apos;New headache in patient >50 years&apos;,
          &apos;Progressive worsening headache&apos;,
          &apos;Headache with fever and neck stiffness&apos;,
          &apos;Significant change in headache pattern&apos;,
          &apos;Headache after head trauma&apos;
        ],
        &apos;Laboratory Studies (Selected Cases)&apos;: [
          &apos;ESR/CRP (temporal arteritis if age >50)&apos;,
          &apos;Lumbar puncture (if SAH or meningitis suspected)&apos;,
          &apos;Complete blood count (infection, anemia)&apos;,
          &apos;Pregnancy test (women of childbearing age)&apos;
        ]
      },
      emergencyHeadaches: {
        &apos;Subarachnoid Hemorrhage&apos;: [
          &apos;Sudden severe "worst headache ever"&apos;,
          &apos;May have brief loss of consciousness&apos;,
          &apos;Neck stiffness, photophobia&apos;,
          &apos;CT head immediately, LP if CT negative&apos;,
          &apos;Neurosurgical emergency&apos;
        ],
        &apos;Meningitis&apos;: [
          &apos;Fever, headache, neck stiffness (classic triad)&apos;,
          &apos;Altered mental status&apos;,
          &apos;Petechial rash (meningococcal)&apos;,
          &apos;Lumbar puncture for diagnosis&apos;,
          &apos;Immediate antibiotics&apos;
        ],
        &apos;Temporal Arteritis&apos;: [
          &apos;Age >50, new headache&apos;,
          &apos;Temporal artery tenderness&apos;,
          &apos;Jaw claudication, vision changes&apos;,
          &apos;ESR >50, CRP elevated&apos;,
          &apos;Immediate steroids to prevent blindness&apos;
        ]
      },
      treatmentApproach: {
        &apos;Acute Migraine Treatment&apos;: [
          &apos;Mild-Moderate: NSAIDs, acetaminophen, caffeine combinations&apos;,
          &apos;Moderate-Severe: Triptans (sumatriptan, rizatriptan, etc.)&apos;,
          &apos;Severe/Refractory: DHE, antiemetics, steroids&apos;,
          &apos;Avoid overuse (limit to 2-3 days per week)&apos;
        ],
        &apos;Migraine Prevention&apos;: [
          &apos;First-line: Topiramate, valproate, propranolol, timolol&apos;,
          &apos;Second-line: Amitriptyline, venlafaxine, gabapentin&apos;,
          &apos;CGRP antagonists: Erenumab, fremanezumab, galcanezumab&apos;,
          &apos;Botulinum toxin for chronic migraine&apos;
        ],
        &apos;Tension Headache&apos;: [
          &apos;Acute: NSAIDs, acetaminophen&apos;,
          &apos;Chronic: Amitriptyline, stress management, physical therapy&apos;,
          &apos;Avoid medication overuse&apos;
        ],
        &apos;Cluster Headache&apos;: [
          &apos;Acute: High-flow oxygen (100% O2 at 12-15 L/min)&apos;,
          &apos;Sumatriptan injection&apos;,
          &apos;Prevention: Verapamil, lithium, topiramate&apos;
        ]
      },
      ageGenderFactors: {
        &apos;Children/Adolescents&apos;: [&apos;Tension-type headache&apos;, &apos;Migraine (often bilateral)&apos;, &apos;Secondary causes more concerning&apos;],
        &apos;Young Women (20-40)&apos;: [&apos;Migraine (3:1 female predominance)&apos;, &apos;Hormonal triggers&apos;, &apos;Pregnancy considerations&apos;],
        &apos;Middle-Aged Adults&apos;: [&apos;Migraine&apos;, &apos;Tension-type&apos;, &apos;Medication overuse&apos;, &apos;Secondary causes increase&apos;],
        &apos;Elderly (>50)&apos;: [&apos;New headache concerning&apos;, &apos;Temporal arteritis&apos;, &apos;Medication effects&apos;, &apos;Secondary causes&apos;],
        &apos;Men&apos;: [&apos;Cluster headache (3:1 male predominance)&apos;, &apos;Tension-type&apos;, &apos;Secondary causes&apos;],
        &apos;Postmenopausal Women&apos;: [&apos;Migraine often improves&apos;, &apos;Tension-type&apos;, &apos;Medication-related&apos;]
      },
      medicationOveruseHeadache: {
        &apos;Risk Factors&apos;: [
          &apos;Frequent use of acute headache medications&apos;,
          &apos;Simple analgesics >15 days/month&apos;,
          &apos;Triptans/opioids >10 days/month&apos;,
          &apos;Combination analgesics >10 days/month&apos;
        ],
        &apos;Management&apos;: [
          &apos;Gradual withdrawal of overused medication&apos;,
          &apos;Bridging therapy with steroids&apos;,
          &apos;Preventive headache medication&apos;,
          &apos;Patient education and follow-up&apos;
        ]
      },
      urgency: &apos;varies&apos;,
      clinicalPearls: [
        &apos;Most headaches (90%) are primary disorders - migraine or tension-type&apos;,
        &apos;"Thunderclap" headache = subarachnoid hemorrhage until proven otherwise&apos;,
        &apos;Normal neurologic exam doesn\&apos;t rule out secondary headache&apos;,
        &apos;Medication overuse headache is common and preventable&apos;,
        &apos;Migraine often starts in adolescence/early adulthood&apos;,
        &apos;New headache in patient >50 years requires investigation&apos;,
        &apos;Cluster headaches have strong circadian and seasonal patterns&apos;,
        &apos;Pregnancy can trigger new migraines or worsen existing ones&apos;,
        &apos;Triptans contraindicated in cardiovascular disease&apos;,
        &apos;Oxygen is first-line acute treatment for cluster headache&apos;,
        &apos;Most "sinus headaches" are actually migraines&apos;,
        &apos;CT scan normal in 98% of patients with chronic daily headache&apos;,
        &apos;Caffeine withdrawal can cause severe headaches&apos;,
        &apos;Botulinum toxin effective for chronic migraine (≥15 days/month)&apos;
      ]
    },
    &apos;abdominal pain&apos;: {
      pivotalPoints: [
        &apos;Location of pain is key diagnostic feature&apos;,
        &apos;Onset (sudden vs gradual) suggests different pathology&apos;,
        &apos;Associated symptoms guide differential diagnosis&apos;,
        &apos;Age and gender significantly influence likelihood of conditions&apos;
      ],
      questions: [
        &apos;Point to exactly where the pain is located&apos;,
        &apos;Did the pain start suddenly or gradually over hours/days?&apos;,
        &apos;Is the pain constant, cramping, or comes in waves?&apos;,
        &apos;Does the pain move or radiate anywhere?&apos;,
        &apos;What makes the pain better or worse?&apos;,
        &apos;Do you have fever, chills, or feel generally unwell?&apos;,
        &apos;Any nausea, vomiting, or loss of appetite?&apos;,
        &apos;When was your last bowel movement? Any diarrhea or constipation?&apos;,
        &apos;Any blood in vomit or stool?&apos;,
        &apos;For women: Could you be pregnant? When was your last period?&apos;,
        &apos;Any urinary symptoms (burning, frequency, blood in urine)?&apos;,
        &apos;Have you had surgery or similar pain before?&apos;,
        &apos;Any recent travel, new medications, or dietary changes?&apos;
      ],
      differentials: {
        &apos;Right Upper Quadrant&apos;: [
          { condition: &apos;Acute Cholecystitis&apos;, likelihood: &apos;high&apos;, features: &apos;RUQ pain, fever, Murphy\&apos;s sign positive&apos; },
          { condition: &apos;Biliary Colic&apos;, likelihood: &apos;high&apos;, features: &apos;Episodic RUQ pain, no fever&apos; },
          { condition: &apos;Acute Hepatitis&apos;, likelihood: &apos;moderate&apos;, features: &apos;RUQ pain, jaundice, elevated transaminases&apos; },
          { condition: &apos;Peptic Ulcer Disease&apos;, likelihood: &apos;moderate&apos;, features: &apos;Epigastric pain, relation to meals&apos; }
        ],
        &apos;Right Lower Quadrant&apos;: [
          { condition: &apos;Acute Appendicitis&apos;, likelihood: &apos;high&apos;, features: &apos;Periumbilical→RLQ pain, fever, leukocytosis&apos; },
          { condition: &apos;Ovarian Pathology&apos;, likelihood: &apos;high&apos;, features: &apos;Women of childbearing age, adnexal mass&apos; },
          { condition: &apos;Inflammatory Bowel Disease&apos;, likelihood: &apos;moderate&apos;, features: &apos;Chronic symptoms, bloody diarrhea&apos; },
          { condition: &apos;Ureterolithiasis&apos;, likelihood: &apos;moderate&apos;, features: &apos;Colicky pain, hematuria, CVA tenderness&apos; }
        ],
        &apos;Left Lower Quadrant&apos;: [
          { condition: &apos;Diverticulitis&apos;, likelihood: &apos;high&apos;, features: &apos;Age >40, LLQ pain, fever, altered bowel habits&apos; },
          { condition: &apos;Ovarian Pathology&apos;, likelihood: &apos;high&apos;, features: &apos;Women of childbearing age&apos; },
          { condition: &apos;Inflammatory Bowel Disease&apos;, likelihood: &apos;moderate&apos;, features: &apos;Chronic bloody diarrhea&apos; },
          { condition: &apos;Ureterolithiasis&apos;, likelihood: &apos;moderate&apos;, features: &apos;Colicky pain, hematuria&apos; }
        ],
        &apos;Epigastric&apos;: [
          { condition: &apos;Peptic Ulcer Disease&apos;, likelihood: &apos;high&apos;, features: &apos;Relation to meals, H. pylori risk factors&apos; },
          { condition: &apos;Acute Pancreatitis&apos;, likelihood: &apos;high&apos;, features: &apos;Severe pain radiating to back, elevated lipase&apos; },
          { condition: &apos;GERD/Gastritis&apos;, likelihood: &apos;moderate&apos;, features: &apos;Burning pain, relation to meals/position&apos; },
          { condition: &apos;Myocardial Infarction&apos;, likelihood: &apos;moderate&apos;, features: &apos;Elderly, diabetes, cardiac risk factors&apos; }
        ],
        &apos;Periumbilical&apos;: [
          { condition: &apos;Early Appendicitis&apos;, likelihood: &apos;high&apos;, features: &apos;Pain migration to RLQ&apos; },
          { condition: &apos;Small Bowel Obstruction&apos;, likelihood: &apos;high&apos;, features: &apos;Cramping, vomiting, no flatus/BM&apos; },
          { condition: &apos;Gastroenteritis&apos;, likelihood: &apos;moderate&apos;, features: &apos;Diarrhea, vomiting, recent exposure&apos; },
          { condition: &apos;Inflammatory Bowel Disease&apos;, likelihood: &apos;low&apos;, features: &apos;Chronic symptoms&apos; }
        ],
        &apos;Diffuse/Generalized&apos;: [
          { condition: &apos;Peritonitis&apos;, likelihood: &apos;high&apos;, features: &apos;Severe pain, rigidity, systemic toxicity&apos; },
          { condition: &apos;Bowel Obstruction&apos;, likelihood: &apos;high&apos;, features: &apos;Cramping, vomiting, distension&apos; },
          { condition: &apos;Gastroenteritis&apos;, likelihood: &apos;moderate&apos;, features: &apos;Diarrhea, vomiting, recent exposure&apos; },
          { condition: &apos;Inflammatory Bowel Disease&apos;, likelihood: &apos;low&apos;, features: &apos;Chronic bloody diarrhea&apos; }
        ]
      },
      redFlags: [
        &apos;Sudden onset severe pain (consider perforation, rupture)&apos;,
        &apos;Signs of shock (hypotension, tachycardia, altered mental status)&apos;,
        &apos;Peritoneal signs (rigidity, rebound tenderness, guarding)&apos;,
        &apos;High fever >101.3°F with abdominal pain&apos;,
        &apos;Hematemesis or melena (GI bleeding)&apos;,
        &apos;Pregnancy with abdominal pain (ectopic pregnancy)&apos;,
        &apos;Age >65 with abdominal pain (higher risk complications)&apos;,
        &apos;Immunocompromised patient with abdominal pain&apos;,
        &apos;Recent abdominal surgery with new pain&apos;
      ],
      ageGenderFactors: {
        &apos;Children&apos;: [&apos;Appendicitis&apos;, &apos;Intussusception&apos;, &apos;Gastroenteritis&apos;],
        &apos;Women 15-45&apos;: [&apos;Ectopic pregnancy&apos;, &apos;Ovarian cyst/torsion&apos;, &apos;PID&apos;],
        &apos;Men >40&apos;: [&apos;Peptic ulcer&apos;, &apos;Pancreatitis&apos;, &apos;Diverticulitis&apos;],
        &apos;Women >40&apos;: [&apos;Cholecystitis&apos;, &apos;Diverticulitis&apos;, &apos;Bowel obstruction&apos;],
        &apos;Elderly&apos;: [&apos;Diverticulitis&apos;, &apos;Bowel obstruction&apos;, &apos;Mesenteric ischemia&apos;]
      },
      urgency: &apos;varies&apos;,
      clinicalPearls: [
        &apos;Murphy\&apos;s sign: Inspiratory arrest during RUQ palpation suggests cholecystitis&apos;,
        &apos;McBurney\&apos;s point tenderness: Classic for appendicitis but only 50% sensitive&apos;,
        &apos;Rovsing\&apos;s sign: RLQ pain with LLQ palpation suggests appendicitis&apos;,
        &apos;Pain out of proportion to exam suggests mesenteric ischemia&apos;,
        &apos;Elderly patients may have minimal symptoms despite serious pathology&apos;
      ]
    },
    &apos;anemia&apos;: {
      pivotalPoints: [
        &apos;MCV (mean corpuscular volume) is the key to classification&apos;,
        &apos;Reticulocyte count distinguishes production vs destruction/loss&apos;,
        &apos;History of bleeding (obvious or occult) is crucial&apos;,
        &apos;Dietary history and absorption issues guide evaluation&apos;
      ],
      questions: [
        &apos;How long have you been feeling tired or weak?&apos;,
        &apos;Have you noticed your skin or the inside of your eyelids looking pale?&apos;,
        &apos;Do you get short of breath with activities you used to do easily?&apos;,
        &apos;Do you have unusual cravings for ice, starch, or non-food items?&apos;,
        &apos;Have you noticed your heart racing or pounding?&apos;,
        &apos;Any dizziness, especially when standing up?&apos;,
        &apos;Have you seen any blood in your stool, or is your stool very dark/tarry?&apos;,
        &apos;Any heavy menstrual periods or bleeding between periods?&apos;,
        &apos;Have you vomited blood or coffee-ground material?&apos;,
        &apos;Any recent weight loss or poor appetite?&apos;,
        &apos;What does your typical diet look like? Do you eat meat, vegetables, fortified cereals?&apos;,
        &apos;Any family history of anemia or blood disorders?&apos;,
        &apos;Do you take any medications regularly, especially aspirin or NSAIDs?&apos;,
        &apos;Any history of stomach problems, celiac disease, or intestinal surgery?&apos;,
        &apos;Have you traveled recently or lived in areas with malaria?&apos;,
        &apos;Any unusual fatigue during childhood or family members with anemia?&apos;
      ],
      differentials: {
        &apos;Microcytic (MCV <80)&apos;: [
          { condition: &apos;Iron Deficiency Anemia&apos;, likelihood: &apos;very high&apos;, features: &apos;Most common cause, low ferritin, high TIBC, koilonychia, pica&apos; },
          { condition: &apos;Anemia of Chronic Disease&apos;, likelihood: &apos;high&apos;, features: &apos;Chronic illness, normal/high ferritin, low TIBC&apos; },
          { condition: &apos;Thalassemia Trait&apos;, likelihood: &apos;moderate&apos;, features: &apos;Family history, Mediterranean/Asian ancestry, normal iron studies&apos; },
          { condition: &apos;Sideroblastic Anemia&apos;, likelihood: &apos;low&apos;, features: &apos;Ring sideroblasts on bone marrow, may be reversible if alcohol/drug-related&apos; }
        ],
        &apos;Macrocytic (MCV >100)&apos;: [
          { condition: &apos;B12 Deficiency&apos;, likelihood: &apos;high&apos;, features: &apos;Neurologic symptoms, high LDH, hypersegmented neutrophils&apos; },
          { condition: &apos;Folate Deficiency&apos;, likelihood: &apos;high&apos;, features: &apos;Poor diet, alcoholism, pregnancy, no neurologic symptoms&apos; },
          { condition: &apos;Hypothyroidism&apos;, likelihood: &apos;moderate&apos;, features: &apos;Fatigue, weight gain, cold intolerance, elevated TSH&apos; },
          { condition: &apos;Alcohol Use Disorder&apos;, likelihood: &apos;moderate&apos;, features: &apos;History of alcohol use, liver dysfunction&apos; },
          { condition: &apos;Medication-Induced&apos;, likelihood: &apos;moderate&apos;, features: &apos;Methotrexate, hydroxyurea, antiretrovirals&apos; }
        ],
        &apos;Normocytic (MCV 80-100)&apos;: [
          { condition: &apos;Anemia of Chronic Disease&apos;, likelihood: &apos;high&apos;, features: &apos;Chronic illness, inflammation, normal iron studies pattern&apos; },
          { condition: &apos;Acute Blood Loss&apos;, likelihood: &apos;high&apos;, features: &apos;Recent bleeding, trauma, surgery, GI bleeding&apos; },
          { condition: &apos;Chronic Kidney Disease&apos;, likelihood: &apos;moderate&apos;, features: &apos;Elevated creatinine, decreased EPO production&apos; },
          { condition: &apos;Hemolytic Anemia&apos;, likelihood: &apos;moderate&apos;, features: &apos;Elevated LDH, low haptoglobin, jaundice, elevated bilirubin&apos; },
          { condition: &apos;Bone Marrow Failure&apos;, likelihood: &apos;low&apos;, features: &apos;Pancytopenia, bone marrow biopsy required&apos; }
        ]
      },
      redFlags: [
        &apos;Hemoglobin <7 g/dL (severe anemia requiring urgent evaluation)&apos;,
        &apos;Signs of heart failure (shortness of breath, chest pain, syncope)&apos;,
        &apos;Active GI bleeding (hematemesis, melena, hematochezia)&apos;,
        &apos;Neurologic symptoms with macrocytic anemia (B12 deficiency emergency)&apos;,
        &apos;Evidence of hemolysis (jaundice, dark urine, elevated LDH)&apos;,
        &apos;Pancytopenia (suggests bone marrow disorder)&apos;,
        &apos;Lymphadenopathy or splenomegaly (hematologic malignancy)&apos;,
        &apos;Weight loss >10% with anemia (malignancy concern)&apos;,
        &apos;Age >50 with new iron deficiency (colon cancer screening needed)&apos;
      ],
      ageGenderFactors: {
        &apos;Premenopausal Women&apos;: [&apos;Iron deficiency (menstrual losses)&apos;, &apos;Pregnancy-related&apos;, &apos;Fibroids with heavy bleeding&apos;],
        &apos;Postmenopausal Women&apos;: [&apos;GI bleeding (colon cancer)&apos;, &apos;Iron deficiency&apos;, &apos;Anemia of chronic disease&apos;],
        &apos;Men&apos;: [&apos;GI bleeding (peptic ulcer, colon cancer)&apos;, &apos;Anemia of chronic disease&apos;, &apos;B12/folate deficiency&apos;],
        &apos;Children&apos;: [&apos;Iron deficiency (dietary)&apos;, &apos;Thalassemia trait&apos;, &apos;Lead poisoning&apos;],
        &apos;Elderly&apos;: [&apos;Anemia of chronic disease&apos;, &apos;B12 deficiency&apos;, &apos;Myelodysplastic syndrome&apos;],
        &apos;Vegetarians&apos;: [&apos;Iron deficiency&apos;, &apos;B12 deficiency&apos;, &apos;Folate deficiency&apos;]
      },
      workupApproach: {
        &apos;Initial Labs&apos;: [&apos;CBC with differential&apos;, &apos;Reticulocyte count&apos;, &apos;Iron studies (ferritin, TIBC, transferrin saturation)&apos;, &apos;B12 and folate levels&apos;],
        &apos;If Microcytic&apos;: [&apos;Confirm iron deficiency vs thalassemia trait&apos;, &apos;Find source of iron loss if iron deficient&apos;],
        &apos;If Macrocytic&apos;: [&apos;B12 and folate levels&apos;, &apos;TSH&apos;, &apos;Alcohol history&apos;, &apos;Medication review&apos;],
        &apos;If Normocytic&apos;: [&apos;Reticulocyte count&apos;, &apos;LDH and haptoglobin&apos;, &apos;Creatinine&apos;, &apos;Chronic disease markers&apos;]
      },
      urgency: &apos;varies&apos;,
      clinicalPearls: [
        &apos;Iron deficiency without obvious bleeding in men/postmenopausal women requires GI evaluation&apos;,
        &apos;B12 deficiency can cause irreversible neurologic damage if untreated&apos;,
        &apos;Anemia of chronic disease: ferritin normal/high, TIBC low, transferrin saturation low-normal&apos;,
        &apos;Thalassemia trait: family history, normal iron studies, Hb A2 elevated on electrophoresis&apos;,
        &apos;Reticulocyte count <2% suggests production problem; >2% suggests loss/destruction&apos;,
        &apos;Pica (ice, starch cravings) is pathognomonic for iron deficiency&apos;,
        &apos;Koilonychia (spoon nails) suggests severe, chronic iron deficiency&apos;
      ]
    },
    &apos;back pain&apos;: {
      pivotalPoints: [
        &apos;Red flag symptoms identify serious pathology requiring urgent evaluation&apos;,
        &apos;Mechanical vs non-mechanical pain patterns guide differential diagnosis&apos;,
        &apos;Neurologic deficits suggest nerve root compression or spinal cord involvement&apos;,
        &apos;Age >50 or <20 increases risk of serious underlying pathology&apos;
      ],
      questions: [
        &apos;Where exactly is your back pain located (upper, middle, lower back)?&apos;,
        &apos;When did the pain start and how did it begin (sudden vs gradual)?&apos;,
        &apos;What does the pain feel like (aching, sharp, burning, shooting)?&apos;,
        &apos;Does the pain travel down your leg(s) or into other areas?&apos;,
        &apos;What makes the pain better or worse (movement, rest, position)?&apos;,
        &apos;Is the pain worse at night or when lying down?&apos;,
        &apos;Any numbness, tingling, or weakness in your legs or feet?&apos;,
        &apos;Any difficulty with bladder or bowel control?&apos;,
        &apos;Have you had any recent fever, chills, or feeling unwell?&apos;,
        &apos;Any recent weight loss without trying to lose weight?&apos;,
        &apos;Do you have a history of cancer?&apos;,
        &apos;Any recent infection, especially urinary tract or skin?&apos;,
        &apos;Are you taking any blood thinners or steroids?&apos;,
        &apos;Any recent fall, injury, or heavy lifting?&apos;,
        &apos;Have you tried any treatments and did they help?&apos;,
        &apos;Any morning stiffness that improves with activity?&apos;
      ],
      differentials: {
        &apos;Mechanical/Benign (95% of cases)&apos;: [
          { condition: &apos;Muscle Strain/Sprain&apos;, likelihood: &apos;very high&apos;, features: &apos;Acute onset, activity-related, improves with rest, no neurologic deficits&apos; },
          { condition: &apos;Lumbar Disc Herniation&apos;, likelihood: &apos;high&apos;, features: &apos;Radicular pain, positive straight leg raise, L4-S1 distribution&apos; },
          { condition: &apos;Lumbar Spinal Stenosis&apos;, likelihood: &apos;moderate&apos;, features: &apos;Age >60, neurogenic claudication, improves with forward flexion&apos; },
          { condition: &apos;Facet Joint Arthropathy&apos;, likelihood: &apos;moderate&apos;, features: &apos;Extension worsens pain, morning stiffness, age-related changes&apos; },
          { condition: &apos;Sacroiliac Joint Dysfunction&apos;, likelihood: &apos;moderate&apos;, features: &apos;Unilateral low back/buttock pain, positive provocative tests&apos; }
        ],
        &apos;Serious Pathology (Red Flags - 5% of cases)&apos;: [
          { condition: &apos;Cauda Equina Syndrome&apos;, likelihood: &apos;rare but critical&apos;, features: &apos;Saddle anesthesia, bowel/bladder dysfunction, bilateral leg weakness&apos; },
          { condition: &apos;Spinal Epidural Abscess&apos;, likelihood: &apos;rare&apos;, features: &apos;Fever, elevated ESR/CRP, IV drug use, recent infection&apos; },
          { condition: &apos;Vertebral Osteomyelitis&apos;, likelihood: &apos;rare&apos;, features: &apos;Fever, night pain, elevated ESR/CRP, immunocompromised&apos; },
          { condition: &apos;Spinal Malignancy&apos;, likelihood: &apos;rare&apos;, features: &apos;Age >50, history of cancer, weight loss, night pain, failure to improve&apos; },
          { condition: &apos;Compression Fracture&apos;, likelihood: &apos;low-moderate&apos;, features: &apos;Age >70, osteoporosis, steroid use, trauma history&apos; }
        ],
        &apos;Inflammatory&apos;: [
          { condition: &apos;Ankylosing Spondylitis&apos;, likelihood: &apos;low&apos;, features: &apos;Age <40, morning stiffness >1hr, improves with exercise, family history&apos; },
          { condition: &apos;Inflammatory Bowel Disease&apos;, likelihood: &apos;low&apos;, features: &apos;GI symptoms, young adult, HLA-B27 positive&apos; },
          { condition: &apos;Psoriatic Arthritis&apos;, likelihood: &apos;low&apos;, features: &apos;Skin psoriasis, nail changes, asymmetric joint involvement&apos; }
        ],
        &apos;Referred Pain&apos;: [
          { condition: &apos;Aortic Aneurysm&apos;, likelihood: &apos;rare&apos;, features: &apos;Sudden severe pain, pulsatile abdominal mass, vascular risk factors&apos; },
          { condition: &apos;Nephrolithiasis&apos;, likelihood: &apos;low&apos;, features: &apos;Colicky flank pain, hematuria, nausea/vomiting&apos; },
          { condition: &apos;Pyelonephritis&apos;, likelihood: &apos;low&apos;, features: &apos;Fever, CVA tenderness, urinary symptoms&apos; },
          { condition: &apos;Pancreatitis&apos;, likelihood: &apos;rare&apos;, features: &apos;Epigastric pain radiating to back, alcohol history, elevated lipase&apos; }
        ]
      },
      redFlags: [
        &apos;Cauda equina syndrome (saddle anesthesia, bowel/bladder dysfunction)&apos;,
        &apos;Progressive neurologic deficits or severe weakness&apos;,
        &apos;Fever with back pain (infection concern)&apos;,
        &apos;History of cancer with new back pain&apos;,
        &apos;Age >70 with new back pain (fracture risk)&apos;,
        &apos;Significant trauma with back pain&apos;,
        &apos;IV drug use with back pain (epidural abscess)&apos;,
        &apos;Immunocompromised patient with back pain&apos;,
        &apos;Failure to improve after 6 weeks of conservative treatment&apos;,
        &apos;Night pain that wakes patient from sleep&apos;,
        &apos;Unexplained weight loss with back pain&apos;
      ],
      ageGenderFactors: {
        &apos;Young Adults (20-40)&apos;: [&apos;Muscle strain&apos;, &apos;Disc herniation&apos;, &apos;Ankylosing spondylitis&apos;, &apos;Inflammatory conditions&apos;],
        &apos;Middle Age (40-60)&apos;: [&apos;Disc herniation&apos;, &apos;Facet arthropathy&apos;, &apos;Muscle strain&apos;, &apos;Degenerative changes&apos;],
        &apos;Older Adults (>60)&apos;: [&apos;Spinal stenosis&apos;, &apos;Compression fractures&apos;, &apos;Malignancy&apos;, &apos;Degenerative disease&apos;],
        &apos;Athletes&apos;: [&apos;Muscle strain&apos;, &apos;Stress fractures&apos;, &apos;Spondylolysis&apos;, &apos;Disc herniation&apos;],
        &apos;Postmenopausal Women&apos;: [&apos;Osteoporotic fractures&apos;, &apos;Degenerative changes&apos;],
        &apos;Immunocompromised&apos;: [&apos;Spinal infections&apos;, &apos;Malignancy&apos;, &apos;Atypical presentations&apos;]
      },
      neurologicExam: {
        &apos;L4 Nerve Root&apos;: [&apos;Knee extension weakness&apos;, &apos;Decreased patellar reflex&apos;, &apos;Numbness over medial leg&apos;],
        &apos;L5 Nerve Root&apos;: [&apos;Dorsiflexion weakness&apos;, &apos;No reliable reflex&apos;, &apos;Numbness over lateral leg/dorsal foot&apos;],
        &apos;S1 Nerve Root&apos;: [&apos;Plantarflexion weakness&apos;, &apos;Decreased Achilles reflex&apos;, &apos;Numbness over lateral foot&apos;],
        &apos;Cauda Equina&apos;: [&apos;Saddle anesthesia&apos;, &apos;Bowel/bladder dysfunction&apos;, &apos;Bilateral leg weakness&apos;]
      },
      specialTests: {
        &apos;Straight Leg Raise&apos;: &apos;Positive if pain <60° suggests nerve root irritation&apos;,
        &apos;Crossed Straight Leg Raise&apos;: &apos;Highly specific for disc herniation&apos;,
        &apos;Spurling Test&apos;: &apos;Neck extension/rotation for cervical radiculopathy&apos;,
        &apos;FABER Test&apos;: &apos;Hip pathology vs sacroiliac joint dysfunction&apos;
      },
      urgency: &apos;varies&apos;,
      clinicalPearls: [
        &apos;95% of back pain is mechanical and benign - focus on red flag screening&apos;,
        &apos;Sciatica: pain radiating below knee is more specific than just leg pain&apos;,
        &apos;Neurogenic claudication: leg pain with walking that improves with sitting/forward flexion&apos;,
        &apos;Night pain that disrupts sleep suggests serious pathology&apos;,
        &apos;Most acute back pain improves within 6 weeks with conservative treatment&apos;,
        &apos;Imaging not indicated for acute back pain without red flags in first 6 weeks&apos;,
        &apos;Bed rest >2 days may delay recovery - encourage early mobilization&apos;
      ]
    },
    &apos;syncope&apos;: {
      pivotalPoints: [
        &apos;Cardiac syncope is life-threatening and requires immediate evaluation and monitoring&apos;,
        &apos;Presence of structural heart disease significantly increases risk of sudden cardiac death&apos;,
        &apos;Syncope during exertion or while supine suggests cardiac etiology&apos;,
        &apos;Family history of sudden cardiac death or inherited cardiomyopathy is a major red flag&apos;
      ],
      questions: [
        &apos;Can you describe exactly what happened before, during, and after you lost consciousness?&apos;,
        &apos;Were there any warning symptoms (chest pain, palpitations, nausea, sweating)?&apos;,
        &apos;What were you doing when it happened (standing, sitting, lying down, exercising)?&apos;,
        &apos;How long were you unconscious? Did anyone witness it?&apos;,
        &apos;Did you have any jerking movements or lose control of bladder/bowel?&apos;,
        &apos;How did you feel when you woke up (confused, tired, normal)?&apos;,
        &apos;Any chest pain, shortness of breath, or palpitations?&apos;,
        &apos;Have you had episodes like this before?&apos;,
        &apos;Any recent illness, dehydration, or changes in medications?&apos;,
        &apos;Do you have any heart problems or take heart medications?&apos;,
        &apos;Any family history of sudden cardiac death or fainting?&apos;,
        &apos;Any recent head trauma or neurologic symptoms?&apos;,
        &apos;For women: Could you be pregnant? When was your last period?&apos;,
        &apos;Do you have diabetes? When did you last eat?&apos;,
        &apos;Any recent prolonged standing, hot environments, or emotional stress?&apos;,
        &apos;Are you taking any medications, especially blood pressure or heart medications?&apos;
      ],
      differentials: {
        &apos;Cardiac Syncope (Life-Threatening - 10-30% of cases)&apos;: [
          { condition: &apos;Ventricular Tachycardia/Fibrillation&apos;, likelihood: &apos;high concern&apos;, features: &apos;Sudden onset, no prodrome, exercise-related, structural heart disease&apos; },
          { condition: &apos;Complete Heart Block&apos;, likelihood: &apos;high concern&apos;, features: &apos;Bradycardia, elderly, known conduction disease, pacemaker malfunction&apos; },
          { condition: &apos;Hypertrophic Cardiomyopathy&apos;, likelihood: &apos;moderate concern&apos;, features: &apos;Young athletes, family history, exertional syncope, murmur&apos; },
          { condition: &apos;Aortic Stenosis&apos;, likelihood: &apos;moderate concern&apos;, features: &apos;Elderly, systolic murmur, exertional symptoms, heart failure&apos; },
          { condition: &apos;Pulmonary Embolism&apos;, likelihood: &apos;moderate concern&apos;, features: &apos;Sudden onset, dyspnea, chest pain, risk factors for DVT&apos; },
          { condition: &apos;Long QT Syndrome&apos;, likelihood: &apos;low but critical&apos;, features: &apos;Young patients, family history, medication-induced, swimming/diving&apos; }
        ],
        &apos;Neurally Mediated Syncope (Benign - 50-60% of cases)&apos;: [
          { condition: &apos;Vasovagal Syncope&apos;, likelihood: &apos;very high&apos;, features: &apos;Triggers (pain, fear, standing), prodrome, gradual onset, young patients&apos; },
          { condition: &apos;Situational Syncope&apos;, likelihood: &apos;moderate&apos;, features: &apos;Coughing, micturition, defecation, swallowing-related triggers&apos; },
          { condition: &apos;Carotid Sinus Hypersensitivity&apos;, likelihood: &apos;low&apos;, features: &apos;Elderly men, neck movement/pressure triggers, shaving, tight collars&apos; }
        ],
        &apos;Orthostatic Syncope (15-25% of cases)&apos;: [
          { condition: &apos;Volume Depletion&apos;, likelihood: &apos;high&apos;, features: &apos;Dehydration, bleeding, diarrhea, diuretics, poor oral intake&apos; },
          { condition: &apos;Medication-Induced&apos;, likelihood: &apos;high&apos;, features: &apos;Antihypertensives, diuretics, nitrates, alpha-blockers, antidepressants&apos; },
          { condition: &apos;Autonomic Neuropathy&apos;, likelihood: &apos;moderate&apos;, features: &apos;Diabetes, Parkinson disease, prolonged bed rest&apos; },
          { condition: &apos;Addison Disease&apos;, likelihood: &apos;rare&apos;, features: &apos;Hyperpigmentation, hyponatremia, hyperkalemia, weight loss&apos; }
        ],
        &apos;Neurologic Syncope (5-10% of cases)&apos;: [
          { condition: &apos;Seizure&apos;, likelihood: &apos;moderate&apos;, features: &apos;Tonic-clonic movements, tongue biting, postictal confusion, incontinence&apos; },
          { condition: &apos;Vertebrobasilar TIA&apos;, likelihood: &apos;low&apos;, features: &apos;Elderly, vascular risk factors, other neurologic symptoms&apos; },
          { condition: &apos;Subclavian Steal Syndrome&apos;, likelihood: &apos;rare&apos;, features: &apos;Arm exercise-induced, blood pressure differential between arms&apos; }
        ],
        &apos;Metabolic/Other Causes&apos;: [
          { condition: &apos;Hypoglycemia&apos;, likelihood: &apos;moderate&apos;, features: &apos;Diabetes, insulin use, prolonged fasting, diaphoresis, confusion&apos; },
          { condition: &apos;Pregnancy&apos;, likelihood: &apos;varies&apos;, features: &apos;Women of childbearing age, supine position, morning sickness&apos; },
          { condition: &apos;Anemia&apos;, likelihood: &apos;low&apos;, features: &apos;Pallor, fatigue, heavy menstrual bleeding, GI bleeding&apos; },
          { condition: &apos;Psychogenic Pseudosyncope&apos;, likelihood: &apos;low&apos;, features: &apos;Psychiatric history, no injury despite falls, eyes closed during episode&apos; }
        ]
      },
      riskStratification: {
        &apos;High Risk Features (Cardiac Syncope)&apos;: [
          &apos;Age >60 years&apos;,
          &apos;Known structural heart disease&apos;,
          &apos;Family history of sudden cardiac death&apos;,
          &apos;Syncope during exertion or while supine&apos;,
          &apos;No prodromal symptoms&apos;,
          &apos;Associated chest pain or palpitations&apos;,
          &apos;Abnormal ECG&apos;,
          &apos;Heart failure symptoms&apos;
        ],
        &apos;Low Risk Features (Benign Syncope)&apos;: [
          &apos;Age <35 years&apos;,
          &apos;Clear vasovagal triggers&apos;,
          &apos;Prodromal symptoms (nausea, diaphoresis)&apos;,
          &apos;Gradual onset and recovery&apos;,
          &apos;No structural heart disease&apos;,
          &apos;Normal ECG&apos;,
          &apos;Prolonged standing before episode&apos;
        ]
      },
      clinicalAssessment: {
        &apos;Key Historical Features&apos;: [
          &apos;Triggers: Standing, pain, fear, exertion, position change&apos;,
          &apos;Prodrome: Nausea, diaphoresis, visual changes, palpitations&apos;,
          &apos;Witness description: Duration, movements, color changes&apos;,
          &apos;Recovery: Immediate vs prolonged confusion&apos;,
          &apos;Precipitants: Medications, illness, dehydration&apos;
        ],
        &apos;Physical Examination&apos;: [
          &apos;Vital signs including orthostatic measurements&apos;,
          &apos;Cardiovascular examination (murmurs, gallops, JVD)&apos;,
          &apos;Neurologic examination&apos;,
          &apos;Evidence of trauma from fall&apos;,
          &apos;Signs of volume depletion&apos;
        ],
        &apos;Orthostatic Vital Signs&apos;: [
          &apos;Supine BP/HR → Standing BP/HR at 1 and 3 minutes&apos;,
          &apos;Positive: SBP drop ≥20 mmHg or DBP drop ≥10 mmHg&apos;,
          &apos;Or HR increase ≥30 bpm&apos;,
          &apos;Symptoms with position change&apos;
        ]
      },
      redFlags: [
        &apos;Syncope during exertion or while supine&apos;,
        &apos;Family history of sudden cardiac death <50 years old&apos;,
        &apos;Known structural heart disease or cardiomyopathy&apos;,
        &apos;Syncope with chest pain or palpitations&apos;,
        &apos;Abnormal ECG (prolonged QT, heart block, Q waves)&apos;,
        &apos;Age >60 with first episode of syncope&apos;,
        &apos;Syncope causing significant injury&apos;,
        &apos;Multiple episodes without clear trigger&apos;,
        &apos;Associated neurologic deficits&apos;
      ],
      diagnosticApproach: {
        &apos;Initial Evaluation (All Patients)&apos;: [
          &apos;Detailed history from patient and witnesses&apos;,
          &apos;Complete physical examination&apos;,
          &apos;12-lead ECG&apos;,
          &apos;Orthostatic vital signs&apos;,
          &apos;Basic metabolic panel and glucose&apos;,
          &apos;Complete blood count&apos;,
          &apos;Pregnancy test (women of childbearing age)&apos;
        ],
        &apos;Risk-Based Further Testing&apos;: [
          &apos;High Risk: Echocardiogram, telemetry monitoring, cardiology consultation&apos;,
          &apos;Intermediate Risk: Holter monitor, event recorder, stress testing&apos;,
          &apos;Low Risk: Reassurance, trigger avoidance, follow-up&apos;
        ],
        &apos;Specialized Testing&apos;: [
          &apos;Electrophysiology study (recurrent unexplained syncope)&apos;,
          &apos;Tilt table test (suspected vasovagal syncope)&apos;,
          &apos;Carotid massage (suspected carotid sinus hypersensitivity)&apos;,
          &apos;Implantable loop recorder (recurrent unexplained episodes)&apos;,
          &apos;CT/MRI head (suspected neurologic cause)&apos;
        ]
      },
      ecgFindings: {
        &apos;High-Risk ECG Findings&apos;: [
          &apos;Prolonged QT interval (>450 ms men, >460 ms women)&apos;,
          &apos;Short QT interval (<340 ms)&apos;,
          &apos;Brugada pattern (ST elevation V1-V3)&apos;,
          &apos;Epsilon wave or T-wave inversion V1-V3 (ARVC)&apos;,
          &apos;Q waves suggesting prior MI&apos;,
          &apos;Left ventricular hypertrophy with strain&apos;,
          &apos;Complete heart block or high-grade AV block&apos;,
          &apos;Atrial fibrillation with slow ventricular response&apos;
        ],
        &apos;Low-Risk ECG Findings&apos;: [
          &apos;Normal sinus rhythm&apos;,
          &apos;Sinus bradycardia in young athletes&apos;,
          &apos;First-degree AV block&apos;,
          &apos;Early repolarization&apos;,
          &apos;Incomplete right bundle branch block&apos;
        ]
      },
      treatmentApproach: {
        &apos;Cardiac Syncope&apos;: [
          &apos;Immediate cardiology consultation&apos;,
          &apos;Continuous cardiac monitoring&apos;,
          &apos;Pacemaker for bradyarrhythmias&apos;,
          &apos;ICD for ventricular arrhythmias&apos;,
          &apos;Medical therapy for heart failure&apos;,
          &apos;Activity restriction until evaluation complete&apos;
        ],
        &apos;Vasovagal Syncope&apos;: [
          &apos;Education about triggers and avoidance&apos;,
          &apos;Increased fluid and salt intake&apos;,
          &apos;Physical counterpressure maneuvers&apos;,
          &apos;Tilt training exercises&apos;,
          &apos;Medications: fludrocortisone, midodrine (refractory cases)&apos;
        ],
        &apos;Orthostatic Hypotension&apos;: [
          &apos;Review and adjust medications&apos;,
          &apos;Increase fluid and sodium intake&apos;,
          &apos;Compression stockings&apos;,
          &apos;Physical therapy and conditioning&apos;,
          &apos;Medications: fludrocortisone, midodrine, droxidopa&apos;
        ],
        &apos;Situational Syncope&apos;: [
          &apos;Identify and avoid specific triggers&apos;,
          &apos;Behavioral modifications&apos;,
          &apos;Treatment of underlying conditions&apos;,
          &apos;Reassurance about benign nature&apos;
        ]
      },
      dispositionGuidelines: {
        &apos;Admit to Hospital&apos;: [
          &apos;High-risk cardiac features&apos;,
          &apos;Structural heart disease&apos;,
          &apos;Abnormal ECG concerning for arrhythmia&apos;,
          &apos;Syncope with exertion&apos;,
          &apos;Family history of sudden cardiac death&apos;,
          &apos;Significant injury from syncope&apos;,
          &apos;Frequent recurrent episodes&apos;
        ],
        &apos;Discharge Home&apos;: [
          &apos;Clear vasovagal episode with typical triggers&apos;,
          &apos;Normal ECG and physical examination&apos;,
          &apos;No high-risk features&apos;,
          &apos;Young age (<35) with benign history&apos;,
          &apos;Adequate follow-up arranged&apos;
        ],
        &apos;Observation/Short Stay&apos;: [
          &apos;Intermediate risk features&apos;,
          &apos;Need for brief monitoring&apos;,
          &apos;Medication adjustment required&apos;,
          &apos;Social issues preventing safe discharge&apos;
        ]
      },
      specialPopulations: {
        &apos;Athletes&apos;: [
          &apos;Higher suspicion for genetic cardiomyopathies&apos;,
          &apos;Detailed family history essential&apos;,
          &apos;Exercise restriction until cleared&apos;,
          &apos;Echocardiogram and stress testing&apos;,
          &apos;Consider genetic testing if indicated&apos;
        ],
        &apos;Elderly&apos;: [
          &apos;Higher risk of cardiac causes&apos;,
          &apos;Medication review essential&apos;,
          &apos;Fall risk assessment&apos;,
          &apos;Cognitive evaluation&apos;,
          &apos;Polypharmacy considerations&apos;
        ],
        &apos;Pregnancy&apos;: [
          &apos;Usually benign vasovagal syncope&apos;,
          &apos;Supine hypotensive syndrome&apos;,
          &apos;Peripartum cardiomyopathy consideration&apos;,
          &apos;Avoid prolonged supine positioning&apos;
        ],
        &apos;Pediatrics&apos;: [
          &apos;Usually vasovagal syncope&apos;,
          &apos;Breath-holding spells in toddlers&apos;,
          &apos;Long QT syndrome consideration&apos;,
          &apos;Detailed family history crucial&apos;
        ]
      },
      prognosticFactors: {
        &apos;Cardiac Syncope&apos;: [
          &apos;1-year mortality: 18-33%&apos;,
          &apos;High risk of sudden cardiac death&apos;,
          &apos;Requires immediate intervention&apos;,
          &apos;Close cardiology follow-up essential&apos;
        ],
        &apos;Vasovagal Syncope&apos;: [
          &apos;Excellent prognosis&apos;,
          &apos;Recurrence common but benign&apos;,
          &apos;Quality of life impact main concern&apos;,
          &apos;No increased mortality risk&apos;
        ],
        &apos;Orthostatic Hypotension&apos;: [
          &apos;Prognosis depends on underlying cause&apos;,
          &apos;Increased fall risk&apos;,
          &apos;Medication adjustment often successful&apos;,
          &apos;Chronic conditions may require ongoing management&apos;
        ]
      },
      urgency: &apos;immediate&apos;,
      clinicalPearls: [
        &apos;Cardiac syncope has 18-33% one-year mortality - high-risk features require immediate evaluation&apos;,
        &apos;Exertional syncope is cardiac until proven otherwise&apos;,
        &apos;Family history of sudden cardiac death <50 years is a major red flag&apos;,
        &apos;Normal ECG does not rule out cardiac syncope - 50% have normal ECG&apos;,
        &apos;Vasovagal syncope: gradual onset, triggers, prodrome, quick recovery&apos;,
        &apos;Orthostatic hypotension: check medications first (most common cause)&apos;,
        &apos;Seizure vs syncope: prolonged postictal confusion suggests seizure&apos;,
        &apos;Supine syncope suggests cardiac cause (not vasovagal)&apos;,
        &apos;Young athletes with syncope need cardiac evaluation before return to play&apos;,
        &apos;Elderly patients: higher risk of cardiac causes and medication effects&apos;,
        &apos;Prolonged QT >500 ms significantly increases arrhythmia risk&apos;,
        &apos;Situational syncope (cough, micturition) is usually benign&apos;,
        &apos;Tilt table test useful for vasovagal syncope diagnosis&apos;,
        &apos;Implantable loop recorders have highest diagnostic yield for recurrent unexplained syncope&apos;
      ]
    },
    &apos;nausea and vomiting&apos;: {
      pivotalPoints: [
        &apos;Timing and characteristics help distinguish gastric vs intestinal vs central causes&apos;,
        &apos;Associated symptoms guide evaluation toward specific organ systems&apos;,
        &apos;Red flag symptoms identify serious underlying pathology requiring urgent evaluation&apos;,
        &apos;Medication history is crucial as drug-induced nausea is extremely common&apos;
      ],
      questions: [
        &apos;When did the nausea and vomiting start?&apos;,
        &apos;How often are you vomiting and what does the vomit look like?&apos;,
        &apos;Any blood in the vomit or coffee-ground appearance?&apos;,
        &apos;Any abdominal pain? Where is it located?&apos;,
        &apos;Any fever, chills, or feeling generally unwell?&apos;,
        &apos;Any diarrhea or changes in bowel movements?&apos;,
        &apos;Any headache, dizziness, or vision changes?&apos;,
        &apos;Are you able to keep fluids down?&apos;,
        &apos;What makes the nausea better or worse?&apos;,
        &apos;Any recent travel or unusual food exposures?&apos;,
        &apos;Are you taking any new medications or supplements?&apos;,
        &apos;For women: When was your last menstrual period? Could you be pregnant?&apos;,
        &apos;Any recent head trauma or injury?&apos;,
        &apos;Do you have diabetes? When did you last check your blood sugar?&apos;,
        &apos;Any history of stomach problems, gallbladder disease, or kidney stones?&apos;,
        &apos;Any chest pain, shortness of breath, or heart palpitations?&apos;,
        &apos;Have you been around anyone else who is sick?&apos;
      ],
      differentials: {
        &apos;Gastrointestinal Causes (Most Common)&apos;: [
          { condition: &apos;Viral Gastroenteritis&apos;, likelihood: &apos;very high&apos;, features: &apos;Acute onset, diarrhea, cramping, family clusters, self-limiting&apos; },
          { condition: &apos;Food Poisoning&apos;, likelihood: &apos;high&apos;, features: &apos;Rapid onset 1-6h after eating, specific food exposure, multiple people affected&apos; },
          { condition: &apos;Gastroparesis&apos;, likelihood: &apos;moderate&apos;, features: &apos;Diabetes, early satiety, bloating, delayed gastric emptying&apos; },
          { condition: &apos;Peptic Ulcer Disease&apos;, likelihood: &apos;moderate&apos;, features: &apos;Epigastric pain, H. pylori, NSAID use, relation to meals&apos; },
          { condition: &apos;Gastroesophageal Reflux Disease&apos;, likelihood: &apos;moderate&apos;, features: &apos;Heartburn, regurgitation, worse lying down&apos; },
          { condition: &apos;Bowel Obstruction&apos;, likelihood: &apos;low&apos;, features: &apos;Cramping pain, distension, inability to pass gas/stool, prior surgery&apos; }
        ],
        &apos;Serious GI Emergencies&apos;: [
          { condition: &apos;Upper GI Bleeding&apos;, likelihood: &apos;moderate concern&apos;, features: &apos;Hematemesis, coffee-ground emesis, melena, hemodynamic instability&apos; },
          { condition: &apos;Acute Pancreatitis&apos;, likelihood: &apos;moderate concern&apos;, features: &apos;Severe epigastric pain radiating to back, alcohol history, elevated lipase&apos; },
          { condition: &apos;Acute Cholecystitis&apos;, likelihood: &apos;moderate concern&apos;, features: &apos;RUQ pain, fever, Murphy\&apos;s sign, gallstone history&apos; },
          { condition: &apos;Appendicitis&apos;, likelihood: &apos;low concern&apos;, features: &apos;Periumbilical→RLQ pain, fever, anorexia, leukocytosis&apos; }
        ],
        &apos;Central/Neurologic Causes&apos;: [
          { condition: &apos;Increased Intracranial Pressure&apos;, likelihood: &apos;rare but critical&apos;, features: &apos;Headache, altered mental status, papilledema, projectile vomiting&apos; },
          { condition: &apos;Migraine&apos;, likelihood: &apos;moderate&apos;, features: &apos;Unilateral headache, photophobia, phonophobia, family history&apos; },
          { condition: &apos;Vestibular Disorders&apos;, likelihood: &apos;moderate&apos;, features: &apos;Vertigo, motion sensitivity, nystagmus, hearing changes&apos; },
          { condition: &apos;Concussion/Head Trauma&apos;, likelihood: &apos;varies&apos;, features: &apos;Recent head injury, confusion, headache, amnesia&apos; }
        ],
        &apos;Metabolic/Endocrine Causes&apos;: [
          { condition: &apos;Diabetic Ketoacidosis&apos;, likelihood: &apos;moderate concern&apos;, features: &apos;Diabetes, hyperglycemia, ketones, Kussmaul breathing, dehydration&apos; },
          { condition: &apos;Uremia&apos;, likelihood: &apos;moderate&apos;, features: &apos;Chronic kidney disease, elevated creatinine, metallic taste&apos; },
          { condition: &apos;Hypercalcemia&apos;, likelihood: &apos;low&apos;, features: &apos;Malignancy, kidney stones, confusion, constipation&apos; },
          { condition: &apos;Adrenal Insufficiency&apos;, likelihood: &apos;rare&apos;, features: &apos;Hypotension, hyperpigmentation, hyperkalemia, hyponatremia&apos; }
        ],
        &apos;Infectious Causes&apos;: [
          { condition: &apos;Acute Hepatitis&apos;, likelihood: &apos;moderate&apos;, features: &apos;Jaundice, RUQ pain, elevated transaminases, risk factors&apos; },
          { condition: &apos;Pyelonephritis&apos;, likelihood: &apos;moderate&apos;, features: &apos;Fever, flank pain, dysuria, CVA tenderness&apos; },
          { condition: &apos;Meningitis&apos;, likelihood: &apos;rare but critical&apos;, features: &apos;Fever, headache, neck stiffness, photophobia, altered mental status&apos; },
          { condition: &apos;Sepsis&apos;, likelihood: &apos;moderate concern&apos;, features: &apos;Fever, hypotension, altered mental status, organ dysfunction&apos; }
        ],
        &apos;Medication/Toxin-Induced&apos;: [
          { condition: &apos;Opioid Withdrawal&apos;, likelihood: &apos;moderate&apos;, features: &apos;Opioid use history, myalgias, diarrhea, anxiety, dilated pupils&apos; },
          { condition: &apos;Chemotherapy-Induced&apos;, likelihood: &apos;high&apos;, features: &apos;Recent chemotherapy, delayed or immediate onset&apos; },
          { condition: &apos;Antibiotic-Associated&apos;, likelihood: &apos;moderate&apos;, features: &apos;Recent antibiotic use, C. diff risk factors&apos; },
          { condition: &apos;Alcohol Withdrawal&apos;, likelihood: &apos;moderate&apos;, features: &apos;Heavy alcohol use, tremor, anxiety, hallucinations&apos; }
        ],
        &apos;Pregnancy-Related&apos;: [
          { condition: &apos;Morning Sickness&apos;, likelihood: &apos;very high&apos;, features: &apos;First trimester, mild symptoms, improves with time&apos; },
          { condition: &apos;Hyperemesis Gravidarum&apos;, likelihood: &apos;low&apos;, features: &apos;Severe vomiting, dehydration, weight loss, ketosis&apos; },
          { condition: &apos;HELLP Syndrome&apos;, likelihood: &apos;rare but critical&apos;, features: &apos;Third trimester, hypertension, hemolysis, elevated liver enzymes&apos; }
        ],
        &apos;Cardiovascular Causes&apos;: [
          { condition: &apos;Myocardial Infarction&apos;, likelihood: &apos;low but critical&apos;, features: &apos;Chest pain, diaphoresis, elderly, diabetics, women&apos; },
          { condition: &apos;Inferior Wall MI&apos;, likelihood: &apos;low but critical&apos;, features: &apos;Nausea prominent, bradycardia, ST elevation II, III, aVF&apos; }
        ]
      },
      clinicalAssessment: {
        &apos;Vomiting Characteristics&apos;: [
          &apos;Bilious: Green/yellow suggests small bowel obstruction&apos;,
          &apos;Coffee-ground: Upper GI bleeding (digested blood)&apos;,
          &apos;Hematemesis: Active upper GI bleeding&apos;,
          &apos;Projectile: Increased intracranial pressure, pyloric stenosis&apos;,
          &apos;Undigested food: Gastroparesis, gastric outlet obstruction&apos;
        ],
        &apos;Timing Patterns&apos;: [
          &apos;Immediate (<1h): Gastric causes, psychogenic&apos;,
          &apos;Early (1-6h): Food poisoning, gastritis&apos;,
          &apos;Delayed (>6h): Small bowel obstruction, gastroparesis&apos;,
          &apos;Morning: Pregnancy, increased ICP, alcohol withdrawal&apos;
        ]
      },
      redFlags: [
        &apos;Hematemesis or coffee-ground emesis (GI bleeding)&apos;,
        &apos;Severe abdominal pain with vomiting (surgical emergency)&apos;,
        &apos;Signs of dehydration or hemodynamic instability&apos;,
        &apos;Altered mental status with vomiting (meningitis, increased ICP)&apos;,
        &apos;Projectile vomiting with headache (increased ICP)&apos;,
        &apos;Bilious vomiting (bowel obstruction)&apos;,
        &apos;Chest pain with nausea/vomiting (MI)&apos;,
        &apos;Pregnancy with severe vomiting and inability to keep fluids down&apos;,
        &apos;Diabetic with vomiting and hyperglycemia (DKA risk)&apos;
      ],
      diagnosticApproach: {
        &apos;Initial Assessment&apos;: [
          &apos;Vital signs and hydration status&apos;,
          &apos;Complete abdominal examination&apos;,
          &apos;Neurologic examination if indicated&apos;,
          &apos;Pregnancy test (women of childbearing age)&apos;,
          &apos;Basic metabolic panel and glucose&apos;,
          &apos;Complete blood count&apos;
        ],
        &apos;Targeted Testing&apos;: [
          &apos;Liver function tests (if RUQ pain or jaundice)&apos;,
          &apos;Lipase (if severe epigastric pain)&apos;,
          &apos;Urinalysis (if flank pain or dysuria)&apos;,
          &apos;Abdominal imaging (if obstruction suspected)&apos;,
          &apos;Head CT (if altered mental status or severe headache)&apos;
        ]
      },
      treatmentApproach: {
        &apos;Symptomatic Management&apos;: [
          &apos;IV fluids for dehydration&apos;,
          &apos;Antiemetics: ondansetron, promethazine, metoclopramide&apos;,
          &apos;Electrolyte replacement as needed&apos;,
          &apos;Nothing by mouth initially if severe&apos;,
          &apos;Gradual reintroduction of clear liquids&apos;
        ],
        &apos;Specific Treatments&apos;: [
          &apos;Antibiotics for bacterial gastroenteritis&apos;,
          &apos;Proton pump inhibitors for PUD/GERD&apos;,
          &apos;Insulin for DKA&apos;,
          &apos;Surgery for bowel obstruction&apos;,
          &apos;Discontinue offending medications&apos;
        ]
      },
      urgency: &apos;varies&apos;
    },
    &apos;palpitations&apos;: {
      pivotalPoints: [
        &apos;Patient description of rhythm helps distinguish arrhythmia types&apos;,
        &apos;Associated symptoms identify hemodynamically significant arrhythmias&apos;,
        &apos;Structural heart disease significantly increases risk of malignant arrhythmias&apos;,
        &apos;Triggers and timing patterns help distinguish cardiac from non-cardiac causes&apos;
      ],
      questions: [
        &apos;Can you describe what the palpitations feel like (fast, slow, irregular, skipping)?&apos;,
        &apos;When did they start and how long do they last?&apos;,
        &apos;What triggers them (exercise, stress, caffeine, lying down)?&apos;,
        &apos;Do they start and stop suddenly or gradually?&apos;,
        &apos;Any chest pain, shortness of breath, or dizziness with the palpitations?&apos;,
        &apos;Have you ever fainted or nearly fainted during an episode?&apos;,
        &apos;Any family history of heart problems or sudden cardiac death?&apos;,
        &apos;Do you have any known heart problems?&apos;,
        &apos;What medications are you taking, including over-the-counter and supplements?&apos;,
        &apos;How much caffeine, alcohol, or nicotine do you use?&apos;,
        &apos;Any recent illness, stress, or changes in sleep patterns?&apos;,
        &apos;Any thyroid problems or unexplained weight loss?&apos;,
        &apos;Any anxiety, panic attacks, or psychiatric conditions?&apos;,
        &apos;For women: Any relationship to your menstrual cycle or pregnancy?&apos;,
        &apos;Any recreational drug use (cocaine, amphetamines)?&apos;,
        &apos;Do you exercise regularly? Any symptoms during exercise?&apos;
      ],
      differentials: {
        &apos;Cardiac Arrhythmias (Significant)&apos;: [
          { condition: &apos;Atrial Fibrillation&apos;, likelihood: &apos;high&apos;, features: &apos;Irregularly irregular, elderly, heart disease, stroke risk&apos; },
          { condition: &apos;Supraventricular Tachycardia (SVT)&apos;, likelihood: &apos;moderate&apos;, features: &apos;Sudden onset/offset, regular rapid rate 150-250, young adults&apos; },
          { condition: &apos;Ventricular Tachycardia&apos;, likelihood: &apos;low but critical&apos;, features: &apos;Wide complex, hemodynamic compromise, structural heart disease&apos; },
          { condition: &apos;Atrial Flutter&apos;, likelihood: &apos;moderate&apos;, features: &apos;Regular rapid rate ~150 bpm, sawtooth pattern on ECG&apos; },
          { condition: &apos;Premature Ventricular Contractions&apos;, likelihood: &apos;high&apos;, features: &apos;Skipping sensation, bigeminy/trigeminy, benign if no heart disease&apos; },
          { condition: &apos;Sick Sinus Syndrome&apos;, likelihood: &apos;low&apos;, features: &apos;Elderly, bradycardia-tachycardia syndrome, syncope&apos; }
        ],
        &apos;Non-Cardiac Causes (Common)&apos;: [
          { condition: &apos;Anxiety/Panic Disorder&apos;, likelihood: &apos;very high&apos;, features: &apos;Associated anxiety, stress triggers, hyperventilation, normal heart&apos; },
          { condition: &apos;Hyperthyroidism&apos;, likelihood: &apos;moderate&apos;, features: &apos;Weight loss, heat intolerance, tremor, elevated TSH&apos; },
          { condition: &apos;Caffeine/Stimulant Use&apos;, likelihood: &apos;high&apos;, features: &apos;Temporal relationship to intake, dose-dependent&apos; },
          { condition: &apos;Medication-Induced&apos;, likelihood: &apos;high&apos;, features: &apos;Beta-agonists, decongestants, antidepressants, thyroid meds&apos; },
          { condition: &apos;Alcohol Withdrawal&apos;, likelihood: &apos;moderate&apos;, features: &apos;Heavy alcohol use, tremor, autonomic hyperactivity&apos; },
          { condition: &apos;Anemia&apos;, likelihood: &apos;moderate&apos;, features: &apos;Fatigue, pallor, heavy menstrual bleeding, low hemoglobin&apos; }
        ],
        &apos;Metabolic/Endocrine Causes&apos;: [
          { condition: &apos;Hypoglycemia&apos;, likelihood: &apos;moderate&apos;, features: &apos;Diabetes, insulin use, diaphoresis, confusion&apos; },
          { condition: &apos;Electrolyte Abnormalities&apos;, likelihood: &apos;moderate&apos;, features: &apos;Hypokalemia, hypomagnesemia, medications&apos; },
          { condition: &apos;Pheochromocytoma&apos;, likelihood: &apos;rare&apos;, features: &apos;Hypertension, diaphoresis, headache, episodic symptoms&apos; },
          { condition: &apos;Menopause&apos;, likelihood: &apos;moderate&apos;, features: &apos;Perimenopausal women, hot flashes, hormonal changes&apos; }
        ],
        &apos;Structural Heart Disease&apos;: [
          { condition: &apos;Mitral Valve Prolapse&apos;, likelihood: &apos;moderate&apos;, features: &apos;Young women, mid-systolic click, usually benign&apos; },
          { condition: &apos;Hypertrophic Cardiomyopathy&apos;, likelihood: &apos;low but serious&apos;, features: &apos;Family history, exertional symptoms, murmur&apos; },
          { condition: &apos;Coronary Artery Disease&apos;, likelihood: &apos;moderate&apos;, features: &apos;Exertional symptoms, risk factors, chest pain&apos; },
          { condition: &apos;Valvular Heart Disease&apos;, likelihood: &apos;low&apos;, features: &apos;Murmur, heart failure symptoms, elderly&apos; }
        ]
      },
      clinicalCharacterization: {
        &apos;Rhythm Description&apos;: [
          &apos;Regular and fast: SVT, atrial flutter, sinus tachycardia&apos;,
          &apos;Irregular: Atrial fibrillation, frequent PVCs, multifocal atrial tachycardia&apos;,
          &apos;Skipping/fluttering: PVCs, PACs (premature atrial contractions)&apos;,
          &apos;Pounding: Sinus tachycardia, anxiety, hyperdynamic states&apos;
        ],
        &apos;Onset/Offset Patterns&apos;: [
          &apos;Sudden start/stop: SVT, panic attacks&apos;,
          &apos;Gradual onset: Sinus tachycardia, anxiety&apos;,
          &apos;Persistent: Atrial fibrillation, hyperthyroidism&apos;,
          &apos;Episodic: PACs/PVCs, panic disorder&apos;
        ],
        &apos;Triggers&apos;: [
          &apos;Exercise: Appropriate sinus tachycardia vs arrhythmia&apos;,
          &apos;Stress/emotion: Anxiety, catecholamine-induced&apos;,
          &apos;Caffeine/alcohol: Stimulant-induced, withdrawal&apos;,
          &apos;Position change: Orthostatic tachycardia, POTS&apos;
        ]
      },
      redFlags: [
        &apos;Syncope or near-syncope with palpitations&apos;,
        &apos;Chest pain with palpitations&apos;,
        &apos;Family history of sudden cardiac death&apos;,
        &apos;Known structural heart disease&apos;,
        &apos;Palpitations during exercise&apos;,
        &apos;Hemodynamic instability (hypotension, shock)&apos;,
        &apos;Wide complex tachycardia on ECG&apos;,
        &apos;Palpitations with shortness of breath or heart failure symptoms&apos;,
        &apos;Age >50 with new-onset palpitations&apos;
      ],
      diagnosticApproach: {
        &apos;Initial Evaluation&apos;: [
          &apos;12-lead ECG (during and between episodes if possible)&apos;,
          &apos;Complete history including medication/substance use&apos;,
          &apos;Physical examination including cardiac auscultation&apos;,
          &apos;Vital signs including orthostatic measurements&apos;,
          &apos;Thyroid function tests&apos;,
          &apos;Complete blood count, basic metabolic panel&apos;
        ],
        &apos;Rhythm Monitoring&apos;: [
          &apos;Holter monitor (24-48 hours for frequent symptoms)&apos;,
          &apos;Event monitor (30 days for infrequent symptoms)&apos;,
          &apos;Mobile cardiac telemetry (real-time monitoring)&apos;,
          &apos;Implantable loop recorder (recurrent unexplained episodes)&apos;,
          &apos;ECG during symptoms (if possible)&apos;
        ],
        &apos;Additional Testing&apos;: [
          &apos;Echocardiogram (if structural heart disease suspected)&apos;,
          &apos;Stress testing (if exercise-induced)&apos;,
          &apos;Electrophysiology study (recurrent SVT, VT)&apos;,
          &apos;Tilt table test (if syncope associated)&apos;
        ]
      },
      treatmentApproach: {
        &apos;Acute Management&apos;: [
          &apos;Unstable: Immediate cardioversion for hemodynamic compromise&apos;,
          &apos;SVT: Vagal maneuvers, adenosine, beta-blockers&apos;,
          &apos;Atrial fibrillation: Rate control, anticoagulation consideration&apos;,
          &apos;VT: Amiodarone, lidocaine, cardioversion&apos;,
          &apos;Anxiety: Reassurance, relaxation techniques, anxiolytics&apos;
        ],
        &apos;Chronic Management&apos;: [
          &apos;Lifestyle modifications: Reduce caffeine, alcohol, stress&apos;,
          &apos;Medications: Beta-blockers, calcium channel blockers, antiarrhythmics&apos;,
          &apos;Ablation therapy: For recurrent SVT, atrial fibrillation&apos;,
          &apos;Device therapy: Pacemaker, ICD for specific indications&apos;,
          &apos;Treatment of underlying conditions: Hyperthyroidism, anemia&apos;
        ],
        &apos;Non-Cardiac Causes&apos;: [
          &apos;Anxiety: Counseling, SSRIs, beta-blockers&apos;,
          &apos;Hyperthyroidism: Antithyroid medications, beta-blockers&apos;,
          &apos;Anemia: Iron supplementation, treat underlying cause&apos;,
          &apos;Medications: Dose reduction, alternative agents&apos;
        ]
      },
      riskStratification: {
        &apos;High Risk (Immediate Evaluation)&apos;: [
          &apos;Syncope or hemodynamic compromise&apos;,
          &apos;Structural heart disease&apos;,
          &apos;Family history of sudden cardiac death&apos;,
          &apos;Wide complex tachycardia&apos;,
          &apos;Sustained ventricular arrhythmias&apos;
        ],
        &apos;Intermediate Risk&apos;: [
          &apos;Frequent symptoms affecting quality of life&apos;,
          &apos;Age >50 with new palpitations&apos;,
          &apos;Exertional palpitations&apos;,
          &apos;Associated chest pain or dyspnea&apos;
        ],
        &apos;Low Risk&apos;: [
          &apos;Young, healthy patients&apos;,
          &apos;Clear anxiety/stress relationship&apos;,
          &apos;Normal ECG and examination&apos;,
          &apos;Infrequent, brief episodes&apos;
        ]
      },
      urgency: &apos;varies&apos;,
      clinicalPearls: [
        &apos;Most palpitations are benign, but history guides risk stratification&apos;,
        &apos;ECG during symptoms is most valuable diagnostic test&apos;,
        &apos;Anxiety is the most common cause in young, healthy patients&apos;,
        &apos;Sudden onset/offset suggests SVT; gradual suggests sinus tachycardia&apos;,
        &apos;Irregularly irregular rhythm suggests atrial fibrillation&apos;,
        &apos;Skipping sensations usually represent PVCs or PACs&apos;,
        &apos;Exercise-induced palpitations require cardiac evaluation&apos;,
        &apos;Family history of sudden cardiac death is major red flag&apos;,
        &apos;Caffeine and alcohol are common triggers&apos;,
        &apos;Hyperthyroidism can present solely with palpitations&apos;,
        &apos;Beta-blockers effective for both cardiac and anxiety-related palpitations&apos;,
        &apos;Event monitors more useful than Holter for infrequent symptoms&apos;,
        &apos;Normal ECG between episodes does not rule out arrhythmia&apos;,
        &apos;Vagal maneuvers can terminate SVT and aid in diagnosis&apos;
      ]
    }
  };

  const bodyAreas = [
    { name: &apos;Head & Neck&apos;, icon: Brain, symptoms: [&apos;headache&apos;, &apos;dizziness&apos;, &apos;sore throat&apos;, &apos;neck pain&apos;] },
    { name: &apos;Chest&apos;, icon: Heart, symptoms: [&apos;chest pain&apos;, &apos;shortness of breath&apos;, &apos;cough&apos;, &apos;palpitations&apos;] },
    { name: &apos;Abdomen&apos;, icon: Activity, symptoms: [&apos;abdominal pain&apos;, &apos;nausea&apos;, &apos;vomiting&apos;, &apos;diarrhea&apos;] },
    { name: &apos;Back&apos;, icon: User, symptoms: [&apos;back pain&apos;, &apos;muscle spasms&apos;, &apos;sciatica&apos;] }
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
          &apos;Head & Neck&apos;: &apos;headache&apos;,
          &apos;Chest&apos;: &apos;chest pain&apos;, 
          &apos;Abdomen&apos;: &apos;abdominal pain&apos;,
          &apos;Back&apos;: &apos;back pain&apos;
        };
        selectedSymptom = areaSymptomMap[bodyArea] || &apos;abdominal pain&apos;;
      }

      // If still no symptom selected, default to abdominal pain for demo
      if (!selectedSymptom) {
        selectedSymptom = &apos;abdominal pain&apos;;
      }

      const symptomData = symptomDatabase[selectedSymptom];
      
      // Default assessment if symptom not in database
      let riskLevel = &apos;low&apos;;
      let urgency = &apos;routine&apos;;
      let recommendations = [&apos;Monitor symptoms and seek care if worsening&apos;];
      let differentials = [&apos;Common benign condition&apos;, &apos;Viral syndrome&apos;, &apos;Stress-related symptoms&apos;];

      // If we have symptom data, use it
      if (symptomData) {
        // Clinical reasoning based on red flags and severity
        if (severity === &apos;severe&apos;) {
          riskLevel = &apos;high&apos;;
          urgency = &apos;immediate&apos;;
          recommendations = [&apos;Seek emergency medical attention immediately&apos;];
        } else if (severity === &apos;moderate&apos;) {
          riskLevel = &apos;moderate&apos;;
          urgency = &apos;urgent&apos;;
          recommendations = [&apos;Contact your healthcare provider today&apos;];
        } else {
          recommendations = [&apos;Monitor symptoms and seek care if worsening&apos;];
        }

        // Age-based risk stratification
        if (parseInt(userProfile.age) > 65) {
          riskLevel = riskLevel === &apos;low&apos; ? &apos;moderate&apos; : &apos;high&apos;;
        }

        // Get differentials from symptom data
        if (symptomData.differentials) {
          if (Array.isArray(symptomData.differentials)) {
            differentials = symptomData.differentials;
          } else if (typeof symptomData.differentials === &apos;object&apos;) {
            // Handle complex differential structure
            differentials = Object.values(symptomData.differentials)
              .flat()
              .map(item => typeof item === &apos;string&apos; ? item : item.condition)
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
        setCurrentStep(&apos;results&apos;);
        setShowSuccess(false);
      }, 1000);
    }, 2000); // 2 second processing simulation
  };

  const generateFollowUp = (riskLevel) => {
    switch (riskLevel) {
      case &apos;high&apos;:
        return &apos;Call 911 or go to the nearest emergency room&apos;;
      case &apos;moderate&apos;:
        return &apos;Schedule appointment with primary care physician within 24-48 hours&apos;;
      case &apos;low&apos;:
        return &apos;Monitor symptoms and seek care if they persist or worsen&apos;;
      default:
        return &apos;Follow up as needed&apos;;
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case &apos;high&apos;: return &apos;text-red-600 bg-red-50 border-red-200&apos;;
      case &apos;moderate&apos;: return &apos;text-orange-600 bg-orange-50 border-orange-200&apos;;
      case &apos;low&apos;: return &apos;text-green-600 bg-green-50 border-green-200&apos;;
      default: return &apos;text-gray-600 bg-gray-50 border-gray-200&apos;;
    }
  };

  if (currentStep === &apos;welcome&apos;) {
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
                    onClick={() => handleStepChange(&apos;profile&apos;)}
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

  if (currentStep === &apos;profile&apos;) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 font-sans">
        <div className="max-w-md mx-auto">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            {/* Modern Header with Back Button */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 p-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20"></div>
              <div className="relative z-10">
                <button 
                  onClick={() => setCurrentStep(&apos;welcome&apos;)} 
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
                  {[&apos;Male&apos;, &apos;Female&apos;, &apos;Other&apos;].map((gender, index) => {
                    const gradients = [
                      &apos;from-blue-500 to-indigo-500&apos;,
                      &apos;from-emerald-500 to-blue-500&apos;, 
                      &apos;from-indigo-500 to-purple-500&apos;
                    ];
                    const hoverGradients = [
                      &apos;hover:from-blue-600 hover:to-indigo-600&apos;,
                      &apos;hover:from-emerald-600 hover:to-blue-600&apos;,
                      &apos;hover:from-indigo-600 hover:to-purple-600&apos;
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
                  onClick={() => setCurrentStep(&apos;symptom-select&apos;)}
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

  if (currentStep === &apos;symptom-select&apos;) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 font-sans">
        <div className="max-w-md mx-auto">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            {/* Premium Header with Enhanced Spacing */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 px-8 py-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20"></div>
              <div className="relative z-10">
                <button 
                  onClick={() => setCurrentStep(&apos;profile&apos;)} 
                  className="mb-6 p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-200 group"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                </button>
                <div className="space-y-3">
                  <h1 className="text-2xl font-bold tracking-tight leading-tight">What&apos;s concerning you?</h1>
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
                      { bg: &apos;from-rose-50 to-pink-50&apos;, icon: &apos;from-rose-500 to-pink-500&apos;, border: &apos;border-rose-200&apos;, hover: &apos;hover:border-rose-300&apos; },
                      { bg: &apos;from-red-50 to-orange-50&apos;, icon: &apos;from-red-500 to-orange-500&apos;, border: &apos;border-red-200&apos;, hover: &apos;hover:border-red-300&apos; },
                      { bg: &apos;from-amber-50 to-yellow-50&apos;, icon: &apos;from-amber-500 to-yellow-500&apos;, border: &apos;border-amber-200&apos;, hover: &apos;hover:border-amber-300&apos; },
                      { bg: &apos;from-emerald-50 to-green-50&apos;, icon: &apos;from-emerald-500 to-green-500&apos;, border: &apos;border-emerald-200&apos;, hover: &apos;hover:border-emerald-300&apos; }
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
                              {area.symptoms.slice(0, 3).join(&apos;, &apos;)}...
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
                  onClick={() => setCurrentStep(&apos;severity&apos;)}
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

  if (currentStep === &apos;severity&apos;) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 font-sans">
        <div className="max-w-md mx-auto">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            {/* Premium Header with Perfect Hierarchy */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 px-8 py-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20"></div>
              <div className="relative z-10">
                <button 
                  onClick={() => setCurrentStep(&apos;symptom-select&apos;)} 
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
                    { level: &apos;mild&apos;, label: &apos;Mild&apos;, description: &apos;Barely noticeable, doesn\&apos;t interfere with daily activities&apos;, color: &apos;emerald&apos;, emoji: &apos;😌&apos; },
                    { level: &apos;moderate&apos;, label: &apos;Moderate&apos;, description: &apos;Noticeable and somewhat bothersome but manageable&apos;, color: &apos;amber&apos;, emoji: &apos;😐&apos; },
                    { level: &apos;severe&apos;, label: &apos;Severe&apos;, description: &apos;Significantly impacting daily life and activities&apos;, color: &apos;red&apos;, emoji: &apos;😣&apos; }
                  ].map((option) => (
                    <button
                      key={option.level}
                      onClick={() => setSeverity(option.level)}
                      className={`w-full p-6 rounded-2xl border-2 text-left transition-all duration-300 group transform hover:scale-[1.01] active:scale-[0.99] ${
                        severity === option.level
                          ? `bg-gradient-to-r from-${option.color}-50 to-${option.color}-100 border-${option.color}-300 shadow-lg`
                          : &apos;bg-white/80 backdrop-blur-sm border-slate-200 hover:border-slate-300 hover:shadow-md&apos;
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 ${severity === option.level ? `bg-gradient-to-br from-${option.color}-400 to-${option.color}-500` : &apos;bg-slate-100&apos;} rounded-2xl flex items-center justify-center text-xl shadow-sm group-hover:shadow-md transition-shadow`}>
                          {option.emoji}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className={`text-lg font-bold tracking-tight ${severity === option.level ? `text-${option.color}-800` : &apos;text-slate-800&apos;}`}>
                            {option.label}
                          </div>
                          <div className={`text-sm font-medium leading-relaxed ${severity === option.level ? `text-${option.color}-700` : &apos;text-slate-600&apos;}`}>
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
                    { period: &apos;< 1 day&apos;, gradient: &apos;from-blue-500 to-cyan-500&apos;, bg: &apos;from-blue-50 to-cyan-50&apos; },
                    { period: &apos;1-3 days&apos;, gradient: &apos;from-indigo-500 to-blue-500&apos;, bg: &apos;from-indigo-50 to-blue-50&apos; },
                    { period: &apos;4-7 days&apos;, gradient: &apos;from-purple-500 to-indigo-500&apos;, bg: &apos;from-purple-50 to-indigo-50&apos; },
                    { period: &apos;> 1 week&apos;, gradient: &apos;from-pink-500 to-purple-500&apos;, bg: &apos;from-pink-50 to-purple-50&apos; }
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
                      ? &apos;bg-slate-300 text-slate-500 cursor-not-allowed opacity-60&apos; 
                      : &apos;bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 text-white hover:from-slate-900 hover:via-blue-900 hover:to-indigo-900 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]&apos;
                  }`}
                >
                  <span>Get Assessment</span>
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${(!severity || !duration) ? &apos;bg-slate-400&apos; : &apos;bg-white/20&apos;}`}>
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

  if (currentStep === &apos;results&apos; && assessment) {
    const riskColorSchemes = {
      &apos;high&apos;: {
        bg: &apos;from-red-50 to-rose-50&apos;,
        border: &apos;border-red-200&apos;,
        accent: &apos;from-red-500 to-rose-500&apos;,
        text: &apos;text-red-800&apos;,
        icon: &apos;text-red-600&apos;
      },
      &apos;moderate&apos;: {
        bg: &apos;from-amber-50 to-orange-50&apos;, 
        border: &apos;border-amber-200&apos;,
        accent: &apos;from-amber-500 to-orange-500&apos;,
        text: &apos;text-amber-800&apos;,
        icon: &apos;text-amber-600&apos;
      },
      &apos;low&apos;: {
        bg: &apos;from-emerald-50 to-green-50&apos;,
        border: &apos;border-emerald-200&apos;, 
        accent: &apos;from-emerald-500 to-green-500&apos;,
        text: &apos;text-emerald-800&apos;,
        icon: &apos;text-emerald-600&apos;
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
                setCurrentStep(&apos;welcome&apos;);
                setSymptoms([]);
                setPrimarySymptom(&apos;&apos;);
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
