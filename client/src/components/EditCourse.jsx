"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { FiUpload } from "react-icons/fi"

const EditCourse = ({ onEditComplete }) => {
  const { courseId } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [courseData, setCourseData] = useState({
    instructorEmail: "",
    courseName: "",
    primaryLanguage: "",
    level: "",
    courseImage: null,
    courseImagePreview: null,
    modules: [],
  })

  useEffect(() => {
    const fetchCourseData = async () => {
      setIsLoading(true)
      try {
        // Fetch course basic information
        const courseResponse = await fetch(`http://localhost:3000/courses/${courseId}`)
        if (!courseResponse.ok) {
          throw new Error(`Failed to fetch course: ${courseResponse.status}`)
        }
        const courseInfo = await courseResponse.json()

        // Fetch modules for this course
        const modulesResponse = await fetch(`http://localhost:3000/modules/${courseId}`)
        if (!modulesResponse.ok) {
          throw new Error(`Failed to fetch modules: ${modulesResponse.status}`)
        }
        const modulesInfo = await modulesResponse.json()

        // Process modules and fetch quiz data for each module
        const processedModules = await Promise.all(
          modulesInfo.map(async (module) => {
            // Fetch quiz questions for this module
            let quizQuestions = []
            try {
              const quizResponse = await fetch(`http://localhost:3000/api/modules/${module.id}/quiz`)
              if (quizResponse.ok) {
                quizQuestions = await quizResponse.json()
              }
            } catch (error) {
              console.error(`Error fetching quiz for module ${module.id}:`, error)
            }

            // Create a processed module object with all required fields
            return {
              id: module.id,
              moduleName: module.module_name || "",
              scientificName: module.scientific_name || "",
              description: module.description || "",
              funfact1: module.funfact1 || "",
              funfact2: module.funfact2 || "",
              funfact3: module.funfact3 || "",
              funfact4: module.funfact4 || "",
              part1: {
                name: module.part1_name || "",
                description: module.part1_description || "",
                image: null,
                imagePreview: module.part1_image || null,
              },
              part2: {
                name: module.part2_name || "",
                description: module.part2_description || "",
                image: null,
                imagePreview: module.part2_image || null,
              },
              part3: {
                name: module.part3_name || "",
                description: module.part3_description || "",
                image: null,
                imagePreview: module.part3_image || null,
              },
              part4: {
                name: module.part4_name || "",
                description: module.part4_description || "",
                image: null,
                imagePreview: module.part4_image || null,
              },
              benefit1: {
                name: module.benefit1_name || "",
                description: module.benefit1_description || "",
              },
              benefit2: {
                name: module.benefit2_name || "",
                description: module.benefit2_description || "",
              },
              benefit3: {
                name: module.benefit3_name || "",
                description: module.benefit3_description || "",
              },
              benefit4: {
                name: module.benefit4_name || "",
                description: module.benefit4_description || "",
              },
              numberOfQuiz: module.number_of_quiz || 0,
              quiz: quizQuestions.map((q) => ({
                question: q.question || "",
                optionA: q.option_a || "",
                optionB: q.option_b || "",
                optionC: q.option_c || "",
                optionD: q.option_d || "",
                correctAnswer: q.correct_answer || "",
              })),
              image: null,
              imagePreview: module.module_image || null,
              glbFile: null,
              glbFilePreview: module.glb_file_base64 || null,
            }
          }),
        )

        // Set the complete course data
        setCourseData({
          instructorEmail: courseInfo.instructor_email || "",
          courseName: courseInfo.course_name || "",
          primaryLanguage: courseInfo.primary_language || "",
          level: courseInfo.level || "",
          courseImage: null,
          courseImagePreview: courseInfo.course_image ? `data:image/png;base64,${courseInfo.course_image}` : null,
          modules: processedModules,
        })
      } catch (error) {
        console.error("Error fetching course data:", error)
        alert(`Error loading course data: ${error.message}`)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourseData()
  }, [courseId])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCourseData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCourseImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setCourseData((prev) => ({
        ...prev,
        courseImage: file,
        courseImagePreview: URL.createObjectURL(file),
      }))
    }
  }

  const handleAddModule = () => {
    setCourseData((prev) => ({
      ...prev,
      modules: [
        ...prev.modules,
        {
          moduleName: "",
          scientificName: "",
          description: "",
          funfact1: "",
          funfact2: "",
          funfact3: "",
          funfact4: "",
          part1: { name: "", description: "", image: null, imagePreview: null },
          part2: { name: "", description: "", image: null, imagePreview: null },
          part3: { name: "", description: "", image: null, imagePreview: null },
          part4: { name: "", description: "", image: null, imagePreview: null },
          benefit1: { name: "", description: "" },
          benefit2: { name: "", description: "" },
          benefit3: { name: "", description: "" },
          benefit4: { name: "", description: "" },
          numberOfQuiz: 0,
          quiz: [],
          image: null,
          imagePreview: null,
          glbFile: null,
          glbFilePreview: null,
        },
      ],
    }))
  }

  const handleRemoveModule = (moduleIndex) => {
    setCourseData((prev) => ({
      ...prev,
      modules: prev.modules.filter((_, index) => index !== moduleIndex),
    }))
  }

  const handleAddQuiz = (moduleIndex) => {
    const newQuiz = {
      question: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: "",
    }

    setCourseData((prev) => {
      const updatedModules = [...prev.modules]
      if (!updatedModules[moduleIndex].quiz) {
        updatedModules[moduleIndex].quiz = []
      }
      updatedModules[moduleIndex].quiz.push(newQuiz)
      updatedModules[moduleIndex].numberOfQuiz = updatedModules[moduleIndex].quiz.length
      return {
        ...prev,
        modules: updatedModules,
      }
    })
  }

  const handleModuleInputChange = (e, moduleIndex) => {
    const { name, value } = e.target
    setCourseData((prev) => {
      const updatedModules = [...prev.modules]

      // Handle nested properties (e.g., part1.name, benefit1.description)
      if (name.includes(".")) {
        const [parent, child] = name.split(".")
        updatedModules[moduleIndex][parent] = {
          ...updatedModules[moduleIndex][parent],
          [child]: value,
        }
      } else {
        updatedModules[moduleIndex][name] = value
      }

      return {
        ...prev,
        modules: updatedModules,
      }
    })
  }

  const handleQuizChange = (e, moduleIndex, questionIndex, field) => {
    const { value } = e.target
    if (field === "correctAnswer" && value !== "" && !["A", "B", "C", "D"].includes(value)) {
      alert("Invalid correct answer. Please select A, B, C, or D.")
      return
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
                  : question,
              ),
            }
          : module,
      ),
    }))
  }

  const handleFileUpload = (e, moduleIndex, field) => {
    const file = e.target.files[0]
    if (file) {
      setCourseData((prev) => {
        const updatedModules = [...prev.modules]

        if (field.includes(".")) {
          // Handle nested file uploads like part1.image
          const [parent, child] = field.split(".")
          updatedModules[moduleIndex][parent] = {
            ...updatedModules[moduleIndex][parent],
            [child]: file,
            [`${child}Preview`]: URL.createObjectURL(file),
          }
        } else {
          // Handle direct file uploads like image or glbFile
          updatedModules[moduleIndex][field] = file
          updatedModules[moduleIndex][`${field}Preview`] = URL.createObjectURL(file)
        }

        return {
          ...prev,
          modules: updatedModules,
        }
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const formData = new FormData();
  
      // Basic course info
      formData.append("instructorEmail", courseData.instructorEmail);
      formData.append("courseName", courseData.courseName);
      formData.append("primaryLanguage", courseData.primaryLanguage);
      formData.append("level", courseData.level);
      
      // Course image
      if (courseData.courseImage) {
        formData.append("courseImage", courseData.courseImage);
      }
  
      // Add each module data separately
      courseData.modules.forEach((module, moduleIndex) => {
        // Module basic info
        formData.append(`modules[${moduleIndex}][id]`, module.id || "");
        formData.append(`modules[${moduleIndex}][moduleName]`, module.moduleName);
        formData.append(`modules[${moduleIndex}][scientificName]`, module.scientificName);
        formData.append(`modules[${moduleIndex}][description]`, module.description);
        formData.append(`modules[${moduleIndex}][funfact1]`, module.funfact1);
        formData.append(`modules[${moduleIndex}][funfact2]`, module.funfact2);
        formData.append(`modules[${moduleIndex}][funfact3]`, module.funfact3);
        formData.append(`modules[${moduleIndex}][funfact4]`, module.funfact4);
        
        // Part details
        for (let i = 1; i <= 4; i++) {
          formData.append(`modules[${moduleIndex}][part${i}][name]`, module[`part${i}`].name);
          formData.append(`modules[${moduleIndex}][part${i}][description]`, module[`part${i}`].description);
          if (module[`part${i}`].image) {
            formData.append(`modules[${moduleIndex}][part${i}][image]`, module[`part${i}`].image);
          }
        }
        
        // Benefit details
        for (let i = 1; i <= 4; i++) {
          formData.append(`modules[${moduleIndex}][benefit${i}][name]`, module[`benefit${i}`].name);
          formData.append(`modules[${moduleIndex}][benefit${i}][description]`, module[`benefit${i}`].description);
        }
        
        // Quiz data
        formData.append(`modules[${moduleIndex}][numberOfQuiz]`, module.quiz.length);
        module.quiz.forEach((question, qIndex) => {
          formData.append(`modules[${moduleIndex}][quiz][${qIndex}][question]`, question.question);
          formData.append(`modules[${moduleIndex}][quiz][${qIndex}][optionA]`, question.optionA);
          formData.append(`modules[${moduleIndex}][quiz][${qIndex}][optionB]`, question.optionB);
          formData.append(`modules[${moduleIndex}][quiz][${qIndex}][optionC]`, question.optionC);
          formData.append(`modules[${moduleIndex}][quiz][${qIndex}][optionD]`, question.optionD);
          formData.append(`modules[${moduleIndex}][quiz][${qIndex}][correctAnswer]`, question.correctAnswer);
        });
        
        // Module image and 3D model
        if (module.image) {
          formData.append(`modules[${moduleIndex}][image]`, module.image);
        }
        if (module.glbFile) {
          formData.append(`modules[${moduleIndex}][glbFile]`, module.glbFile);
        }
      });
  
      // Log the formData for debugging (optional)
      // for (let pair of formData.entries()) {
      //   console.log(pair[0] + ': ' + pair[1]);
      // }
  
      // Send to server
      const response = await fetch(`http://localhost:3000/edit-course/${courseId}`, {
        method: "PUT",
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Server responded with status ${response.status}: ${errorData.message}`);
      }
  
      alert("Course updated successfully!");
      if (onEditComplete) onEditComplete();
    } catch (error) {
      console.error("Error updating course:", error);
      alert(`Error updating course: ${error.message}`);
    }
  };




  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-lg text-gray-700">Loading course data...</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-100 p-8 rounded-lg shadow-md max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Edit Course</h2>

        {/* Instructor Email */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Instructor Email</label>
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
          <label className="block text-sm font-medium text-gray-400 mb-2">Course Name</label>
          <input
            type="text"
            name="courseName"
            value={courseData.courseName}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter course name"
            required
          />
        </div>

        {/* Primary Language */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Primary Language</label>
          <input
            type="text"
            name="primaryLanguage"
            value={courseData.primaryLanguage}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter primary language"
            required
          />
        </div>

        {/* Level */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Level</label>
          <input
            type="text"
            name="level"
            value={courseData.level}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter level"
            required
          />
        </div>

        {/* Course Image */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Course Image</label>
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
            <div className="text-center">
              <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
              <label className="cursor-pointer">
                <span className="block mt-2 text-sm text-gray-500">
                  {courseData.courseImage ? courseData.courseImage.name : "Upload a course image"}
                </span>
                <input type="file" className="hidden" accept="image/*" onChange={handleCourseImageUpload} />
              </label>
            </div>
            {courseData.courseImagePreview && (
              <div className="mt-4 text-center">
                <img
                  src={courseData.courseImagePreview || "/placeholder.svg"}
                  alt="Course Preview"
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
              <label className="block text-sm font-medium text-gray-400 mb-2">Module Name</label>
              <input
                type="text"
                name="moduleName"
                value={module.moduleName}
                onChange={(e) => handleModuleInputChange(e, moduleIndex)}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter module name"
                required
              />
            </div>

            {/* Scientific Name */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Scientific Name</label>
              <input
                type="text"
                name="scientificName"
                value={module.scientificName}
                onChange={(e) => handleModuleInputChange(e, moduleIndex)}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter scientific name"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
              <textarea
                name="description"
                value={module.description}
                onChange={(e) => handleModuleInputChange(e, moduleIndex)}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                placeholder="Enter module description"
                required
              ></textarea>
            </div>

            {/* Funfact 1-4 */}
            {[1, 2, 3, 4].map((num) => (
              <div key={`funfact${num}`}>
                <label className="block text-sm font-medium text-gray-400 mb-2">Funfact {num}</label>
                <input
                  type="text"
                  name={`funfact${num}`}
                  value={module[`funfact${num}`]}
                  onChange={(e) => handleModuleInputChange(e, moduleIndex)}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder={`Enter funfact ${num}`}
                  required
                />
              </div>
            ))}

            {/* Parts 1-4 */}
            {[1, 2, 3, 4].map((num) => (
              <div key={`part${num}`} className="mt-4 p-3 border border-gray-300 rounded-lg">
                <h4 className="font-medium mb-2">Part {num}</h4>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                  <input
                    type="text"
                    name={`part${num}.name`}
                    value={module[`part${num}`].name}
                    onChange={(e) => handleModuleInputChange(e, moduleIndex)}
                    className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder={`Enter part ${num} name`}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                  <textarea
                    name={`part${num}.description`}
                    value={module[`part${num}`].description}
                    onChange={(e) => handleModuleInputChange(e, moduleIndex)}
                    className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                    placeholder={`Enter part ${num} description`}
                    required
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Image</label>
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
                    <div className="text-center">
                      <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                      <label className="cursor-pointer">
                        <span className="block mt-2 text-sm text-gray-500">
                          {module[`part${num}`].image ? module[`part${num}`].image.name : `Upload part ${num} image`}
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, moduleIndex, `part${num}.image`)}
                        />
                      </label>
                    </div>
                    {module[`part${num}`].imagePreview && (
                      <div className="mt-4 text-center">
                        <img
                          src={module[`part${num || "/placeholder.svg"}`].imagePreview}
                          alt={`Part ${num} Preview`}
                          className="w-32 h-32 object-cover mx-auto rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Benefits 1-4 */}
            {[1, 2, 3, 4].map((num) => (
              <div key={`benefit${num}`} className="mt-4">
                <h4 className="font-medium mb-2">Benefit {num}</h4>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                  <input
                    type="text"
                    name={`benefit${num}.name`}
                    value={module[`benefit${num}`].name}
                    onChange={(e) => handleModuleInputChange(e, moduleIndex)}
                    className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder={`Enter benefit ${num} name`}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                  <textarea
                    name={`benefit${num}.description`}
                    value={module[`benefit${num}`].description}
                    onChange={(e) => handleModuleInputChange(e, moduleIndex)}
                    className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                    placeholder={`Enter benefit ${num} description`}
                    required
                  ></textarea>
                </div>
              </div>
            ))}

            {/* Module Image */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-400 mb-2">Module Image</label>
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
                      onChange={(e) => handleFileUpload(e, moduleIndex, "image")}
                    />
                  </label>
                </div>
                {module.imagePreview && (
                  <div className="mt-4 text-center">
                    <img
                      src={module.imagePreview || "/placeholder.svg"}
                      alt="Module Preview"
                      className="w-32 h-32 object-cover mx-auto rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Module GLB File */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-400 mb-2">Module GLB File</label>
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
                      onChange={(e) => handleFileUpload(e, moduleIndex, "glbFile")}
                    />
                  </label>
                </div>
                {module.glbFilePreview && (
                  <div className="mt-4 text-center">
                    <span className="text-sm text-gray-500">3D Model Preview (GLB file)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quiz Section */}
            <div className="mt-6">
              <h4 className="font-medium mb-2">Quiz Questions</h4>
              <p className="text-sm text-gray-500 mb-2">Current quiz questions: {module.quiz.length}</p>

              {/* Add Quiz Button */}
              <button
                type="button"
                onClick={() => handleAddQuiz(moduleIndex)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg shadow-md transition duration-200 mt-2 mb-4"
              >
                Add Quiz Question
              </button>

              {/* Quiz Questions */}
              {module.quiz.map((question, questionIndex) => (
                <div key={questionIndex} className="bg-gray-200 p-4 rounded-lg shadow-md my-4">
                  <h4 className="text-md font-semibold mb-4">Question {questionIndex + 1}</h4>

                  {/* Question */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Question</label>
                    <input
                      type="text"
                      value={question.question}
                      onChange={(e) => handleQuizChange(e, moduleIndex, questionIndex, "question")}
                      className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Enter question"
                      required
                    />
                  </div>

                  {/* Options */}
                  {["A", "B", "C", "D"].map((option) => (
                    <div key={option}>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Option {option}</label>
                      <input
                        type="text"
                        value={question[`option${option}`]}
                        onChange={(e) => handleQuizChange(e, moduleIndex, questionIndex, `option${option}`)}
                        className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder={`Enter option ${option}`}
                        required
                      />
                    </div>
                  ))}

                  {/* Correct Answer */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Correct Answer</label>
                    <select
                      value={question.correctAnswer}
                      onChange={(e) => handleQuizChange(e, moduleIndex, questionIndex, "correctAnswer")}
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
            </div>

            {/* Remove Module Button */}
            <button
              type="button"
              onClick={() => handleRemoveModule(moduleIndex)}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-lg shadow-md transition duration-200 mt-5"
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
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg shadow-md transition duration-200 mt-3"
        >
          Update Course
        </button>
      </form>
    </div>
  )
}

export default EditCourse

