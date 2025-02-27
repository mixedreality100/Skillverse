import React, { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import Button from "./Button";
import TakeQuizButton from "./TakeQuizButton";
import Switch from "./Switch";
import Cards from "./Cards";
import Cards2 from "./Cards2";
import Cards3 from "./Cards3";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Loader from "./Loader";
import PlusButton from "./PlusButton";
import { Box } from "./Box1";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import skillverseLogo from "../assets/skillverse.svg";
import NavButton from "./NavButton";
import ProfileButton from "./profile";
import { Menu, X } from "lucide-react"; // For icons

function Model() {
  const { scene } = useGLTF("/model/aleovera.glb");
  const modelRef = useRef();

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  useEffect(() => {
    const handleMouseMove = (event) => {
      const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      const tiltAmount = 0.1;
      if (modelRef.current) {
        modelRef.current.rotation.y = mouseX * tiltAmount;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={6}
      position={[1.2, -0.2, 0]}
      rotation={[0, Math.PI / 2, 0]}
    />
  );
}

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: "center",
  color: theme.palette.text.secondary,
  height: "3.75rem",
  lineHeight: "3.75rem",
}));

const darkTheme = createTheme({ palette: { mode: "dark" } });
const lightTheme = createTheme({ palette: { mode: "light" } });

export const AloePage = () => {
  const [loading, setLoading] = useState(true);
  const [isLeavesPopupVisible, setIsLeavesPopupVisible] = useState(false);
  const [isGelPopupVisible, setIsGelPopupVisible] = useState(false);
  const [navigateToCustardApple, setNavigateToCustardApple] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false); // Track if speech
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu
  const paperRef = useRef(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleLeavesPopup = () => {
    if (isGelPopupVisible) {
      setIsGelPopupVisible(false);
    }
    setIsLeavesPopupVisible(!isLeavesPopupVisible);
  };
  const handelAboutUsClick = () => {
    navigate('/aboutus');
  };

  const handelExploreCourseClick = () => {
    navigate('/explore');
  };
  const toggleGelPopup = () => {
    if (isLeavesPopupVisible) {
      setIsLeavesPopupVisible(false);
    }
    setIsGelPopupVisible(!isGelPopupVisible);
  };

  const speakText = (selector) => {
    const elements = document.querySelectorAll(selector);
    let textToSpeak = "";
    elements.forEach((element) => {
      textToSpeak += element.textContent + " ";
    });
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = "en-US";
    utterance.rate = 0.8;
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const navigate = useNavigate();
  const { moduleId } = useParams();

  const handleTakeQuiz = () => {
    navigate(`/quiz/${moduleId}`);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    if (paperRef.current) {
      observer.observe(paperRef.current);
    }

    return () => {
      if (paperRef.current) {
        observer.unobserve(paperRef.current);
      }
      clearTimeout(timer);
    };
  }, []);

  const handleCourses = () => {
    navigate("/");
    setTimeout(() => {
      const coursesSection = document.getElementById("courses");
      if (coursesSection) {
        coursesSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleARClick = () => {
    navigate("/module-viewer");
  };

  const handleback = () => {
    navigate("/plants");
  };

  const handleVRClick = () => {
    navigate("/modelvr");
  };

  if (loading) {
    return <Loader />;
  }

  if (navigateToCustardApple) {
    return <Navigate to="/custard-apple" />;
  }


  return (
    <div className="bg-[#FFFFFF] flex justify-center items-center w-full min-h-screen">
      <div className="max-w-[1440px] w-full">
        <style>
          {`
            @import url("https://fonts.googleapis.com/css?family=Poppins:700,400|Poly:400,italic|Bebas+Neue:400");

            .hero-text {
              font-size: 29vw; /* Responsive size based on viewport width */
              top: 100px;
            }

            .paper-container {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 1rem;
            }

            .benefits-card-container {
              display: flex;
              justify-content: space-between;
              flex-wrap: wrap;
              padding: 1rem;
            }

            .benefit-card {
              flex: 1 1 30%;
              min-width: 300px;
              margin-bottom: 1rem;
            }

            @media (max-width: 768px) {
              .hero-text {
                font-size: 25vw; /* Adjust for smaller screens */
                position: relative;
                top: 5rem;
                left: 0rem; /* Move slightly to the left */
                padding: 0 4rem; /* Add padding to the left and right */
              }
              .scientific-name {
                font-size: 4vw;
                top: 15.5rem; /* Adjust position for mobile */
                left: -31.7rem;
                width: 100%;
                font-style: italic;
                text-align: center;
              }
              .intro-text {
                top: 26rem; /* Adjust position for mobile */
                left: 4rem;
                width: 100%;
                padding: 2rem;
                box-sizing: border-box;
                font-size: 0.875rem; /* Slightly larger font for readability */
                text-align: center;
              }
              .paper-container {
                font-size: 1.2rem;
                grid-template-columns: 3fr; /* Stack cards vertically on mobile */
                position: absolute;
                top: 7rem; /* Position below the intro text */
                width: 45%;
                left: 3.5rem;
              }
              .paper-container2 {
                font-size: 1.2rem;
                grid-template-columns: 1fr; /* Stack cards vertically on mobile */
                position: absolute;
                top: 75rem; /* Position below the intro text */
                width: 180%;
                left: 3.5rem;
              }
              .paper-card {
                font-size: 1.2rem;
                width: 80%; /* Decrease width for mobile */
                min-height: 10rem; /* Decrease height for mobile */
                position: absolute;
                top: -20rem; /* Position below the intro text */
                width: 37%;
                left: -7.5rem;
              }
              .paper-card2 {
                   font-size: 1.2rem;
                width: 100%; /* Decrease width for mobile */
                min-height: 10rem; /* Decrease height for mobile */
                position: absolute;
                top: -20rem; /* Position below the intro text */
                width: 37%;
                left: -7.5rem;
              }
                
              .model-section {
                height: auto; /* Adjust height for mobile */
                padding: 2rem; /* Add padding for mobile */
                width: 35%;
              }
              .model-text {
                font-size: 2.1rem; /* Adjust font size for mobile */
                top: 1rem; /* Adjust top spacing for mobile */
                left: -1.8rem;
              }
              .aloe-text {
                width: 30%; /* Adjust width for mobile */
                top: 99rem; /* Adjust top position for mobile */
                left: 1%; /* Center horizontally */
                font-size: 1.2rem; /* Adjust font size for mobile */
              }
              .aloe-subtext {
                position: relative;
                display: block; /* Display as block */
                font-size: 1.2rem; /* Adjust subtext font size for mobile */
                padding: 2.5rem;
                top: -7rem;
                box-sizing: border-box;
                text-align: left; /* Align text to the left */
                left: -5rem; /* Position to the left */
              }
              .aloe-click {
                display: none; /* Hide original text on mobile */
              }
              .aloe-click-mobile {
                display: block; /* Show new text on mobile */
                font-size: 1.2rem; /* Adjust font size for mobile */
                left: 1.5rem; /* Position to the left */
                top: 114rem;
              }
              .benefit-section {
                 top: 137rem; 
                 padding: 1.5rem; /* Add padding for mobile */
                width: 35%;
              }
              .benefit-text1 {
                font-size: 2.8rem; /* Adjust font size for mobile */
                top: 1rem; /* Adjust top spacing for mobile */
                left: -31.8rem;
              }
              .benefit-text2 {
                font-size: 1.5rem; /* Adjust font size for mobile */
                top: 3.1rem; /* Adjust top spacing for mobile */
                left: -31.8rem;
              }
              .benefits-card-container {
                flex-direction: column;
                align-items: center;
              }
              .benefit-card {
                width: 80%;
              }
            }

            .benefits-card {
              position: relative;
            }

            .benefits-card-one,
            .benefits-card-two,
            .benefits-card-three {
              position: absolute;
            }

            @media (max-width: 768px) {
              .benefits-card-one {
                top: 147rem; /* Increased top value */
                left: 45.2%;
                transform: translateX(-50%);
                width: 90%;
                height: auto;
              }

              .benefits-card-two {
               top: 164.5rem; /* Increased top value */
                left: 45.2%;
                transform: translateX(-50%);
                width: 90%;
                height: auto;
              }

              .benefits-card-three {
               top: 182rem; /* Increased top value */
                left: 45.2%;
                transform: translateX(-50%);
                width: 90%;
                height: auto;
              }
            }

            @media (max-width: 768px) {
              .model-canvas {
                height: 20rem; /* Adjust height for smaller screens */
                top: 115rem; /* Adjust top position for smaller screens */
                width: 100%; /* Make the canvas full width */
                left: -570px; /* Align to the left */
              }
            }

            @media (max-width: 768px) {
              .plus-button-container,
              .popup-content {
                display: none; /* Hide on smaller screens */
              }
            }

            .aloe-click-mobile {
              display: none; /* Hide by default */
            }

            @media (max-width: 768px) {
              .aloe-click-mobile {
                display: block; /* Show on mobile */
                font-size: 1rem; /* Adjust font size for mobile */
                left: 1.5rem; /* Position to the left */
                top: 114rem;
              }
            }

            @media (max-width: 768px) {
              .interactive-experience {
                width: 40%; /* Full width for mobile */
                height: auto; /* Adjust height based on content */
                padding: 2rem; /* Add padding for better spacing */
              }

              .interactive-experience-text {
                font-size: 1.5rem; /* Smaller font size for mobile */
                line-height: 1.75rem; /* Adjust line height */
                white-space: normal; /* Allow text to wrap */
                max-width: 70%; /* Limit width to break text into two lines */
                margin: 0 auto; /* Center the text */
                top: 0rem;

              }
            }

            @media (max-width: 768px) {
              #ar_vr-icon {
                flex-direction: column; /* Stack icons vertically on mobile */
                gap: 5rem; /* Add space between icons */
                align-items: flex-start; /* Align items to the left */
                padding-left: 8rem; /* Add padding to the left */
                width: 90%;
              }

              .group {
                width: 12rem; /* Adjust width for mobile */
                height: 12rem; /* Adjust height for mobile */
                transition: none; /* Remove hover transition */
                display: flex; /* Use flexbox for centering */
                justify-content: center; /* Center content horizontally */
               align-items: center; /* Center content vertically */
              }

              .group:hover {
                width: 12rem; /* Ensure no extension on hover */
                cursor: pointer;
              }

              .group img {
                display: none; /* Hide images on mobile */
               }


              .group span {
              
                font-size: 3rem; /* Adjust font size for mobile */
                margin-left: 0; /* Center text below the icon */
                text-align: center; /* Center text */
                opacity: 1; /* Ensure text is visible */
              }
            }
              @media (max-width: 768px) {
              .takequiz-header {
                width: 40%; /* Full width for mobile */
                height: auto; /* Adjust height based on content */
                padding: 2rem; /* Add padding for better spacing */
              }

              .takequiz-text {
                font-size: 2.2rem; /* Smaller font size for mobile */
                line-height: 0rem; /* Adjust line height */
                white-space: normal; /* Allow text to wrap */
                left: -31.5rem; /* Position to the left */

              }

            .takequiz-button {
              top: 260rem; /* Adjust top position for mobile */
              left: 17%;
              transform: translateX(-60%);
            }

            .custard-apple-button {
              font-size: 0.8rem; /* Smaller font size for mobile */
              top: 280rem; /* Adjust top position for mobile */
              left: 15%;
              transform: translateX(-60%);
              width: 50px; /* Set a specific width */
              padding: 10px 10px; /* Adjust padding for a narrower look */
            }
            }
             @media (max-width: 764px) {
    .responsive-container {
      width: 100%;
      top: 520%;
      left: 0;
      height: auto;
    }
    .social-container {
      width: 100%;
      top: 44%;
      left: 0%;
      height: auto;
      padding: 5px;
      text-align: center;
    }
    .social-buttons {
      flex-wrap: wrap;
      gap: -10px;
      justify-content: center;
    }
    .social-button {
      width: 100%;
      max-width: 150px;
      height: 55px;
      font-size: 14px;
      border: 2px solid black;
      background-color: white;
      border-radius: 9999px;
      transition: all 0.2s ease-in-out;
    }
    .heading-text {
      font-size: 50px;
      width: 100%;
      top: 10px;
      left: 0%;
      right: 10%;
      text-align: center;
    }
    .footer-image {
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      width: 100%;
    }
  
  .speech-button {
    width: 48px; /* Smaller size on mobile */
    height: 48px;
    padding: 8px;
    position: absolute;
    top: 24rem;
    left: -76rem;
  }

  .speech-button svg {
    width: 30px;
    height: 30px;
          }
    .profile-button{
      top: 1.8rem;
      left: 23rem;
    position: absolute;
    }

  }
    @media (max-width: 768px) {
              .nav-buttons {
                display: none;
              }
              .mobile-menu-button {
                display: block;
                top: 2.5rem;
                left: 14rem;
                position: relative;
              }
              .mobile-menu {
                display: ${isMobileMenuOpen ? "block" : "none"};
                position: absolute;
                top: 80px;
                padding: 5px;
                background: white;
                border: 1px solid #ccc;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                z-index: 1000;
                top: 5rem;
                left: 11.2rem;
                position: absolute;
              }
              .mobile-menu button {
                display: block;
                width: 100%;
                padding: 10px 20px;
                text-align: left;
                background: none;
                border: none;
                cursor: pointer;
              }
              .mobile-menu button:hover {
                background: #f0f0f0;
              }
            }
            @media (min-width: 769px) {
              .mobile-menu-button {
                display: none;
              }
              .mobile-menu {
                display: none;
              }
            }

 
          `}
        </style>
        <div className="bg-[#ffffff] overflow-hidden w-[1440px] h-[4853px] relative">
          <div className="absolute w-[1440px] h-24 top-0 left-0 bg-[#FFFFFF]"></div>

          <div className="absolute w-[2476px] top-[850px] left-[74px] z-10">
            <div
              ref={paperRef}
              className="paper-container p-16 bg-white rounded-lg"
            >
              <div
                className="flex flex-col items-center justify-center bg-white rounded-lg paper-card"
                style={{
                  padding: "1rem",
                  textAlign: "center",
                  color: "#725c5c",
                  borderRadius: "0.5rem",
                  fontSize: "1.1rem",
                  fontFamily: "Poppins, sans-serif",
                  transform: isVisible ? "translateX(0)" : "translateX(-100%)",
                  opacity: isVisible ? 1 : 0,
                  transition: "all 0.8s ease-out",
                  zIndex: 10,
                  whiteSpace: "pre-line", // Allows new lines to be respected
                  boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)", // Custom shadow for all sides
                }}
              >
                <span className="font-bold">BOTANICAL DESCRIPTION</span>
                {`Aloe vera is a perennial plant that can grow up to 4 ft tall 
                  The leaves are triangular, fleshy, and have serrated edges 
                  The leaves are grey to green and sometimes have white spots 
                  The leaves have sharp, pinkish spines along their edges 
                  The flowers are yellow, tube-like, and cluster on a stem
                  `}{" "}
                {/* Add more lines as needed */}
              </div>
            </div>
          </div>

          <div className="absolute w-[2476px] top-[1135px] left-[74px] z-10 paper-container2">
            <div
              ref={paperRef}
              className=" p-16 bg-white rounded-lg paper-container"
            >
              <div
                className="flex flex-col items-center justify-center bg-white rounded-lg paper-card2"
                style={{
                  padding: "1rem",
                  textAlign: "center",
                  color: "#725c5c",
                  borderRadius: "0.5rem",
                  fontSize: "1.1rem",
                  fontFamily: "Poppins, sans-serif",
                  transform: isVisible ? "translateX(0)" : "translateX(100%)",
                  opacity: isVisible ? 1 : 0,
                  transition: "all 0.8s ease-out",
                  zIndex: 10,
                  whiteSpace: "pre-line", // Allows new lines to be respected
                  boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)", // Custom shadow
                }}
              >
                <span className="font-bold">IMPORTANT PARTS</span>
                {`Leaves: Contains gel and latex.
                  `}
                {`Gel: Found in inner parts of leaf.
                    `}
                {`Latex: Found in the green outer layer of the leaf
                  `}
              </div>
            </div>
          </div>

          <div className="absolute w-[360px] h-[46px] top-[2042px] left-[1658px] bg-[#333333c4]" />

          <div className="absolute w-full h-[7.125rem] top-[1470px] bg-[#94B5A0] model-section">
            <p className="absolute w-full top-9 left-0 [font-family:'Poppins',Helvetica] font-bold text-black text-[3.5625rem] text-center tracking-[-1.71px] leading-[2.625rem] whitespace-nowrap model-text">
              Check Out this 3D model
            </p>
          </div>

          <div className="absolute w-[1440px] h-[7.125rem] top-[2306px] bg-[#94B5A0] benefit-section">
            <div className="absolute w-[1439px] top-3 [font-family:'Poppins',Helvetica] font-bold text-black text-[3.5625rem] text-center tracking-[-1.71px] leading-[2.625rem] whitespace-nowrap benefit-text1">
              Benefits
            </div>
            <div className="absolute w-[1439px] top-[70px] left-0 [font-family:'Poppins',Helvetica] font-normal text-black text-[1.25rem] text-center tracking-[-0.5px] leading-[1.875rem] whitespace-nowrap  benefit-text2">
              (Hover to reveal)
            </div>
          </div>

          <div className="absolute w-[1440px] h-[7.125rem] top-[3192px] bg-[#94B5A0] interactive-experience">
            <p className="absolute w-[1439px] top-9 [font-family:'Poppins',Helvetica] font-bold text-black text-[3.0625rem] text-center tracking-[-1.47px] leading-10 whitespace-nowrap interactive-experience-text">
              Time for some Interactive and Immersive Experience!
            </p>
          </div>

          <section
            id="ar_vr-icon"
            className="absolute flex justify-center items-center gap-10 py-20 w-full"
            style={{ top: "3350px" }}
          >
            {/* AR Icon */}
            <div
              onClick={handleARClick}
              className="group relative w-[16.625rem] h-[16.625rem] bg-white rounded-[2.5rem] border border-black shadow-[inset_10px_10px_4px_#00000040] transition-all duration-300 ease-in-out hover:w-[25rem] flex items-center overflow-hidden cursor-pointer"
            >
              <img
                className="absolute w-[7.5rem] h-[7.5rem] top-[4.6875rem] left-[5rem] transition-all duration-300 ease-in-out group-hover:translate-x-[-3.125rem] object-cover"
                alt="Augmented Reality Icon"
                src="../static/img/ar-icon.svg"
              />
              <span className="ml-[15rem] text-[3.25rem] font-bold text-gray-800 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
                AR
              </span>
            </div>

            {/* VR Icon */}
            <div
              className="group relative w-[16.625rem] h-[16.625rem] bg-white rounded-[2.5rem] border border-black shadow-[inset_10px_10px_4px_#00000040] transition-all duration-300 ease-in-out hover:w-[25rem] flex items-center overflow-hidden"
              onClick={handleVRClick}
            >
              <img
                className="absolute w-[7.5rem] h-[7.5rem] top-[4.6875rem] right-[4.375rem] transition-all duration-300 ease-in-out group-hover:translate-x-[3.125rem] object-cover"
                alt="Virtual Reality Icon"
                src="../static/img/vr-icon.svg"
              />
              <span className="ml-[5.625rem] text-[3.25rem] font-bold text-gray-800 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
                VR
              </span>
            </div>
          </section>

          <section className="takequiz">
            <div className="absolute w-[1440px] h-[7.125rem] top-[3996px] bg-[#94B5A0] takequiz-header">
              <p className="absolute w-[1440px] top-[2.1875rem] left-0 [font-family:'Poppins',Helvetica] font-bold text-black text-[3.3125rem] text-center tracking-[-1.59px] leading-[2.625rem] whitespace-nowrap takequiz-text">
                Time for a short Quiz
              </p>
            </div>

            <div
              className="absolute top-[4300px] left-[50%] transform -translate-x-1/2 takequiz-button"
              onClick={handleTakeQuiz}
            >
              <TakeQuizButton />
            </div>

            <div className="absolute top-[4600px] left-[85%] custard-apple-button">
              <button
                onClick={() => setNavigateToCustardApple(true)}
                className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300"
              >
                Go to Custard Apple
              </button>
            </div>
          </section>

          <p className="absolute w-[38.625rem] top-[101.1875rem] left-[2.6875rem] [font-family:'Poppins',Helvetica] font-bold text-[#063229] text-[1.5rem] tracking-[0] leading-[2.20625rem] aloe-text">
            {/* Aloe vera: Nature&#39;s First Aid */}
            Welcome to the world of Aloe Vera, a plant so cool it's been
            nicknamed the "Plant of Immortality"
          </p>

          <section
            id="3d-model"
            className="absolute w-[30.375rem] top-[105.1875rem] left-[4.4375rem]"
          >
            <div className="[font-family:'Poppins',Helvetica] font-normal text-[#063229] text-[1.375rem] text-justify tracking-[0] leading-[2.1875rem]">
              <span className="[font-family:'Poppins',Helvetica] font-normal text-[#025169] text-[1.125rem] tracking-[0] leading-[2.1875rem] aloe-subtext">
                <br />
                <br />
              </span>
            </div>
          </section>

          <div className="absolute w-[780px] h-[549px] top-[150px] left-[674px]">
            <div className="relative w-[766px] h-[557px]"></div>
          </div>
          {/* Benefits Cards */}
          <section className="benefits-card">
            <div className="absolute w-[555px] h-[300px] top-[2471px] left-[200px] benefits-card-one">
              <Cards />
            </div>

            <div className="absolute w-[521px] h-72 top-[2471px] right-[100px]  benefits-card-two">
              <Cards2 />
            </div>

            <div className="absolute w-[521px] h-72 top-[2747px] left-[520px]  benefits-card-three">
              <Cards3 />
            </div>
          </section>

          <section className="hero-text">
            <div className="absolute top-[125px] left-[10px] [font-family:'Bebas_Neue',Helvetica] font-light text-[#7BB661] text-center tracking-[0.66875rem] leading-[normal]">
              {/* Aloe<span className="opacity-100"></span><span className='text-[#0A342A]'>vera</span> */}
              AloeVera
            </div>

            <div className="absolute scientific-name top-[35.9375rem] left-[70rem] [font-family:'Times_New_Roman-Italic',Helvetica] font-bold italic text-black text-[1.8125rem] text-center tracking-[0.14625rem] leading-[normal] whitespace-nowrap">
              {/* Aloe Barbadensis */}
              Aloe Barbadensis
            </div>
          </section>
          <p className="absolute top-[118.75rem] left-[3.25rem] [font-family:'Poppins',Helvetica] font-bold text-[#025169] text-[1.4375rem] text-center tracking-[0.02875rem] leading-[normal] aloe-click">
            Click on the different Parts to find out more
          </p>
          <p className="absolute top-[118.75rem] left-[3.25rem] [font-family:'Poppins',Helvetica] font-bold text-[#025169] text-[1.4375rem] text-center tracking-[0.02875rem] leading-[normal] aloe-click-mobile">
            To view info on the plant, Use Desktop View
          </p>
          <div className="absolute top-[120px] right-0 p-4 z-50">
            <button
              onClick={() =>
                isSpeaking
                  ? stopSpeech()
                  : speakText(
                      ".aloe-text, .benefit-text1, .benefit-text2, .model-text, .interactive-experience-text, .takequiz-text, .hero-text, .scientific-name, .intro-text, .paper-container"
                    )
              }
              className={`p-2 rounded-full shadow-md transition duration-300 speech-button ${
                isSpeaking
                  ? "bg-white text-green-500"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6"
              >
                <path d="M3 9v4c0 1.1.9 2 2 2h4l5 5V5l-5 5H5c-1.1 0-2 .9-2 2z" />
              </svg>
            </button>
          </div>
          <section className="relative w-full h-[100px]">
            <img
              className="absolute top-[22px] left-[30px] w-[60px] h-[60px]"
              src={skillverseLogo}
              alt="logo"
              onClick={() => navigate("/")}
            />

            <div className="absolute top-[40px] left-[1381px] profile-button">
              <ProfileButton />
            </div>

            {/* Mobile Menu Button */}
            <button
              className="absolute top-[30px] right-[30px] mobile-menu-button"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Mobile Menu Dropdown */}
            <div className="mobile-menu">
              <button onClick={handleCourses}>Courses</button>
              <button>Explore</button>
              <button>About Us</button>
            </div>

            {/* Desktop Navigation Buttons */}
            <div className="absolute top-[30px] left-1/2 transform -translate-x-1/2 flex gap-9 items-center nav-buttons">
              <NavButton
                className="transform transition-transform duration-300 hover:scale-110 text-black"
                onClick={handleCourses}
              >
                Courses
              </NavButton>
              <NavButton className="transform transition-transform duration-300 hover:scale-110 text-black"
                onClick={handelExploreCourseClick}>
              
                Explore
              </NavButton>
              <NavButton className="transform transition-transform duration-300 hover:scale-110 text-black"
                onClick={handelAboutUsClick}
>
                About Us
              </NavButton>
            </div>
          </section>

          <div className="absolute w-full h-[54.3125rem] top-[89.8125rem] left-0 model-canvas">
            <div className="absolute top-[350px] left-[950px] z-10 plus-button-container">
              <PlusButton onClick={toggleLeavesPopup} />
              {isLeavesPopupVisible && (
                <div className="absolute top-[2.5rem] left-[2.8125rem] bg-white border border-gray-300 p-4 rounded shadow-md w-[25rem] h-[11.875rem] z-20 popup-content">
                  <span className="font-bold [font-family:'Poppins',Helvetica] font-bold text-[#025169] text-[1.5625rem]">
                    Leaves
                  </span>
                  <span className="[font-family:'Poppins',Helvetica] font-normal text-[#025169] text-[1.125rem] tracking-[0] leading-[2.1875rem]">
                    : Thick, fleshy, and lance-shaped with serrated edges. They
                    are typically green to gray-green with white flecks.
                    <br />
                    <br />
                  </span>
                </div>
              )}
            </div>

            <div className="absolute top-[580px] left-[690px] z-10 plus-button-container">
              <PlusButton onClick={toggleGelPopup} />
              {isGelPopupVisible && (
                <div className="absolute top-[-6.25rem] left-[2.8125rem] bg-white border border-gray-300 p-4 rounded shadow-md w-[25rem] h-[11.875rem] z-20 popup-content">
                  <span className="font-bold [font-family:'Poppins',Helvetica] font-bold text-[#025169] text-[1.5625rem]">
                    Gel
                  </span>
                  <span className="[font-family:'Poppins',Helvetica] font-normal text-[#025169] text-[1.125rem] tracking-[0] leading-[2.1875rem]">
                    : The inner part of the leaf contains a clear, gel-like
                    substance that is rich in nutrients and has various
                    medicinal properties.
                    <br />
                    <br />
                  </span>
                </div>
              )}
            </div>
            <Canvas
              camera={{
                position: [2.192129250918481, 1, 4.405377373613455],
                fov: 45,
              }}
              shadows
            >
              <ambientLight intensity={2} />
              <directionalLight
                position={[5, 5, 5]}
                intensity={1.5}
                castShadow
              />
              <directionalLight position={[-5, 5, -5]} intensity={1} />
              <hemisphereLight intensity={1} groundColor="white" />

              <Model />
            </Canvas>
          </div>
        </div>

        <div className="absolute top-[4850px] left-[30px] w-[1440px] h-[440px] responsive-container">
          <div className="relative w-[1440px] h-[440px] bg-[url('https://cdn.animaapp.com/projects/66fe7ba2df054d0dfb35274e/releases/676d6d16be8aa405f53530bc/img/hd-wallpaper-anatomy-human-anatomy-1.png')] bg-cover bg-center footer-image">
            <div className="absolute top-[252px] left-[23px] w-[1374px] h-[178px] bg-white rounded-[12px] social-container">
              <div className="flex justify-center space-x-4 mt-4 social-buttons">
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
            <p className="absolute top-[40px] left-[363px] text-[64px] font-normal text-center text-white heading-text">
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

export default AloePage;
