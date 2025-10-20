import React from 'react';

interface CareerBannerProps {
  isLoading: boolean;
  imageUrl: string | null;
}

const CareerBanner: React.FC<CareerBannerProps> = ({ isLoading, imageUrl }) => {
  if (isLoading) {
    return (
      <div className="w-full h-40 bg-gray-700 rounded-lg animate-pulse"></div>
    );
  }

  if (!imageUrl) {
    return null; // Don't render anything if there's no image and it's not loading
  }

  return (
    <div className="w-full h-40 rounded-lg overflow-hidden border border-gray-700 shadow-lg">
      <img 
        src={imageUrl} 
        alt="AI generated career banner" 
        className="w-full h-full object-cover" 
      />
    </div>
  );
};

export default CareerBanner;