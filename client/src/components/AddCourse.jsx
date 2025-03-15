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
    if (field === "correctAnswer" && !["A", "B", "C", "D"].includes(value)) {
      alert("Invalid correct answer. Please select A, B, C, or D.");
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
// When adding a new module
const handleAddModule = () => {
  setCourseData((prev) => ({
    ...prev,
    modules: [
      ...prev.modules,
      {
        moduleName: "",
        scientificName: "", // Add this field
        description: "",
        funfact: null,
        funfact1: "",
        funfact2: "",
        funfact3: "",
        funfact4: "",
        part1: { name: "", description: "", image: null },
        part2: { name: "", description: "", image: null },
        part3: { name: "", description: "", image: null },
        part4: { name: "", description: "", image: null },
        benefit1: { name: "", description: "" },
        benefit2: { name: "", description: "" },
        benefit3: { name: "", description: "" },
        benefit4: { name: "", description: "" },
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
        !module.scientificName ||
          !module.description ||
          !module.funfact ||
          !module.funfact1 ||
          !module.funfact2 ||
          !module.funfact3 ||
          !module.funfact4 ||
          !module.part1.name ||
          !module.part1.description ||
          !module.part1.image ||
          !module.part2.name ||
          !module.part2.description ||
          !module.part2.image ||
          !module.part3.name ||
          !module.part3.description ||
          !module.part3.image ||
          !module.part4.name ||
          !module.part4.description ||
          !module.part4.image ||
          !module.benefit1.name ||
          !module.benefit1.description ||
          !module.benefit2.name ||
          !module.benefit2.description ||
          !module.benefit3.name ||
          !module.benefit3.description ||
          !module.benefit4.name ||
          !module.benefit4.description ||
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
      scientificName: module.scientificName, // Include scientific name
      description: module.description,
      funfact: module.funfact,
      funfact1: module.funfact1,
      funfact2: module.funfact2,
      funfact3: module.funfact3,
      funfact4: module.funfact4,
      part1: module.part1,
      part2: module.part2,
      part3: module.part3,
      part4: module.part4,
      benefit1: module.benefit1,
      benefit2: module.benefit2,
      benefit3: module.benefit3,
      benefit4: module.benefit4,
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
      if (module.funfact) {
        formData.append(`modules[${index}][funfact]`, module.funfact);
      }
      if (module.part1.image) {
        formData.append(`modules[${index}][part1][image]`, module.part1.image);
      }
      if (module.part2.image) {
        formData.append(`modules[${index}][part2][image]`, module.part2.image);
      }
      if (module.part3.image) {
        formData.append(`modules[${index}][part3][image]`, module.part3.image);
      }
      if (module.part4.image) {
        formData.append(`modules[${index}][part4][image]`, module.part4.image);
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

            {/* Scientific Name */}
<div>
  <label className="block text-sm font-medium text-gray-400 mb-2">
    Scientific Name
  </label>
  <input
    type="text"
    value={module.scientificName}
    onChange={(e) => {
      const newModules = [...courseData.modules];
      newModules[moduleIndex].scientificName = e.target.value;
      setCourseData((prev) => ({ ...prev, modules: newModules }));
    }}
    className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
    placeholder="Enter scientific name"
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

            {/* Funfact Image */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Funfact Image
              </label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
                <div className="text-center">
                  <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                  <label className="cursor-pointer">
                    <span className="block mt-2 text-sm text-gray-500">
                      {module.funfact ? module.funfact.name : "Upload a funfact image"}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleModuleFileUpload(e, moduleIndex, "funfact")}
                      required
                    />
                  </label>
                </div>
                {module.funfact && (
                  <div className="mt-4 text-center">
                    <img
                      src={URL.createObjectURL(module.funfact)}
                      alt="Thumbnail Preview"
                      className="w-32 h-32 object-cover mx-auto rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Funfact 1 */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Funfact 1
              </label>
              <input
                type="text"
                value={module.funfact1}
                onChange={(e) => {
                  const newModules = [...courseData.modules];
                  newModules[moduleIndex].funfact1 = e.target.value;
                  setCourseData((prev) => ({ ...prev, modules: newModules }));
                }}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter funfact 1"
                required
              />
            </div>

            {/* Funfact 2 */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Funfact 2
              </label>
              <input
                type="text"
                value={module.funfact2}
                onChange={(e) => {
                  const newModules = [...courseData.modules];
                  newModules[moduleIndex].funfact2 = e.target.value;
                  setCourseData((prev) => ({ ...prev, modules: newModules }));
                }}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter funfact 2"
                required
              />
            </div>

            {/* Funfact 3 */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Funfact 3
              </label>
              <input
                type="text"
                value={module.funfact3}
                onChange={(e) => {
                  const newModules = [...courseData.modules];
                  newModules[moduleIndex].funfact3 = e.target.value;
                  setCourseData((prev) => ({ ...prev, modules: newModules }));
                }}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter funfact 3"
                required
              />
            </div>

            {/* Funfact 4 */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Funfact 4
              </label>
              <input
                type="text"
                value={module.funfact4}
                onChange={(e) => {
                  const newModules = [...courseData.modules];
                  newModules[moduleIndex].funfact4 = e.target.value;
                  setCourseData((prev) => ({ ...prev, modules: newModules }));
                }}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter funfact 4"
                required
              />
            </div>

            {/* Part 1 */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Part 1 Name
              </label>
              <input
                type="text"
                value={module.part1.name}
                onChange={(e) => {
                  const newModules = [...courseData.modules];
                  newModules[moduleIndex].part1.name = e.target.value;
                  setCourseData((prev) => ({ ...prev, modules: newModules }));
                }}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter part 1 name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Part 1 Description
              </label>
              <textarea
                value={module.part1.description}
                onChange={(e) => {
                  const newModules = [...courseData.modules];
                  newModules[moduleIndex].part1.description = e.target.value;
                  setCourseData((prev) => ({ ...prev, modules: newModules }));
                }}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                placeholder="Enter part 1 description"
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Part 1 Image
              </label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
                <div className="text-center">
                  <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                  <label className="cursor-pointer">
                    <span className="block mt-2 text-sm text-gray-500">
                      {module.part1.image ? module.part1.image.name : "Upload a part 1 image"}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const newModules = [...courseData.modules];
                        newModules[moduleIndex].part1.image = e.target.files[0];
                        setCourseData((prev) => ({ ...prev, modules: newModules }));
                      }}
                      required
                    />
                  </label>
                </div>
                {module.part1.image && (
                  <div className="mt-4 text-center">
                    <img
                      src={URL.createObjectURL(module.part1.image)}
                      alt="Thumbnail Preview"
                      className="w-32 h-32 object-cover mx-auto rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Part 2 */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Part 2 Name
              </label>
              <input
                type="text"
                value={module.part2.name}
                onChange={(e) => {
                  const newModules = [...courseData.modules];
                  newModules[moduleIndex].part2.name = e.target.value;
                  setCourseData((prev) => ({ ...prev, modules: newModules }));
                }}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter part 2 name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Part 2 Description
              </label>
              <textarea
                value={module.part2.description}
                onChange={(e) => {
                  const newModules = [...courseData.modules];
                  newModules[moduleIndex].part2.description = e.target.value;
                  setCourseData((prev) => ({ ...prev, modules: newModules }));
                }}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                placeholder="Enter part 2 description"
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Part 2 Image
              </label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
                <div className="text-center">
                  <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                  <label className="cursor-pointer">
                    <span className="block mt-2 text-sm text-gray-500">
                      {module.part2.image ? module.part2.image.name : "Upload a part 2 image"}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const newModules = [...courseData.modules];
                        newModules[moduleIndex].part2.image = e.target.files[0];
                        setCourseData((prev) => ({ ...prev, modules: newModules }));
                      }}
                      required
                    />
                  </label>
                </div>
                {module.part2.image && (
                  <div className="mt-4 text-center">
                    <img
                      src={URL.createObjectURL(module.part2.image)}
                      alt="Thumbnail Preview"
                      className="w-32 h-32 object-cover mx-auto rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Part 3 */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Part 3 Name
              </label>
              <input
                type="text"
                value={module.part3.name}
                onChange={(e) => {
                  const newModules = [...courseData.modules];
                  newModules[moduleIndex].part3.name = e.target.value;
                  setCourseData((prev) => ({ ...prev, modules: newModules }));
                }}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter part 3 name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Part 3 Description
              </label>
              <textarea
                value={module.part3.description}
                onChange={(e) => {
                  const newModules = [...courseData.modules];
                  newModules[moduleIndex].part3.description = e.target.value;
                  setCourseData((prev) => ({ ...prev, modules: newModules }));
                }}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                placeholder="Enter part 3 description"
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Part 3 Image
              </label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
                <div className="text-center">
                  <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                  <label className="cursor-pointer">
                    <span className="block mt-2 text-sm text-gray-500">
                      {module.part3.image ? module.part3.image.name : "Upload a part 3 image"}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const newModules = [...courseData.modules];
                        newModules[moduleIndex].part3.image = e.target.files[0];
                        setCourseData((prev) => ({ ...prev, modules: newModules }));
                      }}
                      required
                    />
                  </label>
                </div>
                {module.part3.image && (
                  <div className="mt-4 text-center">
                    <img
                      src={URL.createObjectURL(module.part3.image)}
                      alt="Thumbnail Preview"
                      className="w-32 h-32 object-cover mx-auto rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Part 4 */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Part 4 Name
              </label>
              <input
                type="text"
                value={module.part4.name}
                onChange={(e) => {
                  const newModules = [...courseData.modules];
                  newModules[moduleIndex].part4.name = e.target.value;
                  setCourseData((prev) => ({ ...prev, modules: newModules }));
                }}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter part 4 name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Part 4 Description
              </label>
              <textarea
                value={module.part4.description}
                onChange={(e) => {
                  const newModules = [...courseData.modules];
                  newModules[moduleIndex].part4.description = e.target.value;
                  setCourseData((prev) => ({ ...prev, modules: newModules }));
                }}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                placeholder="Enter part 4 description"
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Part 4 Image
              </label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
                <div className="text-center">
                  <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                  <label className="cursor-pointer">
                    <span className="block mt-2 text-sm text-gray-500">
                      {module.part4.image ? module.part4.image.name : "Upload a part 4 image"}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const newModules = [...courseData.modules];
                        newModules[moduleIndex].part4.image = e.target.files[0];
                        setCourseData((prev) => ({ ...prev, modules: newModules }));
                      }}
                      required
                    />
                  </label>
                </div>
                {module.part4.image && (
                  <div className="mt-4 text-center">
                    <img
                      src={URL.createObjectURL(module.part4.image)}
                      alt="Thumbnail Preview"
                      className="w-32 h-32 object-cover mx-auto rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Benefit 1 */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Benefit 1 Name
              </label>
              <input
                type="text"
                value={module.benefit1.name}
                onChange={(e) => {
                  const newModules = [...courseData.modules];
                  newModules[moduleIndex].benefit1.name = e.target.value;
                  setCourseData((prev) => ({ ...prev, modules: newModules }));
                }}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter benefit 1 name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Benefit 1 Description
              </label>
              <textarea
                value={module.benefit1.description}
                onChange={(e) => {
                  const newModules = [...courseData.modules];
                  newModules[moduleIndex].benefit1.description = e.target.value;
                  setCourseData((prev) => ({ ...prev, modules: newModules }));
                }}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                placeholder="Enter benefit 1 description"
                required
              ></textarea>
            </div>

            {/* Benefit 2 */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Benefit 2 Name
              </label>
              <input
                type="text"
                value={module.benefit2.name}
                onChange={(e) => {
                  const newModules = [...courseData.modules];
                  newModules[moduleIndex].benefit2.name = e.target.value;
                  setCourseData((prev) => ({ ...prev, modules: newModules }));
                }}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter benefit 2 name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Benefit 2 Description
              </label>
              <textarea
                value={module.benefit2.description}
                onChange={(e) => {
                  const newModules = [...courseData.modules];
                  newModules[moduleIndex].benefit2.description = e.target.value;
                  setCourseData((prev) => ({ ...prev, modules: newModules }));
                }}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                placeholder="Enter benefit 2 description"
                required
              ></textarea>
            </div>

            {/* Benefit 3 */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Benefit 3 Name
              </label>
              <input
                type="text"
                value={module.benefit3.name}
                onChange={(e) => {
                  const newModules = [...courseData.modules];
                  newModules[moduleIndex].benefit3.name = e.target.value;
                  setCourseData((prev) => ({ ...prev, modules: newModules }));
                }}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter benefit 3 name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Benefit 3 Description
              </label>
              <textarea
                value={module.benefit3.description}
                onChange={(e) => {
                  const newModules = [...courseData.modules];
                  newModules[moduleIndex].benefit3.description = e.target.value;
                  setCourseData((prev) => ({ ...prev, modules: newModules }));
                }}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                placeholder="Enter benefit 3 description"
                required
              ></textarea>
            </div>

            {/* Benefit 4 */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Benefit 4 Name
              </label>
              <input
                type="text"
                value={module.benefit4.name}
                onChange={(e) => {
                  const newModules = [...courseData.modules];
                  newModules[moduleIndex].benefit4.name = e.target.value;
                  setCourseData((prev) => ({ ...prev, modules: newModules }));
                }}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter benefit 4 name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Benefit 4 Description
              </label>
              <textarea
                value={module.benefit4.description}
                onChange={(e) => {
                  const newModules = [...courseData.modules];
                  newModules[moduleIndex].benefit4.description = e.target.value;
                  setCourseData((prev) => ({ ...prev, modules: newModules }));
                }}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                placeholder="Enter benefit 4 description"
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

            {/* Module GLB File */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Module GLB File
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
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg shadow-md transition duration-200 mt-5"
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
        // Submit Button className correction
className={`w-full py-3 rounded-lg shadow-md transition duration-200 ${
  (
    !courseData.instructorEmail ||
    !courseData.courseName ||
    !courseData.primaryLanguage ||
    !courseData.level ||
    !courseData.courseImage ||
    courseData.modules.some(
      (module) =>
        !module.moduleName ||
        !module.description ||
        !module.funfact ||
        !module.funfact1 ||
        !module.funfact2 ||
        !module.funfact3 ||
        !module.funfact4 ||
        !module.part1.name ||
        !module.part1.description ||
        !module.part1.image ||
        !module.part2.name ||
        !module.part2.description ||
        !module.part2.image ||
        !module.part3.name ||
        !module.part3.description ||
        !module.part3.image ||
        !module.part4.name ||
        !module.part4.description ||
        !module.part4.image ||
        !module.benefit1.name ||
        !module.benefit1.description ||
        !module.benefit2.name ||
        !module.benefit2.description ||
        !module.benefit3.name ||
        !module.benefit3.description ||
        !module.benefit4.name ||
        !module.benefit4.description ||
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
                !module.description ||
                !module.funfact ||
                !module.funfact1 ||
                !module.funfact2 ||
                !module.funfact3 ||
                !module.funfact4 ||
                !module.part1.name ||
                !module.part1.description ||
                !module.part1.image ||
                !module.part2.name ||
                !module.part2.description ||
                !module.part2.image ||
                !module.part3.name ||
                !module.part3.description ||
                !module.part3.image ||
                !module.part4.name ||
                !module.part4.description ||
                !module.part4.image ||
                !module.benefit1.name ||
                !module.benefit1.description ||
                !module.benefit2.name ||
                !module.benefit2.description ||
                !module.benefit3.name ||
                !module.benefit3.description ||
                !module.benefit4.name ||
                !module.benefit4.description ||
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