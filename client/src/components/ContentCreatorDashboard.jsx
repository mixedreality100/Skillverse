import React, { useState } from "react";
import { FiHome, FiPlusCircle, FiBook, FiSettings, FiLogOut, FiMenu } from 'react-icons/fi';
import { useNavigate } from "react-router-dom";
import AddCourse from './AddCourse';
import AddModule from './AddModule';
import AddQuiz from './AddQuiz';
import MyCourses from './MyCourses';
import Settings from './Settings';
import { RiDashboardFill } from 'react-icons/ri';

export const ContentCreatorDashboard = () => {
  const [currentComponent, setCurrentComponent] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For mobile sidebar toggle
  const [userInfo, setUserInfo] = useState(() => {
    const savedUserInfo = localStorage.getItem('userInfo');
    return savedUserInfo ? JSON.parse(savedUserInfo) : {
      name: 'Content Creator',
      email: 'contentCreator@gmail.com',
      password: '',
      profilePicture: 'https://via.placeholder.com/150'
    };
  });
  const navigate = useNavigate();

  const courses = [
    { id: 1, name: 'Medicinal Plants', enrolledStudents: 1 }
  ];

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
            {courses.map(course => (
              <tr key={course.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-lg border-b border-gray-200 text-center">
                  {course.name}
                </td>
                <td className="px-6 py-4 text-lg border-b border-gray-200 text-center">
                  {course.enrolledStudents}
                </td>
              </tr>
            ))}
            {courses.length === 0 && (
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

  // Function to handle logout
  const handleLogout = () => {
    navigate('/login');
  };

  // Function to update user info
  const updateUserInfo = (newInfo) => {
    setUserInfo(newInfo);
    localStorage.setItem('userInfo', JSON.stringify(newInfo));
  };

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
            { icon: <FiSettings className="w-5 h-5 mr-3" />, label: 'Settings', component: 'settings' },
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

          {/* Logout at bottom */}
          <div className="absolute bottom-0 w-64 border-t border-gray-700">
            <div className="flex items-center px-6 py-3 cursor-pointer hover:bg-gray-800" onClick={handleLogout}>
              <FiLogOut className="w-5 h-5 mr-3" />
              <span className="text-red-500">Logout</span>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 bg-white overflow-y-auto px-4 md:px-20 py-6">
        {/* Header */}
        <header className="bg-[#555555] rounded-[15px] p-4 md:p-8 flex flex-col md:flex-row items-center">
          <div className="w-40 h-40 md:w-64 md:h-64 bg-gray-200 rounded-full overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src={userInfo.profilePicture}
              alt="Profile"
            />
          </div>
          <div className="md:ml-10 mt-6 md:mt-0 flex flex-col md:flex-row justify-between w-full">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold tracking-[-2px] text-white">{userInfo.name}</h1>
              <p className="text-lg md:text-2xl font-light mt-2 text-white">{userInfo.email}</p>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="mt-8">
          {currentComponent === 'dashboard' && <DashboardContent />}
          {currentComponent === 'add-course' && <AddCourse />}
          {currentComponent === 'add-module' && <AddModule />}
          {currentComponent === 'add-quiz' && <AddQuiz />}
          {currentComponent === 'my-courses' && <MyCourses />}
          {currentComponent === 'settings' && (
            <Settings userInfo={userInfo} updateUserInfo={updateUserInfo} />
          )}
        </main>
      </div>
    </div>
  );
};

export default ContentCreatorDashboard;