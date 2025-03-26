"use client"

import { useState, useEffect } from "react"
import { FiUpload } from "react-icons/fi"
import { useUser } from "@clerk/clerk-react"
import { useParams, useNavigate } from "react-router-dom"
import Button from "./Button" // Import the Button component

const EditCourse = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
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

  const [userInfo, setUserInfo] = useState({
    name: "Content Creator",
    email: "contentCreator@gmail.com",
    profilePicture: "https://via.placeholder.com/150",
  })

  // Get Clerk user
  const { user } = useUser()

  useEffect(() => {
    if (user) {
      setUserInfo({
        name: user.fullName || "Content Creator",
        email: user.primaryEmailAddress?.emailAddress || "contentCreator@gmail.com",
        profilePicture: user.imageUrl || "https://via.placeholder.com/150",
      })
      // Set the instructor email from Clerk user data and make it non-editable
      setCourseData((prev) => ({
        ...prev,
        instructorEmail: user.primaryEmailAddress?.emailAddress || "contentCreator@gmail.com",
      }))
    }
  }, [user])

  // Fetch course data when component mounts
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setIsLoading(true)

        // Fetch course details
        const courseResponse = await fetch(`http://localhost:3000/courses/${courseId}`)
        if (!courseResponse.ok) {
          throw new Error("Failed to fetch course data")
        }
        const courseDetails = await courseResponse.json()

        // Fetch modules for this course
        const modulesResponse = await fetch(`http://localhost:3000/modules/${courseId}`)
        if (!modulesResponse.ok) {
          throw new Error("Failed to fetch modules data")
        }
        const modulesData = await modulesResponse.json()

        // Process modules to fetch quiz questions for each module
        const modulesWithQuiz = await Promise.all(
          modulesData.map(async (module) => {
            const quizResponse = await fetch(`http://localhost:3000/api/modules/${module.id}/quiz`)
            const quizData = await quizResponse.json()

            // Format quiz data to match the expected structure
            const formattedQuiz = quizData.map((q) => ({
              question: q.question,
              optionA: q.option_a,
              optionB: q.option_b,
              optionC: q.option_c,
              optionD: q.option_d,
              correctAnswer: q.correct_answer,
            }))

            // Create image preview URLs if images exist
            let part1ImagePreview = null
            let part2ImagePreview = null
            let part3ImagePreview = null
            let part4ImagePreview = null
            let moduleImagePreview = null
            const funfactPreview = null

            if (module.module_image) {
              moduleImagePreview =
                typeof module.module_image === "string"
                  ? module.module_image
                  : `data:image/jpeg;base64,${module.module_image}`
            }

            if (module.part1_image) {
              part1ImagePreview =
                typeof module.part1_image === "string"
                  ? module.part1_image
                  : `data:image/jpeg;base64,${module.part1_image}`
            }

            if (module.part2_image) {
              part2ImagePreview =
                typeof module.part2_image === "string"
                  ? module.part2_image
                  : `data:image/jpeg;base64,${module.part2_image}`
            }

            if (module.part3_image) {
              part3ImagePreview =
                typeof module.part3_image === "string"
                  ? module.part3_image
                  : `data:image/jpeg;base64,${module.part3_image}`
            }

            if (module.part4_image) {
              part4ImagePreview =
                typeof module.part4_image === "string"
                  ? module.part4_image
                  : `data:image/jpeg;base64,${module.part4_image}`
            }

            return {
              id: module.id,
              moduleName: module.module_name,
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
                imagePreview: part1ImagePreview,
              },
              part2: {
                name: module.part2_name || "",
                description: module.part2_description || "",
                image: null,
                imagePreview: part2ImagePreview,
              },
              part3: {
                name: module.part3_name || "",
                description: module.part3_description || "",
                image: null,
                imagePreview: part3ImagePreview,
              },
              part4: {
                name: module.part4_name || "",
                description: module.part4_description || "",
                image: null,
                imagePreview: part4ImagePreview,
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
              numberOfQuiz: quizData.length.toString(),
              quiz: formattedQuiz,
              image: null,
              imagePreview: moduleImagePreview,
              glbFile: null,
              funfact: null,
              funfactPreview: funfactPreview,
            }
          }),
        )

        // Create course image preview if it exists
        let courseImagePreview = null
        if (courseDetails.course_image) {
          courseImagePreview = `data:image/png;base64,${courseDetails.course_image}`
        }

        // Set the course data state
        setCourseData({
          instructorEmail: courseDetails.instructor_email,
          courseName: courseDetails.course_name,
          primaryLanguage: courseDetails.primary_language,
          level: courseDetails.level,
          courseImage: null,
          courseImagePreview: courseImagePreview,
          modules: modulesWithQuiz,
        })

        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching course data:", error)
        alert("Failed to load course data. Please try again.")
        setIsLoading(false)
      }
    }

    if (courseId) {
      fetchCourseData()
    }
  }, [courseId])

  // Handle back navigation
  const handleBack = () => {
    navigate(-1) // Navigate back to the previous page
  }

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCourseData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle file upload
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

  const handleModuleFileUpload = (e, index, type) => {
    const file = e.target.files[0]
    if (file) {
      setCourseData((prev) => ({
        ...prev,
        modules: prev.modules.map((module, i) =>
          i === index
            ? {
                ...module,
                [type]: file,
                [`${type}Preview`]: URL.createObjectURL(file),
              }
            : module,
        ),
      }))
    }
  }

  const handlePartImageUpload = (e, moduleIndex, partNumber) => {
    const file = e.target.files[0]
    if (file) {
      setCourseData((prev) => ({
        ...prev,
        modules: prev.modules.map((module, i) =>
          i === moduleIndex
            ? {
                ...module,
                [`part${partNumber}`]: {
                  ...module[`part${partNumber}`],
                  image: file,
                  imagePreview: URL.createObjectURL(file),
                },
              }
            : module,
        ),
      }))
    }
  }

  // Handle quiz question changes
  const handleQuizChange = (e, moduleIndex, questionIndex, field) => {
    const { value } = e.target
    if (field === "correctAnswer" && !["A", "B", "C", "D"].includes(value)) {
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

  // Handle adding a new module
  const handleAddModule = () => {
    setCourseData((prev) => ({
      ...prev,
      modules: [
        ...prev.modules,
        {
          moduleName: "",
          scientificName: "",
          description: "",
          funfact: null,
          funfactPreview: null,
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
          numberOfQuiz: "",
          quiz: [],
          image: null,
          imagePreview: null,
          glbFile: null,
        },
      ],
    }))
  }

  // Handle removing a module
  const handleRemoveModule = (index) => {
    setCourseData((prev) => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== index),
    }))
  }

  // Handle adding quiz questions
  const handleAddQuiz = (moduleIndex, numberOfQuiz) => {
    const currentQuizLength = courseData.modules[moduleIndex].quiz.length
    const newQuizCount = Number.parseInt(numberOfQuiz, 10)

    if (newQuizCount <= currentQuizLength) {
      const updatedModules = [...courseData.modules]
      updatedModules[moduleIndex].quiz = updatedModules[moduleIndex].quiz.slice(0, newQuizCount)
      setCourseData((prev) => ({
        ...prev,
        modules: updatedModules,
      }))
      return
    }

    const additionalQuestions = Array.from({ length: newQuizCount - currentQuizLength }, () => ({
      question: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: "",
    }))

    setCourseData((prev) => ({
      ...prev,
      modules: prev.modules.map((module, i) =>
        i === moduleIndex
          ? {
              ...module,
              quiz: [...module.quiz, ...additionalQuestions],
            }
          : module,
      ),
    }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
  
    // Validate form data
    if (
      !courseData.instructorEmail ||
      !courseData.courseName ||
      !courseData.primaryLanguage ||
      !courseData.level ||
      courseData.modules.length === 0
    ) {
      alert("Please fill all required course fields and add at least one module.")
      return
    }
  
    for (const module of courseData.modules) {
      if (!module.moduleName || !module.scientificName || !module.description || !module.numberOfQuiz) {
        alert("Please fill all required module fields.")
        return
      }
  
      if (module.quiz && module.quiz.length > 0) {
        for (const question of module.quiz) {
          if (
            !question.question ||
            !question.optionA ||
            !question.optionB ||
            !question.optionC ||
            !question.optionD ||
            !question.correctAnswer
          ) {
            alert("Please fill all required quiz question fields.")
            return
          }
        }
      }
    }
  
    try {
      const formData = new FormData()
  
      console.log("Starting form submission...")
  
      formData.append("courseId", courseId)
      formData.append("instructorEmail", courseData.instructorEmail)
      formData.append("courseName", courseData.courseName)
      formData.append("primaryLanguage", courseData.primaryLanguage)
      formData.append("level", courseData.level)
  
      if (courseData.courseImage) {
        console.log("Adding course image to FormData")
        formData.append("courseImage", courseData.courseImage)
      }
  
      console.log("Modules to process:", courseData.modules.length)
  
      const modulesForSubmit = courseData.modules.map((module) => {
        const moduleCopy = JSON.parse(JSON.stringify(module))
  
        delete moduleCopy.image
        delete moduleCopy.imagePreview
        delete moduleCopy.glbFile
        delete moduleCopy.funfact
        delete moduleCopy.funfactPreview
  
        for (let i = 1; i <= 4; i++) {
          if (moduleCopy[`part${i}`]) {
            delete moduleCopy[`part${i}`].image
            delete moduleCopy[`part${i}`].imagePreview
          }
        }
  
        return moduleCopy
      })
  
      console.log("Prepared modules data structure:", 
                  JSON.stringify(modulesForSubmit).substring(0, 100) + "...")
  
      formData.append("modules", JSON.stringify(modulesForSubmit))
  
      courseData.modules.forEach((module, i) => {
        console.log(`Processing module ${i} files:`, module.moduleName)
  
        if (module.image) {
          console.log(`Adding image for module ${i}`)
          formData.append(`moduleImage_${i}`, module.image)
        }
  
        if (module.glbFile) {
          console.log(`Adding GLB file for module ${i}`)
          formData.append(`moduleGlb_${i}`, module.glbFile)
        }
  
        for (let j = 1; j <= 4; j++) {
          if (module[`part${j}`] && module[`part${j}`].image) {
            console.log(`Adding part${j} image for module ${i}`)
            formData.append(`modulePart${j}_${i}`, module[`part${j}`].image)
          }
        }
      })
  
      for (let pair of formData.entries()) {
        console.log(`FormData contains: ${pair[0]}`)
      }
  
      console.log("Submitting form data to server...")
      const response = await fetch("http://localhost:3000/update-course", {
        method: "POST",
        body: formData,
      })
  
      if (response.ok) {
        alert("Course updated successfully!")
        setCourseData({
          instructorEmail: "",
          courseName: "",
          primaryLanguage: "",
          level: "",
          courseImage: null,
          courseImagePreview: null,
          modules: [],
        })
        window.location.reload()
      } else {
        const errorData = await response.json()
        alert(`Failed to update course: ${errorData.message || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error updating course:", error)
      alert("Error updating course. Please try again.")
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading course data...</div>
  }

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      {/* Use the imported Button component for the Back button */}
      <Button onClick={handleBack}>Back</Button>

      <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Edit Course</h2>

          {/* Instructor Email (Non-editable) */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Instructor Email</label>
            <input
              type="email"
              name="instructorEmail"
              value={courseData.instructorEmail}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-600 rounded-lg bg-gray-200 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-not-allowed"
              placeholder="Enter instructor email"
              readOnly // Make the field non-editable
              required
            />
          </div>

          {/* Course Name */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Course Name</label>
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
            </select>
          </div>

          {/* Primary Language */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Primary Language</label>
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
            </select>
          </div>

          {/* Level */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Level</label>
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
            <label className="block text-sm font-medium text-gray-400 mb-2">Course Image</label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
              <div className="text-center">
                <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                <label className="cursor-pointer">
                  <span className="block mt-2 text-sm text-gray-500">
                    {courseData.courseImage ? courseData.courseImage.name : "Upload a new course image (optional)"}
                  </span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleCourseImageUpload} />
                </label>
              </div>
              {(courseData.courseImagePreview || courseData.courseImage) && (
                <div className="mt-4 text-center">
                  <img
                    src={
                      courseData.courseImage ? URL.createObjectURL(courseData.courseImage) : courseData.courseImagePreview
                    }
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
                  value={module.moduleName}
                  onChange={(e) => {
                    const newModules = [...courseData.modules]
                    newModules[moduleIndex].moduleName = e.target.value
                    setCourseData((prev) => ({ ...prev, modules: newModules }))
                  }}
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
                  value={module.scientificName}
                  onChange={(e) => {
                    const newModules = [...courseData.modules]
                    newModules[moduleIndex].scientificName = e.target.value
                    setCourseData((prev) => ({ ...prev, modules: newModules }))
                  }}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter scientific name"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                <textarea
                  value={module.description}
                  onChange={(e) => {
                    const newModules = [...courseData.modules]
                    newModules[moduleIndex].description = e.target.value
                    setCourseData((prev) => ({ ...prev, modules: newModules }))
                  }}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                  placeholder="Enter module description"
                  required
                ></textarea>
              </div>

              {/* Funfact Image */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Funfact Image</label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
                  <div className="text-center">
                    <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <label className="cursor-pointer">
                      <span className="block mt-2 text-sm text-gray-500">
                        {module.funfact ? module.funfact.name : "Upload a new funfact image (optional)"}
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleModuleFileUpload(e, moduleIndex, "funfact")}
                      />
                    </label>
                  </div>
                  {(module.funfactPreview || module.funfact) && (
                    <div className="mt-4 text-center">
                      <img
                        src={module.funfact ? URL.createObjectURL(module.funfact) : module.funfactPreview}
                        alt="Funfact Preview"
                        className="w-32 h-32 object-cover mx-auto rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Funfact 1 */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Funfact 1</label>
                <input
                  type="text"
                  value={module.funfact1}
                  onChange={(e) => {
                    const newModules = [...courseData.modules]
                    newModules[moduleIndex].funfact1 = e.target.value
                    setCourseData((prev) => ({ ...prev, modules: newModules }))
                  }}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter funfact 1"
                  required
                />
              </div>

              {/* Funfact 2 */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Funfact 2</label>
                <input
                  type="text"
                  value={module.funfact2}
                  onChange={(e) => {
                    const newModules = [...courseData.modules]
                    newModules[moduleIndex].funfact2 = e.target.value
                    setCourseData((prev) => ({ ...prev, modules: newModules }))
                  }}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter funfact 2"
                  required
                />
              </div>

              {/* Funfact 3 */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Funfact 3</label>
                <input
                  type="text"
                  value={module.funfact3}
                  onChange={(e) => {
                    const newModules = [...courseData.modules]
                    newModules[moduleIndex].funfact3 = e.target.value
                    setCourseData((prev) => ({ ...prev, modules: newModules }))
                  }}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter funfact 3"
                  required
                />
              </div>

              {/* Funfact 4 */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Funfact 4</label>
                <input
                  type="text"
                  value={module.funfact4}
                  onChange={(e) => {
                    const newModules = [...courseData.modules]
                    newModules[moduleIndex].funfact4 = e.target.value
                    setCourseData((prev) => ({ ...prev, modules: newModules }))
                  }}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter funfact 4"
                  required
                />
              </div>

              {/* Part 1 */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Part 1 Name</label>
                <input
                  type="text"
                  value={module.part1.name}
                  onChange={(e) => {
                    const newModules = [...courseData.modules]
                    newModules[moduleIndex].part1.name = e.target.value
                    setCourseData((prev) => ({ ...prev, modules: newModules }))
                  }}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter part 1 name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Part 1 Description</label>
                <textarea
                  value={module.part1.description}
                  onChange={(e) => {
                    const newModules = [...courseData.modules]
                    newModules[moduleIndex].part1.description = e.target.value
                    setCourseData((prev) => ({ ...prev, modules: newModules }))
                  }}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                  placeholder="Enter part 1 description"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Part 1 Image</label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
                  <div className="text-center">
                    <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <label className="cursor-pointer">
                      <span className="block mt-2 text-sm text-gray-500">
                        {module.part1.image ? module.part1.image.name : "Upload a new part 1 image (optional)"}
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handlePartImageUpload(e, moduleIndex, 1)}
                      />
                    </label>
                  </div>
                  {(module.part1.imagePreview || module.part1.image) && (
                    <div className="mt-4 text-center">
                      <img
                        src={module.part1.image ? URL.createObjectURL(module.part1.image) : module.part1.imagePreview}
                        alt="Part 1 Preview"
                        className="w-32 h-32 object-cover mx-auto rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Part 2 */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Part 2 Name</label>
                <input
                  type="text"
                  value={module.part2.name}
                  onChange={(e) => {
                    const newModules = [...courseData.modules]
                    newModules[moduleIndex].part2.name = e.target.value
                    setCourseData((prev) => ({ ...prev, modules: newModules }))
                  }}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter part 2 name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Part 2 Description</label>
                <textarea
                  value={module.part2.description}
                  onChange={(e) => {
                    const newModules = [...courseData.modules]
                    newModules[moduleIndex].part2.description = e.target.value
                    setCourseData((prev) => ({ ...prev, modules: newModules }))
                  }}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                  placeholder="Enter part 2 description"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Part 2 Image</label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
                  <div className="text-center">
                    <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <label className="cursor-pointer">
                      <span className="block mt-2 text-sm text-gray-500">
                        {module.part2.image ? module.part2.image.name : "Upload a new part 2 image (optional)"}
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handlePartImageUpload(e, moduleIndex, 2)}
                      />
                    </label>
                  </div>
                  {(module.part2.imagePreview || module.part2.image) && (
                    <div className="mt-4 text-center">
                      <img
                        src={module.part2.image ? URL.createObjectURL(module.part2.image) : module.part2.imagePreview}
                        alt="Part 2 Preview"
                        className="w-32 h-32 object-cover mx-auto rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Part 3 */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Part 3 Name</label>
                <input
                  type="text"
                  value={module.part3.name}
                  onChange={(e) => {
                    const newModules = [...courseData.modules]
                    newModules[moduleIndex].part3.name = e.target.value
                    setCourseData((prev) => ({ ...prev, modules: newModules }))
                  }}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter part 3 name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Part 3 Description</label>
                <textarea
                  value={module.part3.description}
                  onChange={(e) => {
                    const newModules = [...courseData.modules]
                    newModules[moduleIndex].part3.description = e.target.value
                    setCourseData((prev) => ({ ...prev, modules: newModules }))
                  }}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                  placeholder="Enter part 3 description"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Part 3 Image</label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
                  <div className="text-center">
                    <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <label className="cursor-pointer">
                      <span className="block mt-2 text-sm text-gray-500">
                        {module.part3.image ? module.part3.image.name : "Upload a new part 3 image (optional)"}
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handlePartImageUpload(e, moduleIndex, 3)}
                      />
                    </label>
                  </div>
                  {(module.part3.imagePreview || module.part3.image) && (
                    <div className="mt-4 text-center">
                      <img
                        src={module.part3.image ? URL.createObjectURL(module.part3.image) : module.part3.imagePreview}
                        alt="Part 3 Preview"
                        className="w-32 h-32 object-cover mx-auto rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Part 4 */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Part 4 Name</label>
                <input
                  type="text"
                  value={module.part4.name}
                  onChange={(e) => {
                    const newModules = [...courseData.modules]
                    newModules[moduleIndex].part4.name = e.target.value
                    setCourseData((prev) => ({ ...prev, modules: newModules }))
                  }}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter part 4 name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Part 4 Description</label>
                <textarea
                  value={module.part4.description}
                  onChange={(e) => {
                    const newModules = [...courseData.modules]
                    newModules[moduleIndex].part4.description = e.target.value
                    setCourseData((prev) => ({ ...prev, modules: newModules }))
                  }}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                  placeholder="Enter part 4 description"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Part 4 Image</label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
                  <div className="text-center">
                    <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <label className="cursor-pointer">
                      <span className="block mt-2 text-sm text-gray-500">
                        {module.part4.image ? module.part4.image.name : "Upload a new part 4 image (optional)"}
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handlePartImageUpload(e, moduleIndex, 4)}
                      />
                    </label>
                  </div>
                  {(module.part4.imagePreview || module.part4.image) && (
                    <div className="mt-4 text-center">
                      <img
                        src={module.part4.image ? URL.createObjectURL(module.part4.image) : module.part4.imagePreview}
                        alt="Part 4 Preview"
                        className="w-32 h-32 object-cover mx-auto rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Benefit 1 */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Benefit 1 Name</label>
                <input
                  type="text"
                  value={module.benefit1.name}
                  onChange={(e) => {
                    const newModules = [...courseData.modules]
                    newModules[moduleIndex].benefit1.name = e.target.value
                    setCourseData((prev) => ({ ...prev, modules: newModules }))
                  }}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter benefit 1 name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Benefit 1 Description</label>
                <textarea
                  value={module.benefit1.description}
                  onChange={(e) => {
                    const newModules = [...courseData.modules]
                    newModules[moduleIndex].benefit1.description = e.target.value
                    setCourseData((prev) => ({ ...prev, modules: newModules }))
                  }}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                  placeholder="Enter benefit 1 description"
                  required
                ></textarea>
              </div>

              {/* Benefit 2 */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Benefit 2 Name</label>
                <input
                  type="text"
                  value={module.benefit2.name}
                  onChange={(e) => {
                    const newModules = [...courseData.modules]
                    newModules[moduleIndex].benefit2.name = e.target.value
                    setCourseData((prev) => ({ ...prev, modules: newModules }))
                  }}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter benefit 2 name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Benefit 2 Description</label>
                <textarea
                  value={module.benefit2.description}
                  onChange={(e) => {
                    const newModules = [...courseData.modules]
                    newModules[moduleIndex].benefit2.description = e.target.value
                    setCourseData((prev) => ({ ...prev, modules: newModules }))
                  }}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                  placeholder="Enter benefit 2 description"
                  required
                ></textarea>
              </div>

              {/* Benefit 3 */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Benefit 3 Name</label>
                <input
                  type="text"
                  value={module.benefit3.name}
                  onChange={(e) => {
                    const newModules = [...courseData.modules]
                    newModules[moduleIndex].benefit3.name = e.target.value
                    setCourseData((prev) => ({ ...prev, modules: newModules }))
                  }}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter benefit 3 name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Benefit 3 Description</label>
                <textarea
                  value={module.benefit3.description}
                  onChange={(e) => {
                    const newModules = [...courseData.modules]
                    newModules[moduleIndex].benefit3.description = e.target.value
                    setCourseData((prev) => ({ ...prev, modules: newModules }))
                  }}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                  placeholder="Enter benefit 3 description"
                  required
                ></textarea>
              </div>

              {/* Benefit 4 */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Model Name</label>
                <input
                  type="text"
                  value={module.benefit4.name}
                  onChange={(e) => {
                    const newModules = [...courseData.modules]
                    newModules[moduleIndex].benefit4.name = e.target.value
                    setCourseData((prev) => ({ ...prev, modules: newModules }))
                  }}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Provide SketchFab Link for VR</label>
                <textarea
                  value={module.benefit4.description}
                  onChange={(e) => {
                    const newModules = [...courseData.modules]
                    newModules[moduleIndex].benefit4.description = e.target.value
                    setCourseData((prev) => ({ ...prev, modules: newModules }))
                  }}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                  placeholder="Enter Sketchfab Link"
                  required
                ></textarea>
              </div>

              {/* Module Image */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Module Image</label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
                  <div className="text-center">
                    <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <label className="cursor-pointer">
                      <span className="block mt-2 text-sm text-gray-500">
                        {module.image ? module.image.name : "Upload a new module image (optional)"}
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleModuleFileUpload(e, moduleIndex, "image")}
                      />
                    </label>
                  </div>
                  {(module.imagePreview || module.image) && (
                    <div className="mt-4 text-center">
                      <img
                        src={module.image ? URL.createObjectURL(module.image) : module.imagePreview}
                        alt="Module Preview"
                        className="w-32 h-32 object-cover mx-auto rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Module GLB File */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Module GLB File</label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
                  <div className="text-center">
                    <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <label className="cursor-pointer">
                      <span className="block mt-2 text-sm text-gray-500">
                        {module.glbFile ? module.glbFile.name : "Upload a new GLB file (optional)"}
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".glb"
                        onChange={(e) => handleModuleFileUpload(e, moduleIndex, "glbFile")}
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
                <label className="block text-sm font-medium text-gray-400 mb-2">Number of Quiz</label>
                <input
                  type="number"
                  value={module.numberOfQuiz}
                  onChange={(e) => {
                    const newModules = [...courseData.modules]
                    newModules[moduleIndex].numberOfQuiz = e.target.value
                    setCourseData((prev) => ({ ...prev, modules: newModules }))
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
                Update Quiz Questions
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
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Option A</label>
                    <input
                      type="text"
                      value={question.optionA}
                      onChange={(e) => handleQuizChange(e, moduleIndex, questionIndex, "optionA")}
                      className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Enter option A"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Option B</label>
                    <input
                      type="text"
                      value={question.optionB}
                      onChange={(e) => handleQuizChange(e, moduleIndex, questionIndex, "optionB")}
                      className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Enter option B"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Option C</label>
                    <input
                      type="text"
                      value={question.optionC}
                      onChange={(e) => handleQuizChange(e, moduleIndex, questionIndex, "optionC")}
                      className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Enter option C"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Option D</label>
                    <input
                      type="text"
                      value={question.optionD}
                      onChange={(e) => handleQuizChange(e, moduleIndex, questionIndex, "optionD")}
                      className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Enter option D"
                      required
                    />
                  </div>

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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg shadow-md transition duration-200"
          >
            Update Course
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditCourse