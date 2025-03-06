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
      // Only show courses that are marked as completed
      const completed = courses.filter(course => course.is_completed === true);
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
      const response = await fetch(`http://localhost:3001/api/certificate/${enrollmentId}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to download certificate');
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
      alert(err.message || 'Failed to download certificate. Please try again.');
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
        {completedCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <h3 className="text-xl font-semibold mb-3">Course ID: {course.course_id}</h3>
            <p className="text-gray-600 mb-2">Enrollment Date: {new Date(course.enrollment_date).toLocaleDateString()}</p>
            <button
              onClick={() => handleDownloadCertificate(course.id)}
              className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors duration-200"
            >
              Download Certificate
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearnerCertificates;
