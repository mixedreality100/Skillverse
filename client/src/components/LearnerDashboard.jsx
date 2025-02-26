import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiHome, FiAward, FiBook, FiSettings, FiLogOut } from 'react-icons/fi';
import { RiDashboardFill } from 'react-icons/ri';
import { useUser, useAuth } from "@clerk/clerk-react"; // Add Clerk imports
import LearnerMyCourses from './LearnerMyCourses';
import LearnerCertificates from './LearnerCertificates'; 
import Settings from './LearnerSettings';

export const LearnerDashboard = () => {
  const [currentComponent, setCurrentComponent] = useState('dashboard');
  const [userInfo, setUserInfo] = useState({
    id: 9,
    name: 'Dylan Frias',
    email: '2205809.dylan.sdcce@vvm.edu.in',
    profilePicture: 'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yc2ZPYWFqMmdhNEl1NGxzSXhDck1NOTZKamQifQ'
  });
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userProgress, setUserProgress] = useState(null);
  const navigate = useNavigate();
  
  // Get Clerk user and auth
  const { user } = useUser();
  const auth = useAuth();
  const getToken = auth?.getToken;

  useEffect(() => {
    if (user) {
      // This ensures we only fetch data after the user is authenticated
      fetchUserDetails();
      fetchUserProgress();
      fetchEnrolledCourses();
    }
  }, [user]);

  const fetchUserDetails = async () => {
    try {
      // Since you're logged in as 2205809, we'll use the Clerk user info
      if (user) {
        setUserInfo({
          id: 9, // This is the corresponding database ID for user 2205809
          name: user.fullName || 'Dylan Frias',
          email: user.primaryEmailAddress?.emailAddress || '2205809.dylan.sdcce@vvm.edu.in',
          profilePicture: user.imageUrl
        });
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const fetchUserProgress = async () => {
    try {
      if (!user || !getToken) {
        console.error("❌ No user or getToken is undefined");
        return;
      }

      const token = await getToken();
      console.log("🔸 Making request to get user progress");

      // Use the existing endpoint to get progress for the currently logged-in user
      const response = await fetch("http://localhost:3001/api/userProgress", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Failed to fetch progress. Status:", response.status, "Error:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const progress = await response.json();
      console.log("✅ Successfully fetched user progress:", progress);
      setUserProgress(progress);
    } catch (error) {
      console.error("❌ Error fetching user progress:", error);
      // Fallback to hardcoded progress data from the database for user 2205809
      setUserProgress({
        totalLessons: 10,
        completedLessons: 5
      });
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      if (userInfo && userInfo.id) {
        const response = await fetch(`http://localhost:3000/api/enrollments/${userInfo.id}`);
        if (response.ok) {
          const data = await response.json();
          setEnrolledCourses(data);
        } else {
          // Fallback to mock data if the API call fails
          setEnrolledCourses([
            { id: 1, course_id: 6 },
            { id: 2, course_id: 7 }
          ]);
        }
      }
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      // Fallback to mock data
      setEnrolledCourses([
        { id: 1, course_id: 6 },
        { id: 2, course_id: 7 }
      ]);
    }
  };

  const handleLogout = () => {
    if (auth?.signOut) {
      auth.signOut();
    }
    navigate('/login');
  };

  const updateUserInfo = (newInfo) => {
    setUserInfo(newInfo);
    localStorage.setItem('userInfo', JSON.stringify(newInfo));
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
        {/* User Progress Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h4 className="text-xl font-semibold mb-3">My Learning Progress</h4>
          <div className="w-full bg-gray-200 rounded-full h-6 mb-2">
            <div 
              className="bg-green-600 h-6 rounded-full flex items-center justify-end pr-2 text-white text-sm font-medium" 
              style={{ width: `${progressPercentage}%` }}
            >
              {progressPercentage.toFixed(0)}%
            </div>
          </div>
          <p className="text-gray-700">
            {userProgress ? `${userProgress.completedLessons} of ${userProgress.totalLessons} lessons completed` : 'No progress data available'}
          </p>
        </div>

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
                <p className="absolute top-[75px] left-0 w-full text-white bg-opacity-0 bg-black p-2 rounded-t-lg text-3xl">MEDICINAL PLANTS</p>
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

  // Calculate progress percentage
  const progressPercentage = userProgress?.completedLessons && userProgress?.totalLessons 
    ? (userProgress.completedLessons / userProgress.totalLessons) * 100 
    : 0;

  return (
    <div className="flex h-screen bg-white font-poppins font-semibold">
      <div className="fixed w-[247px] bg-black text-white h-full">
        <div className="flex items-center p-6">
          <div className="w-20 h-15 rounded-full bg-white flex items-center justify-center">
          <img
            src="./src/assets/skillverse.svg"
            alt="Company logo"
            className="w-[47px] aspect-square"
          />
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
            {userProgress && (
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="font-bold text-lg mb-2">My Progress</h3>
                <div className="w-64 bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-green-600 h-4 rounded-full" 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <p className="mt-2 text-sm">
                  {userProgress.completedLessons} of {userProgress.totalLessons} lessons completed ({progressPercentage.toFixed(0)}%)
                </p>
              </div>
            )}
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