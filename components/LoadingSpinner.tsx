import React from 'react';

interface LoadingSpinnerProps {
    className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className = 'h-8 w-8' }) => {
  return (
    <div
      className={`${className} animate-spin rounded-full border-4 border-t-lime-500 border-gray-600`}
      role="status"
    >
        <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;