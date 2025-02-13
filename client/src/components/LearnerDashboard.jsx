import React, { useState } from "react";
import { FiHome, FiAward, FiBook, FiSettings, FiLogOut } from 'react-icons/fi';
import { useNavigate } from "react-router-dom";
import LearnerMyCourses from './LearnerMyCourses';
import LearnerCertificates from './LearnerCertificates'; 
import Settings from './LearnerSettings';
import { RiDashboardFill } from 'react-icons/ri';

export const LearnerDashboard = () => {
  const [currentComponent, setCurrentComponent] = useState('dashboard');
  const [userInfo, setUserInfo] = useState({
    name: 'Tony Stark',
    email: 'maximumPulse@gmail.com',
    password: '********',
    profilePicture: 'https://via.placeholder.com/150' // Default profile picture
  });
  const navigate = useNavigate();

   // Sample course data
  const continueWatchingCourses = [
    { id: 1, title: "Course 1", image: "https://via.placeholder.com/150", progress: 60 },
    { id: 2, title: "Course 2", image: "https://via.placeholder.com/150", progress: 40 },
    { id: 3, title: "Course 3", image: "https://via.placeholder.com/150", progress: 80 },
  ];

  // Dashboard component
  const DashboardContent = () => (
    <div>
      {/* Continue Watching Section */}
      <div className="mb-12">
        <h3 className="text-3xl font-bold mb-4">Continue Watching</h3>
        <div className="flex justify-between space-x-8">
          {continueWatchingCourses.map((course) => (
            <div
              key={course.id}
              className="w-1/3 text-center border border-gray-300 rounded-lg shadow-lg p-3" // Decreased padding for a smaller container
            >
              <img src={course.image} alt={course.title} className="w-full h-40 object-cover rounded-lg" /> {/* Decreased image height */}
              <p className="mt-2 text-sm font-semibold">{course.title}</p>

              {/* Progress Bar */}
              <div className="mt-2">
                <p className="text-sm font-light text-gray-500">Progress</p>
                <div className="w-full bg-gray-200 h-2 rounded-full">
                  <div
                    className="h-2 rounded-full bg-green-500"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
  );

  // Function to handle logout
  const handleLogout = () => {
    // Perform any logout logic here (e.g., clearing tokens)
    navigate('/login'); // Navigate to LoginPage
  };

  // Function to update user info
  const updateUserInfo = (newInfo) => {
    setUserInfo(newInfo);
  };

  return (
    <div className="flex h-screen bg-white font-poppins font-semibold">
      {/* Left Navigation Bar */}
      <div className="fixed w-[247px] bg-black text-white h-full">
        {/* Logo Area */}
        <div className="flex items-center p-6">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
            <span className="text-black">⌖</span>
          </div>
          <span className="ml-2 text-white flex items-center">
            <span className="text-green-500">●</span> Learner
            <FiHome 
              className="ml-12 w-5 h-5 cursor-pointer hover:text-yellow-500 hover:scale-125 transition-all duration-200"
              onClick={() => navigate('/')}
            />
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-10">
          <div 
            className={`flex items-center px-6 py-3 cursor-pointer mb-[50px] ${
              currentComponent === 'dashboard' ? 'bg-yellow-600' : 'hover:bg-gray-800'
            }`}
            onClick={() => setCurrentComponent('dashboard')}
          >
            <RiDashboardFill className="w-5 h-5 mr-3" />
            <span className="text-white">Dashboard</span>
          </div>

          {/* <div 
            className={`flex items-center px-6 py-3 cursor-pointer mb-[50px] ${
              currentComponent === 'my-courses' ? 'bg-yellow-600' : 'hover:bg-gray-800'
            }`}
            onClick={() => setCurrentComponent('my-courses')}
          >
            <FiBook className="w-5 h-5 mr-3" />
            <span className="text-white">My Courses</span>
          </div> */}

          <div 
            className={`flex items-center px-6 py-3 cursor-pointer mb-[50px] ${
              currentComponent === 'certificates' ? 'bg-yellow-600' : 'hover:bg-gray-800'
            }`}
            onClick={() => setCurrentComponent('certificates')}
          >
            <FiAward className="w-5 h-5 mr-3" />
            <span className="text-white">Certificates</span>
          </div>

          <div 
            className={`flex items-center px-6 py-3 cursor-pointer mb-[50px] ${
              currentComponent === 'settings' ? 'bg-yellow-600' : 'hover:bg-gray-800'
            }`}
            onClick={() => setCurrentComponent('settings')}
          >
            <FiSettings className="w-5 h-5 mr-3" />
            <span className="text-white">Settings</span>
          </div>

          {/* Logout at bottom */}
          <div className="absolute bottom-0 w-[247px] border-t border-gray-700">
            <div className="flex items-center px-6 py-3 cursor-pointer hover:bg-gray-800" onClick={handleLogout}>
              <FiLogOut className="w-5 h-5 mr-3" />
              <span className="text-red-500">Logout</span>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-[247px] bg-white overflow-y-auto px-20 py-6">
        {/* Header */}
        <header className="bg-[#ffc134] rounded-[15px] p-8 flex items-center">
          <div className="w-[260px] h-[200px] bg-gray-200 rounded-full overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src={userInfo.profilePicture}
              alt="Profile"
            />
          </div>
          <div className="ml-10 flex justify-between w-full">
            <div>
              <h1 className="text-[40px] font-bold tracking-[-2px]">{userInfo.name}</h1>
              <p className="text-[22px] font-light mt-2">{userInfo.email}</p>
            </div>
            <div>
              <h2 className="text-[50px] font-bold tracking-[-2px] px-[60px]">YOUR DASHBOARD</h2>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="mt-8">
          {currentComponent === 'dashboard' && <DashboardContent />}
          {currentComponent === 'my-courses' && <LearnerMyCourses />}
          {currentComponent === 'certificates' && <LearnerCertificates />}
          {currentComponent === 'settings' && 
            <Settings 
              userInfo={userInfo} 
              updateUserInfo={updateUserInfo} 
            />
          }
        </main>
      </div>
    </div>
  );
};

export default LearnerDashboard;
