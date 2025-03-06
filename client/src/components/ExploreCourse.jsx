import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Mic, MicOff } from 'lucide-react';
import NavButton from "./NavButton";
import ProfileButton from "./profile";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";

const ExploreCourse = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [levelFilter, setLevelFilter] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Speech recognition setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchKeyword(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setError('Error accessing microphone. Please check permissions.');
      setIsListening(false);
    };

    if (isListening) {
      recognition.start();
    }

    return () => {
      recognition.stop();
    };
  }, [isListening]);

  // Fetch courses with filters
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        const params = new URLSearchParams();
        if (searchKeyword) params.append('keyword', searchKeyword);
        if (levelFilter) params.append('level', levelFilter);
        if (sortBy) {
          params.append('sortBy', sortBy);
          params.append('sortOrder', sortOrder);
        }

        const response = await axios.get(`http://localhost:3000/api/courses?${params.toString()}`);
        setCourses(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch courses');
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
      alert('Speech recognition is not supported in your browser. Try Chrome or Edge.');
      return;
    }
    setIsListening(!isListening);
  };

  const handelCoursesClick = () => {
    navigate('/');
    setTimeout(() => {
      const coursesSection = document.getElementById('courses');
      if (coursesSection) {
        coursesSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handelExploreCourseClick = () => {
    navigate('/aboutus');
  };

  const handleHomeClick = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Bar */}
        <nav className="flex justify-between items-center w-full max-w-[1274px] mx-auto mb-8">
          <img
            src="./src/assets/skillverse.svg"
            alt="Company logo"
            className="w-[58px] aspect-square"
            onClick={() => navigate("/")}
          />
          <div className="flex gap-9">
            {/* <NavButton 
              className="transform transition-transform duration-300 hover:scale-110 text-black" 
              onClick={handleHomeClick}
            >
              Home
            </NavButton> */}
            <NavButton 
              className="transform transition-transform duration-300 hover:scale-110 text-black" 
              onClick={handelCoursesClick}
            >
              Courses
            </NavButton>
            <NavButton 
              className="transform transition-transform duration-300 hover:scale-110 text-black" 
              onClick={handelExploreCourseClick}
            >
              About Us
            </NavButton>
          </div>
          <div className="flex items-center gap-5">
            <SignedOut>
              <SignInButton>
                <button className="text-black transform transition-transform duration-300 hover:scale-110 rounded-full px-8 py-3"
                    style={{
                      boxShadow: "5px 5px 10px #d1d1d1, -5px -5px 10px #ffffff",
                      border: "0.5px solid rgba(0, 0, 0, 0.33)",
                    }}>
                  Login
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <ProfileButton />
            </SignedIn>
          </div>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Explore Courses</h1>

        {/* Search Section */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm text-white">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchKeyword}
                onChange={handleSearchChange}
                placeholder="Search courses by name or keyword..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Search courses"
              />
              {isListening && (
                <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-500 animate-pulse"></div>
              )}
            </div>
            
            <button
              onClick={toggleVoiceSearch}
              className={`p-3 rounded-full transition-colors ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-blue-50 hover:bg-blue-100 text-blue-600'
              }`}
              aria-label={isListening ? "Stop listening" : "Start voice search"}
              disabled={!isSpeechSupported}
            >
              {isListening ? (
                <MicOff className="w-6 h-6" />
              ) : (
                <Mic className="w-6 h-6" />
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
        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm flex flex-wrap gap-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border rounded-lg text-white"
          >
            <option value="">Sort by</option>
            <option value="name">Course Name</option>
            <option value="level">Difficulty Level</option>
          </select>

          {sortBy && (
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-4 py-2 border rounded-lg text-white"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          )}

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg text-white"
          >
            <option value="">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        {/* Loading and Error States */}
        {isLoading && (
          <div className="text-center py-12 text-gray-500">Loading courses...</div>
        )}

        {error && (
          <div className="text-center py-12 text-red-500">{error}</div>
        )}

        {/* Course Grid */}
        {!isLoading && !error && (
          <>
            {courses.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No courses found matching your criteria
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                  <div key={course.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <img
                      src={course.course_image || '/default-course.jpg'}
                      alt={course.course_name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{course.course_name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                          {course.level}
                        </span>
                        <span>•</span>
                        <span>{course.number_of_modules} Modules</span>
                      </div>
                      <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        View Course
                      </button>
                    </div>
                  </div>
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