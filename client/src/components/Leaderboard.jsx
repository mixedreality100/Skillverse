import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import backArrow from "../assets/skillverse.svg";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import ProfileButton from "./profile";
import Loader from "./Loader"; // Import the Loader component
import goldcrown from "../assets/GoldCrown.png";
import silvercrown from "../assets/silvercrown.png";
import browncrown from "../assets/browncrown.png";


export const Leaderboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // State to manage loading

  // Simulate loading with a timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Set loading to false after 2 seconds
    }, 1500);

    return () => clearTimeout(timer); // Cleanup timer
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

  // Render the Loader while loading is true
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-row justify-center w-full bg-white">
      <div className="bg-[#ffffff] overflow-x-hidden w-[1440px] relative rounded-lg">
        {/* Navigation Section */}
        <div className="relative w-[1426px]">
          <div className="absolute top-[22px] left-[30px] w-[60px] h-[60px]">
            <img
              className="w-[58px] aspect-square"
              alt="Back Arrow"
              src={backArrow}
              onClick={() => navigate("/")}
            />
          </div>

          <div className="flex gap-9">
            <button
              className="absolute top-[30px] left-[550px] px-5 py-4 whitespace-nowrap border-2 border-black border-solid bg-zinc-50 rounded-[100px] text-xs text-black transform transition-transform duration-300 hover:scale-110"
              onClick={handleCourseClick}
            >
              Courses
            </button>

            <button
              className="absolute top-[30px] left-[659px] px-5 py-4 whitespace-nowrap border-2 border-black border-solid bg-zinc-50 rounded-[100px] text-xs text-black transform transition-transform duration-300 hover:scale-110"
              onClick={() => navigate("/explore")}
            >
              Explore
            </button>

            <button
              className="absolute top-[30px] left-[762px] px-5 py-4 whitespace-nowrap border-2 border-black border-solid bg-zinc-50 rounded-[100px] text-xs text-black transform transition-transform duration-300 hover:scale-110"
              onClick={() => navigate("/aboutus")}
            >
              About Us
            </button>

            <div className="absolute top-[30px] left-[1270px]">
              <SignedOut>
                <SignInButton>
                  <button className="text-black transform transition-transform duration-300 hover:scale-110 rounded-full border-2 border-black px-8 py-3">
                    Login
                  </button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <ProfileButton />
              </SignedIn>
            </div>
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="relative mt-[200px] mx-[50px] w-[93%]">
          <div>
            <style>
              {`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
              `}
            </style>
            <div className="text-center text-[#000000] text-[100px] font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif', marginTop: '6' }}>
              Leaderboard
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="mt-8 text-2xl text-center">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-400 px-8 py-4">Rank</th>
                  <th className="border border-gray-400 px-8 py-4">Profile Photo</th>
                  <th className="border border-gray-400 px-8 py-4">Name</th>
                  <th className="border border-gray-400 px-8 py-4">Score</th>
                  <th className="border border-gray-400 px-8 py-4">Badges</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-400 px-8 py-4">1</td>
                  <td className="border border-gray-400 px-8 py-4"></td>
                  <td className="border border-gray-400 px-8 py-4">Dylan Frias 
                    <img 
                    src={goldcrown} 
                    alt="Golden crown" 
                    className="w-16 h-16 inline-block"
                    /></td>
                  <td className="border border-gray-400 px-8 py-4">30</td>
                  <td className="border border-gray-400 px-8 py-4"></td>
                </tr>
                <tr>
                  <td className="border border-gray-400 px-8 py-4">2</td>
                  <td className="border border-gray-400 px-8 py-4"></td>
                  <td className="border border-gray-400 px-8 py-4">Muskan Khatoon
                  <img 
                    src={silvercrown} 
                    alt="Silver crown" 
                    className="w-8 h-8 inline-block"
                    />
                  </td>
                  <td className="border border-gray-400 px-8 py-4">24</td>
                  <td className="border border-gray-400 px-8 py-4"></td>
                </tr>
                <tr>
                  <td className="border border-gray-400 px-8 py-4">3</td>
                  <td className="border border-gray-400 px-8 py-4"></td>
                  <td className="border border-gray-400 px-8 py-4">Prachi Prabhu
                  <img 
                    src={browncrown} 
                    alt="brown crown" 
                    className="w-8 h-8 inline-block"
                    />
                  </td>
                  <td className="border border-gray-400 px-8 py-4">21</td>
                  <td className="border border-gray-400 px-8 py-4"></td>
                </tr>
                <tr>
                  <td className="border border-gray-400 px-8 py-4">4</td>
                  <td className="border border-gray-400 px-8 py-4"></td>
                  <td className="border border-gray-400 px-8 py-4">Eshan Biswas</td>
                  <td className="border border-gray-400 px-8 py-4">16</td>
                  <td className="border border-gray-400 px-8 py-4"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer section */}
        <div className="relative mt-[250px] mx-auto w-[98%]">
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
    </div>
  );
};