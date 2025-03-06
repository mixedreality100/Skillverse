// src/components/NavButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NavButton = ({ children, onClick }) => {
  const navigate = useNavigate();

  return (
    <button
    className="text-black transform transition-transform duration-300 hover:scale-110 rounded-full px-8 py-3 shadow-lg"
    style={{
      boxShadow: "5px 5px 10px #d1d1d1, -5px -5px 10px #ffffff",
      border: "0.5px solid rgba(0, 0, 0, 0.33)",
    }}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default NavButton;

