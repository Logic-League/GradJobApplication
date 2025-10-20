import React from 'react';
import { JobListing, User } from '../types';
import LoadingSpinner from './LoadingSpinner';

// Make sure jsPDF is available on the window object
declare const jspdf: any;

interface ResultsListProps {
  currentUser: User | null;
  currentJob: JobListing | null;
  currentIndex: number;
  totalJobs: number;
  onNextPage: () => void;
  onPreviousPage: () => void;
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
  favorites: JobListing[];
  onToggleFavorite: (job: JobListing) => void;
  onSaveSearch: () => void;
  onGenerateAudioSummary: () => void;
  isAudioSummaryLoading: boolean;
}

const FavoriteStarIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={filled ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
);

const RatingStarIcon: React.FC<{ filled: boolean; className?: string }> = ({ filled, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className} ${filled ? 'text-yellow-400' : 'text-gray-600'}`} viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const ViewJobIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
);

const DownloadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const AudioIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
);

const CompanyIcon: React.FC = () => (
    <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center bg-lime-900/50 text-lime-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
    </div>
);

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
            <RatingStarIcon key={i} filled={i < Math.round(rating)} />
        ))}
    </div>
);

const ResultsList: React.FC<ResultsListProps> = ({ 
    currentUser, currentJob, currentIndex, totalJobs, onNextPage, onPreviousPage,
    isLoading, error, hasSearched, favorites, onToggleFavorite, onSaveSearch,
    onGenerateAudioSummary, isAudioSummaryLoading
}) => {

  const numberToPaddedBinary = (num: number, padLength: number): string => {
    return num.toString(2).padStart(padLength, '0');
  };
  
  const handleDownloadPdf = () => {
    if (!currentJob) return;

    const { jsPDF } = jspdf;
    const doc = new jsPDF();
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(currentJob.jobTitle, 15, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`${currentJob.company} - ${currentJob.location}`, 15, 28);
    
    doc.setLineWidth(0.5);
    doc.line(15, 32, 195, 32);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Job Description:", 15, 42);
    doc.setFont("helvetica", "normal");
    const descriptionLines = doc.splitTextToSize(currentJob.description, 180);
    doc.text(descriptionLines, 15, 48);
    
    const finalY = 48 + (descriptionLines.length * 7);

    doc.setFont("helvetica", "bold");
    doc.text("AI Source Review:", 15, finalY + 10);
    doc.setFont("helvetica", "normal");
    doc.text(`Source: ${currentJob.source.name}`, 15, finalY + 16);
    doc.text(`Rating: ${currentJob.source.rating} / 5`, 15, finalY + 22);
    const summaryLines = doc.splitTextToSize(`"${currentJob.source.summary}"`, 180);
    doc.text(summaryLines, 15, finalY + 28);

    doc.save(`${currentJob.jobTitle.replace(/\s/g, '_')}_${currentJob.company}.pdf`);
  };
    
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center text-center text-gray-400 py-10">
        <LoadingSpinner className="h-12 w-12 mb-4" />
        <p className="text-lg font-semibold text-gray-300">Our AI is scanning the job market for you...</p>
        <p>This may take a moment.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 px-4 bg-red-900/50 border border-red-700 rounded-lg">
        <p className="text-red-400 font-semibold">Oops! Something went wrong.</p>
        <p className="text-red-400 mt-2">{error}</p>
      </div>
    );
  }
  
  if (!hasSearched) {
      return (
        <div className="text-center py-10 px-4 bg-gray-800 border border-gray-700 rounded-lg">
            <p className="text-gray-400 font-medium">Enter your desired career and location to find jobs.</p>
        </div>
      )
  }

  if (!currentJob) {
    return (
      <div className="text-center py-10 px-4 bg-yellow-900/50 border border-yellow-700 rounded-lg">
        <p className="text-yellow-300 font-semibold">No results found.</p>
        <p className="text-yellow-400 mt-2">Try adjusting your search criteria.</p>
      </div>
    );
  }

  const isFavorite = favorites.some(fav => fav.url === currentJob.url);

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
            <h2 className="text-2xl font-bold text-white">Job Opportunities</h2>
            <div className="flex items-center space-x-2">
                {totalJobs > 0 && (
                    <button
                        onClick={onGenerateAudioSummary}
                        disabled={isAudioSummaryLoading}
                        className="flex items-center justify-center px-4 py-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg hover:bg-gray-600 hover:text-white transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-wait"
                    >
                        {isAudioSummaryLoading ? <LoadingSpinner className="h-4 w-4 mr-2" /> : <AudioIcon />}
                        <span>{isAudioSummaryLoading ? 'Generating...' : 'Listen to Summary'}</span>
                    </button>
                )}
                {currentUser && totalJobs > 0 && (
                    <button
                        onClick={onSaveSearch}
                        className="px-4 py-2 bg-lime-800/50 text-lime-300 border border-lime-700 rounded-lg hover:bg-lime-700/50 hover:text-white transition-colors text-sm font-semibold"
                    >
                        Save This Search
                    </button>
                )}
            </div>
        </div>
      
      <div key={currentIndex} className="animate-page-flip">
        <div className="bg-gray-800 p-5 rounded-xl shadow-md border border-gray-700 hover:shadow-lg hover:border-lime-500 transition-all duration-300 flex flex-col sm:flex-row items-start sm:space-x-5">
            <CompanyIcon />
            <div className="flex-grow mt-4 sm:mt-0">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-lg text-white">{currentJob.jobTitle}</h3>
                        <p className="text-md text-gray-400">{currentJob.company}</p>
                        <p className="text-sm text-gray-400 mt-1">{currentJob.location}</p>
                    </div>
                     <button
                        onClick={() => onToggleFavorite(currentJob)}
                        className={`p-2 rounded-full transition-colors duration-200 ${isFavorite ? 'text-yellow-400 bg-yellow-900/50 hover:bg-yellow-800/50' : 'text-gray-500 hover:bg-gray-700 hover:text-yellow-400'}`}
                        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                        <FavoriteStarIcon filled={isFavorite} />
                    </button>
                </div>
                <p className="text-gray-300 mt-3 text-sm">{currentJob.description}</p>
                
                <div className="mt-4 pt-4 border-t border-gray-700">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Source Review</h4>
                    <div className="flex items-center justify-between mt-2">
                        <p className="font-semibold text-gray-200">{currentJob.source.name}</p>
                        <StarRating rating={currentJob.source.rating} />
                    </div>
                    <p className="text-sm text-gray-400 mt-1 italic">"{currentJob.source.summary}"</p>
                </div>

                <div className="mt-4 flex justify-end items-center space-x-3">
                     <button
                        onClick={handleDownloadPdf}
                        className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 transition"
                    >
                        <DownloadIcon />
                        Download PDF
                    </button>
                     <a
                        href={currentJob.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-lime-600 hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 transition"
                    >
                        <ViewJobIcon />
                        View Job
                    </a>
                </div>
            </div>
        </div>
      </div>

      {totalJobs > 1 && (
        <div className="flex items-center justify-between mt-6">
            <button 
                onClick={onPreviousPage}
                disabled={currentIndex === 0}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
            >
                Previous
            </button>
            <p className="text-gray-400 font-medium font-mono tracking-wider">
                Job {numberToPaddedBinary(currentIndex + 1, 5)} of {numberToPaddedBinary(totalJobs, 5)}
            </p>
            <button 
                onClick={onNextPage}
                disabled={currentIndex === totalJobs - 1}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
            >
                Next
            </button>
        </div>
      )}
    </div>
  );
};

export default ResultsList;