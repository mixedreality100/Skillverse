import React, { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { FiUpload } from "react-icons/fi";
import AddQuiz from "./AddQuiz"; // Import your AddQuiz component

const AddModule = () => {
  const [moduleData, setmoduleData] = useState({
    title: "",
    description: "",
    importantParts: "",
    benefits: "",
    image: null,
    model: null,
  });

  const [showQuiz, setShowQuiz] = useState(false); // State to toggle between AddModule and AddQuiz

  // Handle course data changes
  const handleModuleDataChange = (e) => {
    const { name, value } = e.target;
    setmoduleData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file uploads
  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    setmoduleData((prev) => ({
      ...prev,
      [type]: file,
    }));
  };

  // Function to remove uploaded image or model
  const handleRemoveFile = (type) => {
    setmoduleData((prev) => ({
      ...prev,
      [type]: null,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(moduleData);
    alert("Module submitted successfully!");
    setShowQuiz(true); // Show the AddQuiz component after submission
  };

  if (showQuiz) {
    return <AddQuiz />; // Render AddQuiz if showQuiz is true
  }

  return (
    <div className="bg-gray-100 p-8 rounded-lg shadow-md max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
          Add a New Module
        </h2>

        {/* Title Input */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Module Title
          </label>
          <input
            type="text"
            name="title"
            value={moduleData.title}
            onChange={handleModuleDataChange}
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter module title"
          />
        </div>

        {/* Description Input */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Course Description
          </label>
          <textarea
            name="description"
            value={moduleData.description}
            onChange={handleModuleDataChange}
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            placeholder="Enter Module description"
          ></textarea>
        </div>

        {/* Important Parts Input */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Important Parts
          </label>
          <textarea
            name="importantParts"
            value={moduleData.importantParts}
            onChange={handleModuleDataChange}
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            placeholder="Enter important parts of the course"
          ></textarea>
        </div>

        {/* Benefits Input */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Benefits
          </label>
          <textarea
            name="benefits"
            value={moduleData.benefits}
            onChange={handleModuleDataChange}
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            placeholder="Enter benefits of the course"
          ></textarea>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Module Thumbnail
          </label>
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
            <div className="text-center">
              <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
              <label className="cursor-pointer">
                <span className="block mt-2 text-sm text-gray-500">
                  {moduleData.image
                    ? moduleData.image.name
                    : "Upload a course thumbnail"}
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "image")}
                />
              </label>
            </div>
            {moduleData.image && (
              <div className="mt-4 text-center">
                <img
                  src={URL.createObjectURL(moduleData.image)}
                  alt="Thumbnail Preview"
                  className="w-32 h-32 object-cover mx-auto rounded-lg"
                />
                <button
                  className="mt-2 text-red-500"
                  onClick={() => handleRemoveFile("image")}
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 3D Model Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            3D Model (GLB)
          </label>
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
            <div className="text-center">
              <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
              <label className="cursor-pointer">
                <span className="block mt-2 text-sm text-gray-500">
                  {moduleData.model
                    ? moduleData.model.name
                    : "Upload a 3D model (GLB file)"}
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept=".glb"
                  onChange={(e) => handleFileUpload(e, "model")}
                />
              </label>
            </div>
            {moduleData.model && (
              <div className="mt-4 text-center">
                <span className="text-gray-200">
                  3D Model: {moduleData.model.name}
                </span>
                <button
                  className="mt-2 text-red-500"
                  onClick={() => handleRemoveFile("model")}
                >
                  Remove 3D Model
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg shadow-md transition duration-200"
        >
          Submit Module
        </button>
      </form>
    </div>
  );
};

export default AddModule;
