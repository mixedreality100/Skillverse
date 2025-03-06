import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Loader from './Loader';
import NavButton from './NavButton';
import skillverseLogo from '../assets/skillverse.svg';

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

  useEffect(() => {
    const fetchQuizQuestions = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/api/modules/${moduleId}/quiz`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched quiz questions:', data);
        setQuizQuestions(data);
      } catch (error) {
        console.error('Error fetching quiz questions:', error);
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
    window.history.back();
  };

  const handleCourses = () => {
    navigate('/');
    setTimeout(() => {
      const coursesSection = document.getElementById('courses');
      if (coursesSection) {
        coursesSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-red-500 text-center">Error: {error}</div>;
  }

  const handleAnswerChange = (questionId, option) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: option,
    }));
  };

  const handleSubmit = () => {
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
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };
  const handelAboutUsClick = () => {
    navigate("/aboutus");
  };
  
  const handelExploreCourseClick = () => {
    navigate("/explore");
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (quizSubmitted) {
    return (     
      <PageContainer>
        <Logo 
          src={skillverseLogo} 
          alt="logo" 
          onClick={handleBack}
        />

        <NavBarContainer>
          <NavButton 
            className="transform transition-transform duration-300 hover:scale-110 text-black" 
            onClick={handleCourses}
          >
            Courses
          </NavButton>
          <NavButton
            className="transform transition-transform duration-300 hover:scale-110 text-black"
            onClick={() => navigate("/explore")}
          >
            Explore
          </NavButton>
          <NavButton
            className="transform transition-transform duration-300 hover:scale-110 text-black"
            onClick={() => navigate("/aboutus")}
          >
            About Us
          </NavButton>
        </NavBarContainer>
        
        <PageTitle>Quiz Results</PageTitle>
        
        <ResultsContainer>
          {quizQuestions.map((question) => (
            <ResultCard key={question.id}>
              <QuestionText>{question.question}</QuestionText>
              <OptionsContainer>
                {['A', 'B', 'C', 'D'].map((option) => {
                  const isSelected = userAnswers[question.id] === option;
                  const isCorrect = option === question.correct_answer;
                  return (
                    <OptionLabel 
                      key={option}
                      selected={isSelected}
                      correct={isCorrect}
                      incorrect={isSelected && !isCorrect}
                    >
                      {option}. {question[`option_${option.toLowerCase()}`]}
                    </OptionLabel>
                  );
                })}
              </OptionsContainer>
              <CorrectAnswer>
                <span>Correct Answer:</span> {question.correct_answer}
              </CorrectAnswer>
            </ResultCard>
          ))}
        </ResultsContainer>
        
        <ScoreContainer>
          <ScoreText>Your Score: {score.toFixed(2)}%</ScoreText>
          <ScoreResult passed={score >= passingScore * 100}>
            {score >= passingScore * 100 ? 'You passed!' : 'You did not pass.'}
          </ScoreResult>
        </ScoreContainer>
      </PageContainer>
    );
  }

  // Current question display
  const currentQuestion = quizQuestions[currentQuestionIndex];
  
  return (
    <PageContainer>
      <Logo 
        src={skillverseLogo} 
        alt="logo" 
        onClick={handleBack}
      />

      <NavBarContainer>
        <NavButton 
          className="transform transition-transform duration-300 hover:scale-110 text-black" 
          onClick={handleCourses}
        >
          Courses
        </NavButton>
        <NavButton
          className="transform transition-transform duration-300 hover:scale-110 text-black"
        >
          Explore
        </NavButton>
        <NavButton
          className="transform transition-transform duration-300 hover:scale-110 text-black"
        >
          About Us
        </NavButton>
      </NavBarContainer>

      <PageTitle>Quiz</PageTitle>
      
      {currentQuestion && (
        <QuizCardContainer>
          <InfoSection>
            <QuestionText>{currentQuestion.question}</QuestionText>
            <StepsIndicator>{`${currentQuestionIndex + 1}/${quizQuestions.length}`}</StepsIndicator>
          </InfoSection>
          
          <RadioGroup>
            {['A', 'B', 'C', 'D'].map((option) => (
              <React.Fragment key={option}>
                <RadioInput
                  type="radio"
                  id={`option-${currentQuestion.id}-${option}`}
                  name={`question-${currentQuestion.id}`}
                  value={option}
                  checked={userAnswers[currentQuestion.id] === option}
                  onChange={() => handleAnswerChange(currentQuestion.id, option)}
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
            <NavButton 
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className={`${currentQuestionIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''} bg-gray-200 hover:bg-gray-300`}
            >
              Previous
            </NavButton>
            
            {currentQuestionIndex < quizQuestions.length - 1 ? (
              <NavButton 
                onClick={goToNextQuestion}
                className="bg-yellow-500 text-white hover:bg-yellow-600"
              >
                Next
              </NavButton>
            ) : (
              <NavButton 
                onClick={handleSubmit}
                className="bg-yellow-500 text-white hover:bg-yellow-600"
              >
                Submit
              </NavButton>
            )}
          </NavigationButtons>
        </QuizCardContainer>
      )}
    </PageContainer>
  );
};

// Styled Components
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  padding: 2rem;
  background-color: #f3f4f6;
`;

const Logo = styled.img`
  position: absolute;
  top: 22px;
  left: 30px;
  width: 60px;
  height: 60px;
  cursor: pointer;
`;

const NavBarContainer = styled.div`
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 2.25rem;
`;

const PageTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  margin-top: 5rem;
`;

const QuizCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 320px;
  padding: 0.75rem;
  background: #ffffff;
  color: #000000;
  border-radius: 10px;
  box-shadow: 0px 87px 78px -39px rgba(0,0,0,0.4);
`;

const InfoSection = styled.div`
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const QuestionText = styled.span`
  color: rgb(49, 49, 49);
  font-size: 1rem;
  line-height: 1rem;
  font-weight: 800;
`;

const StepsIndicator = styled.span`
  background-color: rgb(0, 0, 0);
  padding: 4px;
  color: #ffffff;
  border-radius: 4px;
  font-size: 12px;
  line-height: 12px;
  font-weight: 600;
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
  font-size: 13px;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  border: 1px solid rgba(187, 187, 187, 0.164);
  color: #000000;
  transition: 0.3s ease;

  &:hover {
    background-color: rgba(24, 24, 24, 0.13);
    border: 1px solid #bbbbbb;
  }

  ${props => props.selected && `
    border-color: rgb(22, 245, 22);
    color: rgb(16, 184, 16);
  `}
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
`;

// Results page styled components
const ResultsContainer = styled.div`
  width: 100%;
  max-width: 320px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 87px 78px -39px rgba(0,0,0,0.4);
  padding: 1rem;
`;

const ResultCard = styled.div`
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12);
`;

const OptionsContainer = styled.div`
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const OptionLabel = styled.div`
  display: flex;
  background-color: #ffffff;
  padding: 14px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 10px;
  border: 1px solid rgba(187, 187, 187, 0.164);
  color: #000000;

  ${props => props.correct && `
    border-color: rgb(22, 245, 22);
    color: rgb(16, 184, 16);
  `}

  ${props => props.incorrect && `
    border-color: red;
    color: red;
  `}
`;

const CorrectAnswer = styled.div`
  margin-top: 0.5rem;
  font-weight: 600;
  font-size: 13px;

  span {
    font-weight: 800;
  }
`;

const ScoreContainer = styled.div`
  margin-top: 1rem;
  text-align: center;
`;

const ScoreText = styled.p`
  font-size: 1.25rem;
  font-weight: 700;
`;

const ScoreResult = styled.p`
  color: ${props => props.passed ? 'rgb(16, 184, 16)' : 'red'};
  font-weight: 600;
`;

export default NewQuizPage;