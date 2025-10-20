import React from 'react';
import { CareerAvailability } from '../types';

interface CareerAvailabilityChartProps {
  isLoading: boolean;
  data: CareerAvailability[];
}

const ChartSkeleton: React.FC = () => (
    <div className="flex items-end justify-around h-48 w-full animate-pulse">
        {[...Array(7)].map((_, i) => (
            <div key={i} className="w-10 sm:w-12 bg-gray-700 rounded-t-md" style={{ height: `${Math.random() * 80 + 20}%` }}></div>
        ))}
    </div>
);

const CareerAvailabilityChart: React.FC<CareerAvailabilityChartProps> = ({ isLoading, data }) => {
    if (isLoading) {
        return (
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                <h2 className="text-xl font-semibold text-white mb-4">Global Career Opportunity Scale</h2>
                <ChartSkeleton />
            </div>
        );
    }

    if (!data || data.length === 0) {
        return null;
    }

    const countryOrder = ["USA", "China", "Russia", "India", "UK", "Dubai", "Brazil"];
    const sortedData = [...data].sort((a, b) => countryOrder.indexOf(a.country) - countryOrder.indexOf(b.country));


    return (
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Global Career Opportunity Scale</h2>
            <p className="text-sm text-gray-400 mb-6">AI-powered analysis of entry-level job availability for this field in key markets.</p>
            <div className="flex items-end justify-around h-48 w-full space-x-2 sm:space-x-4">
                {sortedData.map((item) => (
                    <div key={item.country} className="flex flex-col items-center justify-end h-full flex-1 group relative">
                        <div 
                            className="w-full bg-lime-600 hover:bg-lime-500 rounded-t-md transition-all duration-300 ease-out" 
                            style={{ height: `${item.availabilityScore * 10}%` }}
                        >
                           <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-white font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                {item.availabilityScore}/10
                           </span>
                        </div>
                        <span className="text-xs text-gray-300 mt-2 font-semibold">{item.country}</span>
                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-10 w-48 bg-gray-900 text-white text-xs rounded-lg py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 border border-gray-600 shadow-lg">
                            <span className="font-bold">{item.country}:</span> {item.summary}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-gray-900"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CareerAvailabilityChart;
