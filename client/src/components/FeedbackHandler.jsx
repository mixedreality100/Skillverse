// FeedbackHandler.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FeedbackHandler = ({ userId, courseId }) => {
  const [feedbackFormVisible, setFeedbackFormVisible] = useState(false);
  const [feedback, setFeedback] = useState('');
  const navigate = useNavigate();

  const handleFeedbackSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/submit-feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          courseId: courseId,
          feedback: feedback,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        navigate("/learner-dashboard");
      } else {
        alert("Error submitting feedback.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Error submitting feedback.");
    }
  };

  return {
    feedbackFormVisible,
    setFeedbackFormVisible,
    feedback,
    setFeedback,
    handleFeedbackSubmit,
  };
};

export default FeedbackHandler;