"use client";

import { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import TakeQuizButton from "./TakeQuizButton";
import { GradualSpacing } from "./GradualSpacing";
import {
  Navigate,
  useNavigate,
  useLocation,
  useParams,
} from "react-router-dom";
import Loader from "./Loader";
import Paper from "@mui/material/Paper";
import { createTheme, styled } from "@mui/material/styles";
import skillverseLogo from "../assets/skillverse.svg";
import NavButton from "./NavButton";
import ProfileButton from "./profile";
import { Menu, X, Leaf, Flower, Eye } from "lucide-react";
import MusicControl from "./MusicControl";
import Confetti from "react-confetti";
import * as THREE from "three";
// Import social media logos from src/assets
import instagramLogo from "../assets/instagram.png";
import twitterLogo from "../assets/twitter.png";
import facebookLogo from "../assets/facebook.png";
import pinterestLogo from "../assets/pinterest.png";

// Model Component with improved mobile responsiveness
function Model({ glbData }) {
  const { scene } = useGLTF(glbData);
  const modelRef = useRef();
  const [isMobile, setIsMobile] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const maxDimension = Math.max(size.x, size.y, size.z);
    const targetScale = isMobile ? 1.5 / maxDimension : 2 / maxDimension;
    setScale(targetScale);
  }, [scene, isMobile]);

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={scale}
      position={isMobile ? [0, -0.5, 0] : [0, 0, 0]}
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
  const { moduleId } = useParams();
  const [loading, setLoading] = useState(true);
  const [isLeavesPopupVisible, setIsLeavesPopupVisible] = useState(false);
  const [isGelPopupVisible, setIsGelPopupVisible] = useState(false);
  const [navigateToCustardApple, setNavigateToCustardApple] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [moduleName, setModuleName] = useState("");
  const [revealedFacts, setRevealedFacts] = useState([]);
  const [isInstructionVisible, setIsInstructionVisible] = useState(true);
  const [moduleDetails, setModuleDetails] = useState({
    module_name: "",
    description: "",
    funfact1: "",
    funfact2: "",
    funfact3: "",
    funfact4: "",
    part1_name: "",
    part1_description: "",
    part1_image: "",
    part2_name: "",
    part2_description: "",
    part2_image: "",
    part3_name: "",
    part3_description: "",
    part3_image: "",
    part4_name: "",
    part4_description: "",
    part4_image: "",
    benefit1_name: "",
    benefit1_description: "",
    benefit2_name: "",
    benefit2_description: "",
    benefit3_name: "",
    benefit3_description: "",
  });
  const paperRef = useRef(null);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [draggedItem, setDraggedItem] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [score, setScore] = useState(0);
  const [matchedParts, setMatchedParts] = useState([]);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showMatchPopup, setShowMatchPopup] = useState(false);
  const [matchMessage, setMatchMessage] = useState("");
  const [isMatchCorrect, setIsMatchCorrect] = useState(false);

  const controls = useRef();
  const interactiveSectionRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  const handleDrop = (e, target) => {
    e.preventDefault();
    if (draggedItem && !matchedParts.includes(draggedItem)) {
      const correctMatches = {
        [moduleDetails.part1_name]: moduleDetails.part1_description,
        [moduleDetails.part2_name]: moduleDetails.part2_description,
        [moduleDetails.part3_name]: moduleDetails.part3_description,
        [moduleDetails.part4_name]: moduleDetails.part4_description,
      };

      if (correctMatches[draggedItem] === target) {
        setScore(score + 10);
        setMatchedParts([...matchedParts, draggedItem]);
        setShowConfetti(true);
        setMatchMessage("Correct Match! 🎉");
        setIsMatchCorrect(true);
        if (matchedParts.length + 1 === 4) {
          setGameCompleted(true);
        }
      } else {
        setScore(score - 5 >= 0 ? score - 5 : 0);
        setMatchMessage("Incorrect Match! Try Again. 😓");
        setIsMatchCorrect(false);
      }

      setShowMatchPopup(true);

      setTimeout(() => {
        setShowMatchPopup(false);
      }, 2000);

      setDraggedItem(null);
    }
  };

  const closeMatchPopup = () => {
    setShowMatchPopup(false);
  };

  const resetGame = () => {
    setScore(0);
    setMatchedParts([]);
    setGameCompleted(false);
    setShowConfetti(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchModuleDetails = async () => {
      try {
        const parsedModuleId = Number.parseInt(moduleId, 10);
        if (isNaN(parsedModuleId)) {
          console.error("Invalid module ID:", moduleId);
          setLoading(false);
          return;
        }

        const response = await fetch(
          `http://localhost:3000/api/modules/${parsedModuleId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const moduleData = await response.json();
        if (moduleData.length > 0) {
          setModuleDetails(moduleData[0]);
        } else {
          console.error("Module not found");
        }
      } catch (error) {
        console.error("Error fetching module details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (moduleId) {
      fetchModuleDetails();
    } else {
      setLoading(false);
    }
  }, [moduleId]);

  useEffect(() => {
    if (location.state?.scrollToInteractive && interactiveSectionRef.current) {
      setTimeout(() => {
        interactiveSectionRef.current.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location.state]);

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
    navigate("/aboutus");
  };

  const handelExploreCourseClick = () => {
    navigate("/explore");
  };

  const revealFunFact = (factId) => {
    if (!revealedFacts.includes(factId)) {
      setRevealedFacts([...revealedFacts, factId]);
    }
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

  const handleTakeQuiz = () => {
    navigate(`/quiz/${moduleId}`, {
      state: { fromApp: true },
    });
  };

  useEffect(() => {
    if (moduleDetails) {
      console.log("Image URLs:", {
        part1: moduleDetails.part1_image,
        part2: moduleDetails.part2_image,
        part3: moduleDetails.part3_image,
        part4: moduleDetails.part4_image,
      });
    }
  }, [moduleDetails]);

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
    navigate(`/module-viewer/${moduleId}`, {
      state: {
        scrollToInteractive: true,
        fromApp: true,
      },
    });
  };

  const handleVRClick = () => {
    navigate(`/modelvr/${moduleId}`, {
      state: { scrollToInteractive: true },
    });
  };

  const handleback = () => {
    navigate("/plants");
  };

  if (loading) {
    return <Loader />;
  }

  if (!moduleId || isNaN(Number.parseInt(moduleId, 10))) {
    return (
      <div className="flex justify-center items-center w-full min-h-screen bg-white">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">Invalid Module ID</h2>
          <p className="mb-4">The module ID is invalid or not provided.</p>
          <button
            onClick={handleback}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (navigateToCustardApple) {
    return <Navigate to="/custard-apple" />;
  }

  const heroTitleSize =
    screenWidth < 640
      ? "text-4xl"
      : screenWidth < 768
      ? "text-5xl"
      : "text-6xl md:text-8xl";
  const sectionTitleSize =
    screenWidth < 640
      ? "text-3xl"
      : screenWidth < 768
      ? "text-3xl"
      : "text-5xl md:text-6xl";

  return (
    <div className="flex justify-center items-center w-full min-h-screen bg-white">
      <div className="relative w-full max-w-screen-2xl mx-auto">
        <style jsx global>{`
          @keyframes bounce {
            0% {
              transform: scale(0.95);
              opacity: 0;
            }
            50% {
              transform: scale(1.05);
              opacity: 1;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }

          .bounce {
            animation: bounce 0.5s ease-out;
          }
        `}</style>

        {showConfetti && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            numberOfPieces={200}
            recycle={false}
            onConfettiComplete={() => setShowConfetti(false)}
          />
        )}
        <div className="main-container">
          {/* Header */}
          <header className="header w-full h-auto p-4 flex justify-between items-center relative z-10">
            <img
              className="logo h-12 sm:h-16 w-auto cursor-pointer"
              src={skillverseLogo || "/placeholder.svg"}
              alt="logo"
              onClick={() => navigate("/")}
            />

            <div className="nav-buttons hidden md:flex gap-8">
              <NavButton
                className="transform transition-transform duration-300 hover:scale-110 text-black"
                onClick={handleCourses}
              >
                Courses
              </NavButton>
              <NavButton
                className="transform transition-transform duration-300 hover:scale-110 text-black"
                onClick={handelExploreCourseClick}
              >
                Explore
              </NavButton>
              <NavButton
                className="transform transition-transform duration-300 hover:scale-110 text-black"
                onClick={handelAboutUsClick}
              >
                About Us
              </NavButton>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <div>
                <MusicControl />
              </div>
              <div>
                <ProfileButton />
              </div>

              <button
                className="mobile-menu-button md:hidden"
                onClick={toggleMobileMenu}
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            <div
              className={`mobile-menu ${
                isMobileMenuOpen ? "block" : "hidden"
              } md:hidden bg-white border border-gray-300 rounded-lg shadow-lg absolute right-4 top-16 z-50 w-48`}
            >
              <button
                onClick={handleCourses}
                className="block w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                Courses
              </button>
              <button
                onClick={handelExploreCourseClick}
                className="block w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                Explore
              </button>
              <button
                onClick={handelAboutUsClick}
                className="block w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                About Us
              </button>
            </div>
          </header>

          {/* Hero Section */}
          <section className="hero-section relative w-full max-w-7xl mx-auto my-4 sm:my-8 overflow-hidden px-4">
            <img
              src={moduleDetails.module_image}
              alt="Hero Image"
              className="hero-image w-full h-96 object-cover rounded-lg border border-gray-200 shadow-md filter blur-sm"
            />
            <div className="hero-text-container absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center p-4">
              <div>
                <div
                  className="hero-title text-9xl sm:text-[10rem] md:text-[14rem] lg:text-[16rem] font-black text-green-400 text-center tracking-tight drop-shadow-2xl"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    textShadow: "6px 6px 12px rgba(0, 0, 0, 0.4)",
                    transform: "scale(1.05)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {moduleDetails.module_name}
                </div>
                <p
                  className="scientific-name text-xl sm:text-2xl md:text-3xl font-italic text-black text-center mt-2 bg-white bg-opacity-40 py-2 px-2 rounded-lg"
                  style={{ fontFamily: "'Paytone One', sans-serif" }}
                >
                  {moduleDetails.scientific_name}
                </p>
              </div>
            </div>
          </section>

          {/* Info Cards Section */}
          <section className="info-cards-section w-full p-4 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-1/2 flex justify-center">
                <img
                  src={moduleDetails.module_image}
                  alt="plant image"
                  className="w-64 h-64 sm:w-80 sm:h-80 rounded-lg shadow-lg"
                />
              </div>
              <div className="w-full md:w-1/2 mt-6 md:mt-0">
                <div className="flex items-center justify-center md:justify-start mb-4 sm:mb-8">
                  <span className="text-3xl sm:text-4xl mr-2 sm:mr-4">🌿</span>
                  <h3
                    className="what-is-heading text-3xl sm:text-4xl md:text-5xl font-bold text-green-800"
                    style={{ fontFamily: "'Paytone One', sans-serif" }}
                  >
                    What is {moduleDetails.module_name}?
                  </h3>
                </div>
                <p
                  className="what-is-description text-base sm:text-lg text-gray-700 px-2 sm:px-0"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {moduleDetails.description}
                </p>
              </div>
            </div>
          </section>

          {/* Fun Facts Section */}
          <section className="info-cards-section w-full p-4 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-1/2">
                <div className="flex items-center justify-center md:justify-start mb-4 sm:mb-8">
                  <span className="text-3xl sm:text-4xl mr-2 sm:mr-4">🌿</span>
                  <h3
                    className={`${sectionTitleSize} font-bold text-green-800`}
                  >
                    <GradualSpacing text="Amazing Facts" />
                  </h3>
                </div>
                <div className="space-y-3 sm:space-y-4 px-2 sm:px-0">
                  {[1, 2, 3, 4].map((factId) => (
                    <div
                      key={factId}
                      className={`cursor-pointer p-4 sm:p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:shadow-none hover:translate-x-1 hover:translate-y-1 ${
                        !revealedFacts.includes(factId) ? "glow-effect" : ""
                      }`} // Add glow-effect class conditionally
                      onClick={() => revealFunFact(factId)}
                    >
                      <div className="flex items-center gap-3 sm:gap-4">
                        <span className="text-2xl sm:text-3xl">
                          {revealedFacts.includes(factId) ? "🌟" : "❓"}
                        </span>
                        <p className="funFact text-sm sm:text-base text-gray-700">
                          {revealedFacts.includes(factId)
                            ? moduleDetails[`funfact${factId}`]
                            : "Tap to reveal fun fact"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-full md:w-1/2 mt-6 md:mt-0">
                <img
                  src="../src/plantsAssets/Sample.svg"
                  alt="Plant Fun Facts"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>

            {/* Add the glow effect CSS within the style tag */}
            <style jsx global>{`
              @keyframes glow {
                0% {
                  box-shadow: 0 0 5px rgba(34, 197, 94, 0.5),
                    0 0 10px rgba(34, 197, 94, 0.5),
                    0 0 15px rgba(34, 197, 94, 0.5);
                }
                50% {
                  box-shadow: 0 0 10px rgba(34, 197, 94, 0.8),
                    0 0 20px rgba(34, 197, 94, 0.8),
                    0 0 30px rgba(34, 197, 94, 0.8);
                }
                100% {
                  box-shadow: 0 0 5px rgba(34, 197, 94, 0.5),
                    0 0 10px rgba(34, 197, 94, 0.5),
                    0 0 15px rgba(34, 197, 94, 0.5);
                }
              }

              .glow-effect {
                animation: glow 1.5s infinite ease-in-out;
              }
            `}</style>
          </section>

          {/* Medicinal Plant Parts Section */}
          <section className="info-cards-section bg-green-50 rounded-xl p-4 sm:p-6 mt-6">
            <div className="space-y-8 sm:space-y-12 px-2 sm:px-4 md:px-8 py-4 sm:py-8">
              <div className="flex items-center justify-center md:justify-start mb-4 sm:mb-8">
                <span className="text-3xl sm:text-4xl mr-2 sm:mr-4">🌿</span>
                <h3 className={`${sectionTitleSize} font-bold text-green-800`}>
                  <GradualSpacing text="Plant Parts" />
                </h3>
              </div>

              {[1, 2, 3, 4].map((partId) => (
                <div
                  key={partId}
                  role="article"
                  tabIndex={0}
                  aria-label={`Plant part ${
                    moduleDetails[`part${partId}_name`]
                  }`}
                  className="parts flex flex-col md:flex-row items-center gap-4 sm:gap-8 bg-green-100 rounded-lg p-4 sm:p-6 "
                >
                  <div className="w-full md:w-2/5 overflow-hidden rounded-md relative">
                    <img
                      src={
                        moduleDetails[`part${partId}_image`] ||
                        "/placeholder.svg"
                      }
                      alt={moduleDetails[`part${partId}_name`]}
                      className="w-64 h-64 mx-auto sm:w-80 sm:h-80 rounded-md border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform transition-all duration-200 hover:shadow-none hover:translate-x-1 hover:translate-y-1"
                    />
                  </div>
                  <div className="w-full md:w-3/5 md:-ml-6 mt-4 md:mt-0">
                    <div className="bg-green-500 rounded-md p-3 sm:p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform transition-all duration-200 hover:shadow-none hover:translate-x-1 hover:translate-y-1">
                      <p className="text-black whitespace-pre-line">
                        <strong
                          className="text-2xl sm:text-3xl md:text-4xl block mb-2 text-black"
                          style={{ fontFamily: "'Paytone One', sans-serif" }}
                        >
                          <span className="inline-block bg-yellow-400 rounded-full w-8 h-8 sm:w-10 sm:h-10 text-center mr-2 text-black">
                            {partId}
                          </span>
                          {moduleDetails[`part${partId}_name`]}
                        </strong>
                        <br />
                        <span
                          className="text-sm sm:text-base text-black"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          {moduleDetails[`part${partId}_description`]}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Match the Parts Section (Gamified) */}
          <section className="info-cards-section w-full p-4 md:p-8 bg-green-100 rounded-lg">
            <div className="flex flex-col gap-8">
              {/* Header Section */}
              <div className="header-section text-center">
                <div className="flex items-center justify-center mb-4 sm:mb-8">
                  <span className="text-3xl sm:text-4xl mr-2 sm:mr-4">🎮</span>
                  <h3
                    className={`${sectionTitleSize} font-bold text-green-800`}
                  >
                    <GradualSpacing text="Match the Parts" />
                  </h3>
                </div>

                <p
                  className="text-lg sm:text-xl text-black px-2 sm:px-0 mb-4"
                  style={{ fontFamily: "'Paytone One', sans-serif" }}
                >
                  Drag and drop the plant parts to their uses. Earn 10 points
                  for each correct match, lose 5 for a wrong one. Match all 4 to
                  win!
                </p>

                <div className="flex flex-col items-center gap-2">
                  <p
                    className="text-xl font-bold text-green-700"
                    style={{ fontFamily: "'Paytone One', sans-serif" }}
                  >
                    Score: <span className="text-3xl">{score}</span>
                  </p>
                  <p
                    className="text-base text-gray-600"
                    style={{ fontFamily: "'Paytone One', sans-serif" }}
                  >
                    Progress: {matchedParts.length}/4
                  </p>
                  <button
                    onClick={resetGame}
                    className="mt-2 px-4 py-2 bg-yellow-400 text-black rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:shadow-none hover:translate-x-1 hover:translate-y-1 active:scale-95 focus:ring-4 focus:ring-yellow-400 bounce"
                    style={{ fontFamily: "'Paytone One', sans-serif" }}
                  >
                    Reset Game
                  </button>
                </div>

                {gameCompleted && (
                  <div className="mt-4 p-4 bg-green-100 rounded-md border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center">
                    <p
                      className="text-2xl font-bold text-black animate-bounce"
                      style={{ fontFamily: "'Paytone One', sans-serif" }}
                    >
                      🎉 Congratulations! You matched all parts!
                    </p>
                  </div>
                )}
              </div>

              {/* Matching Area */}
              <div className="matching-area flex flex-col md:flex-row justify-center gap-8">
                {/* Left Column: Plant Parts */}
                <div className="parts-column w-full md:w-1/2">
                  <div className="grid grid-cols-2 gap-4">
                    {moduleDetails &&
                      [
                        moduleDetails.part1_name,
                        moduleDetails.part3_name,
                        moduleDetails.part2_name,
                        moduleDetails.part4_name,
                      ].map((part, index) => (
                        <div
                          key={index}
                          role="button"
                          tabIndex={0}
                          aria-label={`Drag plant part ${part}`}
                          draggable={!matchedParts.includes(part)}
                          className={`draggable-item bg-green-100 rounded-lg p-4 sm:p-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 flex items-center justify-center cursor-pointer
                  ${
                    matchedParts.includes(part)
                      ? "bg-green-200 opacity-50 cursor-not-allowed border-4 border-black"
                      : "hover:shadow-none hover:translate-x-1 hover:translate-y-1 active:scale-95 focus:ring-4 focus:ring-yellow-400 bounce"
                  }`}
                          onDragStart={(e) =>
                            !matchedParts.includes(part) &&
                            handleDragStart(e, part)
                          }
                          onKeyDown={(e) => {
                            if (
                              (e.key === "Enter" || e.key === " ") &&
                              !matchedParts.includes(part)
                            ) {
                              handleDragStart(e, part);
                            }
                          }}
                        >
                          <div className="flex items-center">
                            <Leaf
                              className="text-green-600 mr-2 bg-yellow-400 rounded-full p-2"
                              size={28}
                            />
                            <span
                              className="text-base sm:text-lg font-medium text-black"
                              style={{
                                fontFamily: "'Paytone One', sans-serif",
                              }}
                            >
                              {part}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Right Column: Descriptions */}
                <div className="descriptions-column w-full md:w-1/2">
                  <div className="grid grid-cols-2 gap-4">
                    {moduleDetails &&
                      shuffleArray([
                        moduleDetails.part1_description,
                        moduleDetails.part2_description,
                        moduleDetails.part3_description,
                        moduleDetails.part4_description,
                      ]).map((description, index) => (
                        <div
                          key={index}
                          role="button"
                          tabIndex={0}
                          aria-label={`Drop zone for ${description}`}
                          className={`drop-zone bg-green-100 rounded-lg p-4 sm:p-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 flex items-center justify-center
                  ${
                    matchedParts.some(
                      (part) =>
                        moduleDetails[
                          `part${matchedParts.indexOf(part) + 1}_description`
                        ] === description
                    )
                      ? "bg-green-200 border-4 border-black"
                      : "hover:shadow-none hover:translate-x-1 hover:translate-y-1 active:scale-95 focus:ring-4 focus:ring-yellow-400 bounce"
                  }`}
                          onDrop={(e) => handleDrop(e, description)}
                          onDragOver={(e) => handleDragOver(e)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              handleDrop(e, description);
                            }
                          }}
                        >
                          <div className="flex items-center">
                            <Flower
                              className="text-green-600 mr-2 bg-yellow-400 rounded-full p-2"
                              size={28}
                            />
                            <span
                              className="text-base sm:text-lg font-medium text-black"
                              style={{
                                fontFamily: "'Paytone One', sans-serif",
                              }}
                            >
                              {description}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Match Result Pop-Up */}
            {showMatchPopup && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-green-100 rounded-md p-6 w-80 md:w-96 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform transition-all duration-300">
                  <h2
                    className="text-lg md:text-xl font-bold text-center text-black"
                    style={{ fontFamily: "'Paytone One', sans-serif" }}
                  >
                    {matchMessage}
                  </h2>
                  <div className="mt-4 flex justify-center">
                    <button
                      onClick={closeMatchPopup}
                      className="px-4 py-2 bg-yellow-400 text-black rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:shadow-none hover:translate-x-1 hover:translate-y-1 active:scale-95 focus:ring-4 focus:ring-yellow-400"
                      style={{ fontFamily: "'Paytone One', sans-serif" }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* 3D Model Section */}
          <div className="section-header text-center my-6 sm:my-8">
            <div className="flex items-center justify-center mb-4 sm:mb-8">
              <span className="text-3xl sm:text-4xl mr-2 sm:mr-4">🌿</span>
              <h3 className={`${sectionTitleSize} font-bold text-green-800`}>
                <GradualSpacing text="Check Out this 3D Model" />
              </h3>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8 px-4 py-4 sm:py-8">
            <div className="w-[90%] h-80 sm:h-96 md:h-[500px] model-container relative">
              {isInstructionVisible && (
                <div className="absolute top-4 left-4 bg-green-100 text-black border-4 border-black rounded-lg p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-10 transform transition-all duration-200 hover:shadow-none hover:translate-x-1 hover:translate-y-1 bounce">
                  <button
                    onClick={() => setIsInstructionVisible(false)}
                    className="absolute top-2 right-2 text-black hover:text-red-500"
                    aria-label="Close instructions"
                  >
                    <X size={16} />
                  </button>
                  <div className="flex items-center space-x-3">
                    <div className="text-green-600">
                      <Leaf className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p
                        className="text-base sm:text-lg font-bold text-black"
                        style={{ fontFamily: "'Paytone One', sans-serif" }}
                      >
                        How to Interact:
                      </p>
                      <div className="text-sm text-black space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-green-600">🖱️</span>
                          <span>Click & drag to rotate</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-green-600">🔍</span>
                          <span>Scroll to zoom</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-green-600">🖱️</span>
                          <span>Right-click & drag to pan</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  controls.current?.reset();
                }}
                className="absolute bottom-4 right-4 bg-green-500 text-black font-bold border-4 border-black rounded-lg p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-10 transform transition-all duration-200 hover:shadow-none hover:translate-x-1 hover:translate-y-1 active:scale-95 focus:ring-4 focus:ring-yellow-400"
                aria-label="Reset Model Position"
              >
                <span className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span
                    className="text-sm sm:text-base"
                    style={{ fontFamily: "'Paytone One', sans-serif" }}
                  >
                    Reset
                  </span>
                </span>
              </button>

              <Canvas
                camera={{
                  position: [2.5, 0, -2],
                  fov: 45,
                }}
                shadows
                style={{ width: "100%", height: "100%" }}
              >
                <ambientLight intensity={2} />
                <directionalLight
                  position={[5, 5, 5]}
                  intensity={1.5}
                  castShadow
                />
                <directionalLight position={[-5, 5, -5]} intensity={1} />
                <hemisphereLight intensity={1} groundColor="white" />
                {moduleDetails?.glb_file_base64 && (
                  <Model glbData={moduleDetails.glb_file_base64} />
                )}
                <OrbitControls
                  ref={controls}
                  enablePan={true}
                  enableZoom={true}
                  enableRotate={true}
                />
              </Canvas>

              <button
                onClick={() =>
                  isSpeaking
                    ? stopSpeech()
                    : speakText(
                        ".hero-title, .scientific-name,.what-is-description,.funFact,.parts,.section-header,.benefits-container"
                      )
                }
                className={`p-2 rounded-full shadow-md transition duration-300 fixed bottom-16 sm:bottom-auto sm:top-40 right-4 z-50 ${
                  isSpeaking
                    ? "bg-white text-green-500"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
                aria-label={isSpeaking ? "Stop speaking" : "Start speaking"}
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
          </div>

          {/* Benefits Section */}
          <div className="section-header text-center my-6 sm:my-8">
            <div className="flex items-center justify-center mb-4 sm:mb-8">
              <span className="text-3xl sm:text-4xl mr-2 sm:mr-4">🌿</span>
              <h3 className={`${sectionTitleSize} font-bold text-green-800`}>
                <GradualSpacing text="Benefits" />
              </h3>
            </div>
          </div>

          <div className="benefits-container flex flex-wrap justify-center gap-4 sm:gap-8 p-4 ">
            {[1, 2, 3].map((benefitId) => (
              <div
                key={benefitId}
                className="w-full sm:w-5/12 md:w-1/3 mb-4 sm:mb-8 p-2 sm:p-4 transform transition-transform duration-300 hover:scale-105 "
              >
                <div className="bg-green-50 rounded-lg p-4 sm:p-6 h-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform transition-all duration-200 hover:shadow-none hover:translate-x-1 hover:translate-y-1 bounce">
                  <div className="flex items-center mb-2 sm:mb-3">
                    <span className="text-2xl sm:text-3xl mr-2 sm:mr-3">
                      🌿
                    </span>
                    <h3
                      className="text-lg sm:text-xl font-semibold text-green-800"
                      style={{ fontFamily: "'Paytone One', sans-serif" }}
                    >
                      {moduleDetails[`benefit${benefitId}_name`]}
                    </h3>
                  </div>
                  <p
                    className="text-sm sm:text-base text-gray-700"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {moduleDetails[`benefit${benefitId}_description`]}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Experience Section with ref */}
          <div
            ref={interactiveSectionRef}
            id="interactive-experience"
            className="section-header text-center my-6 sm:my-8"
          >
            <div className="flex items-center justify-center mb-4 sm:mb-8">
              <span className="text-3xl sm:text-4xl mr-2 sm:mr-4"></span>
              <h3
                className="text-xl sm:text-2xl md:text-4xl lg:text-6xl font-bold text-black-800"
                style={{ fontFamily: "'Paytone One', sans-serif" }}
              >
                🌿Time for some Interactive and Immersive Experience!
              </h3>
            </div>
          </div>

          <div className="ar-vr-container flex flex-wrap justify-center gap-4 sm:gap-8 p-4 bg-green-50 rounded-lg border border-green-200">
            <button
              onClick={handleARClick}
              className="ar-vr-icon w-32 h-32 sm:w-48 sm:h-48 bg-green-500 border-4 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:shadow-none hover:translate-x-1 hover:translate-y-1 active:scale-95 focus:ring-4 focus:ring-yellow-400 bounce"
              aria-label="View in Augmented Reality"
            >
              <Flower className="text-black mb-1" size={28} />
              <span
                className="text-xl sm:text-3xl font-bold text-black"
                style={{ fontFamily: "'Paytone One', sans-serif" }}
              >
                AR
              </span>
            </button>
            <button
              onClick={handleVRClick}
              className="ar-vr-icon w-32 h-32 sm:w-48 sm:h-48 bg-teal-500 border-4 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:shadow-none hover:translate-x-1 hover:translate-y-1 active:scale-95 focus:ring-4 focus:ring-yellow-400 bounce"
              aria-label="View in Virtual Reality"
            >
              <Eye className="text-black mb-1" size={28} />
              <span
                className="text-xl sm:text-3xl font-bold text-black"
                style={{ fontFamily: "'Paytone One', sans-serif" }}
              >
                VR
              </span>
            </button>
            <div className="w-full text-center mt-6 text-green-800">
              <p className="text-sm font-medium"></p>
              <p className="text-xs text-green-600 mt-1"></p>
            </div>
          </div>

          {/* Quiz Section */}
          <div className="section-header text-center my-6 sm:my-8">
            <div className="flex items-center justify-center mb-4 sm:mb-8">
              <span className="text-3xl sm:text-4xl mr-2 sm:mr-4">📝</span>
              <h3 className={`${sectionTitleSize} font-bold text-green-800`}>
                <GradualSpacing text="Time for a short Quiz" />
              </h3>
            </div>
          </div>

          <div className="quiz-section flex justify-center p-4">
            <div onClick={handleTakeQuiz}>
              <TakeQuizButton />
            </div>
          </div>

          {/* Footer with Logo Images */}
          <footer
            className="footer w-full bg-cover bg-center mt-8 p-8"
            style={{
              backgroundImage:
                "url('https://cdn.animaapp.com/projects/66fe7ba2df054d0dfb35274e/releases/676d6d16be8aa405f53530bc/img/hd-wallpaper-anatomy-human-anatomy-1.png')",
            }}
          >
            <h2 className="footer-heading text-6xl font-bold text-white text-center">
              Be the one with
              <span className="text-red-500"> Nat</span>
              <span className="text-yellow-400">ur</span>
              <span className="text-red-500">e</span>
            </h2>

            <div className="social-container bg-white rounded-lg p-4 mt-8">
              <div className="social-buttons flex flex-wrap justify-center gap-4">
                <button
                  className="social-button px-4 py-2 bg-white border border-black rounded-full hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-yellow-500 hover:text-white hover:scale-105 flex items-center justify-center"
                  onClick={() =>
                    (window.location.href = "https://www.instagram.com")
                  }
                >
                  <img
                    src={instagramLogo}
                    alt="Instagram Logo"
                    className="w-9 h-6"
                  />
                </button>
                <button
                  className="social-button px-4 py-2 bg-white border border-black rounded-full hover:bg-black hover:text-white hover:scale-105 flex items-center justify-center"
                  onClick={() =>
                    (window.location.href = "https://www.twitter.com")
                  }
                >
                  <img
                    src={twitterLogo}
                    alt="Twitter Logo"
                    className="w-6 h-6"
                  />
                </button>
                <button
                  className="social-button px-4 py-2 bg-white border border-black rounded-full hover:bg-blue-500 hover:text-white hover:scale-105 flex items-center justify-center"
                  onClick={() =>
                    (window.location.href = "https://www.facebook.com")
                  }
                >
                  <img
                    src={facebookLogo}
                    alt="Facebook Logo"
                    className="w-6 h-6"
                  />
                </button>
                <button
                  className="social-button px-4 py-2 bg-white border border-black rounded-full hover:bg-red-100 hover:text-white hover:scale-105 flex items-center justify-center"
                  onClick={() =>
                    (window.location.href = "https://www.pinterest.com")
                  }
                >
                  <img
                    src={pinterestLogo}
                    alt="Pinterest Logo"
                    className="w-6 h-6"
                  />
                </button>
              </div>

              <div className="mt-4 border-t border-gray-300"></div>
              <div className="text-center mt-2">
                <p className="text-xl text-gray-800">
                  © 2024, All Rights Reserved
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default AloePage;
