import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormInput from "./FormInput";
import Button from "./Button";
import '../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const SignupPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordsMatch(e.target.value === confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordsMatch(password === e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div className="login-container bg-white">
      <div className="bg-white shadow-xl rounded-lg w-full max-w-4xl flex overflow-hidden">
        {/* Left Section */}
        <div className="hidden md:flex items-center justify-center bg-gray-100 w-1/2">
          <img src="/src/assets/MINI.svg" alt="Illustration" className="w-3/4" />
        </div>

        {/* Right Section */}
        <div className="flex flex-col w-full md:w-1/2 p-6 md:p-12">
        <Link to="/"><img src="/src/assets/homeIcon.svg" alt="Home" className="inline-block h-4 w-4 mr-0" /></Link>
          <div className="form-header">
         <Link to="/login" className="login-link">Log in</Link>
          </div>
          <h1 className="text-2xl font-semibold mt-4 text-black" id='text'>Create an Account</h1>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="flex space-x-4">
              <input className="input-field border-2 border-black shadow-[inset_-4px_-4px_8px_rgba(255,255,255,0.7),inset_4px_4px_8px_rgba(0,0,0,0.2)] hover:shadow-[inset_-6px_-6px_12px_rgba(255,255,255,0.7),inset_6px_6px_12px_rgba(0,0,0,0.3)]" type="text" placeholder="First name" required />
              <input className="input-field border-2 border-black shadow-[inset_-4px_-4px_8px_rgba(255,255,255,0.7),inset_4px_4px_8px_rgba(0,0,0,0.2)] hover:shadow-[inset_-6px_-6px_12px_rgba(255,255,255,0.7),inset_6px_6px_12px_rgba(0,0,0,0.3)]" type="text" placeholder="Last name" required />
            </div>
            <input className="input-field border-2 border-black shadow-[inset_-4px_-4px_8px_rgba(255,255,255,0.7),inset_4px_4px_8px_rgba(0,0,0,0.2)] hover:shadow-[inset_-6px_-6px_12px_rgba(255,255,255,0.7),inset_6px_6px_12px_rgba(0,0,0,0.3)]" type="email" placeholder="Email" required />
            <div className="relative">
              <select className="input-field border-2 border-black shadow-[inset_-4px_-4px_8px_rgba(255,255,255,0.7),inset_4px_4px_8px_rgba(0,0,0,0.2)] hover:shadow-[inset_-6px_-6px_12px_rgba(255,255,255,0.7),inset_6px_6px_12px_rgba(0,0,0,0.3)]" required>
                <option value="" disabled selected>Select Role</option>
                <option value="learner">Learner</option>
                <option value="content-creator">Content Creator</option>
              </select>
            </div>
            <div className="relative">
              <input
                className={`input-field border-2 border-black shadow-[inset_-4px_-4px_8px_rgba(255,255,255,0.7),inset_4px_4px_8px_rgba(0,0,0,0.2)] hover:shadow-[inset_-6px_-6px_12px_rgba(255,255,255,0.7),inset_6px_6px_12px_rgba(0,0,0,0.3)] ${!passwordsMatch ? 'border-red-500' : ''}`}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                value={password}
                onChange={handlePasswordChange}
              />
              <span
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
                onClick={togglePasswordVisibility}
              >
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  className="text-black text-sm"
                />
              </span>
            </div>
            <div className="relative">
              <input
                className={`input-field border-2 border-black shadow-[inset_-4px_-4px_8px_rgba(255,255,255,0.7),inset_4px_4px_8px_rgba(0,0,0,0.2)] hover:shadow-[inset_-6px_-6px_12px_rgba(255,255,255,0.7),inset_6px_6px_12px_rgba(0,0,0,0.3)] ${!passwordsMatch ? 'border-red-500' : ''}`}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                required
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
              <span
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
                onClick={toggleConfirmPasswordVisibility}
              >
                <FontAwesomeIcon
                  icon={showConfirmPassword ? faEyeSlash : faEye}
                  className="text-black text-sm"
                />
              </span>
              {!passwordsMatch && <span className="text-red-500 text-sm">Passwords do not match</span>}
            </div>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Remember me
            </label>
            <button type="submit" className="create-account-button bg-yellow-500 text-white border-2 border-black border-black">
              Create account
            </button>
          </form>
          {/* <div className="divider">
            <span>or continue with</span>
          </div> */}
          {/* <div className="flex justify-center space-x-4 mt-2">
            <button className="social-button">
              <img src="/src/assets/google-logo.svg" alt="Google" className="h-5 w-5 mr-2" />
              Google
            </button>
            <button className="social-button">
            <img src="/src/assets/Apple_logo_black.svg" alt="Apple" className="h-5 w-5 mr-2" />
              Apple
              </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
