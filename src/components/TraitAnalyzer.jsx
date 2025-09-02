import React, { useEffect, useState } from 'react'
import { ArrowLeft, Search, Dna, Zap, Brain } from 'lucide-react'

function TraitAnalyzer({ sequence, onTraitsAnalyzed, onBack }) {
  const [analyzing, setAnalyzing] = useState(true)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('Initializing...')
  const [foundMarkers, setFoundMarkers] = useState([])

  useEffect(() => {
    analyzeTraits()
  }, [sequence])

  const analyzeTraits = async () => {
    setAnalyzing(true)
    setProgress(0)
    setFoundMarkers([])

    const steps = [
      { message: 'Scanning for genetic markers...', duration: 1000 },
      { message: 'Analyzing SNP patterns...', duration: 1500 },
      { message: 'Cross-referencing trait databases...', duration: 1200 },
      { message: 'Calculating predictions...', duration: 800 },
      { message: 'Finalizing results...', duration: 500 }
    ]

    let totalProgress = 0
    
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(steps[i].message)
      
      // Simulate actual analysis
      if (i === 0) {
        const markers = findGeneticMarkers(sequence)
        setFoundMarkers(markers)
      }
      
      await new Promise(resolve => setTimeout(resolve, steps[i].duration))
      totalProgress += 100 / steps.length
      setProgress(Math.round(totalProgress))
    }

    // Generate trait predictions
    const traits = generateTraitPredictions(foundMarkers, sequence)
    setAnalyzing(false)
    
    // Auto-proceed to results
    setTimeout(() => {
      onTraitsAnalyzed(traits)
    }, 1000)
  }

  const findGeneticMarkers = (sequence) => {
    // Define some mock genetic markers for different traits
    const markers = [
      { name: 'rs9939609', pattern: 'ATGCATGC', trait: 'metabolism', position: null },
      { name: 'rs1815739', pattern: 'CCGTTAAG', trait: 'muscle_fiber', position: null },
      { name: 'rs333', pattern: 'GGCATACC', trait: 'immune_response', position: null },
      { name: 'rs7903146', pattern: 'TAGCCTAG', trait: 'diabetes_risk', position: null },
      { name: 'rs1805007', pattern: 'AACCGGTT', trait: 'hair_color', position: null },
      { name: 'rs1426654', pattern: 'TTGGCCAA', trait: 'skin_pigmentation', position: null },
      { name: 'rs4988235', pattern: 'CATGACGT', trait: 'lactose_tolerance', position: null },
      { name: 'rs6265', pattern: 'GCATGCTA', trait: 'brain_function', position: null },
    ]

    const foundMarkers = []
    
    markers.forEach(marker => {
      const position = sequence.indexOf(marker.pattern)
      if (position !== -1) {
        foundMarkers.push({
          ...marker,
          position,
          confidence: Math.random() * 0.3 + 0.7 // 70-100% confidence
        })
      } else {
        // Sometimes find partial matches for variety
        if (Math.random() > 0.6) {
          const partialPattern = marker.pattern.slice(0, 6)
          const partialPosition = sequence.indexOf(partialPattern)
          if (partialPosition !== -1) {
            foundMarkers.push({
              ...marker,
              position: partialPosition,
              confidence: Math.random() * 0.4 + 0.3, // 30-70% confidence
              partial: true
            })
          }
        }
      }
    })

    return foundMarkers
  }

  const generateTraitPredictions = (markers, sequence) => {
    const traits = []

    // Baldness prediction
    const baldnessMarkers = markers.filter(m => m.trait === 'hair_color' || m.trait === 'metabolism')
    if (baldnessMarkers.length > 0 || Math.random() > 0.5) {
      traits.push({
        id: 'baldness',
        name: 'Male Pattern Baldness',
        prediction: Math.random() > 0.5 ? 'Likely' : 'Unlikely',
        confidence: Math.round(Math.random() * 30 + 60),
        description: 'Based on genetic markers associated with hair follicle sensitivity to DHT.',
        funFact: 'Did you know? Male pattern baldness affects about 50% of men over age 50!',
        icon: '👨‍🦲',
        category: 'Physical Traits'
      })
    }

    // Belly fat tendency
    const metabolismMarkers = markers.filter(m => m.trait === 'metabolism' || m.trait === 'diabetes_risk')
    if (metabolismMarkers.length > 0 || Math.random() > 0.4) {
      traits.push({
        id: 'belly_fat',
        name: 'Belly Fat Accumulation',
        prediction: Math.random() > 0.6 ? 'Higher tendency' : 'Lower tendency',
        confidence: Math.round(Math.random() * 25 + 65),
        description: 'Genetic predisposition to store fat in the abdominal region.',
        funFact: 'Apple vs pear shape is largely determined by your genes!',
        icon: '🍎',
        category: 'Metabolism'
      })
    }

    // Sinus issues
    const immuneMarkers = markers.filter(m => m.trait === 'immune_response')
    if (immuneMarkers.length > 0 || Math.random() > 0.6) {
      traits.push({
        id: 'sinus',
        name: 'Sinus Sensitivity',
        prediction: Math.random() > 0.5 ? 'Sensitive' : 'Resilient',
        confidence: Math.round(Math.random() * 20 + 70),
        description: 'Genetic factors affecting nasal passage structure and immune response.',
        funFact: 'Some people are genetically more prone to seasonal allergies!',
        icon: '👃',
        category: 'Health'
      })
    }

    // Muscle fiber type
    const muscleMarkers = markers.filter(m => m.trait === 'muscle_fiber')
    if (muscleMarkers.length > 0 || Math.random() > 0.3) {
      traits.push({
        id: 'muscle_type',
        name: 'Muscle Fiber Composition',
        prediction: Math.random() > 0.5 ? 'Fast-twitch dominant' : 'Slow-twitch dominant',
        confidence: Math.round(Math.random() * 35 + 55),
        description: 'Genetic variation affecting muscle fiber type distribution.',
        funFact: 'Elite sprinters tend to have more fast-twitch fibers!',
        icon: '💪',
        category: 'Athletic Performance'
      })
    }

    // Lactose tolerance
    const lactoseMarkers = markers.filter(m => m.trait === 'lactose_tolerance')
    if (lactoseMarkers.length > 0 || Math.random() > 0.4) {
      traits.push({
        id: 'lactose',
        name: 'Lactose Tolerance',
        prediction: Math.random() > 0.4 ? 'Tolerant' : 'Intolerant',
        confidence: Math.round(Math.random() * 20 + 75),
        description: 'Ability to digest lactose in adulthood.',
        funFact: 'Most humans lose the ability to digest lactose after weaning!',
        icon: '🥛',
        category: 'Nutrition'
      })
    }

    // Sleep pattern
    if (Math.random() > 0.5) {
      traits.push({
        id: 'sleep',
        name: 'Chronotype',
        prediction: Math.random() > 0.5 ? 'Night owl' : 'Early bird',
        confidence: Math.round(Math.random() * 30 + 60),
        description: 'Genetic influence on your natural sleep-wake cycle.',
        funFact: 'Your genes help determine if you\'re naturally a morning person!',
        icon: '🦉',
        category: 'Behavior'
      })
    }

    // Caffeine sensitivity
    if (Math.random() > 0.4) {
      traits.push({
        id: 'caffeine',
        name: 'Caffeine Metabolism',
        prediction: Math.random() > 0.5 ? 'Fast metabolizer' : 'Slow metabolizer',
        confidence: Math.round(Math.random() * 25 + 70),
        description: 'How quickly your body processes caffeine.',
        funFact: 'Slow caffeine metabolizers might feel jittery from just one cup!',
        icon: '☕',
        category: 'Metabolism'
      })
    }

    return traits.slice(0, 6) // Return up to 6 traits
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 text-white hover:text-white/80 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to parsing</span>
        </button>
      </div>

      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <Brain className="w-8 h-8 text-primary" />
          <div>
            <h2 className="text-2xl font-semibold">Analyzing Your Genetic Traits</h2>
            <p className="text-gray-600">Scanning {sequence.length.toLocaleString()} base pairs for interesting markers</p>
          </div>
        </div>

        {analyzing ? (
          <div className="space-y-6">
            {/* Progress Bar */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">{currentStep}</span>
                <span className="text-sm text-gray-500">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Analysis Animation */}
            <div className="text-center py-8">
              <div className="relative">
                <Search className="w-16 h-16 text-primary mx-auto animate-pulse" />
                <Dna className="w-8 h-8 text-secondary absolute top-2 right-1/2 transform translate-x-8 animate-spin" />
                <Zap className="w-6 h-6 text-accent absolute bottom-2 left-1/2 transform -translate-x-8 animate-bounce" />
              </div>
              <p className="text-lg mt-4">Uncovering your genetic secrets...</p>
              <p className="text-sm text-gray-600 mt-2">This is where the magic happens! ✨</p>
            </div>

            {/* Found Markers */}
            {foundMarkers.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Genetic Markers Found:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {foundMarkers.slice(0, 6).map((marker, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-sm text-primary">{marker.name}</span>
                        <span className="text-xs text-gray-600">
                          {Math.round(marker.confidence * 100)}% match
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Position: {marker.position?.toLocaleString()}
                        {marker.partial && ' (partial match)'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Analysis Complete!</h3>
            <p className="text-gray-600">Found {foundMarkers.length} genetic markers. Preparing your results...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TraitAnalyzer