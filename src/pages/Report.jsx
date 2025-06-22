// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
// import { Trophy, Clock, Brain, Book, ChevronRight, Award, Target } from "lucide-react";

// const Report = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const report = location.state;
//   const user = JSON.parse(localStorage.getItem("user"));

//   if (!report) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-100 to-purple-100">
//         <div className="animate-bounce mb-6">
//           <Brain size={64} className="text-blue-600" />
//         </div>
//         <h2 className="text-xl font-semibold mb-4 text-gray-800">No report available.</h2>
//         <button
//           onClick={() => navigate("/")}
//           className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all shadow-lg flex items-center"
//         >
//           <ChevronRight size={18} className="mr-2" /> Go Home
//         </button>
//       </div>
//     );
//   }

//   const { subjects, chapters, totalQuestions, correctAnswers, timeTaken } = report;
//   const wrongAnswers = totalQuestions - correctAnswers;
//   const accuracy = ((correctAnswers / totalQuestions) * 100).toFixed(2);
//   const goToResults = () => {
//     navigate(`/results/${user.id}`);
//   };

//   // Data for pie chart
//   const pieData = [
//     { name: "Correct", value: correctAnswers, color: "#4ADE80" },
//     { name: "Wrong", value: wrongAnswers, color: "#FB7185" },
//   ];

//   // Data for bar chart
//   const barData = [
//     { name: "Accuracy", value: parseFloat(accuracy), color: "#60A5FA" },
//     { name: "Error", value: (100 - parseFloat(accuracy)), color: "#F87171" },
//   ];

//   // Calculate grade and message
//   let grade, gradeColor, message;
//   if (accuracy >= 90) {
//     grade = "A+";
//     gradeColor = "text-green-500";
//     message = "Exceptional performance!";
//   } else if (accuracy >= 80) {
//     grade = "A";
//     gradeColor = "text-green-500";
//     message = "Excellent work!";
//   } else if (accuracy >= 70) {
//     grade = "B";
//     gradeColor = "text-blue-500";
//     message = "Good job!";
//   } else if (accuracy >= 60) {
//     grade = "C";
//     gradeColor = "text-yellow-500";
//     message = "Satisfactory result.";
//   } else if (accuracy >= 50) {
//     grade = "D";
//     gradeColor = "text-orange-500";
//     message = "Needs improvement.";
//   } else {
//     grade = "F";
//     gradeColor = "text-red-500";
//     message = "Significant practice needed.";
//   }

//   // Time efficiency calculation
//   const timePerQuestion = (timeTaken / totalQuestions).toFixed(1);

//   return (
//     <div className="max-w-4xl mx-auto my-8 overflow-hidden">
//       <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-xl p-6 shadow-lg">
//         <h2 className="text-3xl font-bold text-white text-center flex items-center justify-center">
//           <Trophy className="mr-3" size={32} />
//           Your Test Report
//           <Trophy className="ml-3" size={32} />
//         </h2>
//         <p className="text-blue-100 text-center mt-2">Completed on {new Date().toLocaleDateString()}</p>
//       </div>
      
//       <div className="bg-white rounded-b-xl shadow-xl p-6 border-t-0">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* Left column - Details */}
//           <div className="space-y-4">
//             <div className="bg-blue-50 p-5 rounded-lg shadow-md">
//               <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
//                 <Book className="mr-2" size={20} /> Test Overview
//               </h3>
              
//               <div className="space-y-3 text-gray-700">
//                 <div className="flex items-center p-2 bg-white rounded">
//                   <span className="font-semibold text-gray-800 w-40">Subjects:</span>
//                   <span className="bg-purple-100 px-3 py-1 rounded-full text-purple-700">
//                     {Array.isArray(subjects)
//                       ? subjects.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" & ")
//                       : subjects}
//                   </span>
//                 </div>

//                 <div className="flex items-center p-2 bg-white rounded">
//                   <span className="font-semibold text-gray-800 w-40">Chapters:</span>
//                   <span className="bg-blue-100 px-3 py-1 rounded-full text-blue-700">
//                     {Array.isArray(chapters) ? chapters.join(", ") : chapters}
//                   </span>
//                 </div>

//                 <div className="flex items-center p-2 bg-white rounded">
//                   <span className="font-semibold text-gray-800 w-40">Total Questions:</span>
//                   <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-700">{totalQuestions}</span>
//                 </div>

//                 <div className="flex items-center p-2 bg-white rounded">
//                   <span className="font-semibold text-gray-800 w-40">Correct Answers:</span>
//                   <span className="bg-green-100 px-3 py-1 rounded-full text-green-700">{correctAnswers}</span>
//                 </div>

//                 <div className="flex items-center p-2 bg-white rounded">
//                   <span className="font-semibold text-gray-800 w-40">Wrong Answers:</span>
//                   <span className="bg-red-100 px-3 py-1 rounded-full text-red-700">{wrongAnswers}</span>
//                 </div>

//                 <div className="flex items-center p-2 bg-white rounded">
//                   <span className="font-semibold text-gray-800 w-40">Time Taken:</span>
//                   <span className="flex items-center bg-yellow-100 px-3 py-1 rounded-full text-yellow-700">
//                     <Clock size={16} className="mr-1" /> {timeTaken} seconds
//                   </span>
//                 </div>
                
//                 <div className="flex items-center p-2 bg-white rounded">
//                   <span className="font-semibold text-gray-800 w-40">Time per Question:</span>
//                   <span className="bg-yellow-100 px-3 py-1 rounded-full text-yellow-700">
//                     {timePerQuestion} seconds
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-5 rounded-lg shadow-md">
//               <h3 className="text-xl font-semibold text-blue-800 mb-3 flex items-center">
//                 <Award className="mr-2" size={20} /> Your Grade
//               </h3>
//               <div className="flex justify-between items-center">
//                 <div className={`text-6xl font-bold ${gradeColor}`}>{grade}</div>
//                 <div className="text-center">
//                   <div className="text-xl font-semibold text-gray-700">
//                     Accuracy: {accuracy}%
//                   </div>
//                   <div className="text-sm text-gray-600 mt-1">{message}</div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right column - Charts */}
//           <div className="space-y-6">
//             <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200">
//               <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
//                 <Target className="mr-2" size={20} /> Performance Analysis
//               </h3>
              
//               <div className="h-64">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={pieData}
//                       cx="50%"
//                       cy="50%"
//                       innerRadius={60}
//                       outerRadius={80}
//                       paddingAngle={5}
//                       dataKey="value"
//                       label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                     >
//                       {pieData.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={entry.color} />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
            
//             <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200">
//               <h3 className="text-xl font-semibold text-gray-800 mb-4">Accuracy Breakdown</h3>
//               <div className="h-48">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={barData}>
//                     <XAxis dataKey="name" />
//                     <YAxis />
//                     <Tooltip />
//                     <Bar dataKey="value" radius={[10, 10, 0, 0]}>
//                       {barData.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={entry.color} />
//                       ))}
//                     </Bar>
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
//           <button
//             onClick={() => {
//               // Clear all relevant selections
//               localStorage.removeItem("selectedClass");
//               localStorage.removeItem("selectedSubjects");
//               localStorage.removeItem("selectedChapters");
//               localStorage.removeItem("difficulty");
//               localStorage.removeItem("time");
//               localStorage.removeItem("limit");
//               localStorage.removeItem("submittedTest");

//               navigate("/test-req");
//             }}
//             className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all shadow-lg flex items-center justify-center"
//           >
//             <Brain size={18} className="mr-2" /> Take New Test
//           </button>
          
//           <button
//             onClick={goToResults}
//             className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-purple-800 transform hover:scale-105 transition-all shadow-lg flex items-center justify-center"
//           >
//             <Award size={18} className="mr-2" /> View Previous Results
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Report;
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { Trophy, Clock, Brain, Book, ChevronRight, Award, Target, ArrowLeft } from "lucide-react";

const Report = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const report = location.state;
  const user = JSON.parse(localStorage.getItem("user"));

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-100 to-purple-100">
        <div className="animate-bounce mb-6">
          <Brain size={64} className="text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">No report available.</h2>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all shadow-lg flex items-center"
        >
          <ArrowLeft size={18} className="mr-2" /> Go Home
        </button>
      </div>
    );
  }

  const { subjects, chapters, totalQuestions, correctAnswers, timeTaken } = report;
  const wrongAnswers = totalQuestions - correctAnswers;
  const accuracy = ((correctAnswers / totalQuestions) * 100).toFixed(2);
  const goToResults = () => {
    navigate(`/results/${user.id}`);
  };

  // Data for pie chart - removed labels
  const pieData = [
    { name: "✓", value: correctAnswers, color: "#4ADE80" },
    { name: "✗", value: wrongAnswers, color: "#FB7185" },
  ];

  // Data for bar chart
  const barData = [
    { name: "Accuracy", value: parseFloat(accuracy), color: "#60A5FA" },
    { name: "Error", value: (100 - parseFloat(accuracy)), color: "#F87171" },
  ];

  // Calculate grade and message
  let grade, gradeColor, message;
  if (accuracy >= 90) {
    grade = "A+";
    gradeColor = "text-green-500";
    message = "Exceptional performance!";
  } else if (accuracy >= 80) {
    grade = "A";
    gradeColor = "text-green-500";
    message = "Excellent work!";
  } else if (accuracy >= 70) {
    grade = "B";
    gradeColor = "text-blue-500";
    message = "Good job!";
  } else if (accuracy >= 60) {
    grade = "C";
    gradeColor = "text-yellow-500";
    message = "Satisfactory result.";
  } else if (accuracy >= 50) {
    grade = "D";
    gradeColor = "text-orange-500";
    message = "Needs improvement.";
  } else {
    grade = "F";
    gradeColor = "text-red-500";
    message = "Significant practice needed.";
  }

  // Time efficiency calculation
  const timePerQuestion = (timeTaken / totalQuestions).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 rounded-t-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-white rounded-full"></div>
            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-white rounded-full"></div>
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white/30 p-3 rounded-full">
                <Trophy size={40} className="text-white" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center">Your Test Report</h2>
            <p className="text-blue-100 text-center mt-2 flex items-center justify-center">
              <Clock size={16} className="mr-2" />
              Completed on {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="bg-white rounded-b-2xl shadow-xl p-6 md:p-8 border-t-0">
          {/* Score Summary Card */}
          <div className="mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-5 rounded-xl shadow-lg border border-blue-100">
              <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center justify-center">
                <Award className="mr-2" size={24} /> Your Performance
              </h3>
              
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <div className="flex flex-col sm:flex-row items-center mb-4 sm:mb-0">
                  <div className={`text-7xl font-bold ${gradeColor} mb-3 sm:mb-0 sm:mr-6`}>{grade}</div>
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-gray-700">
                      {accuracy}%
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{message}</div>
                  </div>
                </div>
                
                <div className="flex flex-row sm:flex-col justify-center gap-3 sm:gap-2">
                  <div className="bg-green-100 px-4 py-2 rounded-lg shadow-sm border border-green-200 flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm font-medium text-green-800">Correct: {correctAnswers}</span>
                  </div>
                  <div className="bg-red-100 px-4 py-2 rounded-lg shadow-sm border border-red-200 flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <span className="text-sm font-medium text-red-800">Wrong: {wrongAnswers}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Left column - Details */}
            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-xl shadow-md border border-blue-100">
                <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
                  <Book className="mr-2" size={20} /> Test Overview
                </h3>
                
                <div className="space-y-3 text-gray-700">
                  <div className="flex flex-col sm:flex-row sm:items-center p-3 bg-white rounded-lg shadow-sm">
                    <span className="font-semibold text-gray-800 w-full sm:w-40 mb-1 sm:mb-0">Subjects:</span>
                    <div className="flex-1">
                      <span className="bg-purple-100 px-3 py-1 rounded-full text-purple-700 inline-block">
                        {Array.isArray(subjects)
                          ? subjects.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" & ")
                          : subjects}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center p-3 bg-white rounded-lg shadow-sm">
                    <span className="font-semibold text-gray-800 w-full sm:w-40 mb-1 sm:mb-0">Chapters:</span>
                    <div className="flex-1">
                      <span className="bg-blue-100 px-3 py-1 rounded-full text-blue-700 inline-block">
                        {Array.isArray(chapters) ? chapters.join(", ") : chapters}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center p-3 bg-white rounded-lg shadow-sm">
                    <span className="font-semibold text-gray-800 w-full sm:w-40 mb-1 sm:mb-0">Total Questions:</span>
                    <div className="flex-1">
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-700 inline-block">{totalQuestions}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center p-3 bg-white rounded-lg shadow-sm">
                    <span className="font-semibold text-gray-800 w-full sm:w-40 mb-1 sm:mb-0">Time Taken:</span>
                    <div className="flex-1">
                      <span className="flex items-center bg-yellow-100 px-3 py-1 rounded-full text-yellow-700 inline-block">
                        <Clock size={16} className="mr-1" /> {timeTaken} seconds
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center p-3 bg-white rounded-lg shadow-sm">
                    <span className="font-semibold text-gray-800 w-full sm:w-40 mb-1 sm:mb-0">Time per Question:</span>
                    <div className="flex-1">
                      <span className="bg-yellow-100 px-3 py-1 rounded-full text-yellow-700 inline-block">
                        {timePerQuestion} seconds
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - Charts */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Target className="mr-2" size={20} /> Performance Analysis
                </h3>
                
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({name, value}) => `${name}: ${value}`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} questions`, null]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center mt-2 text-sm">
                  <div className="flex items-center mr-4">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                    <span>Correct</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-400 mr-1"></div>
                    <span>Wrong</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Accuracy Breakdown</h3>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
                      <Tooltip formatter={(value) => [`${value}%`, null]} />
                      <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                        {barData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => {
                // Clear all relevant selections
                localStorage.removeItem("selectedClass");
                localStorage.removeItem("selectedSubjects");
                localStorage.removeItem("selectedChapters");
                localStorage.removeItem("difficulty");
                localStorage.removeItem("time");
                localStorage.removeItem("limit");
                localStorage.removeItem("submittedTest");

                navigate("/test-req");
              }}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all shadow-lg flex items-center justify-center"
            >
              <Brain size={20} className="mr-2" /> Take New Test
            </button>
            
            <button
              onClick={goToResults}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-4 rounded-xl hover:from-purple-700 hover:to-purple-800 transform hover:scale-105 transition-all shadow-lg flex items-center justify-center"
            >
              <Award size={20} className="mr-2" /> View Previous Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;