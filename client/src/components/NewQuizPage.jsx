import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Loader from './Loader';

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

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error}</div>;
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
      <div className="bg-[#FFFFFF] flex justify-center items-center w-full min-h-screen">
        <div className="max-w-[1440px] w-full p-8">
          <h1 className="text-2xl font-bold mb-4">Quiz Results</h1>
          <div>
            {quizQuestions.map((question) => (
              <div key={question.id} className="mb-4">
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
      </div>
    );
  }

  return (
    <div className="bg-[#FFFFFF] flex justify-center items-center w-full min-h-screen">
      <div className="max-w-[1440px] w-full p-8">
        <h1 className="text-2xl font-bold mb-4">Quiz</h1>
        <form onSubmit={(e) => e.preventDefault()}>
          {quizQuestions.map((question) => (
            <div key={question.id} className="mb-4">
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
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewQuizPage;