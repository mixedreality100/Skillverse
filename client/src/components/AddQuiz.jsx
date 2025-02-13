import React, { useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';

const AddQuiz = () => {
  const [questions, setQuestions] = useState([]);

  // Function to add a new question
  const handleAddQuestion = () => {
    if (questions.length < 5) {
      setQuestions((prev) => [...prev, { id: prev.length + 1 }]);
    }
  };

  // Function to remove a question
  const handleRemoveQuestion = (indexToRemove) => {
    setQuestions(questions.filter((_, index) => index !== indexToRemove));
  };

  // Function to publish the quiz
  const handlePublishQuiz = () => {
    alert('Quiz Published Successfully!');
    // Add your publish logic here
  };

  const CreateQuizContent = () => (
    <div className="space-y-6">
      {questions.length === 0 ? (
        <div className="text-center py-10">
          <button
            onClick={handleAddQuestion}
            className="bg-blue-600 text-white px-6 py-3 rounded-md flex items-center mx-auto hover:bg-blue-700"
          >
            <AiOutlinePlus className="mr-2" />
            Add Question
          </button>
        </div>
      ) : (
        <>
          {questions.map((question, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <span className="text-yellow-400 mr-2">✦</span>
                  <h3 className="text-lg font-semibold">Question {index + 1}</h3>
                </div>
                <button
                  className="text-gray-400 hover:text-red-500"
                  onClick={() => handleRemoveQuestion(index)}
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Question</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                    placeholder="Enter your question"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Answers</label>
                  <div className="grid grid-cols-2 gap-4 mt-1">
                    <input
                      type="text"
                      className="p-2 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                      placeholder="Option 1"
                    />
                    <input
                      type="text"
                      className="p-2 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                      placeholder="Option 2"
                    />
                    <input
                      type="text"
                      className="p-2 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                      placeholder="Option 3"
                    />
                    <input
                      type="text"
                      className="p-2 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                      placeholder="Option 4"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Correct Answer</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                    placeholder="Enter the correct answer"
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-center mt-6">
            {questions.length < 5 ? (
              <button
                onClick={handleAddQuestion}
                className="bg-blue-600 text-white px-6 py-3 rounded-md flex items-center hover:bg-blue-700"
              >
                <AiOutlinePlus className="mr-2" />
                Add Another Question
              </button>
            ) : (
              <button
                onClick={handlePublishQuiz}
                className="bg-green-600 text-white px-6 py-3 rounded-md flex items-center hover:bg-green-700"
              >
                Publish Quiz
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto bg-gray-50 p-6 rounded-lg">
      <CreateQuizContent />
    </div>
  );
};

export default AddQuiz;
