import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./LandingPage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import { Plants } from "./components/Plants";
import { ContentCreatorDashboard } from "./components/ContentCreatorDashboard";
import { LearnerDashboard } from "./components/LearnerDashboard";
import { QuizPage } from "./components/QuizPage";
import AloePage from "./components/AloePage";
import ShoeFlower from "./components/ShoeFlowerPage/ShoeFlower";
import ClusterFig from "./components/ClusterFigPage/ClusterFig";
import CustardApple from "./components/CustardApplePage/CustardApple";
import TulsiPlant from "./components/TulsiPlantPage/TulsiPlant";
import AboutUs from "./components/AboutUs";
import zaWarudo from "../static/img/skillverse.svg";
import ExploreCourse from "./components/ExploreCourse";
import LoginPage2 from "./components/LoginPage2";
import SignUpPage2 from "./components/SignUpPage2";
import Home from "./components/Home";
import NewQuizPage from "./components/NewQuizPage";
import ModuleViewer from "./components/ModuleViewer";
import JWTFetcher from "./components/JWTfetcher";
import Toggle from "./components/toggle";
import { SketchfabVR } from "./components/modelvr";
import CourseOverview from "../src/components/CourseOverview";
import { Leaderboard } from "./components/Leaderboard";
import ProtectedRoute from "./components/Protectedroute";
import NotFound from './components/NotFound';
import EditCourse from "./components/EditCourse";
import AdminLogin from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard'; // Import the AdminDashboard component
import Bot from "./components/bot";
import ChatPage from "./components/ChatPage"

function App() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/png"; // Change to 'image/svg+xml' if your image is an SVG
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
        <Route path="/learner-dashboard" element={<LearnerDashboard userId={1} />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/plants" element={<Plants />} />
        <Route path="/quizpage" element={<QuizPage />} />
        <Route path="/custard-apple" element={<CustardApple />} />
        <Route path="/shoe-flower" element={<ShoeFlower />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/cluster-fig" element={<ClusterFig />} />
        <Route path="/tulsi-plant" element={<TulsiPlant />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/explore" element={<ExploreCourse />} />
        <Route path="/login2" element={<LoginPage2 />} />
        <Route path="/sign-up" element={<SignUpPage2 />} />
        <Route path="/home" element={<Home />} />
        <Route path="/plants/:courseId" element={<ProtectedRoute><Plants /></ProtectedRoute>} />
        <Route path="/aloepage/:moduleId" element={<ProtectedRoute><AloePage /></ProtectedRoute>} />
        <Route path="/quiz/:moduleId" element={<ProtectedRoute><NewQuizPage /></ProtectedRoute>} />
        <Route path="/modules/:moduleId" element={<ProtectedRoute><ModuleViewer /></ProtectedRoute>} />
        <Route path="JWTfethcer" element={<JWTFetcher />} />
        <Route path="Toggle" element={<Toggle />} />
        <Route path="/module-viewer/:moduleId" element={<ModuleViewer />} />
        <Route path="/modelvr/:moduleId" element={<SketchfabVR />} />
        <Route path="/course/:courseId" element={<CourseOverview />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/edit-course/:courseId" element={<EditCourse />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} /> 
        <Route path="/bot" element={<Bot />} />
      </Routes>
    </div>
  );
}

export default App;