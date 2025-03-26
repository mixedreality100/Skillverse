import React, { useState, useEffect } from 'react';
import ExploreModule from './ExploreModule'; // Import your ExploreModule component
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const MyCourses = ({ instructorEmail })  => {
  const navigate = useNavigate(); // Use the useNavigate hook to get the navigate function
  const [showExploreModule, setShowExploreModule] = useState(false); // State to track which component to show
  const [courses, setCourses] = useState([]); // State to store fetched courses
  const [selectedCourseId, setSelectedCourseId] = useState(null); // State to store the selected course ID
  const [loading, setLoading] = useState(true); // Ensure setLoading is declared
  // New state for delete confirmation
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  useEffect(() => {
    if (instructorEmail) {
      fetchCourses(instructorEmail);
    }
  }, [instructorEmail]);

  const fetchCourses = async (instructorEmail) => {
    try {
      setLoading(true); // Use setLoading here
      const response = await fetch(`http://localhost:3000/email/courses?instructorEmail=${instructorEmail}`);
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      alert(`Error fetching courses: ${error.message}`);
    } finally {
      setLoading(false); // Use setLoading here
    }
  };

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

  // Modified to show confirmation instead of deleting immediately
  const handleDeleteCourse = (course) => {
    setCourseToDelete(course);
    setShowDeleteConfirmation(true);
  };

  // New function to actually delete the course after confirmation
  const confirmDeleteCourse = async () => {
    try {
      const response = await fetch(`http://localhost:3000/delete-course/${courseToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      alert('Course deleted successfully');
      // Update the courses list to reflect the deletion
      const updatedCourses = courses.filter(course => course.id !== courseToDelete.id);
      setCourses(updatedCourses);
      // Close the confirmation dialog
      setShowDeleteConfirmation(false);
    } catch (error) {
      console.error('Error deleting course:', error);
      alert(`Error deleting course: ${error.message}`);
    }
  };

  // Function to cancel deletion
  const cancelDeleteCourse = () => {
    setShowDeleteConfirmation(false);
    setCourseToDelete(null);
  };

  return (
    <div className="p-5">
      {showExploreModule ? (
        <ExploreModule courseId={selectedCourseId} onBackClick={handleBackClick} /> // Pass selected course ID and back click handler as props
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-5">My Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-lg shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3),0_4px_6px_-2px_rgba(0,0,0,0.15)] overflow-hidden"
              >
                <div className="relative ">
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
                    Course code: {course.id}
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
                      onClick={() => handleDeleteCourse(course)}
                    >
                      Delete
                    </button>
                   
                  </div>
                  <div className="flex justify-center">
                    <span 
                      className={`inline-block px-3 py-1 rounded-full mt-5 text-sm font-medium ${
                        course.status 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}
                    >
                      {course.status ? 'Approved' : 'Not Approved'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && courseToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Do you really want to delete the course: <span className="font-semibold">{courseToDelete.course_name}</span>?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                onClick={cancelDeleteCourse}
              >
                No
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                onClick={confirmDeleteCourse}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCourses;