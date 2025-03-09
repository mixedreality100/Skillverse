import React from "react";
import Confetti from "react-confetti";

const PopupModal = ({ isOpen, onClose, score, passed, onRetake }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      {passed && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">
          {passed ? "Congratulations! 🎉" : "Oops! 😕"}
        </h2>
        <p className="text-lg mb-6">
          {passed
            ? `You passed with a score of ${score.toFixed(2)}%!`
            : `You scored ${score.toFixed(2)}%. Try again!`}
        </p>
        {passed ? (
          <button
            onClick={onClose}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-200"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={onRetake}
            className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition duration-200"
          >
            Retake Quiz
          </button>
        )}
      </div>
    </div>
  );
};

export default PopupModal;