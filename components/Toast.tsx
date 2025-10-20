import React from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  onDismiss: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, message, type, onDismiss }) => {
  const baseClasses = 'w-full max-w-sm p-4 rounded-lg shadow-lg flex items-center text-white';
  const typeClasses = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      <div className="flex-grow">{message}</div>
      <button onClick={() => onDismiss(id)} className="ml-4 p-1 rounded-full hover:bg-black/20">
        &times;
      </button>
    </div>
  );
};

export default Toast;
