"use client"

import { createContext, useContext, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { FiHome, FiAward, FiSettings, FiLogOut, FiMenu } from "react-icons/fi";
import { RiDashboardFill } from "react-icons/ri";
import { useUser, useAuth } from "@clerk/clerk-react";
import LearnerCertificates from "./LearnerCertificates";
import Settings from "./LearnerSettings";
import ProgressCalculator from "./ProgressCalculator";

// Simple Skeleton component since we don't have access to shadcn/ui
const Skeleton = ({ className }) => <div className={`animate-pulse bg-gray-300 ${className}`}></div>;

// 1. Create the Dashboard Context
const DashboardContext = createContext();

// 2. Define the initial state and reducer for managing state
const initialState = {
  currentComponent: "dashboard",
  isSidebarOpen: false,
  userInfo: {
    id: null,
    name: "Dylan Frias",
    email: "2205809.dylan.sdcce@vvm.edu.in",
    profilePicture:
      "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yc2ZPYWFqMmdhNEl1NGxzSXhDck1NOTZKamQifQ",
  },
  enrolledCourses: [],
  isLoading: true,
};

const dashboardReducer = (state, action) => {
  switch (action.type) {
    case "SET_CURRENT_COMPONENT":
      return { ...state, currentComponent: action.payload };
    case "SET_SIDEBAR_OPEN":
      return { ...state, isSidebarOpen: action.payload };
    case "SET_USER_INFO":
      return { ...state, userInfo: action.payload };
    case "SET_ENROLLED_COURSES":
      return { ...state, enrolledCourses: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

// 3. DashboardContent Component (Updated to use context)
const DashboardContent = () => {
  const { enrolledCourses, isLoading, userInfo } = useContext(DashboardContext);

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

// 4. Main LearnerDashboard Component
export const LearnerDashboard = () => {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);
  const navigate = useNavigate();
  const { user } = useUser();
  const auth = useAuth();

  // Fetch user details and enrolled courses (same logic as before)
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        await fetchUserDetails();
      }
    };
    
    fetchData();
  }, [user]);

  useEffect(() => {
    if (state.userInfo.id) {
      fetchEnrolledCourses();
    }
  }, [state.userInfo.id]);

  const fetchUserDetails = async () => {
    try {
      if (user) {
        const response = await fetch(`http://localhost:3000/api/user-id?email=${user.primaryEmailAddress?.emailAddress}`);
        if (response.ok) {
          const { userId } = await response.json();
          console.log(`Received user ID from backend: ${userId}`);
          
          dispatch({
            type: "SET_USER_INFO",
            payload: {
              id: userId,
              name: user.fullName || state.userInfo.name,
              email: user.primaryEmailAddress?.emailAddress || state.userInfo.email,
              profilePicture: user.imageUrl || state.userInfo.profilePicture,
            },
          });
        } else {
          console.error('Failed to fetch user ID');
        }
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const fetchEnrolledCourses = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      console.log("Fetching enrolled courses for user ID:", state.userInfo.id);
      
      if (state.userInfo && state.userInfo.id) {
        const response = await fetch(`http://localhost:3000/api/enrolled-courses/${state.userInfo.id}`);
        
        console.log("Response status:", response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log("Received course data:", data);
          
          if (data && data.length > 0) {
            dispatch({
              type: "SET_ENROLLED_COURSES",
              payload: data.map(course => ({
                id: course.id,
                course_id: course.id,
                course_name: course.course_name,
                level: course.level,
                course_image: course.course_image,
              })),
            });
          } else {
            console.warn("No courses found for this user");
            dispatch({ type: "SET_ENROLLED_COURSES", payload: [] });
          }
        } else {
          const errorText = await response.text();
          console.error('Failed to fetch courses. Response:', errorText);
          dispatch({ type: "SET_ENROLLED_COURSES", payload: [] });
        }
      } else {
        console.warn("User info is incomplete");
        dispatch({ type: "SET_ENROLLED_COURSES", payload: [] });
      }
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
      dispatch({ type: "SET_ENROLLED_COURSES", payload: [] });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

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

  const handleLogout = () => {
    if (auth?.signOut) {
      auth.signOut();
    }
    navigate("/login");
  };

  const updateUserInfo = (newInfo) => {
    dispatch({ type: "SET_USER_INFO", payload: newInfo });
    localStorage.setItem("userInfo", JSON.stringify(newInfo));
  };

  return (
    // 5. Provide the context to the component tree
    <DashboardContext.Provider value={{ ...state, dispatch }}>
      <div className="flex h-screen bg-white font-poppins font-semibold">
        {/* Mobile Hamburger Menu (Right Side) */}
        <div className="md:hidden fixed top-6 right-6 z-50">
          <FiMenu
            className="w-8 h-8 cursor-pointer text-white"
            onClick={() => dispatch({ type: "SET_SIDEBAR_OPEN", payload: !state.isSidebarOpen })}
          />
        </div>

        {/* Left Navigation Bar */}
        <div
          className={`fixed w-64 bg-black text-white h-full transform ${
            state.isSidebarOpen ? "translate-x-0" : "-translate-x-full"
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
                state.currentComponent === "dashboard" ? "bg-yellow-600" : "hover:bg-gray-800"
              }`}
              onClick={() => {
                dispatch({ type: "SET_CURRENT_COMPONENT", payload: "dashboard" });
                dispatch({ type: "SET_SIDEBAR_OPEN", payload: false });
              }}
            >
              <RiDashboardFill className="w-5 h-5 mr-3" />
              <span className="text-white">Dashboard</span>
            </div>
            <div
              className={`flex items-center px-6 py-3 cursor-pointer mb-[50px] ${
                state.currentComponent === "certificates" ? "bg-yellow-600" : "hover:bg-gray-800"
              }`}
              onClick={() => {
                dispatch({ type: "SET_CURRENT_COMPONENT", payload: "certificates" });
                dispatch({ type: "SET_SIDEBAR_OPEN", payload: false });
              }}
            >
              <FiAward className="w-5 h-5 mr-3" />
              <span className="text-white">Certificates</span>
            </div>
            {/* Commented out sections remain unchanged */}
            {/* <div
              className={`flex items-center px-6 py-3 cursor-pointer mb-[50px] ${
                state.currentComponent === "settings" ? "bg-yellow-600" : "hover:bg-gray-800"
              }`}
              onClick={() => {
                dispatch({ type: "SET_CURRENT_COMPONENT", payload: "settings" });
                dispatch({ type: "SET_SIDEBAR_OPEN", payload: false });
              }}
            >
              <FiSettings className="w-5 h-5 mr-3" />
              <span className="text-white">Settings</span>
            </div> */}
            {/* <div className="absolute bottom-0 w-64 border-t border-gray-700">
              <div className="flex items-center px-6 py-3 cursor-pointer hover:bg-gray-800" onClick={handleLogout}>
                <FiLogOut className="w-5 h-5 mr-3" />
                <span className="text-red-500">Logout</span>
              </div>
            </div> */}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 md:ml-64 bg-white overflow-y-auto px-4 md:px-20 py-6">
          <header className="bg-[#e6b108] rounded-[15px] p-4 md:p-8 flex flex-col md:flex-row items-center">
            <div className="w-40 h-40 md:w-64 md:h-64 bg-gray-200 rounded-full overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src={state.userInfo.profilePicture || "/placeholder.svg"}
                alt="Profile"
              />
            </div>
            <div className="md:ml-10 mt-6 md:mt-0 flex flex-col md:flex-row justify-between w-full">
              <div>
                <h1 className="text-2xl md:text-4xl font-bold tracking-[-2px] text-black">{state.userInfo.name}</h1>
                <p className="text-lg md:text-2xl font-light mt-2 text-black">{state.userInfo.email}</p>
              </div>
            </div>
          </header>
          <main className="mt-8">
            {state.currentComponent === "dashboard" && <DashboardContent />}
            {state.currentComponent === "certificates" && <LearnerCertificates />}
            {state.currentComponent === "settings" && <Settings userInfo={state.userInfo} updateUserInfo={updateUserInfo} />}
          </main>
        </div>
      </div>
    </DashboardContext.Provider>
  );
};

export default LearnerDashboard;