import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { JobSearchQuery } from '../types';

interface SearchFormProps {
  onSearch: (query: JobSearchQuery) => void;
  isLoading: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [careerField, setCareerField] = useState('');
  const [location, setLocation] = useState('South Africa');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (careerField.trim() && location.trim()) {
      onSearch({ careerField, location });
    }
  };

  return (
    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
      <h2 className="text-xl font-semibold text-white mb-4">Find Your Graduate Job</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="careerField" className="block text-sm font-medium text-gray-300 mb-2">
            1. Enter Career Field
          </label>
          <input
            type="text"
            id="careerField"
            value={careerField}
            onChange={(e) => setCareerField(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-lime-500 focus:border-lime-500 transition"
            placeholder="e.g., Software Development"
            required
          />
        </div>

        <div>
           <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">
            2. Enter Location
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-lime-500 focus:border-lime-500 transition"
            placeholder="e.g., South Africa"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !careerField || !location}
          className="w-full flex justify-center items-center px-4 py-3 bg-lime-600 text-white font-bold rounded-lg hover:bg-lime-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? <LoadingSpinner /> : 'Find Jobs'}
        </button>
      </form>
    </div>
  );
};

export default SearchForm;