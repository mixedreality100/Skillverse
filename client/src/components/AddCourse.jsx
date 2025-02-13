import React, { useState } from "react";
import { FiUpload } from "react-icons/fi";

const AddCourse = () => {
  const [courseData, setCourseData] = useState({
    instructorEmail: "",
    courseName: "",
    primaryLanguage: "",
    level: "",
    courseImage: null,
    modules: [],
  });

  const [isCourseSubmitted, setIsCourseSubmitted] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file upload
  const handleCourseImageUpload = (e) => {
    const file = e.target.files[0];
    setCourseData((prev) => ({
      ...prev,
      courseImage: file,
    }));
  };

  const handleModuleFileUpload = (e, index, type) => {
    const file = e.target.files[0];
    setCourseData((prev) => ({
      ...prev,
      modules: prev.modules.map((module, i) =>
        i === index
          ? {
              ...module,
              [type]: file,
            }
          : module
      ),
    }));
  };

  // Handle quiz question changes
  const handleQuizChange = (e, moduleIndex, questionIndex, field) => {
    const { value } = e.target;
    if (field === 'correctAnswer' && !['A', 'B', 'C', 'D'].includes(value)) {
      alert('Invalid correct answer. Please select A, B, C, or D.');
      return;
    }
    setCourseData((prev) => ({
      ...prev,
      modules: prev.modules.map((module, i) =>
        i === moduleIndex
          ? {
              ...module,
              quiz: module.quiz.map((question, qIndex) =>
                qIndex === questionIndex
                  ? {
                      ...question,
                      [field]: value,
                    }
                  : question
              ),
            }
          : module
      ),
    }));
  };

  // Handle adding a new module
  const handleAddModule = () => {
    setCourseData((prev) => ({
      ...prev,
      modules: [
        ...prev.modules,
        {
          moduleName: "",
          specificName: "",
          description: "",
          moreInformation: "",
          importantParts: "",
          benefits: "",
          image: null,
          glbFile: null,
          numberOfQuiz: "",
          quiz: [],
        },
      ],
    }));
  };

  // Handle removing a module
  const handleRemoveModule = (index) => {
    setCourseData((prev) => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== index),
    }));
  };

  // Handle adding quiz questions
  const handleAddQuiz = (moduleIndex, numberOfQuiz) => {
    const newQuiz = Array.from({ length: parseInt(numberOfQuiz, 10) }, () => ({
      question: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: "",
    }));

    setCourseData((prev) => ({
      ...prev,
      modules: prev.modules.map((module, i) =>
        i === moduleIndex
          ? {
              ...module,
              quiz: newQuiz,
            }
          : module
      ),
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (
      !courseData.instructorEmail ||
      !courseData.courseName ||
      !courseData.primaryLanguage ||
      !courseData.level ||
      !courseData.courseImage ||
      courseData.modules.some(
        (module) =>
          !module.moduleName ||
          !module.specificName ||
          !module.description ||
          !module.moreInformation ||
          !module.importantParts ||
          !module.benefits ||
          !module.image ||
          !module.glbFile ||
          !module.numberOfQuiz ||
          module.quiz.some(
            (question) =>
              !question.question ||
              !question.optionA ||
              !question.optionB ||
              !question.optionC ||
              !question.optionD ||
              !question.correctAnswer
          )
      )
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const formData = new FormData();

    // Add course data to formData
    formData.append("instructorEmail", courseData.instructorEmail);
    formData.append("courseName", courseData.courseName);
    formData.append("primaryLanguage", courseData.primaryLanguage);
    formData.append("level", courseData.level);
    formData.append("courseImage", courseData.courseImage);

    // Prepare modules data for JSON string
    const modulesForJson = courseData.modules.map((module) => ({
      moduleName: module.moduleName,
      specificName: module.specificName,
      description: module.description,
      moreInformation: module.moreInformation,
      importantParts: module.importantParts.split(",,"),
      benefits: module.benefits.split(",,"),
      numberOfQuiz: module.numberOfQuiz,
      quiz: module.quiz,
    }));

    formData.append("modules", JSON.stringify(modulesForJson));

    // Add module data to formData
    courseData.modules.forEach((module, index) => {
      if (module.image) {
        formData.append(`modules[${index}][image]`, module.image);
      }
      if (module.glbFile) {
        formData.append(`modules[${index}][glbFile]`, module.glbFile);
      }
    });

    try {
      const response = await fetch("http://localhost:3000/add-course", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Server responded with status ${response.status}: ${errorData.message}`);
      }

      setIsCourseSubmitted(true);
      alert("Course submitted successfully!");

      // Reset the form data to its initial state
      setCourseData({
        instructorEmail: "",
        courseName: "",
        primaryLanguage: "",
        level: "",
        courseImage: null,
        modules: [],
      });
    } catch (error) {
      console.error("Error submitting course:", error);
      alert(`Error submitting course: ${error.message}`);
    }
  };

  return (
    <div className="bg-gray-100 p-8 rounded-lg shadow-md max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
          Add a New Course
        </h2>

        {/* Instructor Email */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Instructor Email
          </label>
          <input
            type="email"
            name="instructorEmail"
            value={courseData.instructorEmail}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter instructor email"
            required
          />
        </div>

        {/* Course Name */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Course Name
          </label>
          <select
            name="courseName"
            value={courseData.courseName}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          >
            <option value="">Select Course</option>
            <option value="Medicinal Plants">Medicinal Plants</option>
            <option value="Solar System">Solar System</option>
            <option value="Anatomy">Anatomy</option>
            {/* Add more options as needed */}
          </select>
        </div>

        {/* Primary Language */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Primary Language
          </label>
          <select
            name="primaryLanguage"
            value={courseData.primaryLanguage}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          >
            <option value="">Select Language</option>
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            {/* Add more languages as needed */}
          </select>
        </div>

        {/* Level */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Level
          </label>
          <select
            name="level"
            value={courseData.level}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          >
            <option value="">Select Level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        {/* Course Image */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Course Image
          </label>
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
            <div className="text-center">
              <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
              <label className="cursor-pointer">
                <span className="block mt-2 text-sm text-gray-500">
                  {courseData.courseImage ? courseData.courseImage.name : "Upload a course image"}
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleCourseImageUpload}
                  required
                />
              </label>
            </div>
            {courseData.courseImage && (
              <div className="mt-4 text-center">
                <img
                  src={URL.createObjectURL(courseData.courseImage)}
                  alt="Thumbnail Preview"
                  className="w-32 h-32 object-cover mx-auto rounded-lg"
                />
              </div>
            )}
          </div>
        </div>

        {/* Modules */}
        {courseData.modules.map((module, moduleIndex) => (
          <div key={moduleIndex} className="bg-white p-4 rounded-lg shadow-md my-4">
            <h3 className="text-lg font-semibold mb-4">Module {moduleIndex + 1}</h3>

            {/* Module Name */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Module Name
              </label>
              <input
                type="text"
                value={module.moduleName}
                onChange={(e) => {
                  const newModules = [...courseData.modules];
                  newModules[moduleIndex].moduleName = e.target.value;
                  setCourseData((prev) => ({ ...prev, modules: newModules }));
                }}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter module name"
                required
              />
            </div>

            {/* Specific Name */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Specific Name
              </label>
              <input
                type="text"
                value={module.specificName}
                onChange={(e) => {
                  const newModules = [...courseData.modules];
                  newModules[moduleIndex].specificName = e.target.value;
                  setCourseData((prev) => ({ ...prev, modules: newModules }));
                }}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter specific name"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Description
              </label>
              <textarea
                value={module.description}
                onChange={(e) => {
                  const newModules = [...courseData.modules];
                  newModules[moduleIndex].description = e.target.value;
                  setCourseData((prev) => ({ ...prev, modules: newModules }));
                }}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                placeholder="Enter module description"
                required
              ></textarea>
            </div>

            {/* More Information */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                More Information
              </label>
              <textarea
                value={module.moreInformation}
                onChange={(e) => {
                  const newModules = [...courseData.modules];
                  newModules[moduleIndex].moreInformation = e.target.value;
                  setCourseData((prev) => ({ ...prev, modules: newModules }));
                }}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                placeholder="Enter more information"
                required
              ></textarea>
            </div>

            {/* Important Parts */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Important Parts
              </label>
              <textarea
                value={module.importantParts}
                onChange={(e) => {
                  const newModules = [...courseData.modules];
                  newModules[moduleIndex].importantParts = e.target.value;
                  setCourseData((prev) => ({ ...prev, modules: newModules }));
                }}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                placeholder="Enter important parts (separated by double commas)"
                required
              ></textarea>
            </div>

            {/* Benefits */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Benefits
              </label>
              <textarea
                value={module.benefits}
                onChange={(e) => {
                  const newModules = [...courseData.modules];
                  newModules[moduleIndex].benefits = e.target.value;
                  setCourseData((prev) => ({ ...prev, modules: newModules }));
                }}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                placeholder="Enter benefits (separated by double commas)"
                required
              ></textarea>
            </div>

            {/* Module Image */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Module Image
              </label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
                <div className="text-center">
                  <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                  <label className="cursor-pointer">
                    <span className="block mt-2 text-sm text-gray-500">
                      {module.image ? module.image.name : "Upload a module image"}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleModuleFileUpload(e, moduleIndex, "image")}
                      required
                    />
                  </label>
                </div>
                {module.image && (
                  <div className="mt-4 text-center">
                    <img
                      src={URL.createObjectURL(module.image)}
                      alt="Thumbnail Preview"
                      className="w-32 h-32 object-cover mx-auto rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* GLB File */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                GLB File
              </label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
                <div className="text-center">
                  <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                  <label className="cursor-pointer">
                    <span className="block mt-2 text-sm text-gray-500">
                      {module.glbFile ? module.glbFile.name : "Upload a GLB file"}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".glb"
                      onChange={(e) => handleModuleFileUpload(e, moduleIndex, "glbFile")}
                      required
                    />
                  </label>
                </div>
                {module.glbFile && (
                  <div className="mt-4 text-center">
                    <span className="text-sm text-gray-500">{module.glbFile.name}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Number of Quiz */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Number of Quiz
              </label>
              <input
                type="number"
                value={module.numberOfQuiz}
                onChange={(e) => {
                  const newModules = [...courseData.modules];
                  newModules[moduleIndex].numberOfQuiz = e.target.value;
                  setCourseData((prev) => ({ ...prev, modules: newModules }));
                }}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter number of quiz"
                required
              />
            </div>

            {/* Add Quiz Button */}
            <button
              type="button"
              onClick={() => handleAddQuiz(moduleIndex, module.numberOfQuiz)}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg shadow-md transition duration-200"
            >
              Add Quiz
            </button>

            {/* Quiz Questions */}
            {module.quiz.map((question, questionIndex) => (
              <div key={questionIndex} className="bg-gray-200 p-4 rounded-lg shadow-md my-4">
                <h4 className="text-md font-semibold mb-4">Question {questionIndex + 1}</h4>

                {/* Question */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Question
                  </label>
                  <input
                    type="text"
                    value={question.question}
                    onChange={(e) => handleQuizChange(e, moduleIndex, questionIndex, 'question')}
                    className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter question"
                    required
                  />
                </div>

                {/* Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Option A
                  </label>
                  <input
                    type="text"
                    value={question.optionA}
                    onChange={(e) => handleQuizChange(e, moduleIndex, questionIndex, 'optionA')}
                    className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter option A"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Option B
                  </label>
                  <input
                    type="text"
                    value={question.optionB}
                    onChange={(e) => handleQuizChange(e, moduleIndex, questionIndex, 'optionB')}
                    className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter option B"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Option C
                  </label>
                  <input
                    type="text"
                    value={question.optionC}
                    onChange={(e) => handleQuizChange(e, moduleIndex, questionIndex, 'optionC')}
                    className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter option C"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Option D
                  </label>
                  <input
                    type="text"
                    value={question.optionD}
                    onChange={(e) => handleQuizChange(e, moduleIndex, questionIndex, 'optionD')}
                    className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter option D"
                    required
                  />
                </div>

                {/* Correct Answer */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Correct Answer
                  </label>
                  <select
                    value={question.correctAnswer}
                    onChange={(e) => handleQuizChange(e, moduleIndex, questionIndex, 'correctAnswer')}
                    className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  >
                    <option value="">Select Correct Answer</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
              </div>
            ))}

            {/* Remove Module Button */}
            <button
              type="button"
              onClick={() => handleRemoveModule(moduleIndex)}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-lg shadow-md transition duration-200 mt-3"
            >
              Remove Module
            </button>
          </div>
        ))}

        {/* Add Module Button */}
        <button
          type="button"
          onClick={handleAddModule}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg shadow-md transition duration-200 mt-3"
        >
          Add Module
        </button>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-3 rounded-lg shadow-md transition duration-200 ${
            !courseData.instructorEmail ||
            !courseData.courseName ||
            !courseData.primaryLanguage ||
            !courseData.level ||
            !courseData.courseImage ||
            courseData.modules.some(
              (module) =>
                !module.moduleName ||
                !module.specificName ||
                !module.description ||
                !module.moreInformation ||
                !module.importantParts ||
                !module.benefits ||
                !module.image ||
                !module.glbFile ||
                !module.numberOfQuiz ||
                module.quiz.some(
                  (question) =>
                    !question.question ||
                    !question.optionA ||
                    !question.optionB ||
                    !question.optionC ||
                    !question.optionD ||
                    !question.correctAnswer
                )
            )
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
          disabled={
            !courseData.instructorEmail ||
            !courseData.courseName ||
            !courseData.primaryLanguage ||
            !courseData.level ||
            !courseData.courseImage ||
            courseData.modules.some(
              (module) =>
                !module.moduleName ||
                !module.specificName ||
                !module.description ||
                !module.moreInformation ||
                !module.importantParts ||
                !module.benefits ||
                !module.image ||
                !module.glbFile ||
                !module.numberOfQuiz ||
                module.quiz.some(
                  (question) =>
                    !question.question ||
                    !question.optionA ||
                    !question.optionB ||
                    !question.optionC ||
                    !question.optionD ||
                    !question.correctAnswer
                )
            )
          }
        >
          Submit Course
        </button>
      </form>
    </div>
  );
};

export default AddCourse;