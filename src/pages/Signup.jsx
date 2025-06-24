import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "student",
  });
  const [scrollPosition, setScrollPosition] = useState(0);
  const [glitchEffect, setGlitchEffect] = useState(false);

  const navigate = useNavigate();

  // Handle scroll for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Trigger glitch effect periodically
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 200);
    }, 3000);
    return () => clearInterval(glitchInterval);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    const API_URL="https://tests-backend-yiwk.onrender.com";
    try {
      await axios.post(`${API_URL}/api/signup`, formData);
      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Signup failed.");
    }
  };

  return (
    <div className="font-mono text-white bg-white overflow-x-hidden"> 
      {/* Fixed Header with Smooth Scroll */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-black bg-opacity-80 border-b border-cyan-500">
        <div className="container mx-auto flex justify-between items-center p-4">
          <div className="flex items-center">
            <div className={`text-cyan-400 text-2xl font-bold ${glitchEffect ? 'animate-pulse' : ''}`}>
              <span className="text-pink-500"></span>
            </div>
          </div>
          <nav className="hidden md:flex space-x-6">
            {["Home", "Courses", "About", "Contact"].map((item) => (
              <a 
                key={item} 
                href="#" 
                className="text-gray-300 hover:text-cyan-400 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-pink-500 hover:after:w-full after:transition-all after:duration-300"
              >
                {item}
              </a>
            ))}
          </nav>
          <div className="md:hidden">
            <button className="text-cyan-400 hover:text-pink-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {/* <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /> */}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with parallax effect */}
      <div 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          // backgroundImage: "url('/api/placeholder/1920/1080')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900 to-black opacity-90"></div>
        
        {/* Animated grid background */}
        <div className="absolute inset-0">
          <div className="grid-bg h-full w-full opacity-20"></div>
        </div>

        {/* Animated cyberpunk lines */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="cyber-lines"></div>
        </div>

        {/* Main content */}
        <div className="container mx-auto px-4 z-10 flex flex-col md:flex-row items-center justify-between">
          {/* Left side - Hero text */}
          <div className="w-full md:w-1/2 mb-12 md:mb-0 text-center md:text-left">
            <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${glitchEffect ? 'animate-pulse' : ''}`}>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">
                Join The Digital Revolution
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Create your account now and access cutting-edge learning experiences
            </p>
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              <button className="relative px-8 py-4 bg-black rounded-lg leading-none flex items-center">
                <span className="text-gray-100 group-hover:text-white transition duration-200 text-lg">Explore Features</span>
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  {/* <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path> */}
                </svg>
              </button>
            </div>
          </div>

          {/* Right side - Signup form */}
          <div className="w-full md:w-1/2 max-w-md mx-auto">
            <div className={`relative backdrop-blur-lg bg-black bg-opacity-50 border border-cyan-500 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] p-8 ${glitchEffect ? 'translate-x-1' : ''}`}>
              <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-bl from-pink-500 to-cyan-500 transform rotate-45 translate-x-8 -translate-y-8"></div>
              <div className="absolute bottom-0 left-0 h-16 w-16 bg-gradient-to-tr from-pink-500 to-cyan-500 transform rotate-45 -translate-x-8 translate-y-8"></div>
              
              <h2 className="text-3xl font-bold text-center mb-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">Create Account</span>
              </h2>
              <p className="text-center text-gray-400 mb-8">Connect to the network 🔌</p>

              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 focus:border-cyan-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200 hover:bg-gray-800 placeholder-gray-500"
                    type="text"
                    name="username"
                    placeholder="Enter username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 focus:border-cyan-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200 hover:bg-gray-800 placeholder-gray-500"
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {/* <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /> */}
                    </svg>
                  </div>
                  <select
                    name="role"
                    className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 focus:border-cyan-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200 hover:bg-gray-800 text-gray-300 appearance-none"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      {/* <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /> */}
                    </svg>
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-cyan-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <button 
                    className="relative w-full bg-gray-900 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform group-hover:scale-[1.01] focus:outline-none group-hover:shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                    onClick={handleSignup}
                  >
                    <span className="flex items-center justify-center">
                      <span>Register</span>
                      <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {/* <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /> */}
                      </svg>
                    </span>
                  </button>
                </div>
              </form>

              <div className="mt-8 text-center text-gray-400">
                Already a User?{" "}
                <a href="/login" className="text-cyan-400 hover:text-pink-500 font-medium transition-colors duration-200 border-b border-dashed border-cyan-400 hover:border-pink-500">
                  Login
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Animated circles */}
        <div className="absolute top-1/4 left-10 w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-300 opacity-20 blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-10 w-32 h-32 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 opacity-20 blur-xl animate-pulse delay-1000"></div>
      </div>

      {/* Footer */}
      <footer className="relative bg-black border-t border-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-cyan-400 text-xl font-bold">
                <span className="text-pink-500"></span>
              </div>
              <p className="text-gray-500 mt-2">Access the future of education</p>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-end space-x-6">
              {["Terms", "Privacy", "Support", "FAQ"].map((item) => (
                <a key={item} href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-200">
                  {item}
                </a>
              ))}
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-500 text-sm mb-4 md:mb-0">
              © 2025 . All rights reserved.
            </div>
            
            <div className="flex space-x-4">
              {["facebook", "twitter", "instagram", "github"].map((social) => (
                <a 
                  key={social} 
                  href="#" 
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 transform hover:scale-110"
                >
                  <span className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      {/* <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z"/> */}
                    </svg>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .grid-bg {
          background-image: linear-gradient(to right, rgba(6, 182, 212, 0.1) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(6, 182, 212, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
          animation: grid-move 15s linear infinite;
        }
        
        @keyframes grid-move {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 20px 20px;
          }
        }
        
        .cyber-lines {
          background: repeating-linear-gradient(
            90deg,
            transparent,
            transparent 20px,
            rgba(6, 182, 212, 0.05) 20px,
            rgba(6, 182, 212, 0.05) 21px
          );
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          animation: scan 2s linear infinite;
        }
        
        @keyframes scan {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(20px);
          }
        }
      `}</style>
    </div>
  );
}