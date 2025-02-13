import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import Button from './Button';
import TakeQuizButton from './TakeQuizButton';
import Switch from './Switch';
import Cards from './Cards';
import Cards2 from './Cards2';
import Cards3 from './Cards3';
import { Navigate ,useNavigate,useParams} from "react-router-dom";
import Loader from './Loader';
import PlusButton from './PlusButton';
import { Box } from './Box1';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import Toggle from './toggle';  // Update the path as needed


function Model() {
  const { scene } = useGLTF('/model/aleovera.glb');
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

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
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
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: '3.75rem',
  lineHeight: '3.75rem',
}));

const darkTheme = createTheme({ palette: { mode: 'dark' } });
const lightTheme = createTheme({ palette: { mode: 'light' } });

export const AloePage = () => {
  const [loading, setLoading] = useState(true);
  const [isLeavesPopupVisible, setIsLeavesPopupVisible] = useState(false);
  const [isGelPopupVisible, setIsGelPopupVisible] = useState(false);
  const [navigateToCustardApple, setNavigateToCustardApple] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const paperRef = useRef(null);

  const toggleLeavesPopup = () => {
    setIsLeavesPopupVisible(!isLeavesPopupVisible);
  };

  const toggleGelPopup = () => {
    setIsGelPopupVisible(!isGelPopupVisible);
  };
  const navigate = useNavigate();

  const { moduleId } = useParams();
  



  const handleTakeQuiz = () => {
    
    console.log(moduleId);
    
    navigate(`/quiz/${moduleId}`);
  };
  useEffect(() => {
    console.log("Loading state:", loading);
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

    // Trigger initial animation after component mount
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

  if (loading) {
    return <Loader />;
  }

  if (navigateToCustardApple) {
    return <Navigate to="/custard-apple" />;  // Navigate to Custard Apple page when the button is clicked
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
                top: -1rem;
                left: -1.5rem; /* Move slightly to the left */
                padding: 0 4rem; /* Add padding to the left and right */
              }
              .scientific-name {
                font-size: 4vw;
                top: 17.5rem; /* Adjust position for mobile */
                left: -21.7rem;
                width: 100%;
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
                grid-template-columns: 1fr; /* Stack cards vertically on mobile */
                position: relative;
                top: 5rem; /* Position below the intro text */
                width: 100%;
                left: 0;
              }
              .paper-card {
                width: 90%; /* Decrease width for mobile */
                min-height: 10rem; /* Decrease height for mobile */
                position: relative;
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
                width: 90%; /* Adjust width for mobile */
                top: 95rem; /* Adjust top position for mobile */
                left: 3%; /* Center horizontally */
                font-size: 1.5rem; /* Adjust font size for mobile */
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
                font-size: 1rem; /* Adjust font size for mobile */
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
                left: 46.2%;
                transform: translateX(-50%);
                width: 90%;
                height: auto;
              }

              .benefits-card-two {
               top: 164.5rem; /* Increased top value */
                left: 46.2%;
                transform: translateX(-50%);
                width: 90%;
                height: auto;
              }

              .benefits-card-three {
               top: 182rem; /* Increased top value */
                left: 46.2%;
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
                left: -30.5rem; /* Position to the left */

              }

            .takequiz-button {
              top: 270rem; /* Adjust top position for mobile */
              left: 18%;
              transform: translateX(-60%);
            }

            .custard-apple-button {
              font-size: 1.2rem; /* Smaller font size for mobile */
              top: 290rem; /* Adjust top position for mobile */
              left: 23%;
              transform: translateX(-50%);
              width: 100px; /* Set a specific width */
              padding: 0px 10px; /* Adjust padding for a narrower look */
            }
            }
              
          `}
        </style>
        <div className="bg-[#ffffff] overflow-hidden w-[1440px] h-[4853px] relative">
          {/* <img
            className="absolute w-[711px] h-[479px] top-[1614px] left-[680px] object-cover"
            alt="Fresh aloe vera"
            src="./static/img/fresh-aloe-vera-plant-isolated-white-vibrant-aloe-vera-plant-wat.png"
          /> */}
          <div className="absolute top-[1750px] left-[950px] z-10 plus-button-container">
            <PlusButton onClick={toggleLeavesPopup} />
            {isLeavesPopupVisible && (
              <div className="absolute top-[2.5rem] left-[2.8125rem] bg-white border border-gray-300 p-4 rounded shadow-md w-[25rem] h-[11.875rem] z-20 popup-content">
                <span className="font-bold [font-family:'Poppins',Helvetica] font-bold text-[#025169] text-[1.5625rem]">{/*Leaves*/}PlantPart1</span>
                <span className="[font-family:'Poppins',Helvetica] font-normal text-[#025169] text-[1.125rem] tracking-[0] leading-[2.1875rem]">
                  {/* : Thick, fleshy, and lance-shaped with serrated edges. They are
                    typically green to gray-green with white flecks. */}
                    : PlantPart1Description
                      <br />
                    <br />
                    </span>
              </div>
            )}
          </div>
          <div className="absolute top-[2050px] left-[690px] z-10 plus-button-container">
            <PlusButton onClick={toggleGelPopup} />
            {isGelPopupVisible && (
              <div className="absolute top-[-6.25rem] left-[2.8125rem] bg-white border border-gray-300 p-4 rounded shadow-md w-[25rem] h-[11.875rem] z-20 popup-content">
                <span className="font-bold [font-family:'Poppins',Helvetica] font-bold text-[#025169] text-[1.5625rem]">{/*Gel*/}PlantPart2</span>
                <span className="[font-family:'Poppins',Helvetica] font-normal text-[#025169] text-[1.125rem] tracking-[0] leading-[2.1875rem]">
                {/* : The inner part of the leaf contains a clear, gel-like substance
                that is rich in nutrients and has various medicinal properties. */}
                : PlantPart2Description
                      <br />
                    <br />
                    </span>
              </div>
            )}
          </div>

          <div className="absolute w-[1440px] h-24 top-0 left-0 bg-[#FFFFFF]">
            <div className="absolute top-4 right-4">
              <Toggle />
            </div>
          </div>

          <div className="absolute w-[1238px] top-[850px] left-[74px] z-10">
            <div ref={paperRef} className="paper-container p-16 bg-white rounded-lg">
              <Paper
                className="paper-card"
                elevation={6}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  color: '#725c5c',
                  borderRadius: 2,
                  fontSize: '1.1rem',
                  fontFamily: 'Poppins, sans-serif',
                  transform: isVisible ? 'translateX(0)' : 'translateX(-100%)',
                  opacity: isVisible ? 1 : 0,
                  transition: 'all 0.8s ease-out',
                  minHeight: '12.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'white',
                  zIndex: 10
                }}
              >
                Botanic Description
              </Paper>
              <Paper
                className="paper-card"
                elevation={6}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  color: '#725c5c',
                  borderRadius: 2,
                  fontSize: '1.1rem',
                  fontFamily: 'Poppins, sans-serif',
                  transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
                  opacity: isVisible ? 1 : 0,
                  transition: 'all 0.8s ease-out',
                  minHeight: '12.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'white',
                  zIndex: 10
                }}
              >
                Extras
              </Paper>
            </div>
          </div>

          <div className="absolute w-[360px] h-[46px] top-[2042px] left-[1658px] bg-[#333333c4]" />

          <div className="absolute w-full h-[7.125rem] top-[1437px] bg-[#94B5A0] model-section">
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
            style={{ top: '3350px' }}
          >
            {/* AR Icon */}
            <div className="group relative w-[16.625rem] h-[16.625rem] bg-white rounded-[2.5rem] border border-black shadow-[inset_10px_10px_4px_#00000040] transition-all duration-300 ease-in-out hover:w-[25rem] flex items-center overflow-hidden">
              <img
                className="absolute w-[7.5rem] h-[7.5rem] top-[4.6875rem] left-[5rem] transition-all duration-300 ease-in-out group-hover:translate-x-[-3.125rem] object-cover"
                alt="Augmented Reality Icon"
                src="static\img\ar-icon.svg"
              />
              <span className="ml-[15rem] text-[3.25rem] font-bold text-gray-800 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
                AR
              </span>
            </div>

            {/* VR Icon */}
            <div className="group relative w-[16.625rem] h-[16.625rem] bg-white rounded-[2.5rem] border border-black shadow-[inset_10px_10px_4px_#00000040] transition-all duration-300 ease-in-out hover:w-[25rem] flex items-center overflow-hidden">
              <img
                className="absolute w-[7.5rem] h-[7.5rem] top-[4.6875rem] right-[4.375rem] transition-all duration-300 ease-in-out group-hover:translate-x-[3.125rem] object-cover"
                alt="Virtual Reality Icon"
                src="static\img\vr-icon.svg"
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

            <div className="absolute top-[4300px] left-[50%] transform -translate-x-1/2 takequiz-button"
             onClick={handleTakeQuiz}>
              <TakeQuizButton />
            </div>

            <div className="absolute top-[4600px] left-[85%] custard-apple-button">
              <button
                onClick={() => setNavigateToCustardApple(true)}
                className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
              >
                Go to Custard Apple
              </button>
            </div>
          </section>

          <p className="absolute w-[38.625rem] top-[101.1875rem] left-[2.6875rem] [font-family:'Poppins',Helvetica] font-bold text-[#063229] text-[2.1875rem] tracking-[0] leading-[2.20625rem] aloe-text">
            {/* Aloe vera: Nature&#39;s First Aid */}
            Plant Name: Subtopic Title
          </p>

          <section id="3d-model" className="absolute w-[30.375rem] top-[105.1875rem] left-[4.4375rem]">
            <div className="[font-family:'Poppins',Helvetica] font-normal text-[#063229] text-[1.375rem] text-justify tracking-[0] leading-[2.1875rem]">

              <span className="[font-family:'Poppins',Helvetica] font-normal text-[#025169] text-[1.125rem] tracking-[0] leading-[2.1875rem] aloe-subtext">
              {/* Welcome to the world of Aloe Vera, a plant so cool it's been nicknamed the "Plant of Immortality"! Get ready to dive into a fun and exciting journey */}
              Description
                <br />
                <br />
              </span>
            </div>
          </section>

          <div className="absolute w-[780px] h-[549px] top-[150px] left-[674px]">
            <div className="relative w-[766px] h-[557px]">
            </div>
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
            <div className="absolute top-[125px] left-[40px] [font-family:'Bebas_Neue',Helvetica] font-light text-[#94B5A0] text-center tracking-[0.66875rem] leading-[normal]">
              {/* Aloe<span className="opacity-100"></span><span className='text-[#0A342A]'>vera</span> */}
              TITLE
            </div>

            <div className="absolute scientific-name top-[35.9375rem] left-[70rem] [font-family:'Times_New_Roman-Italic',Helvetica] font-bold italic text-black text-[1.8125rem] text-center tracking-[0.14625rem] leading-[normal] whitespace-nowrap">
              {/* Aloe Barbadensis */}
              Scientific Name
            </div>

            {/* <div className="absolute intro-text top-[35.9375rem] left-[3.125rem] text-left p-4 max-w-[25rem]">
              <div className="[font-family:'Poppins',Helvetica] font-normal text-black text-[0.75rem] leading-[normal] tracking-[0.0625rem]">
                Welcome to the world of Aloe Vera, a plant so cool it's been nicknamed the "Plant of Immortality"! Get ready to dive into a fun and exciting journey
              </div>
            </div> */}
          </section>

          {/* <p className="absolute top-[1205px] left-[566px] [font-family:'Poppins',Helvetica] font-bold text-[#063229] text-[28px] text-center tracking-[2.20px] leading-[normal]">
            Scroll to get Started
          </p> */}

          <p className="absolute top-[118.75rem] left-[3.25rem] [font-family:'Poppins',Helvetica] font-bold text-[#025169] text-[1.4375rem] text-center tracking-[0.02875rem] leading-[normal] aloe-click">
            Click on the different Parts to find out more
          </p>
          <p className="absolute top-[118.75rem] left-[3.25rem] [font-family:'Poppins',Helvetica] font-bold text-[#025169] text-[1.4375rem] text-center tracking-[0.02875rem] leading-[normal] aloe-click-mobile">
            To view info on the plant, Use Desktop View
          </p>
          <div className="absolute top-[81.25rem] left-[43.75rem]">
            {/* <Button /> */}
          </div>
          {/* <Switch /> */}
          <Box />

          <div className="absolute w-full h-[54.3125rem] top-[89.8125rem] left-0 model-canvas">
            <Canvas camera={{ position: [2.192129250918481, 1, 4.405377373613455], fov: 45 }} shadows>
              <ambientLight intensity={2} />
              <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
              <directionalLight position={[-5, 5, -5]} intensity={1} />
              <hemisphereLight intensity={1} groundColor="white" />

              <Model />
            </Canvas>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AloePage;