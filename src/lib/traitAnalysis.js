/**
 * TraitAnalysis.js
 * 
 * This module contains functions for analyzing DNA sequences and predicting traits.
 * It includes genetic marker definitions, pattern matching algorithms, and trait prediction logic.
 */

// Define genetic markers with more realistic patterns and trait associations
export const geneticMarkers = [
  // Hair-related markers
  { 
    id: 'rs1805007',
    name: 'MC1R (Melanocortin 1 Receptor)',
    pattern: 'CTGGCCATCGCGCTGCTCT',
    trait: 'hair_color',
    description: 'Associated with red hair and fair skin',
    significance: 0.85
  },
  { 
    id: 'rs2228479',
    name: 'MC1R Variant',
    pattern: 'GTGCCTGGAGGTGTCCATCT',
    trait: 'hair_color',
    description: 'Associated with blonde hair',
    significance: 0.75
  },
  { 
    id: 'rs4778138',
    name: 'OCA2 Gene',
    pattern: 'GGAGCCATGTGCACCTTCCT',
    trait: 'hair_color',
    description: 'Associated with dark hair',
    significance: 0.8
  },
  { 
    id: 'rs9282858',
    name: 'SRD5A2 Gene',
    pattern: 'CTGGAGTACGCGCAGCCTGT',
    trait: 'baldness',
    description: 'Associated with male pattern baldness',
    significance: 0.7
  },
  
  // Metabolism markers
  { 
    id: 'rs9939609',
    name: 'FTO Gene',
    pattern: 'GTGAAACAGCATCAGAATGG',
    trait: 'metabolism',
    description: 'Associated with body mass index and obesity risk',
    significance: 0.8
  },
  { 
    id: 'rs1801282',
    name: 'PPARG Gene',
    pattern: 'CCAGTCCTCATCTAAGCAGG',
    trait: 'metabolism',
    description: 'Associated with insulin sensitivity and fat metabolism',
    significance: 0.75
  },
  { 
    id: 'rs7903146',
    name: 'TCF7L2 Gene',
    pattern: 'TAGAGAGCTAAGCACTTTTC',
    trait: 'diabetes_risk',
    description: 'Associated with type 2 diabetes risk',
    significance: 0.85
  },
  
  // Muscle and athletic performance
  { 
    id: 'rs1815739',
    name: 'ACTN3 Gene',
    pattern: 'CTGACCCTGAGACAGGAGAA',
    trait: 'muscle_fiber',
    description: 'Associated with fast-twitch muscle fiber and sprint performance',
    significance: 0.8
  },
  { 
    id: 'rs4644994',
    name: 'ADRB2 Gene',
    pattern: 'CCTTCTTGCTGGCACCCAAT',
    trait: 'endurance',
    description: 'Associated with endurance performance',
    significance: 0.7
  },
  
  // Immune system
  { 
    id: 'rs333',
    name: 'CCR5 Gene',
    pattern: 'GTCAGTATCAATTCTGGAAG',
    trait: 'immune_response',
    description: 'Associated with immune system response',
    significance: 0.9
  },
  { 
    id: 'rs2305619',
    name: 'PTX3 Gene',
    pattern: 'GGGGGACTGAGGAACCAAGA',
    trait: 'immune_response',
    description: 'Associated with innate immunity',
    significance: 0.75
  },
  
  // Nutrition and digestion
  { 
    id: 'rs4988235',
    name: 'MCM6/LCT Gene',
    pattern: 'CTGCGCTGGCAATACAGATA',
    trait: 'lactose_tolerance',
    description: 'Associated with lactose tolerance in adulthood',
    significance: 0.9
  },
  { 
    id: 'rs713598',
    name: 'TAS2R38 Gene',
    pattern: 'CCTTCGTTTTCTTGGTGAAT',
    trait: 'taste_perception',
    description: 'Associated with bitter taste perception',
    significance: 0.8
  },
  
  // Brain function and behavior
  { 
    id: 'rs6265',
    name: 'BDNF Gene',
    pattern: 'GCCCAACGAAGAAAACCATA',
    trait: 'brain_function',
    description: 'Associated with memory and cognitive function',
    significance: 0.75
  },
  { 
    id: 'rs73598374',
    name: 'NPSR1 Gene',
    pattern: 'CACTGAACTCAGATGTCAAG',
    trait: 'sleep_pattern',
    description: 'Associated with sleep patterns and circadian rhythm',
    significance: 0.7
  },
  { 
    id: 'rs4680',
    name: 'COMT Gene',
    pattern: 'CCAGCGGATGGTGGATTTCG',
    trait: 'stress_response',
    description: 'Associated with stress response and anxiety',
    significance: 0.8
  }
];

/**
 * Find genetic markers in a DNA sequence
 * @param {string} sequence - The DNA sequence to analyze
 * @returns {Array} - Array of found markers with position and confidence
 */
export const findGeneticMarkers = (sequence) => {
  const foundMarkers = [];
  
  geneticMarkers.forEach(marker => {
    // Look for exact matches
    const position = sequence.indexOf(marker.pattern);
    if (position !== -1) {
      foundMarkers.push({
        ...marker,
        position,
        confidence: marker.significance * (0.9 + Math.random() * 0.1), // Add slight randomness
        match_type: 'exact'
      });
    } else {
      // Look for partial matches (at least 80% of the pattern)
      const minMatchLength = Math.floor(marker.pattern.length * 0.8);
      for (let i = 0; i <= marker.pattern.length - minMatchLength; i++) {
        const partialPattern = marker.pattern.substring(i, i + minMatchLength);
        const partialPosition = sequence.indexOf(partialPattern);
        
        if (partialPosition !== -1) {
          const matchPercentage = minMatchLength / marker.pattern.length;
          foundMarkers.push({
            ...marker,
            position: partialPosition,
            confidence: marker.significance * matchPercentage * (0.7 + Math.random() * 0.2),
            match_type: 'partial',
            match_percentage: (matchPercentage * 100).toFixed(1) + '%'
          });
          break; // Only add one partial match per marker
        }
      }
    }
  });
  
  return foundMarkers;
};

/**
 * Generate trait predictions based on found genetic markers
 * @param {Array} markers - Array of found genetic markers
 * @param {string} sequence - The original DNA sequence
 * @returns {Array} - Array of trait predictions
 */
export const generateTraitPredictions = (markers, sequence) => {
  const traits = [];
  const categories = {};
  
  // Helper function to calculate confidence based on markers
  const calculateConfidence = (relevantMarkers) => {
    if (relevantMarkers.length === 0) return 0;
    
    const avgConfidence = relevantMarkers.reduce((sum, m) => sum + m.confidence, 0) / relevantMarkers.length;
    return Math.round(avgConfidence * 100);
  };
  
  // Helper function to determine prediction based on markers
  const determinePrediction = (relevantMarkers, trait) => {
    const exactMatches = relevantMarkers.filter(m => m.match_type === 'exact');
    const highConfidenceMarkers = relevantMarkers.filter(m => m.confidence > 0.7);
    
    // Different logic based on trait type
    switch(trait) {
      case 'baldness':
        return exactMatches.length > 0 ? 'Likely' : 'Unlikely';
      case 'metabolism':
        return highConfidenceMarkers.length > 1 ? 'Higher tendency' : 'Lower tendency';
      case 'muscle_fiber':
        return Math.random() > 0.5 ? 'Fast-twitch dominant' : 'Slow-twitch dominant';
      default:
        // Generic binary prediction
        return highConfidenceMarkers.length > 0 ? 'Present' : 'Not detected';
    }
  };
  
  // Baldness prediction
  const baldnessMarkers = markers.filter(m => m.trait === 'baldness' || (m.trait === 'hair_color' && m.confidence > 0.7));
  if (baldnessMarkers.length > 0 || Math.random() > 0.7) {
    traits.push({
      id: 'baldness',
      name: 'Male Pattern Baldness',
      prediction: determinePrediction(baldnessMarkers, 'baldness'),
      confidence: calculateConfidence(baldnessMarkers) || Math.round(Math.random() * 30 + 50),
      description: 'Based on genetic markers associated with hair follicle sensitivity to DHT.',
      funFact: 'Did you know? Male pattern baldness affects about 50% of men over age 50!',
      icon: '👨‍🦲',
      category: 'Physical Traits',
      markers: baldnessMarkers.map(m => m.id)
    });
    categories['Physical Traits'] = true;
  }

  // Belly fat tendency
  const metabolismMarkers = markers.filter(m => m.trait === 'metabolism' || m.trait === 'diabetes_risk');
  if (metabolismMarkers.length > 0 || Math.random() > 0.6) {
    traits.push({
      id: 'belly_fat',
      name: 'Belly Fat Accumulation',
      prediction: determinePrediction(metabolismMarkers, 'metabolism'),
      confidence: calculateConfidence(metabolismMarkers) || Math.round(Math.random() * 25 + 60),
      description: 'Genetic predisposition to store fat in the abdominal region.',
      funFact: 'Apple vs pear shape is largely determined by your genes!',
      icon: '🍎',
      category: 'Metabolism',
      markers: metabolismMarkers.map(m => m.id)
    });
    categories['Metabolism'] = true;
  }

  // Sinus issues
  const immuneMarkers = markers.filter(m => m.trait === 'immune_response');
  if (immuneMarkers.length > 0 || Math.random() > 0.6) {
    traits.push({
      id: 'sinus',
      name: 'Sinus Sensitivity',
      prediction: immuneMarkers.length > 0 ? 'Sensitive' : 'Resilient',
      confidence: calculateConfidence(immuneMarkers) || Math.round(Math.random() * 20 + 65),
      description: 'Genetic factors affecting nasal passage structure and immune response.',
      funFact: 'Some people are genetically more prone to seasonal allergies!',
      icon: '👃',
      category: 'Health',
      markers: immuneMarkers.map(m => m.id)
    });
    categories['Health'] = true;
  }

  // Muscle fiber type
  const muscleMarkers = markers.filter(m => m.trait === 'muscle_fiber' || m.trait === 'endurance');
  if (muscleMarkers.length > 0 || Math.random() > 0.5) {
    traits.push({
      id: 'muscle_type',
      name: 'Muscle Fiber Composition',
      prediction: determinePrediction(muscleMarkers, 'muscle_fiber'),
      confidence: calculateConfidence(muscleMarkers) || Math.round(Math.random() * 30 + 60),
      description: 'Genetic variation affecting muscle fiber type distribution.',
      funFact: 'Elite sprinters tend to have more fast-twitch fibers!',
      icon: '💪',
      category: 'Athletic Performance',
      markers: muscleMarkers.map(m => m.id)
    });
    categories['Athletic Performance'] = true;
  }

  // Lactose tolerance
  const lactoseMarkers = markers.filter(m => m.trait === 'lactose_tolerance');
  if (lactoseMarkers.length > 0 || Math.random() > 0.4) {
    traits.push({
      id: 'lactose',
      name: 'Lactose Tolerance',
      prediction: lactoseMarkers.length > 0 ? 'Tolerant' : 'Intolerant',
      confidence: calculateConfidence(lactoseMarkers) || Math.round(Math.random() * 20 + 70),
      description: 'Ability to digest lactose in adulthood.',
      funFact: 'Most humans lose the ability to digest lactose after weaning!',
      icon: '🥛',
      category: 'Nutrition',
      markers: lactoseMarkers.map(m => m.id)
    });
    categories['Nutrition'] = true;
  }

  // Sleep pattern
  const sleepMarkers = markers.filter(m => m.trait === 'sleep_pattern');
  if (sleepMarkers.length > 0 || Math.random() > 0.5) {
    traits.push({
      id: 'sleep',
      name: 'Chronotype',
      prediction: Math.random() > 0.5 ? 'Night owl' : 'Early bird',
      confidence: calculateConfidence(sleepMarkers) || Math.round(Math.random() * 25 + 60),
      description: 'Genetic influence on your natural sleep-wake cycle.',
      funFact: 'Your genes help determine if you\'re naturally a morning person!',
      icon: '🦉',
      category: 'Behavior',
      markers: sleepMarkers.map(m => m.id)
    });
    categories['Behavior'] = true;
  }

  // Caffeine sensitivity
  const stressMarkers = markers.filter(m => m.trait === 'stress_response');
  if (stressMarkers.length > 0 || Math.random() > 0.4) {
    traits.push({
      id: 'caffeine',
      name: 'Caffeine Metabolism',
      prediction: stressMarkers.length > 0 ? 'Slow metabolizer' : 'Fast metabolizer',
      confidence: calculateConfidence(stressMarkers) || Math.round(Math.random() * 25 + 65),
      description: 'How quickly your body processes caffeine.',
      funFact: 'Slow caffeine metabolizers might feel jittery from just one cup!',
      icon: '☕',
      category: 'Metabolism',
      markers: stressMarkers.map(m => m.id)
    });
    categories['Metabolism'] = true;
  }

  // Taste perception
  const tasteMarkers = markers.filter(m => m.trait === 'taste_perception');
  if (tasteMarkers.length > 0 || Math.random() > 0.6) {
    traits.push({
      id: 'bitter_taste',
      name: 'Bitter Taste Perception',
      prediction: tasteMarkers.length > 0 ? 'Strong perceiver' : 'Weak perceiver',
      confidence: calculateConfidence(tasteMarkers) || Math.round(Math.random() * 20 + 70),
      description: 'Ability to detect bitter compounds like PTC.',
      funFact: 'Strong bitter taste perceivers often dislike dark chocolate and coffee!',
      icon: '🍋',
      category: 'Nutrition',
      markers: tasteMarkers.map(m => m.id)
    });
    categories['Nutrition'] = true;
  }

  // Memory and cognition
  const brainMarkers = markers.filter(m => m.trait === 'brain_function');
  if (brainMarkers.length > 0 || Math.random() > 0.7) {
    traits.push({
      id: 'memory',
      name: 'Memory Performance',
      prediction: brainMarkers.length > 0 ? 'Enhanced' : 'Typical',
      confidence: calculateConfidence(brainMarkers) || Math.round(Math.random() * 20 + 60),
      description: 'Genetic factors affecting memory formation and recall.',
      funFact: 'Some genetic variants can enhance memory performance by up to 20%!',
      icon: '🧠',
      category: 'Behavior',
      markers: brainMarkers.map(m => m.id)
    });
    categories['Behavior'] = true;
  }

  // Return a subset of traits, ensuring at least one from each detected category
  const selectedTraits = [];
  const categoryTraits = {};
  
  // Group traits by category
  traits.forEach(trait => {
    if (!categoryTraits[trait.category]) {
      categoryTraits[trait.category] = [];
    }
    categoryTraits[trait.category].push(trait);
  });
  
  // Select at least one trait from each category
  Object.keys(categoryTraits).forEach(category => {
    const categoryTraitsList = categoryTraits[category];
    const randomIndex = Math.floor(Math.random() * categoryTraitsList.length);
    selectedTraits.push(categoryTraitsList[randomIndex]);
    
    // Possibly add a second trait from categories with multiple traits
    if (categoryTraitsList.length > 1 && Math.random() > 0.5) {
      let secondIndex = randomIndex;
      while (secondIndex === randomIndex) {
        secondIndex = Math.floor(Math.random() * categoryTraitsList.length);
      }
      selectedTraits.push(categoryTraitsList[secondIndex]);
    }
  });
  
  // Ensure we have at least 3 traits but no more than 6
  if (selectedTraits.length < 3) {
    // Add more random traits until we have at least 3
    const remainingTraits = traits.filter(t => !selectedTraits.includes(t));
    while (selectedTraits.length < 3 && remainingTraits.length > 0) {
      const randomIndex = Math.floor(Math.random() * remainingTraits.length);
      selectedTraits.push(remainingTraits[randomIndex]);
      remainingTraits.splice(randomIndex, 1);
    }
  } else if (selectedTraits.length > 6) {
    // Trim down to 6 traits
    selectedTraits.splice(6);
  }
  
  return selectedTraits;
};

/**
 * Analyze a DNA sequence and generate trait predictions
 * @param {string} sequence - The DNA sequence to analyze
 * @returns {Object} - Analysis results including markers and traits
 */
export const analyzeSequence = (sequence) => {
  const markers = findGeneticMarkers(sequence);
  const traits = generateTraitPredictions(markers, sequence);
  
  return {
    markers,
    traits,
    analysisDate: new Date().toISOString(),
    sequenceLength: sequence.length
  };
};

export default {
  geneticMarkers,
  findGeneticMarkers,
  generateTraitPredictions,
  analyzeSequence
};
