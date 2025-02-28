import React, { useEffect } from "react"; // Import useEffect
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import NavButton from './NavButton';
import ProfileButton from "./profile";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import skillverselogo from "../assets/skillverse.svg";

const CourseOverview = () => {
  const { courseId } = useParams(); // Access the courseId from the URL
  const navigate = useNavigate(); // Use the useNavigate hook

  // Function to handle the Enroll button click
  const handleEnrollClick = () => {
    if (courseId) {
      navigate(`/plants/${courseId}`); // Navigate to the Plants page with the courseId
    } else {
      console.error("Course ID is undefined");
    }
  };

  // Use this effect with higher priority to force scroll to top
  useEffect(() => {
    // Force immediate scroll to top right when component mounts
    window.scrollTo(0, 0);
    // Add a slight delay as a fallback in case the immediate scroll didn't work
    const scrollTimer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
    }, 50);
    return () => clearTimeout(scrollTimer);
  }, []);

  return (
    <div className="flex flex-col items-center px-5 pt-7">
      <nav className="flex justify-between items-center w-full max-w-[1274px]">
        <img
          src={skillverselogo}
          alt="logo"
          className="w-[58px] aspect-square left-[30px]"
        />
        <div className="flex gap-9">
          <NavButton
            className="transform transition-transform duration-300 hover:scale-110 text-black"
            onClick={() => {
              navigate('/');
              setTimeout(() => {
                const coursesSection = document.getElementById('courses');
                if (coursesSection) {
                  coursesSection.scrollIntoView({ behavior: 'smooth' });
                }
              }, 100);
            }}
          >
            Courses
          </NavButton>
          <NavButton
            className="transform transition-transform duration-300 hover:scale-110 text-black"
            onClick={() => navigate('/explore')}
          >
            Explore
          </NavButton>
         
          <NavButton
            className="transform transition-transform duration-300 hover:scale-110 text-black"
            onClick={() => navigate('/aboutus')}
          >
            About Us
          </NavButton>
        </div>
        <div className="flex items-center gap-5">
          <SignedOut>
            <SignInButton>
              <button className="text-black transform transition-transform duration-300 hover:scale-110 rounded-full border-2 border-black px-8 py-3">
                Login
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <ProfileButton onClick={() => signOut()} />
          </SignedIn>
        </div>
      </nav>
      {/* Enroll Button */}
      <div className="absolute top-[500px] right-[150px]">
        <button
          className="text-white text-3xl bg-blue-500 transform-transition duration-300 hover:scale-110 rounded-10 border-2 border-white px-36 py-8"
          onClick={handleEnrollClick} // Add onClick handler
        >
          Enroll now
        </button>
      </div>
      {/* Display course details here */}
      <h1>Course Overview</h1>
      <p>Course ID: {courseId}</p>
      {/* Render additional course details here */}
     
      {/* Footer section - changed from absolute to relative positioning */}
      <div className="relative mt-[570px] mx-auto w-[100%]">
        <div className="relative w-full h-[440px] bg-[url('https://cdn.animaapp.com/projects/66fe7ba2df054d0dfb35274e/releases/676d6d16be8aa405f53530bc/img/hd-wallpaper-anatomy-human-anatomy-1.png')] bg-cover">
          <div className="absolute top-[252px] left-[23px] right-[23px] h-[178px] bg-white rounded-[12px]">
            <div className="flex justify-center space-x-4 mt-4">
              {/* Instagram Button */}
              <button
                className="w-48 h-11 bg-white border border-black rounded-full hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-yellow-500 hover:text-white hover:scale-105 transition duration-200"
                onClick={() => (window.location.href = "https://www.instagram.com")}
              >
                Instagram
              </button>
              {/* Twitter Button */}
              <button
                className="w-48 h-11 bg-white border border-black rounded-full hover:bg-black hover:text-white hover:scale-105 transition duration-200"
                onClick={() => (window.location.href = "https://www.twitter.com")}
              >
                Twitter
              </button>
              {/* Facebook Button */}
              <button
                className="w-48 h-11 bg-white border border-black rounded-full hover:bg-blue-500 hover:text-white hover:scale-105 transition duration-200"
                onClick={() => (window.location.href = "https://www.facebook.com")}
              >
                Facebook
              </button>
              {/* Pinterest Button */}
              <button
                className="w-48 h-11 bg-white border border-black rounded-full hover:bg-red-500 hover:text-white hover:scale-105 transition duration-200"
                onClick={() => (window.location.href = "https://www.pinterest.com")}
              >
                Pinterest
              </button>
            </div>
            <div className="mt-4 border-t border-gray-300"></div>
            <div className="text-center mt-2">
              <p className="text-xl text-gray-800">
                © 2024, All Rights Reserved
              </p>
            </div>
          </div>
          <p className="absolute top-[40px] left-0 right-0 text-[64px] font-normal text-center text-white">
            Be the one with
            <span className="text-red-500"> Nat</span>
            <span className="text-[#B9DE00]">ur</span>
            <span className="text-red-500">e</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CourseOverview;