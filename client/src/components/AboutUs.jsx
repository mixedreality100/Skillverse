import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import NavButton from "./NavButton";
import ProfileButton from "./profile";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";

export default function AboutUs() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSidebarOpen && !event.target.closest('.mobile-sidebar') && 
          !event.target.closest('.sidebar-toggle')) {
        setIsSidebarOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  // Close sidebar on resize if screen becomes large enough
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isSidebarOpen]);

  const handleCourses = () => {
    navigate("/");
    setTimeout(() => {
      const coursesSection = document.getElementById("courses");
      if (coursesSection) {
        coursesSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
    setIsSidebarOpen(false);
  };

  const handleExploreClick = () => {
    navigate("/explore");
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  // Sidebar animation variants
  const sidebarVariants = {
    closed: { 
      x: "100%",
      opacity: 0,
      transition: { 
        type: "tween", 
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: { 
      x: 0,
      opacity: 1,
      transition: { 
        type: "tween", 
        duration: 0.3,
        ease: "easeInOut",
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const sidebarItemVariants = {
    closed: { 
      x: 20,
      opacity: 0
    },
    open: { 
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  const overlayVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 }
  };

  const developers = [
    { name: "Eshan Biswas", role: "Three JS Developer", image: "" },
    { name: "Rhys Vales", role: "UI/UX Designer", image: "" },
    { name: "Joel Travasso", role: "UI/UX Designer", image: "" },
    { name: "Prachi Prabhu", role: "Frontend Developer", image: "" },
    { name: "Dylan Frias", role: "Backend Developer", image: "" },
    { name: "Muskan Khatun", role: "Backend Developer", image: "" },
  ];

  return (
    <motion.div
      className="min-h-screen bg-white p-8 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-[url('/path/to/your/background.jpg')] bg-cover opacity-30"></div>

      {/* Navigation Bar */}
      <nav className="flex justify-between items-center w-full max-w-[1274px] mx-auto relative z-10">
        <img
          src="./src/assets/skillverse.svg"
          alt="Company logo"
          className="w-[58px] aspect-square cursor-pointer"
          onClick={() => navigate("/")}
        />

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-9">
          <NavButton
            className="transform transition-transform duration-300 hover:scale-110 text-black"
            onClick={handleCourses}
          >
            Courses
          </NavButton>
          <NavButton
            className="transform transition-transform duration-300 hover:scale-110 text-black"
            onClick={handleExploreClick}
          >
            Explore
          </NavButton>
        </div>

        {/* Login/Profile and Sidebar Toggle Section */}
        <div className="flex items-center gap-5">
          <SignedOut>
            <SignInButton>
              <button className="text-black transform transition-transform duration-300 hover:scale-110 rounded-full border-2 border-black px-8 py-3">
                Login
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <ProfileButton />
          </SignedIn>

          {/* Mobile Sidebar Toggle Button */}
          <button
            className="md:hidden text-black transform transition-transform duration-300 hover:scale-110 sidebar-toggle"
            onClick={toggleSidebar}
            aria-label="Toggle mobile menu"
          >
            {!isSidebarOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </button>
        </div>
      </nav>
      
      {/* Mobile Menu Overlay and Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
              initial="closed"
              animate="open"
              exit="closed"
              variants={overlayVariants}
              onClick={() => setIsSidebarOpen(false)}
            />
            
            {/* Sidebar */}
            <motion.div
              className="mobile-sidebar fixed top-0 right-0 h-full w-64 bg-white shadow-2xl z-50 md:hidden flex flex-col"
              initial="closed"
              animate="open"
              exit="closed"
              variants={sidebarVariants}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <p className="font-bold text-lg text-black">Menu</p>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              
              {/* Links */}
              <div className="p-5 flex flex-col gap-2">
                <motion.div variants={sidebarItemVariants}>
                  <NavButton
                    className="block w-full text-left mb-4 text-black hover:bg-gray-100 rounded-lg p-3 transition-colors"
                    onClick={handleCourses}
                  >
                    <span className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                      Courses
                    </span>
                  </NavButton>
                </motion.div>
                
                <motion.div variants={sidebarItemVariants}>
                  <NavButton
                    className="block w-full text-left text-black hover:bg-gray-100 rounded-lg p-3 transition-colors"
                    onClick={handleExploreClick}
                  >
                    <span className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                        />
                      </svg>
                      Explore
                    </span>
                  </NavButton>
                </motion.div>
              </div>
              
              {/* Footer */}
              <div className="mt-auto p-5 border-t border-gray-100">
                <SignedOut>
                  <SignInButton>
                    <button className="w-full rounded-full border-2 border-black py-3 text-center font-medium transition-all hover:bg-black hover:text-white">
                      Login
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <p className="text-sm text-gray-500 mb-2">Signed in as:</p>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-200 mr-3"></div>
                    <div>User Account</div>
                  </div>
                </SignedIn>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Rest of the content */}
      <motion.div
        className="text-center mb-20 pt-12 relative z-10"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-6xl font-extrabold text-black mb-6">About Us</h1>
        <p className="text-2xl text-black-300 max-w-3xl mx-auto leading-relaxed mb-8">
          Pioneering the future of education through immersive VR experiences
          that inspire, engage, and transform learning.
        </p>
      </motion.div>

      {/* Mission Section */}
      <motion.div
        className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-12 mb-20 relative z-10"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl font-bold text-black mb-6">Our Mission</h2>
        <p className="text-xl text-black-300 leading-relaxed">
          To revolutionize education through virtual reality technology, making
          learning more engaging, interactive, and accessible for everyone. We
          believe in creating experiences that not only educate but inspire the
          next generation of learners.
        </p>
      </motion.div>

      {/* Values Section */}
      <motion.div
        className="max-w-6xl mx-auto mb-20 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-4xl font-bold text-black text-center mb-12">
          Our Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {["Innovation", "Accessibility", "Excellence"].map((value, index) => (
            <motion.div
              key={value}
              className="bg-white/10 backdrop-blur-lg p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              variants={itemVariants}
            >
              <h3 className="text-2xl font-bold text-orange-500 mb-4">
                {value}
              </h3>
              <p className="text-black-300">
                {value === "Innovation" &&
                  "Pushing boundaries in educational technology to create groundbreaking learning experiences."}
                {value === "Accessibility" &&
                  "Making quality education available to everyone, everywhere through VR technology."}
                {value === "Excellence" &&
                  "Committed to delivering the highest quality educational content and experiences."}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Developers Section */}
      <motion.div
        className="max-w-6xl mx-auto mb-20 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-4xl font-bold text-black text-center mb-12">
          Our Development Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {developers.map((dev, index) => (
            <motion.div
              key={dev.name}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center"
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
            >
              <h3 className="text-xl font-bold text-black mb-2">{dev.name}</h3>
              <p className="text-gray-600">{dev.role}</p>
              <div className="mt-4 flex justify-center space-x-3">
                <motion.button
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-gray-600">GitHub</span>
                </motion.button>
                <motion.button
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-gray-600">LinkedIn</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Footer Section */}
      <footer className="w-full mt-20 relative z-10">
        <style>
          {`
      .footer-bg-image {
        border-radius: 20px; /* Rounded corners for both mobile and desktop */
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); /* Drop shadow */
      }

      @media (max-width: 768px) {
        .nature-text {
          font-size: 60px !important; /* Smaller font size for mobile */
          left: 50% !important; /* Center the text horizontally */
          transform: translateX(-50%) !important; /* Ensure proper centering */
          white-space: normal !important; /* Allow text to wrap */
          top: 20px !important; /* Adjust vertical positioning */
          width: 90% !important; /* Limit width to prevent overflow */
          text-align: center !important; /* Center-align the text */
          line-height: 1.2 !important; /* Adjust line height for better readability */
        }

        .footer-bg-image {
          background-size: cover !important; /* Ensure the image covers the container */
          background-position: center !important; /* Center the image */
          border-radius: 20px; /* Rounded corners for mobile */
          box-shadow: 10px 10px 30px rgba(0, 0, 0, 0.2); /* Drop shadow for mobile */
        }
      }
    `}
        </style>

        <div className="footer-bg-image relative w-full h-[440px] bg-[url('https://cdn.animaapp.com/projects/66fe7ba2df054d0dfb35274e/releases/676d6d16be8aa405f53530bc/img/hd-wallpaper-anatomy-human-anatomy-1.png')] bg-cover">
          <div className="absolute bottom-0 left-0 right-0 w-full h-[178px] bg-white rounded-t-[12px]">
            <motion.div
              className="flex justify-center space-x-4 mt-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {[
                { name: "Instagram", url: "https://www.instagram.com" },
                { name: "Twitter", url: "https://www.twitter.com" },
                { name: "Facebook", url: "https://www.facebook.com" },
                { name: "Pinterest", url: "https://www.pinterest.com" },
              ].map((social) => (
                <motion.button
                  key={social.name}
                  className={`w-48 h-11 bg-white border border-black rounded-full hover:text-white transition duration-200 ${
                    social.name === "Instagram"
                      ? "hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-yellow-500"
                      : social.name === "Twitter"
                      ? "hover:bg-gradient-to-r hover:from-black hover:to-gray-800"
                      : social.name === "Facebook"
                      ? "hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-400"
                      : social.name === "Pinterest"
                      ? "hover:bg-gradient-to-r hover:from-red-600 hover:to-red-400"
                      : ""
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => (window.location.href = social.url)}
                >
                  {social.name}
                </motion.button>
              ))}
            </motion.div>

            <div className="mt-4 border-t border-gray-300"></div>

            <div className="text-center mt-2">
              <p className="text-xl text-gray-800">
                © 2024, All Rights Reserved
              </p>
            </div>
          </div>

          <motion.p
            className="nature-text absolute top-[40px] left-[400px] transform -translate-x-1/2 text-[64px] font-normal text-center text-white"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Be the one with
            <span className="text-red-500"> Nat</span>
            <span className="text-[#B9DE00]">ur</span>
            <span className="text-red-500">e</span>
          </motion.p>
        </div>
      </footer>
    </motion.div>
  );
}