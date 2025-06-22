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


function TestPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get selections from localStorage if not available in location state
  const selectedClass = location.state?.class || localStorage.getItem("selectedClass");
  const selectedSubjects = location.state?.subjects || 
    JSON.parse(localStorage.getItem("selectedSubjects") || "[]");
  const selectedChapters = location.state?.chapters || 
    JSON.parse(localStorage.getItem("selectedChapters") || "[]");

  // Generate a unique test session ID based on selections
  const getTestSessionId = () => {
    return `test_${selectedClass}_${selectedSubjects.join('_')}_${selectedChapters.join('_')}`;
  };
  
  const testSessionId = getTestSessionId();

  // State with localStorage persistence
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState(() => {
    const saved = localStorage.getItem(`${testSessionId}_questions`);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
    const saved = localStorage.getItem(`${testSessionId}_currentIndex`);
    return saved ? parseInt(saved) : 0;
  });
  
  const [userAnswers, setUserAnswers] = useState(() => {
    const saved = localStorage.getItem(`${testSessionId}_userAnswers`);
    return saved ? JSON.parse(saved) : {};
  });
  
  const [answerFeedback, setAnswerFeedback] = useState(() => {
    const saved = localStorage.getItem(`${testSessionId}_feedback`);
    return saved ? JSON.parse(saved) : {};
  });
  
  const [viewMode, setViewMode] = useState(() => {
    const saved = localStorage.getItem(`${testSessionId}_viewMode`);
    return saved || "single"; // "single" or "all"
  });

  // Create refs for question elements to scroll to them
  const questionRefs = useRef({});

  // Check if we have valid selections
  useEffect(() => {
    if (!selectedClass || selectedSubjects.length === 0 || selectedChapters.length === 0) {
      alert("Missing selection data. Please select class, subjects, and chapters first.");
      navigate("/test-preparation");
    } else {
      // Only fetch questions if we don't have them already
      if (questions.length === 0) {
        fetchQuestions();
      } else {
        setLoading(false);
      }
    }
  }, [selectedClass, selectedSubjects, selectedChapters, navigate, questions.length]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (questions.length > 0) {
      localStorage.setItem(`${testSessionId}_questions`, JSON.stringify(questions));
    }
  }, [questions, testSessionId]);

  useEffect(() => {
    localStorage.setItem(`${testSessionId}_currentIndex`, currentQuestionIndex.toString());
  }, [currentQuestionIndex, testSessionId]);

  useEffect(() => {
    localStorage.setItem(`${testSessionId}_userAnswers`, JSON.stringify(userAnswers));
  }, [userAnswers, testSessionId]);

  useEffect(() => {
    localStorage.setItem(`${testSessionId}_feedback`, JSON.stringify(answerFeedback));
  }, [answerFeedback, testSessionId]);

  useEffect(() => {
    localStorage.setItem(`${testSessionId}_viewMode`, viewMode);
  }, [viewMode, testSessionId]);

  // Scroll to current question when index changes in "all" view mode
  useEffect(() => {
    if (viewMode === "all" && questionRefs.current[currentQuestionIndex]) {
      questionRefs.current[currentQuestionIndex].scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }, [currentQuestionIndex, viewMode]);

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
        // Process the questions to match our component's expected format
        const processedQuestions = response.data.map(q => {
          // Find the index of the correct option
          const correctOptionIndex = q.options.findIndex(opt => opt === q.correct);
          
          return {
            ...q,
            correctOption: correctOptionIndex, // Store the index of the correct option
            explanation: q.description // Map description to explanation for our UI
          };
        });
        setQuestions(processedQuestions);
      } else {
        alert("No questions found for the selected criteria.");
        navigate("/test-preparation");
      }
    } catch (error) {
      logger.error("Error fetching questions:", error);
      alert("Failed to load questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle answer selection
  const handleAnswerSelect = (questionId, optionIndex) => {
    // Find the question
    const question = questions.find(q => q._id === questionId);
    
    // Set user answer
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
    
    // Set feedback
    setAnswerFeedback(prev => ({
      ...prev,
      [questionId]: {
        isCorrect: optionIndex === question.correctOption,
        correctOption: question.correctOption
      }
    }));
  };

  // Navigate between questions
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Toggle view mode between single question and all questions
  const toggleViewMode = () => {
    setViewMode(viewMode === "single" ? "all" : "single");
  };

  // Reset test progress
  const resetProgress = () => {
    if (window.confirm("Are you sure you want to reset your progress? All your answers will be cleared.")) {
      setUserAnswers({});
      setAnswerFeedback({});
      setCurrentQuestionIndex(0);
      
      // Clear localStorage for this test session
      localStorage.removeItem(`${testSessionId}_userAnswers`);
      localStorage.removeItem(`${testSessionId}_feedback`);
      localStorage.removeItem(`${testSessionId}_currentIndex`);
    }
  };

  // Handle exit and cleanup
  const handleExit = () => {
    if (window.confirm("Do you want to save your progress before exiting?")) {
      // Progress is already saved in localStorage
      navigate("/test-preparation");
    } else {
      // Clear test data from localStorage
      localStorage.removeItem(`${testSessionId}_questions`);
      localStorage.removeItem(`${testSessionId}_userAnswers`);
      localStorage.removeItem(`${testSessionId}_feedback`);
      localStorage.removeItem(`${testSessionId}_currentIndex`);
      localStorage.removeItem(`${testSessionId}_viewMode`);
      navigate("/test-preparation");
    }
  };

  // Render a single question with its options
  const renderQuestion = (question, index) => {
    const questionId = question._id;
    const feedback = answerFeedback[questionId];
    const isCurrentQuestion = currentQuestionIndex === index;
    
    return (
      <div 
        key={questionId}
        ref={element => questionRefs.current[index] = element}
        className={`bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-6 mb-4 ${viewMode === "all" ? "" : "hidden"} ${isCurrentQuestion && viewMode === "single" ? "block" : ""} hover:shadow-lg transition-shadow duration-300`}
      >
        {/* Subject and chapter info */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium shadow-sm">
            {question.subject}
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium shadow-sm">
            {question.chapter}
          </span>
        </div>
        
        {/* Question without numbering */}
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
          {question.options.map((option, optIndex) => {
            let optionClass = "border-gray-200 hover:border-blue-300 hover:bg-blue-50";
            
            if (userAnswers[questionId] === optIndex) {
              optionClass = feedback?.isCorrect 
                ? "border-green-500 bg-green-50" 
                : "border-red-500 bg-red-50";
            } else if (feedback && feedback.correctOption === optIndex) {
              optionClass = "border-green-500 bg-green-50";
            }
            
            return (
              <div 
                key={optIndex}
                onClick={() => {
                  if (userAnswers[questionId] === undefined) {
                    handleAnswerSelect(questionId, optIndex);
                  }
                }}
                className={`p-3 border rounded-lg ${
                  userAnswers[questionId] === undefined ? "cursor-pointer" : "cursor-default"
                } ${optionClass} transition-all duration-200 hover:shadow-md`}
              >
                <div className="flex items-center">
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center mr-3 font-medium ${
                    userAnswers[questionId] === optIndex
                      ? feedback?.isCorrect 
                        ? 'bg-green-600 text-white'
                        : 'bg-red-600 text-white'
                      : feedback && feedback.correctOption === optIndex
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-600'
                  }`}>
                    {String.fromCharCode(65 + optIndex)}
                  </div>
                  <div className="text-gray-800">{option}</div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Feedback */}
        {feedback && (
          <div className={`mt-6 p-4 rounded-lg shadow-sm ${
            feedback.isCorrect ? "bg-green-100" : "bg-red-100"
          }`}>
            <p className={`font-medium ${
              feedback.isCorrect ? "text-green-700" : "text-red-700"
            }`}>
              {feedback.isCorrect 
                ? "Correct! Good job!" 
                : `Incorrect. The correct answer is ${String.fromCharCode(65 + feedback.correctOption)}: ${question.options[feedback.correctOption]}`
              }
            </p>
            {question.explanation && (
              <div className="mt-2 text-gray-700">
                <p className="font-medium">Explanation:</p>
                <p className="mt-1">{question.explanation}</p>
              </div>
            )}
          </div>
        )}
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

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header without question count */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-4 mb-4 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center">
            <button
              onClick={toggleViewMode}
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
            >
              {viewMode === "single" ? "Show All Questions" : "Show One Question"}
            </button>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={resetProgress}
              className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Reset Progress
            </button>
            <button 
              onClick={handleExit}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Exit Practice
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-12 gap-4">
          {/* Questions and answers */}
          <div className="col-span-12 lg:col-span-8">
            {viewMode === "single" ? (
              // Single question view
              <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow duration-300">
                {/* Subject and chapter info */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium shadow-sm">
                    {currentQuestion.subject}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium shadow-sm">
                    {currentQuestion.chapter}
                  </span>
                  {/* <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium shadow-sm">
                    {currentQuestion.difficultyLevel}
                  </span> */}
                </div>
                
                {/* Question text without numbering */}
                <div className="mb-6">
                  <h2 className="text-lg font-medium text-gray-800">
                    {currentQuestion.question}
                  </h2>
                  {currentQuestion.image && (
                    <div className="mt-3">
                      <img 
                        src={currentQuestion.image} 
                        alt="Question" 
                        className="max-w-full max-h-64 rounded-lg shadow-md" 
                      />
                    </div>
                  )}
                </div>
                
                {/* Options */}
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => {
                    const currentQuestionId = currentQuestion._id;
                    const currentFeedback = answerFeedback[currentQuestionId];
                    
                    let optionClass = "border-gray-200 hover:border-blue-300 hover:bg-blue-50";
                    
                    if (userAnswers[currentQuestionId] === index) {
                      optionClass = currentFeedback?.isCorrect 
                        ? "border-green-500 bg-green-50" 
                        : "border-red-500 bg-red-50";
                    } else if (currentFeedback && currentFeedback.correctOption === index) {
                      optionClass = "border-green-500 bg-green-50";
                    }
                    
                    return (
                      <div 
                        key={index}
                        onClick={() => {
                          if (userAnswers[currentQuestionId] === undefined) {
                            handleAnswerSelect(currentQuestionId, index);
                          }
                        }}
                        className={`p-3 border rounded-lg ${
                          userAnswers[currentQuestionId] === undefined ? "cursor-pointer" : "cursor-default"
                        } ${optionClass} transition-all duration-200 hover:shadow-md`}
                      >
                        <div className="flex items-center">
                          <div className={`h-6 w-6 rounded-full flex items-center justify-center mr-3 font-medium ${
                            userAnswers[currentQuestionId] === index
                              ? currentFeedback?.isCorrect 
                                ? 'bg-green-600 text-white'
                                : 'bg-red-600 text-white'
                              : currentFeedback && currentFeedback.correctOption === index
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-100 text-gray-600'
                          }`}>
                            {String.fromCharCode(65 + index)}
                          </div>
                          <div className="text-gray-800">{option}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Feedback */}
                {answerFeedback[currentQuestion._id] && (
                  <div className={`mt-6 p-4 rounded-lg shadow-sm ${
                    answerFeedback[currentQuestion._id].isCorrect ? "bg-green-100" : "bg-red-100"
                  }`}>
                    <p className={`font-medium ${
                      answerFeedback[currentQuestion._id].isCorrect ? "text-green-700" : "text-red-700"
                    }`}>
                      {answerFeedback[currentQuestion._id].isCorrect 
                        ? "Correct! Good job!" 
                        : `Incorrect. The correct answer is ${String.fromCharCode(65 + answerFeedback[currentQuestion._id].correctOption)}: ${currentQuestion.options[answerFeedback[currentQuestion._id].correctOption]}`
                      }
                    </p>
                    {currentQuestion.explanation && (
                      <div className="mt-2 text-gray-700">
                        <p className="font-medium">Explanation:</p>
                        <p className="mt-1">{currentQuestion.explanation}</p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Navigation buttons without question count */}
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
              </div>
            ) : (
              // All questions view 
              <div>
                {questions.map((question, index) => renderQuestion(question, index))}
                {/* Navigation buttons when in all questions view - without showing current/total */}
                <div className="sticky bottom-4 flex justify-center mt-6">
                  <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-full px-4 py-2 flex space-x-4">
                    <button
                      onClick={handlePrevQuestion}
                      disabled={currentQuestionIndex === 0}
                      className={`px-4 py-2 rounded-full ${
                        currentQuestionIndex === 0
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors duration-200'
                      }`}
                    >
                      ←
                    </button>
                    <button
                      onClick={handleNextQuestion}
                      disabled={currentQuestionIndex === questions.length - 1}
                      className={`px-4 py-2 rounded-full ${
                        currentQuestionIndex === questions.length - 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors duration-200'
                      }`}
                    >
                      →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Side panel without question count */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-4 sticky top-20">
              <div className="mt-6 text-sm">
                <div className="flex items-center mb-2">
                  <div className="h-4 w-4 rounded-full bg-green-100 border border-green-300 mr-2"></div>
                  <span className="text-gray-600">Correct</span>
                </div>
                <div className="flex items-center mb-2">
                  <div className="h-4 w-4 rounded-full bg-red-100 border border-red-300 mr-2"></div>
                  <span className="text-gray-600">Incorrect</span>
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded-full bg-gray-100 border border-gray-300 mr-2"></div>
                  <span className="text-gray-600">Unattempted</span>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 font-medium">Progress</span>
                  <span className="text-blue-600 font-medium">
                    {Object.keys(userAnswers).length} answers
                  </span>
                </div>
                {/* Progress bar without showing percentage that would reveal total */}
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  {/* Progress bar has no width hints now */}
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${(Object.keys(userAnswers).length > 0) ? "50%" : "0%"}` }}
                  ></div>
                </div>
              </div>
              
              {/* Summary of correct/incorrect answers without percentages */}
              {Object.keys(answerFeedback).length > 0 && (
                <div className="mt-6 pt-4 border-t">
                  <h4 className="font-medium text-gray-700 mb-3">Your Performance</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-green-50 p-3 rounded-lg text-center shadow-sm">
                      <div className="text-xl font-bold text-green-600">
                        {Object.values(answerFeedback).filter(f => f.isCorrect).length}
                      </div>
                      <div className="text-sm text-green-700">Correct</div>
                    </div>
                    
                    <div className="bg-red-50 p-3 rounded-lg text-center shadow-sm">
                      <div className="text-xl font-bold text-red-600">
                        {Object.values(answerFeedback).filter(f => !f.isCorrect).length}
                      </div>
                      <div className="text-sm text-red-700">Incorrect</div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Session information */}
              <div className="mt-6 pt-4 border-t text-sm text-gray-500">
                <p>Test session data is automatically saved.</p>
                <p>You can safely reload the page or return later.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestPage;