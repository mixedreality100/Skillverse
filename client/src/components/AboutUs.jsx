import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import NavButton from "./NavButton";
import ProfileButton from "./profile";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";

export default function AboutUs() {
  const navigate = useNavigate();

  // const handleBackClick = () => {
  //   navigate("/");
  // };

  const handleCourses = () => {
    navigate("/");
    setTimeout(() => {
      const coursesSection = document.getElementById("courses");
      if (coursesSection) {
        coursesSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleExploreClick = () => {
    navigate("/explore");
  };

  // const handleAboutUsClick = () => {
  //   navigate("/aboutus");
  // };

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
          className="w-[58px] aspect-square"
          onClick={() => navigate("/")}
        />
        <div className="flex gap-9">
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
        </div>
      </nav>

      {/* Hero Section */}
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
        <div className="relative w-full h-[440px] bg-[url('https://cdn.animaapp.com/projects/66fe7ba2df054d0dfb35274e/releases/676d6d16be8aa405f53530bc/img/hd-wallpaper-anatomy-human-anatomy-1.png')] bg-cover">
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
                  className="w-48 h-11 bg-white border border-black rounded-full hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-yellow-500 hover:text-white transition duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => (window.location.href = social.url)} // Redirect on click
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
            className="absolute top-[40px] left-[400px] transform -translate-x-1/2 text-[64px] font-normal text-center text-white"
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
