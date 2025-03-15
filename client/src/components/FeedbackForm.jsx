import React, { useState } from 'react';
import styled from 'styled-components';

const FeedbackForm = ({ courseId, userId, onClose, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:3000/api/submit-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          courseId,
          rating,
          feedback
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // If successful, call the onSubmit callback
      onSubmit();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalOverlay>
      <FormContainer onSubmit={handleSubmit}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <FormTitle>Course Feedback</FormTitle>
        <FormDescription>
          Congratulations on completing the course! We would love to hear your thoughts.
        </FormDescription>
        
        <RatingContainer>
          <RatingLabel>Rate your experience:</RatingLabel>
          <RatingScale>
            {[1, 2, 3, 4, 5].map((value) => (
              <RatingOption key={value}>
                <RatingInput
                  type="radio"
                  id={`rating-${value}`}
                  name="rating"
                  value={value}
                  checked={rating === value}
                  onChange={() => setRating(value)}
                />
                <RatingLabel htmlFor={`rating-${value}`} active={rating === value}>
                  {value}
                </RatingLabel>
              </RatingOption>
            ))}
          </RatingScale>
        </RatingContainer>
        
        <FeedbackTextarea
          rows="5"
          placeholder="Share your experience with this course..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        ></FeedbackTextarea>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <SubmitButton type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Feedback'}
        </SubmitButton>
      </FormContainer>
    </ModalOverlay>
  );
};

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const FormContainer = styled.form`
  background-color: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 500px;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const FormTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  color: #333;
`;

const FormDescription = styled.p`
  color: #666;
  margin-bottom: 1.5rem;
`;

const RatingContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const RatingLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  color: ${props => props.active ? '#1ed760' : '#333'};
`;

const RatingScale = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
`;

const RatingOption = styled.div`
  text-align: center;
`;

const RatingInput = styled.input`
  display: none;
`;

const FeedbackTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: vertical;
  font-family: inherit;
  margin-bottom: 1.5rem;
  color: white;
  background-color: #333;
  
  &::placeholder {
    color: #aaa;
  }
  
  &:focus {
    outline: none;
    border-color: #1ed760;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.8rem;
  background-color: #1ed760;
  color: white;
  border: none;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background-color: #19c353;
    transform: translateY(-2px);
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

export default FeedbackForm;