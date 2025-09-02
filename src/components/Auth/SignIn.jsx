import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { validateForm } from '../../lib/validation';
import { Mail, Lock, AlertCircle, LogIn } from 'lucide-react';

function SignIn({ onSuccess, onSignUpClick }) {
  const { signIn, loading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    
    // Validate form
    const validation = validateForm(
      { email, password },
      ['email', 'password']
    );
    
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }
    
    setFormErrors({});
    
    // Sign in
    const { error } = await signIn(email, password);
    
    if (!error && onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
        <p className="text-gray-600">Sign in to continue your genetic journey</p>
      </div>
      
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
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <button
              type="button"
              className="text-sm text-primary hover:text-primary/80"
              onClick={() => onSignUpClick && onSignUpClick('reset-password')}
            >
              Forgot password?
            </button>
          </div>
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
              Signing in...
            </span>
          ) : (
            <span className="flex items-center">
              <LogIn className="h-5 w-5 mr-2" />
              Sign In
            </span>
          )}
        </button>
        
        {/* Sign Up Link */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              className="text-primary hover:text-primary/80 font-medium"
              onClick={() => onSignUpClick && onSignUpClick('sign-up')}
            >
              Sign up
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}

export default SignIn;
