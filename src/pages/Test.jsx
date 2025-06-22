// import { useLocation, useNavigate } from "react-router-dom";
// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { v4 as uuidv4 } from "uuid";

// const Test = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [questions, setQuestions] = useState([]);
//   const [answers, setAnswers] = useState({});
//   const [timeLeft, setTimeLeft] = useState(0);
//   const [submitted, setSubmitted] = useState(false);
//   const [score, setScore] = useState(0);
//   const [totalTime, setTotalTime] = useState(0);
//   const [showDescriptions, setShowDescriptions] = useState({});
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [showAllQuestions, setShowAllQuestions] = useState(false);
//   const timerRef = useRef(null);
//   const [testId, setTestId] = useState("");

//   useEffect(() => {
//     const stored = localStorage.getItem("submittedTest");
//     const state = location.state;

//     if (stored && state) {
//       const parsed = JSON.parse(stored);
//       const sameParams = JSON.stringify(parsed.locationState) === JSON.stringify(state);

//       if (sameParams) {
//         setQuestions(parsed.questions);
//         setAnswers(parsed.answers);
//         setScore(parsed.score);
//         setTotalTime(parsed.totalTime);
//         setTimeLeft(parsed.timeLeft);
//         setShowDescriptions(parsed.showDescriptions || {});
//         setSubmitted(true);
//         setTestId(parsed.test_id || "");
//         return;
//       }
//     }

//     const fetchQuestions = async () => {
//       const { class: className, subjects, chapters, difficulty, limit } = state || {};
//       try {
//         const res = await axios.post("http://localhost:5000/test", {
//           class: className,
//           subjects,
//           chapters,
//           difficulty,
//           limit,
//         });

//         setQuestions(res.data);
//         setTimeLeft(limit * 60);
//         setTotalTime(limit * 60);
//         setTestId(uuidv4());
//       } catch (err) {
//         console.error("Failed to load questions", err);
//       }
//     };

//     if (state) {
//       localStorage.removeItem("submittedTest");
//       fetchQuestions();
//     }

//     return () => clearTimeout(timerRef.current);
//   }, [location.state]);

//   useEffect(() => {
//     if (timeLeft > 0 && !submitted) {
//       timerRef.current = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
//     } else if (timeLeft === 0 && questions.length > 0 && !submitted) {
//       handleSubmit();
//     }
//   }, [timeLeft]);

//   const handleOptionChange = (questionIndex, selectedOption) => {
//     setAnswers((prev) => ({
//       ...prev,
//       [questionIndex]: selectedOption,
//     }));
//   };

//   const toggleDescription = (index) => {
//     setShowDescriptions((prev) => ({
//       ...prev,
//       [index]: !prev[index],
//     }));
//   };

//   const allQuestionsAnswered = () => {
//     return questions.length > 0 && questions.every((_, index) => answers[index] !== undefined);
//   };

//   const handleSubmit = async () => {
//     clearTimeout(timerRef.current);
//     setSubmitted(true);

//     let tempScore = 0;
//     questions.forEach((q, index) => {
//       if (answers[index] === q.correct) {
//         tempScore += 1;
//       }
//     });
//     setScore(tempScore);

//     const timeTaken = totalTime - timeLeft;

//     const subjects = Array.isArray(location.state.subjects)
//       ? location.state.subjects
//       : [location.state.subjects];

//     const chapters = Array.isArray(location.state.chapters)
//       ? location.state.chapters
//       : [location.state.chapters];

//     const questionDetails = questions.map((q, index) => ({
//       question: q.question,
//       options: q.options,
//       correct: q.correct,
//       selected: answers[index],
//       description: q.description,
//     }));

//     try {
//       const user = JSON.parse(localStorage.getItem("user"));
//       await axios.post("http://localhost:5000/submit-result", {
//         userId: user.id,
//         result: {
//           test_id: testId,
//           subjects,
//           chapters,
//           difficulty: location.state.difficulty,
//           score: tempScore,
//           total: questions.length,
//           timeTaken,
//           date: new Date(),
//           questions: questionDetails,
//         },
//       });
//     } catch (err) {
//       console.error("Failed to submit result:", err);
//     }

//     localStorage.setItem(
//       "submittedTest",
//       JSON.stringify({
//         test_id: testId,
//         questions,
//         answers,
//         score: tempScore,
//         totalTime,
//         timeLeft,
//         showDescriptions,
//         locationState: location.state,
//       })
//     );
//   };

//   const formatTime = (seconds) => {
//     const min = Math.floor(seconds / 60);
//     const sec = seconds % 60;
//     return `${min}:${sec.toString().padStart(2, "0")}`;
//   };

//   const goToNextQuestion = () => {
//     if (currentQuestion < questions.length - 1) {
//       setCurrentQuestion(currentQuestion + 1);
//     }
//   };

//   const goToPrevQuestion = () => {
//     if (currentQuestion > 0) {
//       setCurrentQuestion(currentQuestion - 1);
//     }
//   };

//   const goToQuestion = (index) => {
//     setCurrentQuestion(index);
//   };

//   const getStatusClass = (index) => {
//     if (submitted) {
//       const isCorrect = answers[index] === questions[index]?.correct;
//       if (isCorrect) return "bg-green-500 text-white";
//       else if (answers[index]) return "bg-red-500 text-white";
//       return "bg-gray-300";
//     } else {
//       return answers[index] ? "bg-blue-500 text-white" : "bg-gray-200";
//     }
//   };

//   // Calculate percentage of questions answered
//   const answeredCount = Object.keys(answers).length;
//   const progressPercentage = questions.length > 0 
//     ? Math.round((answeredCount / questions.length) * 100) 
//     : 0;

//   // Warning color for timer based on time left
//   const getTimerColor = () => {
//     if (timeLeft < totalTime * 0.25) return "text-red-600";
//     if (timeLeft < totalTime * 0.5) return "text-yellow-600";
//     return "text-green-600";
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header with timer and test info */}
//       <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
//         <div className="container mx-auto p-4 flex justify-between items-center">
//           <div className="flex items-center">
//             <h1 className="text-2xl font-bold text-blue-800">JEE Practice Test</h1>
//             {location.state && (
//               <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
//                 {location.state.difficulty} Level
//               </span>
//             )}
//           </div>
          
//           {!submitted && questions.length > 0 && (
//             <div className={`flex items-center space-x-2 ${getTimerColor()} font-bold text-lg`}>
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <span>{formatTime(timeLeft)}</span>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="container mx-auto p-4 flex flex-col lg:flex-row">
//         {/* Left sidebar with question navigation */}
//         <div className="w-full lg:w-1/4 lg:pr-4 mb-4 lg:mb-0">
//           <div className="bg-white p-4 rounded-lg shadow">
//             <div className="mb-4">
//               <h2 className="font-bold text-gray-700 mb-2">Question Navigator</h2>
//               <div className="flex flex-wrap gap-2">
//                 {questions.map((_, index) => (
//                   <button
//                     key={index}
//                     onClick={() => goToQuestion(index)}
//                     className={`h-8 w-8 flex items-center justify-center rounded-md font-medium 
//                       ${currentQuestion === index ? "ring-2 ring-blue-600" : ""} 
//                       ${getStatusClass(index)}`}
//                   >
//                     {index + 1}
//                   </button>
//                 ))}
//               </div>
//             </div>
            
//             <div className="border-t pt-4">
//               <h2 className="font-bold text-gray-700">Summary</h2>
//               <div className="mt-2 space-y-2">
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-600">Answered</span>
//                   <span className="text-sm font-medium">{answeredCount}/{questions.length}</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div 
//                     className="bg-blue-600 h-2 rounded-full" 
//                     style={{ width: `${progressPercentage}%` }}
//                   ></div>
//                 </div>
//                 {!submitted && (
//                   <div className="py-2">
//                     <button
//                       onClick={() => {
//                         if (!allQuestionsAnswered()) {
//                           if (confirm("You haven't answered all questions. Do you still want to submit?")) {
//                             handleSubmit();
//                           }
//                         } else {
//                           handleSubmit();
//                         }
//                       }}
//                       className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-medium transition-colors"
//                     >
//                       Submit Test
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
            
//             <div className="mt-4 border-t pt-4">
//               <div className="flex items-center space-x-2 text-sm">
//                 <div className="flex items-center">
//                   <div className="h-3 w-3 bg-blue-500 rounded-full mr-1"></div>
//                   <span>Answered</span>
//                 </div>
//                 {submitted && (
//                   <>
//                     <div className="flex items-center">
//                       <div className="h-3 w-3 bg-green-500 rounded-full mr-1"></div>
//                       <span>Correct</span>
//                     </div>
//                     <div className="flex items-center">
//                       <div className="h-3 w-3 bg-red-500 rounded-full mr-1"></div>
//                       <span>Incorrect</span>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Main content area */}
//         <div className="w-full lg:w-3/4">
//           <div className="bg-white rounded-lg shadow p-6">
//             {/* Toggle view mode */}
//             {questions.length > 0 && (
//               <div className="mb-6">
//                 <button
//                   onClick={() => setShowAllQuestions(!showAllQuestions)}
//                   className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
//                 >
//                   {showAllQuestions ? (
//                     <>
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                       </svg>
//                       Show One Question at a Time
//                     </>
//                   ) : (
//                     <>
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
//                       </svg>
//                       Show All Questions
//                     </>
//                   )}
//                 </button>
//               </div>
//             )}

//             {/* Question section */}
//             {questions.length > 0 ? (
//               showAllQuestions ? (
//                 // All questions view
//                 questions.map((q, index) => (
//                   <QuestionCard
//                     key={index}
//                     question={q}
//                     index={index}
//                     selected={answers[index]}
//                     submitted={submitted}
//                     handleOptionChange={handleOptionChange}
//                     toggleDescription={toggleDescription}
//                     showDescription={showDescriptions[index]}
//                   />
//                 ))
//               ) : (
//                 // Single question view
//                 <>
//                   {questions[currentQuestion] && (
//                     <QuestionCard
//                       question={questions[currentQuestion]}
//                       index={currentQuestion}
//                       selected={answers[currentQuestion]}
//                       submitted={submitted}
//                       handleOptionChange={handleOptionChange}
//                       toggleDescription={toggleDescription}
//                       showDescription={showDescriptions[currentQuestion]}
//                     />
//                   )}
                  
//                   <div className="flex justify-between mt-8">
//                     <button
//                       onClick={goToPrevQuestion}
//                       disabled={currentQuestion === 0}
//                       className={`flex items-center space-x-1 px-4 py-2 rounded ${
//                         currentQuestion === 0
//                           ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                           : "bg-blue-100 text-blue-700 hover:bg-blue-200"
//                       }`}
//                     >
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                         <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
//                       </svg>
//                       <span>Previous</span>
//                     </button>
                    
//                     <div className="text-center text-gray-700">
//                       <span className="font-bold">{currentQuestion + 1}</span> of {questions.length}
//                     </div>
                    
//                     <button
//                       onClick={goToNextQuestion}
//                       disabled={currentQuestion === questions.length - 1}
//                       className={`flex items-center space-x-1 px-4 py-2 rounded ${
//                         currentQuestion === questions.length - 1
//                           ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                           : "bg-blue-100 text-blue-700 hover:bg-blue-200"
//                       }`}
//                     >
//                       <span>Next</span>
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                         <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
//                       </svg>
//                     </button>
//                   </div>
//                 </>
//               )
//             ) : (
//               <div className="text-center py-12">
//                 <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
//                 <p className="mt-4 text-gray-600">Loading questions...</p>
//               </div>
//             )}

//             {/* Results section */}
//             {submitted && (
//               <div className="mt-8 pt-6 border-t">
//                 <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 text-center">
//                   <div className="text-2xl font-bold text-blue-800">
//                     🎓 Test Completed
//                   </div>
//                   <div className="text-3xl font-bold text-green-700 mt-4">
//                     Score: {score}/{questions.length}
//                   </div>
//                   <div className="text-gray-600 mt-2">
//                     Time taken: {formatTime(totalTime - timeLeft)}
//                   </div>
                  
//                   <div className="w-full max-w-md mx-auto mt-6 bg-gray-200 rounded-full h-4">
//                     <div 
//                       className={`h-4 rounded-full ${
//                         (score / questions.length) >= 0.7 ? "bg-green-500" : 
//                         (score / questions.length) >= 0.4 ? "bg-yellow-500" : "bg-red-500"
//                       }`} 
//                       style={{ width: `${(score / questions.length) * 100}%` }}
//                     ></div>
//                   </div>
                  
//                   <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
//                     <button
//                       onClick={() =>
//                         navigate("/report", {
//                           state: {
//                             test_id: testId,
//                             subjects: location.state.subjects,
//                             chapters: location.state.chapters,
//                             totalQuestions: questions.length,
//                             correctAnswers: score,
//                             timeTaken: totalTime - timeLeft,
//                           },
//                         })
//                       }
//                       className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors flex items-center justify-center"
//                     >
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                       </svg>
//                       View Detailed Report
//                     </button>

//                     <button
//                       onClick={() => {
//                         localStorage.removeItem("submittedTest");
//                         window.location.reload();
//                       }}
//                       className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md font-medium transition-colors flex items-center justify-center"
//                     >
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                       </svg>
//                       Try Again
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Question Card component
// const QuestionCard = ({ question, index, selected, submitted, handleOptionChange, toggleDescription, showDescription }) => {
//   const isCorrect = selected === question.correct;
  
//   return (
//     <div className="mb-8 p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
//       <div className="flex items-start mb-4">
//         <span className="flex-shrink-0 bg-blue-100 text-blue-800 font-bold rounded-full h-8 w-8 flex items-center justify-center mr-3">
//           {index + 1}
//         </span>
//         <p className="text-lg font-medium text-gray-800">{question.question}</p>
//       </div>
      
//       <div className="ml-11 space-y-2">
//         {question.options.map((option, optIndex) => {
//           const isSelected = selected === option;
//           const isCorrectOption = question.correct === option;
          
//           let optionClass = "border border-gray-200 p-3 rounded-lg transition-all";
          
//           if (submitted) {
//             if (isCorrectOption) {
//               optionClass += " bg-green-50 border-green-300";
//             } else if (isSelected && !isCorrectOption) {
//               optionClass += " bg-red-50 border-red-300";
//             }
//           } else if (isSelected) {
//             optionClass += " bg-blue-50 border-blue-300";
//           } else {
//             optionClass += " hover:bg-gray-50";
//           }
          
//           return (
//             <label key={optIndex} className={`${optionClass} block cursor-pointer`}>
//               <div className="flex items-center">
//                 <input
//                   type="radio"
//                   name={`question-${index}`}
//                   value={option}
//                   disabled={submitted}
//                   checked={isSelected}
//                   onChange={() => handleOptionChange(index, option)}
//                   className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                 />
//                 <span className="ml-3 text-gray-700">{option}</span>
                
//                 {submitted && isCorrectOption && (
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 ml-auto" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                   </svg>
//                 )}
                
//                 {submitted && isSelected && !isCorrectOption && (
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 ml-auto" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                   </svg>
//                 )}
//               </div>
//             </label>
//           );
//         })}
//       </div>
      
//       {submitted && (
//         <div className="ml-11 mt-4">
//           {!isCorrect && (
//             <div className="text-red-600 mb-2 font-medium flex items-center">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//               </svg>
//               Incorrect answer
//             </div>
//           )}
//           {isCorrect && (
//             <div className="text-green-600 mb-2 font-medium flex items-center">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//               </svg>
//               Correct answer
//             </div>
//           )}

//           <button
//             onClick={() => toggleDescription(index)}
//             className="text-blue-600 hover:text-blue-800 underline font-medium flex items-center mt-1"
//           >
//             {showDescription ? (
//               <>
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
//                 </svg>
//                 Hide Solution
//               </>
//             ) : (
//               <>
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
//                 </svg>
//                 View Solution
//               </>
//             )}
//           </button>

//           {showDescription && (
//             <div className="mt-3 bg-yellow-50 border border-yellow-100 p-4 rounded-lg">
//               <h4 className="font-medium text-yellow-800 mb-2">Solution:</h4>
//               <p className="text-gray-700">{question.description || "No explanation available."}</p>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Test;

// import { useLocation, useNavigate } from "react-router-dom";
// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { v4 as uuidv4 } from "uuid";

// const Test = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [questions, setQuestions] = useState([]);
//   const [answers, setAnswers] = useState({});
//   const [markedForReview, setMarkedForReview] = useState({}); // New state for review marks
//   const [timeLeft, setTimeLeft] = useState(0);
//   const [submitted, setSubmitted] = useState(false);
//   const [score, setScore] = useState(0);
//   const [totalTime, setTotalTime] = useState(0);
//   const [showDescriptions, setShowDescriptions] = useState({});
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [showAllQuestions, setShowAllQuestions] = useState(false);
//   const timerRef = useRef(null);
//   const [testId, setTestId] = useState("");

//   useEffect(() => {
//     const stored = localStorage.getItem("submittedTest");
//     const state = location.state;

//     if (stored && state) {
//       const parsed = JSON.parse(stored);
//       const sameParams = JSON.stringify(parsed.locationState) === JSON.stringify(state);

//       if (sameParams) {
//         setQuestions(parsed.questions);
//         setAnswers(parsed.answers);
//         setMarkedForReview(parsed.markedForReview || {}); // Load review marks
//         setScore(parsed.score);
//         setTotalTime(parsed.totalTime);
//         setTimeLeft(parsed.timeLeft);
//         setShowDescriptions(parsed.showDescriptions || {});
//         setSubmitted(true);
//         setTestId(parsed.test_id || "");
//         return;
//       }
//     }

//     const fetchQuestions = async () => {
//       const { class: className, subjects, chapters, difficulty, limit } = state || {};
//       try {
//         const res = await axios.post("http://localhost:5000/test", {
//           class: className,
//           subjects,
//           chapters,
//           difficulty,
//           limit,
//         });

//         setQuestions(res.data);
//         setTimeLeft(limit * 60);
//         setTotalTime(limit * 60);
//         setTestId(uuidv4());
//       } catch (err) {
//         console.error("Failed to load questions", err);
//       }
//     };

//     if (state) {
//       localStorage.removeItem("submittedTest");
//       fetchQuestions();
//     }

//     return () => clearTimeout(timerRef.current);
//   }, [location.state]);

//   useEffect(() => {
//     if (timeLeft > 0 && !submitted) {
//       timerRef.current = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
//     } else if (timeLeft === 0 && questions.length > 0 && !submitted) {
//       handleSubmit();
//     }
//   }, [timeLeft]);

//   const handleOptionChange = (questionIndex, selectedOption) => {
//     setAnswers((prev) => ({
//       ...prev,
//       [questionIndex]: selectedOption,
//     }));
//   };

//   // Toggle mark for review
//   const toggleMarkForReview = (index) => {
//     setMarkedForReview((prev) => ({
//       ...prev,
//       [index]: !prev[index],
//     }));
//   };

//   const toggleDescription = (index) => {
//     setShowDescriptions((prev) => ({
//       ...prev,
//       [index]: !prev[index],
//     }));
//   };

//   const allQuestionsAnswered = () => {
//     return questions.length > 0 && questions.every((_, index) => answers[index] !== undefined);
//   };

//   const handleSubmit = async () => {
//     clearTimeout(timerRef.current);
//     setSubmitted(true);

//     let tempScore = 0;
//     questions.forEach((q, index) => {
//       if (answers[index] === q.correct) {
//         tempScore += 1;
//       }
//     });
//     setScore(tempScore);

//     const timeTaken = totalTime - timeLeft;

//     const subjects = Array.isArray(location.state.subjects)
//       ? location.state.subjects
//       : [location.state.subjects];

//     const chapters = Array.isArray(location.state.chapters)
//       ? location.state.chapters
//       : [location.state.chapters];

//     const questionDetails = questions.map((q, index) => ({
//       question: q.question,
//       options: q.options,
//       correct: q.correct,
//       selected: answers[index],
//       description: q.description,
//       markedForReview: markedForReview[index] || false, // Include review status
//     }));

//     try {
//       const user = JSON.parse(localStorage.getItem("user"));
//       await axios.post("http://localhost:5000/submit-result", {
//         userId: user.id,
//         result: {
//           test_id: testId,
//           subjects,
//           chapters,
//           difficulty: location.state.difficulty,
//           score: tempScore,
//           total: questions.length,
//           timeTaken,
//           date: new Date(),
//           questions: questionDetails,
//         },
//       });
//     } catch (err) {
//       console.error("Failed to submit result:", err);
//     }

//     localStorage.setItem(
//       "submittedTest",
//       JSON.stringify({
//         test_id: testId,
//         questions,
//         answers,
//         markedForReview, // Save review marks
//         score: tempScore,
//         totalTime,
//         timeLeft,
//         showDescriptions,
//         locationState: location.state,
//       })
//     );
//   };

//   const formatTime = (seconds) => {
//     const min = Math.floor(seconds / 60);
//     const sec = seconds % 60;
//     return `${min}:${sec.toString().padStart(2, "0")}`;
//   };

//   const goToNextQuestion = () => {
//     if (currentQuestion < questions.length - 1) {
//       setCurrentQuestion(currentQuestion + 1);
//     }
//   };

//   const goToPrevQuestion = () => {
//     if (currentQuestion > 0) {
//       setCurrentQuestion(currentQuestion - 1);
//     }
//   };

//   const goToQuestion = (index) => {
//     setCurrentQuestion(index);
//   };

//   // New function to get status class based on answered and review state
//   const getStatusClass = (index) => {
//     const isAnswered = answers[index] !== undefined;
//     const isMarkedForReview = markedForReview[index];
    
//     if (submitted) {
//       const isCorrect = answers[index] === questions[index]?.correct;
//       if (isCorrect) return "bg-green-500 text-white";
//       else if (answers[index]) return "bg-red-500 text-white";
//       return "bg-gray-300";
//     } else {
//       // Not answered and marked for review - red with flag
//       if (!isAnswered && isMarkedForReview) {
//         return "bg-red-500 text-white relative";
//       }
//       // Answered and marked for review - green with flag
//       else if (isAnswered && isMarkedForReview) {
//         return "bg-green-500 text-white relative";
//       }
//       // Answered but not marked for review - green
//       else if (isAnswered) {
//         return "bg-green-500 text-white";
//       }
//       // Not answered and not marked for review - red
//       else {
//         return "bg-red-500 text-white";
//       }
//     }
//   };

//   // Calculate percentages for the summary
//   const answeredCount = Object.keys(answers).length;
//   const reviewedCount = Object.values(markedForReview).filter(Boolean).length;
//   const progressPercentage = questions.length > 0 
//     ? Math.round((answeredCount / questions.length) * 100) 
//     : 0;

//   // Warning color for timer based on time left
//   const getTimerColor = () => {
//     if (timeLeft < totalTime * 0.25) return "text-red-600";
//     if (timeLeft < totalTime * 0.5) return "text-yellow-600";
//     return "text-green-600";
//   };

//   // Flag marker component for question buttons
//   const FlagMarker = () => (
//     <div className="absolute -top-1 -right-1">
//       <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-yellow-500 fill-current" viewBox="0 0 20 20">
//         <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
//       </svg>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header with timer and test info */}
//       <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
//         <div className="container mx-auto p-4 flex justify-between items-center">
//           <div className="flex items-center">
//             <h1 className="text-2xl font-bold text-blue-800">JEE Practice Test</h1>
//             {location.state && (
//               <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
//                 {location.state.difficulty} Level
//               </span>
//             )}
//           </div>
          
//           {!submitted && questions.length > 0 && (
//             <div className={`flex items-center space-x-2 ${getTimerColor()} font-bold text-lg`}>
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <span>{formatTime(timeLeft)}</span>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="container mx-auto p-4 flex flex-col lg:flex-row">
//         {/* Left sidebar with question navigation */}
//         <div className="w-full lg:w-1/4 lg:pr-4 mb-4 lg:mb-0">
//           <div className="bg-white p-4 rounded-lg shadow">
//             <div className="mb-4">
//               <h2 className="font-bold text-gray-700 mb-2">Question Navigator</h2>
//               <div className="flex flex-wrap gap-2">
//                 {questions.map((_, index) => (
//                   <button
//                     key={index}
//                     onClick={() => goToQuestion(index)}
//                     className={`h-8 w-8 flex items-center justify-center rounded-md font-medium 
//                       ${currentQuestion === index ? "ring-2 ring-blue-600" : ""} 
//                       ${getStatusClass(index)}`}
//                   >
//                     {index + 1}
//                     {!submitted && markedForReview[index] && <FlagMarker />}
//                   </button>
//                 ))}
//               </div>
//             </div>
            
//             <div className="border-t pt-4">
//               <h2 className="font-bold text-gray-700">Summary</h2>
//               <div className="mt-2 space-y-2">
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-600">Answered</span>
//                   <span className="text-sm font-medium">{answeredCount}/{questions.length}</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div 
//                     className="bg-green-600 h-2 rounded-full" 
//                     style={{ width: `${progressPercentage}%` }}
//                   ></div>
//                 </div>
                
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-600">Marked for Review</span>
//                   <span className="text-sm font-medium">{reviewedCount}/{questions.length}</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div 
//                     className="bg-yellow-500 h-2 rounded-full" 
//                     style={{ width: `${(reviewedCount / questions.length) * 100}%` }}
//                   ></div>
//                 </div>
                
//                 {!submitted && (
//                   <div className="py-2">
//                     <button
//                       onClick={() => {
//                         if (!allQuestionsAnswered()) {
//                           if (confirm("You haven't answered all questions. Do you still want to submit?")) {
//                             handleSubmit();
//                           }
//                         } else {
//                           handleSubmit();
//                         }
//                       }}
//                       className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-medium transition-colors"
//                     >
//                       Submit Test
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
            
//             <div className="mt-4 border-t pt-4">
//               <div className="flex flex-wrap gap-2 text-sm">
//                 <div className="flex items-center">
//                   <div className="h-3 w-3 bg-green-500 rounded-full mr-1"></div>
//                   <span>Answered</span>
//                 </div>
//                 <div className="flex items-center">
//                   <div className="h-3 w-3 bg-red-500 rounded-full mr-1"></div>
//                   <span>Unanswered</span>
//                 </div>
//                 <div className="flex items-center">
//                   <div className="h-3 w-3 bg-green-500 relative rounded-full mr-1">
//                     <div className="absolute -top-1 -right-1">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2 text-yellow-500 fill-current" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
//                       </svg>
//                     </div>
//                   </div>
//                   <span>Answered & Marked</span>
//                 </div>
//                 <div className="flex items-center">
//                   <div className="h-3 w-3 bg-red-500 relative rounded-full mr-1">
//                     <div className="absolute -top-1 -right-1">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2 text-yellow-500 fill-current" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
//                       </svg>
//                     </div>
//                   </div>
//                   <span>Unanswered & Marked</span>
//                 </div>
//                 {submitted && (
//                   <>
//                     <div className="flex items-center">
//                       <div className="h-3 w-3 bg-green-500 rounded-full mr-1"></div>
//                       <span>Correct</span>
//                     </div>
//                     <div className="flex items-center">
//                       <div className="h-3 w-3 bg-red-500 rounded-full mr-1"></div>
//                       <span>Incorrect</span>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Main content area */}
//         <div className="w-full lg:w-3/4">
//           <div className="bg-white rounded-lg shadow p-6">
//             {/* Toggle view mode */}
//             {questions.length > 0 && (
//               <div className="mb-6">
//                 <button
//                   onClick={() => setShowAllQuestions(!showAllQuestions)}
//                   className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
//                 >
//                   {showAllQuestions ? (
//                     <>
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                       </svg>
//                       Show One Question at a Time
//                     </>
//                   ) : (
//                     <>
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
//                       </svg>
//                       Show All Questions
//                     </>
//                   )}
//                 </button>
//               </div>
//             )}

//             {/* Question section */}
//             {questions.length > 0 ? (
//               showAllQuestions ? (
//                 // All questions view
//                 questions.map((q, index) => (
//                   <QuestionCard
//                     key={index}
//                     question={q}
//                     index={index}
//                     selected={answers[index]}
//                     submitted={submitted}
//                     handleOptionChange={handleOptionChange}
//                     toggleDescription={toggleDescription}
//                     showDescription={showDescriptions[index]}
//                     isMarkedForReview={markedForReview[index]}
//                     toggleMarkForReview={toggleMarkForReview}
//                   />
//                 ))
//               ) : (
//                 // Single question view
//                 <>
//                   {questions[currentQuestion] && (
//                     <QuestionCard
//                       question={questions[currentQuestion]}
//                       index={currentQuestion}
//                       selected={answers[currentQuestion]}
//                       submitted={submitted}
//                       handleOptionChange={handleOptionChange}
//                       toggleDescription={toggleDescription}
//                       showDescription={showDescriptions[currentQuestion]}
//                       isMarkedForReview={markedForReview[currentQuestion]}
//                       toggleMarkForReview={toggleMarkForReview}
//                     />
//                   )}
                  
//                   <div className="flex justify-between mt-8">
//                     <button
//                       onClick={goToPrevQuestion}
//                       disabled={currentQuestion === 0}
//                       className={`flex items-center space-x-1 px-4 py-2 rounded ${
//                         currentQuestion === 0
//                           ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                           : "bg-blue-100 text-blue-700 hover:bg-blue-200"
//                       }`}
//                     >
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                         <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
//                       </svg>
//                       <span>Previous</span>
//                     </button>
                    
//                     <div className="text-center text-gray-700">
//                       <span className="font-bold">{currentQuestion + 1}</span> of {questions.length}
//                     </div>
                    
//                     <button
//                       onClick={goToNextQuestion}
//                       disabled={currentQuestion === questions.length - 1}
//                       className={`flex items-center space-x-1 px-4 py-2 rounded ${
//                         currentQuestion === questions.length - 1
//                           ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                           : "bg-blue-100 text-blue-700 hover:bg-blue-200"
//                       }`}
//                     >
//                       <span>Next</span>
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                         <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
//                       </svg>
//                     </button>
//                   </div>
//                 </>
//               )
//             ) : (
//               <div className="text-center py-12">
//                 <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
//                 <p className="mt-4 text-gray-600">Loading questions...</p>
//               </div>
//             )}

//             {/* Results section */}
//             {submitted && (
//               <div className="mt-8 pt-6 border-t">
//                 <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 text-center">
//                   <div className="text-2xl font-bold text-blue-800">
//                     🎓 Test Completed
//                   </div>
//                   <div className="text-3xl font-bold text-green-700 mt-4">
//                     Score: {score}/{questions.length}
//                   </div>
//                   <div className="text-gray-600 mt-2">
//                     Time taken: {formatTime(totalTime - timeLeft)}
//                   </div>
                  
//                   <div className="w-full max-w-md mx-auto mt-6 bg-gray-200 rounded-full h-4">
//                     <div 
//                       className={`h-4 rounded-full ${
//                         (score / questions.length) >= 0.7 ? "bg-green-500" : 
//                         (score / questions.length) >= 0.4 ? "bg-yellow-500" : "bg-red-500"
//                       }`} 
//                       style={{ width: `${(score / questions.length) * 100}%` }}
//                     ></div>
//                   </div>
                  
//                   <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
//                     <button
//                       onClick={() =>
//                         navigate("/report", {
//                           state: {
//                             test_id: testId,
//                             subjects: location.state.subjects,
//                             chapters: location.state.chapters,
//                             totalQuestions: questions.length,
//                             correctAnswers: score,
//                             timeTaken: totalTime - timeLeft,
//                           },
//                         })
//                       }
//                       className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors flex items-center justify-center"
//                     >
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                       </svg>
//                       View Detailed Report
//                     </button>

//                     <button
//                       onClick={() => {
//                         localStorage.removeItem("submittedTest");
//                         window.location.reload();
//                       }}
//                       className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md font-medium transition-colors flex items-center justify-center"
//                     >
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                       </svg>
//                       Try Again
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Updated Question Card component with Mark for Review button
// const QuestionCard = ({
//   question,
//   index,
//   selected,
//   submitted,
//   handleOptionChange,
//   toggleDescription,
//   showDescription,
//   isMarkedForReview,
//   toggleMarkForReview
// }) => {
//   const isCorrect = selected === question.correct;
  
//   return (
//     <div className="mb-8 p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
//       <div className="flex items-start justify-between mb-4">
//         <div className="flex items-start">
//           <span className="flex-shrink-0 bg-blue-100 text-blue-800 font-bold rounded-full h-8 w-8 flex items-center justify-center mr-3">
//             {index + 1}
//           </span>
//           <p className="text-lg font-medium text-gray-800">{question.question}</p>
//         </div>
        
//         {!submitted && (
//           <button
//             onClick={() => toggleMarkForReview(index)}
//             className={`flex items-center px-3 py-1 rounded text-sm font-medium ${
//               isMarkedForReview
//                 ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
//                 : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//             }`}
//           >
//             <svg 
//               xmlns="http://www.w3.org/2000/svg" 
//               className={`h-4 w-4 mr-1 ${isMarkedForReview ? "text-yellow-600" : "text-gray-500"}`} 
//               viewBox="0 0 20 20" 
//               fill="currentColor"
//             >
//               <path 
//                 fillRule="evenodd" 
//                 d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" 
//                 clipRule="evenodd" 
//               />
//             </svg>
//             {isMarkedForReview ? "Marked for Review" : "Mark for Review"}
//           </button>
//         )}
//       </div>
      
//       <div className="ml-11 space-y-2">
//         {question.options.map((option, optIndex) => {
//           const isSelected = selected === option;
//           const isCorrectOption = question.correct === option;
          
//           let optionClass = "border border-gray-200 p-3 rounded-lg transition-all";
          
//           if (submitted) {
//             if (isCorrectOption) {
//               optionClass += " bg-green-50 border-green-300";
//             } else if (isSelected && !isCorrectOption) {
//               optionClass += " bg-red-50 border-red-300";
//             }
//           } else if (isSelected) {
//             optionClass += " bg-blue-50 border-blue-300";
//           } else {
//             optionClass += " hover:bg-gray-50";
//           }
          
//           return (
//             <label key={optIndex} className={`${optionClass} block cursor-pointer`}>
//               <div className="flex items-center">
//                 <input
//                   type="radio"
//                   name={`question-${index}`}
//                   value={option}
//                   disabled={submitted}
//                   checked={isSelected}
//                   onChange={() => handleOptionChange(index, option)}
//                   className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                 />
//                 <span className="ml-3 text-gray-700">{option}</span>
                
//                 {submitted && isCorrectOption && (
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 ml-auto" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                   </svg>
//                 )}
                
//                 {submitted && isSelected && !isCorrectOption && (
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 ml-auto" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                   </svg>
//                 )}
//               </div>
//             </label>
//           );
//         })}
//       </div>
      
//       {submitted && (
//         <div className="ml-11 mt-4">
//           {!isCorrect && (
//             <div className="text-red-600 mb-2 font-medium flex items-center">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//               </svg>
//               Incorrect answer
//             </div>
//           )}
//           {isCorrect && (
//             <div className="text-green-600 mb-2 font-medium flex items-center">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//               </svg>
//               Correct answer
//             </div>
//           )}

//           <button
//             onClick={() => toggleDescription(index)}
//             className="text-blue-600 hover:text-blue-800 underline font-medium flex items-center mt-1"
//           >
//             {showDescription ? (
//               <>
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
//                 </svg>
//                 Hide Solution
//               </>
//             ) : (
//               <>
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
//                 </svg>
//                 View Solution
//               </>
//             )}
//           </button>

//           {showDescription && (
//             <div className="mt-3 bg-yellow-50 border border-yellow-100 p-4 rounded-lg">
//               <h4 className="font-medium text-yellow-800 mb-2">Solution:</h4>
//               <p className="text-gray-700">{question.description || "No explanation available."}</p>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Test;



import { useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

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

const Test = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({}); // New state for review marks
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [showDescriptions, setShowDescriptions] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const timerRef = useRef(null);
  const [testId, setTestId] = useState("");
  const questionsRef = useRef(null); // Ref for scrolling to questions

  // Save test state to session storage whenever it changes
  useEffect(() => {
    if (questions.length > 0) {
      sessionStorage.setItem("testState", JSON.stringify({
        questions,
        answers,
        markedForReview,
        timeLeft,
        submitted,
        score,
        totalTime,
        showDescriptions,
        currentQuestion,
        showAllQuestions,
        testId,
        locationState: location.state
      }));
    }
  }, [questions, answers, markedForReview, timeLeft, submitted, score, showDescriptions, currentQuestion, testId]);

  useEffect(() => {
    // First try to recover from session storage (for refresh)
    const storedTestState = sessionStorage.getItem("testState");
    
    if (storedTestState) {
      const parsedState = JSON.parse(storedTestState);
      setQuestions(parsedState.questions);
      setAnswers(parsedState.answers);
      setMarkedForReview(parsedState.markedForReview || {});
      setTimeLeft(parsedState.timeLeft);
      setSubmitted(parsedState.submitted);
      setScore(parsedState.score);
      setTotalTime(parsedState.totalTime);
      setShowDescriptions(parsedState.showDescriptions || {});
      setCurrentQuestion(parsedState.currentQuestion);
      setShowAllQuestions(parsedState.showAllQuestions);
      setTestId(parsedState.testId);
      return;
    }
    
    // Otherwise check localStorage for submitted test
    const stored = localStorage.getItem("submittedTest");
    const state = location.state;

    if (stored && state) {
      const parsed = JSON.parse(stored);
      const sameParams = JSON.stringify(parsed.locationState) === JSON.stringify(state);

      if (sameParams) {
        setQuestions(parsed.questions);
        setAnswers(parsed.answers);
        setMarkedForReview(parsed.markedForReview || {});
        setScore(parsed.score);
        setTotalTime(parsed.totalTime);
        setTimeLeft(parsed.timeLeft);
        setShowDescriptions(parsed.showDescriptions || {});
        setSubmitted(true);
        setTestId(parsed.test_id || "");
        return;
      }
    }

    const fetchQuestions = async () => {
      const { class: className, subjects, chapters, difficulty, limit } = state || {};
      try {
        const res = await axios.post("http://localhost:5000/api/test", {
          class: className,
          subjects,
          chapters,
          difficulty,
          limit,
        });

        setQuestions(res.data);
        setTimeLeft(limit * 60);
        setTotalTime(limit * 60);
        setTestId(uuidv4());
      } catch (err) {
        logger.error("Failed to load questions", err);
      }
    };

    if (state) {
      localStorage.removeItem("submittedTest");
      fetchQuestions();
    }

    return () => clearTimeout(timerRef.current);
  }, [location.state]);

  useEffect(() => {
    if (timeLeft > 0 && !submitted) {
      timerRef.current = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && questions.length > 0 && !submitted) {
      handleSubmit();
    }
  }, [timeLeft]);

  const handleOptionChange = (questionIndex, selectedOption) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: selectedOption,
    }));
  };

  // Toggle mark for review
  const toggleMarkForReview = (index) => {
    setMarkedForReview((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleDescription = (index) => {
    setShowDescriptions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const allQuestionsAnswered = () => {
    return questions.length > 0 && questions.every((_, index) => answers[index] !== undefined);
  };

  const handleSubmit = async () => {
    clearTimeout(timerRef.current);
    setSubmitted(true);

    let tempScore = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correct) {
        tempScore += 1;
      }
    });
    setScore(tempScore);

    const timeTaken = totalTime - timeLeft;

    const subjects = Array.isArray(location.state.subjects)
      ? location.state.subjects
      : [location.state.subjects];

    const chapters = Array.isArray(location.state.chapters)
      ? location.state.chapters
      : [location.state.chapters];

    const questionDetails = questions.map((q, index) => ({
      question: q.question,
      options: q.options,
      correct: q.correct,
      selected: answers[index],
      description: q.description,
      markedForReview: markedForReview[index] || false, // Include review status
    }));

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await axios.post("http://localhost:5000/api/submit-result", {
        userId: user.id,
        result: {
          test_id: testId,
          subjects,
          chapters,
          difficulty: location.state.difficulty,
          score: tempScore,
          total: questions.length,
          timeTaken,
          date: new Date(),
          questions: questionDetails,
        },
      });
    } catch (err) {
      logger.error("Failed to submit result:", err);
    }

    localStorage.setItem(
      "submittedTest",
      JSON.stringify({
        test_id: testId,
        questions,
        answers,
        markedForReview, // Save review marks
        score: tempScore,
        totalTime,
        timeLeft,
        showDescriptions,
        locationState: location.state,
      })
    );
    
    // Save to session storage as well
    sessionStorage.setItem("testState", JSON.stringify({
      questions,
      answers,
      markedForReview,
      timeLeft: 0,
      submitted: true,
      score: tempScore,
      totalTime,
      showDescriptions,
      currentQuestion,
      showAllQuestions,
      testId,
      locationState: location.state
    }));
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  const goToNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goToPrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const goToQuestion = (index) => {
    setCurrentQuestion(index);
    
    // If showing all questions, scroll to the selected question
    if (showAllQuestions && questionsRef.current) {
      const questionElements = questionsRef.current.querySelectorAll('.question-card');
      if (questionElements[index]) {
        questionElements[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // New function to get status class based on answered and review state
  const getStatusClass = (index) => {
    const isAnswered = answers[index] !== undefined;
    const isMarkedForReview = markedForReview[index];
    
    if (submitted) {
      const isCorrect = answers[index] === questions[index]?.correct;
      if (isCorrect) return "bg-green-500 text-white";
      else if (answers[index]) return "bg-red-500 text-white";
      return "bg-gray-300";
    } else {
      // Not answered and marked for review - red with flag
      if (!isAnswered && isMarkedForReview) {
        return "bg-red-500 text-white relative";
      }
      // Answered and marked for review - green with flag
      else if (isAnswered && isMarkedForReview) {
        return "bg-green-500 text-white relative";
      }
      // Answered but not marked for review - green
      else if (isAnswered) {
        return "bg-green-500 text-white";
      }
      // Not answered and not marked for review - red
      else {
        return "bg-red-500 text-white";
      }
    }
  };

  // Calculate percentages for the summary
  const answeredCount = Object.keys(answers).length;
  const reviewedCount = Object.values(markedForReview).filter(Boolean).length;
  const progressPercentage = questions.length > 0 
    ? Math.round((answeredCount / questions.length) * 100) 
    : 0;

  // Warning color for timer based on time left
  const getTimerColor = () => {
    if (timeLeft < totalTime * 0.25) return "text-red-600";
    if (timeLeft < totalTime * 0.5) return "text-yellow-600";
    return "text-green-600";
  };

  // Flag marker component for question buttons
  const FlagMarker = () => (
    <div className="absolute -top-1 -right-1">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-yellow-500 fill-current" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
      </svg>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header with timer and test info */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-800">JEE  Test</h1>
            {location.state.difficulty && (
              <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                {location.state.difficulty} Level
              </span>
            )}
          </div>
          
          {!submitted && questions.length > 0 && (
            <div className={`flex items-center space-x-2 ${getTimerColor()} font-bold text-lg`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{formatTime(timeLeft)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto p-4 flex flex-col lg:flex-row">
        {/* Main content area - now on the left */}
        <div className="w-full lg:w-3/4 lg:pr-4 mb-4 lg:mb-0">
          <div className="bg-white rounded-lg shadow p-6">
            {/* Toggle view mode */}
            {questions.length > 0 && (
              <div className="mb-6">
                <button
                  onClick={() => setShowAllQuestions(!showAllQuestions)}
                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                >
                  {showAllQuestions ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Show One Question at a Time
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                      Show All Questions
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Question section */}
            <div ref={questionsRef}>
              {questions.length > 0 ? (
                showAllQuestions ? (
                  // All questions view
                  questions.map((q, index) => (
                    <div id={`question-${index}`} key={index} className="question-card">
                      <QuestionCard
                        question={q}
                        index={index}
                        selected={answers[index]}
                        submitted={submitted}
                        handleOptionChange={handleOptionChange}
                        toggleDescription={toggleDescription}
                        showDescription={showDescriptions[index]}
                        isMarkedForReview={markedForReview[index]}
                        toggleMarkForReview={toggleMarkForReview}
                      />
                    </div>
                  ))
                ) : (
                  // Single question view
                  <>
                    {questions[currentQuestion] && (
                      <QuestionCard
                        question={questions[currentQuestion]}
                        index={currentQuestion}
                        selected={answers[currentQuestion]}
                        submitted={submitted}
                        handleOptionChange={handleOptionChange}
                        toggleDescription={toggleDescription}
                        showDescription={showDescriptions[currentQuestion]}
                        isMarkedForReview={markedForReview[currentQuestion]}
                        toggleMarkForReview={toggleMarkForReview}
                      />
                    )}
                    
                    <div className="flex justify-between mt-8">
                      <button
                        onClick={goToPrevQuestion}
                        disabled={currentQuestion === 0}
                        className={`flex items-center space-x-1 px-4 py-2 rounded ${
                          currentQuestion === 0
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                        }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Previous</span>
                      </button>
                      
                      <div className="text-center text-gray-700">
                        <span className="font-bold">{currentQuestion + 1}</span> of {questions.length}
                      </div>
                      
                      <button
                        onClick={goToNextQuestion}
                        disabled={currentQuestion === questions.length - 1}
                        className={`flex items-center space-x-1 px-4 py-2 rounded ${
                          currentQuestion === questions.length - 1
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                        }`}
                      >
                        <span>Next</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </>
                )
              ) : (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading questions...</p>
                </div>
              )}
            </div>

            {/* Results section */}
            {submitted && (
              <div className="mt-8 pt-6 border-t">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 text-center">
                  <div className="text-2xl font-bold text-blue-800">
                    🎓 Test Completed
                  </div>
                  <div className="text-3xl font-bold text-green-700 mt-4">
                    Score: {score}/{questions.length}
                  </div>
                  <div className="text-gray-600 mt-2">
                    Time taken: {formatTime(totalTime - timeLeft)}
                  </div>
                  
                  <div className="w-full max-w-md mx-auto mt-6 bg-gray-200 rounded-full h-4">
                    <div 
                      className={`h-4 rounded-full ${
                        (score / questions.length) >= 0.7 ? "bg-green-500" : 
                        (score / questions.length) >= 0.4 ? "bg-yellow-500" : "bg-red-500"
                      }`} 
                      style={{ width: `${(score / questions.length) * 100}%` }}
                    ></div>
                  </div>
                  
                  <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                    <button
                      onClick={() =>
                        navigate("/report", {
                          state: {
                            test_id: testId,
                            subjects: location.state.subjects,
                            chapters: location.state.chapters,
                            totalQuestions: questions.length,
                            correctAnswers: score,
                            timeTaken: totalTime - timeLeft,
                          },
                        })
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      View Detailed Report
                    </button>

                    <button
                      onClick={() => {
                        localStorage.removeItem("submittedTest");
                        sessionStorage.removeItem("testState");
                        window.location.reload();
                      }}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md font-medium transition-colors flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar with question navigation */}
        <div className="w-full lg:w-1/4 lg:pl-4">
          <div className="bg-white p-4 rounded-lg shadow sticky top-20">
            <div className="mb-4">
              <h2 className="font-bold text-gray-700 mb-2">Question Navigator</h2>
              <div className="flex flex-wrap gap-2">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToQuestion(index)}
                    className={`h-8 w-8 flex items-center justify-center rounded-md font-medium 
                      ${currentQuestion === index ? "ring-2 ring-blue-600" : ""} 
                      ${getStatusClass(index)}`}
                  >
                    {index + 1}
                    {!submitted && markedForReview[index] && <FlagMarker />}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h2 className="font-bold text-gray-700">Summary</h2>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Answered</span>
                  <span className="text-sm font-medium">{answeredCount}/{questions.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Marked for Review</span>
                  <span className="text-sm font-medium">{reviewedCount}/{questions.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ width: `${(reviewedCount / questions.length) * 100}%` }}
                  ></div>
                </div>
                
                {!submitted && (
                  <div className="py-2">
                    <button
                      onClick={() => {
                        if (!allQuestionsAnswered()) {
                          if (confirm("You haven't answered all questions. Do you still want to submit?")) {
                            handleSubmit();
                          }
                        } else {
                          handleSubmit();
                        }
                      }}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-medium transition-colors"
                    >
                      Submit Test
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-4 border-t pt-4">
              <div className="flex flex-wrap gap-2 text-sm">
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-green-500 rounded-full mr-1"></div>
                  <span>Answered</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-red-500 rounded-full mr-1"></div>
                  <span>Unanswered</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-green-500 relative rounded-full mr-1">
                    <div className="absolute -top-1 -right-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2 text-yellow-500 fill-current" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <span>Answered & Marked</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-red-500 relative rounded-full mr-1">
                    <div className="absolute -top-1 -right-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2 text-yellow-500 fill-current" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <span>Unanswered & Marked</span>
                </div>
                {submitted && (
                  <>
                    <div className="flex items-center">
                      <div className="h-3 w-3 bg-green-500 rounded-full mr-1"></div>
                      <span>Correct</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-3 w-3 bg-red-500 rounded-full mr-1"></div>
                      <span>Incorrect</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Updated Question Card component with Mark for Review button
const QuestionCard = ({
  question,
  index,
  selected,
  submitted,
  handleOptionChange,
  toggleDescription,
  showDescription,
  isMarkedForReview,
  toggleMarkForReview
}) => {
  const isCorrect = selected === question.correct;
  
  return (
    <div className="mb-8 p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start">
          <span className="flex-shrink-0 bg-blue-100 text-blue-800 font-bold rounded-full h-8 w-8 flex items-center justify-center mr-3">
            {index + 1}
          </span>
          <p className="text-lg font-medium text-gray-800">{question.question}</p>
        </div>
        
        {!submitted && (
          <button
            onClick={() => toggleMarkForReview(index)}
            className={`flex items-center px-3 py-1 rounded text-sm font-medium ${
              isMarkedForReview
                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-4 w-4 mr-1 ${isMarkedForReview ? "text-yellow-600" : "text-gray-500"}`} 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" 
                clipRule="evenodd" 
              />
            </svg>
            {isMarkedForReview ? "Marked for Review" : "Mark for Review"}
          </button>
        )}
      </div>
      
      <div className="ml-11 space-y-2">
        {question.options.map((option, optIndex) => {
          const isSelected = selected === option;
          const isCorrectOption = question.correct === option;
          
          let optionClass = "border border-gray-200 p-3 rounded-lg transition-all";
          
          if (submitted) {
            if (isCorrectOption) {
              optionClass += " bg-green-50 border-green-300";
            } else if (isSelected && !isCorrectOption) {
              optionClass += " bg-red-50 border-red-300";
            }
          } else if (isSelected) {
            optionClass += " bg-blue-50 border-blue-300";
          } else {
            optionClass += " hover:bg-gray-50";
          }
          
          return (
            <label key={optIndex} className={`${optionClass} block cursor-pointer`}>
              <div className="flex items-center">
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={option}
                  disabled={submitted}
                  checked={isSelected}
                  onChange={() => handleOptionChange(index, option)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-3 text-gray-700">{option}</span>
                
                {submitted && isCorrectOption && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 ml-auto" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                
                {submitted && isSelected && !isCorrectOption && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 ml-auto" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </label>
          );
        })}
      </div>
      
      {submitted && (
        <div className="ml-11 mt-4">
          {!isCorrect && (
            <div className="text-red-600 mb-2 font-medium flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Incorrect answer
            </div>
          )}
          {isCorrect && (
            <div className="text-green-600 mb-2 font-medium flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Correct answer
            </div>
          )}

          <button
            onClick={() => toggleDescription(index)}
            className="text-blue-600 hover:text-blue-800 underline font-medium flex items-center mt-1"
          >
            {showDescription ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                Hide Solution
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                View Solution
              </>
            )}
          </button>

          {showDescription && (
            <div className="mt-3 bg-yellow-50 border border-yellow-100 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">Solution:</h4>
              <p className="text-gray-700">{question.description || "No explanation available."}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Test;