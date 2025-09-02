/**
 * File processing utilities for handling large FASTA files
 */

import { validateFastaContent } from './validation';

/**
 * Process a FASTA file in chunks to avoid UI blocking
 * @param {File} file - The FASTA file to process
 * @param {Function} onProgress - Progress callback (0-100)
 * @param {Function} onChunkProcessed - Callback for each processed chunk
 * @returns {Promise<Object>} - Processing result
 */
export const processLargeFile = async (file, onProgress, onChunkProcessed) => {
  return new Promise((resolve, reject) => {
    const chunkSize = 1024 * 1024; // 1MB chunks
    const fileSize = file.size;
    const totalChunks = Math.ceil(fileSize / chunkSize);
    let processedChunks = 0;
    let processedSize = 0;
    let sequence = '';
    let errors = [];
    let warnings = [];
    
    const reader = new FileReader();
    
    // Process file in chunks
    const readNextChunk = (start) => {
      const end = Math.min(start + chunkSize, fileSize);
      const slice = file.slice(start, end);
      reader.readAsText(slice);
    };
    
    reader.onload = (e) => {
      try {
        const chunkText = e.target.result;
        processedChunks++;
        processedSize += chunkText.length;
        
        // Process this chunk
        const chunkResult = processChunk(chunkText, processedChunks === 1);
        sequence += chunkResult.sequence;
        
        if (chunkResult.warnings.length > 0) {
          warnings = [...warnings, ...chunkResult.warnings];
        }
        
        // Calculate progress
        const progress = Math.round((processedSize / fileSize) * 100);
        onProgress(progress);
        
        // Call chunk processed callback
        if (onChunkProcessed) {
          onChunkProcessed({
            chunkNumber: processedChunks,
            totalChunks,
            chunkSize: chunkText.length,
            processedSize,
            totalSize: fileSize,
            progress
          });
        }
        
        // Read next chunk or finish
        const nextStart = processedSize;
        if (nextStart < fileSize) {
          readNextChunk(nextStart);
        } else {
          // Final validation of the complete sequence
          const validationResult = validateFastaContent(sequence);
          
          resolve({
            success: validationResult.isValid,
            sequence: validationResult.cleanedSequence,
            errors: [...errors, ...(validationResult.isValid ? [] : [validationResult.message])],
            warnings: [...warnings, ...validationResult.warnings],
            stats: calculateSequenceStats(validationResult.cleanedSequence)
          });
        }
      } catch (error) {
        errors.push(`Error processing chunk ${processedChunks}: ${error.message}`);
        reject({
          success: false,
          errors,
          warnings
        });
      }
    };
    
    reader.onerror = () => {
      errors.push('Error reading file');
      reject({
        success: false,
        errors,
        warnings
      });
    };
    
    // Start reading the first chunk
    readNextChunk(0);
  });
};

/**
 * Process a single chunk of FASTA data
 * @param {string} chunkText - Text content of the chunk
 * @param {boolean} isFirstChunk - Whether this is the first chunk
 * @returns {Object} - Processing result for this chunk
 */
const processChunk = (chunkText, isFirstChunk) => {
  const result = {
    sequence: '',
    warnings: []
  };
  
  // For the first chunk, check if it has a FASTA header
  if (isFirstChunk && !chunkText.trim().startsWith('>')) {
    result.warnings.push('No FASTA header found. Assuming the entire file is sequence data.');
  }
  
  // Extract sequence data (skip header lines)
  const lines = chunkText.split('\n');
  for (let line of lines) {
    line = line.trim();
    if (line.startsWith('>')) {
      continue; // Skip header lines
    }
    if (line.length > 0) {
      result.sequence += line.toUpperCase();
    }
  }
  
  return result;
};

/**
 * Calculate statistics for a DNA sequence
 * @param {string} sequence - The DNA sequence
 * @returns {Object} - Sequence statistics
 */
export const calculateSequenceStats = (sequence) => {
  if (!sequence) return null;
  
  const stats = {
    length: sequence.length,
    aCount: (sequence.match(/A/g) || []).length,
    tCount: (sequence.match(/T/g) || []).length,
    gCount: (sequence.match(/G/g) || []).length,
    cCount: (sequence.match(/C/g) || []).length,
    nCount: (sequence.match(/N/g) || []).length,
  };
  
  // Calculate GC content (excluding N's)
  const basesExcludingN = stats.length - stats.nCount;
  stats.gcContent = basesExcludingN > 0 
    ? ((stats.gCount + stats.cCount) / basesExcludingN * 100).toFixed(1)
    : 0;
  
  return stats;
};

/**
 * Read a FASTA file and return its content
 * @param {File} file - The FASTA file to read
 * @returns {Promise<string>} - File content
 */
export const readFastaFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      resolve(e.target.result);
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file);
  });
};

export default {
  processLargeFile,
  calculateSequenceStats,
  readFastaFile
};
