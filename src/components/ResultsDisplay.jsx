import React, { useState } from 'react'
import { ArrowLeft, Share2, Download, Sparkles, Info, RotateCcw, Trophy, Heart, Zap } from 'lucide-react'

function ResultsDisplay({ traits, onReset, onBack }) {
  const [selectedTrait, setSelectedTrait] = useState(null)
  const [showShareModal, setShowShareModal] = useState(false)

  const getCategoryIcon = (category) => {
    const icons = {
      'Physical Traits': '👤',
      'Metabolism': '⚡',
      'Health': '❤️',
      'Athletic Performance': '🏃',
      'Nutrition': '🍽️',
      'Behavior': '🧠'
    }
    return icons[category] || '🧬'
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-success bg-success/10'
    if (confidence >= 60) return 'text-warning bg-warning/10'
    return 'text-error bg-error/10'
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My TraitSniffer Results',
        text: `I just discovered some fascinating genetic traits with TraitSniffer! Check out what my DNA revealed.`,
        url: window.location.href
      })
    } else {
      setShowShareModal(true)
    }
  }

  const downloadResults = () => {
    const results = traits.map(trait => 
      `${trait.name}: ${trait.prediction} (${trait.confidence}% confidence)\n${trait.description}\n\n`
    ).join('')

    const blob = new Blob([`TraitSniffer Results\n${'='.repeat(20)}\n\n${results}`], 
      { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'traitsniffer-results.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 text-white hover:text-white/80 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to analysis</span>
        </button>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleShare}
            className="flex items-center space-x-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
          <button
            onClick={downloadResults}
            className="flex items-center space-x-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="relative inline-block">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Your Genetic Profile
          </h1>
          <Sparkles className="absolute -top-2 -right-4 w-8 h-8 text-accent animate-pulse" />
        </div>
        <p className="text-xl text-white/90 mb-6">
          We found {traits.length} fascinating traits hidden in your DNA! 
        </p>
        <div className="flex justify-center items-center space-x-6 text-white/80">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5" />
            <span>{traits.length} Traits</span>
          </div>
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5" />
            <span>Personalized</span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span>Science-Based</span>
          </div>
        </div>
      </div>

      {/* Traits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {traits.map((trait, index) => (
          <div
            key={trait.id}
            className="card hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105"
            onClick={() => setSelectedTrait(trait)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{trait.icon}</div>
                <div>
                  <h3 className="font-semibold text-lg">{trait.name}</h3>
                  <p className="text-sm text-gray-600">{trait.category}</p>
                </div>
              </div>
              <Info className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Prediction:</span>
                <p className="font-semibold text-primary">{trait.prediction}</p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Confidence:</span>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(trait.confidence)}`}>
                  {trait.confidence}%
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                  style={{ width: `${trait.confidence}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="card mb-8">
        <h3 className="text-xl font-semibold mb-4">Your Genetic Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {Math.round(traits.reduce((acc, trait) => acc + trait.confidence, 0) / traits.length)}%
            </div>
            <div className="text-sm text-gray-600">Avg. Confidence</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary">
              {traits.filter(t => t.confidence >= 80).length}
            </div>
            <div className="text-sm text-gray-600">High Confidence</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">
              {new Set(traits.map(t => t.category)).size}
            </div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {getCategoryIcon('Physical Traits')}
            </div>
            <div className="text-sm text-gray-600">Your Profile</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onReset}
          className="flex items-center justify-center space-x-2 btn-primary"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Analyze Another Sequence</span>
        </button>
        <button
          onClick={handleShare}
          className="flex items-center justify-center space-x-2 btn-secondary"
        >
          <Share2 className="w-5 h-5" />
          <span>Share Results</span>
        </button>
      </div>

      {/* Detailed Trait Modal */}
      {selectedTrait && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{selectedTrait.icon}</span>
                <div>
                  <h3 className="text-xl font-semibold">{selectedTrait.name}</h3>
                  <p className="text-gray-600">{selectedTrait.category}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTrait(null)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Prediction:</h4>
                <p className="text-primary font-medium">{selectedTrait.prediction}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Confidence:</h4>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full"
                      style={{ width: `${selectedTrait.confidence}%` }}
                    ></div>
                  </div>
                  <span className="font-medium">{selectedTrait.confidence}%</span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">What this means:</h4>
                <p className="text-gray-700">{selectedTrait.description}</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">💡 Fun Fact</h4>
                <p className="text-blue-800 text-sm">{selectedTrait.funFact}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Share Your Results</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Copy the link below to share your genetic trait analysis with friends!
            </p>
            <div className="bg-gray-50 p-3 rounded-lg">
              <code className="text-sm break-all">{window.location.href}</code>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href)
                setShowShareModal(false)
              }}
              className="w-full mt-4 btn-primary"
            >
              Copy Link
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ResultsDisplay