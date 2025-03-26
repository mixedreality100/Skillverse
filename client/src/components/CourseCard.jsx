import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CourseCard({ title = "Flora", status, image, courseId }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (courseId) {
      navigate(`/course/${courseId}`);
    } else {
      console.error('Course ID is undefined');
    }
  };

  return (
    <div 
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '445px',
        backgroundColor: '#e0e5ec',
        borderRadius: '20px',
        boxShadow: '20px 20px 60px #bebebe, -20px -20px 60px #ffffff',
        overflow: 'hidden',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        transform: 'scale(1)',
        margin: '12px',
        cursor: 'pointer',
      }}
      className="hover:scale-105"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.boxShadow = '25px 25px 70px #bebebe, -25px -25px 70px #ffffff';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '20px 20px 60px #bebebe, -20px -20px 60px #ffffff';
      }}
      onClick={handleCardClick}
    >
      {/* Import Poppins Font */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
        `}
      </style>

      {/* Card Media */}
      <div style={{ position: 'relative' }}>
        <img
          loading="lazy"
          src={image}
          alt={`${title} course thumbnail`}
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '170px',
          }}
        />
        {/* Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <h2 style={{
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: '600',
            letterSpacing: '0.025em',
            fontFamily: "'Paytone One', sans-serif", // Apply Poppins font
          }}>
            {title}
          </h2>
        </div>
      </div>

      {/* Card Content */}
      <div style={{ 
        padding: '16px',
        width: '100%',
      }}>
        <h3 style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
          fontWeight: '500',
          marginBottom: '8px',
          fontFamily: "'Poppins', sans-serif",
        }}>
          {title}
        </h3>
        <p style={{
          color: '#4a5568',
          fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
          marginBottom: '16px',
          fontFamily: "'Poppins', sans-serif",
        }}>
          {status}
        </p>
      </div>

      {/* Card Actions */}
      <div style={{
        padding: '0 16px 16px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', gap: '40px' }}>
          <button 
            onClick={handleCardClick} 
            style={{
              padding: '6px 16px',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#4a5568',
              backgroundColor: '#e0e5ec',
              borderRadius: '9999px',
              border: 'none',
              boxShadow: '5px 5px 10px #bebebe, -5px -5px 10px #ffffff',
              transition: 'background-color 0.3s ease, transform 0.3s ease',
              cursor: 'pointer',
              fontFamily: "'Poppins', sans-serif", // Apply Poppins font
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '8px 8px 15px #bebebe, -8px -8px 15px #ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '5px 5px 10px #bebebe, -5px -5px 10px #ffffff';
            }}
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}