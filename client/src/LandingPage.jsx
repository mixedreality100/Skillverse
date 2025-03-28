import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseCard from "./components/CourseCard";
import NavButton from "./components/NavButton";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import ProfileButton from "./components/profile";
import {
  useClerk,
  useUser,
  SignedIn,
  SignedOut,
  SignInButton,
  useAuth,
} from "@clerk/clerk-react";
import { motion, useAnimation } from "framer-motion";
import Bot from "./components/bot";
// Import social media logos from src/assets
import instagramLogo from "./assets/instagram.png";
import twitterLogo from "./assets/twitter.png";
import facebookLogo from "./assets/facebook.png";
import pinterestLogo from "./assets/pinterest.png";

export default function LandingPage() {
  const navigate = useNavigate();
  const sectionsRef = useRef([]);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const mixerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const cameraRef = useRef(null);
  const [courses, setCourses] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);
  const textAnimationControls = useAnimation();

  const { user } = useUser();
  const [progress, setProgress] = useState(null);
  const auth = useAuth();
  const getToken = auth?.getToken;
  const signOut = auth?.signOut;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarLinkClick = () => {
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    if (user) {
      console.log("🔹 useEffect triggered, user:", user);
      saveUser();
    }
  }, [user]);

  const saveUser = async () => {
    try {
      if (!user || !getToken) {
        console.error("❌ No user or getToken is undefined");
        return;
      }

      console.log("🔸 Clerk User ID:", user.id);
      const token = await getToken();
      console.log("🔸 Token retrieved, length:", token?.length);

      const userData = {
        email: user.primaryEmailAddress?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
      };

      console.log("🔸 User data being sent:", userData);

      const response = await fetch("http://localhost:3001/api/saveUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("❌ Failed to save user. Status:", response.status);
        console.error("❌ Error details:", errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Successfully saved user data:", data);
    } catch (error) {
      console.error("❌ Error saving user:", error);
      if (error instanceof TypeError && error.message.includes("fetch")) {
        console.error("💡 Backend server might not be running on port 3001!");
      }
    }
  };

  const handelAboutUsClick = () => {
    navigate("/aboutus");
  };

  const handelExploreCourseClick = () => {
    navigate("/explore");
  };

  const handleLeaderboardClick = () => {
    navigate("/leaderboard");
  };

  const addToRefs = (el) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    });

    sectionsRef.current.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sectionsRef.current.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:3000/approved/courses");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    let scene, camera, renderer, astronaut, mixer, clock;

    const init = () => {
      scene = new THREE.Scene();
      sceneRef.current = scene;

      const container = containerRef.current;
      const aspect = container.clientWidth / container.clientHeight;
      camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 1000);
      cameraRef.current = camera;

      renderer = new THREE.WebGLRenderer({ antialias: true });
      rendererRef.current = renderer;
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);

      camera.position.set(2.8, 48.58, 11.49);
      camera.lookAt(0, 0, 0);
      clock = new THREE.Clock();

      loadModel();
    };

    const loadModel = () => {
      if (sceneRef.current.getObjectByName("astronaut")) {
        return;
      }

      const loader = new GLTFLoader();
      loader.load(
        "/model/lotus.glb",
        (gltf) => {
          astronaut = gltf.scene;
          astronaut.name = "astronaut";

          const box = new THREE.Box3().setFromObject(astronaut);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());

          const scale = 9;
          astronaut.scale.setScalar(scale);

          astronaut.position.set(0, -10.0, -1);
          scene.add(astronaut);

          if (gltf.animations && gltf.animations.length) {
            mixer = new THREE.AnimationMixer(astronaut);
            mixerRef.current = mixer;
            const action = mixer.clipAction(gltf.animations[0]);

            action.setLoop(THREE.LoopOnce);
            action.clampWhenFinished = true;
            action.play();
            setAnimationStarted(true);
          }

          animate();
        },
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        (error) => {
          console.error("An error happened while loading the model:", error);
        }
      );
    };

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      if (sceneRef.current) {
        const model = sceneRef.current.getObjectByName("astronaut");
        if (model) {
          model.rotation.y += 0.005;
        }
      }

      if (mixerRef.current) {
        const delta = clock.getDelta();
        mixerRef.current.update(delta);
      }

      if (rendererRef.current && sceneRef.current) {
        rendererRef.current.render(sceneRef.current, camera);
      }
    };

    const onWindowResize = () => {
      const container = containerRef.current;
      if (!container) return;

      const camera = cameraRef.current;
      if (!camera) return;

      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();

      const renderer = rendererRef.current;
      if (renderer) {
        renderer.setSize(container.clientWidth, container.clientHeight);
      }
    };

    window.addEventListener("resize", onWindowResize, false);
    init();

    return () => {
      window.removeEventListener("resize", onWindowResize);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (sceneRef.current) {
        const astronautModel = sceneRef.current.getObjectByName("astronaut");
        if (astronautModel) {
          sceneRef.current.remove(astronautModel);
        }
      }

      if (rendererRef.current) {
        rendererRef.current.dispose();
        const container = containerRef.current;
        if (container && rendererRef.current.domElement) {
          container.removeChild(rendererRef.current.domElement);
        }
      }

      sceneRef.current = null;
      rendererRef.current = null;
      mixerRef.current = null;
      animationFrameRef.current = null;
      cameraRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (animationStarted) {
      textAnimationControls.start({ marginLeft: 0 });
    }
  }, [animationStarted, textAnimationControls]);

  return (
    <main className="flex flex-col bg-white">
      <header
        className="flex flex-col items-center px-5 pt-7 bg-white fade-in"
        ref={addToRefs}
      >
        <nav className="flex flex-col md:flex-row justify-between items-center w-full max-w-[1274px] relative">
          <div className="flex w-full md:w-auto justify-between items-center">
            <img
              src="./src/assets/skillverse.svg"
              alt="Company logo"
              className="w-[58px] aspect-square"
            />
            <div className="flex items-center gap-4 md:hidden">
              <div className="flex-grow flex justify-center">
                <button
                  onClick={toggleSidebar}
                  className="p-2 text-black focus:outline-none"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {isSidebarOpen ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    )}
                  </svg>
                </button>
              </div>
              <div className="block md:hidden">
                <SignedOut>
                  <SignInButton>
                    <button
                      className="text-black transform transition-transform duration-300 hover:scale-110 rounded-full px-8 py-3"
                      style={{
                        boxShadow:
                          "5px 5px 10px #d1d1d1, -5px -5px 10px #ffffff",
                        border: "0.5px solid rgba(0, 0, 0, 0.33)",
                      }}
                    >
                      Login
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <ProfileButton onClick={() => signOut()} />
                </SignedIn>
              </div>
            </div>
          </div>

          <div className="hidden md:flex gap-9">
            <NavButton
              path="#courses"
              className="transform transition-transform duration-300 hover:scale-110 text-black"
              onClick={() =>
                document
                  .getElementById("courses")
                  .scrollIntoView({ behavior: "smooth" })
              }
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
            <NavButton
              className="transform transition-transform duration-300 hover:scale-110 text-black"
              onClick={handleLeaderboardClick}
            >
              Leaderboard
            </NavButton>
          </div>

          <div className="hidden md:flex items-center gap-5">
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
              <ProfileButton onClick={() => signOut()} />
            </SignedIn>
          </div>
        </nav>

        <section className="flex flex-col items-start pt-8 md:py-16 text-start relative"> {/* Changed py-16 to pt-8 for mobile */}
  <style>
    {`
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700;900&display=swap');
      
      .poppins-font {
        font-family: 'Poppins', sans-serif;
        text-shadow: 7px 7px 4px rgba(0, 0, 0, 0.5);
      }
    `}
  </style>
  <div className="flex flex-col md:flex-row items-center justify-between w-full px-4 md:px-0">
    {/* Text container with adjusted margin-top for mobile */}
    <div className="flex flex-col w-full md:w-auto z-10 mt-[-20px] md:mt-0"> {/* Added mt-[-20px] for mobile */}
      <h1 className="text-5xl md:text-9xl font-bold text-black flex flex-col">
        <motion.span
          className="self-start md:self-end poppins-font"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Visualize
        </motion.span>
        <motion.span
          className="text-yellow-500 self-start md:self-end md:mr-[0.5em] poppins-font"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          &
        </motion.span>
        <motion.span
          className="self-start md:self-end relative poppins-font"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          Learn
          <motion.h5
            className="text-gray-700 text-xs md:text-sm relative md:absolute md:left-[7em] md:top-full md:mt-3 mt-2 max-w-[250px] md:max-w-none"
            style={{ textShadow: "none" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            Education is the kindling of a flame, not the filling of a vessel. <span className="italic">- Socrates</span>
          </motion.h5>
        </motion.span>
      </h1>
    </div>
    
    {/* Hero image - adjusted order for mobile */}
    <img
  src="src/assets/Hero.png"
  alt="Hero"
  className="w-[250px] md:w-2/5 h-auto object-contain transform scale-120 md:scale-100 mb-[50px] z-0"
/>
  </div>
</section>
      </header>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="p-4">
          <button
            onClick={toggleSidebar}
            className="p-2 text-black focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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
        <nav className="flex flex-col space-y-4 p-4">
          <NavButton
            path="#courses"
            className="transform transition-transform duration-300 hover:scale-110 text-black"
            onClick={() => {
              document
                .getElementById("courses")
                .scrollIntoView({ behavior: "smooth" });
              handleSidebarLinkClick();
            }}
          >
            Courses
          </NavButton>
          <NavButton
            className="transform transition-transform duration-300 hover:scale-110 text-black"
            onClick={() => {
              handelExploreCourseClick();
              handleSidebarLinkClick();
            }}
          >
            Explore
          </NavButton>
          <NavButton
            className="transform transition-transform duration-300 hover:scale-110 text-black"
            onClick={() => {
              handelAboutUsClick();
              handleSidebarLinkClick();
            }}
          >
            About Us
          </NavButton>
          <NavButton
            className="transform transition-transform duration-300 hover:scale-110 text-black"
            onClick={() => {
              handleLeaderboardClick();
              handleSidebarLinkClick();
            }}
          >
            Leaderboard
          </NavButton>
        </nav>
      </div>

      {/* Step Into the Future Section */}
      <section
        className="bg-black text-white py-0 fade-in"
        ref={addToRefs}
        style={{ marginTop: "-35px" }}
      >
        <div className="carousel-container">
          <div
            className="flex flex-wrap justify-center gap-5 text-center "
            style={{ marginTop: "0px" }}
          >
            {[".step .", ".in .", ".the .", ".future ."].map(
              (text, index, arr) => (
                <motion.h2
                  key={index}
                  className="text-4xl md:text-9xl font-bold lowercase tracking-normal whitespace-nowrap"
                  initial={{ marginLeft: -50 * (arr.length - index) }}
                  animate={textAnimationControls}
                  transition={{
                    delay: 0.2 * index,
                    type: "spring",
                    stiffness: 120,
                  }}
                >
                  {text}
                </motion.h2>
              )
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <div
            ref={containerRef}
            style={{
              width: "100%",
              height: "50vh",
              maxHeight: "400px",
              transform: "translateY(-50vh)",
            }}
          ></div>
        </div>

        <p className="text-center mt-8 text-xl mx-auto text-white font-bold">
          "Experience immersive and interactive learning anytime, anywhere—on
          laptops, tablets, <br />
          and smartphones."
        </p>

        <div className="flex flex-col md:flex-row justify-around mt-10 text-center text-lg">
          <div
            className="flex-1 px-5 text-white text-center mb-5"
            style={{ fontFamily: "'Paytone One', sans-serif" }}
          >
            Hands-on exploration with
            <br />
            engaging 3D models across
            <br /> diverse subjects.
          </div>
          <div
            className="flex-1 px-5 text-white text-center mb-5"
            style={{ fontFamily: "'Paytone One', sans-serif" }}
          >
            Delivering realistic and engaging <br />
            learning environments that bring <br />
            education to life through interactive <br />
            experiences.
          </div>
          <div
            className="flex-1 px-5 text-white text-center"
            style={{ fontFamily: "'Paytone One', sans-serif" }}
          >
            Creating captivating and <br />
            immersive educational spaces <br />
            that transform the way you <br />
            learn and explore.
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section
        id="courses"
        className="py-16 px-5 mb-[130px] fade-in"
        ref={addToRefs}
      >
        <h2
          className="text-4xl md:text-7xl font-bold text-center mb-10 text-yellow-500 px-16 py-4 w-fit mx-auto rounded-xl"
          style={{
            textShadow:
              "1px 1px 0px black, -1px -1px 0px black, 1px -1px 0px black, -1px 1px 0px black",
            fontFamily: "'Paytone One', sans-serif",
          }}
        >
          Courses
        </h2>

        <div className="flex flex-col md:flex-row flex-wrap gap-10 justify-center">
          {courses.map((course, index) => (
            <CourseCard
              key={course.id}
              title={course.course_name}
              status={course.level}
              image={course.course_image}
              courseId={course.id}
              iconSrc={course.iconSrc}
              showOverlay={index === 0 || index === 1 || index === 2}
              className="w-full md:w-1/4 transition-transform transform hover:scale-105 fade-in cursor-pointer"
              ref={addToRefs}
            />
          ))}
        </div>
      </section>

      {/* Footer Section with Logo Images */}
      <footer
        id="footer"
        className={`relative mt-[220px] mx-auto w-[98%] fade-in ${
          isVisible ? "visible" : ""
        }`}
      >
        <div className="relative w-full h-[440px] bg-[url('https://cdn.animaapp.com/projects/66fe7ba2df054d0dfb35274e/releases/676d6d16be8aa405f53530bc/img/hd-wallpaper-anatomy-human-anatomy-1.png')] bg-cover bg-center">
          <div className="absolute top-[252px] left-[23px] right-[23px] h-[178px] bg-white rounded-[12px] shadow-lg">
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <button
                className="w-40 sm:w-48 h-11 bg-white border-2 border-gray-300 rounded-full text-gray-800 font-semibold hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-yellow-500 hover:text-white hover:scale-105 transition duration-300 flex items-center justify-center"
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
                className="w-40 sm:w-48 h-11 bg-white border-2 border-gray-300 rounded-full text-gray-800 font-semibold hover:bg-black hover:text-white hover:scale-105 transition duration-300 flex items-center justify-center"
                onClick={() =>
                  (window.location.href = "https://www.twitter.com")
                }
              >
                <img src={twitterLogo} alt="Twitter Logo" className="w-6 h-6" />
              </button>
              <button
                className="w-40 sm:w-48 h-11 bg-white border-2 border-gray-300 rounded-full text-gray-800 font-semibold hover:bg-blue-600 hover:text-white hover:scale-105 transition duration-300 flex items-center justify-center"
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
                className="w-40 sm:w-48 h-11 bg-white border-2 border-gray-300 rounded-full text-gray-800 font-semibold hover:bg-red-100 hover:text-white hover:scale-105 transition duration-300 flex items-center justify-center"
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
            <div className="mt-4 border-t border-gray-200"></div>
            <div className="text-center mt-2">
              <p className="text-base sm:text-lg text-gray-700 font-medium">
                © 2025, All Rights Reserved
              </p>
            </div>
          </div>
          <p className="absolute top-[40px] left-0 right-0 text-3xl sm:text-4xl md:text-5xl lg:text-[64px] font-semibold text-center text-white drop-shadow-lg">
            Be the one with
            <span className="text-red-500"> Nat</span>
            <span className="text-[#B9DE00]">ur</span>
            <span className="text-red-500">e</span>
          </p>
        </div>
      </footer>

      {/* Add the Bot component here */}
      <div className="fixed bottom-4 right-4 z-50">
        <Bot />
      </div>
    </main>
  );
}
