import React from 'react'
import { Sparkles, Dna, Zap } from 'lucide-react'

function Hero() {
  return (
    <div className="text-center mb-12 py-8">
      <div className="relative inline-block">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
          TraitSniffer
        </h1>
        <Sparkles className="absolute -top-2 -right-4 w-8 h-8 text-accent animate-pulse" />
      </div>
      
      <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
        Upload your DNA sequence and discover what fun traits might be hiding in your genes! 
        From baldness predictions to belly fat tendencies - let's explore your genetic blueprint.
      </p>
      
      <div className="flex justify-center items-center space-x-8 mb-8">
        <div className="flex items-center space-x-2 text-white/80">
          <Dna className="w-6 h-6" />
          <span>FASTA Analysis</span>
        </div>
        <div className="flex items-center space-x-2 text-white/80">
          <Zap className="w-6 h-6" />
          <span>Instant Results</span>
        </div>
        <div className="flex items-center space-x-2 text-white/80">
          <Sparkles className="w-6 h-6" />
          <span>Fun Predictions</span>
        </div>
      </div>
      
      <div className="glass-effect rounded-lg p-6 max-w-md mx-auto">
        <p className="text-white/90 text-sm">
          <strong>✨ Science meets fortune-telling!</strong><br/>
          Upload your FASTA file below to begin your genetic adventure.
        </p>
      </div>
    </div>
  )
}

export default Hero