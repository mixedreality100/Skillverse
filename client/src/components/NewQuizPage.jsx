import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Loader from './Loader';
import NavButton from './NavButton';
import skillverseLogo from '../assets/skillverse.svg';
import { useNavigate } from "react-router-dom";

const NewQuizPage = () => {
  const { moduleId } = useParams();
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [passingScore, setPassingScore] = useState(0.6); // 60%

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

  const handleback = () => {
    window.history.back();
  };

  const handleCourses = () => {
    useNavigate('/');
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

  if (quizSubmitted) {
    return (     
      <div className="bg-gray-100 flex flex-col justify-center items-center w-full min-h-screen p-8">
        <img 
          className="absolute top-[22px] left-[30px] w-[60px] h-[60px]"
          src={skillverseLogo} 
          alt="logo" 
          onClick={handleback}
        />

        <div className='absolute top-[30px] left-1/2 transform -translate-x-1/2 flex gap-9'>
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
        </div>
        <h1 className="text-2xl font-bold mb-4 mt-20">Quiz Results</h1>
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl neomorphic">
          {quizQuestions.map((question) => (
            <div key={question.id} className="mb-4 p-4 bg-gray-50 rounded-lg shadow-md">
              <p className="text-lg font-bold">{question.question}</p>
              <div className="mt-2">
                {['A', 'B', 'C', 'D'].map((option) => (
                  <div key={option} className="flex items-center">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option}
                      disabled
                      checked={userAnswers[question.id] === option}
                      className="mr-2"
                    />
                    <span
                      className={
                        userAnswers[question.id] === option
                          ? userAnswers[question.id] === question.correct_answer
                            ? 'text-green-500'
                            : 'text-red-500'
                          : ''
                      }
                    >
                      {option}. {question[`option_${option.toLowerCase()}`]}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-2">
                <span className="font-bold">Correct Answer:</span> {question.correct_answer}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <p className="text-xl font-bold">Your Score: {score.toFixed(2)}%</p>
          <p className={score >= passingScore * 100 ? 'text-green-500' : 'text-red-500'}>
            {score >= passingScore * 100 ? 'You passed!' : 'You did not pass.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 flex flex-col justify-center items-center w-full min-h-screen p-8">
      
      <img 
        className="absolute top-[22px] left-[30px] w-[60px] h-[60px]"
        src={skillverseLogo} 
        alt="logo" 
        onClick={handleback}
      />

      <div className='absolute top-[30px] left-1/2 transform -translate-x-1/2 flex gap-9'>
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
      </div>

      <h1 className="text-2xl font-bold mb-4 mt-20">Quiz</h1>
      <form onSubmit={(e) => e.preventDefault()} className="w-full max-w-2xl">
        <div className="bg-white p-6 rounded-lg shadow-lg neomorphic">
          {quizQuestions.map((question) => (
            <div key={question.id} className="mb-4 p-4 bg-gray-50 rounded-lg shadow-md">
              <p className="text-lg font-bold">{question.question}</p>
              <div className="mt-2">
                {['A', 'B', 'C', 'D'].map((option) => (
                  <div key={option} className="flex items-center">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option}
                      onChange={() => handleAnswerChange(question.id, option)}
                      checked={userAnswers[question.id] === option}
                      className="mr-2"
                    />
                    <span>{option}. {question[`option_${option.toLowerCase()}`]}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="px-6 py-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-300"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewQuizPage;