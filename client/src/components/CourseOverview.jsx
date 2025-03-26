import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavButton from "./NavButton";
import ProfileButton from "./profile";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  useAuth,
  useUser,
  useClerk,
} from "@clerk/clerk-react";
import skillverselogo from "../assets/skillverse.svg";
import instagramLogo from "../assets/instagram.png";
import twitterLogo from "../assets/twitter.png";
import facebookLogo from "../assets/facebook.png";
import pinterestLogo from "../assets/pinterest.png";

const CourseOverview = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const { openSignIn, signOut } = useClerk();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [error, setError] = useState(null);
  const [isModulesLoading, setIsModulesLoading] = useState(true); // New loading state for modules

  const [courseDetails, setCourseDetails] = useState(null);
  const [modules, setModules] = useState([]);

  // Fetch course details from the backend
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/courses/${courseId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch course details");
        }
        const data = await response.json();
        setCourseDetails(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching course details:", error);
        setError({
          message: "Failed to load course details. Please try again.",
          retry: fetchCourseDetails,
        });
        setIsLoading(false);
      }
    };

    const fetchModules = async () => {
      setIsModulesLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3000/modules/${courseId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch modules");
        }

        const data = await response.json();
        
        if (Array.isArray(data)) {
          setModules(data);
        } else {
          console.error("Received data is not an array:", data);
          setModules([]);
        }
      } catch (error) {
        console.error("Error fetching modules:", error);
        setModules([]);
      } finally {
        setIsModulesLoading(false);
      }
    };

    if (courseId) {
      fetchCourseDetails();
      fetchModules();
    }
  }, [courseId]);

  // Backend logic (unchanged)
  useEffect(() => {
    const saveUser = async () => {
      if (isSignedIn && user) {
        try {
          const response = await fetch("http://localhost:3001/api/saveUser", {
            method: "POST",
            credentials: "include",
          });
          if (!response.ok) {
            console.error("Failed to save user data");
          }
        } catch (error) {
          console.error("Error saving user:", error);
        }
      }
    };
    if (isLoaded) {
      saveUser();
    }
  }, [isSignedIn, isLoaded, user]);

  useEffect(() => {
    const checkEnrollment = async () => {
      if (isSignedIn && courseId) {
        try {
          const response = await fetch(
            `http://localhost:3001/api/checkEnrollment/${courseId}`,
            {
              credentials: "include",
            }
          );
          const data = await response.json();
          setIsEnrolled(data.isEnrolled);
        } catch (error) {
          console.error("Failed to check enrollment:", error);
        }
      }
      setIsLoading(false);
    };
    if (isLoaded) {
      checkEnrollment();
    }
  }, [courseId, isSignedIn, isLoaded]);

  const handleEnrollClick = async () => {
    if (!isSignedIn) {
      openSignIn({
        redirectUrl: `/course/${courseId}`,
        appearance: {
          elements: {
            rootBox: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            },
          },
        },
      });
      return;
    }
    if (isEnrolled) {
      navigate(`/plants/${courseId}`, {
        state: { fromApp: true },
      });
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:3001/api/enrollCourse/${courseId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (response.ok) {
        navigate(`/plants/${courseId}`, {
          state: { fromApp: true },
        });
      } else {
        console.error("Failed to enroll");
        setError({
          message: "Failed to enroll. Please try again.",
          retry: handleEnrollClick,
        });
      }
    } catch (error) {
      console.error("Enrollment error:", error);
      setError({
        message: "Enrollment error. Please try again.",
        retry: handleEnrollClick,
      });
    }
  };

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

  return (
    <div className="flex flex-row justify-center w-full bg-gradient-to-b from-green-50 to-white font-poppins">
      <div className="course-overview-container overflow-x-hidden w-full max-w-[1440px] relative rounded-lg">
        {/* Header and Navigation */}
        <header className="flex flex-col items-center px-4 sm:px-6 lg:px-8 pt-6 bg-transparent">
          <nav className="flex flex-col md:flex-row justify-between items-center w-full max-w-[1274px] relative">
            <div className="flex w-full md:w-auto justify-between items-center">
              <img
                src={skillverselogo}
                alt="logo"
                className="w-14 aspect-square cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => navigate("/")}
              />
              <div className="flex items-center gap-3 md:hidden">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2 text-green-800 focus:outline-none"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {isSidebarOpen ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    )}
                  </svg>
                </button>
                <div className="block md:hidden">
                  <SignedOut>
                    <SignInButton>
                      <button className="text-green-800 font-semibold transform transition-transform duration-300 hover:scale-105 rounded-full px-6 py-2 border-2 border-green-600 hover:bg-green-100">
                        Login
                      </button>
                    </SignInButton>
                  </SignedOut>
                  <SignedIn>
                    <ProfileButton onClick={() => signOut()} />
                  </SignedIn>
                </div>
              </div>
            </div>

            <div className="hidden md:flex gap-6">
              <NavButton
                className="transform transition-transform duration-300 hover:scale-105 text-green-800 font-semibold hover:text-green-600"
                onClick={() => {
                  navigate("/");
                  setTimeout(() => {
                    const coursesSection = document.getElementById("courses");
                    if (coursesSection) {
                      coursesSection.scrollIntoView({ behavior: "smooth" });
                    }
                  }, 100);
                }}
              >
                Courses
              </NavButton>
              <NavButton
                className="transform transition-transform duration-300 hover:scale-105 text-green-800 font-semibold hover:text-green-600"
                onClick={() => navigate("/explore")}
              >
                Explore
              </NavButton>
              <NavButton
                className="transform transition-transform duration-300 hover:scale-105 text-green-800 font-semibold hover:text-green-600"
                onClick={() => navigate("/aboutus")}
              >
                About Us
              </NavButton>
              <NavButton
                className="transform transition-transform duration-300 hover:scale-105 text-green-800 font-semibold hover:text-green-600"
                onClick={() => navigate("/leaderboard")}
              >
                Leaderboard
              </NavButton>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <SignedOut>
                <SignInButton>
                  <button className="text-green-800 font-semibold transform transition-transform duration-300 hover:scale-105 rounded-full border-2 border-green-600 px-6 py-2 hover:bg-green-100">
                    Login
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <ProfileButton onClick={() => signOut()} />
              </SignedIn>
            </div>
          </nav>
        </header>

        {/* Mobile Sidebar */}
        <div
          className={`fixed inset-y-0 right-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          } md:hidden`}
        >
          <div className="p-4">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 text-green-800 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <nav className="flex flex-col space-y-4 p-4">
            <NavButton
              className="transform transition-transform duration-300 hover:scale-105 text-green-800 font-semibold hover:text-green-600"
              onClick={() => {
                navigate("/");
                setTimeout(() => {
                  const coursesSection = document.getElementById("courses");
                  if (coursesSection) {
                    coursesSection.scrollIntoView({ behavior: "smooth" });
                  }
                }, 100);
                setIsSidebarOpen(false);
              }}
            >
              Courses
            </NavButton>
            <NavButton
              className="transform transition-transform duration-300 hover:scale-105 text-green-800 font-semibold hover:text-green-600"
              onClick={() => {
                navigate("/explore");
                setIsSidebarOpen(false);
              }}
            >
              Explore
            </NavButton>
            <NavButton
              className="transform transition-transform duration-300 hover:scale-105 text-green-800 font-semibold hover:text-green-600"
              onClick={() => {
                navigate("/aboutus");
                setIsSidebarOpen(false);
              }}
            >
              About Us
            </NavButton>
            <NavButton
              className="transform transition-transform duration-300 hover:scale-105 text-green-800 font-semibold hover:text-green-600"
              onClick={() => {
                navigate("/leaderboard");
                setIsSidebarOpen(false);
              }}
            >
              Leaderboard
            </NavButton>
          </nav>
        </div>

        {/* Static AR/3D Header */}
        <div className="relative mt-12 mx-auto w-full px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-500 text-white py-8 rounded-xl shadow-lg">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              Experience Learning in 3D & AR 🥽
            </h1>
            <p className="mt-3 text-lg sm:text-xl text-black">
              Dive into an immersive world where plants come to life through
              augmented reality and 3D models.
            </p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 mt-6 mx-4 sm:mx-6 lg:mx-8 text-red-700 bg-red-50 rounded-lg shadow-md animate-pulse">
            <p className="font-semibold">{error.message}</p>
            <button
              onClick={error.retry}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Main Content: Course Details */}
        <div className="relative mt-8 mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg border-4 shadow-green-200/30 max-w-5xl mx-auto p-6 sm:p-8 lg:p-10 transform transition-all duration-500 hover:shadow-xl">
            {/* Course Title */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-4">
              {courseDetails?.course_name || "No Name"}
            </h2>

            {/* Course Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center p-4 bg-green-50 rounded-lg shadow-sm">
                <span className="text-black font-semibold mr-2">
                  Course ID:
                </span>
                <span className="text-black">
                  {courseDetails?.id || courseId}
                </span>
              </div>
              <div className="flex items-center p-4 bg-green-50 rounded-lg shadow-sm">
                <span className="text-black font-semibold mr-2">Level:</span>
                <span className="text-black">
                  {courseDetails?.level || "Beginner"}
                </span>
              </div>
              <div className="flex items-center p-4 bg-green-50 rounded-lg shadow-sm">
                <span className="text-black font-semibold mr-2">
                  Primary Language:
                </span>
                <span className="text-black">
                  {courseDetails?.primary_language || "English"}
                </span>
              </div>
              <div className="flex items-center p-4 bg-green-50 rounded-lg shadow-sm">
                <span className="text-black font-semibold mr-2">Modules:</span>
                <span className="text-black">
                  {courseDetails?.number_of_modules || 3}
                </span>
              </div>
            </div>

            {/* Course Description */}
            <div className="mb-8">
              <h3 className="text-xl sm:text-2xl font-semibold text-black mb-3">
                What You'll Learn
              </h3>
              <p className="text-black text-base sm:text-lg leading-relaxed">
                <strong>Course Modules:</strong>
                {isModulesLoading ? (
                  <span className="ml-2 text-gray-500 inline-flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading modules...
                  </span>
                ) : modules && modules.length > 0 ? (
                  <ul className="list-disc list-inside mt-2">
                    {modules.map((module, index) => (
                      <li key={module.id || index} className="mb-1">
                        {module.module_name ||
                          module.name ||
                          `Module ${index + 1}`}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="ml-2 text-gray-500">
                    No modules available. Total modules expected: {courseDetails?.number_of_modules || 5}
                  </span>
                )}
              </p>
            </div>

            {/* Enroll Button */}
            <div className="text-center">
              <button
                className="select-none rounded-lg bg-yellow-500 py-4 px-10 sm:px-16 lg:px-24 text-center align-middle font-sans text-lg sm:text-xl font-bold uppercase text-black shadow-md shadow-yellow-500/30 transition-all hover:shadow-lg hover:shadow-yellow-500/50 hover:bg-yellow-600 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                onClick={handleEnrollClick}
                disabled={isLoading}
              >
                {isLoading
                  ? "Loading..."
                  : isEnrolled
                  ? "Continue Course"
                  : "Enroll Now"}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <footer className="relative mt-16 mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="relative w-full h-[400px] sm:h-[440px] bg-[url('https://cdn.animaapp.com/projects/66fe7ba2df054d0dfb35274e/releases/676d6d16be8aa405f53530bc/img/hd-wallpaper-anatomy-human-anatomy-1.png')] bg-cover bg-center rounded-xl">
            <div className="absolute top-[220px] sm:top-[252px] left-4 right-4 h-[160px] sm:h-[178px] bg-white rounded-[12px] shadow-lg">
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-4">
                <button
                  className="w-36 sm:w-48 h-10 sm:h-11 bg-white border-2 border-gray-200 rounded-full text-gray-800 font-semibold hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-yellow-500 hover:text-white hover:scale-105 transition duration-300 flex items-center justify-center"
                  onClick={() =>
                    (window.location.href = "https://www.instagram.com")
                  }
                >
                  <img
                    src={instagramLogo}
                    alt="Instagram Logo"
                    className="w-8 h-5 sm:w-9 sm:h-6"
                  />
                </button>
                <button
                  className="w-36 sm:w-48 h-10 sm:h-11 bg-white border-2 border-gray-200 rounded-full text-gray-800 font-semibold hover:bg-black hover:text-white hover:scale-105 transition duration-300 flex items-center justify-center"
                  onClick={() =>
                    (window.location.href = "https://www.twitter.com")
                  }
                >
                  <img
                    src={twitterLogo}
                    alt="Twitter Logo"
                    className="w-5 h-5 sm:w-6 sm:h-6"
                  />
                </button>
                <button
                  className="w-36 sm:w-48 h-10 sm:h-11 bg-white border-2 border-gray-200 rounded-full text-gray-800 font-semibold hover:bg-blue-600 hover:text-white hover:scale-105 transition duration-300 flex items-center justify-center"
                  onClick={() =>
                    (window.location.href = "https://www.facebook.com")
                  }
                >
                  <img
                    src={facebookLogo}
                    alt="Facebook Logo"
                    className="w-5 h-5 sm:w-6 sm:h-6"
                  />
                </button>
                <button
                  className="w-36 sm:w-48 h-10 sm:h-11 bg-white border-2 border-gray-200 rounded-full text-gray-800 font-semibold hover:bg-red-100 hover:text-white hover:scale-105 transition duration-300 flex items-center justify-center"
                  onClick={() =>
                    (window.location.href = "https://www.pinterest.com")
                  }
                >
                  <img
                    src={pinterestLogo}
                    alt="Pinterest Logo"
                    className="w-5 h-5 sm:w-6 sm:h-6"
                  />
                </button>
              </div>
              <div className="mt-3 sm:mt-4 border-t border-gray-200"></div>
              <div className="text-center mt-2">
                <p className="text-sm sm:text-base text-gray-700 font-medium">
                  © 2025, All Rights Reserved
                </p>
              </div>
            </div>
            <p className="absolute top-8 sm:top-[40px] left-0 right-0 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-center text-white drop-shadow-lg">
              Be the one with
              <span className="text-red-500"> Nat</span>
              <span className="text-[#B9DE00]">ur</span>
              <span className="text-red-500">e</span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default CourseOverview;