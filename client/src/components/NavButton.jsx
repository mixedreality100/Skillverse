// src/components/NavButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NavButton = ({ children, onClick }) => {
  const navigate = useNavigate();

  return (
    <button
      className="px-5 py-4 whitespace-nowrap border-2 border-black border-solid bg-zinc-50 rounded-full text-xs text-black transform transition-transform duration-300 hover:scale-110"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default NavButton;

