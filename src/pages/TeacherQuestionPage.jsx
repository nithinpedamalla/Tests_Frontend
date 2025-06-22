import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
const logger = {
  info: (message, ...args) => {
    if (process.env.NODE_ENV !== 'production') {
      console.info(`[INFO] ${message}`, ...args);
    }
  },
  error: (message, ...args) => {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[ERROR] ${message}`, ...args);
    }
  },
  warn: (message, ...args) => {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[WARN] ${message}`, ...args);
    }
  },
  debug: (message, ...args) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }
};
function TeacherQuestionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get selections from localStorage if not available in location state
  const selectedClass = location.state?.class || localStorage.getItem("selectedClass");
  const selectedSubjects = location.state?.subjects || 
    JSON.parse(localStorage.getItem("selectedSubjects") || "[]");
  const selectedChapters = location.state?.chapters || 
    JSON.parse(localStorage.getItem("selectedChapters") || "[]");

  // State variables
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [viewMode, setViewMode] = useState("single"); // "single" or "all"
  const [editMode, setEditMode] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  
  // New question/edited question state
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correct: "",
    subject: "",
    chapter: "",
    description: "",
    class: "",
    difficultyLevel: "Medium"
  });

  // Create refs for question elements to scroll to them
  const questionRefs = useRef({});

  // Check if we have valid selections
  useEffect(() => {
    if (!selectedClass || selectedSubjects.length === 0 || selectedChapters.length === 0) {
      alert("Missing selection data. Please select class, subjects, and chapters first.");
      navigate("/test-preparation");
    } else {
      fetchQuestions();
    }
  }, [selectedClass, selectedSubjects, selectedChapters, navigate]);

  // Scroll to current question when index changes in "all" view mode
  useEffect(() => {
    if (viewMode === "all" && questionRefs.current[currentQuestionIndex]) {
      questionRefs.current[currentQuestionIndex].scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }, [currentQuestionIndex, viewMode]);

  // Update current question when index changes or after loading
  useEffect(() => {
    if (!loading && questions.length > 0 && currentQuestionIndex < questions.length) {
      setCurrentQuestion(questions[currentQuestionIndex]);
    }
  }, [loading, questions, currentQuestionIndex]);

  // Fetch questions based on selections
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/questions", {
        class: selectedClass,
        subjects: selectedSubjects,
        chapters: selectedChapters
      });
      
      if (response.data && response.data.length > 0) {
        setQuestions(response.data);
        setCurrentQuestion(response.data[0]);
      } else {
        alert("No questions found for the selected criteria.");
        setQuestions([]);
      }
    } catch (error) {
      logger.error("Error fetching questions:", error);
  alert("Failed to load questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Navigate between questions
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setEditMode(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setEditMode(false);
    }
  };

  // Toggle view mode between single question and all questions
  const toggleViewMode = () => {
    setViewMode(viewMode === "single" ? "all" : "single");
    setEditMode(false);
  };

  // Handle exit
  const handleExit = () => {
    navigate("/upload");
  };

  // Edit mode handlers
  const toggleEditMode = () => {
    setEditMode(!editMode);
    setIsAddingNew(false);
  };

  // Start adding a new question
  const startAddNew = () => {
    setIsAddingNew(true);
    setEditMode(true);
    setCurrentQuestion({
      question: "",
      options: ["", "", "", ""],
      correct: "",
      subject: selectedSubjects[0] || "",
      chapter: selectedChapters[0] || "",
      description: "",
      class: selectedClass || "",
      difficultyLevel: "Medium"
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentQuestion({
      ...currentQuestion,
      [name]: value
    });
  };

  // Handle option changes
  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({
      ...currentQuestion,
      options: newOptions
    });
  };

  // Add a new option
  const addOption = () => {
    setCurrentQuestion({
      ...currentQuestion,
      options: [...currentQuestion.options, ""]
    });
  };

  // Remove an option
  const removeOption = (index) => {
    if (currentQuestion.options.length <= 2) {
      alert("A question must have at least 2 options.");
      return;
    }
    
    const newOptions = [...currentQuestion.options];
    newOptions.splice(index, 1);
    
    // Adjust the correct answer if it was the removed option
    let adjustedCorrect = currentQuestion.correct;
    if (currentQuestion.correct === currentQuestion.options[index]) {
      adjustedCorrect = "";
    }
    
    setCurrentQuestion({
      ...currentQuestion,
      options: newOptions,
      correct: adjustedCorrect
    });
  };

  // Save the question (create new or update existing)
  const saveQuestion = async () => {
    // Validate form
    if (!currentQuestion.question || !currentQuestion.class || 
        !currentQuestion.subject || !currentQuestion.chapter || 
        !currentQuestion.difficultyLevel || !currentQuestion.correct) {
      alert("Please fill in all required fields.");
      return;
    }
    
    // Check if all options have values
    if (currentQuestion.options.some(opt => !opt)) {
      alert("All options must have values.");
      return;
    }
    
    // Make sure the correct answer is one of the options
    if (!currentQuestion.options.includes(currentQuestion.correct)) {
      alert("The correct answer must be one of the options.");
      return;
    }
    
    try {
      setLoading(true);
      
      if (isAddingNew) {
        // Create new question
        const response = await axios.post("http://localhost:5000/api/questions/add", currentQuestion);
        if (response.data) {
          alert("Question created successfully!");
          // Refresh questions
          await fetchQuestions();
          // Go to the new question (assuming it's at the end)
          setCurrentQuestionIndex(questions.length);
        }
      } else {
        // Update existing question
        const response = await axios.put(
          `http://localhost:5000/api/questions/${currentQuestion._id}`, 
          currentQuestion
        );
        if (response.data) {
          alert("Question updated successfully!");
          // Update local questions array
          const updatedQuestions = [...questions];
          updatedQuestions[currentQuestionIndex] = currentQuestion;
          setQuestions(updatedQuestions);
        }
      }
      
      // Exit edit mode
      setEditMode(false);
      setIsAddingNew(false);
      
    } catch (error) {
      logger.error("Error saving question:", error);
      alert("Failed to save question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Delete the current question
  const deleteQuestion = async () => {
    if (!window.confirm("Are you sure you want to delete this question? This action cannot be undone.")) {
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await axios.delete(
        `http://localhost:5000/api/questions/${currentQuestion._id}`
      );
      
      if (response.data) {
        alert("Question deleted successfully!");
        // Remove from local array
        const updatedQuestions = questions.filter(q => q._id !== currentQuestion._id);
        setQuestions(updatedQuestions);
        
        // Adjust current index if needed
        if (currentQuestionIndex >= updatedQuestions.length) {
          setCurrentQuestionIndex(Math.max(0, updatedQuestions.length - 1));
        }
        
        // If we deleted all questions
        if (updatedQuestions.length === 0) {
          setCurrentQuestion({
            question: "",
            options: ["", "", "", ""],
            correct: "",
            subject: selectedSubjects[0] || "",
            chapter: selectedChapters[0] || "",
            description: "",
            class: selectedClass || "",
            difficultyLevel: "Medium"
          });
        }
      }
    } catch (error) {
      logger.error("Error deleting question:", error);
      alert("Failed to delete question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Render question view (read-only mode)
  const renderQuestionView = (question) => {
    return (
      <>
        {/* Subject and chapter info */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium shadow-sm">
            {question.subject}
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium shadow-sm">
            {question.chapter}
          </span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium shadow-sm">
            {question.difficultyLevel}
          </span>
        </div>
        
        {/* Question text */}
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-800">
            {question.question}
          </h2>
          {question.image && (
            <div className="mt-3">
              <img 
                src={question.image} 
                alt="Question" 
                className="max-w-full max-h-64 rounded-lg shadow-md" 
              />
            </div>
          )}
        </div>
        
        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isCorrect = option === question.correct;
            
            return (
              <div 
                key={index}
                className={`p-3 border rounded-lg ${
                  isCorrect ? "border-green-500 bg-green-50" : "border-gray-200"
                } transition-all duration-200`}
              >
                <div className="flex items-center">
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center mr-3 font-medium ${
                    isCorrect ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <div className="text-gray-800">{option}</div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Description */}
        {question.description && (
          <div className="mt-6 p-4 rounded-lg shadow-sm bg-blue-50">
            <p className="font-medium text-blue-700">Explanation:</p>
            <p className="mt-1 text-gray-700">{question.description}</p>
          </div>
        )}
      </>
    );
  };

  // Render question edit form
  const renderQuestionEditForm = () => {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Question Text *
          </label>
          <textarea
            name="question"
            value={currentQuestion.question}
            onChange={handleInputChange}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Options *
          </label>
          {currentQuestion.options.map((option, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="flex-grow p-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                placeholder={`Option ${String.fromCharCode(65 + index)}`}
                required
              />
              <button
                type="button"
                onClick={() => removeOption(index)}
                className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-2 rounded-r-md transition-colors duration-200"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addOption}
            className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
          >
            Add Option
          </button>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Correct Answer *
          </label>
          <select
            name="correct"
            value={currentQuestion.correct}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select correct answer</option>
            {currentQuestion.options.map((option, index) => (
              option && (
                <option key={index} value={option}>
                  {String.fromCharCode(65 + index)}: {option}
                </option>
              )
            ))}
          </select>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class *
            </label>
            <input
              type="text"
              name="class"
              value={currentQuestion.class}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty Level *
            </label>
            <select
              name="difficultyLevel"
              value={currentQuestion.difficultyLevel}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject *
            </label>
            <input
              type="text"
              name="subject"
              value={currentQuestion.subject}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chapter *
            </label>
            <input
              type="text"
              name="chapter"
              value={currentQuestion.chapter}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Explanation
          </label>
          <textarea
            name="description"
            value={currentQuestion.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Provide an explanation for the correct answer"
          />
        </div>
        
        <div className="flex space-x-2 pt-4">
          <button
            type="button"
            onClick={saveQuestion}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
          >
            {isAddingNew ? "Create Question" : "Save Changes"}
          </button>
          
          <button
            type="button"
            onClick={() => {
              setEditMode(false);
              setIsAddingNew(false);
              // Reset to original state if editing
              if (!isAddingNew && questions[currentQuestionIndex]) {
                setCurrentQuestion(questions[currentQuestionIndex]);
              }
            }}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  // Render a single question (for "all" view mode)
  const renderQuestion = (question, index) => {
    const isCurrentQuestion = currentQuestionIndex === index;
    
    return (
      <div 
        key={question._id}
        ref={element => questionRefs.current[index] = element}
        className={`bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-6 mb-4 ${
          isCurrentQuestion ? "border-2 border-blue-500" : ""
        } hover:shadow-lg transition-shadow duration-300`}
        onClick={() => {
          setCurrentQuestionIndex(index);
          setEditMode(false);
          setIsAddingNew(false);
        }}
      >
        <div className="flex justify-between mb-4">
          <span className="font-medium text-blue-700">Question {index + 1}</span>
          {isCurrentQuestion && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
              Current
            </span>
          )}
        </div>
        
        {/* Subject and chapter info */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium shadow-sm">
            {question.subject}
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium shadow-sm">
            {question.chapter}
          </span>
        </div>
        
        {/* Question text (shortened version) */}
        <div className="mb-4">
          <p className="text-gray-800 line-clamp-2">
            {question.question}
          </p>
        </div>
        
        {/* First two options */}
        <div className="space-y-2">
          {question.options.slice(0, 2).map((option, optIndex) => {
            const isCorrect = option === question.correct;
            
            return (
              <div 
                key={optIndex}
                className={`p-2 border rounded-lg ${
                  isCorrect ? "border-green-500 bg-green-50" : "border-gray-200"
                } transition-all duration-200`}
              >
                <div className="flex items-center">
                  <div className={`h-5 w-5 rounded-full flex items-center justify-center mr-2 text-sm ${
                    isCorrect ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {String.fromCharCode(65 + optIndex)}
                  </div>
                  <div className="text-gray-800 text-sm line-clamp-1">{option}</div>
                </div>
              </div>
            );
          })}
          
          {question.options.length > 2 && (
            <div className="text-sm text-gray-500 italic">
              +{question.options.length - 2} more options
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen flex items-center justify-center">
        <div className="text-xl text-blue-600 font-medium animate-pulse">Loading questions...</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with action buttons */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-4 mb-4 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-blue-800 mr-4">Question Management</h1>
            <button
              onClick={toggleViewMode}
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 mr-2"
            >
              {viewMode === "single" ? "Show All Questions" : "Show One Question"}
            </button>
            <button
              onClick={startAddNew}
              className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Add New Question
            </button>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={handleExit}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Exit
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-12 gap-4">
          {/* Questions section */}
          <div className="col-span-12 lg:col-span-9">
            {/* Single question view */}
            {viewMode === "single" && !isAddingNew && questions.length > 0 && (
              <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-between mb-4">
                  <h2 className="text-xl font-bold text-blue-800">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </h2>
                  <div className="flex space-x-2">
                    {!editMode && (
                      <>
                        <button
                          onClick={toggleEditMode}
                          className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={deleteQuestion}
                          className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                {editMode ? renderQuestionEditForm() : renderQuestionView(currentQuestion)}
                
                {/* Navigation buttons */}
                {!editMode && (
                  <div className="flex justify-between mt-6">
                    <button
                      onClick={handlePrevQuestion}
                      disabled={currentQuestionIndex === 0}
                      className={`px-4 py-2 rounded-md ${
                        currentQuestionIndex === 0
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors duration-200'
                      }`}
                    >
                      Previous
                    </button>
                    <button
                      onClick={handleNextQuestion}
                      disabled={currentQuestionIndex === questions.length - 1}
                      className={`px-4 py-2 rounded-md ${
                        currentQuestionIndex === questions.length - 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors duration-200'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {/* Add new question form */}
            {isAddingNew && (
              <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-between mb-4">
                  <h2 className="text-xl font-bold text-green-800">
                    Create New Question
                  </h2>
                </div>
                
                {renderQuestionEditForm()}
              </div>
            )}
            
            {/* No questions message */}
            {!isAddingNew && questions.length === 0 && (
              <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-6 mb-4 text-center">
                <p className="text-gray-600 mb-4">No questions found for the selected criteria.</p>
                <button
                  onClick={startAddNew}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
                >
                  Create Your First Question
                </button>
              </div>
            )}
            
            {/* All questions view */}
            {viewMode === "all" && (
              <div>
                <h2 className="text-xl font-bold text-blue-800 mb-4">
                  All Questions ({questions.length})
                </h2>
                {questions.map((question, index) => renderQuestion(question, index))}
              </div>
            )}
          </div>
          
          {/* Side panel with filters and stats */}
          <div className="col-span-12 lg:col-span-3">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-4 sticky top-20">
              <h3 className="font-medium text-gray-700 mb-3">Selection</h3>
              
              <div className="space-y-2 mb-6">
                <div className="bg-blue-50 p-2 rounded">
                  <p className="text-sm text-gray-600">Class:</p>
                  <p className="font-medium text-blue-700">{selectedClass}</p>
                </div>
                
                <div className="bg-purple-50 p-2 rounded">
                  <p className="text-sm text-gray-600">Subject(s):</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedSubjects.map((subject, i) => (
                      <span key={i} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="bg-indigo-50 p-2 rounded">
                  <p className="text-sm text-gray-600">Chapter(s):</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedChapters.map((chapter, i) => (
                      <span key={i} className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs">
                        {chapter}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              {questions.length > 0 && (
                <>
                  <h3 className="font-medium text-gray-700 mb-3">Statistics</h3>
                  
                  {/* Difficulty breakdown */}
                  <div className="mb-6">
                    <h4 className="text-sm text-gray-600 mb-2">Difficulty Levels:</h4>
                    
                    {/* Calculate counts for each difficulty */}
                    {(() => {
                      const counts = {
                        Easy: questions.filter(q => q.difficultyLevel === "Easy").length,
                        Medium: questions.filter(q => q.difficultyLevel === "Medium").length,
                        Hard: questions.filter(q => q.difficultyLevel === "Hard").length
                      };
                      
                      return (
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-green-600 text-sm">Easy</span>
                            <span className="text-green-600 font-medium">{counts.Easy}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-yellow-600 text-sm">Medium</span>
                            <span className="text-yellow-600 font-medium">{counts.Medium}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-red-600 text-sm">Hard</span>
                            <span className="text-red-600 font-medium">{counts.Hard}</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                  
                  {/* Chapter breakdown */}
                  <div className="mb-6">
                    <h4 className="text-sm text-gray-600 mb-2">By Chapter:</h4>
                    
                    {/* Calculate counts per chapter */}
                    {(() => {
                      const chapterCounts = {};
                      questions.forEach(q => {
                        chapterCounts[q.chapter] = (chapterCounts[q.chapter] || 0) + 1;
                      });
                      
                      return (
                        <div className="space-y-1 max-h-40 overflow-y-auto pr-2">
                          {Object.entries(chapterCounts).map(([chapter, count]) => (
                            <div key={chapter} className="flex justify-between">
                              <span className="text-gray-600 text-sm truncate flex-1">{chapter}</span>
                              <span className="text-blue-600 font-medium ml-2">{count}</span>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                </>
              )}
              
              {/* Quick actions */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="font-medium text-gray-700 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={startAddNew}
                    className="w-full bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add New Question
                  </button>
                  
                  {viewMode === "single" && !isAddingNew && questions.length > 0 && (
                    <button
                      onClick={toggleEditMode}
                      className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      {editMode ? "Cancel Editing" : "Edit Current Question"}
                    </button>
                  )}
                  
                  <button
                    onClick={handleExit}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Return to Selection
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherQuestionPage;