import React, { useRef, useState } from 'react'
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react'

function FileUpload({ onFileUpload }) {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const validateFile = (file) => {
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return 'File size must be less than 10MB'
    }
    
    // Check file extension
    const validExtensions = ['.fasta', '.fa', '.fas', '.txt']
    const fileName = file.name.toLowerCase()
    const isValidExtension = validExtensions.some(ext => fileName.endsWith(ext))
    
    if (!isValidExtension) {
      return 'Please upload a FASTA file (.fasta, .fa, .fas, or .txt)'
    }
    
    return null
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    setError('')

    const files = e.dataTransfer.files
    if (files && files[0]) {
      const error = validateFile(files[0])
      if (error) {
        setError(error)
        return
      }
      onFileUpload(files[0])
    }
  }

  const handleFileInput = (e) => {
    setError('')
    const files = e.target.files
    if (files && files[0]) {
      const error = validateFile(files[0])
      if (error) {
        setError(error)
        return
      }
      onFileUpload(files[0])
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className={`card border-2 border-dashed transition-all duration-200 cursor-pointer ${
          dragActive 
            ? 'border-primary bg-primary/5 scale-105' 
            : error 
            ? 'border-error bg-error/5'
            : 'border-gray-300 hover:border-primary hover:bg-primary/5'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <div className="text-center py-8">
          <div className="mb-4">
            {error ? (
              <AlertCircle className="w-16 h-16 text-error mx-auto" />
            ) : dragActive ? (
              <CheckCircle className="w-16 h-16 text-primary mx-auto animate-pulse" />
            ) : (
              <Upload className="w-16 h-16 text-gray-400 mx-auto" />
            )}
          </div>
          
          <h3 className="text-xl font-semibold mb-2">
            {dragActive ? 'Drop your FASTA file here!' : 'Upload your DNA sequence'}
          </h3>
          
          <p className="text-gray-600 mb-4">
            Drag and drop your FASTA file here, or click to browse
          </p>
          
          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center justify-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Supported formats: .fasta, .fa, .fas, .txt</span>
            </div>
            <div>Maximum file size: 10MB</div>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-error/10 border border-error/20 rounded-lg">
              <p className="text-error font-medium">{error}</p>
            </div>
          )}
        </div>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".fasta,.fa,.fas,.txt"
        onChange={handleFileInput}
      />
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">💡 What is a FASTA file?</h4>
        <p className="text-blue-800 text-sm">
          A FASTA file contains your DNA sequence in a simple text format. It typically starts with a ">" 
          followed by a description, then your genetic sequence (A, T, G, C letters). You can get these 
          from services like 23andMe, AncestryDNA, or genome sequencing companies.
        </p>
      </div>
    </div>
  )
}

export default FileUpload