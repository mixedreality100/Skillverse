import React, { useState, useEffect } from 'react';
import ExploreModule from './ExploreModule'; // Import your ExploreModule component
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const MyCourses = () => {
  const navigate = useNavigate(); // Use the useNavigate hook to get the navigate function
  const [showExploreModule, setShowExploreModule] = useState(false); // State to track which component to show
  const [courses, setCourses] = useState([]); // State to store fetched courses
  const [selectedCourseId, setSelectedCourseId] = useState(null); // State to store the selected course ID

  useEffect(() => {
    // Function to fetch courses from the backend
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:3000/courses');
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }
        const data = await response.json();
        setCourses(data); // Update the courses state with fetched data
      } catch (error) {
        console.error('Error fetching courses:', error);
        alert(`Error fetching courses: ${error.message}`);
      }
    };

    fetchCourses(); // Call the function to fetch courses when the component mounts
  }, []);

  const handleExploreClick = (courseId) => {
    setSelectedCourseId(courseId); // Set the selected course ID
    setShowExploreModule(true); // Show the ExploreModule component
  };

  const handleBackClick = () => {
    setShowExploreModule(false); // Return to MyCourses
  };

  const handleEditCourse = (courseId) => {
    navigate(`/edit-course/${courseId}`);
  };
  const handleDeleteCourse = async (courseId) => {
    try {
      const response = await fetch(`http://localhost:3000/delete-course/${courseId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      alert('Course deleted successfully');
      // Optionally, you can reload the courses list or update the state to reflect the deletion
      const updatedCourses = courses.filter(course => course.id !== courseId);
      setCourses(updatedCourses);
    } catch (error) {
      console.error('Error deleting course:', error);
      alert(`Error deleting course: ${error.message}`);
    }
  };

  return (
    <div className="p-5">
      {showExploreModule ? (
        <ExploreModule courseId={selectedCourseId} onBackClick={handleBackClick} /> // Pass selected course ID and back click handler as props
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-5">My Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="relative">
                  {course.course_image ? (
                    <img
                      src={course.course_image}
                      alt={course.course_name}
                      className="w-full h-44 object-cover"
                    />
                  ) : (
                    <div className="w-full h-44 bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-white text-xl font-semibold bg-black bg-opacity-60 px-5 py-1 rounded">
                      {course.course_name}
                    </h3>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-700 mb-3 text-base text-center">
                    Course code: {course.course_id}
                  </p>
                  <p className="text-gray-700 mb-3 text-base text-center">
                    Level: {course.level}
                  </p>
                  <div className="flex justify-center gap-4">
                    <button
                      className="bg-white border border-black text-black px-4 py-2 rounded-full text-sm hover:bg-green-100 hover:border-green-500 hover:text-green-600 transition-colors duration-300 ease-in-out shadow-sm hover:shadow-md"
                      onClick={() => handleEditCourse(course.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-white border border-black text-black px-4 py-2 rounded-full text-sm hover:bg-red-100 hover:border-red-500 hover:text-red-600 transition-colors duration-300 ease-in-out shadow-sm hover:shadow-md"
                      onClick={() => handleDeleteCourse(course.id)}
                    >
                      Delete
                    </button>
                  </div>
                  <div className="flex justify-center mt-4">
                    <button
                      className="bg-black text-white px-5 py-2 rounded-full text-sm hover:bg-gray-800"
                      onClick={() => handleExploreClick(course.id)} // Trigger ExploreModule display
                    >
                      Explore Module
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MyCourses;