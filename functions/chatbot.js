
const functions = require('firebase-functions');

// A mock database of symptoms and their associated conditions.
const symptomDatabase = {
  'itchy eyes': ['Allergic Conjunctivitis', 'Dry Eye Syndrome'],
  'blurred vision': ['Dry Eye Syndrome', 'Cataracts', 'Glaucoma'],
  'eye pain': ['Glaucoma', 'Corneal Abrasion'],
  'redness': ['Allergic Conjunctivitis', 'Blepharitis'],
  'gritty sensation': ['Dry Eye Syndrome', 'Blepharitis'],
  'halos around lights': ['Cataracts', 'Glaucoma'],
};

// A mock database of conditions and their prevalence.
const conditionPrevalence = {
  'Allergic Conjunctivitis': 0.7,
  'Dry Eye Syndrome': 0.8,
  'Blepharitis': 0.4,
  'Cataracts': 0.5,
  'Glaucoma': 0.6,
  'Corneal Abrasion': 0.3,
};


exports.chat = functions.https.onCall((data, context) => {
  const message = data.message.toLowerCase();
  const mentionedConditions = {};

  // Analyze the input symptoms and calculate probabilities.
  Object.keys(symptomDatabase).forEach(symptom => {
    if (message.includes(symptom)) {
      symptomDatabase[symptom].forEach(condition => {
        if (!mentionedConditions[condition]) {
          mentionedConditions[condition] = 0;
        }
        mentionedConditions[condition] += (1 - mentionedConditions[condition]) * conditionPrevalence[condition];
      });
    }
  });

  const results = Object.keys(mentionedConditions).map(condition => ({
    condition,
    probability: mentionedConditions[condition],
  })).sort((a, b) => b.probability - a.probability);

  // Return a structured JSON response.
  return {
    results: results.slice(0, 3), // Return the top 3 results.
  };
});
