import React from 'react';

interface CareerNavBarProps {
  onCareerSelect: (career: string) => void;
  activeCareer: string | null;
}

const CAREER_FIELDS = [
    'IT & Software Development',
    'Finance & Accounting',
    'Engineering',
    'Healthcare',
    'Marketing & Sales',
    'Education',
    'Law',
    'Human Resources',
];

const CareerNavBar: React.FC<CareerNavBarProps> = ({ onCareerSelect, activeCareer }) => {
  return (
    <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
        <h2 className="text-center text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
            Or quick search a popular field
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
            {CAREER_FIELDS.map(career => (
                <button
                    key={career}
                    onClick={() => onCareerSelect(career)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 border
                    ${activeCareer === career
                        ? 'bg-lime-600 text-white border-lime-500'
                        : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600 hover:border-gray-500'
                    }`}
                >
                    {career}
                </button>
            ))}
        </div>
    </div>
  );
};

export default CareerNavBar;
