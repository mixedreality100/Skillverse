import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [approveCourseId, setApproveCourseId] = useState(null);
  const [approveCourseName, setApproveCourseName] = useState("");
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteCourseId, setDeleteCourseId] = useState(null);
  const [deleteCourseName, setDeleteCourseName] = useState("");
  const [currentCourseStatus, setCurrentCourseStatus] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:3000/courses');
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  const handleApproveCourse = (courseId, courseName, currentStatus) => {
    setApproveCourseId(courseId);
    setApproveCourseName(courseName);
    setCurrentCourseStatus(currentStatus);
    setIsApproveModalOpen(true);
  };

  const confirmApproveCourse = async () => {
    try {
      const newStatus = !currentCourseStatus;
      
      const response = await fetch(`http://localhost:3000/courses/${approveCourseId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
  
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
  
      const updatedCourses = courses.map(course => {
        if (course.id === approveCourseId) {
          return { ...course, status: newStatus };
        }
        return course;
      });
      setCourses(updatedCourses);
      setIsApproveModalOpen(false);
    } catch (error) {
      console.error('Error approving course:', error);
      alert(`Error approving course: ${error.message}`);
    }
  };

  const cancelApproveCourse = () => {
    setIsApproveModalOpen(false);
  };

  const handleEditCourse = (courseId) => {
    navigate(`/edit-course/${courseId}`);
  };

  const handleDeleteCourse = (courseId, courseName) => {
    setDeleteCourseId(courseId);
    setDeleteCourseName(courseName);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteCourse = async () => {
    try {
      const response = await fetch(`http://localhost:3000/delete-course/${deleteCourseId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const updatedCourses = courses.filter(course => course.id !== deleteCourseId);
      setCourses(updatedCourses);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting course:', error);
      alert(`Error deleting course: ${error.message}`);
    }
  };

  const cancelDeleteCourse = () => {
    setIsDeleteModalOpen(false);
  };

  const StyledWrapper = styled.div`
    button.delete-btn {
      width: 120px;
      height: 40px;
      cursor: pointer;
      display: flex;
      align-items: center;
      background: #e62222;
      border: none;
      border-radius: 5px;
      box-shadow: 1px 1px 3px rgba(0,0,0,0.15);
    }

    button.delete-btn, button.delete-btn span {
      transition: 200ms;
    }

    button.delete-btn .text {
      transform: translateX(25px);
      color: white;
      font-weight: bold;
      font-size: 14px;
    }

    button.delete-btn .icon {
      position: absolute;
      border-left: 1px solid #c41b1b;
      transform: translateX(90px);
      height: 30px;
      width: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    button.delete-btn svg {
      width: 12px;
      fill: #eee;
    }

    button.delete-btn:hover {
      background: #ff3636;
    }

    button.delete-btn:hover .text {
      color: transparent;
    }

    button.delete-btn:hover .icon {
      width: 120px;
      border-left: none;
      transform: translateX(0);
    }

    button.delete-btn:focus {
      outline: none;
    }

    button.delete-btn:active .icon svg {
      transform: scale(0.8);
    }

    @media (min-width: 640px) {
      button.delete-btn {
        width: 150px;
        height: 50px;
      }

      button.delete-btn .text {
        transform: translateX(35px);
        font-size: 16px;
      }

      button.delete-btn .icon {
        transform: translateX(110px);
        height: 40px;
        width: 40px;
      }

      button.delete-btn svg {
        width: 15px;
      }

      button.delete-btn:hover .icon {
        width: 150px;
      }
    }
  `;

  return (
    <div className="w-full">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
        Course Management
      </h2>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <div>
          <table className="min-w-full bg-white border-2 border-gray-400">
            <thead className="bg-gray-200 hidden sm:table-header-group sm:border-b-2 border-gray-400">
              <tr>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-sm sm:text-lg font-bold text-gray-700 uppercase tracking-wider whitespace-normal sm:border-r-2 border-gray-400">
                  Course Name
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-sm sm:text-lg font-bold text-gray-700 uppercase tracking-wider whitespace-normal sm:border-r-2 border-gray-400">
                  Total Students Enrolled
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-sm sm:text-lg font-bold text-gray-700 uppercase tracking-wider whitespace-normal sm:border-r-2 border-gray-400">
                  Instructor Name
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-sm sm:text-lg font-bold text-gray-700 uppercase tracking-wider whitespace-normal sm:border-r-2 border-gray-400">
                  Instructor Email
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-sm sm:text-lg font-bold text-gray-700 uppercase tracking-wider whitespace-normal sm:border-r-2 border-gray-400">
                  Status
                </th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-sm sm:text-lg font-bold text-gray-700 uppercase tracking-wider whitespace-normal">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="block sm:table-row-group">
              {courses.length > 0 ? (
                courses.map((course) => (
                  <tr
                    key={course.id}
                    className="block sm:table-row hover:bg-gray-50 border-b border-gray-400 sm:border-b-0 mb-6 sm:mb-0"
                  >
                    <td className="block sm:table-cell px-2 sm:px-4 py-2 sm:py-4 text-base sm:text-lg before:content-['Course_Name:'] before:font-bold before:mr-2 sm:before:content-none whitespace-normal sm:border-r-2 border-gray-400">
                      {course.course_name}
                    </td>
                    <td className="block sm:table-cell px-2 sm:px-4 py-2 sm:py-4 text-base sm:text-lg before:content-['Total_Students:'] before:font-bold before:mr-2 sm:before:content-none whitespace-normal sm:border-r-2 border-gray-400">
                      {course.total_students}
                    </td>
                    <td className="block sm:table-cell px-2 sm:px-4 py-2 sm:py-4 text-base sm:text-lg before:content-['Instructor_Name:'] before:font-bold before:mr-2 sm:before:content-none whitespace-normal sm:border-r-2 border-gray-400">
                      {course.instructor_name}
                    </td>
                    <td className="block sm:table-cell px-2 sm:px-4 py-2 sm:py-4 text-base sm:text-lg before:content-['Instructor_Email:'] before:font-bold before:mr-2 sm:before:content-none whitespace-normal sm:border-r-2 border-gray-400">
                      {course.instructor_email}
                    </td>
                    <td className="block sm:table-cell px-2 sm:px-4 py-2 sm:py-4 text-base sm:text-lg before:content-['Status:'] before:font-bold before:mr-2 sm:before:content-none whitespace-normal sm:border-r-2 border-gray-400">
                      {course.status ? 'Approved' : 'Not Approved'}
                    </td>
                    <td className="block sm:table-cell px-2 sm:px-4 py-2 sm:py-4 text-base sm:text-lg border-b border-gray-400 before:content-['Actions:'] before:font-bold before:mr-2 sm:before:content-none">
                      <StyledWrapper>
                        <div className="flex flex-col gap-2">
                          <button
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            onClick={() => handleApproveCourse(course.id, course.course_name, course.status)}
                          >
                            {course.status ? 'Unapprove' : 'Approve'}
                          </button>
                          <button
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            onClick={() => handleEditCourse(course.id)}
                          >
                            Edit
                          </button>
                          <button
                            className="delete-btn noselect"
                            onClick={() => handleDeleteCourse(course.id, course.course_name)}
                          >
                            <span className="text">Delete</span>
                            <span className="icon">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={24}
                                height={24}
                                viewBox="0 0 24 24"
                              >
                                <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z" />
                              </svg>
                            </span>
                          </button>
                        </div>
                      </StyledWrapper>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="block sm:table-row">
                  <td
                    colSpan={6}
                    className="block sm:table-cell px-2 sm:px-4 py-2 sm:py-4 text-center text-base sm:text-lg text-gray-500 whitespace-normal"
                  >
                    No courses available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approve Confirmation Modal */}
      {isApproveModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Confirm Approval</h3>
            <p className="mb-4">
              Are you sure you want to {currentCourseStatus ? 'unapprove' : 'approve'} course <strong>{approveCourseName}</strong>?
            </p>
            <div className="flex justify-end">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
                onClick={confirmApproveCourse}
              >
                Yes
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                onClick={cancelApproveCourse}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-4">Are you sure you want to delete course <strong>{deleteCourseName}</strong>?</p>
            <div className="flex justify-end">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mr-2"
                onClick={confirmDeleteCourse}
              >
                Yes
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                onClick={cancelDeleteCourse}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;