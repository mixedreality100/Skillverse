// SignUpPage.js
import React from 'react';
import { SignUp, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Link } from 'react-router-dom';
import '../App.css';

const SignUpPage2 = () => {
    return (
        <div className="login-container bg-white">
            <div className="bg-white shadow-xl rounded-lg w-full max-w-4xl flex overflow-hidden">
                {/* Left Section (Optional - you can reuse or modify) */}
                <div className="hidden md:flex items-center justify-center bg-gray-100 w-1/2">
                    <img src="/src/assets/MINI.svg" alt="Illustration" className="w-3/4" />
                </div>

                {/* Right Section */}
                <div className="flex flex-col w-full md:w-1/2 p-6 md:p-12">
                    <div className="flex justify-between items-center">
                        <Link to="/">
                            <img src="/src/assets/homeIcon.svg" alt="Home" className="inline-block h-4 w-4 mr-0" />
                        </Link>
                    </div>
                    <div className="form-header">
                        <Link to="/login" className="signup-link">Login</Link>
                    </div>
                    <h1 className="text-2xl font-semibold mt-4 text-black" id="text">Join Us!</h1>
                    <p className="text-gray-500" id="text-1">Create your account</p>

                    <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />

                    <SignedIn>
                        <p>You are signed up and signed in!</p>
                    </SignedIn>
                    <SignedOut>
                        {/* Content for signed out users on signup page */}
                    </SignedOut>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage2;