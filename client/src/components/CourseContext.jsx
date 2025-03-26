// Option 1: Using a shared context provider
// Create a new file: CourseContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [courseEnrollment, setCourseEnrollment] = useState([]);
  const [courseCount, setCourseCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/courses/active');
      const data = await response.json();
      setCourses(data);
      setCourseCount(data.length);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchCourseEnrollment = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/courses/enrollment');
      const data = await response.json();
      setCourseEnrollment(data);
    } catch (error) {
      console.error('Error fetching course enrollment:', error);
    }
  };

  // Trigger a refresh of course data
  const refreshCourses = () => {
    setLastUpdate(Date.now());
  };

  useEffect(() => {
    fetchCourses();
    fetchCourseEnrollment();
  }, [lastUpdate]);

  return (
    <CourseContext.Provider 
      value={{ 
        courses, 
        setCourses, 
        courseEnrollment, 
        setCourseEnrollment, 
        courseCount, 
        refreshCourses 
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const useCourseContext = () => useContext(CourseContext);

// Option 2: Using a simpler approach with a refresh callback
// You can pass a refreshCallback from AdminDashboard to CourseManagement