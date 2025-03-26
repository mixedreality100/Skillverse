import React, { useContext, useEffect, useReducer } from "react";
import {
  FiHome,
  FiUsers,
  FiBookOpen,
  FiSettings,
  FiLogOut,
  FiMenu,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { RiDashboardFill } from "react-icons/ri";
import UserManagement from "./UserManagement";
import CourseManagement from "./CourseManagement";

// 1. Create the AdminDashboard Context
const AdminDashboardContext = React.createContext();

// 2. Define the initial state and reducer for managing state
const initialState = {
  currentComponent: "dashboard",
  isSidebarOpen: false,
  courses: [
    {
      id: 1,
      course_name: "Introduction to Web Development",
      total_students: 245,
      active_instructors: 3,
      instructor_email: "john.doe@example.com",
    },
    {
      id: 2,
      course_name: "Advanced JavaScript",
      total_students: 178,
      active_instructors: 2,
      instructor_email: "jane.smith@example.com",
    },
    {
      id: 3,
      course_name: "UX/UI Design Fundamentals",
      total_students: 321,
      active_instructors: 4,
      instructor_email: "alice.jones@example.com",
    },
    {
      id: 4,
      course_name: "Python for Data Science",
      total_students: 412,
      active_instructors: 5,
      instructor_email: "bob.brown@example.com",
    },
  ],
  unapprovedCourses: [],
  courseEnrollment: [],
  userCount: 0,
  courseCount: 0,
  instructorCount: 0,
  learnerCount: 0,
};

const adminDashboardReducer = (state, action) => {
  switch (action.type) {
    case "SET_CURRENT_COMPONENT":
      return { ...state, currentComponent: action.payload };
    case "SET_SIDEBAR_OPEN":
      return { ...state, isSidebarOpen: action.payload };
    case "SET_COURSES":
      return { ...state, courses: action.payload };
    case "SET_UNAPPROVED_COURSES":
      return { ...state, unapprovedCourses: action.payload };
    case "SET_COURSE_ENROLLMENT":
      return { ...state, courseEnrollment: action.payload };
    case "SET_USER_COUNT":
      return { ...state, userCount: action.payload };
    case "SET_COURSE_COUNT":
      return { ...state, courseCount: action.payload };
    case "SET_INSTRUCTOR_COUNT":
      return { ...state, instructorCount: action.payload };
    case "SET_LEARNER_COUNT":
      return { ...state, learnerCount: action.payload };
    default:
      return state;
  }
};

// 3. DashboardContent Component (Updated to use context)
const DashboardContent = () => {
  const {
    courses,
    unapprovedCourses,
    courseEnrollment,
    userCount,
    courseCount,
    instructorCount,
    learnerCount,
  } = useContext(AdminDashboardContext);

  return (
    <div className="w-full">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
        Admin Dashboard
      </h2>

      {/* Responsive Grid for Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-yellow-500 text-black rounded-lg shadow-md p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-2">Total Users</h3>
          <p className="text-2xl sm:text-3xl font-bold">{userCount}</p>
        </div>

        <div className="bg-yellow-500 text-black rounded-lg shadow-md p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-2">Active Courses</h3>
          <p className="text-2xl sm:text-3xl font-bold">{courseCount}</p>
        </div>

        <div className="bg-yellow-500 text-black rounded-lg shadow-md p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-2">Total Instructors</h3>
          <p className="text-2xl sm:text-3xl font-bold">{instructorCount}</p>
        </div>

        <div className="bg-yellow-500 text-black rounded-lg shadow-md p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-2">Total Learners</h3>
          <p className="text-2xl sm:text-3xl font-bold">{learnerCount}</p>
        </div>
      </div>

      {/* Responsive Table for Approved Courses */}
      <div className="overflow-x-auto shadow-md rounded-lg mb-8">
        <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">APPROVED COURSES</h1>
        <table className="min-w-full bg-white border border-black-800">
          <thead className="bg-gray-100 hidden sm:table-header-group">
            <tr>
              <th className="px-4 sm:px-6 py-2 sm:py-3 text-center text-sm sm:text-lg font-bold text-gray-700 uppercase tracking-wider border-b">
                Course Name
              </th>
              <th className="px-4 sm:px-6 py-2 sm:py-3 text-center text-sm sm:text-lg font-bold text-gray-700 uppercase tracking-wider border-b">
                Total Students Enrolled
              </th>
              <th className="px-4 sm:px-6 py-2 sm:py-3 text-center text-sm sm:text-lg font-bold text-gray-700 uppercase tracking-wider border-b">
                Instructors Name
              </th>
              <th className="px-4 sm:px-6 py-2 sm:py-3 text-center text-sm sm:text-lg font-bold text-gray-700 uppercase tracking-wider border-b">
                Instructor Email
              </th>
            </tr>
          </thead>
          <tbody className="block sm:table-row-group">
            {courses.map((course) => (
              <tr
                key={course.id}
                className="block sm:table-row hover:bg-gray-50 border-b sm:border-b-0 mb-4 sm:mb-0"
              >
                <td className="block sm:table-cell px-4 sm:px-6 py-2 sm:py-4 text-lg border-b border-gray-200 sm:text-center before:content-['Course_Name:'] before:font-bold before:mr-2 sm:before:content-none">
                  {course.course_name}
                </td>
                <td className="block sm:table-cell px-4 sm:px-6 py-2 sm:py-4 text-lg border-b border-gray-200 sm:text-center before:content-['Total_Students:'] before:font-bold before:mr-2 sm:before:content-none">
                  {courseEnrollment.find(enrollment => enrollment.course_id === course.id)?.total_students || 0}
                </td>
                <td className="block sm:table-cell px-4 sm:px-6 py-2 sm:py-4 text-lg border-b border-gray-200 sm:text-center before:content-['Instructors:'] before:font-bold before:mr-2 sm:before:content-none">
                  {course.instructor_name}
                </td>
                <td className="block sm:table-cell px-4 sm:px-6 py-2 sm:py-4 text-lg border-b border-gray-200 sm:text-center before:content-['Email:'] before:font-bold before:mr-2 sm:before:content-none">
                  {course.instructor_email}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Responsive Table for Unapproved Courses */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">UNAPPROVED COURSES</h1>
        <table className="min-w-full bg-white border border-black-800">
          <thead className="bg-gray-100 hidden sm:table-header-group">
            <tr>
              <th className="px-4 sm:px-6 py-2 sm:py-3 text-center text-sm sm:text-lg font-bold text-gray-700 uppercase tracking-wider border-b">
                Course Name
              </th>
              <th className="px-4 sm:px-6 py-2 sm:py-3 text-center text-sm sm:text-lg font-bold text-gray-700 uppercase tracking-wider border-b">
                Instructor Name
              </th>
              <th className="px-4 sm:px-6 py-2 sm:py-3 text-center text-sm sm:text-lg font-bold text-gray-700 uppercase tracking-wider border-b">
                Instructor Email
              </th>
            </tr>
          </thead>
          <tbody className="block sm:table-row-group">
            {unapprovedCourses.length > 0 ? (
              unapprovedCourses.map((course) => (
                <tr
                  key={course.id}
                  className="block sm:table-row hover:bg-gray-50 border-b sm:border-b-0 mb-4 sm:mb-0"
                >
                  <td className="block sm:table-cell px-4 sm:px-6 py-2 sm:py-4 text-lg border-b border-gray-200 sm:text-center before:content-['Course_Name:'] before:font-bold before:mr-2 sm:before:content-none">
                    {course.course_name}
                  </td>
                  <td className="block sm:table-cell px-4 sm:px-6 py-2 sm:py-4 text-lg border-b border-gray-200 sm:text-center before:content-['Email:'] before:font-bold before:mr-2 sm:before:content-none">
                    {course.instructor_name}
                  </td>
                  <td className="block sm:table-cell px-4 sm:px-6 py-2 sm:py-4 text-lg border-b border-gray-200 sm:text-center before:content-['Actions:'] before:font-bold before:mr-2 sm:before:content-none">
                    {course.instructor_email}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="block sm:table-row border-b sm:border-b-0 mb-4 sm:mb-0">
                <td colSpan="3" className="block sm:table-cell px-4 sm:px-6 py-4 text-lg text-center">
                  No unapproved courses available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 4. Main AdminDashboard Component
export const AdminDashboard = () => {
  const [state, dispatch] = useReducer(adminDashboardReducer, initialState);
  const navigate = useNavigate();

  // Admin dashboard logic (same as before, but using dispatch)
  useEffect(() => {
    const fetchUserCount = async () => {
      const response = await fetch('http://localhost:3000/api/users/count');
      const data = await response.json();
      dispatch({ type: "SET_USER_COUNT", payload: data.total_users });
    };

    const fetchCourseCount = async () => {
      const response = await fetch('http://localhost:3000/api/courses/active');
      const data = await response.json();
      dispatch({ type: "SET_COURSE_COUNT", payload: data.length });
      dispatch({ type: "SET_COURSES", payload: data });
    };

    const fetchInstructorCount = async () => {
      const response = await fetch('http://localhost:3000/api/users/instructors/count');
      const data = await response.json();
      dispatch({ type: "SET_INSTRUCTOR_COUNT", payload: data.total_instructors });
    };

    const fetchLearnersCount = async () => {
      const response = await fetch('http://localhost:3000/api/users/learners/count');
      const data = await response.json();
      dispatch({ type: "SET_LEARNER_COUNT", payload: data.total_learners });
    };

    const fetchCourseEnrollment = async () => {
      const response = await fetch('http://localhost:3000/api/courses/enrollment');
      const data = await response.json();
      dispatch({ type: "SET_COURSE_ENROLLMENT", payload: data });
    };

    const fetchUnapprovedCourses = async () => {
      const response = await fetch('http://localhost:3000/api/courses/unapproved');
      const data = await response.json();
      dispatch({ type: "SET_UNAPPROVED_COURSES", payload: data });
    };

    fetchUserCount();
    fetchCourseCount();
    fetchInstructorCount();
    fetchLearnersCount();
    fetchCourseEnrollment();
    fetchUnapprovedCourses();
  }, []);

  return (
    // 5. Provide the context to the component tree
    <AdminDashboardContext.Provider value={{ ...state, dispatch }}>
      <div className="flex min-h-screen bg-white font-poppins font-semibold">
        {/* Mobile Hamburger Menu (Right Side) */}
        <div className="md:hidden fixed top-4 right-4 z-50">
          <FiMenu
            className="w-6 h-6 sm:w-8 sm:h-8 cursor-pointer text-black"
            onClick={() => dispatch({ type: "SET_SIDEBAR_OPEN", payload: !state.isSidebarOpen })}
          />
        </div>

        {/* Left Navigation Bar */}
        <div
          className={`fixed w-64 bg-black text-white h-full transform ${
            state.isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 transition-transform duration-300 ease-in-out z-40`}
        >
          <div className="flex items-center p-4 sm:p-6">
            <div className="w-16 sm:w-20 h-12 sm:h-15 rounded-full bg-white flex items-center justify-center">
              <img
                src="./src/assets/skillverse.svg"
                alt="Company logo"
                className="w-10 sm:w-12 aspect-square"
              />
            </div>
            <span className="ml-2 text-sm sm:text-base text-white flex items-center">
              <span className="text-red-500">●</span> Admin
              <FiHome
                className="ml-8 sm:ml-12 w-4 sm:w-5 h-4 sm:h-5 cursor-pointer hover:text-yellow-500 hover:scale-125 transition-all duration-200"
                onClick={() => navigate("/")}
              />
            </span>
          </div>

          <nav className="mt-6 sm:mt-10">
            {[
              {
                icon: <RiDashboardFill className="w-4 sm:w-5 h-4 sm:h-5 mr-2 sm:mr-3" />,
                label: "Dashboard",
                component: "dashboard",
              },
              {
                icon: <FiUsers className="w-4 sm:w-5 h-4 sm:h-5 mr-2 sm:mr-3" />,
                label: "User Management",
                component: "user-management",
              },
              {
                icon: <FiBookOpen className="w-4 sm:w-5 h-4 sm:h-5 mr-2 sm:mr-3" />,
                label: "Course Management",
                component: "course-management",
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`flex items-center px-4 sm:px-6 py-2 sm:py-3 cursor-pointer mb-3 sm:mb-5 text-sm sm:text-base ${
                  state.currentComponent === item.component
                    ? "bg-yellow-600"
                    : "hover:bg-gray-800"
                }`}
                onClick={() => {
                  dispatch({ type: "SET_CURRENT_COMPONENT", payload: item.component });
                  dispatch({ type: "SET_SIDEBAR_OPEN", payload: false });
                }}
              >
                {item.icon}
                <span className="text-white">{item.label}</span>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex-1 md:ml-64 bg-white overflow-y-auto px-2 sm:px-4 md:px-20 py-4 sm:py-6">
          <main className="mt-6 sm:mt-8">
            {state.currentComponent === "dashboard" && <DashboardContent />}
            {state.currentComponent === "user-management" && <UserManagement />}
            {state.currentComponent === "course-management" && <CourseManagement />}
          </main>
        </div>
      </div>
    </AdminDashboardContext.Provider>
  );
};

export default AdminDashboard;