import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import backArrow from "../assets/skillverse.svg";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import ProfileButton from "./profile";
import Loader from "./Loader"; // Import the Loader component
import medicinalhero from "../plantsAssets/image2.jpg";

export const Plants = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [courseDetails, setCourseDetails] = useState(null);
  const [modules, setModules] = useState([]);
  const [error, setError] = useState(null);
  const [isEnrollPopupOpen, setIsEnrollPopupOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const pageRef = useRef(null);

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

  useEffect(() => {
    const fetchCourseDetails = async () => {
      setLoading(true); // Set loading to true when fetching starts
      try {
        const courseResponse = await fetch(
          `http://localhost:3000/courses/${courseId}`
        );
        if (!courseResponse.ok) {
          throw new Error(`HTTP error! status: ${courseResponse.status}`);
        }
        const courseData = await courseResponse.json();

        const modulesResponse = await fetch(
          `http://localhost:3000/modules/${courseId}`
        );
        if (!modulesResponse.ok) {
          throw new Error(`HTTP error! status: ${modulesResponse.status}`);
        }
        const modulesData = await modulesResponse.json();

        setCourseDetails(courseData);
        setModules(modulesData);
      } catch (error) {
        console.error("Error fetching course details:", error);
        setError(error.message);
      } finally {
        setLoading(false); // Set loading to false when fetching is done
      }
    };

    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  const handleEnrollClick = (moduleId) => {
    // Navigate directly to the module page without showing popup
    navigate(`/aloepage/${moduleId}`);
  };

  const handleCourseClick = () => {
    navigate("/");
    setTimeout(() => {
      const coursesSection = document.getElementById("courses");
      if (coursesSection) {
        coursesSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleEnrollNow = async (moduleId) => {
    setIsEnrollPopupOpen(false);
    navigate(`/aloepage/${moduleId}`);
  };

  const handleCancel = () => {
    setIsEnrollPopupOpen(false);
  };

  // Render the Loader while loading is true
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-row justify-center w-full bg-white" ref={pageRef}>
      {/* Using a container with relative positioning and a reasonable height */}
      <div className="bg-[#ffffff] overflow-x-hidden w-[1440px] relative rounded-lg">
        <div className="relative w-[1426px] h-[824px]">
          <div className="relative w-full">
            <img
              src={medicinalhero}
              alt="Hero image"
              className="absolute top-[105px] left-[0px] w-full h-[580px] opacity-100 z-0 rounded-[20px] object-cover blur-[0px]" // Custom blur
            />
          </div>

          <div className="absolute top-[22px] left-[30px] w-[60px] h-[60px]">
            <img
              className="w-[58px] aspect-square"
              alt="Back Arrow"
              src={backArrow}
              onClick={() => navigate("/")}
            />
          </div>

          <div>
            <style>
              {`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
              `}
            </style>
            <div
              className="absolute top-[420px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-light text-[#85C86A] text-[350px] text-center tracking-[1.71px] leading-[0.8] drop-shadow-[2px_2px_4px_rgba(0,0,0,0.5)]"
              style={{ fontFamily: "Bebas Neue, Helvetica" }}
            >
              {courseDetails?.course_name || ""}
            </div>
          </div>
          <div className="flex gap-24">
            <button
              className="absolute top-[30px] left-[550px] px-5 py-4 whitespace-nowrap bg-zinc-50 rounded-[100px] text-xm text-black transform transition-transform duration-300 hover:scale-110 shadow-lg"
              style={{
                boxShadow: "5px 5px 10px #d1d1d1, -5px -5px 10px #ffffff",
                border: "0.5px solid rgba(0, 0, 0, 0.33)",
              }}
              onClick={handleCourseClick}
            >
              Courses
            </button>
            <button
              className="absolute top-[30px] left-[659px] px-5 py-4 whitespace-nowrap bg-zinc-50 rounded-[100px] text-xm text-black transform transition-transform duration-300 hover:scale-110 shadow-lg"
              style={{
                boxShadow: "5px 5px 10px #d1d1d1, -5px -5px 10px #ffffff",
                border: "0.5px solid rgba(0, 0, 0, 0.33)",
              }}
              onClick={() => navigate("/explore")}
            >
              Explore
            </button>
            <button
              className="absolute top-[30px] left-[762px] px-5 py-4 whitespace-nowrap bg-zinc-50 rounded-[100px] text-xm text-black transform transition-transform duration-300 hover:scale-110 shadow-lg"
              style={{
                boxShadow: "5px 5px 10px #d1d1d1, -5px -5px 10px #ffffff",
                border: "0.5px solid rgba(0, 0, 0, 0.33)",
              }}
              onClick={() => navigate("/aboutus")}
            >
              About Us
            </button>
            <div className="absolute top-[30px] left-[1270px]">
              <SignedOut>
                <SignInButton>
                  <button
                    className="text-black transform transition-transform duration-300 hover:scale-110 rounded-full px-8 py-3"
                    style={{
                      boxShadow: "5px 5px 10px #d1d1d1, -5px -5px 10px #ffffff",
                      border: "0.5px solid rgba(0, 0, 0, 0.33)",
                    }}
                  >
                    Login
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <ProfileButton />
              </SignedIn>
            </div>
          </div>
        </div>

        <div
          id="categories-section"
          className="relative mt-[-10px] mx-[50px] w-[90%]"
        >
          <div>
            <style>
              {`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
              `}
            </style>
            <div
              className="text-left text-[#000000] text-[100px] font-bold mb-4"
              style={{ fontFamily: "Poppins, sans-serif", marginTop: "3" }}
            >
              Modules
            </div>
          </div>
          {/* Plant Cards */}
          <div
            className="mt-12 overflow-x-auto scrollbar-hide cards-container w-full"
            style={{ scrollBehavior: "smooth" }}
          >
            <div className="flex space-x-5 min-w-max">
              {modules.map((module, index) => (
                <div
                  key={module.id}
                  onClick={() => handleEnrollClick(module.id)}
                  className="relative w-[273px] h-[374px] bg-cover hover:w-[692px] transition-all duration-300 rounded-[30px]"
                >
                  <img
                    className="absolute top-0 left-0 w-full h-full object-cover rounded-[30px] cursor-pointer"
                    alt={module.module_title}
                    src={module.module_image || "/path/to/default/image.png"}
                  />
                  <div
                    className="absolute inset-0 flex items-center justify-center text-white text-[35px] font-bold"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {module.module_name || "No Title"}
                  </div>
                  <div
                    className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-2 text-sm"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {module.description || "No Description"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer section - changed from absolute to relative positioning */}
        <div className="relative mt-[150px] mx-auto w-[98%]">
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

      {/* Removed the enrollment popup entirely */}
    </div>
  );
};
