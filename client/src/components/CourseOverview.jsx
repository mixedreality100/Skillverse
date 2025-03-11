import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavButton from "./NavButton";
import ProfileButton from "./profile";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  useAuth,
  useUser,
  useClerk,
} from "@clerk/clerk-react";
import skillverselogo from "../assets/skillverse.svg";

const CourseOverview = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar visibility

  // Effect to save user data when logged in
  useEffect(() => {
    const saveUser = async () => {
      if (isSignedIn && user) {
        try {
          const response = await fetch("http://localhost:3001/api/saveUser", {
            method: "POST",
            credentials: "include",
          });

          if (!response.ok) {
            console.error("Failed to save user data");
          }
        } catch (error) {
          console.error("Error saving user:", error);
        }
      }
    };

    if (isLoaded) {
      saveUser();
    }
  }, [isSignedIn, isLoaded, user]);

  useEffect(() => {
    const checkEnrollment = async () => {
      if (isSignedIn && courseId) {
        try {
          const response = await fetch(
            `http://localhost:3001/api/checkEnrollment/${courseId}`,
            {
              credentials: "include",
            }
          );
          const data = await response.json();
          setIsEnrolled(data.isEnrolled);
        } catch (error) {
          console.error("Failed to check enrollment:", error);
        }
      }
      setIsLoading(false);
    };

    if (isLoaded) {
      checkEnrollment();
    }
  }, [courseId, isSignedIn, isLoaded]);

  const handleEnrollClick = async () => {
    if (!isSignedIn) {
      // Open Clerk's sign-in modal with redirect URL
      openSignIn({
        redirectUrl: `/course/${courseId}`,
        appearance: {
          elements: {
            rootBox: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            },
          },
        },
      });
      return;
    }

    if (isEnrolled) {
      navigate(`/plants/${courseId}`, { 
        state: { fromApp: true }  // Add state here too
      });
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/api/enrollCourse/${courseId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        // Add navigation state for protected route
        navigate(`/plants/${courseId}`, { 
          state: { fromApp: true }  // This is crucial for route protection
        });
      } else {
        console.error("Failed to enroll");
      }
    } catch (error) {
      console.error("Enrollment error:", error);
    }
  };

  // Use this effect with higher priority to force scroll to top
  useEffect(() => {
    // Force immediate scroll to top right when component mounts
    window.scrollTo(0, 0);
    // Add a slight delay as a fallback in case the immediate scroll didn't work
    const scrollTimer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
    }, 50);
    return () => clearTimeout(scrollTimer);
  }, []);

  return (
    <div className="flex flex-row justify-center w-full bg-white">
      <style>
        {`
          @media (max-width: 768px) {
            .course-overview-container nav {
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
              padding: 0 16px;
            }   
            .course-overview-container nav .logoicon {
              position: absolute;
             left: 50%;
             transform: translateX(-50%);
             top: 10px; /* Adjust this value to move the logo down */
            }
            .course-overview-container nav .nav-buttons {
              display: none; /* Hide the buttons on mobile */
            }
           .course-overview-container nav .burger-menu {
              display: block; /* Show the burger menu */
               cursor: pointer;
              margin-left: auto; /* Move burger menu to the right */
               font-size: 24px; /* Increase the size of the icon */
                padding: 8px; /* Add some padding for better clickability */
              }
            .course-overview-container nav .login-button {
              display: none; /* Hide the login button on mobile */
            }
            .course-overview-container nav .profile-button {
              display: none; /* Hide the PFP on mobile */
            }
              
            .sidebar {
              position: fixed;
              top: 0;
              right: ${isSidebarOpen ? "0" : "-100%"};
              width: 60%;
              height: 100%;
              background: white;
              box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
              transition: right 0.3s ease;
              z-index: 1000;
              padding: 16px;
            }
            .sidebar .flex {
              flex-direction: column;
              gap: 16px;
            }
            .overlay {
              display: ${isSidebarOpen ? "block" : "none"};
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: rgba(0, 0, 0, 0.5);
              z-index: 999;
            }
          }
          @media (min-width: 769px) {
            .course-overview-container nav .burger-menu {
              display: none; /* Hide the burger menu on desktop */
            }
            .sidebar {
              display: none; /* Hide the sidebar on desktop */
            }
            .overlay {
              display: none; /* Hide the overlay on desktop */
            }
          }
        `}
      </style>
      <div className="course-overview-container bg-[#ffffff] overflow-x-hidden w-[1440px] relative rounded-lg">
        <nav className="flex justify-between items-center w-full max-w-[1440px] mt-[30px] ml-[50px]">
          <img
            src={skillverselogo}
            alt="logo"
            className="w-[58px] aspect-square left-[30px] logoicon"
            onClick={() => navigate("/")}
          />
          <div className="nav-buttons flex gap-9">
            <NavButton
              className="transform transition-transform duration-300 hover:scale-110 text-black"
              onClick={() => {
                navigate("/");
                setTimeout(() => {
                  const coursesSection = document.getElementById("courses");
                  if (coursesSection) {
                    coursesSection.scrollIntoView({ behavior: "smooth" });
                  }
                }, 100);
              }}
            >
              Courses
            </NavButton>
            <NavButton
              className="transform transition-transform duration-300 hover:scale-110 text-black"
              onClick={() => navigate("/explore")}
            >
              Explore
            </NavButton>
            <NavButton
              className="transform transition-transform duration-300 hover:scale-110 text-black"
              onClick={() => navigate("/aboutus")}
            >
              About Us
            </NavButton>
          </div>
          <div
            className="burger-menu"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            ☰
          </div>
          <div className="flex items-center gap-5 login-button">
            <SignedOut>
              <SignInButton>
                <button className="text-black transform transition-transform duration-300 hover:scale-110 rounded-full border-2 border-black px-8 py-3">
                  Login
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <ProfileButton
                className="profile-button"
                onClick={() => signOut()}
              />
            </SignedIn>
          </div>
        </nav>
        {/* Sidebar for Mobile */}
        <div className="sidebar">
          <div className="flex flex-col gap-4">
            <NavButton
              className="text-black"
              onClick={() => {
                navigate("/");
                setIsSidebarOpen(false);
              }}
            >
              Courses
            </NavButton>
            <NavButton
              className="text-black"
              onClick={() => {
                navigate("/explore");
                setIsSidebarOpen(false);
              }}
            >
              Explore
            </NavButton>
            <NavButton
              className="text-black"
              onClick={() => {
                navigate("/aboutus");
                setIsSidebarOpen(false);
              }}
            >
              About Us
            </NavButton>
          </div>
        </div>
        {/* Overlay for Sidebar */}
        {isSidebarOpen && (
          <div
            className="overlay"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}
        {/* Rest of the content */}
        
        <div className="relative mt-16 mx-auto w-[100%]">
          <div className="relative flex flex-col rounded-xl bg-white text-gray-700 shadow-md max-w-7xl mx-auto mt-5">
            <div className="relative mx-4 -mt-6 h-40 overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/40">
              <h1 className="text-3xl font-semibold leading-snug tracking-normal text-white p-4">
                Course Overview: Unlocking the Healing Power of Medicinal Plants <br />
                Course ID: {courseId}
              </h1>
            </div>
            <div className="p-6">
              <p className="mb-4">
                Welcome to an immersive journey into the world of medicinal
                plants! This course will guide you through the fascinating
                science and traditional wisdom behind nature's most powerful
                healers. You will explore how plants like Aloe vera, Hibiscus,
                and Tulsi have been used for centuries to treat ailments, boost
                immunity, and promote overall well-being.
              </p>
              <p className="mb-4">
                Through interactive 3D models, engaging visuals, and real-world
                applications, you will learn:
              </p>
              <ul className="list-disc list-inside mb-4">
                <li>
                  ✅ Botanical Classification – Understand how medicinal plants
                  are categorized based on their properties.
                </li>
                <li>
                  ✅ Active Compounds & Benefits – Discover the healing
                  components of plants and their effects on the body.
                </li>
                <li>
                  ✅ Sustainable Cultivation & Harvesting – Explore ethical ways
                  to grow and use medicinal plants.
                </li>
              </ul>
              <p>
                By the end of this course, you will not only appreciate the
                natural pharmacy around you but also gain the knowledge to
                incorporate these healing plants into everyday life. 🌿✨
              </p>
            </div>
            <div className="p-6 pt-0">
              <button
                className="select-none rounded-lg bg-blue-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                onClick={handleEnrollClick}
                disabled={isLoading}
              >
                {isLoading
                  ? "Loading..."
                  : isEnrolled
                  ? "Continue Course"
                  : "Enroll Now"}
              </button>
            </div>
          </div>
        </div>
        {/* Footer section */}
        <div className="relative mt-[220px] mx-auto w-[98%]">
          <div className="relative w-full h-[440px] bg-[url('https://cdn.animaapp.com/projects/66fe7ba2df054d0dfb35274e/releases/676d6d16be8aa405f53530bc/img/hd-wallpaper-anatomy-human-anatomy-1.png')] bg-cover">
            <div className="absolute top-[252px] left-[23px] right-[23px] h-[178px] bg-white rounded-[12px]">
              <div className="flex justify-center space-x-4 mt-4">
                {/* Instagram Button */}
                <button
                  className="w-48 h-11 bg-white border border-black rounded-full hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-yellow-500 hover:text-white hover:scale-105 transition duration-200"
                  onClick={() =>
                    (window.location.href = "https://www.instagram.com")
                  }
                >
                  Instagram
                </button>
                {/* Twitter Button */}
                <button
                  className="w-48 h-11 bg-white border border-black rounded-full hover:bg-black hover:text-white hover:scale-105 transition duration-200"
                  onClick={() =>
                    (window.location.href = "https://www.twitter.com")
                  }
                >
                  Twitter
                </button>
                {/* Facebook Button */}
                <button
                  className="w-48 h-11 bg-white border border-black rounded-full hover:bg-blue-500 hover:text-white hover:scale-105 transition duration-200"
                  onClick={() =>
                    (window.location.href = "https://www.facebook.com")
                  }
                >
                  Facebook
                </button>
                {/* Pinterest Button */}
                <button
                  className="w-48 h-11 bg-white border border-black rounded-full hover:bg-red-500 hover:text-white hover:scale-105 transition duration-200"
                  onClick={() =>
                    (window.location.href = "https://www.pinterest.com")
                  }
                >
                  Pinterest
                </button>
              </div>
              <div className="mt-4 border-t border-gray-300"></div>
              <div className="text-center mt-2">
                <p className="text-xl text-gray-800">
                  © 2024, All Rights Reserved
                </p>
              </div>
            </div>
            <p className="absolute top-[40px] left-0 right-0 text-[64px] font-normal text-center text-white">
              Be the one with
              <span className="text-red-500"> Nat</span>
              <span className="text-[#B9DE00]">ur</span>
              <span className="text-red-500">e</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseOverview;
