import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import backArrow from "../assets/skillverse.svg";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/clerk-react";
import ProfileButton from "./profile";
import Loader from "./Loader";
import medicinalhero from "../plantsAssets/image3.jpg";
// Import social media logos from src/assets
import instagramLogo from "../assets/instagram.png";
import twitterLogo from "../assets/twitter.png";
import facebookLogo from "../assets/facebook.png";
import pinterestLogo from "../assets/pinterest.png";
// Import NavButton
import NavButton from "./NavButton"; // Adjust the path based on your project structure

export const Plants = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [courseDetails, setCourseDetails] = useState(null);
  const [modules, setModules] = useState([]);
  const [error, setError] = useState(null);
  const [isEnrollPopupOpen, setIsEnrollPopupOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [completedPopupOpen, setCompletedPopupOpen] = useState(false);
  const pageRef = useRef(null);
  const sidebarRef = useRef(null);

  // Fetch userId using Clerk's useUser hook
  const { user } = useUser();

  useEffect(() => {
    const fetchUserId = async () => {
      if (user && user.primaryEmailAddress) {
        try {
          const response = await fetch(
            `http://localhost:3000/api/user-id?email=${user.primaryEmailAddress.emailAddress}`
          );
          if (response.ok) {
            const { userId } = await response.json();
            setUserId(userId);
          } else {
            console.error("Failed to fetch user ID");
          }
        } catch (error) {
          console.error("Error fetching user ID:", error);
        }
      }
    };

    fetchUserId();
  }, [user]);

  // Force scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);

    const scrollTimer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
    }, 50);

    return () => clearTimeout(scrollTimer);
  }, []);

  // Fetch course details
  useEffect(() => {
    const fetchCourseDetails = async () => {
      setLoading(true);
      try {
        const courseResponse = await fetch(
          `http://localhost:3000/courses/${courseId}`
        );
        if (!courseResponse.ok) {
          throw new Error(`HTTP error! status: ${courseResponse.status}`);
        }
        const courseData = await courseResponse.json();

        const modulesResponse = await fetch(
          `http://localhost:3000/modules/${courseId}`
        );
        if (!modulesResponse.ok) {
          throw new Error(`HTTP error! status: ${modulesResponse.status}`);
        }
        const modulesData = await modulesResponse.json();

        setCourseDetails(courseData);
        setModules(modulesData);
      } catch (error) {
        console.error("Error fetching course details:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  const handleEnrollClick = async () => {
    if (!userId) {
      console.error("User ID is not available. Please log in.");
      return;
    }

    try {
      // Get the next incomplete module for this course
      const nextModuleResponse = await fetch(
        `http://localhost:3000/api/next-incomplete-module/${userId}/${courseId}`
      );

      if (!nextModuleResponse.ok) {
        throw new Error(`HTTP error! status: ${nextModuleResponse.status}`);
      }

      const nextModuleData = await nextModuleResponse.json();

      if (nextModuleData.completed) {
        // All modules are completed, show popup to restart from first module
        setCompletedPopupOpen(true);
        return;
      }

      // Navigate to the next incomplete module
      navigate(`/aloepage/${nextModuleData.nextModuleId}`, {
        state: {
          fromApp: true,
          isFirstModule: nextModuleData.isFirstModule,
        },
      });
    } catch (error) {
      console.error("Error determining next module:", error);
      setError(error.message);
    }
  };

  const handleRestartCourse = async () => {
    if (!modules.length) return;

    // Navigate to the first module of the course
    const firstModuleId = modules[0].id;
    navigate(`/aloepage/${firstModuleId}`, {
      state: {
        fromApp: true,
        isFirstModule: true,
        restartingCourse: true,
      },
    });

    // Close the completed popup
    setCompletedPopupOpen(false);
  };

  const handleCourseClick = () => {
    navigate("/");
    setTimeout(() => {
      const coursesSection = document.getElementById("courses");
      if (coursesSection) {
        coursesSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleEnrollNow = async (moduleId) => {
    setIsEnrollPopupOpen(false);
    navigate(`/aloepage/${moduleId}`);
  };

  const handleCancel = () => {
    setIsEnrollPopupOpen(false);
  };

  const renderCompletedPopup = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Course Completed!</h2>
          <p className="mb-6">
            Congratulations! You've completed all modules in this course. Would
            you like to start over?
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleRestartCourse}
              className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition"
            >
              Restart Course
            </button>
            <button
              onClick={() => setCompletedPopupOpen(false)}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-full hover:bg-gray-300 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-row justify-center w-full bg-white">
      <div className="bg-[#ffffff] overflow-x-hidden w-full max-w-[1440px] relative rounded-lg">
        {/* Hero Section */}
        <div className="relative w-full h-auto md:h-[824px]">
          {/* Hero Image */}
          <div className="relative w-full">
            <img
              src={
                courseDetails?.course_image
                  ? `data:image/jpeg;base64,${courseDetails.course_image}`
                  : medicinalhero
              }
              alt="Hero image"
              className="absolute top-[105px] left-0 w-full h-[300px] md:h-[580px] opacity-100 z-0 rounded-[20px] object-cover blur-sm"
            />
          </div>

          {/* Back Button */}
          <div className="absolute top-[22px] left-[15px] md:left-[30px] w-[40px] md:w-[60px] h-[40px] md:h-[60px] z-10">
            <img
              className="w-full aspect-square cursor-pointer"
              alt="Back Arrow"
              src={backArrow}
              onClick={() => navigate("/")}
            />
          </div>

          {/* Mobile Menu Button and Login Button Container */}
          <div className="absolute top-[22px] right-[15px] md:hidden z-20 flex items-center gap-2">
            {/* Login Button */}
            <div>
              <SignedOut>
                <SignInButton>
                  <button
                    className="px-4 py-2 whitespace-nowrap bg-[#f0f0f0] rounded-[100px] text-sm text-black"
                    style={{
                      boxShadow: "4px 4px 8px #d1d1d1, -4px -4px 8px #ffffff",
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

            {/* Menu Toggle Button */}
            <button
              onClick={toggleMenu}
              className="p-2 bg-[#f0f0f0] rounded-full shadow-neo"
              style={{
                boxShadow: "4px 4px 8px #d1d1d1, -4px -4px 8px #ffffff",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    menuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>

          {/* Mobile Sidebar */}
          <div
            ref={sidebarRef}
            className={`fixed top-0 right-0 h-full w-64 bg-white z-30 transform transition-transform duration-300 ease-in-out ${
              menuOpen ? "translate-x-0" : "translate-x-full"
            } md:hidden`}
            style={{ boxShadow: "-4px 0 8px rgba(0, 0, 0, 0.1)" }}
          >
            {/* Close Button */}
            <button onClick={toggleMenu} className="absolute top-4 right-4 p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Sidebar Content */}
            <div className="flex flex-col space-y-4 p-4 mt-12">
              <NavButton
                path="#courses"
                className="px-4 py-2 whitespace-nowrap bg-[#f0f0f0] rounded-[100px] text-sm text-black transform transition-transform duration-300 hover:scale-110"
                style={{
                  boxShadow: "4px 4px 8px #d1d1d1, -4px -4px 8px #ffffff",
                }}
                onClick={() => {
                  handleCourseClick();
                  toggleMenu();
                }}
              >
                Courses
              </NavButton>
              <NavButton
                className="px-4 py-2 whitespace-nowrap bg-[#f0f0f0] rounded-[100px] text-sm text-black transform transition-transform duration-300 hover:scale-110"
                style={{
                  boxShadow: "4px 4px 8px #d1d1d1, -4px -4px 8px #ffffff",
                }}
                onClick={() => {
                  navigate("/explore");
                  toggleMenu();
                }}
              >
                Explore
              </NavButton>
              <NavButton
                className="px-4 py-2 whitespace-nowrap bg-[#f0f0f0] rounded-[100px] text-sm text-black transform transition-transform duration-300 hover:scale-110"
                style={{
                  boxShadow: "4px 4px 8px #d1d1d1, -4px -4px 8px #ffffff",
                }}
                onClick={() => {
                  navigate("/aboutus");
                  toggleMenu();
                }}
              >
                About Us
              </NavButton>
            </div>
          </div>

          {/* Course Title */}
          <div>
            <style>
              {`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
              `}
            </style>
            <div
              className="absolute top-[240px] md:top-[420px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-light text-[#FFD700] text-[100px] md:text-[270px] text-center tracking-[1.71px] leading-[0.8] drop-shadow-[2px_2px_4px_rgba(0,0,0,0.5)]"
              style={{ fontFamily: "Bebas Neue, Helvetica" }}
            >
              {courseDetails?.course_name || ""}
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-4 md:gap-16 ml-[32%] py-[25px]">
            <NavButton
              path="#courses"
              className="absolute top-[30px] left-[550px] px-3 md:px-5 py-2 md:py-4 whitespace-nowrap bg-[#f0f0f0] rounded-[100px] text-xs md:text-sm text-black transform transition-transform duration-300 hover:scale-110 shadow-neo"
              style={{
                boxShadow: "8px 8px 16px #d1d1d1, -8px -8px 16px #ffffff",
              }}
              onClick={handleCourseClick}
            >
              Courses
            </NavButton>
            <NavButton
              className="absolute top-[30px] left-[659px] px-3 md:px-5 py-2 md:py-4 whitespace-nowrap bg-[#f0f0f0] rounded-[100px] text-xs md:text-sm text-black transform transition-transform duration-300 hover:scale-110 shadow-neo"
              style={{
                boxShadow: "8px 8px 16px #d1d1d1, -8px -8px 16px #ffffff",
              }}
              onClick={() => navigate("/explore")}
            >
              Explore
            </NavButton>
            <NavButton
              className="absolute top-[30px] left-[762px] px-3 md:px-5 py-2 md:py-4 whitespace-nowrap bg-[#f0f0f0] rounded-[100px] text-xs md:text-sm text-black transform transition-transform duration-300 hover:scale-110 shadow-neo"
              style={{
                boxShadow: "8px 8px 16px #d1d1d1, -8px -8px 16px #ffffff",
              }}
              onClick={() => navigate("/aboutus")}
            >
              About Us
            </NavButton>
            <div className="absolute top-[30px] left-[1150px] md:left-[1270px]">
              <SignedOut>
                <SignInButton>
                  <button
                    className="text-black transform transition-transform duration-300 hover:scale-110 rounded-full px-4 md:px-8 py-2 md:py-3 bg-[#f0f0f0] shadow-neo"
                    style={{
                      boxShadow: "8px 8px 16px #d1d1d1, -8px -8px 16px #ffffff",
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
        </div>

        {/* Modules Section */}
        <div
          id="categories-section"
          className="relative mt-[500px] md:mt-[-10px] mx-[20px] md:mx-[50px] w-[90%]"
        >
          <div>
            <style>
              {`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
              `}
            </style>
            <div
              className="text-left text-[#000000] text-[48px] md:text-[100px] font-bold mb-4"
              style={{ fontFamily: "Poppins, sans-serif", marginTop: "3" }}
            >
              Modules
            </div>
          </div>

          {/* Plant Cards with Responsive Layout */}
          <div
            className="mt-8 md:mt-12 overflow-x-auto scrollbar-hide cards-container w-full"
            style={{ scrollBehavior: "smooth" }}
          >
            <div className="flex flex-col md:flex-row md:space-x-5 space-y-4 md:space-y-0 md:min-w-max">
              {modules.map((module, index) => (
                <div
                  key={module.id}
                  onClick={() => handleEnrollClick(module.id)}
                  className="module-card relative w-full md:w-[273px] h-[200px] md:h-[374px] bg-cover md:hover:w-[400px] lg:hover:w-[692px] transition-all duration-300 rounded-[20px] md:rounded-[30px] shadow-neo"
                  style={{
                    boxShadow: "4px 4px 8px #d1d1d1, -4px -4px 8px #ffffff",
                  }}
                >
                  <img
                    className="absolute top-0 left-0 w-full h-full object-cover rounded-[20px] md:rounded-[30px] cursor-pointer"
                    alt={module.module_title}
                    src={module.module_image || "/path/to/default/image.png"}
                  />
                  <div
                    className="absolute inset-0 flex items-center justify-center text-white text-[24px] md:text-[35px] font-bold bg-black bg-opacity-40 p-2 md:p-4 rounded-md"
                    style={{ fontFamily: "'Paytone One', sans-serif" }}
                  >
                    {module.module_name || "No Title"}
                  </div>
                  <div
                    className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-2 text-xs md:text-sm description-overlay"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {module.description || "No Description"}
                  </div>
                  {/* Inline CSS for hover effect */}
                  <style>
                    {`
                      .module-card .description-overlay {
                        opacity: 0;
                        transition: opacity 0.3s ease-in-out;
                      }
                      .module-card:hover .description-overlay {
                        opacity: 1;
                      }
                    `}
                  </style>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Section with Logo Images */}
        <div className="relative mt-[100px] md:mt-[150px] mx-auto w-[98%]">
          <div className="relative w-full h-[300px] md:h-[440px] bg-[url('https://cdn.animaapp.com/projects/66fe7ba2df054d0dfb35274e/releases/676d6d16be8aa405f53530bc/img/hd-wallpaper-anatomy-human-anatomy-1.png')] bg-cover">
            <div className="absolute top-[180px] md:top-[252px] left-[10px] md:left-[23px] right-[10px] md:right-[23px] h-[110px] md:h-[178px] bg-white rounded-[12px] shadow-neo">
              <div className="flex flex-wrap justify-center gap-2 md:gap-4 mt-2 md:mt-4 px-2">
                {/* Social Media Buttons with Images */}
                <button
                  className="w-[100px] md:w-48 h-8 md:h-11 bg-[#f0f0f0] border-none rounded-full text-xs md:text-base hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-yellow-500 hover:text-white hover:scale-105 transition duration-200 shadow-neo flex items-center justify-center"
                  style={{
                    boxShadow: "4px 4px 8px #d1d1d1, -4px -4px 8px #ffffff",
                  }}
                  onClick={() =>
                    (window.location.href = "https://www.instagram.com")
                  }
                >
                  <img
                    src={instagramLogo}
                    alt="Instagram Logo"
                    className="w-6 h-6 md:w-9 md:h-6"
                  />
                </button>

                <button
                  className="w-[100px] md:w-48 h-8 md:h-11 bg-[#f0f0f0] border-none rounded-full text-xs md:text-base hover:bg-black hover:text-white hover:scale-105 transition duration-200 shadow-neo flex items-center justify-center"
                  style={{
                    boxShadow: "4px 4px 8px #d1d1d1, -4px -4px 8px #ffffff",
                  }}
                  onClick={() =>
                    (window.location.href = "https://www.twitter.com")
                  }
                >
                  <img
                    src={twitterLogo}
                    alt="Twitter Logo"
                    className="w-6 h-6"
                  />
                </button>

                <button
                  className="w-[100px] md:w-48 h-8 md:h-11 bg-[#f0f0f0] border-none rounded-full text-xs md:text-base hover:bg-blue-500 hover:text-white hover:scale-105 transition duration-200 shadow-neo flex items-center justify-center"
                  style={{
                    boxShadow: "4px 4px 8px #d1d1d1, -4px -4px 8px #ffffff",
                  }}
                  onClick={() =>
                    (window.location.href = "https://www.facebook.com")
                  }
                >
                  <img
                    src={facebookLogo}
                    alt="Facebook Logo"
                    className="w-6 h-6"
                  />
                </button>

                <button
                  className="w-[100px] md:w-48 h-8 md:h-11 bg-[#f0f0f0] border-none rounded-full text-xs md:text-base hover:bg-red-100 hover:text-white hover:scale-105 transition duration-200 shadow-neo flex items-center justify-center"
                  style={{
                    boxShadow: "4px 4px 8px #d1d1d1, -4px -4px 8px #ffffff",
                  }}
                  onClick={() =>
                    (window.location.href = "https://www.pinterest.com")
                  }
                >
                  <img
                    src={pinterestLogo}
                    alt="Pinterest Logo"
                    className="w-6 h-6"
                  />
                </button>
              </div>

              <div className="mt-2 md:mt-4 border-t border-gray-300"></div>

              <div className="text-center mt-1 md:mt-2">
                <p className="text-sm md:text-xl text-gray-800">
                  © 2024, All Rights Reserved
                </p>
              </div>
            </div>

            <p className="absolute top-[20px] md:top-[40px] left-0 right-0 text-[32px] md:text-[64px] font-normal text-center text-white">
              Be the one with
              <span className="text-red-500"> Nat</span>
              <span className="text-[#B9DE00]">ur</span>
              <span className="text-red-500">e</span>
            </p>
          </div>
        </div>
      </div>

      {/* Completion Popup */}
      {completedPopupOpen && renderCompletedPopup()}
    </div>
  );
};

export default Plants;
