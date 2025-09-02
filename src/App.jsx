import React, { useState } from 'react'
import Header from './components/Header'
import FileUpload from './components/FileUpload'
import SequenceParser from './components/SequenceParser'
import TraitAnalyzer from './components/TraitAnalyzer'
import ResultsDisplay from './components/ResultsDisplay'
import Hero from './components/Hero'

function App() {
  const [file, setFile] = useState(null)
  const [sequence, setSequence] = useState('')
  const [traits, setTraits] = useState([])
  const [step, setStep] = useState('upload') // upload, parsing, analyzing, results

  const handleFileUpload = (uploadedFile) => {
    setFile(uploadedFile)
    setStep('parsing')
  }

  const handleSequenceParsed = (parsedSequence) => {
    setSequence(parsedSequence)
    setStep('analyzing')
  }

  const handleTraitsAnalyzed = (analyzedTraits) => {
    setTraits(analyzedTraits)
    setStep('results')
  }

  const resetApp = () => {
    setFile(null)
    setSequence('')
    setTraits([])
    setStep('upload')
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-6 py-8 max-w-4xl">
        {step === 'upload' && (
          <div className="animate-fade-in">
            <Hero />
            <FileUpload onFileUpload={handleFileUpload} />
          </div>
        )}
        
        {step === 'parsing' && file && (
          <div className="animate-slide-up">
            <SequenceParser 
              file={file} 
              onSequenceParsed={handleSequenceParsed}
              onBack={() => setStep('upload')}
            />
          </div>
        )}
        
        {step === 'analyzing' && sequence && (
          <div className="animate-slide-up">
            <TraitAnalyzer 
              sequence={sequence}
              onTraitsAnalyzed={handleTraitsAnalyzed}
              onBack={() => setStep('parsing')}
            />
          </div>
        )}
        
        {step === 'results' && traits.length > 0 && (
          <div className="animate-slide-up">
            <ResultsDisplay 
              traits={traits}
              onReset={resetApp}
              onBack={() => setStep('analyzing')}
            />
          </div>
        )}
      </main>
    </div>
  )
}

export default App