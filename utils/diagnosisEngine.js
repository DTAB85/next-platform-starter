export default function diagnosisEngine(answers, symptom) {
  const scoring = {
    'chest pain': [
      {
        condition: 'Myocardial Infarction',
        score: 0,
        logic: (a) => (a.onset === 'sudden' && a.radiation === 'radiating' ? 80 : 30),
      },
      {
        condition: 'GERD',
        score: 0,
        logic: (a) => (a.character === 'burning' ? 70 : 20),
      },
      {
        condition: 'Musculoskeletal pain',
        score: 0,
        logic: (a) => (a.character === 'sharp' && a.radiation === 'localized' ? 60 : 25),
      },
    ],
  };

  const candidates = scoring[symptom] || [];
  return candidates
    .map((c) => ({
      condition: c.condition,
      score: c.logic(answers),
    }))
    .sort((a, b) => b.score - a.score);
}
