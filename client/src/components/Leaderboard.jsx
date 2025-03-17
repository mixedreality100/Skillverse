import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import backArrow from "../assets/skillverse.svg";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import ProfileButton from "./profile";
import Loader from "./Loader";
import goldcrown from "../assets/GoldCrown.png";
import silvercrown from "../assets/silvercrown.png";
import browncrown from "../assets/browncrown.png";

export const Leaderboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    // Fetch top 3 users from the API
    fetch('http://localhost:3000/api/top-rewards')
      .then(response => response.json())
      .then(data => setTopUsers(data))
      .catch(error => console.error('Error fetching top rewards:', error));

    return () => clearTimeout(timer);
  }, []);

  const handleCourseClick = () => {
    navigate("/");
    setTimeout(() => {
      const coursesSection = document.getElementById("courses");
      if (coursesSection) {
        coursesSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-row justify-center w-full bg-white">
      <div className="bg-[#ffffff] overflow-x-hidden w-full max-w-[1440px] relative rounded-lg">
        {/* Navigation Section */}
        <div className="relative w-full px-4 md:px-8 lg:w-[1426px]">
          <div className="absolute top-[22px] left-[30px] w-[60px] h-[60px] z-10">
            <img
              className="w-[58px] aspect-square cursor-pointer"
              alt="Back Arrow"
              src={backArrow}
              onClick={() => navigate("/")}
            />
          </div>

          {/* Hamburger Menu for Mobile */}
          <div className="md:hidden absolute top-[30px] right-[30px] z-20">
            <button 
              onClick={toggleMobileMenu}
              className="p-2 focus:outline-none"
              style={{
                boxShadow: "5px 5px 10px #d1d1d1, -5px -5px 10px #ffffff",
                borderRadius: "50%",
                border: "0.5px solid rgba(0, 0, 0, 0.1)",
              }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-8 w-8" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-[80px] right-[20px] z-30 bg-white shadow-lg rounded-lg p-4 w-[200px]">
              <div className="flex flex-col space-y-4">
                <button
                  className="px-4 py-2 whitespace-nowrap bg-zinc-50 rounded-[100px] text-sm text-black"
                  style={{
                    boxShadow: "5px 5px 10px #d1d1d1, -5px -5px 10px #ffffff",
                    border: "0.5px solid rgba(0, 0, 0, 0.1)",
                  }}
                  onClick={handleCourseClick}
                >
                  Courses
                </button>
                <button
                  className="px-4 py-2 whitespace-nowrap bg-zinc-50 rounded-[100px] text-sm text-black"
                  style={{
                    boxShadow: "5px 5px 10px #d1d1d1, -5px -5px 10px #ffffff",
                    border: "0.5px solid rgba(0, 0, 0, 0.1)",
                  }}
                  onClick={() => navigate("/explore")}
                >
                  Explore
                </button>
                <button
                  className="px-4 py-2 whitespace-nowrap bg-zinc-50 rounded-[100px] text-sm text-black"
                  style={{
                    boxShadow: "5px 5px 10px #d1d1d1, -5px -5px 10px #ffffff",
                    border: "0.5px solid rgba(0, 0, 0, 0.1)",
                  }}
                  onClick={() => navigate("/aboutus")}
                >
                  About Us
                </button>
                <div>
                  <SignedOut>
                    <SignInButton>
                      <button
                        className="text-black w-full text-sm rounded-full px-4 py-2"
                        style={{
                          boxShadow: "5px 5px 10px #d1d1d1, -5px -5px 10px #ffffff",
                          border: "0.5px solid rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        Login
                      </button>
                    </SignInButton>
                  </SignedOut>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:gap-6 lg:gap-24 justify-center lg:justify-start">
            <button
              className="lg:absolute lg:top-[30px] lg:left-[550px] px-3 py-3 md:px-4 md:py-3 lg:px-5 lg:py-4 whitespace-nowrap bg-zinc-50 rounded-[100px] text-sm lg:text-base text-black transform transition-transform duration-300 hover:scale-110"
              style={{
                boxShadow: "5px 5px 10px #d1d1d1, -5px -5px 10px #ffffff",
                border: "0.5px solid rgba(0, 0, 0, 0.1)",
              }}
              onClick={handleCourseClick}
            >
              Courses
            </button>
            <button
              className="lg:absolute lg:top-[30px] lg:left-[659px] px-3 py-3 md:px-4 md:py-3 lg:px-5 lg:py-4 whitespace-nowrap bg-zinc-50 rounded-[100px] text-sm lg:text-base text-black transform transition-transform duration-300 hover:scale-110"
              style={{
                boxShadow: "5px 5px 10px #d1d1d1, -5px -5px 10px #ffffff",
                border: "0.5px solid rgba(0, 0, 0, 0.1)",
              }}
              onClick={() => navigate("/explore")}
            >
              Explore
            </button>
            <button
              className="lg:absolute lg:top-[30px] lg:left-[762px] px-3 py-3 md:px-4 md:py-3 lg:px-5 lg:py-4 whitespace-nowrap bg-zinc-50 rounded-[100px] text-sm lg:text-base text-black transform transition-transform duration-300 hover:scale-110"
              style={{
                boxShadow: "5px 5px 10px #d1d1d1, -5px -5px 10px #ffffff",
                border: "0.5px solid rgba(0, 0, 0, 0.1)",
              }}
              onClick={() => navigate("/aboutus")}
            >
              About Us
            </button>
            <div className="hidden lg:block lg:absolute lg:top-[30px] lg:left-[1270px]">
              <SignedOut>
                <SignInButton>
                  <button
                    className="text-black transform transition-transform duration-300 hover:scale-110 rounded-full px-8 py-3"
                    style={{
                      boxShadow: "5px 5px 10px #d1d1d1, -5px -5px 10px #ffffff",
                      border: "0.5px solid rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    Login
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <ProfileButton />
              </SignedIn>
            </div>
          </div>
          
          {/* Mobile Login Button (only shown when menu is closed) */}
          <div className="md:hidden absolute top-[30px] right-[80px] z-10">
            {!isMobileMenuOpen && (
              <SignedOut>
                <SignInButton>
                  <button
                    className="text-black text-sm rounded-full px-4 py-2"
                    style={{
                      boxShadow: "5px 5px 10px #d1d1d1, -5px -5px 10px #ffffff",
                      border: "0.5px solid rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    Login
                  </button>
                </SignInButton>
              </SignedOut>
            )}
            <SignedIn>
              <ProfileButton />
            </SignedIn>
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="relative mt-[120px] md:mt-[150px] lg:mt-[200px] mx-4 sm:mx-[30px] md:mx-[40px] lg:mx-[50px] w-auto max-w-full lg:w-[93%]">
          <div>
            <style>
              {`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
              `}
            </style>
            <div className="text-center text-[#000000] text-4xl sm:text-5xl md:text-6xl lg:text-[70px] xl:text-[100px] font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif', marginTop: '6' }}>
              Leaderboard
            </div>
          </div>

          {/* Leaderboard Table - Responsive */}
          <div className="mt-8 text-base sm:text-lg md:text-xl lg:text-2xl text-center overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-400 px-2 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4" style={{ boxShadow: "3px 3px 6px #d1d1d1, -3px -3px 6px #ffffff" }}>Rank</th>
                  <th className="border border-gray-400 px-2 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4" style={{ boxShadow: "3px 3px 6px #d1d1d1, -3px -3px 6px #ffffff" }}>Name</th>
                  <th className="border border-gray-400 px-2 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4" style={{ boxShadow: "3px 3px 6px #d1d1d1, -3px -3px 6px #ffffff" }}>Score</th>
                </tr>
              </thead>
              <tbody>
                {/* If we have data from API, use it, otherwise use fallback */}
                {topUsers.length > 0 ? (
                  topUsers.map((user, index) => (
                    <tr key={index}>
                      <td className="border border-gray-400 px-2 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4" style={{ boxShadow: "3px 3px 6px #d1d1d1, -3px -3px 6px #ffffff" }}>{index + 1}</td>
                      <td className="border border-gray-400 px-2 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4" style={{ boxShadow: "3px 3px 6px #d1d1d1, -3px -3px 6px #ffffff" }}>
                        {user.name}
                        {index === 0 && (
                          <img 
                            src={goldcrown} 
                            alt="Golden crown" 
                            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 inline-block ml-2"
                          />
                        )}
                        {index === 1 && (
                          <img 
                            src={silvercrown} 
                            alt="Silver crown" 
                            className="w-4 h-4 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 inline-block ml-2"
                          />
                        )}
                        {index === 2 && (
                          <img 
                            src={browncrown} 
                            alt="Brown crown" 
                            className="w-4 h-4 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 inline-block ml-2"
                          />
                        )}
                      </td>
                      <td className="border border-gray-400 px-2 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4" style={{ boxShadow: "3px 3px 6px #d1d1d1, -3px -3px 6px #ffffff" }}>{user.points_earned}</td>
                    </tr>
                  ))
                ) : (
                  // Fallback data
                  <>
                    <tr>
                      <td className="border border-gray-400 px-2 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4" style={{ boxShadow: "3px 3px 6px #d1d1d1, -3px -3px 6px #ffffff" }}>1</td>
                      <td className="border border-gray-400 px-2 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4" style={{ boxShadow: "3px 3px 6px #d1d1d1, -3px -3px 6px #ffffff" }}>
                        User01
                        <img 
                          src={goldcrown} 
                          alt="Golden crown" 
                          className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 inline-block ml-2"
                        />
                      </td>
                      <td className="border border-gray-400 px-2 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4" style={{ boxShadow: "3px 3px 6px #d1d1d1, -3px -3px 6px #ffffff" }}>30</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 px-2 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4" style={{ boxShadow: "3px 3px 6px #d1d1d1, -3px -3px 6px #ffffff" }}>2</td>
                      <td className="border border-gray-400 px-2 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4" style={{ boxShadow: "3px 3px 6px #d1d1d1, -3px -3px 6px #ffffff" }}>
                        User02
                        <img 
                          src={silvercrown} 
                          alt="Silver crown" 
                          className="w-4 h-4 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 inline-block ml-2"
                        />
                      </td>
                      <td className="border border-gray-400 px-2 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4" style={{ boxShadow: "3px 3px 6px #d1d1d1, -3px -3px 6px #ffffff" }}>24</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 px-2 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4" style={{ boxShadow: "3px 3px 6px #d1d1d1, -3px -3px 6px #ffffff" }}>3</td>
                      <td className="border border-gray-400 px-2 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4" style={{ boxShadow: "3px 3px 6px #d1d1d1, -3px -3px 6px #ffffff" }}>
                        User03
                        <img 
                          src={browncrown} 
                          alt="Brown crown" 
                          className="w-4 h-4 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 inline-block ml-2"
                        />
                      </td>
                      <td className="border border-gray-400 px-2 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4" style={{ boxShadow: "3px 3px 6px #d1d1d1, -3px -3px 6px #ffffff" }}>21</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer section - Made responsive */}
        <div className="relative mt-[150px] sm:mt-[200px] md:mt-[250px] mx-auto w-[95%] sm:w-[96%] md:w-[97%] lg:w-[98%]">
          <div className="relative w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[440px] bg-[url('https://cdn.animaapp.com/projects/66fe7ba2df054d0dfb35274e/releases/676d6d16be8aa405f53530bc/img/hd-wallpaper-anatomy-human-anatomy-1.png')] bg-cover">
            <div className="absolute top-[180px] sm:top-[210px] md:top-[230px] lg:top-[252px] left-[10px] sm:left-[15px] md:left-[20px] lg:left-[23px] right-[10px] sm:right-[15px] md:right-[20px] lg:right-[23px] h-[150px] sm:h-[160px] md:h-[170px] lg:h-[178px] bg-white rounded-[12px]">
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:space-x-4 mt-4">
                {/* Instagram Button */}
                <button
                  className="w-36 sm:w-40 md:w-44 lg:w-48 h-9 sm:h-10 lg:h-11 text-sm md:text-base bg-white border border-black rounded-full hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-yellow-500 hover:text-white hover:scale-105 transition duration-200"
                  style={{
                    boxShadow: "5px 5px 10px #d1d1d1, -5px -5px 10px #ffffff",
                    border: "0.5px solid rgba(0, 0, 0, 0.1)",
                  }}
                  onClick={() => (window.location.href = "https://www.instagram.com")}
                >
                  Instagram
                </button>

                {/* Twitter Button */}
                <button
                  className="w-36 sm:w-40 md:w-44 lg:w-48 h-9 sm:h-10 lg:h-11 text-sm md:text-base bg-white border border-black rounded-full hover:bg-black hover:text-white hover:scale-105 transition duration-200"
                  style={{
                    boxShadow: "5px 5px 10px #d1d1d1, -5px -5px 10px #ffffff",
                    border: "0.5px solid rgba(0, 0, 0, 0.1)",
                  }}
                  onClick={() => (window.location.href = "https://www.twitter.com")}
                >
                  Twitter
                </button>

                {/* Facebook Button */}
                <button
                  className="w-36 sm:w-40 md:w-44 lg:w-48 h-9 sm:h-10 lg:h-11 text-sm md:text-base bg-white border border-black rounded-full hover:bg-blue-500 hover:text-white hover:scale-105 transition duration-200"
                  style={{
                    boxShadow: "5px 5px 10px #d1d1d1, -5px -5px 10px #ffffff",
                    border: "0.5px solid rgba(0, 0, 0, 0.1)",
                  }}
                  onClick={() => (window.location.href = "https://www.facebook.com")}
                >
                  Facebook
                </button>

                {/* Pinterest Button */}
                <button
                  className="w-36 sm:w-40 md:w-44 lg:w-48 h-9 sm:h-10 lg:h-11 text-sm md:text-base bg-white border border-black rounded-full hover:bg-red-500 hover:text-white hover:scale-105 transition duration-200"
                  style={{
                    boxShadow: "5px 5px 10px #d1d1d1, -5px -5px 10px #ffffff",
                    border: "0.5px solid rgba(0, 0, 0, 0.1)",
                  }}
                  onClick={() => (window.location.href = "https://www.pinterest.com")}
                >
                  Pinterest
                </button>
              </div>

              <div className="mt-4 border-t border-gray-300"></div>

              <div className="text-center mt-2">
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-800">
                  © 2024, All Rights Reserved
                </p>
              </div>
            </div>

            <p className="absolute top-[20px] sm:top-[25px] md:top-[30px] lg:top-[40px] left-0 right-0 text-2xl sm:text-3xl md:text-5xl lg:text-[64px] font-normal text-center text-white">
              Be the one with
              <span className="text-red-500"> Nat</span>
              <span className="text-[#B9DE00]">ur</span>
              <span className="text-red-500">e</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};