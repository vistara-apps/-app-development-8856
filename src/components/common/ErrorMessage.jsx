import React from 'react';
import { AlertCircle, X } from 'lucide-react';

/**
 * Error message component for displaying error messages
 * @param {Object} props - Component props
 * @param {string} props.message - Error message to display
 * @param {string} props.type - Error type (error, warning, info)
 * @param {boolean} props.dismissible - Whether the error can be dismissed
 * @param {Function} props.onDismiss - Callback when error is dismissed
 * @param {string} props.className - Additional CSS classes
 */
function ErrorMessage({ 
  message, 
  type = 'error', 
  dismissible = false, 
  onDismiss,
  className = ''
}) {
  if (!message) return null;
  
  // Determine styles based on type
  let bgColor, borderColor, textColor, iconColor;
  
  switch (type) {
    case 'warning':
      bgColor = 'bg-warning/10';
      borderColor = 'border-warning/20';
      textColor = 'text-orange-700';
      iconColor = 'text-warning';
      break;
    case 'info':
      bgColor = 'bg-primary/10';
      borderColor = 'border-primary/20';
      textColor = 'text-primary';
      iconColor = 'text-primary';
      break;
    case 'success':
      bgColor = 'bg-success/10';
      borderColor = 'border-success/20';
      textColor = 'text-success';
      iconColor = 'text-success';
      break;
    case 'error':
    default:
      bgColor = 'bg-error/10';
      borderColor = 'border-error/20';
      textColor = 'text-error';
      iconColor = 'text-error';
      break;
  }
  
  return (
    <div className={`${bgColor} ${borderColor} border rounded-lg p-3 ${className}`}>
      <div className="flex items-start">
        <AlertCircle className={`h-5 w-5 ${iconColor} mr-2 mt-0.5 flex-shrink-0`} />
        <div className={`${textColor} text-sm flex-grow`}>
          {typeof message === 'string' ? message : JSON.stringify(message)}
        </div>
        {dismissible && onDismiss && (
          <button
            onClick={onDismiss}
            className={`ml-2 ${iconColor} hover:opacity-70 transition-opacity`}
            aria-label="Dismiss"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorMessage;
