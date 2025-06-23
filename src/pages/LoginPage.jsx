import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const [role, setRole] = useState("student");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }
    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        username,
        password,
      });
      const user = res.data.user;
      if (user.role !== role) {
        alert("User role mismatch.");
        return;
      }
      localStorage.removeItem("selectedClass");
      localStorage.removeItem("selectedSubjects");
      localStorage.removeItem("selectedChapters");
      localStorage.removeItem("selectedDifficulty");
      localStorage.removeItem("selectedTime");
      localStorage.removeItem("selectedLimit");
      localStorage.setItem("user", JSON.stringify(user));
      navigate(user.role === "teacher" ? "/upload" : "/create-test");
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex flex-col">
      <header className="fixed w-full bg-white shadow-md z-50 py-4 px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-700">NNIIT</h1>
        <nav className="space-x-6">
          <a href="#" className="text-gray-700 hover:text-purple-700 transition">Home</a>
          <a href="#" className="text-gray-700 hover:text-purple-700 transition">About</a>
          <a href="#" className="text-gray-700 hover:text-purple-700 transition">Contact</a>
        </nav>
      </header>

      <section className="flex-grow flex items-center justify-center pt-20">
        <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-md">
          <h2 className="text-3xl font-semibold text-center text-purple-700 mb-6">Login</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-gray-700">Role:</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition"
            >
              Login
            </button>
          </form>
          <p className="mt-4 text-center text-gray-600">
            Don’t have an account? <Link to="/signup" className="text-purple-600 hover:underline">Sign up here</Link>
          </p>
        </div>
      </section>

      <footer className="bg-white shadow-inner mt-10 py-4 text-center text-gray-500 text-sm">
        © 2025 . All rights reserved.
        <div className="mt-2 space-x-4">
          <a href="#" className="hover:text-purple-600">Twitter</a>
          <a href="#" className="hover:text-purple-600">LinkedIn</a>
          <a href="#" className="hover:text-purple-600">GitHub</a>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
