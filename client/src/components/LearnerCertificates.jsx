import React, { useState, useEffect } from 'react';
import { useAuth } from "@clerk/clerk-react";

const LearnerCertificates = () => {
  const [completedCourses, setCompletedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = useAuth();

  useEffect(() => {
    fetchCompletedCourses();
  }, []);

  const fetchCompletedCourses = async () => {
    try {
      const token = await auth.getToken();
      const response = await fetch('http://localhost:3001/api/my-courses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch completed courses');
      }

      const courses = await response.json();
      console.log('All courses:', courses); // Debug log

      // Only show courses that are marked as completed
      const completed = courses.filter(course => course.is_completed === true);
      console.log('Completed courses:', completed); // Debug log
      setCompletedCourses(completed);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = async (enrollmentId) => {
    try {
      const token = await auth.getToken();
      console.log('Downloading certificate for enrollment:', enrollmentId); // Debug log
      
      const response = await fetch(`http://localhost:3001/api/certificate/${enrollmentId}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to download certificate');
      }

      // Check if the response is a PDF
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/pdf')) {
        throw new Error('Invalid response format');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${enrollmentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading certificate:', err);
      alert(`Failed to download certificate: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        Error: {error}
      </div>
    );
  }

  if (completedCourses.length === 0) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">No Certificates Available</h2>
        <p className="text-gray-600">
          Complete your enrolled courses to earn certificates.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">My Certificates</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {completedCourses.map((course) => {
          console.log('Rendering course:', course); // Debug log
          return (
            <div key={course.enrollment_id} className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-semibold mb-3">{course.course_name}</h3>
              <p className="text-sm text-gray-500 mb-2">Enrollment ID: {course.enrollment_id}</p>
              <p className="text-gray-600 mb-2">
                Enrollment Date: {new Date(course.enrollment_date).toLocaleDateString()}
              </p>
              {course.completion_date && (
                <p className="text-gray-600 mb-2">
                  Completed: {new Date(course.completion_date).toLocaleDateString()}
                </p>
              )}
              <button
                onClick={() => {
                  console.log('Clicking download for enrollment_id:', course.enrollment_id); // Debug log
                  handleDownloadCertificate(course.enrollment_id);
                }}
                className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors duration-200"
              >
                Download Certificate
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LearnerCertificates;
