// symptomModules/chestPain.js

const chestPainModule = {
  questions: [
    {
      id: "onset",
      text: "When did the chest pain start?",
      type: "choice",
      options: ["Minutes ago", "Hours ago", "Days ago", "Weeks ago"],
    },
    {
      id: "character",
      text: "How would you describe the pain?",
      type: "choice",
      options: ["Sharp", "Pressure-like", "Burning", "Tightness", "Stabbing"],
    },
    {
      id: "withExertion",
      text: "Does the pain worsen with physical activity?",
      type: "yesno",
    },
    {
      id: "relievedByRest",
      text: "Is it relieved by rest?",
      type: "yesno",
    },
    {
      id: "radiation",
      text: "Does the pain radiate anywhere (arm, jaw, back)?",
      type: "yesno",
    },
    {
      id: "associatedSymptoms",
      text: "Any of these symptoms? (Shortness of breath, nausea, sweating)",
      type: "multi",
      options: ["Shortness of breath", "Nausea", "Sweating"],
    },
  ],

  conditions: [
    {
      condition: "Angina",
      match: 92,
      risk: "High",
      whyThis: "Pain with exertion relieved by rest, radiating and pressure-like is classic for angina.",
      nextSteps: "Seek urgent evaluation by a provider. Consider EKG, troponin, and cardiac consult.",
      matchCriteria: {
        withExertion: true,
        relievedByRest: true,
        character: "Pressure-like",
        radiation: true,
        associatedSymptoms: ["Sweating", "Shortness of breath"],
      },
    },
    {
      condition: "GERD (acid reflux)",
      match: 65,
      risk: "Low",
      whyThis: "Burning pain not related to activity and no radiation points to GERD.",
      nextSteps: "Avoid spicy foods, eat earlier, and try an antacid. Follow up if persistent.",
      matchCriteria: {
        character: "Burning",
        withExertion: false,
        radiation: false,
      },
    },
    {
      condition: "Musculoskeletal pain",
      match: 50,
      risk: "Low",
      whyThis: "Localized sharp/stabbing pain often due to strain or inflammation.",
      nextSteps: "Try NSAIDs and gentle stretching. See provider if not improving.",
      matchCriteria: {
        character: "Sharp",
        radiation: false,
        withExertion: false,
      },
    },
    {
      condition: "Heart attack (Myocardial Infarction)",
      match: 95,
      risk: "Critical",
      whyThis: "Worsening pain with exertion, radiation, and associated sweating/nausea is very concerning.",
      nextSteps: "Call 911 or go to the ER immediately.",
      matchCriteria: {
        withExertion: true,
        character: "Tightness",
        radiation: true,
        associatedSymptoms: ["Sweating", "Nausea", "Shortness of breath"],
      },
    },
  ],
};

export default chestPainModule;
