import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
function TestPreparationRequirements() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(() => localStorage.getItem("selectedClass") || "");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState(() => {
    const saved = localStorage.getItem("selectedSubjects");
    return saved ? JSON.parse(saved) : [];
  });
  const [subjectChapters, setSubjectChapters] = useState({});
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const [selectedChapters, setSelectedChapters] = useState(() => {
    const saved = localStorage.getItem("selectedChapters");
    return saved ? JSON.parse(saved) : [];
  });
  
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // Helper function to generate a test session ID (for clearing data)
  const getTestSessionId = (cls, subjs, chaps) => {
    return `test_${cls}_${subjs.join('_')}_${chaps.join('_')}`;
  };

  // Fetch classes when component mounts
  useEffect(() => {
    axios.get("http://localhost:5000/api/classes")
      .then((res) => setClasses(res.data))
      .catch((err) => logger.error("Error fetching classes:", err));
  }, []);

  // Fetch subjects when class changes
  useEffect(() => {
    if (selectedClass) {
      localStorage.setItem("selectedClass", selectedClass);
      axios.post("http://localhost:5000/api/subjects", { class: selectedClass })
        .then((res) => {
          setSubjects(res.data);
        })
        .catch((err) => logger.error("Error fetching subjects:", err));
    }
  }, [selectedClass]);

  // Save selected subjects to localStorage
  useEffect(() => {
    localStorage.setItem("selectedSubjects", JSON.stringify(selectedSubjects));
    
    // Clean up selectedChapters when subjects are deselected
    const validChapters = selectedChapters.filter(chapter => {
      return selectedSubjects.some(subject => 
        subjectChapters[subject] && subjectChapters[subject].includes(chapter)
      );
    });
    
    if (JSON.stringify(validChapters) !== JSON.stringify(selectedChapters)) {
      setSelectedChapters(validChapters);
    }
  }, [selectedSubjects, subjectChapters, selectedChapters]);

  // Save selected chapters to localStorage
  useEffect(() => {
    localStorage.setItem("selectedChapters", JSON.stringify(selectedChapters));
  }, [selectedChapters]);

  const handleClassChange = (newClass) => {
    setSelectedClass(newClass);
    setSelectedSubjects([]);
    setSelectedChapters([]);
    setSubjectChapters({});
    setExpandedSubjects({});
    
    localStorage.removeItem("selectedSubjects");
    localStorage.removeItem("selectedChapters");
  };

  const handleSubjectToggle = async (subject) => {
    const isSelected = selectedSubjects.includes(subject);

    if (isSelected) {
      // Remove subject from selection
      setSelectedSubjects(prev => prev.filter(s => s !== subject));
      
      // Remove all chapters of this subject from selected chapters
      if (subjectChapters[subject]) {
        setSelectedChapters(prev => 
          prev.filter(chapter => !subjectChapters[subject].includes(chapter))
        );
      }
    } else {
      // Add subject to selection
      setSelectedSubjects(prev => [...prev, subject]);
      
      // Fetch chapters for this subject if not already loaded
      if (!subjectChapters[subject]) {
        try {
          const res = await axios.post("http://localhost:5000/api/chapters", {
            class: selectedClass,
            subjects: [subject]
          });
          setSubjectChapters(prev => ({
            ...prev,
            [subject]: res.data
          }));
          
          // Auto-expand the subject when selected
          setExpandedSubjects(prev => ({
            ...prev,
            [subject]: true
          }));
        } catch (err) {
          logger.error("Error fetching chapters:", err);
        }
      } else {
        // Just expand the already loaded subject
        setExpandedSubjects(prev => ({
          ...prev,
          [subject]: true
        }));
      }
    }
  };

  const toggleSubjectExpansion = async (subject) => {
    // Toggle expansion state
    setExpandedSubjects(prev => ({
      ...prev,
      [subject]: !prev[subject]
    }));
    
    // If expanding and chapters not loaded yet, fetch them
    if (!expandedSubjects[subject] && !subjectChapters[subject]) {
      try {
        const res = await axios.post("http://localhost:5000/api/chapters", {
          class: selectedClass,
          subjects: [subject]
        });
        setSubjectChapters(prev => ({
          ...prev,
          [subject]: res.data
        }));
      } catch (err) {
        logger.error("Error fetching chapters:", err);
      }
    }
  };

  const handleChapterToggle = (chapter) => {
    if (selectedChapters.includes(chapter)) {
      setSelectedChapters(prev => prev.filter(c => c !== chapter));
    } else {
      setSelectedChapters(prev => [...prev, chapter]);
    }
  };

  const handleSelectAllChapters = (subject) => {
    if (!subjectChapters[subject]) return;
    
    const chaptersToAdd = subjectChapters[subject].filter(
      chapter => !selectedChapters.includes(chapter)
    );
    
    if (chaptersToAdd.length > 0) {
      setSelectedChapters(prev => [...prev, ...chaptersToAdd]);
    } else {
      // If all chapters are already selected, deselect all chapters for this subject
      setSelectedChapters(prev => 
        prev.filter(chapter => !subjectChapters[subject].includes(chapter))
      );
    }
  };

  const isValidSelection = () => {
    // Check if at least one subject is selected
    if (selectedSubjects.length === 0) return false;
    
    // Check if at least one chapter is selected for each selected subject
    return selectedSubjects.every(subject => {
      const subjectChapterList = subjectChapters[subject] || [];
      return subjectChapterList.some(chapter => selectedChapters.includes(chapter));
    });
  };

  // Clear any existing test data for the current selection
  const clearExistingTestData = () => {
    const testSessionId = getTestSessionId(selectedClass, selectedSubjects, selectedChapters);
    
    // Remove all test-related data from localStorage
    localStorage.removeItem(`${testSessionId}_questions`);
    localStorage.removeItem(`${testSessionId}_userAnswers`);
    localStorage.removeItem(`${testSessionId}_feedback`);
    localStorage.removeItem(`${testSessionId}_currentIndex`);
    localStorage.removeItem(`${testSessionId}_viewMode`);
  };

  const handleContinue = () => {
    if (!isValidSelection()) {
      alert("Please select at least one chapter for each selected subject.");
      return;
    }
    
    // Save selections to localStorage
    localStorage.setItem("selectedClass", selectedClass);
    localStorage.setItem("selectedSubjects", JSON.stringify(selectedSubjects));
    localStorage.setItem("selectedChapters", JSON.stringify(selectedChapters));
    
    // Clear any existing test data for this selection
    clearExistingTestData();
    
    // Navigate to the test page
    navigate("/test-page", {
      state: {
        class: selectedClass,
        subjects: selectedSubjects,
        chapters: selectedChapters,
        freshStart: true // Flag to indicate this is a fresh start
      }
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
          Select Content
        </h1>
        
        {/* Class Selection */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-semibold text-blue-700 mb-3 flex items-center">
            <div className="bg-blue-100 text-blue-700 w-7 h-7 rounded-full flex items-center justify-center mr-2">
              <span>1</span>
            </div>
            Select Class
          </h2>
          <select 
            onChange={(e) => handleClassChange(e.target.value)} 
            value={selectedClass}
            className="w-full border border-blue-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a Class</option>
            {classes.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>
        
        {/* Subjects Selection */}
        {subjects.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-xl font-semibold text-blue-700 mb-3 flex items-center">
              <div className="bg-blue-100 text-blue-700 w-7 h-7 rounded-full flex items-center justify-center mr-2">
                <span>2</span>
              </div>
              Select Subjects and Chapters
            </h2>
            
            <div className="space-y-4">
              {subjects.map((subject) => (
                <div 
                  key={subject} 
                  className={`p-4 rounded-md border transition-all ${
                    selectedSubjects.includes(subject) 
                      ? "border-blue-500 bg-blue-50" 
                      : "border-gray-300 bg-white hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedSubjects.includes(subject)}
                        onChange={() => handleSubjectToggle(subject)}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-gray-800 font-medium">{subject}</span>
                    </label>
                    
                    <div className="flex space-x-2">
                      {selectedSubjects.includes(subject) && (
                        <button
                          onClick={() => handleSelectAllChapters(subject)}
                          className="px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded"
                        >
                          {subjectChapters[subject] && 
                           subjectChapters[subject].every(ch => selectedChapters.includes(ch)) 
                            ? "Deselect All" 
                            : "Select All"}
                        </button>
                      )}
                      
                      <button
                        onClick={() => toggleSubjectExpansion(subject)}
                        className={`px-3 py-1 rounded transition-colors ${
                          expandedSubjects[subject] 
                            ? "bg-blue-500 text-white" 
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {expandedSubjects[subject] ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>
                  
                  {/* Chapters Section */}
                  {expandedSubjects[subject] && (
                    <div className="mt-4 pl-8">
                      {subjectChapters[subject] ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {subjectChapters[subject].map((chapter) => (
                            <label 
                              key={chapter} 
                              className={`flex items-center p-2 rounded cursor-pointer ${
                                selectedChapters.includes(chapter) 
                                  ? "bg-blue-100" 
                                  : "hover:bg-gray-100"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={selectedChapters.includes(chapter)}
                                onChange={() => handleChapterToggle(chapter)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-gray-700">{chapter}</span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <span className="animate-pulse">Loading chapters...</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Selection Summary */}
        {selectedSubjects.length > 0 && (
          <div className="mb-6 p-4 bg-green-50 rounded-lg">
            <h3 className="text-lg font-medium text-green-700 mb-2">Your Selection:</h3>
            <div className="space-y-3">
              {/* Class Badge */}
              {selectedClass && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Class:</span>
                  <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {selectedClass}
                  </span>
                </div>
              )}
              
              {/* Subject Badges */}
              {selectedSubjects.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Subjects:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedSubjects.map(subject => (
                      <span key={subject} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Chapter Count */}
              {selectedChapters.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Selected Chapters:</span>
                  <span className="ml-2 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                    {selectedChapters.length} chapter{selectedChapters.length !== 1 ? 's' : ''}
                  </span>
                  
                  {/* Chapter List (Collapsible) */}
                  <details className="mt-2">
                    <summary className="cursor-pointer text-blue-600 text-sm">
                      Show chapter details
                    </summary>
                    <div className="mt-2 pl-4 flex flex-wrap gap-1">
                      {selectedChapters.map(chapter => (
                        <span key={chapter} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {chapter}
                        </span>
                      ))}
                    </div>
                  </details>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button 
            onClick={() => navigate("/")}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-md font-medium transition-colors duration-200"
          >
            Back
          </button>
          <button
            onClick={handleContinue}
            disabled={!isValidSelection()}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors duration-200 ${
              !isValidSelection()
                ? "bg-blue-200 text-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default TestPreparationRequirements;