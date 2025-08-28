export default {
  pivotalPoints: [
    'Immediate assessment for life-threatening causes (ACS, PE, aortic dissection, pneumothorax)',
    'Character, location, radiation pattern, and triggers guide differential diagnosis',
    'Cardiac risk factors significantly influence probability of ACS',
    'Associated symptoms (dyspnea, diaphoresis, nausea) increase likelihood of serious pathology'
  ],
  questions: [
  {
    id: 'onset',
    text: 'When did the chest pain start?',
    options: ['Suddenly', 'Gradually', 'Not sure']
  },
  {
    id: 'location',
    text: 'Where is the pain located?',
    options: ['Left chest', 'Right chest', 'Center of chest', 'Radiates to jaw/arm/back', 'Not sure']
  },
  {
    id: 'character',
    text: 'What does the pain feel like?',
    options: ['Crushing', 'Burning', 'Sharp', 'Tearing', 'Pressure', 'Other']
  },
  {
    id: 'severity',
    text: 'How severe is the pain (1–10)?',
    options: ['1–3 (Mild)', '4–6 (Moderate)', '7–8 (Severe)', '9–10 (Worst possible)', 'Not sure']
  },
  {
    id: 'onsetContext',
    text: 'What were you doing when the pain started?',
    options: ['Exerting', 'At rest', 'Emotional stress', 'Sleeping', 'Not sure']
  },
  {
    id: 'modifyingFactors',
    text: 'What makes the pain better or worse?',
    options: ['Rest helps', 'Nitroglycerin helps', 'Position changes it', 'Deep breathing worsens it', 'Nothing helps']
  },
  {
    id: 'dyspnea',
    text: 'Are you short of breath?',
    options: ['Yes', 'No']
  },
  {
    id: 'associatedSymptoms',
    text: 'Do you feel nauseous, dizzy, or are you sweating?',
    options: ['Nauseous', 'Dizzy', 'Sweating', 'None of these']
  },
  {
    id: 'palpitations',
    text: 'Do you feel like your heart is racing or pounding?',
    options: ['Yes', 'No']
  },
  {
    id: 'radiation',
    text: 'Any pain in your jaw, neck, arms, or back?',
    options: ['Jaw', 'Neck', 'Arm', 'Back', 'No']
  }
],
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
  }
};
