import React from 'react';
import { worldMapPaths } from './worldMapPaths';

interface WorldMapProps {
  selectedCountry: string;
  onCountrySelect: (country: string) => void;
}

const WorldMap: React.FC<WorldMapProps> = ({ selectedCountry, onCountrySelect }) => {
  const handleCountryClick = (countryName: string) => {
    onCountrySelect(countryName);
  };

  return (
    <svg
      viewBox="0 0 2000 1001"
      className="w-full h-auto bg-gray-900 border border-gray-700 rounded-lg cursor-pointer"
      aria-label="World map for country selection"
    >
      <g>
        {worldMapPaths.map((country) => (
          <path
            key={country.id}
            d={country.d}
            className={`country-path ${selectedCountry === country.name ? 'selected' : ''}`}
            onClick={() => handleCountryClick(country.name)}
          >
            <title>{country.name}</title>
          </path>
        ))}
      </g>
    </svg>
  );
};

export default WorldMap;
