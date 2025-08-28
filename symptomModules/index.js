import chestPain from './chestPain';

// This object maps internal symptom keys to their logic modules.
// Add future symptom modules like: import cough from './cough' and include in the object.
const symptomModules = {
  'chest_pain': chestPain
};

export default symptomModules;

