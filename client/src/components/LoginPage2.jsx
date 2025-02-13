import React from 'react';
import { SignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Link, useNavigate } from 'react-router-dom';
import '../App.css'; // Assuming your global CSS file is still in the same location
import { FaUserCircle } from 'react-icons/fa';

const LoginPage2 = () => {
    const navigate = useNavigate();

    const handleLearnerDashboard = () => {
        navigate('/learner-dashboard'); // Keep your Learner Dashboard navigation
    };

    return (
        <div className="login-container bg-white">
            {/* Learner Dashboard Button Outside the Box */}
            <button
                className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 absolute top-4 right-4 z-10"
                onClick={handleLearnerDashboard}
            >
                Learner Dashboard
            </button>

            <div className="bg-white shadow-xl rounded-lg w-full max-w-4xl flex overflow-hidden">
                {/* Left Section - Keeping your image section */}
                <div className="hidden md:flex items-center justify-center bg-gray-100 w-1/2">
                    <img src="/src/assets/MINI.svg" alt="Illustration" className="w-3/4" />
                </div>

                {/* Right Section - Replaced with Clerk SignIn */}
                <div className="flex flex-col w-full md:w-1/2 p-6 md:p-12">
                    <div className="flex justify-between items-center">
                        <Link to="/">
                            <img src="/src/assets/homeIcon.svg" alt="Home" className="inline-block h-4 w-4 mr-0" />
                        </Link>
                        <Link to="#">
                            <FaUserCircle className="w-5 h-5 text-black hover:scale-110 transition-transform duration-200" />
                        </Link>
                    </div>
                    <div className="form-header">
                        <Link to="/signup" className="signup-link">Sign up</Link> {/* You might want to link to your SignUpPage component if you created one with <SignUp /> */}
                    </div>
                    <h1 className="text-2xl font-semibold mt-4 text-black" id="text">Welcome back!</h1>
                    <p className="text-gray-500" id="text-1">Please enter your details</p>

                    {/* **Clerk SignIn Component** */}
                    <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" /> {/* Basic SignIn setup */}

                    {/* Optional:  Show messages when signed in/out for testing */}
                    <SignedIn>
                        <p>You are signed in!</p>
                    </SignedIn>
                    <SignedOut>
                        {/* Content when signed out, if needed */}
                    </SignedOut>

                </div>
            </div>
        </div>
    );
};

export default LoginPage2;