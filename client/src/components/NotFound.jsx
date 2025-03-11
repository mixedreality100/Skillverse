
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Cat Container */}
        <div className="relative mx-auto w-64 h-64">
          {/* Cat Body */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-40 bg-gray-200 rounded-full shadow-lg" />
          
          {/* Cat Head */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-gray-300 rounded-full shadow-lg">
            {/* Ears */}
            <div className="absolute -top-4 left-2 w-0 h-0 border-l-8 border-transparent border-b-[16px] border-gray-300" />
            <div className="absolute -top-4 right-2 w-0 h-0 border-r-8 border-transparent border-b-[16px] border-gray-300" />
            
            {/* Eyes */}
            <div className="absolute top-8 left-4 w-6 h-6 bg-white rounded-full">
              <div className="w-3 h-3 bg-black rounded-full mt-1 ml-1" />
            </div>
            <div className="absolute top-8 right-4 w-6 h-6 bg-white rounded-full">
              <div className="w-3 h-3 bg-black rounded-full mt-1 mr-1" />
            </div>
            
            {/* Whiskers */}
            <div className="absolute top-16 left-0 w-16 h-1 bg-gray-400 transform -rotate-12" />
            <div className="absolute top-16 right-0 w-16 h-1 bg-gray-400 transform rotate-12" />
          </div>
          
          {/* 404 Sign */}
          <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-white px-6 py-3 rounded-lg shadow-md rotate-6">
            <span className="text-3xl font-bold text-red-500">404</span>
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Oops! Cat-astrophe!
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          The page you're looking for has gone chasing yarn balls!
        </p>

        {/* Action Button */}
        <button
          onClick={() => navigate('/')}
          className="bg-orange-400 hover:bg-orange-500 text-white font-semibold px-8 py-3 rounded-full 
                   transform transition-all duration-300 hover:scale-105 shadow-lg"
        >
          Back to Safety
        </button>

        {/* Floating Yarn Balls */}
        <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-pink-300 rounded-full opacity-50 animate-float" />
        <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-blue-300 rounded-full opacity-50 animate-float-delayed" />
      </div>

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 3s ease-in-out infinite 0.5s;
        }
      `}</style>
    </div>
  );
};

export default NotFound;