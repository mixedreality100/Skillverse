import React from 'react';

const Button = ({ onClick }) => {
  return (
    <button title="Add New" className="group cursor-pointer outline-none hover:rotate-90 duration-300 bg-transparent border-none" onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" width="50px" height="50px" viewBox="0 0 24 24" className="fill-[#cbe0e0] group-hover:fill group-active:stroke-zinc-200 group-active:fill- group-active:duration-0 duration-300">
        <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#00688D" strokeWidth="1.5" />
        <path d="M8 12H16" stroke="#00688D" strokeWidth="1.5" />
        <path d="M12 16V8" stroke="#00688D" strokeWidth="1.5" />
      </svg>
    </button>
  );
}

export default Button;
