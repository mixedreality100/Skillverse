import React, { useState, useEffect } from "react";
import { FiHome, FiPlusCircle, FiBook, FiSettings, FiLogOut, FiMenu } from 'react-icons/fi';
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import AddCourse from './AddCourse';
import AddModule from './AddModule';
import AddQuiz from './AddQuiz';
import MyCourses from './MyCourses';
import { RiDashboardFill } from 'react-icons/ri';

export const ContentCreatorDashboard = () => {
  const [currentComponent, setCurrentComponent] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For mobile sidebar toggle
  const [userInfo, setUserInfo] = useState({
    name: 'Content Creator',
    email: 'contentCreator@gmail.com',
    profilePicture: 'https://via.placeholder.com/150'
  });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Get Clerk user and auth
  const { user } = useUser(); // Get user from Clerk
  const auth = useAuth(); // Get auth from Clerk

  useEffect(() => {
    if (user) {
      const emailAddress = user.primaryEmailAddress?.emailAddress || "contentCreator@gmail.com";
      console.log("Current user email:", emailAddress); // Add this line
      setUserInfo({
        name: user.fullName || "Content Creator",
        email: emailAddress,
        profilePicture: user.imageUrl || 'https://via.placeholder.com/150',
      });
      
      // After setting user info, fetch courses for this instructor
      fetchCourses(emailAddress);
    }
  }, [user]); 

  // Function to fetch courses with enrollment counts
  const fetchCourses = async (instructorEmail) => {
    if (!instructorEmail) return;
    
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/instructor-courses?email=${encodeURIComponent(instructorEmail)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const DashboardContent = () => (
    <div className="w-full">
      <h2 className="text-3xl font-bold mb-6">Your Dashboard</h2>
      
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white border border-black-800">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-center text-lg font-bold text-gray-700 uppercase tracking-wider border-b">
                Course Name
              </th>
              <th className="px-6 py-3 text-center text-lg font-bold text-gray-700 uppercase tracking-wider border-b">
                Enrolled Students
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={2} className="px-6 py-4 text-center text-lg text-gray-500 border-b border-gray-200">
                  Loading courses...
                </td>
              </tr>
            ) : courses.length > 0 ? (
              courses.map(course => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-lg border-b border-gray-200 text-center">
                    {course.course_name}
                  </td>
                  <td className="px-6 py-4 text-lg border-b border-gray-200 text-center">
                    {course.enrolled_students}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="px-6 py-4 text-center text-lg text-gray-500 border-b border-gray-200">
                  No courses available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-white font-poppins font-semibold">
      {/* Mobile Hamburger Menu (Right Side) */}
      <div className="md:hidden fixed top-6 right-6 z-50">
        <FiMenu
          className="w-8 h-8 cursor-pointer text-white"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </div>

      {/* Left Navigation Bar */}
      <div
        className={`fixed w-64 bg-black text-white h-full transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-40`}
      >
        {/* Logo Area */}
        <div className="flex items-center p-6">
          <div className="w-20 h-15 rounded-full bg-white flex items-center justify-center">
            <img
              src="./src/assets/skillverse.svg"
              alt="Company logo"
              className="w-12 aspect-square"
            />
          </div>
          <span className="ml-2 text-white flex items-center">
            <span className="text-green-500">●</span> Trainer
            <FiHome
              className="ml-12 w-5 h-5 cursor-pointer hover:text-yellow-500 hover:scale-125 transition-all duration-200"
              onClick={() => navigate('/')}
            />
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-10">
          {[
            { icon: <RiDashboardFill className="w-5 h-5 mr-3" />, label: 'Dashboard', component: 'dashboard' },
            { icon: <FiBook className="w-5 h-5 mr-3" />, label: 'My Courses', component: 'my-courses' },
            { icon: <FiPlusCircle className="w-5 h-5 mr-3" />, label: 'Add Course', component: 'add-course' },
          ].map((item, index) => (
            <div
              key={index}
              className={`flex items-center px-6 py-3 cursor-pointer mb-5 ${
                currentComponent === item.component ? 'bg-yellow-600' : 'hover:bg-gray-800'
              }`}
              onClick={() => {
                setCurrentComponent(item.component);
                setIsSidebarOpen(false); // Close sidebar on mobile after selection
              }}
            >
              {item.icon}
              <span className="text-white">{item.label}</span>
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 bg-white overflow-y-auto px-4 md:px-20 py-6">
        {/* Header */}
        <header className="bg-[#e6b108] rounded-[15px] p-4 md:p-8 flex flex-col md:flex-row items-center">
          <div className="w-40 h-40 md:w-64 md:h-64 bg-gray-200 rounded-full overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src={userInfo.profilePicture}
              alt="Profile"
            />
          </div>
          <div className="md:ml-10 mt-6 md:mt-0 flex flex-col md:flex-row justify-between w-full">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold tracking-[-2px] text-black">{userInfo.name}</h1>
              <p className="text-lg md:text-2xl font-light mt-2 text-black">{userInfo.email}</p>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="mt-8">
          {currentComponent === 'dashboard' && <DashboardContent />}
          {currentComponent === 'add-course' && <AddCourse />}
          {currentComponent === 'add-module' && <AddModule />}
          {currentComponent === 'add-quiz' && <AddQuiz />}
          {currentComponent === 'my-courses' && <MyCourses instructorEmail={userInfo.email} />}
        </main>
      </div>
    </div>
  );
};

export default ContentCreatorDashboard;