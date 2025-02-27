import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import { Plants } from './components/Plants';
// import { CoursePage } from './components/CoursePage';
import { ContentCreatorDashboard } from './components/ContentCreatorDashboard';
import { LearnerDashboard } from './components/LearnerDashboard';
import { QuizPage } from './components/QuizPage';
import AloePage from './components/AloePage';
import ShoeFlower from './components/ShoeFlowerPage/ShoeFlower';
import ClusterFig from './components/ClusterFigPage/ClusterFig';
import CustardApple from './components/CustardApplePage/CustardApple';
import TulsiPlant from './components/TulsiPlantPage/TulsiPlant';
import AboutUs from './components/AboutUs';
import zaWarudo from "../static/img/skillverse.svg";
import ExploreCourse from './components/ExploreCourse';
import LoginPage2 from './components/LoginPage2';
import SignUpPage2 from './components/SignUpPage2';
import Home from './components/Home';
import NewQuizPage from './components/NewQuizPage';
import ModuleViewer from './components/ModuleViewer';
import JWTFetcher from './components/JWTfetcher';
import Toggle from './components/toggle';
import { SketchfabVR } from './components/modelvr';

function App() {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png'; // Change to 'image/svg+xml' if your image is an SVG
    link.href = zaWarudo; // Use the imported image
    document.head.appendChild(link);

    // Cleanup function to remove the favicon on unmount
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/content-creator-dashboard" element={<ContentCreatorDashboard />} />
        <Route path="/learner-dashboard" element={<LearnerDashboard userId={9} />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/plants" element={<Plants />} />
        {/* <Route path="/coursepage" element={<CoursePage />} /> */}
        <Route path="/quizpage" element={<QuizPage />} />
      
        <Route path="/custard-apple" element={<CustardApple />} />
        <Route path="/shoe-flower" element={<ShoeFlower />} />
        <Route path="/cluster-fig" element={<ClusterFig />} />
        <Route path="/tulsi-plant" element={<TulsiPlant />} />
        <Route path="/aboutus" element={<AboutUs/>}/>
        <Route path="/plants/:courseId" element={<Plants />} />
        <Route path="/explore" element={<ExploreCourse/>}/>
      
        <Route path="/login2" element={<LoginPage2 />} /> {/* **New route for LoginPage2** */}
        <Route path="/sign-up" element={<SignUpPage2 />} /> {/* Sign Up page */}
        <Route path="/home" element={<Home />} />
  
        <Route path="/plants/:courseId" element={<Plants />} />
        <Route path="/aloepage/:moduleId" element={<AloePage />} />

        <Route path="/quiz/:moduleId" element={<NewQuizPage />} />
     
        
        <Route path="/modules/:moduleId" element={<ModuleViewer />} />


        
        <Route path="JWTfethcer" element={<JWTFetcher/>}/>
        <Route path="Toggle" element={<Toggle/>}/>
        <Route path="/module-viewer" element={<ModuleViewer />} />
        <Route path="/modelvr" element={<SketchfabVR />} />

      </Routes>
    </div>
  );
}

export default App;
