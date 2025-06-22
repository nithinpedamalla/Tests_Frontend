import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SubjectSelection from "./pages/SubjectSelection";
import Test from "./pages/Test";
import Report from "./pages/Report";
import Signup from "./pages/Signup";
import LoginPage from "./pages/LoginPage";
import Front from "./pages/Front";
import ResultsPage from "./pages/ResultsPage";
import TestLandingPage from "./pages/TestLandingPage";
import TestPreparationRequiremnts from "./pages/TestPreparationRequirements";
import "./App.css";
import TestPage from "./pages/TestPage";
import TeacherSelection from "./pages/TeacherSelection";
import TeacherQuestionPage from "./pages/TeacherQuestionPage"
//import TeacherQuestions from "./pages/TeacherQuestions"; // Adjust path as needed



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Front />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/upload" element={<Home />} />
        <Route path="/create-test" element={<TestLandingPage/>}/>
        <Route path="/test-req" element={<SubjectSelection />} />
        <Route path="/test" element={<Test />} />
        <Route path="/report" element={<Report />} />
        <Route path="/results/:userId" element={<ResultsPage />} />
        <Route path="/test-preparation" element={<TestPreparationRequiremnts/>} />
        <Route path="/test-page" element={<TestPage />} />
        <Route path="/teacher" element={<TeacherSelection />} />
        <Route path="/teacher-update" element={<TeacherQuestionPage />} />
      </Routes>
    </Router>
  );
}

export default App;
