import chestPain from './chestPain';

// This object maps symptom keys (with underscores) to their respective data modules
const symptomModules = {
  chest_pain: chestPain
  // Add other symptoms here as you create them
  // Example:
  // headache: headacheData
};

export default symptomModules;
