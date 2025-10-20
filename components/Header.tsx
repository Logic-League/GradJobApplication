import React, { useState } from 'react';
import { User } from '../types';

interface HeaderProps {
  pageLetter: string;
  currentUser: User | null;
  onSignInClick: () => void;
  onLogout: () => void;
  onNavigate: (page: 'main' | 'myCareer') => void;
}

const Header: React.FC<HeaderProps> = ({ pageLetter, currentUser, onSignInClick, onLogout, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const charToBinary = (char: string): string => {
    if (!char || char.length !== 1) return "00000000";
    return char.charCodeAt(0).toString(2).padStart(8, '0');
  };
  
  const binaryPageNumber = charToBinary(pageLetter);

  const handleMyCareerClick = () => {
    onNavigate('myCareer');
    setIsMenuOpen(false);
  }

  const handleLogoutClick = () => {
    onLogout();
    setIsMenuOpen(false);
  }

  return (
    <header className="bg-gray-800 border-b border-gray-700 shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('main')}>
             <svg className="w-8 h-8 text-lime-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
            </svg>
            <span className="ml-3 text-xl font-bold text-white tracking-tight">LogicLeague</span>
          </div>
          
          <div className="flex-1 mx-4 text-center">
             <span className="text-beige-300 font-bold text-lg font-mono tracking-widest text-lime-400/80 opacity-80 select-none">
                {binaryPageNumber}
             </span>
          </div>

          <div className="flex items-center">
            {currentUser ? (
               <div className="relative">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 text-white bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                >
                    <span>Welcome, {currentUser.fullName.split(' ')[0]}</span>
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg py-1 z-50">
                    <a href="#" onClick={handleMyCareerClick} className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600">My Career</a>
                    <a href="#" onClick={handleLogoutClick} className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600">Logout</a>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={onSignInClick}
                className="bg-lime-600 hover:bg-lime-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
