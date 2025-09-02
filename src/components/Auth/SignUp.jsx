import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { validateForm, validatePassword } from '../../lib/validation';
import { Mail, Lock, AlertCircle, UserPlus, Check, X } from 'lucide-react';

function SignUp({ onSuccess, onSignInClick }) {
  const { signUp, loading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Password strength indicators
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const passwordsMatch = password === confirmPassword && password !== '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setSuccessMessage('');
    
    // Validate form
    const validation = validateForm(
      { email, password, confirmPassword },
      ['email', 'password', 'confirmPassword']
    );
    
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }
    
    // Additional password validation
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setFormErrors({ ...validation.errors, password: passwordValidation.message });
      return;
    }
    
    // Check if passwords match
    if (password !== confirmPassword) {
      setFormErrors({ ...validation.errors, confirmPassword: 'Passwords do not match' });
      return;
    }
    
    setFormErrors({});
    
    // Sign up
    const { error, data } = await signUp(email, password);
    
    if (!error) {
      setSuccessMessage('Registration successful! Please check your email to confirm your account.');
      if (onSuccess) {
        onSuccess();
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Create Your Account</h2>
        <p className="text-gray-600">Sign up to start your genetic discovery</p>
      </div>
      
      {successMessage ? (
        <div className="bg-success/10 border border-success/20 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-success flex items-center">
            <Check className="h-5 w-5 mr-2" />
            Success!
          </h3>
          <p className="mt-1 text-sm text-success/90">{successMessage}</p>
          <button
            type="button"
            className="mt-4 btn-primary w-full"
            onClick={() => onSignInClick && onSignInClick()}
          >
            Go to Sign In
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`input-field pl-10 ${formErrors.email ? 'border-error' : ''}`}
                placeholder="you@example.com"
              />
            </div>
            {formErrors.email && (
              <p className="mt-1 text-sm text-error">{formErrors.email}</p>
            )}
          </div>
          
          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`input-field pl-10 ${formErrors.password ? 'border-error' : ''}`}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="text-sm text-gray-600 hover:text-gray-800">
                  {showPassword ? 'Hide' : 'Show'}
                </span>
              </button>
            </div>
            {formErrors.password && (
              <p className="mt-1 text-sm text-error">{formErrors.password}</p>
            )}
            
            {/* Password Strength Indicators */}
            <div className="mt-2 space-y-1">
              <div className="flex items-center text-xs">
                {hasMinLength ? (
                  <Check className="h-3.5 w-3.5 text-success mr-1.5" />
                ) : (
                  <X className="h-3.5 w-3.5 text-gray-400 mr-1.5" />
                )}
                <span className={hasMinLength ? 'text-success' : 'text-gray-500'}>
                  At least 8 characters
                </span>
              </div>
              <div className="flex items-center text-xs">
                {hasUppercase ? (
                  <Check className="h-3.5 w-3.5 text-success mr-1.5" />
                ) : (
                  <X className="h-3.5 w-3.5 text-gray-400 mr-1.5" />
                )}
                <span className={hasUppercase ? 'text-success' : 'text-gray-500'}>
                  At least one uppercase letter
                </span>
              </div>
              <div className="flex items-center text-xs">
                {hasLowercase ? (
                  <Check className="h-3.5 w-3.5 text-success mr-1.5" />
                ) : (
                  <X className="h-3.5 w-3.5 text-gray-400 mr-1.5" />
                )}
                <span className={hasLowercase ? 'text-success' : 'text-gray-500'}>
                  At least one lowercase letter
                </span>
              </div>
              <div className="flex items-center text-xs">
                {hasNumber ? (
                  <Check className="h-3.5 w-3.5 text-success mr-1.5" />
                ) : (
                  <X className="h-3.5 w-3.5 text-gray-400 mr-1.5" />
                )}
                <span className={hasNumber ? 'text-success' : 'text-gray-500'}>
                  At least one number
                </span>
              </div>
            </div>
          </div>
          
          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`input-field pl-10 ${formErrors.confirmPassword ? 'border-error' : ''}`}
                placeholder="••••••••"
              />
            </div>
            {formErrors.confirmPassword && (
              <p className="mt-1 text-sm text-error">{formErrors.confirmPassword}</p>
            )}
            {confirmPassword && (
              <div className="mt-2 flex items-center text-xs">
                {passwordsMatch ? (
                  <Check className="h-3.5 w-3.5 text-success mr-1.5" />
                ) : (
                  <X className="h-3.5 w-3.5 text-error mr-1.5" />
                )}
                <span className={passwordsMatch ? 'text-success' : 'text-error'}>
                  Passwords {passwordsMatch ? 'match' : 'do not match'}
                </span>
              </div>
            )}
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-3 flex items-start">
              <AlertCircle className="h-5 w-5 text-error mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-error">{error}</p>
            </div>
          )}
          
          {/* Submit Button */}
          <button
            type="submit"
            className="btn-primary w-full flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </span>
            ) : (
              <span className="flex items-center">
                <UserPlus className="h-5 w-5 mr-2" />
                Sign Up
              </span>
            )}
          </button>
          
          {/* Sign In Link */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                className="text-primary hover:text-primary/80 font-medium"
                onClick={() => onSignInClick && onSignInClick()}
              >
                Sign in
              </button>
            </p>
          </div>
        </form>
      )}
    </div>
  );
}

export default SignUp;
