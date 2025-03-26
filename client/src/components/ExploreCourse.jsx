import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Mic, MicOff, Menu } from "lucide-react";
import NavButton from "./NavButton";
import ProfileButton from "./profile";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import CourseCard from "./CourseCard";

const ExploreCourse = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [levelFilter, setLevelFilter] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Speech recognition setup
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchKeyword(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setError("Error accessing microphone. Please check permissions.");
      setIsListening(false);
    };

    if (isListening) {
      recognition.start();
    }

    return () => {
      recognition.stop();
    };
  }, [isListening]);

  // Handle body overflow when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSidebarOpen]);

  // Fetch courses with filters
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        setError("");

        const params = new URLSearchParams();
        if (searchKeyword) params.append("keyword", searchKeyword);
        if (levelFilter) params.append("level", levelFilter);
        if (sortBy) {
          params.append("sortBy", sortBy);
          params.append("sortOrder", sortOrder);
        }

        const response = await axios.get(
          `http://localhost:3000/api/courses?${params.toString()}`
        );
        setCourses(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch courses");
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchCourses();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchKeyword, sortBy, sortOrder, levelFilter]);

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  const toggleVoiceSearch = () => {
    if (!isSpeechSupported) {
      alert(
        "Speech recognition is not supported in your browser. Try Chrome or Edge."
      );
      return;
    }
    setIsListening(!isListening);
  };

  const handleCoursesClick = () => {
    navigate("/");
    setIsSidebarOpen(false);
    setTimeout(() => {
      const coursesSection = document.getElementById("courses");
      if (coursesSection) {
        coursesSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleAboutUsClick = () => {
    navigate("/aboutus");
    setIsSidebarOpen(false);
  };

  const handleLeaderboardClick = () => {
    navigate("/leaderboard");
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Bar */}
        <nav className="flex justify-between items-center w-full mb-8 relative">
          <div className="flex items-center">
            <img
              src="./src/assets/skillverse.svg"
              alt="Company logo"
              className="w-[58px] aspect-square cursor-pointer"
              onClick={() => navigate("/")}
            />
          </div>

          <div className="md:hidden absolute right-[100px] top-1/2 transform -translate-y-1/2">
            <button
              onClick={toggleSidebar}
              className="p-2 focus:outline-none"
              style={{
                boxShadow: "5px 5px 10px #d1d1d1, -5px -5px 10px #ffffff",
                borderRadius: "50%",
                border: "0.5px solid rgba(0, 0, 0, 0.1)",
              }}
              aria-label="Toggle menu"
            >
              <Menu className="w-8 h-8" />
            </button>
          </div>

          <div className="hidden md:flex gap-6 items-center">
            <NavButton
              className="transform transition-transform duration-300 hover:scale-110 text-black"
              onClick={handleCoursesClick}
            >
              Courses
            </NavButton>
            <NavButton
              className="transform transition-transform duration-300 hover:scale-110 text-black"
              onClick={handleAboutUsClick}
            >
              About Us
            </NavButton>
            <NavButton
              className="transform transition-transform duration-300 hover:scale-110 text-black"
              onClick={handleLeaderboardClick}
            >
              Leaderboard
            </NavButton>
          </div>

          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton>
                <button
                  className="text-black transform transition-transform duration-300 hover:scale-110 rounded-full px-6 py-2 sm:px-8 sm:py-3"
                  style={{
                    boxShadow: "5px 5px 10px #d1d1d1, -5px -5px 10px #ffffff",
                    border: "0.5px solid rgba(0, 0, 0, 0.33)",
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
        </nav>

        {/* Mobile Sidebar */}
        <div
          className={`fixed inset-y-0 right-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          } md:hidden`}
        >
          <div className="p-4">
            <button
              onClick={toggleSidebar}
              className="p-2 text-black focus:outline-none"
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
              className="transform transition-transform duration-300 hover:scale-110 text-black"
              onClick={() => {
                handleCoursesClick();
              }}
            >
              Courses
            </NavButton>
            <NavButton
              className="transform transition-transform duration-300 hover:scale-110 text-black"
              onClick={() => {
                handleAboutUsClick();
              }}
            >
              About Us
            </NavButton>
            <NavButton
              className="transform transition-transform duration-300 hover:scale-110 text-black"
              onClick={() => {
                handleLeaderboardClick();
              }}
            >
              Leaderboard
            </NavButton>
          </nav>
        </div>

        <h1
          className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8"
          style={{ fontFamily: "'Paytone One', sans-serif" }}
        >
          Explore Courses
        </h1>

        {/* Search Section */}
        <div className="mb-6 sm:mb-8 bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchKeyword}
                onChange={handleSearchChange}
                placeholder="Search courses by name or keyword..."
                className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                aria-label="Search courses"
              />
              {isListening && (
                <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-500 animate-pulse"></div>
              )}
            </div>

            <button
              onClick={toggleVoiceSearch}
              className={`p-2 sm:p-3 rounded-full transition-colors ${
                isListening
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-blue-50 hover:bg-blue-100 text-blue-600"
              }`}
              aria-label={isListening ? "Stop listening" : "Start voice search"}
              disabled={!isSpeechSupported}
            >
              {isListening ? (
                <MicOff className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Mic className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>
          </div>

          {!isSpeechSupported && (
            <p className="mt-2 text-sm text-red-600">
              Voice search is not available in your browser
            </p>
          )}
        </div>

        {/* Filters */}
        <div className="mb-6 sm:mb-8 bg-white p-4 sm:p-6 rounded-lg shadow-sm flex flex-wrap gap-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border rounded-lg text-white bg-gray-700"
          >
            <option value="">Sort by</option>
            <option value="name">Course Name</option>
            <option value="level">Difficulty Level</option>
          </select>

          {sortBy && (
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-4 py-2 border rounded-lg text-white bg-gray-700"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          )}

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg text-white bg-gray-700"
          >
            <option value="">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        {/* Loading and Error States */}
        {isLoading && (
          <div className="text-center py-12 text-gray-500">
            Loading courses...
          </div>
        )}

        {error && <div className="text-center py-12 text-red-500">{error}</div>}

        {/* Course Grid with CourseCard Components */}
        {!isLoading && !error && (
          <>
            {courses.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No courses found matching your criteria
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-6 p-4">
                {courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    title={course.course_name}
                    status={`${course.level} • ${course.number_of_modules} Modules`}
                    image={course.course_image || "/default-course.jpg"}
                    courseId={course.id}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ExploreCourse;