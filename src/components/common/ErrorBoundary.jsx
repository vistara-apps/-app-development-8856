import React, { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
    
    // You could also log to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ 
      hasError: false,
      error: null,
      errorInfo: null
    });
    
    // If a reset callback was provided, call it
    if (this.props.onReset) {
      this.props.onReset();
    }
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div className="min-h-[300px] flex items-center justify-center">
          <div className="text-center p-6 max-w-md">
            <div className="bg-error/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-error" />
            </div>
            
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            
            <div className="text-gray-600 mb-4">
              {this.props.fallbackMessage || 'An unexpected error occurred. Please try again.'}
            </div>
            
            {this.state.error && this.props.showError && (
              <div className="bg-gray-50 p-3 rounded-lg mb-4 overflow-auto max-h-[200px] text-left">
                <p className="text-sm font-mono text-gray-700">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <details className="mt-2">
                    <summary className="text-xs text-gray-500 cursor-pointer">Stack trace</summary>
                    <pre className="mt-2 text-xs overflow-auto p-2 bg-gray-100 rounded">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="btn-primary flex items-center justify-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </button>
              
              {this.props.showReportButton && (
                <button
                  onClick={() => window.location.href = 'mailto:support@traitsniffer.com?subject=Error Report'}
                  className="btn-secondary flex items-center justify-center"
                >
                  Report Issue
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    // If no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
