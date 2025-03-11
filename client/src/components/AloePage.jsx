import React, { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import TakeQuizButton from "./TakeQuizButton";
import { GradualSpacing } from "./GradualSpacing"; // Adjust the path as necessary
import Cards from "./Cards";
import Cards2 from "./Cards2";
import Cards3 from "./Cards3";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Loader from "./Loader";
import PlusButton from "./PlusButton";
import Paper from "@mui/material/Paper";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import skillverseLogo from "../assets/skillverse.svg";
import NavButton from "./NavButton";
import ProfileButton from "./profile";
import { Menu, X } from "lucide-react"; // For icons
import aloeverohero from "../plantsAssets/image1.jpg";
import MusicControl from "./MusicControl";

// Updated Model function with responsive scaling and positioning
function Model() {
  const { scene } = useGLTF("/model/aleovera.glb");
  const modelRef = useRef();
  const [isMobile, setIsMobile] = useState(false);

  // Check if viewport is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add event listener for window resize
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
      scale={isMobile ? 5 : 8} // Reduced scale for mobile
      position={isMobile ? [0, -0.4, 0] : [1.2, -0.2, 0]} // Centered position for mobile
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
  const [isSpeaking, setIsSpeaking] = useState(false); // Track if speech
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu
  const [moduleName, setModuleName] = useState(""); // State to store module name
  const [revealedFacts, setRevealedFacts] = useState([]);
  const paperRef = useRef(null);

  useEffect(() => {
    const fetchModuleDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/modules/${moduleId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const moduleData = await response.json();
        if (moduleData.length > 0) {
          setModuleName(moduleData[0].module_name); // Set the module name
          console.log(moduleName)
        } else {
          console.error("Module not found");
        }
      } catch (error) {
        console.error("Error fetching module details:", error);
      }
    };

    if (moduleId) {
      fetchModuleDetails();
    }
  }, [moduleId]);

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

  const navigate = useNavigate();

  const handleTakeQuiz = () => {
    navigate(`/quiz/${moduleId}`, { 
      state: { fromApp: true }  // Add protected navigation state
    });
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
    <div className="flex justify-center items-center w-full min-h-screen bg-white">
      <div className="relative w-full max-w-screen-2xl mx-auto">
        <style>
          {`
             @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap");

    /* Base styles */
    * {
      box-sizing: border-box;
      font-family: 'Poppins', sans-serif; /* Apply Poppins globally */
    }

            
            body {
              margin: 0;
              padding: 0;
              overflow-x: hidden;
            }
            
            /* Responsive container */
            .main-container {
              position: relative;
              width: 100%;
              overflow-x: hidden;
              display: flex;
              flex-direction: column;
            }
            
            /* Header */
            .header {
              width: 100%;
              height: auto;
              padding: 1rem;
              display: flex;
              justify-content: space-between;
              align-items: center;
              position: relative;
              z-index: 100;
            }
            
            .logo {
              height: 60px;
              width: auto;
              cursor: pointer;
            }
            
            .nav-buttons {
              display: flex;
              gap: 2rem;
            }
            
            /* Hero section */
.hero-section {
  position: relative;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto 2rem auto;
  overflow: hidden;
  
}

.hero-image {
  width: 100%;
  height: auto;
  border-radius: 20px;
  object-fit: cover;
  border: 0.1px solid rgba(0, 0, 0, 0.1); /* Light black border */
  background: #f0f0f0; /* Light background for neomorphism */
  box-shadow: 
    8px 8px 16px rgba(0, 0, 0, 0.1), /* Outer shadow */
    -8px -8px 16px rgba(255, 255, 255, 0.8); /* Inner highlight */
}

.hero-text-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  box-sizing: border-box;
  font-family: 'Bebas Neue', sans-serif;
}

.hero-title {
  font-family: 'Bebas Neue', sans-serif;
  color: #89CA6E;
  text-align: center;
  letter-spacing: 0.5rem;
  line-height: 1;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.5));
  font-size: clamp(18rem, 15vw, 6rem); /* Adjust as needed */
  margin: 0;
  padding: 0;
  width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
    z-index: 1000; 
}

.scientific-name {
  font-family: 'Times New Roman', serif;
  font-style: italic;
  font-weight: bold;
  color: black;
  font-size: clamp(1rem, 3vw, 2rem);
  margin-top: 0.5rem;
  text-align: center;
  width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

/* Media query for responsive adjustments */
@media (max-width: 768px) {
  .hero-title {
    letter-spacing: 0.3rem;
  }
  
  .hero-text-container {
    padding: 0.5rem;
  }
  
  .hero-title {
    font-size: clamp(3rem, 12vw, 8rem);
  }
  
  .scientific-name {
    font-size: 1rem;
  }
}
            
            /* Info cards */
            .info-cards-section {
              width: 100%;
              padding: 2rem 1rem;
              display: flex;
              flex-wrap: wrap;
              gap: 2rem;
              justify-content: center;
            }
            
            .info-card {
              background-color: white;
              border: 0.1px solid rgba(0, 0, 0, 0.14); /* Light black border */
              border-radius: 1.5rem;
              padding: 1.5rem;
              box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.2);
              flex: 1;
              min-width: 280px;
              max-width: 500px;
              margin-bottom: 1rem;
              transition: transform 0.8s ease-out, opacity 0.8s ease-out;
              transform: translateX(0);
              opacity: 1;
            }
            
            /* Section headers */
            .section-header {
              width: 100%;
              background-color: #94B5A0;
              padding: 2rem;
              margin: 3rem 0;
              text-align: center;
            }
            
            .section-title {
              font-family: 'Poppins', sans-serif;
              font-weight: bold;
              font-size: clamp(1.5rem, 5vw, 3.5rem);
              margin: 0;
            }
            
            .section-subtitle {
              font-family: 'Poppins', sans-serif;
              font-size: clamp(0.875rem, 2vw, 1.25rem);
              margin-top: 0.5rem;
            }
            
            /* 3D model section */
            .model-container {
              width: 100%;
              height: 80vh;
              max-height: 800px;
              position: relative;
            }
            
            .plus-button-container {
              position: absolute;
              z-index: 10;
            }
            
            .popup-content {
              background-color: white;
              border: 1px solid #ccc;
              border-radius: 0.5rem;
              padding: 1rem;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
              width: 100%;
              max-width: 400px;
              z-index: 20;
            }
            
            /* Benefits cards */
            .benefits-container {
              width: 100%;
              padding: 2rem 1rem;
              display: flex;
              flex-wrap: wrap;
              gap: 4rem;
              justify-content: center;
            }
            
            /* Interactive experience */
            .ar-vr-container {
              width: 100%;
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
              gap: 4rem;
              padding: 2rem 1rem;
            }
            
            .ar-vr-icon {
              position: relative;
              background-color: white;
              border-radius: 2.5rem;
              border: 1px solid black;
              box-shadow: inset 10px 10px 4px rgba(0, 0, 0, 0.25);
              display: flex;
              align-items: center;
              justify-content: center;
              overflow: hidden;
              cursor: pointer;
              transition: all 0.3s ease-in-out;
              width: clamp(200px, 30vw, 400px);
              height: clamp(200px, 30vw, 400px);
            }
            
            /* Quiz section */
            .quiz-section {
              width: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
              padding: 2rem 1rem;
              gap: 2rem;
            }
            
            /* Footer */
            .footer {
              width: 100%;
              background-size: cover;
              background-position: center;
              padding: 2rem 1rem;
              position: relative;
              margin-top: 3rem;
              min-height: 440px;
              display: flex;
              flex-direction: column;
              justify-content: flex-end;
            }
            
            .footer-heading {
              color: white;
              font-size: clamp(2rem, 5vw, 4rem);
              text-align: center;
              margin-bottom: auto;
              padding-top: 2rem;
            }
            
            .social-container {
              background-color: white;
              border-radius: 12px;
              padding: 1.5rem;
              width: 100%;
              max-width: 1200px;
              margin: 0 auto;
            }
            
            .social-buttons {
              display: flex;
              flex-wrap: wrap;
              gap: 1rem;
              justify-content: center;
            }
            
            .social-button {
              min-width: 120px;
              height: 44px;
              background-color: white;
              border: 1px solid black;
              border-radius: 9999px;
              transition: all 0.2s ease-in-out;
            }
            
            /* Mobile menu */
            .mobile-menu-button {
              display: none;
            }
            
            .mobile-menu {
              display: none;
              background-color: white;
              border: 1px solid #ccc;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              z-index: 1000;
              position: absolute;
              right: 1rem;
              top: 5rem;
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
            
            /* Media Queries */
            @media (max-width: 992px) {
              .ar-vr-container {
                flex-direction: column;
                align-items: center;
              }
              
              .ar-vr-icon {
                width: 80%;
                max-width: 300px;
                height: 300px;
              }
            }
            
            @media (max-width: 768px) {
              .nav-buttons {
                display: none;
              }
              
              .mobile-menu-button {
                display: block;
              }
              
              .mobile-menu {
                display: ${isMobileMenuOpen ? "block" : "none"};
              }
              
              .hero-title {
                font-size: clamp(3rem, 12vw, 8rem);
              }
              
              .scientific-name {
                font-size: 1rem;
              }
              
              .info-card {
                flex-basis: 100%;
              }
              
              .plus-button-container, 
              .popup-content {
                display: none;
              }
              
              .ar-vr-icon span {
                opacity: 1;
                font-size: 2rem;
              }
              
              .ar-vr-icon img {
                display: none;
              }
            }
            
            @media (min-width: 769px) {
              .ar-vr-icon:hover {
                width: clamp(300px, 40vw, 500px);
              }
              
              .ar-vr-icon img {
                width: 120px;
                height: 120px;
                transition: all 0.3s ease-in-out;
              }
              
              .ar-vr-icon:hover img {
                transform: translateX(-50px);
              }
              
              .ar-vr-icon:nth-child(2):hover img {
                transform: translateX(50px);
              }
              
              .ar-vr-icon span {
                margin-top: 200px;
                margin-left: 20px;
                font-size: 3.25rem;
                font-weight: bold;
                color: #333;
                opacity: 0;
                transition: opacity 0.3s ease-in-out;
              }
              
              .ar-vr-icon:hover span {
                opacity: 1;
              }
            }
              
          `}
        </style>

        <div className="main-container">
          {/* Header */}
          <header className="header">
            <img
              className="logo"
              src={skillverseLogo}
              alt="logo"
              onClick={() => navigate("/")}
            />

            <div className="nav-buttons">
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

            <div className="flex items-center gap-4">
              <div>
                <MusicControl />
              </div>
              <div>
                <ProfileButton />
              </div>

              {/* Mobile Menu Button */}
              <button className="mobile-menu-button" onClick={toggleMobileMenu}>
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Mobile Menu Dropdown */}
            <div className="mobile-menu">
              <button onClick={handleCourses}>Courses</button>
              <button onClick={handelExploreCourseClick}>Explore</button>
              <button onClick={handelAboutUsClick}>About Us</button>
            </div>
          </header>

          {/* Hero Section */}
          <section className="hero-section">
            <style>
              {`
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
    `}
            </style>

            <img src={aloeverohero} alt="Aloe Vera" className="hero-image" />
            <div className="hero-text-container">
              {/* Use GradualSpacing for the hero text */}
              <div className="hero-title">
                {moduleName}
              </div>
              <p className="scientific-name">Aloe Barbadensis</p>
            </div>
          </section>

          <section className="info-cards-section">
            <div className="flex flex-col md:flex-row items-center gap-8 px-4 py-8">
              {/* Image Section */}
              <div className="w-full md:w-1/2">
                <img
                  src="../src/plantsAssets/Aloeverahero.png" // Replace with the actual path to the Aloe Vera image
                  alt="Aloe Vera"
                  className="w-80 h-80 rounded-lg shadow-lg ml-[120px]"
                />
              </div>

              {/* Information Section */}
              <div className="w-full md:w-1/2">
                <h3 className="font-bold text-center md:text-left text-4xl mb-9">
                <GradualSpacing text="What is Aloe Vera?"/>
                </h3>
                <p className="text-[#725c5c] whitespace-pre-line text-lg">
                  Aloe Vera is a green, spiky plant 🌿 that is super cool
                  because it has a special gel inside its leaves. This gel is
                  like nature's magic—it helps heal cuts and burns 🔥, makes
                  skin soft, and even soothes sunburns! ☀️
                  <br />
                  <br />
                  People also use aloe vera in drinks 🥤 and shampoos because it
                  is good for the body and hair. It’s like a superhero plant
                  that takes care of you! 💚✨
                </p>
              </div>
            </div>
          </section>

          {/* Fun Facts Section */}
          <section className="info-cards-section ">
            <div className="flex flex-col md:flex-row items-center gap-8 px-8 py-8 ">
              {/* Text Section (Left Side) */}
              <div className="w-full md:w-1/2 ">
                <h3 className="font-bold text-center md:text- text-7xl mb-8">
                <GradualSpacing text="Fun Facts"/>
                </h3>
                <div className="space-y-4">
                  {/* Fun Fact 1 */}
                  <div
                    className="cursor-pointer p-4 bg-white rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
                    onClick={() => revealFunFact(1)}
                  >
                    <p className="text-[#725c5c]">
                      {revealedFacts.includes(1) ? (
                        "A long time ago, people called Aloe Vera the 'Plant of Immortality' because it stays fresh for a long time and has so many benefits! Even Egyptian queens loved it! 👑🌿"
                      ) : (
                        <span className="text-gray-400">
                          Tap to reveal fun fact 1
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Fun Fact 2 */}
                  <div
                    className="cursor-pointer p-4 bg-white rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
                    onClick={() => revealFunFact(2)}
                  >
                    <p className="text-[#725c5c]">
                      {revealedFacts.includes(2) ? (
                        "Aloe Vera is super tough! It doesn’t even need soil to grow—just water and air! It’s like a superhero plant! 💦🦸‍♂️"
                      ) : (
                        <span className="text-gray-400">
                          Tap to reveal fun fact 2
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Fun Fact 3 */}
                  <div
                    className="cursor-pointer p-4 bg-white rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
                    onClick={() => revealFunFact(3)}
                  >
                    <p className="text-[#725c5c]">
                      {revealedFacts.includes(3) ? (
                        "If you ever get a hot sunburn from playing outside, Aloe Vera gel can cool it down and make it feel better. It's like a plant-made ice pack! 🧊🌿"
                      ) : (
                        <span className="text-gray-400">
                          Tap to reveal fun fact 3
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Fun Fact 4 */}
                  <div
                    className="cursor-pointer p-4 bg-white rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
                    onClick={() => revealFunFact(4)}
                  >
                    <p className="text-[#725c5c]">
                      {revealedFacts.includes(4) ? (
                        "Some Aloe Vera plants can live for many, many years! That’s why people love growing them at home! "

                      ) : (
                        <span className="text-gray-400">
                          Tap to reveal fun fact 4
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Image Section (Right Side) */}
              <div className="w-full ">
                <img
                  src="../src/plantsAssets/Sample.svg" // Replace with the actual path to the image
                  alt="Aloe Vera Fun Facts"
                  className="w-100 h-100 rounded-lg shadow-lg ml-[400px]"
                />
              </div>
            </div>
          </section>

          {/* Parts Used with Description Section */}
          <section className="info-cards-section">
            <div className="space-y-8 px-24 py-8">
              {/* Heading */}
              <h3 className="font-bold text-left text-7xl mb-10 ">
              <GradualSpacing text="Parts Used"/>
                </h3>
              {/* Image-Text Pair 1 */}
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Image */}
                <div className="w-full md:w-1/2">
                  <img
                    src="../src/plantsAssets/aloegel.jpg" // Replace with the actual path to the first image
                    alt="Aloe Vera Gel Part 1"
                    className="w-80 h-80 rounded-lg shadow-lg"
                  />
                </div>

                {/* Text */}
                <div className="w-full ml-[-120px]">
                  <p className="text-[#725c5c] whitespace-pre-line ">
                    <strong className="text-5xl">✨ 1. Gel 🏥</strong> <br />:
                    The inside of the Aloe Vera leaf has a special jelly-like
                    gel! It’s super cool because it can help with cuts, burns,
                    and itchy skin. It’s like nature’s magic healing potion!
                    ✨💧
                  </p>
                </div>
              </div>
              <br />
              {/* Image-Text Pair 2 */}
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Image */}
                <div className="w-full md:w-1/2">
                  <img
                    src="../src/plantsAssets/aloeleaf.jpg" // Replace with the actual path to the second image
                    alt="Aloe Vera Leaf"
                    className="w-80 h-80 rounded-lg shadow-lg"
                  />
                </div>

                {/* Text */}
                <div className="w-full ml-[-120px]">
                  <p className="text-[#725c5c] whitespace-pre-line">
                    <strong className="text-5xl">🍃 2. Leaf 💦</strong>
                    <br />
                    :The Aloe Vera leaves are big and thick because they store
                    water and food inside. That’s why the plant can survive even
                    when it’s super hot! ☀️🌵
                  </p>
                </div>
              </div>
              <br />
              {/* Image-Text Pair 3 */}
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Image */}
                <div className="w-full md:w-1/2">
                  <img
                    src="../src/plantsAssets/aloeflower.jpg" // Replace with the actual path to the third image
                    alt="Aloe Vera Flower"
                    className="w-80 h-80 rounded-lg shadow-lg"
                  />
                </div>

                {/* Text */}
                <div className="w-full ml-[-120px]">
                  <p className="text-[#725c5c] whitespace-pre-line">
                    <strong className="text-5xl">🌸 3. Flower 🌻</strong>
                    <br /> Aloe Vera can grow tall, beautiful flowers in yellow
                    or orange colors. While we mostly use the leaves, the
                    flowers make the plant look extra pretty! 🎨🐝
                  </p>
                </div>
              </div>
              <br />
              {/* Image-Text Pair 4 */}
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Image */}
                <div className="w-full md:w-1/2">
                  <img
                    src="../src/plantsAssets/aloeroot.jpg" // Replace with the actual path to the fourth image
                    alt="Aloe Vera Roots"
                    className="w-80 h-80 rounded-lg shadow-lg"
                  />
                </div>

                {/* Text */}
                <div className="w-full ml-[-120px]">
                  <p className="text-[#725c5c] whitespace-pre-line">
                    <strong className="text-5xl">🌱 4. Roots 🌍</strong> <br />
                    :The roots hold the plant tight in the soil so it doesn’t
                    fall over. They also drink water from the ground, like how
                    we drink juice with a straw! 🥤💚
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 3D Model Section */}
          <div className="section-header">
            <h2 className="section-title">Check Out this 3D model</h2>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8 px-4 py-8">
            <div className="w-full md:w-1/3">
              <h3 className="text-xl md:text-2xl font-bold text-[#063229] mb-4">
                Welcome to the world of Aloe Vera, a plant so cool it's been
                nicknamed the "Plant of Immortality"
              </h3>
              <p className="text-lg text-[#025169]">
                Click on the different Parts to find out more
              </p>
              <p className="md:hidden text-lg text-[#025169]">
                To view info on the plant, Use Desktop View
              </p>
            </div>

            <div className="w-full md:w-2/3 h-[500px] model-container">
              <div className="absolute top-[100px] left-[62%] z-10 plus-button-container">
                <PlusButton onClick={toggleLeavesPopup} />
                {isLeavesPopupVisible && (
                  <div className="popup-content">
                    <span className="font-bold text-[#025169] text-xl">
                      Leaves
                    </span>
                    <p className="text-[#025169]">
                      : Thick, fleshy, and lance-shaped with serrated edges.
                      They are typically green to gray-green with white flecks.
                    </p>
                  </div>
                )}
              </div>

              <div className="absolute top-[350px] left-[40%] z-10 plus-button-container">
                <PlusButton onClick={toggleGelPopup} />
                {isGelPopupVisible && (
                  <div className="popup-content">
                    <span className="font-bold text-[#025169] text-xl">
                      Gel
                    </span>
                    <p className="text-[#025169]">
                      : The inner part of the leaf contains a clear, gel-like
                      substance that is rich in nutrients and has various
                      medicinal properties.
                    </p>
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

              <button
                onClick={() =>
                  isSpeaking
                    ? stopSpeech()
                    : speakText(
                        ".section-title, .section-subtitle, .hero-title, .scientific-name, .info-card"
                      )
                }
                className={`p-2 rounded-full shadow-md transition duration-300 fixed top-40 right-4 z-50 ${
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
          </div>

          {/* Benefits Section */}
          <div className="section-header">
            <h2 className="section-title">Benefits</h2>
            {/* <p className="section-subtitle">(Hover to reveal)</p> */}
          </div>

          <div className="benefits-container">
            <div className="w-full md:w-1/3 mb-8">
              <Cards />
            </div>

            <div className="w-full md:w-1/3 mb-8">
              <Cards2 />
            </div>

            <div className="w-full md:w-1/3 mb-8">
              <Cards3 />
            </div>
          </div>

          {/* Interactive Experience Section */}
          <div className="section-header">
            <h2 className="section-title">
              Time for some Interactive and Immersive Experience!
            </h2>
          </div>

          <div className="ar-vr-container">
            {/* AR Icon */}
            <div onClick={handleARClick} className="ar-vr-icon">
              <img
                className="absolute"
                alt="Augmented Reality Icon"
                src="../static/img/ar-icon.svg"
              />
              <span>AR</span>
            </div>

            {/* VR Icon */}
            <div onClick={handleVRClick} className="ar-vr-icon">
              <img
                className="absolute"
                alt="Virtual Reality Icon"
                src="../static/img/vr-icon.svg"
              />
              <span>VR</span>
            </div>
          </div>

          {/* Quiz Section */}
          <div className="section-header">
            <h2 className="section-title">Time for a short Quiz</h2>
          </div>

          <div className="quiz-section">
            <div onClick={handleTakeQuiz}>
              <TakeQuizButton />
            </div>

            {/* <button
              onClick={() => setNavigateToCustardApple(true)}
              className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300 mt-8"
            >
              Go to Custard Applexzs
            </button> */}
          </div>

          {/* Footer */}
          <footer
            className="footer"
            style={{
              backgroundImage:
                "url('https://cdn.animaapp.com/projects/66fe7ba2df054d0dfb35274e/releases/676d6d16be8aa405f53530bc/img/hd-wallpaper-anatomy-human-anatomy-1.png')",
            }}
          >
            <h2 className="footer-heading">
              Be the one with
              <span className="text-red-500"> Nat</span>
              <span className="text-[#B9DE00]">ur</span>
              <span className="text-red-500">e</span>
            </h2>

            <div className="social-container">
              <div className="social-buttons">
                {/* Instagram Button */}
                <button
                  className="social-button hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-yellow-500 hover:text-white hover:scale-105"
                  onClick={() =>
                    (window.location.href = "https://www.instagram.com")
                  }
                >
                  Instagram
                </button>

                {/* Twitter Button */}
                <button
                  className="social-button hover:bg-black hover:text-white hover:scale-105"
                  onClick={() =>
                    (window.location.href = "https://www.twitter.com")
                  }
                >
                  Twitter
                </button>

                {/* Facebook Button */}
                <button
                  className="social-button hover:bg-blue-500 hover:text-white hover:scale-105"
                  onClick={() =>
                    (window.location.href = "https://www.facebook.com")
                  }
                >
                  Facebook
                </button>

                {/* Pinterest Button */}
                <button
                  className="social-button hover:bg-red-500 hover:text-white hover:scale-105"
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
          </footer>
        </div>
      </div>
    </div>
  );
};

export default AloePage;