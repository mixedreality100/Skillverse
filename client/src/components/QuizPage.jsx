import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Add useLocation
import facebookLogo from "/src/assets/Facebook logo.png";
import instagram from "/src/assets/Instagram.png";
import logo from "/src/assets/HomeBtn.svg";

export const QuizPage = () => {
  const location = useLocation(); // Get current location
  const navigate = useNavigate();
  
  // State for 404 redirection
  const [shouldRedirect, setShouldRedirect] = useState(false);
  
  // Add state verification
  useEffect(() => {
    if (!location.state?.fromApp) {
      setShouldRedirect(true);
    }
  }, [location]);

  // Question state management remains the same
  const [selectedOptionQ1, setSelectedOptionQ1] = useState(null);
  const [selectedOptionQ2, setSelectedOptionQ2] = useState(null);
  const [selectedOptionQ3, setSelectedOptionQ3] = useState(null);
  const [selectedOptionQ4, setSelectedOptionQ4] = useState(null);
  const [selectedOptionQ5, setSelectedOptionQ5] = useState(null);

  // Add 404 redirect logic
  if (shouldRedirect) {
    return <Navigate to="/404" replace />;
  }

  // Update navigation handlers with state
  const handleHomeClick = () => {
    navigate("/"  );
  };

  const handleCoursesClick = () => {
    navigate("/plants" );
  };

  // Add protected navigation for quiz submission
  const handleSubmit = () => {
    // Your submission logic here
    navigate("/plants", { state: { fromApp: true } }); // Example post-submit navigation
  };

  // Existing UI components remain the same, update submit button:
  return (
    <div className="bg-white flex flex-row justify-center w-full">
      {/* ... existing JSX ... */}
      
      {/* Updated Submit Button */}
      <section className="absolute w-[920px] h-[89px] top-[3400px] left-[250px]">
        <button
          className="relative w-[918px] h-[89px] bg-[#ffc134] rounded-[50px] transition-transform duration-300 hover:scale-105"
          onClick={handleSubmit}
        >
          <div className="absolute w-[172px] top-[27px] left-[382px] [font-family:'Poppins-SemiBold',Helvetica] font-semibold text-black text-[23px] tracking-[0] leading-[normal]">
            Submit Button
          </div>
        </button>
      </section>
    </div>
  );
};