

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp, Clock, BookOpen, Award, Calendar, ArrowLeft, X, Brain, Target, Zap, Check, AlertTriangle } from "lucide-react";

// Enhanced logger implementation with memory to prevent duplicate logs
const createLogger = () => {
  // Store previously logged messages to avoid duplicates
  const logHistory = new Set();
  
  // Reset log history periodically to prevent memory leaks
  setInterval(() => logHistory.clear(), 300000); // Clear every 5 minutes
  
  return {
    error: (message, data) => {
      // Always log errors regardless of duplication
      // eslint-disable-next-line no-console
      console.error(`[ERROR] ${message}`, data);
    },
    warn: (message) => {
      const key = `WARN:${message}`;
      if (!logHistory.has(key)) {
        logHistory.add(key);
        // eslint-disable-next-line no-console
        console.warn(`[WARN] ${message}`);
      }
    },
    info: (message, data) => {
      const key = `INFO:${message}${data ? JSON.stringify(data) : ''}`;
      if (!logHistory.has(key)) {
        logHistory.add(key);
        // eslint-disable-next-line no-console
        console.info(`[INFO] ${message}`, data || '');
      }
    }
  };
};

const logger = createLogger();

const ResultsPage = () => {
  const [results, setResults] = useState([]);
  const [activeQuestions, setActiveQuestions] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const fetchedRef = useRef(false);
    
  useEffect(() => {
    if (!user || !user.id) {
      logger.warn("No user found in localStorage");
      return;
    }

    // Only fetch results once
    if (fetchedRef.current) return;

    const fetchResults = async () => {
      const API_URL="https://tests-backend-yiwk.onrender.com";
      try {
        const res = await axios.get(`{API_URL}/api/results/${user.id}`);
        setResults(res.data);
        logger.info(`Fetched ${res.data.length} results for user ID: ${user.id}`);
        fetchedRef.current = true;
      } catch (err) {
        logger.error("Error fetching results:", err);
      }
    };

    fetchResults();
  }, [user]);

  const openQuestions = (questions) => {
    setActiveQuestions(questions);
    logger.info(`Opened questions modal with ${questions.length} questions`);
  };

  const closeModal = () => {
    setActiveQuestions(null);
    logger.info("Closed questions modal");
  };

  const toggleExpand = (idx) => {
    const newState = expandedCard === idx ? null : idx;
    setExpandedCard(newState);
    logger.info(`Toggled card ${idx} to ${newState === null ? 'collapsed' : 'expanded'}`);
  };

  // Function to get grade and color based on score
  const getGradeInfo = (score, total) => {
    const percentage = (score / total) * 100;
    
    if (percentage >= 90) return { grade: "A+", color: "bg-green-500" };
    if (percentage >= 80) return { grade: "A", color: "bg-green-400" };
    if (percentage >= 70) return { grade: "B", color: "bg-blue-500" };
    if (percentage >= 60) return { grade: "C", color: "bg-yellow-500" };
    if (percentage >= 50) return { grade: "D", color: "bg-orange-500" };
    return { grade: "F", color: "bg-red-500" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header with animated background */}
      <div className="max-w-5xl mx-auto mb-12">
        <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8">
          <div className="absolute inset-0 bg-grid-white/10 transform rotate-12"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-white flex items-center justify-center">
              <Award className="mr-3 animate-pulse" size={36} />
              Your Test History
              <Award className="ml-3 animate-pulse" size={36} />
            </h2>
            <p className="text-blue-100 text-center mt-3 max-w-2xl mx-auto">
              Track your progress and review your past performance to identify areas for improvement
            </p>
          </div>
          <div className="absolute -bottom-6 -right-6 h-32 w-32 bg-yellow-300 rounded-full opacity-20 blur-xl"></div>
          <div className="absolute -top-6 -left-6 h-32 w-32 bg-blue-300 rounded-full opacity-20 blur-xl"></div>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="max-w-5xl mx-auto text-center p-12 bg-white rounded-xl shadow-xl">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Brain size={64} className="text-gray-400" />
            <p className="text-xl text-gray-500 font-medium">No test history found.</p>
            <p className="text-gray-400">Take your first test to see your results here!</p>
            <Link to="/create-test" 
              className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center">
              <Zap size={18} className="mr-2" />
              Take Your First Test
            </Link>
          </div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto grid grid-cols-1 gap-8">
          {results.map((r, idx) => {
            const { grade, color } = getGradeInfo(r.score, r.total);
            const scorePercentage = ((r.score / r.total) * 100).toFixed(1);
            const isExpanded = expandedCard === idx;
            
            return (
              <div 
                key={idx} 
                className={`bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 ${isExpanded ? 'scale-102' : ''}`}
              >
                {/* Card Header with Score */}
                <div className="flex flex-col sm:flex-row items-center bg-gradient-to-r from-gray-50 to-gray-100 p-4 cursor-pointer"
                     onClick={() => toggleExpand(idx)}>
                  <div className="flex-shrink-0 flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-inner mb-4 sm:mb-0 sm:mr-6">
                    <div className={`w-16 h-16 rounded-full ${color} flex items-center justify-center text-white font-bold text-xl shadow-md`}>
                      {grade}
                    </div>
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex flex-wrap items-center justify-between">
                      <div className="mb-2 sm:mb-0">
                        <p className="text-lg font-semibold text-gray-800">
                          {r.subjects.join(" & ")}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(r.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric'
                          })}
                        </p>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="text-center mr-4">
                          <p className="text-sm text-gray-500">Score</p>
                          <p className="font-bold text-xl text-gray-800">{scorePercentage}%</p>
                        </div>
                        <button className="p-2 rounded-full hover:bg-gray-200">
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-6 py-4 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left Column */}
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <BookOpen size={18} className="text-blue-500 mr-2" />
                          <span className="text-gray-600 font-medium">Subjects:</span>
                          <span className="ml-2 text-gray-800">{r.subjects.join(", ")}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <Target size={18} className="text-purple-500 mr-2" />
                          <span className="text-gray-600 font-medium">Chapters:</span>
                          <span className="ml-2 text-gray-800">{r.chapters.join(", ")}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <Zap size={18} className="text-yellow-500 mr-2" />
                          <span className="text-gray-600 font-medium">Difficulty:</span>
                          <span className="ml-2 text-gray-800">{r.difficulty}</span>
                        </div>
                      </div>
                      
                      {/* Right Column */}
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Check size={18} className="text-green-500 mr-2" />
                          <span className="text-gray-600 font-medium">Score:</span>
                          <span className="ml-2 text-gray-800">{r.score} / {r.total}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <Clock size={18} className="text-red-500 mr-2" />
                          <span className="text-gray-600 font-medium">Time Taken:</span>
                          <span className="ml-2 text-gray-800">{r.timeTaken} seconds</span>
                        </div>
                        
                        <div className="flex items-center">
                          <Calendar size={18} className="text-indigo-500 mr-2" />
                          <span className="text-gray-600 font-medium">Date:</span>
                          <span className="ml-2 text-gray-800">{new Date(r.date).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-6">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Performance</span>
                        <span className="font-medium">{scorePercentage}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${color} transition-all duration-1000 ease-out`} 
                          style={{ width: `${scorePercentage}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* View Questions Button */}
                    {r.questions?.length > 0 && (
                      <div className="mt-6 flex justify-center">
                        <button
                          onClick={() => openQuestions(r.questions)}
                          className="group relative px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow hover:shadow-lg transform hover:translate-y-px transition-all duration-200 flex items-center"
                        >
                          <span className="mr-2">View Questions</span>
                          <ChevronDown size={18} className="group-hover:translate-y-px transition-transform duration-200" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for Questions */}
      {activeQuestions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center sticky top-0">
              <h3 className="text-xl font-bold text-white flex items-center">
                <Brain size={20} className="mr-2" /> Question Details
              </h3>
              <button 
                onClick={closeModal} 
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="overflow-y-auto p-6 space-y-6 flex-grow">
              {activeQuestions.map((q, qIndex) => {
                const isCorrect = q.selected === q.correct;
                const optionLabels = ["A", "B", "C", "D"];

                return (
                  <div key={qIndex} className="bg-gray-50 rounded-xl p-6 shadow-md">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-indigo-100 text-indigo-800 font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3">
                        {qIndex + 1}
                      </div>
                      <div className="flex-grow">
                        <p className="text-lg font-medium text-gray-800 mb-4">{q.question}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                          {q.options.map((opt, i) => {
                            let bgColor = "bg-gray-100 hover:bg-gray-200";
                            let textColor = "text-gray-800";
                            let borderColor = "border-transparent";
                            
                            if (opt === q.correct && opt === q.selected) {
                              bgColor = "bg-green-100";
                              textColor = "text-green-800";
                              borderColor = "border-green-500";
                            } else if (opt === q.correct) {
                              bgColor = "bg-green-100";
                              textColor = "text-green-800";
                              borderColor = "border-green-500";
                            } else if (opt === q.selected) {
                              bgColor = "bg-red-100";
                              textColor = "text-red-800";
                              borderColor = "border-red-500";
                            }
                            
                            return (
                              <div
                                key={i}
                                className={`${bgColor} ${textColor} rounded-lg p-3 border-2 ${borderColor} transition-colors flex items-start`}
                              >
                                <div className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center mr-2 flex-shrink-0">
                                  <span className="font-medium text-sm">{optionLabels[i]}</span>
                                </div>
                                <span>{opt}</span>
                              </div>
                            );
                          })}
                        </div>
                        
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center">
                            <span className="text-gray-600 font-medium mr-2">Your Answer:</span>
                            <span className={isCorrect ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                              {q.selected || "Not Answered"}
                              {isCorrect ? (
                                <Check size={16} className="inline ml-1" />
                              ) : (
                                <AlertTriangle size={16} className="inline ml-1" />
                              )}
                            </span>
                          </div>
                          
                          <div className="flex items-center">
                            <span className="text-gray-600 font-medium mr-2">Correct Answer:</span>
                            <span className="text-green-600 font-medium">{q.correct}</span>
                          </div>
                        </div>
                        
                        {q.description && (
                          <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                            <p className="text-sm text-gray-800">
                              <span className="font-medium">Explanation:</span>{" "}
                              {q.description}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      
      {/* Back Button */}
      <div className="max-w-5xl mx-auto mt-8 flex justify-center">
        <Link 
          to="/create-test" 
          className="group px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center"
        >
          <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Test Selection
        </Link>
      </div>
    </div>
  );
};

export default ResultsPage;