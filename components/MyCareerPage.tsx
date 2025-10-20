import React, { useState } from 'react';
import { JobListing, User, SavedSearch, JobSearchQuery, PromptHistoryItem } from '../types';

interface MyCareerPageProps {
  user: User;
  favorites: JobListing[];
  onToggleFavorite: (job: JobListing) => void;
  savedSearches: SavedSearch[];
  onRerunSearch: (query: JobSearchQuery) => void;
  onDeleteSearch: (id: string) => void;
  promptHistory: PromptHistoryItem[];
}

const PromptHistoryViewer: React.FC<{ history: PromptHistoryItem[] }> = ({ history }) => {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    if (history.length === 0) {
        return <p className="text-gray-400">Your prompt history will appear here as you use the app.</p>;
    }

    return (
        <div className="space-y-3">
            {history.map((item) => (
                <div key={item.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                    <button
                        onClick={() => toggleExpand(item.id)}
                        className="w-full p-3 text-left flex items-center justify-between hover:bg-gray-700/50 transition-colors"
                    >
                        <div className="flex-grow">
                            <p className="font-semibold text-white">{item.type}</p>
                            <p className="text-xs text-gray-400">{new Date(item.timestamp).toLocaleString()}</p>
                        </div>
                        <svg
                            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${expandedId === item.id ? 'transform rotate-180' : ''}`}
                            fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {expandedId === item.id && (
                        <div className="p-4 border-t border-gray-700 bg-gray-900">
                            <h4 className="text-sm font-bold text-gray-300 mb-2">Full Prompt:</h4>
                            <pre className="text-sm text-gray-300 whitespace-pre-wrap bg-black/30 p-3 rounded-md font-mono">
                                {item.prompt.trim()}
                            </pre>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

const MyCareerPage: React.FC<MyCareerPageProps> = ({ 
    user, favorites, onToggleFavorite, 
    savedSearches, onRerunSearch, onDeleteSearch,
    promptHistory 
}) => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Welcome, {user.fullName}!</h1>
        <p className="text-lg text-gray-400 mt-1">This is your personal career hub. Track your saved jobs and searches here.</p>
      </div>
      
      {/* Saved Searches Section */}
      <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-4">Your Saved Searches ({savedSearches.length})</h2>
        {savedSearches.length > 0 ? (
          <div className="space-y-3">
            {savedSearches.map((search) => (
              <div key={search.id} className="bg-gray-800 p-3 rounded-lg border border-gray-700 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">{search.query.careerField}</p>
                  <p className="text-sm text-gray-400">{search.query.location}</p>
                </div>
                <div className="flex items-center space-x-3">
                   <button
                      onClick={() => onRerunSearch(search.query)}
                      className="px-3 py-2 bg-lime-700/80 text-white rounded-lg hover:bg-lime-600 transition-colors text-sm"
                   >
                      Run Search
                   </button>
                   <button
                      onClick={() => onDeleteSearch(search.id)}
                      className="px-3 py-2 bg-red-800/50 text-red-300 border border-red-700 rounded-lg hover:bg-red-700/50 hover:text-white transition-colors text-sm"
                   >
                      Delete
                   </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">You haven't saved any searches yet. Perform a search and click "Save This Search" to add one.</p>
        )}
      </div>

      {/* Saved Jobs Section */}
      <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-4">Your Saved Jobs ({favorites.length})</h2>
        {favorites.length > 0 ? (
          <div className="space-y-4">
            {favorites.map((job) => (
              <div key={job.url} className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex items-center justify-between hover:border-lime-500 transition-colors">
                <div>
                  <h3 className="font-bold text-lg text-white">{job.jobTitle}</h3>
                  <p className="text-md text-gray-400">{job.company} - {job.location}</p>
                </div>
                <div className="flex items-center space-x-3">
                   <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                   >
                      View
                   </a>
                   <button
                      onClick={() => onToggleFavorite(job)}
                      className="px-4 py-2 bg-red-800/50 text-red-300 border border-red-700 rounded-lg hover:bg-red-700/50 hover:text-white transition-colors text-sm"
                   >
                      Remove
                   </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">You haven't saved any jobs yet. Start searching and click the star icon to add jobs here!</p>
        )}
      </div>
      
      {/* Prompt History Section */}
      <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">Prompt History ({promptHistory.length})</h2>
          <PromptHistoryViewer history={promptHistory} />
      </div>
    </div>
  );
};

export default MyCareerPage;