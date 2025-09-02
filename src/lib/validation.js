/**
 * Validation utilities for TraitSniffer application
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} - Validation result with isValid and message
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  
  // Check for at least one number
  if (!/\d/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  return { isValid: true, message: 'Password is valid' };
};

/**
 * Validate FASTA file
 * @param {File} file - File object to validate
 * @returns {Object} - Validation result with isValid, message, and warnings
 */
export const validateFastaFile = (file) => {
  const result = {
    isValid: true,
    message: 'File is valid',
    warnings: []
  };
  
  // Check if file exists
  if (!file) {
    return { ...result, isValid: false, message: 'No file provided' };
  }
  
  // Check file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    return { ...result, isValid: false, message: 'File size must be less than 10MB' };
  }
  
  // Check file extension
  const validExtensions = ['.fasta', '.fa', '.fas', '.txt'];
  const fileName = file.name.toLowerCase();
  const isValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
  
  if (!isValidExtension) {
    return { 
      ...result, 
      isValid: false, 
      message: 'Please upload a FASTA file (.fasta, .fa, .fas, or .txt)' 
    };
  }
  
  return result;
};

/**
 * Validate FASTA content
 * @param {string} content - FASTA file content
 * @returns {Object} - Validation result with isValid, message, warnings, and cleanedSequence
 */
export const validateFastaContent = (content) => {
  const result = {
    isValid: true,
    message: 'Content is valid',
    warnings: [],
    cleanedSequence: ''
  };
  
  if (!content || content.trim() === '') {
    return { 
      ...result, 
      isValid: false, 
      message: 'FASTA content is empty' 
    };
  }
  
  const lines = content.split('\n').map(line => line.trim());
  let sequence = '';
  let headerFound = false;
  
  // Check for FASTA header
  if (!lines.some(line => line.startsWith('>'))) {
    result.warnings.push('No FASTA header found. Assuming the entire file is sequence data.');
  } else {
    headerFound = true;
  }
  
  // Extract sequence data
  for (let line of lines) {
    if (line.startsWith('>')) {
      continue; // Skip header lines
    }
    if (line.length > 0) {
      sequence += line.toUpperCase();
    }
  }
  
  // Validate sequence characters
  const validChars = /^[ATGCNRYSWKMBDHV-]*$/;
  if (!validChars.test(sequence)) {
    const invalidChars = sequence.match(/[^ATGCNRYSWKMBDHV-]/g);
    result.warnings.push(`Found non-standard DNA characters: ${[...new Set(invalidChars)].join(', ')}. These will be removed.`);
    sequence = sequence.replace(/[^ATGCNRYSWKMBDHV-]/g, '');
  }
  
  // Check sequence length
  if (sequence.length === 0) {
    return { 
      ...result, 
      isValid: false, 
      message: 'No valid DNA sequence found in the file',
      cleanedSequence: '' 
    };
  } else if (sequence.length < 100) {
    result.warnings.push('Sequence is very short. Results may be limited.');
  }
  
  result.cleanedSequence = sequence;
  return result;
};

/**
 * Validate form fields
 * @param {Object} fields - Form fields to validate
 * @param {Array} requiredFields - List of required field names
 * @returns {Object} - Validation result with isValid, errors object
 */
export const validateForm = (fields, requiredFields = []) => {
  const errors = {};
  let isValid = true;
  
  // Check required fields
  requiredFields.forEach(field => {
    if (!fields[field] || fields[field].trim() === '') {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      isValid = false;
    }
  });
  
  // Validate email if present
  if (fields.email && !isValidEmail(fields.email)) {
    errors.email = 'Please enter a valid email address';
    isValid = false;
  }
  
  // Validate password if present
  if (fields.password) {
    const passwordValidation = validatePassword(fields.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.message;
      isValid = false;
    }
  }
  
  // Validate password confirmation if present
  if (fields.password && fields.confirmPassword && fields.password !== fields.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
    isValid = false;
  }
  
  return { isValid, errors };
};

export default {
  isValidEmail,
  validatePassword,
  validateFastaFile,
  validateFastaContent,
  validateForm
};
