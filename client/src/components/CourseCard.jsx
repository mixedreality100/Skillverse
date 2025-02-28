import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CourseCard({ title = "Flora", status, image, courseId }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (courseId) {
      navigate(`/course/${courseId}`); // Updated to navigate to `/course/:courseId`
    } else {
      console.error('Course ID is undefined');
    }
  };

  return (
    <div 
      className="relative w-[445px] bg-white rounded-xl shadow-lg overflow-hidden transition-transform transform hover:scale-105 m-6 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Card Media */}
      <div className="relative">
        <img
          loading="lazy"
          src={image}
          alt={`${title} course thumbnail`}
          className="object-cover w-full h-[170px]"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h2 className="text-white text-2xl font-semibold tracking-wide">{title}</h2>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        <h3 className="text-xl font-medium mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">
          {status}
        </p>
      </div>

      {/* Card Actions */}
      <div className="px-4 pb-4 flex items-center justify-between">
        <div className="flex gap-10">
          <button 
            onClick={handleCardClick} 
            className="px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}