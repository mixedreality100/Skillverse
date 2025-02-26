import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import backArrow from '../assets/skillverse.svg';
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import ProfileButton from "./profile";

export const Plants = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [courseDetails, setCourseDetails] = useState(null);
  const [modules, setModules] = useState([]);
  const [error, setError] = useState(null);
  const [isEnrollPopupOpen, setIsEnrollPopupOpen] = useState(false); // State to control popup visibility

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const courseResponse = await fetch(`http://localhost:3000/courses/${courseId}`);
        if (!courseResponse.ok) {
          throw new Error(`HTTP error! status: ${courseResponse.status}`);
        }
        const courseData = await courseResponse.json();

        const modulesResponse = await fetch(`http://localhost:3000/modules/${courseId}`);
        if (!modulesResponse.ok) {
          throw new Error(`HTTP error! status: ${modulesResponse.status}`);
        }
        const modulesData = await modulesResponse.json();

        setCourseDetails(courseData);
        setModules(modulesData);
      } catch (error) {
        console.error('Error fetching course details:', error);
        setError(error.message);
      }
    };

    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  const handleEnrollClick = (moduleId) => {
    setIsEnrollPopupOpen(true);
  };

  const handleCourseClick = () => {
    navigate('/');
    setTimeout(() => {
      const coursesSection = document.getElementById('courses');
      if (coursesSection) {
        coursesSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleEnrollNow = async (moduleId) => {
    setIsEnrollPopupOpen(false);
            navigate(`/aloepage/${moduleId}`);
    // const userId = 1; // Assuming userInfo contains the user's ID
    // const courseId = 6; // Assuming courseId is available in this context

    // try {
    //     const response = await fetch('http://localhost:3000/api/enroll', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({ userId, courseId }),
    //     });

    //     if (response.ok) {
    //         setIsEnrollPopupOpen(false);
    //         navigate(`/aloepage/${moduleId}`);
    //     } else {
    //         console.error('Enrollment failed');
    //     }
    // } catch (error) {
    //     console.error('Error enrolling:', error);
    // }
};

  const handleCancel = () => {
    setIsEnrollPopupOpen(false);
  };

  return (
    <div className="flex flex-row justify-center w-full bg-white">
      <div className="bg-[#ffffff] overflow-hidden w-[1440px] h-[2000px] relative rounded-lg">
        <div className="absolute top-0 left-0 w-[1426px] h-[824px]">
          <div className="absolute top-0 left-0 w-full h-[calc(100vh-<desired_offset>)]">
            {/* Hero Image */}
          </div>

          <div className="absolute top-[22px] left-[30px] w-[60px] h-[60px]">
              <img
                className="w-[58px] aspect-square"
                alt="Back Arrow"
                src={backArrow}
                onClick={() => navigate('/')}
              />
          </div>

          <div>
            <style>
              {`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
              `}
            </style>
            <div className="absolute top-[70px] left-[92px] font-light text-[#94B5A0] text-[320px] text-center tracking-[1.71px] leading-[normal]" style={{ fontFamily: 'Bebas Neue, Helvetica' }}>
              {courseDetails?.course_name || ''}
            </div>
          </div>
        <div className='flex gap-9'>
          <button 
            className="absolute top-[30px] left-[550px] px-5 py-4 whitespace-nowrap border-2 border-black border-solid bg-zinc-50 rounded-[100px] text-xs text-black transform transition-transform duration-300 hover:scale-110"
            onClick={handleCourseClick}
          >
            Courses
          </button>

          <button 
            className="absolute top-[30px] left-[659px] px-5 py-4 whitespace-nowrap border-2 border-black border-solid bg-zinc-50 rounded-[100px] text-xs text-black transform transition-transform duration-300 hover:scale-110"
            onClick={() => navigate('/explore')}
          >
            Explore
          </button>

          <button 
            className="absolute top-[30px] left-[762px] px-5 py-4 whitespace-nowrap border-2 border-black border-solid bg-zinc-50 rounded-[100px] text-xs text-black transform transition-transform duration-300 hover:scale-110"
            onClick={() => navigate('/aboutus')}
          >
            About Us
          </button>

          <div className="absolute top-[30px] left-[1270px]">
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
        </div>
          
        </div>

        <div id="categories-section" className="absolute top-[900px] left-[50px] w-full">
          <div>
            <style>
              {`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
              `}
            </style>
            <div className="text-left text-[#000000] text-[100px] font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Modules
            </div>
          </div>

          {/* Plant Cards */}
          <div 
            className="mt-12 overflow-x-auto scrollbar-hide cards-container w-[92%]"
            style={{ scrollBehavior: 'smooth' }}
          >
            <div className="flex space-x-5 min-w-max">
              {modules.map((module, index) => (
                <div key={module.id} 
                  onClick={() => handleEnrollClick(module.id)}
                  className="relative w-[273px] h-[374px] bg-cover hover:w-[692px] transition-all duration-300 rounded-[30px]">
                  <img
                    className="absolute top-0 left-0 w-full h-full object-cover rounded-[30px] cursor-pointer"
                    alt={module.module_title}
                    src={module.module_image || '/path/to/default/image.png'}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-white text-[35px] font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {module.module_name || 'No Title'}
                  </div>
                  <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-2 text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {module.description || 'No Description'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute top-[1550px] left-[9px] w-[1422px] h-[440px]">
          <div className="relative w-[1418px] h-[440px] bg-[url('https://cdn.animaapp.com/projects/66fe7ba2df054d0dfb35274e/releases/676d6d16be8aa405f53530bc/img/hd-wallpaper-anatomy-human-anatomy-1.png')] bg-cover">
            <div className="absolute top-[252px] left-[23px] w-[1374px] h-[178px] bg-white rounded-[12px]">
              <div className="flex justify-center space-x-4 mt-4">
                <button className="w-48 h-11 bg-white border border-black rounded-full hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-yellow-500 hover:text-white hover:scale-105 transition duration-200">
                  Instagram
                </button>
                <button className="w-48 h-11 bg-white border border-black rounded-full hover:bg-black hover:text-white hover:scale-105 transition duration-200">
                  Twitter
                </button>
                <button className="w-48 h-11 bg-white border border-black rounded-full hover:bg-blue-500 hover:text-white hover:scale-105 transition duration-200">
                  Facebook
                </button>
                <button className="w-48 h-11 bg-white border border-black rounded-full hover:bg-red-500 hover:text-white hover:scale-105 transition duration-200">
                  Pinterest
                </button>
              </div>

              <div className="mt-4 border-t border-gray-300"></div>

              <div className="text-center mt-2">
                <p className="text-xl text-gray-800">© 2024, All Rights Reserved</p>
              </div>
            </div>

            <p className="absolute top-[40px] left-[363px] text-[64px] font-normal text-center text-white">
              Be the one with
              <span className="text-red-500"> Nat</span>
              <span className="text-[#B9DE00]">ur</span>
              <span className="text-red-500">e</span>
            </p>
          </div>
        </div>
      </div>

      {/* Enroll Popup */}
      {isEnrollPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Enroll Now?</h3>
            <div className="flex justify-end gap-4">
              <button
                className="bg-white border border-black text-black px-4 py-2 rounded-full text-sm hover:bg-red-100 hover:border-red-500 hover:text-red-600 transition-colors duration-300 ease-in-out shadow-sm hover:shadow-md"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="bg-white border border-black text-black px-4 py-2 rounded-full text-sm hover:bg-green-100 hover:border-green-500 hover:text-green-600 transition-colors duration-300 ease-in-out shadow-sm hover:shadow-md"
                 onClick={() => handleEnrollNow(modules[0].id)} // Assuming the first module is selected
              >
                Enroll Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};