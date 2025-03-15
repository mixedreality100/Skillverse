import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Confetti from 'react-confetti';

const PopupModal = ({
  isOpen,
  onClose,
  score,
  passed,
  onRetake,
  showFeedback,     // New prop to control feedback button visibility
  onFeedback        // New prop for feedback button action
}) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Update window size when window is resized
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isOpen) return null;

  return (
    <>
      {/* Confetti is rendered outside the modal, at the top of the viewport */}
      {passed && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
        />
      )}
      <ModalOverlay>
        <ModalContent>
          <ModalTitle>
            {passed ? "Congratulations! 🎉" : "Try Again"}
          </ModalTitle>
          <ScoreText>
            {passed
              ? `You passed with a score of ${score.toFixed(2)}%!`
              : `Your score: ${score.toFixed(2)}%. You need 60% to pass.`}
          </ScoreText>
          <ButtonsContainer>
            {passed ? (
              <>
                <ContinueButton onClick={onClose}>
                  Continue
                </ContinueButton>
                {/* Add feedback button when needed and next module is null */}
                {showFeedback && (
                  <FeedbackButton onClick={onFeedback}>
                    Give Feedback
                  </FeedbackButton>
                )}
              </>
            ) : (
              <RetakeButton onClick={onRetake}>
                Retake Quiz
              </RetakeButton>
            )}
          </ButtonsContainer>
        </ModalContent>
      </ModalOverlay>
    </>
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

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 500px;
  text-align: center;
  position: relative;
  z-index: 1001;
`;

const ModalTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #333;
`;

const ScoreText = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #555;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  border-radius: 30px;
  border: none;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ContinueButton = styled(Button)`
  background-color: #1ed760;
  color: white;
  
  &:hover {
    background-color: #19c353;
  }
`;

const RetakeButton = styled(Button)`
  background-color: #f7cd46;
  color: #333;
  
  &:hover {
    background-color: #f5c42c;
  }
`;

const FeedbackButton = styled(Button)`
  background-color: #3498db;
  color: white;
  
  &:hover {
    background-color: #2980b9;
  }
`;

export default PopupModal;