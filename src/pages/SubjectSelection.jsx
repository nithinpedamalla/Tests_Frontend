// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// function SubjectSelection() {
//   const [classes, setClasses] = useState([]);
//   const [selectedClass, setSelectedClass] = useState(() => localStorage.getItem("selectedClass") || "");
//   const [subjects, setSubjects] = useState([]);
//   const [selectedSubjects, setSelectedSubjects] = useState(() => {
//     const saved = localStorage.getItem("selectedSubjects");
//     return saved ? JSON.parse(saved) : [];
//   });
//   const [subjectChapters, setSubjectChapters] = useState({});
//   const [expandedSubject, setExpandedSubject] = useState(null);
//   const [selectedChapters, setSelectedChapters] = useState(() => {
//     const saved = localStorage.getItem("selectedChapters");
//     return saved ? JSON.parse(saved) : [];
//   });
//   const [difficulty, setDifficulty] = useState(() => localStorage.getItem("difficulty") || "");
//   const [time, setTime] = useState(() => localStorage.getItem("time") || "");
//   const [limit, setLimit] = useState(() => localStorage.getItem("limit") || "");

//   const user = JSON.parse(localStorage.getItem("user"));
//   const navigate = useNavigate();

//   useEffect(() => {
//     axios.get("http://localhost:5000/classes").then((res) => setClasses(res.data));
//   }, []);

//   useEffect(() => {
//     if (selectedClass) {
//       localStorage.setItem("selectedClass", selectedClass);
//       axios.post("http://localhost:5000/subjects", { class: selectedClass }).then((res) => {
//         setSubjects(res.data);
//       });
//     }
//   }, [selectedClass]);

//   useEffect(() => {
//     localStorage.setItem("selectedSubjects", JSON.stringify(selectedSubjects));
//   }, [selectedSubjects]);

//   useEffect(() => {
//     localStorage.setItem("selectedChapters", JSON.stringify(selectedChapters));
//   }, [selectedChapters]);

//   useEffect(() => {
//     localStorage.setItem("difficulty", difficulty);
//   }, [difficulty]);

//   useEffect(() => {
//     localStorage.setItem("time", time);
//   }, [time]);

//   useEffect(() => {
//     localStorage.setItem("limit", limit);
//   }, [limit]);

//   const handleSubjectChange = async (subject) => {
//     const alreadySelected = selectedSubjects.includes(subject);

//     if (alreadySelected) {
//       setSelectedSubjects((prev) => prev.filter((s) => s !== subject));
//       // Don't clear the chapters when deselecting a subject
//       // This way the chapters remain selected if the subject is selected again
//     } else {
//       setSelectedSubjects((prev) => [...prev, subject]);
//       try {
//         const res = await axios.post("http://localhost:5000/chapters", {
//           class: selectedClass,
//           subjects: [subject],
//         });
//         setSubjectChapters((prev) => ({
//           ...prev,
//           [subject]: res.data,
//         }));
//         setExpandedSubject(subject);
//       } catch (err) {
//         console.error("Error fetching chapters:", err);
//       }
//     }
//   };

//   const handleExpand = async (subject) => {
//     if (expandedSubject === subject) {
//       setExpandedSubject(null);
//       return;
//     }
//     setExpandedSubject(subject);

//     if (!subjectChapters[subject]) {
//       try {
//         const res = await axios.post("http://localhost:5000/chapters", {
//           class: selectedClass,
//           subjects: [subject],
//         });
//         setSubjectChapters((prev) => ({
//           ...prev,
//           [subject]: res.data,
//         }));
//       } catch (err) {
//         console.error("Error fetching chapters:", err);
//       }
//     }
//   };

//   const handleChapterChange = (chapter) => {
//     setSelectedChapters((prev) =>
//       prev.includes(chapter) ? prev.filter((c) => c !== chapter) : [...prev, chapter]
//     );
//   };

//   const isChapterSelectedForAllSubjects = () => {
//     return selectedSubjects.every((subject) => {
//       const chaptersForSubject = subjectChapters[subject] || [];
//       return chaptersForSubject.some((chapter) => selectedChapters.includes(chapter));
//     });
//   };

//   const handleSubmit = () => {
//     if (!isChapterSelectedForAllSubjects()) {
//       alert("Please select at least one chapter for each selected subject.");
//       return;
//     }

//     localStorage.removeItem("submittedTest");

//     navigate("/test", {
//       state: {
//         class: selectedClass,
//         subjects: selectedSubjects,
//         chapters: selectedChapters,
//         difficulty,
//         time,
//         limit,
//       },
//     });
//   };

//   const goToResults = () => {
//     navigate(`/results/${user.id}`);
//   };

//   // Difficulty badge colors - using lighter colors
//   const difficultyColors = {
//     easy: "bg-green-200 text-green-800",
//     medium: "bg-yellow-200 text-yellow-800",
//     hard: "bg-red-200 text-red-800",
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen p-4 w-full">
//       <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
//         <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
//           Create Your Test
//         </h1>
        
//         {/* Class Selection */}
//         <div className="mb-6 p-4 bg-blue-50 rounded-lg">
//           <h2 className="text-xl font-semibold text-blue-700 mb-3 flex items-center">
//             <div className="bg-blue-100 text-blue-700 w-7 h-7 rounded-full flex items-center justify-center mr-2">
//               <span>1</span>
//             </div>
//             Select Class
//           </h2>
//           <select 
//             onChange={(e) => setSelectedClass(e.target.value)} 
//             value={selectedClass}
//             className="w-full border border-blue-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">Select a Class</option>
//             {classes.map((cls) => (
//               <option key={cls} value={cls}>
//                 {cls}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Subjects Selection */}
//         {subjects.length > 0 && (
//           <div className="mb-6 p-4 bg-blue-50 rounded-lg">
//             <h2 className="text-xl font-semibold text-blue-700 mb-3 flex items-center">
//               <div className="bg-blue-100 text-blue-700 w-7 h-7 rounded-full flex items-center justify-center mr-2">
//                 <span>2</span>
//               </div>
//               Select Subjects
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {subjects.map((subj) => (
//                 <div 
//                   key={subj} 
//                   className={`p-4 rounded-md border ${
//                     selectedSubjects.includes(subj) 
//                       ? "border-blue-500 bg-blue-50" 
//                       : "border-gray-300 bg-white"
//                   }`}
//                 >
//                   <div className="flex items-center justify-between">
//                     <label className="flex items-center cursor-pointer">
//                       <input
//                         type="checkbox"
//                         value={subj}
//                         checked={selectedSubjects.includes(subj)}
//                         onChange={() => handleSubjectChange(subj)}
//                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                       />
//                       <span className="ml-2 text-gray-800 font-medium">{subj}</span>
//                     </label>
                    
//                     <button
//                       onClick={() => handleExpand(subj)}
//                       className={`ml-2 px-2 py-1 rounded ${
//                         expandedSubject === subj 
//                           ? "bg-blue-500 text-white" 
//                           : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                       }`}
//                     >
//                       {expandedSubject === subj ? "Hide Chapters" : "Show Chapters"}
//                     </button>
//                   </div>

//                   {/* Chapters */}
//                   {expandedSubject === subj && subjectChapters[subj] && (
//                     <div className="mt-3 pl-4 pt-2 border-t border-gray-200">
//                       <h3 className="font-medium text-gray-700 mb-2">Chapters:</h3>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
//                         {subjectChapters[subj].map((ch) => (
//                           <label key={ch} className="flex items-center py-1 cursor-pointer">
//                             <input
//                               type="checkbox"
//                               value={ch}
//                               checked={selectedChapters.includes(ch)}
//                               onChange={() => handleChapterChange(ch)}
//                               className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                             />
//                             <span className="ml-2 text-gray-700">{ch}</span>
//                           </label>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Test Configuration */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//           {/* Difficulty */}
//           <div className="p-4 bg-blue-50 rounded-lg">
//             <h2 className="text-lg font-semibold text-blue-700 mb-3 flex items-center">
//               <div className="bg-blue-100 text-blue-700 w-7 h-7 rounded-full flex items-center justify-center mr-2">
//                 <span>3</span>
//               </div>
//               Difficulty
//             </h2>
//             <div className="flex flex-col gap-2">
//               {["easy", "medium", "hard"].map((level) => (
//                 <label 
//                   key={level}
//                   className={`flex items-center p-2 rounded-md cursor-pointer ${
//                     difficulty === level
//                       ? difficultyColors[level]
//                       : "bg-white border border-gray-300"
//                   }`}
//                 >
//                   <input
//                     type="radio"
//                     name="difficulty"
//                     value={level}
//                     checked={difficulty === level}
//                     onChange={() => setDifficulty(level)}
//                     className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                   />
//                   <span className="ml-2 capitalize">{level}</span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           {/* Time */}
//           <div className="p-4 bg-blue-50 rounded-lg">
//             <h2 className="text-lg font-semibold text-blue-700 mb-3 flex items-center">
//               <div className="bg-blue-100 text-blue-700 w-7 h-7 rounded-full flex items-center justify-center mr-2">
//                 <span>4</span>
//               </div>
//               Time (minutes)
//             </h2>
//             <div className="grid grid-cols-2 gap-2">
//               {["10", "15", "20", "30"].map((t) => (
//                 <label 
//                   key={t}
//                   className={`flex items-center justify-center p-2 rounded-md cursor-pointer ${
//                     time === t
//                       ? "bg-blue-200 text-blue-800"
//                       : "bg-white border border-gray-300"
//                   }`}
//                 >
//                   <input
//                     type="radio"
//                     name="time"
//                     value={t}
//                     checked={time === t}
//                     onChange={() => setTime(t)}
//                     className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                   />
//                   <span className="ml-2">{t}</span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           {/* Questions */}
//           <div className="p-4 bg-blue-50 rounded-lg">
//             <h2 className="text-lg font-semibold text-blue-700 mb-3 flex items-center">
//               <div className="bg-blue-100 text-blue-700 w-7 h-7 rounded-full flex items-center justify-center mr-2">
//                 <span>5</span>
//               </div>
//               Number of Questions
//             </h2>
//             <div className="grid grid-cols-2 gap-2">
//               {["5", "10", "15", "20"].map((l) => (
//                 <label 
//                   key={l}
//                   className={`flex items-center justify-center p-2 rounded-md cursor-pointer ${
//                     limit === l
//                       ? "bg-blue-200 text-blue-800"
//                       : "bg-white border border-gray-300"
//                   }`}
//                 >
//                   <input
//                     type="radio"
//                     name="limit"
//                     value={l}
//                     checked={limit === l}
//                     onChange={() => setLimit(l)}
//                     className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                   />
//                   <span className="ml-2">{l}</span>
//                 </label>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Selected Options Summary */}
//         {(selectedSubjects.length > 0 || difficulty || time || limit) && (
//           <div className="mb-6 p-4 bg-green-50 rounded-lg">
//             <h3 className="text-lg font-medium text-green-700 mb-2">Your Test Configuration:</h3>
//             <div className="flex flex-wrap gap-2">
//               {selectedClass && (
//                 <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
//                   Class: {selectedClass}
//                 </span>
//               )}
//               {selectedSubjects.map(subject => (
//                 <span key={subject} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
//                   {subject}
//                 </span>
//               ))}
//               {difficulty && (
//                 <span className={`px-3 py-1 ${difficultyColors[difficulty]} rounded-full text-sm`}>
//                   {difficulty}
//                 </span>
//               )}
//               {time && (
//                 <span className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-sm">
//                   {time} minutes
//                 </span>
//               )}
//               {limit && (
//                 <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
//                   {limit} questions
//                 </span>
//               )}
//             </div>
            
//             {/* Selected Chapters */}
//             {selectedChapters.length > 0 && (
//               <div className="mt-3">
//                 <h4 className="text-sm font-medium text-gray-700">Selected Chapters:</h4>
//                 <div className="flex flex-wrap gap-1 mt-1">
//                   {selectedChapters.map(chapter => (
//                     <span key={chapter} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
//                       {chapter}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Action Buttons */}
//         <div className="flex flex-col sm:flex-row gap-3 mt-6">
//           <button 
//             onClick={goToResults}
//             className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-md font-medium transition-colors duration-200 flex items-center justify-center"
//           >
//             <span className="mr-2">📊</span> View Previous Results
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={
//               !selectedClass ||
//               !selectedSubjects.length ||
//               !selectedChapters.length ||
//               !difficulty ||
//               !time ||
//               !limit ||
//               !isChapterSelectedForAllSubjects()
//             }
//             className={`flex-1 py-3 px-4 rounded-md font-medium flex items-center justify-center ${
//               !selectedClass ||
//               !selectedSubjects.length ||
//               !selectedChapters.length ||
//               !difficulty ||
//               !time ||
//               !limit ||
//               !isChapterSelectedForAllSubjects()
//                 ? "bg-blue-200 text-blue-400 cursor-not-allowed"
//                 : "bg-blue-500 hover:bg-blue-600 text-white"
//             }`}
//           >
//             <span className="mr-2">🚀</span> Start Test
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SubjectSelection;
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// function SubjectSelection() {
//   const [classes, setClasses] = useState([]);
//   const [selectedClass, setSelectedClass] = useState(() => localStorage.getItem("selectedClass") || "");
//   const [subjects, setSubjects] = useState([]);
//   const [selectedSubjects, setSelectedSubjects] = useState(() => {
//     const saved = localStorage.getItem("selectedSubjects");
//     return saved ? JSON.parse(saved) : [];
//   });
//   const [subjectChapters, setSubjectChapters] = useState({});
//   const [expandedSubject, setExpandedSubject] = useState(null);
//   const [selectedChapters, setSelectedChapters] = useState(() => {
//     const saved = localStorage.getItem("selectedChapters");
//     return saved ? JSON.parse(saved) : [];
//   });
//   const [difficulty, setDifficulty] = useState(() => localStorage.getItem("difficulty") || "");
//   const [time, setTime] = useState(() => localStorage.getItem("time") || "");
//   const [limit, setLimit] = useState(() => localStorage.getItem("limit") || "");

//   const user = JSON.parse(localStorage.getItem("user"));
//   const navigate = useNavigate();

//   useEffect(() => {
//     axios.get("http://localhost:5000/classes").then((res) => setClasses(res.data));
//   }, []);

//   useEffect(() => {
//     if (selectedClass) {
//       localStorage.setItem("selectedClass", selectedClass);
//       axios.post("http://localhost:5000/subjects", { class: selectedClass }).then((res) => {
//         setSubjects(res.data);
//       });
//     }
//   }, [selectedClass]);

//   useEffect(() => {
//     localStorage.setItem("selectedSubjects", JSON.stringify(selectedSubjects));
    
//     // Clean up selectedChapters when subjects are deselected
//     const validChapters = selectedChapters.filter(chapter => {
//       // Check if this chapter belongs to any of the currently selected subjects
//       return selectedSubjects.some(subject => 
//         subjectChapters[subject] && subjectChapters[subject].includes(chapter)
//       );
//     });
    
//     if (JSON.stringify(validChapters) !== JSON.stringify(selectedChapters)) {
//       setSelectedChapters(validChapters);
//     }
//   }, [selectedSubjects, subjectChapters]);

//   useEffect(() => {
//     localStorage.setItem("selectedChapters", JSON.stringify(selectedChapters));
//   }, [selectedChapters]);

//   useEffect(() => {
//     localStorage.setItem("difficulty", difficulty);
//   }, [difficulty]);

//   useEffect(() => {
//     localStorage.setItem("time", time);
//   }, [time]);

//   useEffect(() => {
//     localStorage.setItem("limit", limit);
//   }, [limit]);

//   const handleSubjectChange = async (subject) => {
//     const alreadySelected = selectedSubjects.includes(subject);

//     if (alreadySelected) {
//       // Remove subject from selectedSubjects
//       setSelectedSubjects((prev) => prev.filter((s) => s !== subject));
      
//       // Remove all chapters of this subject from selectedChapters
//       if (subjectChapters[subject]) {
//         setSelectedChapters((prev) => 
//           prev.filter((chapter) => !subjectChapters[subject].includes(chapter))
//         );
//       }
//     } else {
//       setSelectedSubjects((prev) => [...prev, subject]);
//       try {
//         const res = await axios.post("http://localhost:5000/chapters", {
//           class: selectedClass,
//           subjects: [subject],
//         });
//         setSubjectChapters((prev) => ({
//           ...prev,
//           [subject]: res.data,
//         }));
//         setExpandedSubject(subject);
//       } catch (err) {
//         console.error("Error fetching chapters:", err);
//       }
//     }
//   };

//   const handleExpand = async (subject) => {
//     if (expandedSubject === subject) {
//       setExpandedSubject(null);
//       return;
//     }
//     setExpandedSubject(subject);

//     if (!subjectChapters[subject]) {
//       try {
//         const res = await axios.post("http://localhost:5000/chapters", {
//           class: selectedClass,
//           subjects: [subject],
//         });
//         setSubjectChapters((prev) => ({
//           ...prev,
//           [subject]: res.data,
//         }));
//       } catch (err) {
//         console.error("Error fetching chapters:", err);
//       }
//     }
//   };

//   const handleChapterChange = (chapter, subject) => {
//     if (selectedChapters.includes(chapter)) {
//       // Remove chapter from selected chapters
//       setSelectedChapters((prev) => prev.filter((c) => c !== chapter));
//     } else {
//       // Add chapter to selected chapters
//       setSelectedChapters((prev) => [...prev, chapter]);
//     }
//   };

//   const handleClassChange = (newClass) => {
//     // Reset everything when class changes
//     setSelectedClass(newClass);
//     setSelectedSubjects([]);
//     setSelectedChapters([]);
//     setSubjectChapters({});
//     setExpandedSubject(null);
    
//     // Clear localStorage for these items
//     localStorage.removeItem("selectedSubjects");
//     localStorage.removeItem("selectedChapters");
//   };

//   const isChapterSelectedForAllSubjects = () => {
//     return selectedSubjects.every((subject) => {
//       const chaptersForSubject = subjectChapters[subject] || [];
//       return chaptersForSubject.some((chapter) => selectedChapters.includes(chapter));
//     });
//   };

//   // const handleSubmit = () => {
//   //   if (!isChapterSelectedForAllSubjects()) {
//   //     alert("Please select at least one chapter for each selected subject.");
//   //     return;
//   //   }

//   //   localStorage.removeItem("submittedTest");

//   //   navigate("/test", {
//   //     state: {
//   //       class: selectedClass,
//   //       subjects: selectedSubjects,
//   //       chapters: selectedChapters,
//   //       difficulty,
//   //       time,
//   //       limit,
//   //     },
//   //   });
//   // };
//   const handleSubmit = () => {
//     if (!isChapterSelectedForAllSubjects()) {
//       alert("Please select at least one chapter for each selected subject.");
//       return;
//     }
  
//     localStorage.removeItem("submittedTest");
  
//     navigate("/test", {
//       state: {
//         class: selectedClass,
//         subjects: selectedSubjects,
//         chapters: selectedChapters,
//         difficulty, // This will be an empty string if not selected
//         time,
//         limit,
//       },
//     });
//   };

//   const goToResults = () => {
//     navigate(`/results/${user.id}`);
//   };

//   // Difficulty badge colors - using lighter colors
//   const difficultyColors = {
//     easy: "bg-green-200 text-green-800",
//     medium: "bg-yellow-200 text-yellow-800",
//     hard: "bg-red-200 text-red-800",
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen p-4 w-full">
//       <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
//         <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
//           Create Your Test
//         </h1>
        
//         {/* Class Selection */}
//         <div className="mb-6 p-4 bg-blue-50 rounded-lg">
//           <h2 className="text-xl font-semibold text-blue-700 mb-3 flex items-center">
//             <div className="bg-blue-100 text-blue-700 w-7 h-7 rounded-full flex items-center justify-center mr-2">
//               <span>1</span>
//             </div>
//             Select Class
//           </h2>
//           <select 
//             onChange={(e) => handleClassChange(e.target.value)} 
//             value={selectedClass}
//             className="w-full border border-blue-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">Select a Class</option>
//             {classes.map((cls) => (
//               <option key={cls} value={cls}>
//                 {cls}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Subjects Selection */}
//         {subjects.length > 0 && (
//           <div className="mb-6 p-4 bg-blue-50 rounded-lg">
//             <h2 className="text-xl font-semibold text-blue-700 mb-3 flex items-center">
//               <div className="bg-blue-100 text-blue-700 w-7 h-7 rounded-full flex items-center justify-center mr-2">
//                 <span>2</span>
//               </div>
//               Select Subjects
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {subjects.map((subj) => (
//                 <div 
//                   key={subj} 
//                   className={`p-4 rounded-md border ${
//                     selectedSubjects.includes(subj) 
//                       ? "border-blue-500 bg-blue-50" 
//                       : "border-gray-300 bg-white"
//                   }`}
//                 >
//                   <div className="flex items-center justify-between">
//                     <label className="flex items-center cursor-pointer">
//                       <input
//                         type="checkbox"
//                         value={subj}
//                         checked={selectedSubjects.includes(subj)}
//                         onChange={() => handleSubjectChange(subj)}
//                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                       />
//                       <span className="ml-2 text-gray-800 font-medium">{subj}</span>
//                     </label>
                    
//                     <button
//                       onClick={() => handleExpand(subj)}
//                       className={`ml-2 px-2 py-1 rounded ${
//                         expandedSubject === subj 
//                           ? "bg-blue-500 text-white" 
//                           : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                       }`}
//                     >
//                       {expandedSubject === subj ? "Hide Chapters" : "Show Chapters"}
//                     </button>
//                   </div>

//                   {/* Chapters */}
//                   {expandedSubject === subj && subjectChapters[subj] && (
//                     <div className="mt-3 pl-4 pt-2 border-t border-gray-200">
//                       <h3 className="font-medium text-gray-700 mb-2">Chapters:</h3>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
//                         {subjectChapters[subj].map((ch) => (
//                           <label key={ch} className="flex items-center py-1 cursor-pointer">
//                             <input
//                               type="checkbox"
//                               value={ch}
//                               checked={selectedChapters.includes(ch)}
//                               onChange={() => handleChapterChange(ch, subj)}
//                               className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                             />
//                             <span className="ml-2 text-gray-700">{ch}</span>
//                           </label>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Test Configuration */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//           {/* Difficulty */}
//           <div className="p-4 bg-blue-50 rounded-lg">
//             <h2 className="text-lg font-semibold text-blue-700 mb-3 flex items-center">
//               <div className="bg-blue-100 text-blue-700 w-7 h-7 rounded-full flex items-center justify-center mr-2">
//                 <span>3</span>
//               </div>
//               Difficulty
//             </h2>
//             <div className="flex flex-col gap-2">
//               {["easy", "medium", "hard"].map((level) => (
//                 <label 
//                   key={level}
//                   className={`flex items-center p-2 rounded-md cursor-pointer ${
//                     difficulty === level
//                       ? difficultyColors[level]
//                       : "bg-white border border-gray-300"
//                   }`}
//                 >
//                   <input
//                     type="radio"
//                     name="difficulty"
//                     value={level}
//                     checked={difficulty === level}
//                     onChange={() => setDifficulty(level)}
//                     className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                   />
//                   <span className="ml-2 capitalize">{level}</span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           {/* Time */}
//           <div className="p-4 bg-blue-50 rounded-lg">
//             <h2 className="text-lg font-semibold text-blue-700 mb-3 flex items-center">
//               <div className="bg-blue-100 text-blue-700 w-7 h-7 rounded-full flex items-center justify-center mr-2">
//                 <span>4</span>
//               </div>
//               Time (minutes)
//             </h2>
//             <div className="grid grid-cols-2 gap-2">
//               {["10", "15", "20", "30"].map((t) => (
//                 <label 
//                   key={t}
//                   className={`flex items-center justify-center p-2 rounded-md cursor-pointer ${
//                     time === t
//                       ? "bg-blue-200 text-blue-800"
//                       : "bg-white border border-gray-300"
//                   }`}
//                 >
//                   <input
//                     type="radio"
//                     name="time"
//                     value={t}
//                     checked={time === t}
//                     onChange={() => setTime(t)}
//                     className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                   />
//                   <span className="ml-2">{t}</span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           {/* Questions */}
//           <div className="p-4 bg-blue-50 rounded-lg">
//             <h2 className="text-lg font-semibold text-blue-700 mb-3 flex items-center">
//               <div className="bg-blue-100 text-blue-700 w-7 h-7 rounded-full flex items-center justify-center mr-2">
//                 <span>5</span>
//               </div>
//               Number of Questions
//             </h2>
//             <div className="grid grid-cols-2 gap-2">
//               {["1", "10", "15", "20"].map((l) => (
//                 <label 
//                   key={l}
//                   className={`flex items-center justify-center p-2 rounded-md cursor-pointer ${
//                     limit === l
//                       ? "bg-blue-200 text-blue-800"
//                       : "bg-white border border-gray-300"
//                   }`}
//                 >
//                   <input
//                     type="radio"
//                     name="limit"
//                     value={l}
//                     checked={limit === l}
//                     onChange={() => setLimit(l)}
//                     className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                   />
//                   <span className="ml-2">{l}</span>
//                 </label>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Selected Options Summary */}
//         {(selectedSubjects.length > 0 || difficulty || time || limit) && (
//           <div className="mb-6 p-4 bg-green-50 rounded-lg">
//             <h3 className="text-lg font-medium text-green-700 mb-2">Your Test Configuration:</h3>
//             <div className="flex flex-wrap gap-2">
//               {selectedClass && (
//                 <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
//                   Class: {selectedClass}
//                 </span>
//               )}
//               {selectedSubjects.map(subject => (
//                 <span key={subject} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
//                   {subject}
//                 </span>
//               ))}
//               {difficulty && (
//                 <span className={`px-3 py-1 ${difficultyColors[difficulty]} rounded-full text-sm`}>
//                   {difficulty}
//                 </span>
//               )}
//               {time && (
//                 <span className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-sm">
//                   {time} minutes
//                 </span>
//               )}
//               {limit && (
//                 <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
//                   {limit} questions
//                 </span>
//               )}
//             </div>
            
//             {/* Selected Chapters */}
//             {selectedChapters.length > 0 && (
//               <div className="mt-3">
//                 <h4 className="text-sm font-medium text-gray-700">Selected Chapters:</h4>
//                 <div className="flex flex-wrap gap-1 mt-1">
//                   {selectedChapters.map(chapter => (
//                     <span key={chapter} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
//                       {chapter}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Action Buttons */}
//         <div className="flex flex-col sm:flex-row gap-3 mt-6">
//           <button 
//             onClick={goToResults}
//             className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-md font-medium transition-colors duration-200 flex items-center justify-center"
//           >
//             <span className="mr-2">📊</span> View Previous Results
//           </button>
//           <button
//   onClick={handleSubmit}
//   disabled={
//     !selectedClass ||
//     !selectedSubjects.length ||
//     !selectedChapters.length ||
//     !time ||
//     !limit ||
//     !isChapterSelectedForAllSubjects()
//   }
//   className={`flex-1 py-3 px-4 rounded-md font-medium flex items-center justify-center ${
//     !selectedClass ||
//     !selectedSubjects.length ||
//     !selectedChapters.length ||
//     !time ||
//     !limit ||
//     !isChapterSelectedForAllSubjects()
//       ? "bg-blue-200 text-blue-400 cursor-not-allowed"
//       : "bg-blue-500 hover:bg-blue-600 text-white"
//   }`}
// >
//   <span className="mr-2">🚀</span> Start Test
// </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SubjectSelection; 

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// function SubjectSelection() {
//   const [classes, setClasses] = useState([]);
//   const [selectedClass, setSelectedClass] = useState(() => localStorage.getItem("selectedClass") || "");
//   const [subjects, setSubjects] = useState([]);
//   const [selectedSubjects, setSelectedSubjects] = useState(() => {
//     const saved = localStorage.getItem("selectedSubjects");
//     return saved ? JSON.parse(saved) : [];
//   });
//   const [subjectChapters, setSubjectChapters] = useState({});
//   const [expandedSubject, setExpandedSubject] = useState(null);
//   const [selectedChapters, setSelectedChapters] = useState(() => {
//     const saved = localStorage.getItem("selectedChapters");
//     return saved ? JSON.parse(saved) : [];
//   });
//   const [difficulty, setDifficulty] = useState(() => localStorage.getItem("difficulty") || "");
//   const [time, setTime] = useState(() => localStorage.getItem("time") || "");
//   const [limit, setLimit] = useState(() => localStorage.getItem("limit") || "");

//   const user = JSON.parse(localStorage.getItem("user"));
//   const navigate = useNavigate();

//   useEffect(() => {
//     axios.get("http://localhost:5000/api/classes").then((res) => setClasses(res.data));
//   }, []);

//   useEffect(() => {
//     if (selectedClass) {
//       localStorage.setItem("selectedClass", selectedClass);
//       axios.post("http://localhost:5000/api/subjects", { class: selectedClass }).then((res) => {
//         setSubjects(res.data);
//       });
//     }
//   }, [selectedClass]);

//   useEffect(() => {
//     localStorage.setItem("selectedSubjects", JSON.stringify(selectedSubjects));
    
//     // Clean up selectedChapters when subjects are deselected
//     const validChapters = selectedChapters.filter(chapter => {
//       // Check if this chapter belongs to any of the currently selected subjects
//       return selectedSubjects.some(subject => 
//         subjectChapters[subject] && subjectChapters[subject].includes(chapter)
//       );
//     });
    
//     if (JSON.stringify(validChapters) !== JSON.stringify(selectedChapters)) {
//       setSelectedChapters(validChapters);
//     }
//   }, [selectedSubjects, subjectChapters]);

//   useEffect(() => {
//     localStorage.setItem("selectedChapters", JSON.stringify(selectedChapters));
//   }, [selectedChapters]);

//   useEffect(() => {
//     if (difficulty) {
//       localStorage.setItem("difficulty", difficulty);
//     } else {
//       localStorage.removeItem("difficulty");
//     }
//   }, [difficulty]);

//   useEffect(() => {
//     if (time) {
//       localStorage.setItem("time", time);
//     } else {
//       localStorage.removeItem("time");
//     }
//   }, [time]);

//   useEffect(() => {
//     if (limit) {
//       localStorage.setItem("limit", limit);
//     } else {
//       localStorage.removeItem("limit");
//     }
//   }, [limit]);

//   const handleSubjectChange = async (subject) => {
//     const alreadySelected = selectedSubjects.includes(subject);

//     if (alreadySelected) {
//       // Remove subject from selectedSubjects
//       setSelectedSubjects((prev) => prev.filter((s) => s !== subject));
      
//       // Remove all chapters of this subject from selectedChapters
//       if (subjectChapters[subject]) {
//         setSelectedChapters((prev) => 
//           prev.filter((chapter) => !subjectChapters[subject].includes(chapter))
//         );
//       }
//     } else {
//       setSelectedSubjects((prev) => [...prev, subject]);
//       try {
//         const res = await axios.post("http://localhost:5000/api/chapters", {
//           class: selectedClass,
//           subjects: [subject],
//         });
//         setSubjectChapters((prev) => ({
//           ...prev,
//           [subject]: res.data,
//         }));
//         setExpandedSubject(subject);
//       } catch (err) {
//         console.error("Error fetching chapters:", err);
//       }
//     }
//   };

//   const handleExpand = async (subject) => {
//     if (expandedSubject === subject) {
//       setExpandedSubject(null);
//       return;
//     }
//     setExpandedSubject(subject);

//     if (!subjectChapters[subject]) {
//       try {
//         const res = await axios.post("http://localhost:5000/api/chapters", {
//           class: selectedClass,
//           subjects: [subject],
//         });
//         setSubjectChapters((prev) => ({
//           ...prev,
//           [subject]: res.data,
//         }));
//       } catch (err) {
//         console.error("Error fetching chapters:", err);
//       }
//     }
//   };

//   const handleChapterChange = (chapter, subject) => {
//     if (selectedChapters.includes(chapter)) {
//       // Remove chapter from selected chapters
//       setSelectedChapters((prev) => prev.filter((c) => c !== chapter));
//     } else {
//       // Add chapter to selected chapters
//       setSelectedChapters((prev) => [...prev, chapter]);
//     }
//   };

//   const handleClassChange = (newClass) => {
//     // Reset everything when class changes
//     setSelectedClass(newClass);
//     setSelectedSubjects([]);
//     setSelectedChapters([]);
//     setSubjectChapters({});
//     setExpandedSubject(null);
    
//     // Clear localStorage for these items
//     localStorage.removeItem("selectedSubjects");
//     localStorage.removeItem("selectedChapters");
//   };

//   // Toggle difficulty selection
//   const handleDifficultyToggle = (level) => {
//     if (difficulty === level) {
//       // If already selected, deselect it
//       setDifficulty("");
//     } else {
//       // Otherwise, select the new difficulty
//       setDifficulty(level);
//     }
//   };

//   // Toggle time selection
//   const handleTimeToggle = (value) => {
//     if (time === value) {
//       // If already selected, deselect it
//       setTime("");
//     } else {
//       // Otherwise, select the new time
//       setTime(value);
//     }
//   };

//   // Toggle limit selection
//   const handleLimitToggle = (value) => {
//     if (limit === value) {
//       // If already selected, deselect it
//       setLimit("");
//     } else {
//       // Otherwise, select the new limit
//       setLimit(value);
//     }
//   };

//   const isChapterSelectedForAllSubjects = () => {
//     return selectedSubjects.every((subject) => {
//       const chaptersForSubject = subjectChapters[subject] || [];
//       return chaptersForSubject.some((chapter) => selectedChapters.includes(chapter));
//     });
//   };

//   // const handleSubmit = () => {
//   //   if (!isChapterSelectedForAllSubjects()) {
//   //     alert("Please select at least one chapter for each selected subject.");
//   //     return;
//   //   }
  
//   //   localStorage.removeItem("submittedTest");
  
//   //   navigate("/test", {
//   //     state: {
//   //       class: selectedClass,
//   //       subjects: selectedSubjects,
//   //       chapters: selectedChapters,
//   //       difficulty, // This will be an empty string if not selected
//   //       time,
//   //       limit,
//   //     },
//   //   });
//   // };

//   const handleSubmit = () => {
//     if (!isChapterSelectedForAllSubjects()) {
//       alert("Please select at least one chapter for each selected subject.");
//       return;
//     }
  
//     // Clear both localStorage and sessionStorage test data
//     localStorage.removeItem("submittedTest");
//     sessionStorage.removeItem("testState");
  
//     navigate("/test", {
//       state: {
//         class: selectedClass,
//         subjects: selectedSubjects,
//         chapters: selectedChapters,
//         difficulty,
//         time,
//         limit,
//       },
//     });
//   };

//   const goToResults = () => {
//     navigate(`/results/${user.id}`);
//   };

//   // Difficulty badge colors - using lighter colors
//   const difficultyColors = {
//     easy: "bg-green-200 text-green-800",
//     medium: "bg-yellow-200 text-yellow-800",
//     hard: "bg-red-200 text-red-800",
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen p-4 w-full">
//       <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
//         <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
//           Create Your Test
//         </h1>
        
//         {/* Class Selection */}
//         <div className="mb-6 p-4 bg-blue-50 rounded-lg">
//           <h2 className="text-xl font-semibold text-blue-700 mb-3 flex items-center">
//             <div className="bg-blue-100 text-blue-700 w-7 h-7 rounded-full flex items-center justify-center mr-2">
//               <span>1</span>
//             </div>
//             Select Class
//           </h2>
//           <select 
//             onChange={(e) => handleClassChange(e.target.value)} 
//             value={selectedClass}
//             className="w-full border border-blue-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">Select a Class</option>
//             {classes.map((cls) => (
//               <option key={cls} value={cls}>
//                 {cls}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Subjects Selection */}
//         {subjects.length > 0 && (
//           <div className="mb-6 p-4 bg-blue-50 rounded-lg">
//             <h2 className="text-xl font-semibold text-blue-700 mb-3 flex items-center">
//               <div className="bg-blue-100 text-blue-700 w-7 h-7 rounded-full flex items-center justify-center mr-2">
//                 <span>2</span>
//               </div>
//               Select Subjects
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {subjects.map((subj) => (
//                 <div 
//                   key={subj} 
//                   className={`p-4 rounded-md border ${
//                     selectedSubjects.includes(subj) 
//                       ? "border-blue-500 bg-blue-50" 
//                       : "border-gray-300 bg-white"
//                   }`}
//                 >
//                   <div className="flex items-center justify-between">
//                     <label className="flex items-center cursor-pointer">
//                       <input
//                         type="checkbox"
//                         value={subj}
//                         checked={selectedSubjects.includes(subj)}
//                         onChange={() => handleSubjectChange(subj)}
//                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                       />
//                       <span className="ml-2 text-gray-800 font-medium">{subj}</span>
//                     </label>
                    
//                     <button
//                       onClick={() => handleExpand(subj)}
//                       className={`ml-2 px-2 py-1 rounded ${
//                         expandedSubject === subj 
//                           ? "bg-blue-500 text-white" 
//                           : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                       }`}
//                     >
//                       {expandedSubject === subj ? "Hide Chapters" : "Show Chapters"}
//                     </button>
//                   </div>

//                   {/* Chapters */}
//                   {expandedSubject === subj && subjectChapters[subj] && (
//                     <div className="mt-3 pl-4 pt-2 border-t border-gray-200">
//                       <h3 className="font-medium text-gray-700 mb-2">Chapters:</h3>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
//                         {subjectChapters[subj].map((ch) => (
//                           <label key={ch} className="flex items-center py-1 cursor-pointer">
//                             <input
//                               type="checkbox"
//                               value={ch}
//                               checked={selectedChapters.includes(ch)}
//                               onChange={() => handleChapterChange(ch, subj)}
//                               className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                             />
//                             <span className="ml-2 text-gray-700">{ch}</span>
//                           </label>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Test Configuration */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//           {/* Difficulty */}
//           <div className="p-4 bg-blue-50 rounded-lg">
//             <h2 className="text-lg font-semibold text-blue-700 mb-3 flex items-center">
//               <div className="bg-blue-100 text-blue-700 w-7 h-7 rounded-full flex items-center justify-center mr-2">
//                 <span>3</span>
//               </div>
//               Difficulty
//               {difficulty && (
//                 <button 
//                   onClick={() => setDifficulty("")}
//                   className="ml-auto text-xs text-gray-500 hover:text-gray-700"
//                 >
//                   Clear
//                 </button>
//               )}
//             </h2>
//             <div className="flex flex-col gap-2">
//               {["easy", "medium", "hard"].map((level) => (
//                 <button 
//                   key={level}
//                   onClick={() => handleDifficultyToggle(level)}
//                   className={`p-2 rounded-md text-left ${
//                     difficulty === level
//                       ? difficultyColors[level]
//                       : "bg-white border border-gray-300 hover:bg-gray-100"
//                   }`}
//                 >
//                   <span className="capitalize">{level}</span>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Time */}
//           <div className="p-4 bg-blue-50 rounded-lg">
//             <h2 className="text-lg font-semibold text-blue-700 mb-3 flex items-center">
//               <div className="bg-blue-100 text-blue-700 w-7 h-7 rounded-full flex items-center justify-center mr-2">
//                 <span>4</span>
//               </div>
//               Time (minutes)
//               {time && (
//                 <button 
//                   onClick={() => setTime("")}
//                   className="ml-auto text-xs text-gray-500 hover:text-gray-700"
//                 >
//                   Clear
//                 </button>
//               )}
//             </h2>
//             <div className="grid grid-cols-2 gap-2">
//               {["10", "15", "20", "30"].map((t) => (
//                 <button 
//                   key={t}
//                   onClick={() => handleTimeToggle(t)}
//                   className={`p-2 rounded-md ${
//                     time === t
//                       ? "bg-blue-200 text-blue-800"
//                       : "bg-white border border-gray-300 hover:bg-gray-100"
//                   }`}
//                 >
//                   {t}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Questions */}
//           <div className="p-4 bg-blue-50 rounded-lg">
//             <h2 className="text-lg font-semibold text-blue-700 mb-3 flex items-center">
//               <div className="bg-blue-100 text-blue-700 w-7 h-7 rounded-full flex items-center justify-center mr-2">
//                 <span>5</span>
//               </div>
//               Number of Questions
//               {limit && (
//                 <button 
//                   onClick={() => setLimit("")}
//                   className="ml-auto text-xs text-gray-500 hover:text-gray-700"
//                 >
//                   Clear
//                 </button>
//               )}
//             </h2>
//             <div className="grid grid-cols-2 gap-2">
//               {["1", "10", "15", "20"].map((l) => (
//                 <button 
//                   key={l}
//                   onClick={() => handleLimitToggle(l)}
//                   className={`p-2 rounded-md ${
//                     limit === l
//                       ? "bg-blue-200 text-blue-800"
//                       : "bg-white border border-gray-300 hover:bg-gray-100"
//                   }`}
//                 >
//                   {l}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Selected Options Summary */}
//         {(selectedSubjects.length > 0 || difficulty || time || limit) && (
//           <div className="mb-6 p-4 bg-green-50 rounded-lg">
//             <h3 className="text-lg font-medium text-green-700 mb-2">Your Test Configuration:</h3>
//             <div className="flex flex-wrap gap-2">
//               {selectedClass && (
//                 <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
//                   Class: {selectedClass}
//                 </span>
//               )}
//               {selectedSubjects.map(subject => (
//                 <span key={subject} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
//                   {subject}
//                 </span>
//               ))}
//               {difficulty && (
//                 <span className={`px-3 py-1 ${difficultyColors[difficulty]} rounded-full text-sm`}>
//                   {difficulty}
//                 </span>
//               )}
//               {time && (
//                 <span className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-sm">
//                   {time} minutes
//                 </span>
//               )}
//               {limit && (
//                 <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
//                   {limit} questions
//                 </span>
//               )}
//             </div>
            
//             {/* Selected Chapters */}
//             {selectedChapters.length > 0 && (
//               <div className="mt-3">
//                 <h4 className="text-sm font-medium text-gray-700">Selected Chapters:</h4>
//                 <div className="flex flex-wrap gap-1 mt-1">
//                   {selectedChapters.map(chapter => (
//                     <span key={chapter} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
//                       {chapter}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Action Buttons */}
//         <div className="flex flex-col sm:flex-row gap-3 mt-6">
//           <button 
//             onClick={goToResults}
//             className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-md font-medium transition-colors duration-200 flex items-center justify-center"
//           >
//             <span className="mr-2">📊</span> View Previous Results
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={
//               !selectedClass ||
//               !selectedSubjects.length ||
//               !selectedChapters.length ||
//               !time ||
//               !limit ||
//               !isChapterSelectedForAllSubjects()
//             }
//             className={`flex-1 py-3 px-4 rounded-md font-medium flex items-center justify-center ${
//               !selectedClass ||
//               !selectedSubjects.length ||
//               !selectedChapters.length ||
//               !time ||
//               !limit ||
//               !isChapterSelectedForAllSubjects()
//                 ? "bg-blue-200 text-blue-400 cursor-not-allowed"
//                 : "bg-blue-500 hover:bg-blue-600 text-white"
//             }`}
//           >
//             <span className="mr-2">🚀</span> Start Test
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SubjectSelection;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Simple logger implementation
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

function SubjectSelection() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(() => localStorage.getItem("selectedClass") || "");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState(() => {
    const saved = localStorage.getItem("selectedSubjects");
    return saved ? JSON.parse(saved) : [];
  });
  const [subjectChapters, setSubjectChapters] = useState({});
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [selectedChapters, setSelectedChapters] = useState(() => {
    const saved = localStorage.getItem("selectedChapters");
    return saved ? JSON.parse(saved) : [];
  });
  const [difficulty, setDifficulty] = useState(() => localStorage.getItem("difficulty") || "");
  const [time, setTime] = useState(() => localStorage.getItem("time") || "");
  const [limit, setLimit] = useState(() => localStorage.getItem("limit") || "");

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/classes").then((res) => setClasses(res.data));
  }, []);

  useEffect(() => {
    if (selectedClass) {
      localStorage.setItem("selectedClass", selectedClass);
      axios.post("http://localhost:5000/api/subjects", { class: selectedClass }).then((res) => {
        setSubjects(res.data);
      });
    }
  }, [selectedClass]);

  useEffect(() => {
    localStorage.setItem("selectedSubjects", JSON.stringify(selectedSubjects));
    
    // Clean up selectedChapters when subjects are deselected
    const validChapters = selectedChapters.filter(chapter => {
      // Check if this chapter belongs to any of the currently selected subjects
      return selectedSubjects.some(subject => 
        subjectChapters[subject] && subjectChapters[subject].includes(chapter)
      );
    });
    
    if (JSON.stringify(validChapters) !== JSON.stringify(selectedChapters)) {
      setSelectedChapters(validChapters);
    }
  }, [selectedSubjects, subjectChapters]);

  useEffect(() => {
    localStorage.setItem("selectedChapters", JSON.stringify(selectedChapters));
  }, [selectedChapters]);

  useEffect(() => {
    if (difficulty) {
      localStorage.setItem("difficulty", difficulty);
    } else {
      localStorage.removeItem("difficulty");
    }
  }, [difficulty]);

  useEffect(() => {
    if (time) {
      localStorage.setItem("time", time);
    } else {
      localStorage.removeItem("time");
    }
  }, [time]);

  useEffect(() => {
    if (limit) {
      localStorage.setItem("limit", limit);
    } else {
      localStorage.removeItem("limit");
    }
  }, [limit]);

  const handleSubjectChange = async (subject) => {
    const alreadySelected = selectedSubjects.includes(subject);

    if (alreadySelected) {
      // Remove subject from selectedSubjects
      setSelectedSubjects((prev) => prev.filter((s) => s !== subject));
      
      // Remove all chapters of this subject from selectedChapters
      if (subjectChapters[subject]) {
        setSelectedChapters((prev) => 
          prev.filter((chapter) => !subjectChapters[subject].includes(chapter))
        );
      }
    } else {
      setSelectedSubjects((prev) => [...prev, subject]);
      try {
        const res = await axios.post("http://localhost:5000/api/chapters", {
          class: selectedClass,
          subjects: [subject],
        });
        setSubjectChapters((prev) => ({
          ...prev,
          [subject]: res.data,
        }));
        setExpandedSubject(subject);
      } catch (err) {
        logger.error("Error fetching chapters:", err);
      }
    }
  };

  const handleExpand = async (subject) => {
    if (expandedSubject === subject) {
      setExpandedSubject(null);
      return;
    }
    setExpandedSubject(subject);

    if (!subjectChapters[subject]) {
      try {
        const res = await axios.post("http://localhost:5000/api/chapters", {
          class: selectedClass,
          subjects: [subject],
        });
        setSubjectChapters((prev) => ({
          ...prev,
          [subject]: res.data,
        }));
      } catch (err) {
        logger.error("Error fetching chapters:", err);
      }
    }
  };

  const handleChapterChange = (chapter, subject) => {
    if (selectedChapters.includes(chapter)) {
      // Remove chapter from selected chapters
      setSelectedChapters((prev) => prev.filter((c) => c !== chapter));
    } else {
      // Add chapter to selected chapters
      setSelectedChapters((prev) => [...prev, chapter]);
    }
  };

  const handleClassChange = (newClass) => {
    // Reset everything when class changes
    setSelectedClass(newClass);
    setSelectedSubjects([]);
    setSelectedChapters([]);
    setSubjectChapters({});
    setExpandedSubject(null);
    
    // Clear localStorage for these items
    localStorage.removeItem("selectedSubjects");
    localStorage.removeItem("selectedChapters");
  };

  // Toggle difficulty selection
  const handleDifficultyToggle = (level) => {
    if (difficulty === level) {
      // If already selected, deselect it
      setDifficulty("");
    } else {
      // Otherwise, select the new difficulty
      setDifficulty(level);
    }
  };

  // Toggle time selection
  const handleTimeToggle = (value) => {
    if (time === value) {
      // If already selected, deselect it
      setTime("");
    } else {
      // Otherwise, select the new time
      setTime(value);
    }
  };

  // Toggle limit selection
  const handleLimitToggle = (value) => {
    if (limit === value) {
      // If already selected, deselect it
      setLimit("");
    } else {
      // Otherwise, select the new limit
      setLimit(value);
    }
  };

  const isChapterSelectedForAllSubjects = () => {
    return selectedSubjects.every((subject) => {
      const chaptersForSubject = subjectChapters[subject] || [];
      return chaptersForSubject.some((chapter) => selectedChapters.includes(chapter));
    });
  };

  const handleSubmit = () => {
    if (!isChapterSelectedForAllSubjects()) {
      alert("Please select at least one chapter for each selected subject.");
      return;
    }
  
    // Clear both localStorage and sessionStorage test data
    localStorage.removeItem("submittedTest");
    sessionStorage.removeItem("testState");
  
    navigate("/test", {
      state: {
        class: selectedClass,
        subjects: selectedSubjects,
        chapters: selectedChapters,
        difficulty,
        time,
        limit,
      },
    });
  };

  const goToResults = () => {
    navigate(`/results/${user.id}`);
  };

  // Difficulty badge colors - using lighter colors
  const difficultyColors = {
    easy: "bg-green-200 text-green-800",
    medium: "bg-yellow-200 text-yellow-800",
    hard: "bg-red-200 text-red-800",
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 w-full">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
          Create Your Test
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
              Select Subjects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subjects.map((subj) => (
                <div 
                  key={subj} 
                  className={`p-4 rounded-md border ${
                    selectedSubjects.includes(subj) 
                      ? "border-blue-500 bg-blue-50" 
                      : "border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        value={subj}
                        checked={selectedSubjects.includes(subj)}
                        onChange={() => handleSubjectChange(subj)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-gray-800 font-medium">{subj}</span>
                    </label>
                    
                    <button
                      onClick={() => handleExpand(subj)}
                      className={`ml-2 px-2 py-1 rounded ${
                        expandedSubject === subj 
                          ? "bg-blue-500 text-white" 
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {expandedSubject === subj ? "Hide Chapters" : "Show Chapters"}
                    </button>
                  </div>

                  {/* Chapters */}
                  {expandedSubject === subj && subjectChapters[subj] && (
                    <div className="mt-3 pl-4 pt-2 border-t border-gray-200">
                      <h3 className="font-medium text-gray-700 mb-2">Chapters:</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                        {subjectChapters[subj].map((ch) => (
                          <label key={ch} className="flex items-center py-1 cursor-pointer">
                            <input
                              type="checkbox"
                              value={ch}
                              checked={selectedChapters.includes(ch)}
                              onChange={() => handleChapterChange(ch, subj)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-gray-700">{ch}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Test Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Difficulty */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-700 mb-3 flex items-center">
              <div className="bg-blue-100 text-blue-700 w-7 h-7 rounded-full flex items-center justify-center mr-2">
                <span>3</span>
              </div>
              Difficulty
              {difficulty && (
                <button 
                  onClick={() => setDifficulty("")}
                  className="ml-auto text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear
                </button>
              )}
            </h2>
            <div className="flex flex-col gap-2">
              {["easy", "medium", "hard"].map((level) => (
                <button 
                  key={level}
                  onClick={() => handleDifficultyToggle(level)}
                  className={`p-2 rounded-md text-left ${
                    difficulty === level
                      ? difficultyColors[level]
                      : "bg-white border border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  <span className="capitalize">{level}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Time */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-700 mb-3 flex items-center">
              <div className="bg-blue-100 text-blue-700 w-7 h-7 rounded-full flex items-center justify-center mr-2">
                <span>4</span>
              </div>
              Time (minutes)
              {time && (
                <button 
                  onClick={() => setTime("")}
                  className="ml-auto text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear
                </button>
              )}
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {["10", "15", "20", "30"].map((t) => (
                <button 
                  key={t}
                  onClick={() => handleTimeToggle(t)}
                  className={`p-2 rounded-md ${
                    time === t
                      ? "bg-blue-200 text-blue-800"
                      : "bg-white border border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Questions */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-700 mb-3 flex items-center">
              <div className="bg-blue-100 text-blue-700 w-7 h-7 rounded-full flex items-center justify-center mr-2">
                <span>5</span>
              </div>
              Number of Questions
              {limit && (
                <button 
                  onClick={() => setLimit("")}
                  className="ml-auto text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear
                </button>
              )}
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {["1", "10", "15", "20"].map((l) => (
                <button 
                  key={l}
                  onClick={() => handleLimitToggle(l)}
                  className={`p-2 rounded-md ${
                    limit === l
                      ? "bg-blue-200 text-blue-800"
                      : "bg-white border border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Options Summary */}
        {(selectedSubjects.length > 0 || difficulty || time || limit) && (
          <div className="mb-6 p-4 bg-green-50 rounded-lg">
            <h3 className="text-lg font-medium text-green-700 mb-2">Your Test Configuration:</h3>
            <div className="flex flex-wrap gap-2">
              {selectedClass && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Class: {selectedClass}
                </span>
              )}
              {selectedSubjects.map(subject => (
                <span key={subject} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  {subject}
                </span>
              ))}
              {difficulty && (
                <span className={`px-3 py-1 ${difficultyColors[difficulty]} rounded-full text-sm`}>
                  {difficulty}
                </span>
              )}
              {time && (
                <span className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-sm">
                  {time} minutes
                </span>
              )}
              {limit && (
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                  {limit} questions
                </span>
              )}
            </div>
            
            {/* Selected Chapters */}
            {selectedChapters.length > 0 && (
              <div className="mt-3">
                <h4 className="text-sm font-medium text-gray-700">Selected Chapters:</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedChapters.map(chapter => (
                    <span key={chapter} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {chapter}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button 
            onClick={goToResults}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-md font-medium transition-colors duration-200 flex items-center justify-center"
          >
            <span className="mr-2">📊</span> View Previous Results
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              !selectedClass ||
              !selectedSubjects.length ||
              !selectedChapters.length ||
              !time ||
              !limit ||
              !isChapterSelectedForAllSubjects()
            }
            className={`flex-1 py-3 px-4 rounded-md font-medium flex items-center justify-center ${
              !selectedClass ||
              !selectedSubjects.length ||
              !selectedChapters.length ||
              !time ||
              !limit ||
              !isChapterSelectedForAllSubjects()
                ? "bg-blue-200 text-blue-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            <span className="mr-2">🚀</span> Start Test
          </button>
        </div>
      </div>
    </div>
  );
}

export default SubjectSelection;