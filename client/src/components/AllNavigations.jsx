import React from 'react';
import { useNavigate } from 'react-router-dom';

const ButtonSet = ({ onButtonClick }) => {
  const navigate = useNavigate();

  const buttons = [
    {
      id: 1,
      text: 'LandingPage',
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      id: 2,
      text: 'Plants Page',
      color: 'bg-yellow-500 hover:bg-yellow-600',
    },
    {
      id: 3,
      text: 'Login Page',
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      id: 4,
      text: 'SignUp Page',
      color: 'bg-red-500 hover:bg-red-600',
    },
    {
      id: 5,
      text: 'Course Page',
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      id: 6,
      text: 'LDashboard',
      color: 'bg-pink-500 hover:bg-pink-600',
    },
    {
      id: 7,
      text: 'CCDashboard',
      color: 'bg-indigo-500 hover:bg-indigo-600',
    },
    {
      id: 8,
      text: 'QuizPage',
      color: 'bg-purple-500 hover:bg-purple-600',
    },
  ];

  const handleClick = (buttonId) => {
    switch (buttonId) {
      case 1:
        navigate('/'); // LandingPage
        break;
      case 2:
        navigate('/plants'); // Plants Page
        break;
      case 3:
        navigate('/login'); // Login Page
        break;
      case 4:
        navigate('/signup'); // SignUp Page
        break;
      case 5:
        navigate('/coursepage'); // Course Page
        break;
        case 6:
          navigate('/learner-dashboard'); //learner dashboard
        break;
      case 7:
        navigate('/content-creator-dashboard'); // Content Creator Dashboard
        break;
        case 8:
        navigate('/quizpage'); // Content Creator Dashboard
        break;
      default:
        // Handle other button clicks if needed
        onButtonClick(buttonId);
    }
  };

  return (
    <div className="flex overflow-x-auto whitespace-nowrap p-4 gap-4">
      {buttons.map((button) => (
        <button
          key={button.id}
          className={`
            ${button.color}
            text-white 
            px-6 
            py-2 
            rounded-full
            transform
            transition-all
            duration-200
            hover:scale-105
            hover:shadow-lg
            focus:outline-none
            focus:ring-2
            focus:ring-offset-2
            focus:ring-${button.color.split('-')[1]}-400
            flex-shrink-0
          `}
          onClick={() => handleClick(button.id)}
        >
          {button.text}
        </button>
      ))}
    </div>
  );
};

export default ButtonSet;
