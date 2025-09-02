import React, { useEffect, useState } from 'react'
import { ArrowLeft, FileText, AlertTriangle, CheckCircle, Loader } from 'lucide-react'

function SequenceParser({ file, onSequenceParsed, onBack }) {
  const [parsing, setParsing] = useState(true)
  const [sequence, setSequence] = useState('')
  const [stats, setStats] = useState(null)
  const [errors, setErrors] = useState([])
  const [warnings, setWarnings] = useState([])

  useEffect(() => {
    parseFile()
  }, [file])

  const parseFile = async () => {
    setParsing(true)
    setErrors([])
    setWarnings([])

    try {
      const text = await file.text()
      const { cleanSequence, stats, errors, warnings } = parseFASTA(text)
      
      setSequence(cleanSequence)
      setStats(stats)
      setErrors(errors)
      setWarnings(warnings)
      
      // Auto-proceed if no critical errors
      if (errors.length === 0 && cleanSequence.length > 0) {
        setTimeout(() => {
          onSequenceParsed(cleanSequence)
        }, 2000)
      }
    } catch (error) {
      setErrors(['Failed to read file: ' + error.message])
    } finally {
      setParsing(false)
    }
  }

  const parseFASTA = (text) => {
    const lines = text.split('\n').map(line => line.trim())
    const errors = []
    const warnings = []
    let sequence = ''
    let headerFound = false

    // Check for FASTA header
    if (!lines.some(line => line.startsWith('>'))) {
      warnings.push('No FASTA header found. Assuming the entire file is sequence data.')
    } else {
      headerFound = true
    }

    // Extract sequence data
    for (let line of lines) {
      if (line.startsWith('>')) {
        continue // Skip header lines
      }
      if (line.length > 0) {
        sequence += line.toUpperCase()
      }
    }

    // Validate sequence characters
    const validChars = /^[ATGCNRYSWKMBDHV-]*$/
    if (!validChars.test(sequence)) {
      const invalidChars = sequence.match(/[^ATGCNRYSWKMBDHV-]/g)
      warnings.push(`Found non-standard DNA characters: ${[...new Set(invalidChars)].join(', ')}. These will be removed.`)
      sequence = sequence.replace(/[^ATGCNRYSWKMBDHV-]/g, '')
    }

    // Check sequence length
    if (sequence.length === 0) {
      errors.push('No valid DNA sequence found in the file.')
    } else if (sequence.length < 100) {
      warnings.push('Sequence is very short. Results may be limited.')
    }

    // Calculate statistics
    const stats = {
      length: sequence.length,
      aCount: (sequence.match(/A/g) || []).length,
      tCount: (sequence.match(/T/g) || []).length,
      gCount: (sequence.match(/G/g) || []).length,
      cCount: (sequence.match(/C/g) || []).length,
      nCount: (sequence.match(/N/g) || []).length,
    }

    stats.gcContent = ((stats.gCount + stats.cCount) / (stats.length - stats.nCount) * 100).toFixed(1)

    return { cleanSequence: sequence, stats, errors, warnings }
  }

  const handleProceed = () => {
    if (sequence && errors.length === 0) {
      onSequenceParsed(sequence)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 text-white hover:text-white/80 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to upload</span>
        </button>
      </div>

      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <FileText className="w-8 h-8 text-primary" />
          <div>
            <h2 className="text-2xl font-semibold">Parsing Your DNA Sequence</h2>
            <p className="text-gray-600">Analyzing: {file.name}</p>
          </div>
        </div>

        {parsing ? (
          <div className="text-center py-8">
            <Loader className="w-12 h-12 text-primary mx-auto animate-spin mb-4" />
            <p className="text-lg">Reading and validating your sequence...</p>
            <p className="text-sm text-gray-600 mt-2">This usually takes just a moment</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Status Summary */}
            <div className="flex items-center space-x-4">
              {errors.length === 0 ? (
                <div className="flex items-center space-x-2 text-success">
                  <CheckCircle className="w-6 h-6" />
                  <span className="font-semibold">Sequence parsed successfully!</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-error">
                  <AlertTriangle className="w-6 h-6" />
                  <span className="font-semibold">Parsing errors found</span>
                </div>
              )}
            </div>

            {/* Statistics */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary">{stats.length.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Base pairs</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.gcContent}%</div>
                  <div className="text-sm text-gray-600">GC content</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.aCount.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">A's</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-600">{stats.tCount.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">T's</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">{(stats.gCount + stats.cCount).toLocaleString()}</div>
                  <div className="text-sm text-gray-600">G+C's</div>
                </div>
              </div>
            )}

            {/* Errors */}
            {errors.length > 0 && (
              <div className="bg-error/10 border border-error/20 rounded-lg p-4">
                <h4 className="font-semibold text-error mb-2">Errors:</h4>
                <ul className="space-y-1">
                  {errors.map((error, index) => (
                    <li key={index} className="text-error text-sm">• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Warnings */}
            {warnings.length > 0 && (
              <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                <h4 className="font-semibold text-orange-700 mb-2">Warnings:</h4>
                <ul className="space-y-1">
                  {warnings.map((warning, index) => (
                    <li key={index} className="text-orange-700 text-sm">• {warning}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sequence Preview */}
            {sequence && (
              <div>
                <h4 className="font-semibold mb-2">Sequence Preview:</h4>
                <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  {sequence.slice(0, 200)}
                  {sequence.length > 200 && <span className="text-gray-500">... ({(sequence.length - 200).toLocaleString()} more characters)</span>}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between">
              <button
                onClick={onBack}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Upload Different File
              </button>
              
              {errors.length === 0 && sequence && (
                <button
                  onClick={handleProceed}
                  className="btn-primary"
                >
                  Analyze Traits →
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SequenceParser