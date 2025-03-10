import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import Loader from "./Loader";
import NavButton from "./NavButton";
import Button from "./Button";
import Confetti from "react-confetti";
import PopupModal from "./PopupModal"; // Import the PopupModal component

const GlobalStyle = styled.div`
  font-family: 'Poppins', sans-serif;
`;

const NewQuizPage = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [passingScore, setPassingScore] = useState(0.6); // 60%
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [nextModuleId, setNextModuleId] = useState(null);
  const [courseId, setCourseId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [feedbackFormVisible, setFeedbackFormVisible] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility

  const userId = 1; // Replace with actual user ID from authentication

  useEffect(() => {
    const fetchQuizQuestions = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3000/api/modules/${moduleId}/quiz`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setQuizQuestions(data);

        const courseResponse = await fetch(
          `http://localhost:3000/api/modules/${moduleId}`
        );
        if (!courseResponse.ok) {
          throw new Error(`HTTP error! status: ${courseResponse.status}`);
        }
        const courseData = await courseResponse.json();
        setCourseId(courseData[0].course_id);
      } catch (error) {
        console.error("Error fetching quiz questions:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (moduleId) {
      fetchQuizQuestions();
    }
  }, [moduleId]);

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const handleCourses = () => {
    navigate("/");
    setTimeout(() => {
      const coursesSection = document.getElementById("courses");
      if (coursesSection) {
        coursesSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleAboutUsClick = () => {
    navigate("/aboutus");
  };

  const handleExploreCourseClick = () => {
    navigate("/explore");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleAnswerChange = (questionId, option) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: option,
    }));
  };

  // Add these missing functions
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = async () => {
    if (!courseId) {
      setError("Course ID is not available. Please try again later.");
      return;
    }

    let correctAnswersCount = 0;
    quizQuestions.forEach((question) => {
      if (userAnswers[question.id] === question.correct_answer) {
        correctAnswersCount++;
      }
    });

    const totalQuestions = quizQuestions.length;
    const scorePercentage = (correctAnswersCount / totalQuestions) * 100;
    setScore(scorePercentage);

    setQuizSubmitted(true);

    if (scorePercentage >= passingScore * 100) {
      try {
        const response = await fetch(`http://localhost:3000/api/submit-quiz`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            moduleId: moduleId,
            answers: userAnswers,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
          setNextModuleId(data.nextModuleId);
          if (data.nextModuleId === null) {
            setFeedbackFormVisible(true);
          }
        } else {
          setError("Error fetching next module ID.");
        }
      } catch (error) {
        console.error("Error submitting quiz:", error);
        setError(error.message);
      }
    }

    // Show the popup after quiz submission
    setShowPopup(true);
  };

  const handleRetake = () => {
    setUserAnswers({});
    setQuizSubmitted(false);
    setCurrentQuestionIndex(0);
    setShowPopup(false); // Hide the popup when retaking the quiz
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    if (nextModuleId) {
      navigate(`/aloepage/${nextModuleId}`);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-red-500 text-center">Error: {error}</div>;
  }

  // Current question display
  const currentQuestion = quizQuestions[currentQuestionIndex];

  return (
    <GlobalStyle>
      <PageContainer>
        {/* Desktop Navigation */}
        <BackButtonContainer>
          <Button onClick={handleBack}>Back</Button>
        </BackButtonContainer>

        <DesktopNavBarContainer>
          <NavButton
            className="transform transition-transform duration-300 hover:scale-110 text-black"
            onClick={handleCourses}
          >
            Courses
          </NavButton>
          <NavButton
            className="transform transition-transform duration-300 hover:scale-110 text-black"
            onClick={handleExploreCourseClick}
          >
            Explore
          </NavButton>
          <NavButton
            className="transform transition-transform duration-300 hover:scale-110 text-black"
            onClick={handleAboutUsClick}
          >
            About Us
          </NavButton>
        </DesktopNavBarContainer>

        {/* Mobile Menu Button */}
        <MobileMenuButton id="menu-button" onClick={toggleSidebar}>
          <MenuIcon>
            <div></div>
            <div></div>
            <div></div>
          </MenuIcon>
        </MobileMenuButton>

        {/* Mobile Sidebar */}
        <MobileSidebar id="mobile-sidebar" isOpen={isSidebarOpen}>
          <SidebarCloseButton onClick={() => setIsSidebarOpen(false)}>×</SidebarCloseButton>
          <SidebarNavButton onClick={handleCourses}>Courses</SidebarNavButton>
          <SidebarNavButton onClick={handleExploreCourseClick}>Explore</SidebarNavButton>
          <SidebarNavButton onClick={handleAboutUsClick}>About Us</SidebarNavButton>
        </MobileSidebar>

        <PageTitle>Quiz</PageTitle>

        {currentQuestion && (
          <QuizCardContainer>
            <InfoSection>
              <QuestionText>{currentQuestion.question}</QuestionText>
              <StepsIndicator>{`${currentQuestionIndex + 1}/${
                quizQuestions.length
              }`}</StepsIndicator>
            </InfoSection>

            <RadioGroup>
              {["A", "B", "C", "D"].map((option) => (
                <React.Fragment key={option}>
                  <RadioInput
                    type="radio"
                    id={`option-${currentQuestion.id}-${option}`}
                    name={`question-${currentQuestion.id}`}
                    value={option}
                    checked={userAnswers[currentQuestion.id] === option}
                    onChange={() =>
                      handleAnswerChange(currentQuestion.id, option)
                    }
                  />
                  <RadioLabel
                    htmlFor={`option-${currentQuestion.id}-${option}`}
                    selected={userAnswers[currentQuestion.id] === option}
                  >
                    {option}. {currentQuestion[`option_${option.toLowerCase()}`]}
                  </RadioLabel>
                </React.Fragment>
              ))}
            </RadioGroup>

            <NavigationButtons>
              <NavigationButton
                onClick={goToPreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className={`${
                  currentQuestionIndex === 0
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                } bg-gray-200 hover:bg-gray-300`}
              >
                Previous
              </NavigationButton>

              {currentQuestionIndex < quizQuestions.length - 1 ? (
                <NavigationButton
                  onClick={goToNextQuestion}
                  className="bg-yellow-500 text-white hover:bg-yellow-600"
                >
                  Next
                </NavigationButton>
              ) : (
                <NavigationButton
                  onClick={handleSubmit}
                  className="bg-yellow-500 text-white hover:bg-yellow-600"
                >
                  Submit
                </NavigationButton>
              )}
            </NavigationButtons>
          </QuizCardContainer>
        )}

        {/* Popup Modal */}
        {quizSubmitted && (
          <PopupModal
            isOpen={showPopup}
            onClose={handleClosePopup}
            score={score}
            passed={score >= passingScore * 100}
            onRetake={handleRetake}
          />
        )}
      </PageContainer>
    </GlobalStyle>
  );
};

// Styled Components (unchanged from your original code)
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  padding: 2rem;
  background-color: #f3f4f6;
  position: relative;

  @media (max-width: 768px) {
    padding: 1rem 0.5rem;
    justify-content: flex-start;
    padding-top: 6rem;
  }
`;

const BackButtonContainer = styled.div`
  position: absolute;
  top: 32px;
  left: 30px;
  cursor: pointer;
  z-index: 10;

  @media (max-width: 768px) {
    top: 20px;
    left: 15px;
  }
`;

const DesktopNavBarContainer = styled.div`
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 2.25rem;

  @media (max-width: 768px) {
    display: none; /* Hide on mobile */
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  position: absolute;
  top: 20px;
  right: 15px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 10;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MenuIcon = styled.div`
  width: 30px;
  height: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  div {
    width: 100%;
    height: 3px;
    background-color: #000;
    border-radius: 3px;
  }
`;

const MobileSidebar = styled.div`
  position: fixed;
  top: 0;
  right: ${(props) => (props.isOpen ? '0' : '-250px')};
  width: 250px;
  height: 100vh;
  background-color: #fff;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease;
  z-index: 100;
  display: none;
  flex-direction: column;
  padding-top: 60px;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const SidebarCloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
`;

const SidebarNavButton = styled.button`
  padding: 15px 20px;
  text-align: left;
  background: none;
  border: none;
  border-bottom: 1px solid #eee;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1rem;
  margin-top: 5rem;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-top: 2rem;
  }
`;

const QuizCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 650px;
  padding: 1.5rem;
  background: #e8e8e8;
  color: #000000;
  border-radius: 20px;
  border: 1px solid rgba(47, 44, 44, 0.24);
  box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.1), -10px -10px 20px rgba(255, 255, 255, 0.5);

  @media (max-width: 768px) {
    max-width: 95%;
    padding: 1rem;
    border-radius: 15px;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.1), -5px -5px 10px rgba(255, 255, 255, 0.5);
  }
`;

const InfoSection = styled.div`
  margin-bottom: 10px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const QuestionText = styled.span`
  color: rgb(49, 49, 49);
  font-size: 1.1rem;
  line-height: 1.4;
  font-weight: 800;
  flex: 1;
  min-width: 0;
  word-wrap: break-word;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const StepsIndicator = styled.span`
  background-color: rgb(0, 0, 0);
  padding: 4px;
  color: #ffffff;
  border-radius: 4px;
  font-size: 12px;
  line-height: 12px;
  font-weight: 600;
  white-space: nowrap;

  @media (max-width: 480px) {
    align-self: flex-end;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const RadioInput = styled.input`
  display: none;
`;

const RadioLabel = styled.label`
  display: flex;
  background-color: #ffffff;
  padding: 14px;
  margin: 8px 0 0 0;
  font-size: 14px;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  border: 1px solid rgba(47, 44, 44, 0.24);
  color: #000000;
  transition: 0.3s ease;
  word-wrap: break-word;

  &:hover {
    background-color: rgba(24, 24, 24, 0.13);
    border: 1px solid #bbbbbb;
  }

  ${(props) =>
    props.selected &&
    `
    border-color: rgb(22, 245, 22);
    color: rgb(16, 184, 16);
  `}

  @media (max-width: 768px) {
    padding: 12px;
    font-size: 13px;
  }

  @media (max-width: 480px) {
    padding: 10px;
    font-size: 12px;
  }
`;

// Created a custom NavigationButton component for styling
const NavigationButton = styled(NavButton)`
  min-width: 120px;
  padding: 8px 16px;
  
  @media (max-width: 480px) {
    min-height: 44px;
    margin-bottom: 10px;
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 3.5rem;
  gap: 1rem;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 1.75rem;

    & > button {
      width: 100%;
      margin: 0;
    }
  }
`;

export default NewQuizPage;