import React, { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import Button from "../Button";
import TakeQuizButton from "../TakeQuizButton";
import Switch from "../Switch";
import Cards from "./card1";
import Cards2 from "./card2";
import Cards3 from "./card3";
import { Navigate } from "react-router-dom";
import Loader from "../Loader";
import PlusButton from "../PlusButton";
import { Box5 } from "../Box5";
import Paper from "@mui/material/Paper";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import MusicControl from "../MusicControl";

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

export const TulsiPlant = () => {
  const [loading, setLoading] = useState(true);
  const [isLeavesPopupVisible, setIsLeavesPopupVisible] = useState(false);
  const [isGelPopupVisible, setIsGelPopupVisible] = useState(false);
  const [navigateToCustardApple, setNavigateToCustardApple] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const paperRef = useRef(null);

  const toggleLeavesPopup = () => {
    // Close the gel popup if it's open
    if (isGelPopupVisible) {
      setIsGelPopupVisible(false);
    }
    // Toggle the leaves popup
    setIsLeavesPopupVisible(!isLeavesPopupVisible);
  };

  const toggleGelPopup = () => {
    // Close the leaves popup if it's open
    if (isLeavesPopupVisible) {
      setIsLeavesPopupVisible(false);
    }
    // Toggle the gel popup
    setIsGelPopupVisible(!isGelPopupVisible);
  };

  useEffect(() => {
    console.log("Loading state:", loading);
    window.scrollTo(0, 0); // Ensures the page scrolls to the top
    const timer = setTimeout(() => {
      setLoading(false);
      navigate("/next-page"); // Navigates to next page
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

  if (loading) {
    return <Loader />;
  }

  // if (navigateToCustardApple) {
  //   return <Navigate to="/" />;  // Navigate to Custard Apple page when the button is clicked
  // }

  return (
    <div className="bg-[#FFFFFF] flex justify-center items-center w-full min-h-screen">
      <div className="max-w-[1440px] w-full">
        <style>
          {`
            @import url("https://fonts.googleapis.com/css?family=Poppins:700,400|Poly:400,italic|Bebas+Neue:400");
          `}
        </style>
        <div className="bg-white overflow-hidden w-[1440px] h-[4853px] relative">
          {/* <img
            className="absolute w-[711px] h-[479px] top-[1614px] left-[680px] object-cover"
            alt="Fresh aloe vera"
            src="./static/img/fresh-aloe-vera-plant-isolated-white-vibrant-aloe-vera-plant-wat.png"
          /> */}
          <div className="absolute top-[1750px] left-[950px] z-10">
            <PlusButton onClick={toggleLeavesPopup} />
            {isLeavesPopupVisible && (
              <div className="absolute top-[40px] left-[45px] bg-white border border-gray-300 p-4 rounded shadow-md w-[400px] h-[190px] z-20">
                <span className="font-bold [font-family:'Poppins',Helvetica] font-bold text-[#025169] text-[25px]">
                  Leaves
                </span>
                <span className="[font-family:'Poppins',Helvetica] font-normal text-[#025169] text-[18px] tracking-[0] leading-[35px]">
                  : Thick, fleshy, and lance-shaped with serrated edges. They
                  are typically green to gray-green with white flecks.
                  <br />
                  <br />
                </span>
              </div>
            )}
          </div>
          <div className="absolute top-[2050px] left-[690px] z-10">
            <PlusButton onClick={toggleGelPopup} />
            {isGelPopupVisible && (
              <div className="absolute top-[-100px] left-[45px] bg-white border border-gray-300 p-4 rounded shadow-md w-[400px] h-[190px] z-20">
                <span className="font-bold [font-family:'Poppins',Helvetica] font-bold text-[#025169] text-[25px]">
                  Gel
                </span>
                <span className="[font-family:'Poppins',Helvetica] font-normal text-[#025169] text-[18px] tracking-[0] leading-[35px]">
                  : The inner part of the leaf contains a clear, gel-like
                  substance that is rich in nutrients and has various medicinal
                  properties.
                  <br />
                  <br />
                </span>
              </div>
            )}
          </div>

          <div className="absolute w-[1440px] h-24 top-0 left-0 bg-[#FFFFFF]">
            {/* <div className="absolute top-[31px] left-[140px] [font-family:'Poppins',Helvetica] font-bold text-[#00688d] text-[26px] text-center tracking-[0] leading-[27.3px] whitespace-nowrap">
              Module 1:
            </div>

            <img
              className="absolute w-[75px] h-[54px] top-[18px] left-[11px]"
              alt="Home button"
              src="static\img\homebutton.svg"
            /> */}
          </div>

          <div className="absolute w-[1238px] top-[850px] left-[74px] z-10">
            <div
              ref={paperRef}
              className="p-16 bg-white rounded-lg grid grid-cols-2 gap-8"
            >
              <Paper
                elevation={6}
                sx={{
                  p: 3,
                  textAlign: "center",
                  color: "#063229",
                  borderRadius: 2,
                  fontSize: "1.1rem",
                  fontFamily: "Poppins, sans-serif",
                  transform: isVisible ? "translateX(0)" : "translateX(-100%)",
                  opacity: isVisible ? 1 : 0,
                  transition: "all 0.8s ease-out",
                  minHeight: "200px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "white",
                  zIndex: 10,
                  willChange: "transform, opacity",
                }}
              >
                <div className="text-lg">
                  Hey there! Let me tell you about a fascinating plant called
                  Tulsi. Think of it like a sacred, natural wonder that's been
                  enriching lives and promoting health for centuries!
                </div>
              </Paper>
              <Paper
                elevation={6}
                sx={{
                  p: 3,
                  textAlign: "center",
                  color: "#063229",
                  borderRadius: 2,
                  fontSize: "1.1rem",
                  fontFamily: "Poppins, sans-serif",
                  transform: isVisible ? "translateX(0)" : "translateX(100%)",
                  opacity: isVisible ? 1 : 0,
                  transition: "all 0.8s ease-out",
                  minHeight: "200px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "white",
                  zIndex: 10,
                  willChange: "transform, opacity",
                }}
              >
                <div className="text-lg">
                  The Tulsi plant, with its vibrant green leaves and aromatic
                  presence, is like a divine gift to homes and gardens. When you
                  crush its leaves, you'll experience a refreshing, spicy
                  fragrance that's both calming and invigorating.
                </div>
              </Paper>
            </div>
          </div>

          <div className="absolute w-[360px] h-[46px] top-[2042px] left-[1658px] bg-[#333333c4]" />

          <div className="absolute w-full h-[114px] top-[1437px] bg-[#006400]">
            <p className="absolute w-full top-9 left-0 [font-family:'Poppins',Helvetica] font-bold text-white text-[3.5625rem] text-center tracking-[-1.71px] leading-[2.625rem] whitespace-nowrap">
              Check Out this 3D model
            </p>
          </div>

          <div className="absolute w-[1440px] h-[114px] top-[2306px] bg-[#006400]">
            <div className="absolute w-[1439px] top-3 [font-family:'Poppins',Helvetica] font-bold text-white text-[57px] text-center tracking-[-1.71px] leading-[42px] whitespace-nowrap">
              Benefits
            </div>
            <div className="absolute w-[1439px] top-[70px] left-0 [font-family:'Poppins',Helvetica] font-normal text-white text-[20px] text-center tracking-[-0.5px] leading-[30px] whitespace-nowrap">
              (Hover to reveal)
            </div>
          </div>

          <div className="absolute w-[1440px] h-[114px] top-[3192px] bg-[#006400]">
            <p className="absolute w-[1439px] top-9 [font-family:'Poppins',Helvetica] font-bold text-white text-[49px] text-center tracking-[-1.47px] leading-10 whitespace-nowrap">
              Time for some Interactive and Immersive Experience!
            </p>
          </div>

          <section
            id="ar_vr-icon"
            className="absolute flex justify-center items-center gap-10 py-20 w-full"
            style={{ top: "3350px" }}
          >
            {/* AR Icon */}
            <div className="group relative w-[266px] h-[266px] bg-white rounded-[40px] border border-black shadow-[inset_10px_10px_4px_#00000040] transition-all duration-300 ease-in-out hover:w-[400px] flex items-center overflow-hidden">
              <img
                className="absolute w-[120px] h-[120px] top-[75px] left-[80px] transition-all duration-300 ease-in-out group-hover:translate-x-[-50px] object-cover"
                alt="Augmented Reality Icon"
                src="static\img\ar-icon.svg"
              />
              <span className="ml-[240px] text-[52px] font-bold text-gray-800 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
                AR
              </span>
            </div>

            {/* VR Icon */}
            <div className="group relative w-[266px] h-[266px] bg-white rounded-[40px] border border-black shadow-[inset_10px_10px_4px_#00000040] transition-all duration-300 ease-in-out hover:w-[400px] flex items-center overflow-hidden">
              <img
                className="absolute w-[120px] h-[120px] top-[75px] right-[70px] transition-all duration-300 ease-in-out group-hover:translate-x-[50px] object-cover"
                alt="Virtual Reality Icon"
                src="static\img\vr-icon.svg"
              />
              <span className="ml-[90px] text-[52px] font-bold text-gray-800 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
                VR
              </span>
            </div>
          </section>

          <section className="takequiz">
            <div className="absolute w-[1440px] h-[114px] top-[3996px] bg-[#006400]">
              <p className="absolute w-[1440px] top-[35px] left-0 [font-family:'Poppins',Helvetica] font-bold text-white text-[53px] text-center tracking-[-1.59px] leading-[42px] whitespace-nowrap">
                Time for a short Quiz
              </p>
            </div>

            <div className="absolute top-[4300px] left-[50%] transform -translate-x-1/2">
              <TakeQuizButton />
            </div>
            <div className="absolute top-[40px] left-[1320px]">
              <MusicControl />
            </div>
          </section>

          <p className="absolute w-[618px] top-[1619px] left-[43px] [font-family:'Poppins',Helvetica] font-bold text-[#063229] text-[30px] tracking-[0] leading-[35.3px]">
            Tulsi: Nature&#39;s Sacred Delight
          </p>

          <section
            id="3d-model"
            className="absolute w-[486px] top-[1683px] left-[71px]"
          >
            <div className="[font-family:'Poppins',Helvetica] font-normal text-[#063229] text-[22px] text-justify tracking-[0] leading-[35px]">
              {/* <span className="[font-family:'Poppins',Helvetica] font-normal text-[#025169] text-[22px] tracking-[0] leading-[35px]">
                Aloe vera is a succulent plant known for its medicinal properties.
                It is characterized by:
                <br />
                <br />
              </span> 

              <span className="font-bold">Leaves</span>*/}

              <span className="[font-family:'Poppins',Helvetica] font-normal text-[#025169] text-[18px] tracking-[0] leading-[35px]">
                Welcome to the World of Tulsi, a plant so revered it's known as
                'Nature's Sacred Delight'! Get ready to embark on an exciting
                journey where you'll explore the secrets of this ancient herb,
                its spiritual significance, and its incredible health benefits.
                🌿
                <br />
                <br />
              </span>

              {/* <span className="font-bold">Gel</span>

              <span className="[font-family:'Poppins',Helvetica] font-normal text-[#025169] text-[22px] tracking-[0] leading-[35px]">
                : The inner part of the leaf contains a clear, gel-like substance
                that is rich in nutrients and has various medicinal properties.
              </span> */}
            </div>
          </section>

          <div className="absolute w-[780px] h-[549px] top-[150px] left-[674px]">
            <div className="relative w-[766px] h-[557px]">
              {/* <div className="absolute top-[307px] left-[203px] [font-family:'Poly',Helvetica] font-normal italic text-black text-[50px] tracking-[-0.50px] leading-[normal] whitespace-nowrap">
                Aloe vera (L.) Burm.f.
              </div> */}

              {/* <img
                className="absolute w-[605px] h-[410px] top-0 left-[30px]"
                alt="Subtract"
                src="static\img\subtract.svg"
              /> */}

              {/* <img
                className="absolute w-[450px] h-[450px] top-[80px] left-0 ml-[-90px] object-cover p-0"
                alt="Fresh aloe vera"
                src="./static/img/aloeveraplant.svg"
              /> */}
            </div>
          </div>
          {/* Benefits Cards */}
          <section className="benefits">
            <div className="absolute w-[555px] h-[300px] top-[2471px] left-[200px]">
              <Cards />
            </div>

            <div className="absolute w-[521px] h-72 top-[2471px] right-[100px]">
              <Cards2 />
            </div>

            <div className="absolute w-[521px] h-72 top-[2747px] left-[520px]">
              <Cards3 />
            </div>
          </section>

          <section className="hero-text">
            <div className="absolute top-[90px] left-[150px] right-[50px] [font-family:'Bebas_Neue',Helvetica] font-light text-[#94B5A0] tracking-[10.71px] max-w-full">
              <div className="relative text-left">
                <span className="text-[#4CAF50] text-[350px]">Holy</span>
                <span className="text-[#0A342A] text-[350px]">Basil</span>
              </div>
            </div>

            <div className="absolute top-[495px] left-[1180px] [font-family:'Times_New_Roman-Italic',Helvetica] font-bold italic text-black text-[39px] text-center tracking-[2.34px] leading-[normal] whitespace-nowrap">
              Tulsi Plant
            </div>

            <div className="absolute top-[535px] left-[50px] text-left p-4 max-w-[400px]">
              <div className="[font-family:'Poppins',Helvetica] font-normal text-black text-[12px] leading-[normal] tracking-[1.0px]">
                Welcome to the world of Tulsi, a sacred herb so powerful it's
                often called the "Holy Basil"! Prepare yourself for an
                enlightening journey as we explore this ancient plant, revered
                for its spiritual significance, rich aroma, and amazing health
                benefits!
              </div>
            </div>
          </section>

          {/* <p className="absolute top-[1205px] left-[506px] [font-family:'Poppins',Helvetica] font-bold text-[#063229] text-[22px] text-center tracking-[2.20px] leading-[normal]">
            Click on the button to get Started
          </p> */}

          <p className="absolute top-[1900px] left-[52px] [font-family:'Poppins',Helvetica] font-bold text-[#025169] text-[23px] text-center tracking-[0.46px] leading-[normal]">
            Click on the different Parts to find out more
          </p>
          {/* <div className="absolute top-[1300px] left-[700px]">
            <Button />
          </div> */}
          {/* <Switch /> */}
          <Box5 />

          <div className="absolute w-full h-[869px] top-[1437px] left-0">
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

export default TulsiPlant; // Ensure default export
