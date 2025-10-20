import React, { useState } from 'react';
import { User } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
  onRegister: (user: User) => void;
  addToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

type AuthMode = 'login' | 'register';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin, onRegister, addToast }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isOpen) return null;

  const handleSwitchMode = () => {
    setError(null);
    setMode(mode === 'login' ? 'register' : 'login');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Using a timeout to simulate network latency
    setTimeout(() => {
        if (mode === 'register') {
          // Registration Logic
          if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setIsLoading(false);
            return;
          }
          const existingUsers: User[] = JSON.parse(localStorage.getItem('users') || '[]');
          if (existingUsers.some(u => u.username === username)) {
            setError("Username already exists.");
            setIsLoading(false);
            return;
          }
          const newUser: User = { fullName, username, password };
          existingUsers.push(newUser);
          localStorage.setItem('users', JSON.stringify(existingUsers));
          onRegister({ fullName, username });

        } else {
          // Login Logic
          const existingUsers: User[] = JSON.parse(localStorage.getItem('users') || '[]');
          const user = existingUsers.find(u => u.username === username);
          if (user && user.password === password) {
            onLogin({ fullName: user.fullName, username: user.username });
          } else {
            setError("Invalid username or password.");
            addToast("Invalid username or password.", 'error');
          }
        }
        setIsLoading(false);
    }, 500);
  };
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-white mb-4">{mode === 'login' ? 'Sign In' : 'Create Account'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-lime-500 focus:border-lime-500" />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-lime-500 focus:border-lime-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-lime-500 focus:border-lime-500" />
          </div>
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-lime-500 focus:border-lime-500" />
            </div>
          )}
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center px-4 py-3 bg-lime-600 text-white font-bold rounded-lg hover:bg-lime-700 disabled:bg-gray-600 transition-colors">
            {isLoading ? <LoadingSpinner /> : (mode === 'login' ? 'Login' : 'Register')}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
          <button onClick={handleSwitchMode} className="font-medium text-lime-400 hover:text-lime-300 ml-1">
            {mode === 'login' ? 'Register' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;