"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FiHome, FiAward, FiSettings, FiLogOut, FiMenu } from "react-icons/fi"
import { RiDashboardFill } from "react-icons/ri"
import { useUser, useAuth } from "@clerk/clerk-react"
import LearnerCertificates from "./LearnerCertificates"
import Settings from "./LearnerSettings"
import ProgressCalculator from "./ProgressCalculator"

// Simple Skeleton component since we don't have access to shadcn/ui
const Skeleton = ({ className }) => <div className={`animate-pulse bg-gray-300 ${className}`}></div>

export const LearnerDashboard = () => {
  const [currentComponent, setCurrentComponent] = useState("dashboard")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [userInfo, setUserInfo] = useState({
    id: 14,
    name: "Dylan Frias",
    email: "2205809.dylan.sdcce@vvm.edu.in",
    profilePicture:
      "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yc2ZPYWFqMmdhNEl1NGxzSXhDck1NOTZKamQifQ",
  })
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  // Get Clerk user and auth
  const { user } = useUser()
  const auth = useAuth()

  useEffect(() => {
    if (user) {
      fetchUserDetails()
      fetchEnrolledCourses()
    }
  }, [user])

  const fetchUserDetails = async () => {
    try {
      if (user) {
        setUserInfo({
          id: 14, // Manually set user ID to 14
          name: user.fullName || "Dylan Frias",
          email: user.primaryEmailAddress?.emailAddress || "2205809.dylan.sdcce@vvm.edu.in",
          profilePicture: user.imageUrl,
        })
      }
    } catch (error) {
      console.error("Error fetching user details:", error)
    }
  }

  const fetchEnrolledCourses = async () => {
    setIsLoading(true);
    try {
      if (userInfo && userInfo.id) {
        const response = await fetch(`http://localhost:3000/api/enrolled-courses/${userInfo.id}`);
        if (response.ok) {
          const data = await response.json();
          // Make sure each course has a valid course_id
          setEnrolledCourses(data.map(course => ({
            id: course.id,
            course_id: course.id, // Ensure course_id is set properly
            course_name: course.course_name,
            level: course.level,
            course_image: course.course_image
          })));
        } else {
          // Fallback to mock data if the API call fails
          setEnrolledCourses([
            { id: 1, course_id: 1, course_name: "Introduction to Programming", level: "Beginner", course_image: null },
            { id: 2, course_id: 2, course_name: "Advanced Programming", level: "Intermediate", course_image: null },
          ]);
        }
      }
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
      // Fallback to mock data
      setEnrolledCourses([
        { id: 1, course_id: 1, course_name: "Introduction to Programming", level: "Beginner", course_image: null },
        { id: 2, course_id: 2, course_name: "Advanced Programming", level: "Intermediate", course_image: null },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    if (auth?.signOut) {
      auth.signOut()
    }
    navigate("/login")
  }

  const updateUserInfo = (newInfo) => {
    setUserInfo(newInfo)
    localStorage.setItem("userInfo", JSON.stringify(newInfo))
  }
  const fetchCourseDetails = async (courseId) => {
    try {
      if (isNaN(courseId)) {
        console.error('Invalid courseId:', courseId);
        return null;
      }
  
      const response = await fetch(`http://localhost:3000/courses/${courseId}`);
      if (response.ok) {
        const course = await response.json();
        return course;
      } else {
        console.error(`Failed to fetch course details for course ${courseId}`);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching course details for course ${courseId}:`, error);
      return null;
    }
  };
  const DashboardContent = () => {
    if (isLoading) {
      return (
        <div>
          <h3 className="text-3xl font-bold mb-4">Enrolled Courses</h3>
          <div className="flex flex-wrap gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-full md:w-1/3 border border-gray-300 rounded-lg shadow-lg p-3">
                <Skeleton className="w-full h-40 rounded-lg" />
                <Skeleton className="h-6 w-3/4 mt-4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </div>
            ))}
          </div>
        </div>
      );
    }
  
    if (!enrolledCourses || enrolledCourses.length === 0) {
      return <div className="text-center text-gray-500">No enrolled courses yet.</div>;
    }
  
    return (
      <div>
        <h3 className="text-3xl font-bold mb-4">Enrolled Courses</h3>
        <div className="flex flex-wrap gap-4">
          {enrolledCourses.map((enrollment) => (
            <div
              key={enrollment.id}
              className="w-full md:w-1/3 text-center border border-gray-300 rounded-lg shadow-lg p-3 relative"
            >
              <img
                src={enrollment.course_image || "/placeholder.jpg"}
                alt={enrollment.course_name}
                className="w-full h-40 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = "/placeholder.jpg";
                  e.target.onerror = null;
                }}
              />
              <p className="mt-3 text-lg font-semibold">{enrollment.course_name}</p>
              <p className="text-sm text-gray-600">{enrollment.level}</p>
              <div className="mt-4">
                {/* Pass the correct courseId and ensure it's a number */}
                <ProgressCalculator 
                  userId={userInfo.id} 
                  courseId={enrollment.course_id || enrollment.id} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-white font-poppins font-semibold">
      {/* Mobile Hamburger Menu (Right Side) */}
      <div className="md:hidden fixed top-6 right-6 z-50">
        <FiMenu className="w-8 h-8 cursor-pointer text-white" onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      </div>

      {/* Left Navigation Bar */}
      <div
        className={`fixed w-64 bg-black text-white h-full transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-40`}
      >
        <div className="flex items-center p-6">
          <div className="w-20 h-15 rounded-full bg-white flex items-center justify-center">
            <img src="./src/assets/skillverse.svg" alt="Company logo" className="w-[47px] aspect-square" />
          </div>
          <span className="ml-2 text-white flex items-center">
            <span className="text-green-500">●</span> Learner
            <FiHome
              className="ml-12 w-5 h-5 cursor-pointer hover:text-yellow-500 hover:scale-125 transition-all duration-200"
              onClick={() => navigate("/")}
            />
          </span>
        </div>
        <nav className="mt-10">
          <div
            className={`flex items-center px-6 py-3 cursor-pointer mb-[50px] ${
              currentComponent === "dashboard" ? "bg-yellow-600" : "hover:bg-gray-800"
            }`}
            onClick={() => {
              setCurrentComponent("dashboard")
              setIsSidebarOpen(false)
            }}
          >
            <RiDashboardFill className="w-5 h-5 mr-3" />
            <span className="text-white">Dashboard</span>
          </div>
          <div
            className={`flex items-center px-6 py-3 cursor-pointer mb-[50px] ${
              currentComponent === "certificates" ? "bg-yellow-600" : "hover:bg-gray-800"
            }`}
            onClick={() => {
              setCurrentComponent("certificates")
              setIsSidebarOpen(false)
            }}
          >
            <FiAward className="w-5 h-5 mr-3" />
            <span className="text-white">Certificates</span>
          </div>
          <div
            className={`flex items-center px-6 py-3 cursor-pointer mb-[50px] ${
              currentComponent === "settings" ? "bg-yellow-600" : "hover:bg-gray-800"
            }`}
            onClick={() => {
              setCurrentComponent("settings")
              setIsSidebarOpen(false)
            }}
          >
            <FiSettings className="w-5 h-5 mr-3" />
            <span className="text-white">Settings</span>
          </div>
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
        <header className="bg-[#555555] rounded-[15px] p-4 md:p-8 flex flex-col md:flex-row items-center">
          <div className="w-40 h-40 md:w-64 md:h-64 bg-gray-200 rounded-full overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src={userInfo.profilePicture || "/placeholder.svg"}
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
        <main className="mt-8">
          {currentComponent === "dashboard" && <DashboardContent />}
          {currentComponent === "certificates" && <LearnerCertificates />}
          {currentComponent === "settings" && <Settings userInfo={userInfo} updateUserInfo={updateUserInfo} />}
        </main>
      </div>
    </div>
  )
}

export default LearnerDashboard