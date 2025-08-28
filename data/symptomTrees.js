export const questionsForSymptom = (symptom) => {
  if (symptom === 'chest pain') {
    return [
      {
        id: 'onset',
        text: 'When did the chest pain start?',
        options: [
          { label: 'Suddenly', value: 'sudden' },
          { label: 'Gradually', value: 'gradual' },
        ],
      },
      {
        id: 'character',
        text: 'What does the pain feel like?',
        options: [
          { label: 'Sharp', value: 'sharp' },
          { label: 'Pressure-like', value: 'pressure' },
          { label: 'Burning', value: 'burning' },
        ],
      },
      {
        id: 'radiation',
        text: 'Does the pain spread to other areas?',
        options: [
          { label: 'Yes, to arm or jaw', value: 'radiating' },
          { label: 'No', value: 'localized' },
        ],
      },
    ];
  }

  // Default fallback
  return [
    {
      id: 'default',
      text: 'Describe how this symptom started.',
      options: [
        { label: 'Suddenly', value: 'sudden' },
        { label: 'Gradually', value: 'gradual' },
      ],
    },
  ];
};
