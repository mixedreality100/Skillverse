import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Mic, MicOff } from 'lucide-react';

const ExploreCourse = () => {
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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Explore Courses</h1>

        {/* Search Section */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
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
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">Sort by</option>
            <option value="name">Course Name</option>
            <option value="level">Difficulty Level</option>
          </select>

          {sortBy && (
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          )}

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
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