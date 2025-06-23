

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Upload, BookOpen, ArrowRight, Check, AlertCircle } from "lucide-react";
const API_URL="https://tests-backend-yiwk.onrender.com";

// Simple logger implementation
const logger = {
  error: (message, data) => {
    // Log error messages
    if (data) {
      // eslint-disable-next-line no-console
      console.error(`[ERROR] ${message}`, data);
    } else {
      // eslint-disable-next-line no-console
      console.error(`[ERROR] ${message}`);
    }
  },
  info: (message) => {
    // eslint-disable-next-line no-console
    console.info(`[INFO] ${message}`);
  },
  warn: (message) => {
    // eslint-disable-next-line no-console
    console.warn(`[WARN] ${message}`);
  }
};

const Home = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadStatus(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setUploadStatus(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus({ success: false, message: "Please select an Excel file" });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`${API_URL}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadStatus({ success: true, message: "File uploaded successfully!" });
      logger.info(`File "${file.name}" uploaded successfully`);
    } catch (error) {
      setUploadStatus({ success: false, message: "Error uploading file" });
      logger.error("Error uploading file", error);
    } finally {
      setIsUploading(false);
    }
  };

  // Background animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      const r = Math.floor(Math.random() * 255);
      const g = Math.floor(Math.random() * 255);
      const b = Math.floor(Math.random() * 255);
      document.documentElement.style.setProperty(
        '--subtle-bg-color', 
        `rgba(${r}, ${g}, ${b}, 0.05)`
      );
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center p-4">
      <div className="relative overflow-hidden bg-black bg-opacity-30 backdrop-blur-lg rounded-xl shadow-2xl p-8 w-full max-w-2xl border border-white border-opacity-20">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-white bg-opacity-10"
              style={{
                width: `${Math.random() * 200 + 50}px`,
                height: `${Math.random() * 200 + 50}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 10 + 10}s infinite ease-in-out`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: Math.random() * 0.3
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
              ExcelEase Portal
            </h1>
            <p className="text-blue-200">Upload your Excel data and transform your teaching experience</p>
          </div>

          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 mb-6 ${
              isDragging 
                ? "border-blue-400 bg-blue-900 bg-opacity-30" 
                : file 
                  ? "border-green-400 bg-green-900 bg-opacity-20" 
                  : "border-gray-500 hover:border-blue-300 bg-black bg-opacity-20"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center">
              <Upload className={`w-16 h-16 mb-4 ${file ? "text-green-400" : "text-blue-400"}`} />
              
              {file ? (
                <div className="text-green-300 mb-2">
                  <p className="font-medium text-lg">{file.name}</p>
                  <p>{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              ) : (
                <p className="text-blue-200 mb-2">
                  Drag & drop your Excel file here, or click to browse
                </p>
              )}
              
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".xlsx, .xls"
                id="fileInput"
              />
              <label
                htmlFor="fileInput"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all cursor-pointer flex items-center space-x-2 mt-2"
              >
                <Upload className="w-4 h-4" />
                <span>Select File</span>
              </label>
            </div>
          </div>

          {uploadStatus && (
            <div className={`p-4 rounded-lg mb-6 flex items-center ${
              uploadStatus.success 
                ? "bg-green-900 bg-opacity-30 text-green-300 border border-green-500" 
                : "bg-red-900 bg-opacity-30 text-red-300 border border-red-500"
            }`}>
              {uploadStatus.success ? (
                <Check className="w-5 h-5 mr-2 text-green-400" />
              ) : (
                <AlertCircle className="w-5 h-5 mr-2 text-red-400" />
              )}
              <span>{uploadStatus.message}</span>
            </div>
          )}

          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <button
              onClick={handleUpload}
              disabled={isUploading || !file}
              className={`flex-1 py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition-all ${
                isUploading 
                  ? "bg-blue-800 text-blue-300 cursor-not-allowed" 
                  : file 
                    ? "bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white shadow-lg hover:shadow-blue-900/50" 
                    : "bg-blue-800 text-blue-300 cursor-not-allowed"
              }`}
            >
              {isUploading ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  <span>Upload Excel</span>
                </>
              )}
            </button>

            <button
              onClick={() => navigate("/teacher")}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white rounded-lg flex items-center justify-center space-x-2 shadow-lg hover:shadow-purple-900/50 transition-all"
            >
              <BookOpen className="w-5 h-5" />
              <span>Teacher Dashboard</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-blue-200 text-opacity-70">
          <p className="text-sm">Secure, reliable Excel processing for educators</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        :root {
          --subtle-bg-color: rgba(100, 120, 255, 0.05);
        }
      `}</style>
    </div>
  );
};

export default Home;