import React, { useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { FiUpload } from 'react-icons/fi';

const CreateCourse = () => {
  const [activeTab, setActiveTab] = useState('content');
  const [questions, setQuestions] = useState([]);
  const [courseData, setCourseData] = useState({
    title: " ",
    description: " ",
    importantParts: " ",
    benefits: " ",
    image: null,
    model: null
  });

  // Handle course data changes
  const handleCourseDataChange = (e) => {
    const { name, value } = e.target;
    setCourseData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file uploads
  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    setCourseData(prev => ({
      ...prev,
      [type]: file
    }));
  };

  // Function to remove uploaded image or model
  const handleRemoveFile = (type) => {
    setCourseData(prev => ({
      ...prev,
      [type]: null
    }));
  };

  const CourseContentSection = () => (
    <div className="space-y-6">
      {/* Title Input */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Course Title</label>
        <input
          type="text"
          name="title"
          value={courseData.title}
          onChange={handleCourseDataChange}
          className="w-full p-3 border rounded-md text-white bg-gray-700"
          placeholder="Enter course title"
        />
      </div>

      {/* Description Input */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Course Description</label>
        <textarea
          name="description"
          value={courseData.description}
          onChange={handleCourseDataChange}
          className="w-full p-3 border rounded-md text-white bg-gray-700 min-h-[150px]"
          placeholder="Enter course description"
        />
      </div>

      {/* Important Parts Input */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Important Parts</label>
        <textarea
          name="importantParts"
          value={courseData.importantParts}
          onChange={handleCourseDataChange}
          className="w-full p-3 border rounded-md text-white bg-gray-700 min-h-[150px]"
          placeholder="Enter important parts of the course"
        />
      </div>

      {/* Benefits Input */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Benefits</label>
        <textarea
          name="benefits"
          value={courseData.benefits}
          onChange={handleCourseDataChange}
          className="w-full p-3 border rounded-md text-white bg-gray-700 min-h-[150px]"
          placeholder="Enter benefits of the course"
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Course Thumbnail</label>
        <div className="border-2 border-dashed border-gray-300 rounded-md p-6">
          <div className="text-center">
            <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-2">
              <label className="cursor-pointer">
                <span className="mt-2 text-sm text-gray-500">
                  {courseData.image ? courseData.image.name : 'Upload a course thumbnail'}
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'image')}
                />
              </label>
            </div>
            {courseData.image && (
              <div className="mt-2">
                <img 
                  src={URL.createObjectURL(courseData.image)} 
                  alt="Course Thumbnail" 
                  className="w-full h-auto rounded-md"
                />
                <button 
                  className="mt-2 text-red-500"
                  onClick={() => handleRemoveFile('image')}
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3D Model Upload */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">3D Model (GLB)</label>
        <div className="border-2 border-dashed border-gray-300 rounded-md p-6">
          <div className="text-center">
            <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-2">
              <label className="cursor-pointer">
                <span className="mt-2 text-sm text-gray-500">
                  {courseData.model ? courseData.model.name : 'Upload a 3D model (GLB file)'}
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept=".glb"
                  onChange={(e) => handleFileUpload(e, 'model')}
                />
              </label>
            </div>
            {courseData.model && (
              <div className="mt-2">
                <span className="text-gray-300">3D Model: {courseData.model.name}</span>
                <button 
                  className="mt-2 text-red-500"
                  onClick={() => handleRemoveFile('model')}
                >
                  Remove 3D Model
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Function to add a new question
  const handleAddQuestion = () => {
    if (questions.length < 5) {
      setQuestions(prev => [...prev, { id: prev.length + 1 }]);
    } else {
      alert("You can only add up to 5 questions.");
    }
  };

  // Function to remove a question
  const handleRemoveQuestion = (indexToRemove) => {
    setQuestions(questions.filter((_, index) => index !== indexToRemove));
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
                  <label className="text-sm text-gray-400">Question</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md mt-1 text-white bg-gray-700"
                    placeholder="Enter your question"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-gray-400">Answers</label>
                  <div className="grid grid-cols-2 gap-4 mt-1">
                    <input type="text" className="p-2 border rounded-md text-white bg-gray-700" placeholder="Option 1" />
                    <input type="text" className="p-2 border rounded-md text-white bg-gray-700" placeholder="Option 2" />
                    <input type="text" className="p-2 border rounded-md text-white bg-gray-700" placeholder="Option 3" />
                    <input type="text" className="p-2 border rounded-md text-white bg-gray-700" placeholder="Option 4" />
                  </div>
                </div>

                {/* Correct Answer Input */}
                <div>
                  <label className="text-sm text-gray-400">Correct Answer</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md mt-1 text-white bg-gray-700"
                    placeholder="Enter the correct answer"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Add Question button at the bottom */}
          <div className="flex justify-center mt-6">
            <button 
              onClick={handleAddQuestion}
              className="bg-blue-600 text-white px-6 py-3 rounded-md flex items-center hover:bg-blue-700"
            >
              <AiOutlinePlus className="mr-2" />
              Add Another Question
            </button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with Add New Course and Publish buttons */}
      <div className="flex justify-between items-center mb-8">
        {/* <button className="flex items-center bg-white rounded-full px-4 py-2 shadow-sm">
          <AiOutlinePlus className="mr-2" />
          Add New Course
        </button> */}
        <button className="bg-blue-600 text-white px-6 py-2 rounded-md">
          Publish Course
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center mb-8">
        <button 
          className={`flex items-center mr-4 ${activeTab === 'content' ? 'text-gray-800' : 'text-gray-400'}`}
          onClick={() => setActiveTab('content')}
        >
          <span className={`mr-2 h-3 w-3 rounded-full ${activeTab === 'content' ? 'bg-blue-600' : 'bg-gray-300'}`}></span>
          Course Content
        </button>
        <button 
          className={`flex items-center ${activeTab === 'quiz' ? 'text-gray-800' : 'text-gray-400'}`}
          onClick={() => setActiveTab('quiz')}
        >
          <span className={`mr-2 h-3 w-3 rounded-full ${activeTab === 'quiz' ? 'bg-blue-600' : 'bg-gray-300'}`}></span>
          Create Quiz
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-gray-50 p-6 rounded-lg">
        {activeTab === 'content' ? (
          <CourseContentSection />
        ) : (
          <CreateQuizContent />
        )}
      </div>
    </div>
  );
};

export default CreateCourse;
