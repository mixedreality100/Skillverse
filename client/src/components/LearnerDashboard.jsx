import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiHome, FiAward, FiBook, FiSettings, FiLogOut } from 'react-icons/fi';
import { RiDashboardFill } from 'react-icons/ri';
import LearnerMyCourses from './LearnerMyCourses';
import LearnerCertificates from './LearnerCertificates'; 
import Settings from './LearnerSettings';

export const LearnerDashboard = () => {
  const [currentComponent, setCurrentComponent] = useState('dashboard');
  const [userInfo, setUserInfo] = useState({
    id: 9, // Assuming user ID is 9
    name: 'Tony Stark',
    email: 'maximumPulse@gmail.com',
    profilePicture: 'https://via.placeholder.com/150' // Default profile picture
  });
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/users/${userInfo.id}`);
        if (response.ok) {
          const data = await response.json();
          setUserInfo(data);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    const fetchEnrolledCourses = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/enrollments/${userInfo.id}`);
        if (response.ok) {
          const data = await response.json();
          setEnrolledCourses(data);
        }
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
      }
    };

    fetchUserDetails();
    fetchEnrolledCourses();
  }, [userInfo.id]);

  const handleLogout = () => {
    navigate('/login');
  };

  const updateUserInfo = (newInfo) => {
    setUserInfo(newInfo);
    localStorage.setItem('userInfo', JSON.stringify(newInfo)); // Update localStorage
  };

  const fetchCourseDetails = async (courseId) => {
    try {
      const response = await fetch(`http://localhost:3000/courses/${courseId}`);
      if (response.ok) {
        const course = await response.json();
        return course;
      }
    } catch (error) {
      console.error('Error fetching course details:', error);
    }
  };

  const DashboardContent = () => {
    if (!enrolledCourses) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        <h3 className="text-3xl font-bold mb-4">Enrolled Courses</h3>
        <div className="flex flex-wrap gap-4">
          {enrolledCourses.map((enrollment) => {
            const courseId = enrollment.course_id || 6; // Fallback to course ID 6 if undefined
            return (
              <div key={enrollment.id} className="w-1/3 text-center border border-gray-300 rounded-lg shadow-lg p-3 relative">
                {courseId ? (
                  <React.Suspense fallback={<div className="w-full h-40 bg-gray-300 rounded-lg" />}>
                    <CourseImage courseId={courseId} />
                  </React.Suspense>
                ) : (
                  <div className="w-full h-40 bg-gray-300 rounded-lg" />
                )}
                <p className="absolute top-[75px] left-0 w-full text-white bg-opacity-0 bg-black p-2 rounded-t-lg text-4xl">MEDICINAL PLANTS</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const CourseImage = React.memo(({ courseId }) => {
    const [course, setCourse] = useState(null);

    useEffect(() => {
      const fetchCourse = async () => {
        const courseDetails = await fetchCourseDetails(courseId);
        setCourse(courseDetails);
      };

      fetchCourse();
    }, [courseId]);

    if (!course) return null;

    return (
      <img
        src={`data:image/jpeg;base64,${course.course_image}`}
        alt={course.course_name}
        className="w-full h-40 object-cover rounded-lg"
      />
    );
  });

  return (
    <div className="flex h-screen bg-white font-poppins font-semibold">
      <div className="fixed w-[247px] bg-black text-white h-full">
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
          <div className="absolute bottom-0 w-[247px] border-t border-gray-700">
            <div className="flex items-center px-6 py-3 cursor-pointer hover:bg-gray-800" onClick={handleLogout}>
              <FiLogOut className="w-5 h-5 mr-3" />
              <span className="text-red-500">Logout</span>
            </div>
          </div>
        </nav>
      </div>
      <div className="flex-1 ml-[247px] bg-white overflow-y-auto px-20 py-6">
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
            
          </div>
        </header>
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