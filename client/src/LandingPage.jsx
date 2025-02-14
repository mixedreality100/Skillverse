import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseCard from "./components/CourseCard";
import NavButton from "./components/NavButton";
import { courses } from "./data/courseData";
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import ProfileButton from "./components/profile";
import { useClerk, useUser, SignedIn, SignedOut, SignInButton, useAuth } from '@clerk/clerk-react';
import Home from './components/Home';
import JWTFetcher from './components/JWTfetcher';

export default function LandingPage() {
  const navigate = useNavigate();
  const sectionsRef = useRef([]);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const mixerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [courses, setCourses] = useState([]);
  
  const { user } = useUser();
  const [progress, setProgress] = useState(null);
  const auth = useAuth();
  const getToken = auth?.getToken;
  const signOut = auth?.signOut;


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
        console.log("🔸 Making request to backend with Clerk ID:", user.id);

        const userData = {
            userId: user.id,
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
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ Failed to save user. Status:", response.status, "Error:", errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ Successfully saved user data:", data);
    } catch (error) {
        console.error("❌ Error saving user:", error);
        if (error instanceof TypeError && error.message.includes('fetch')) {
            console.error("💡 Backend server might not be running on port 3001!");
        }
    }
};
  

 

  const handelAboutUsClick = () => {
    navigate('/aboutus');
  };

  const handelExploreCourseClick = () => {
    navigate('/explore');
  };

  const handleContentCreater = () => {
    navigate('/content-creator-dashboard');
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
        const response = await fetch('http://localhost:3000/courses');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
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

      camera.position.set(2.80, 48.58, 11.49);
      camera.lookAt(0, 0, 0);
      clock = new THREE.Clock();

      loadModel();
    };

    const loadModel = () => {
      if (sceneRef.current.getObjectByName('astronaut')) {
        return;
      }

      const loader = new GLTFLoader();
      loader.load('/model/lotus.glb', 
        (gltf) => {
          astronaut = gltf.scene;
          astronaut.name = 'astronaut';

          const box = new THREE.Box3().setFromObject(astronaut);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());

          const scale = 9;
          astronaut.scale.setScalar(scale);

          astronaut.position.set(0, -15.0, -1);
          scene.add(astronaut);

          if (gltf.animations && gltf.animations.length) {
            mixer = new THREE.AnimationMixer(astronaut);
            mixerRef.current = mixer;
            const action = mixer.clipAction(gltf.animations[0]);

            action.setLoop(THREE.LoopOnce);
            action.clampWhenFinished = true;

            const observer = new IntersectionObserver(
              (entries) => {
                entries.forEach((entry) => {
                  if (entry.isIntersecting) {
                    action.play();
                    observer.disconnect();
                  }
                });
              },
              { threshold: 0.5 }
            );

            observer.observe(containerRef.current);
          }

          animate();
        },
        (xhr) => {
          console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        (error) => {
          console.error('An error happened while loading the model:', error);
        }
      );
    };

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      if (sceneRef.current) {
        const model = sceneRef.current.getObjectByName('astronaut');
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
      if (!container) return; // Guard against null

      const camera = cameraRef.current;
      if (!camera) return; // Guard against null

      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();

      const renderer = rendererRef.current;
      if (renderer) {
        renderer.setSize(container.clientWidth, container.clientHeight);
      }
    };

    window.addEventListener('resize', onWindowResize, false);
    init();

    return () => {
      window.removeEventListener('resize', onWindowResize);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (sceneRef.current) {
        const astronautModel = sceneRef.current.getObjectByName('astronaut');
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
    };
  }, []);

  const handleSignIn = async () => {
    if (user) {
      // If the user is already logged in, sign them out
      await clerk.signOut();
      // Redirect to the landing page after signing out
      navigate('/');
    } else {
      // If not logged in, initiate the sign-in process
      try {
        await signIn.create(); // This will open the Clerk sign-in modal
      } catch (error) {
        console.error('Sign-in error:', error);
      }
    }
  };

  return (
    <main className="flex flex-col bg-white">
      <header className="flex flex-col items-center px-5 pt-7 bg-white fade-in" ref={addToRefs}>
        <nav className="flex justify-between items-center w-full max-w-[1274px]">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/3a21b8a04dbf44e1bd87f9c99615809c/9a85d68a299dbf652639e83aca7528b4c2f03fe9195d4867a888b581656f222f?apiKey=3a21b8a04dbf44e1bd87f9c99615809c&"
            alt="Company logo"
            className="w-[47px] aspect-square"
          />

          <div className="flex gap-9">
            <NavButton 
              path="#courses" 
              className="transform transition-transform duration-300 hover:scale-110 text-black" 
              onClick={() => document.getElementById('courses').scrollIntoView({ behavior: 'smooth' })}
            >
              Courses
            </NavButton>
            <NavButton 
              className="transform transition-transform duration-300 hover:scale-110 text-black" 
              onClick={handelAboutUsClick}
            >
              About Us
            </NavButton>
            {/* <NavButton 
              className="transform transition-transform duration-300 hover:scale-110 text-black" 
              onClick={handleContentCreater}
            >
              cc
            </NavButton> */}
            <NavButton 
              className="transform transition-transform duration-300 hover:scale-110 text-black" 
              onClick={handelExploreCourseClick}
            >
              explore
            </NavButton>
          </div>

          <div className="flex items-center gap-5">
            <button className="p-2 border rounded-full">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/3a21b8a04dbf44e1bd87f9c99615809c/bfe4b520ea1da75dbddb2eb1a1a9243824537e162104b8c7014f0ec08838afd3?apiKey=3a21b8a04dbf44e1bd87f9c99615809c&"
                alt="Search"
                className="w-5"
              />
            </button>

            <SignedOut>
              <SignInButton>
                <button className="text-black transform transition-transform duration-300 hover:scale-110 rounded-full border-2 border-black px-8 py-3">
                  Login
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
            <ProfileButton onClick={() => signOut()} />
            </SignedIn>
          </div>
        </nav>

        <section className="flex flex-col items-start py-16 text-start">
          <div className="flex items-center">
            <h1 className="text-9xl font-extrabold text-black flex flex-col">
              <span className="self-end" style={{ textShadow: "7px 7px 4px rgba(0, 0, 0, 0.5)" }}>Visualize</span>
              <span className="text-yellow-500 self-end mr-[0.5em]" style={{ textShadow: "7px 7px 4px rgba(0, 0, 0, 0.5)" }}>&</span>
              <span className="self-end relative" style={{ textShadow: "7px 7px 4px rgba(0, 0, 0, 0.5)" }}>
                Learn
                <h5 className="text-gray-700 text-sm absolute left-[8em] top-full mt-1">
                  Education is the kindling of a flame, not the filling of a vessel.{" "}
                  <span className="italic">- Socrates</span>
                </h5>
              </span>
            </h1>
            <img src="src/assets/Hero.png" alt="Hero" className="ml-4 w-2/5 h-auto" />
          </div>
        </section>
      </header>

      {/* Step Into the Future Section */}
      <section className="bg-black text-white py-0 fade-in" ref={addToRefs}>
        <div className="carousel-container">
          <div className="flex flex-wrap justify-center gap-5 text-center ">
            {[".step .", ".in .", ".the .", ".future ."].map((text, index) => (
              <h2
                key={index}
                className="text-9xl font-bold lowercase tracking-normal whitespace-nowrap"
              >
                {text}
              </h2>
            ))}
          </div>
        </div>

        {/* Centered Image */}
        <div className="flex justify-center">
          <div ref={containerRef} style={{ width: '100%', height: '400px' }}></div>
        </div>

        {/* Description */}
       <p className="text-center mt-8 text-xl mx-auto text-white font-bold">
          "Experience immersive and interactive learning anytime, anywhere—on
          laptops, tablets, <br />and smartphones."
        </p> 

        {/* Info Boxes */}
        <div className="flex justify-around mt-10 text-center text-lg">
          <div className="flex-1 px-5 text-white text-center mb-5">
            Hands-on exploration with<br />engaging 3D models across<br /> diverse
            subjects.
          </div>
          <div className="flex-1 px-5 text-white text-center mb-5">
            Delivering realistic and engaging <br />learning environments that bring <br />
            education to life through interactive <br />experiences.
          </div>
          <div className="flex-1 px-5 text-white text-center">
            Creating captivating and <br />immersive educational spaces <br />that transform
            the way you <br />learn and explore.
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-16 px-5 mb-[130px] fade-in" ref={addToRefs}>
        <h2 className="text-7xl font-bold text-center mb-10 text-yellow-500 px-16 py-4 w-fit mx-auto rounded-xl" style={{ textShadow: "2px 2px 0px black, -2px -2px 0px black, 2px -2px 0px black, -2px 2px 0px black" }}>
          Courses
        </h2>
        <div className="flex flex-nowrap gap-10 justify-center">
          {courses.map((course, index) => (
            <CourseCard
              key={course.id}
              title={course.course_name}
              status={course.level}
              image={course.course_image}
              courseId={course.id} // Pass courseId to CourseCard
              iconSrc={course.iconSrc}
              showOverlay={index === 0 || index === 1 || index === 2}
              className="w-1/4 transition-transform transform hover:scale-105 fade-in"
              ref={addToRefs}
             
            />
          ))}
        </div>
      </section>
      {/* className="w-1/4 transition-transform transform hover:scale-105 fade-in" ref={addToRefs} */}
      {/* About Us Section */}
      <footer id="footer" className={`absolute top-[2270px] left-[10px] w-full h-[440px] fade-in ${isVisible ? 'visible' : ''}`}>
        <div className="relative w-[1450px] h-[440px] bg-[url('https://cdn.animaapp.com/projects/66fe7ba2df054d0dfb35274e/releases/676d6d16be8aa405f53530bc/img/hd-wallpaper-anatomy-human-anatomy-1.png')] bg-cover">
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
          <Home/>
          

        </div>
        
      </footer>
      
      
    </main>
  );
}








