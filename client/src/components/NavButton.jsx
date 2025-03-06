import React from 'react';
import { useNavigate } from 'react-router-dom';

const NavButton = ({ children, onClick }) => {
  const navigate = useNavigate();

  return (
    <button
      className="text-black transform transition-transform duration-300 hover:scale-110 rounded-full px-8 py-3"
      style={{
        backgroundColor: '#e0e5ec', // Light gray background for neomorphism
        boxShadow: '8px 8px 15px #a3b1c6, -8px -8px 15px #ffffff', // Stronger shadows for depth
        border: 'none', // Remove the border for a cleaner look
        outline: 'none', // Remove default outline
        cursor: 'pointer',
        transition: 'box-shadow 0.3s ease, transform 0.3s ease', // Smooth transitions
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '12px 12px 20px #a3b1c6, -12px -12px 20px #ffffff'; // Enhanced shadow on hover
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '8px 8px 15px #a3b1c6, -8px -8px 15px #ffffff'; // Restore original shadow
      }}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default NavButton;