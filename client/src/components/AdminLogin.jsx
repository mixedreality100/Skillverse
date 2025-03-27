import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:3000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
  
      if (response.status === 200) {
        navigate('/admin-dashboard', {
          state: { fromApp: true },
        });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex flex-col md:flex-row rounded-2xl shadow-xl bg-gray-100 overflow-hidden">
        {/* Left Section with Image - Hidden on mobile */}
        <div className="hidden md:flex md:w-1/2 p-8 items-center justify-center">
          <div className="bg-gray-100 rounded-2xl p-6 shadow-[8px_8px_16px_#c4c4c4,-8px_-8px_16px_#ffffff]">
            <img src="/src/assets/MINI.svg" alt="Illustration" className="w-3/4 mx-auto" />
          </div>
        </div>

        {/* Right Section with Login Form */}
        <div className="w-full md:w-1/2 p-6 md:p-12 bg-gray-100">
          {/* Google Font Import */}
          <style>
            {`
              @import url('https://fonts.googleapis.com/css2?family=Paytone+One&display=swap');
              .paytone-font {
                font-family: 'Paytone One', sans-serif;
              }
            `}
          </style>
          
          {/* Header */}
          <h1 className="text-3xl paytone-font mt-4 text-black">Admin Login</h1>
          <p className="text-gray-600 mt-2">Please enter your credentials</p>
          
          {/* Login Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {/* Username Input */}
            <div className="relative">
              <input 
                type="text" 
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required 
                className="w-full py-3 px-4 rounded-xl border-none bg-gray-100 text-gray-800
                  shadow-[inset_4px_4px_8px_#c4c4c4,inset_-4px_-4px_8px_#ffffff]
                  focus:shadow-[inset_6px_6px_12px_#b3b3b3,inset_-6px_-6px_12px_#ffffff]
                  focus:outline-none transition-all duration-300"
              />
            </div>
            
            {/* Password Input with Toggle */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full py-3 px-4 rounded-xl border-none bg-gray-100 text-gray-800
                  shadow-[inset_4px_4px_8px_#c4c4c4,inset_-4px_-4px_8px_#ffffff]
                  focus:shadow-[inset_6px_6px_12px_#b3b3b3,inset_-6px_-6px_12px_#ffffff]
                  focus:outline-none transition-all duration-300"
              />
              {/* Password Visibility Toggle Button */}
              <button
                type="button"
                className="absolute right-4 top-3 text-gray-600"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
            
            {/* Login Button */}
            <button 
              type="submit" 
              className="w-full py-3 px-6 text-black paytone-font text-lg rounded-xl
                bg-yellow-400 
                shadow-[4px_4px_8px_#c4c4c4,-4px_-4px_8px_#ffffff]
                hover:shadow-[2px_2px_4px_#c4c4c4,-2px_-2px_4px_#ffffff]
                active:shadow-[inset_4px_4px_8px_#c4c4c4,inset_-4px_-4px_8px_#ffffff]
                transition-all duration-300"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;