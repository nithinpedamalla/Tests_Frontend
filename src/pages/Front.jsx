// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { ChevronUp, Brain, Target, Trophy, Star } from "lucide-react";

// const Front = () => {
//   const [scrolled, setScrolled] = useState(false);
  
//   // Handle scroll effect for header
//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 10);
//     };
    
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);
  
//   // Scroll to top function
//   const scrollToTop = () => {
//     window.scrollTo({
//       top: 0,
//       behavior: 'smooth'
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
//       {/* Header - Fixed with smooth scroll effect */}
//       <header className={`fixed w-full transition-all duration-300 z-50 ${
//         scrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
//       }`}>
//         <div className="container mx-auto px-4 flex justify-between items-center">
//           <div className="flex items-center">
//             <Brain className="h-8 w-8 text-blue-600 mr-2" />
//             <span className="text-xl font-bold text-blue-800">Quiz App</span>
//           </div>
          
//           <nav className="hidden md:flex space-x-6">
//             <a href="#features" className="text-black-700 hover:text-blue-600 transition-colors">Features</a>
//             <a href="#testimonials" className="text-black-700 hover:text-blue-600 transition-colors">Testimonials</a>
//             <a href="#contact" className="text-black-700 hover:text-blue-600 transition-colors">Contact</a>
//           </nav>
          
//           <div className="flex space-x-2">
//             <Link to="/login" className="px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors font-medium">
//               Login
//             </Link>
//             <Link to="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium">
//               Signup
//             </Link>
//           </div>
//         </div>
//       </header>

//       {/* Hero Section */}
//       <section className="relative h-screen flex items-center justify-center bg-cover bg-center" style={{
//         backgroundImage: "url('/api/placeholder/1920/1080')",
//         backgroundAttachment: "fixed" // Parallax effect
//       }}>
//         {/* <div className="absolute inset-0 bg-black bg-opacity-50"></div> */}
//         <div className="absolute inset-0 bg-gray-700 bg-opacity-40"></div>

//         <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
//           <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Welcome to the Ultimate Quiz Experience</h1>
//           <p className="text-xl text-gray-200 mb-8">Challenge yourself, learn new things, and compete with friends in our interactive quiz platform.</p>
//           <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
//             <Link to="/signup" className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-500 transform hover:scale-105 transition-all duration-300 font-bold text-lg">
//               Get Started
//             </Link>
//             <a href="#features" className="px-8 py-3 bg-white text-blue-600 rounded-md hover:bg-gray-100 transition-all duration-300 font-bold text-lg">
//               Learn More
//             </a>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section id="features" className="py-20 bg-white">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800">Why Choose Our Quiz App?</h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {/* Feature Card 1 */}
//             <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 group">
//               <div className="p-4 bg-blue-100 rounded-full inline-block mb-4 group-hover:bg-blue-200 transition-colors">
//                 <Brain className="h-8 w-8 text-blue-600" />
//               </div>
//               <h3 className="text-xl font-bold mb-3 text-gray-800">Intelligent Learning</h3>
//               <p className="text-gray-600">Our algorithm adapts to your knowledge level and helps you learn efficiently.</p>
//             </div>
            
//             {/* Feature Card 2 */}
//             <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 group">
//               <div className="p-4 bg-green-100 rounded-full inline-block mb-4 group-hover:bg-green-200 transition-colors">
//                 <Target className="h-8 w-8 text-green-600" />
//               </div>
//               <h3 className="text-xl font-bold mb-3 text-gray-800">Personalized Quizzes</h3>
//               <p className="text-gray-600">Create custom quizzes or choose from thousands of pre-made questions in various categories.</p>
//             </div>
            
//             {/* Feature Card 3 */}
//             <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 group">
//               <div className="p-4 bg-purple-100 rounded-full inline-block mb-4 group-hover:bg-purple-200 transition-colors">
//                 <Trophy className="h-8 w-8 text-purple-600" />
//               </div>
//               <h3 className="text-xl font-bold mb-3 text-gray-800">Compete & Win</h3>
//               <p className="text-gray-600">Join leaderboards, earn points, and compete with friends to show off your knowledge.</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Testimonials Section */}
//       <section id="testimonials" className="py-20 bg-gray-50">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800">What Our Users Say</h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {/* Testimonial 1 */}
//             <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
//               <div className="flex mb-4">
//                 {[1, 2, 3, 4, 5].map((star) => (
//                   <Star key={star} className="h-5 w-5 text-yellow-500 fill-current" />
//                 ))}
//               </div>
//               <p className="italic text-gray-600 mb-4">"This quiz app has transformed how I study. The personalized questions help me focus on areas where I need improvement."</p>
//               <div className="flex items-center">
//                 <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-3">JD</div>
//                 <div>
//                   <p className="font-medium text-gray-800">John Doe</p>
//                   <p className="text-sm text-gray-500">Student</p>
//                 </div>
//               </div>
//             </div>
            
//             {/* Testimonial 2 */}
//             <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
//               <div className="flex mb-4">
//                 {[1, 2, 3, 4, 5].map((star) => (
//                   <Star key={star} className="h-5 w-5 text-yellow-500 fill-current" />
//                 ))}
//               </div>
//               <p className="italic text-gray-600 mb-4">"I use this app with my students and they love the competitive aspect. It's made learning so much more engaging."</p>
//               <div className="flex items-center">
//                 <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold mr-3">JS</div>
//                 <div>
//                   <p className="font-medium text-gray-800">Jane Smith</p>
//                   <p className="text-sm text-gray-500">Teacher</p>
//                 </div>
//               </div>
//             </div>
            
//             {/* Testimonial 3 */}
//             <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
//               <div className="flex mb-4">
//                 {[1, 2, 3, 4, 5].map((star) => (
//                   <Star key={star} className="h-5 w-5 text-yellow-500 fill-current" />
//                 ))}
//               </div>
//               <p className="italic text-gray-600 mb-4">"My friends and I compete weekly. The variety of topics keeps things interesting and we're all learning new facts."</p>
//               <div className="flex items-center">
//                 <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold mr-3">RJ</div>
//                 <div>
//                   <p className="font-medium text-gray-800">Robert Johnson</p>
//                   <p className="text-sm text-gray-500">Quiz Enthusiast</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Contact Section */}
//       <section id="contact" className="py-20 bg-blue-900 text-white">
//         <div className="container mx-auto px-4 text-center">
//           <h2 className="text-3xl md:text-4xl font-bold mb-8">Ready to Test Your Knowledge?</h2>
//           <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">Join thousands of users who are already expanding their knowledge and having fun with our interactive quizzes.</p>
//           <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
//             <Link to="/signup" className="px-8 py-3 bg-white text-blue-900 rounded-md hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 font-bold text-lg">
//               Sign Up Now
//             </Link>
//             <Link to="/login" className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-md hover:bg-white hover:bg-opacity-10 transition-all duration-300 font-bold text-lg">
//               Login
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-gray-800 text-gray-300 py-12">
//         <div className="container mx-auto px-4">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
//             <div>
//               <div className="flex items-center mb-4">
//                 <Brain className="h-8 w-8 text-blue-400 mr-2" />
//                 <span className="text-xl font-bold text-white">Quiz App</span>
//               </div>
//               <p className="text-gray-400 mb-4">Challenge yourself and expand your knowledge with our interactive quiz platform.</p>
//               <div className="flex space-x-4">
//                 <a href="#" className="text-gray-400 hover:text-white transition-colors">
//                   <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600">F</div>
//                 </a>
//                 <a href="#" className="text-gray-400 hover:text-white transition-colors">
//                   <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600">T</div>
//                 </a>
//                 <a href="#" className="text-gray-400 hover:text-white transition-colors">
//                   <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600">IN</div>
//                 </a>
//               </div>
//             </div>
            
//             <div>
//               <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
//               <ul className="space-y-2">
//                 <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
//                 <li><a href="#testimonials" className="text-gray-400 hover:text-white transition-colors">Testimonials</a></li>
//                 <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
//                 <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
//               </ul>
//             </div>
            
//             <div>
//               <h3 className="text-lg font-semibold mb-4 text-white">Contact</h3>
//               <ul className="space-y-2">
//                 <li className="text-gray-400">info@quizapp.com</li>
//                 <li className="text-gray-400">+1 (555) 123-4567</li>
//                 <li className="text-gray-400">123 Quiz Street, Knowledge City</li>
//               </ul>
//             </div>
//           </div>
          
//           <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
//             <p>&copy; {new Date().getFullYear()} Quiz App. All rights reserved.</p>
//           </div>
//         </div>
//       </footer>
      
//       {/* Scroll to top button */}
//       <button 
//         onClick={scrollToTop}
//         className={`fixed bottom-6 right-6 p-2 rounded-full bg-blue-600 text-white shadow-lg z-50 transition-all duration-300 ${
//           scrolled ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-10 pointer-events-none"
//         }`}
//       >
//         <ChevronUp className="h-6 w-6" />
//       </button>
//     </div>
//   );
// };

// export default Front;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronUp, Brain, Target, Trophy, Star, Menu, X, MessageCircle, Award, Users } from "lucide-react";

const Front = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Scroll to section function
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const offsetTop = section.offsetTop - 80; // Account for fixed header
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      setMobileMenuOpen(false);
    }
  };

  return (
   
  
    //   </header>
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
  {/* Header - Fixed with no top margin, sticks to the top */}
  <header className={`fixed top-0 left-0 right-0 w-full transition-all duration-300 z-50 ${
    scrolled ? "bg-white shadow-lg py-2" : "bg-white bg-opacity-90 backdrop-blur-sm py-4"
  }`}>
    <div className="container mx-auto px-4 flex justify-between items-center">
      <div className="flex items-center">
        <Brain className="h-8 w-8 text-indigo-700 mr-2" />
        <span className="text-xl font-bold text-gray-800">QuizMind</span>
      </div>
      
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex space-x-8">
        <button 
          onClick={() => scrollToSection("features")} 
          className="text-gray-700 hover:text-indigo-700 transition-colors font-medium relative group"
        >
          Features
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-700 transition-all duration-300 group-hover:w-full"></span>
        </button>
        <button 
          onClick={() => scrollToSection("testimonials")} 
          className="text-gray-700 hover:text-indigo-700 transition-colors font-medium relative group"
        >
          Testimonials
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-700 transition-all duration-300 group-hover:w-full"></span>
        </button>
        <button 
          onClick={() => scrollToSection("contact")} 
          className="text-gray-700 hover:text-indigo-700 transition-colors font-medium relative group"
        >
          Contact
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-700 transition-all duration-300 group-hover:w-full"></span>
        </button>
      </nav>
      
      {/* Auth Buttons */}
      <div className="hidden md:flex space-x-3">
        <Link to="/login" className="px-5 py-2 text-indigo-700 border border-indigo-700 rounded-full hover:bg-indigo-50 transition-colors font-medium">
          Login
        </Link>
        <Link to="/signup" className="px-5 py-2 bg-indigo-700 text-white rounded-full hover:bg-indigo-800 transition-colors font-medium shadow-md">
          Sign Up
        </Link>
      </div>
      
      {/* Mobile Menu Button */}
      <button 
        className="lg:hidden text-gray-700 hover:text-indigo-700"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>
    </div>
    
    {/* Mobile Menu */}
    <div className={`lg:hidden fixed inset-0 z-40 transform ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out`}>
      <div className="bg-white h-full w-full p-6 pt-20 flex flex-col">
        <div className="space-y-6 flex flex-col text-lg">
          <button 
            onClick={() => scrollToSection("features")} 
            className="text-gray-800 hover:text-indigo-700 transition-colors py-2 border-b border-gray-100"
          >
            Features
          </button>
          <button 
            onClick={() => scrollToSection("testimonials")} 
            className="text-gray-800 hover:text-indigo-700 transition-colors py-2 border-b border-gray-100"
          >
            Testimonials
          </button>
          <button 
            onClick={() => scrollToSection("contact")} 
            className="text-gray-800 hover:text-indigo-700 transition-colors py-2 border-b border-gray-100"
          >
            Contact
          </button>
        </div>
        
        <div className="mt-auto space-y-4">
          <Link to="/login" className="block w-full text-center px-5 py-3 text-indigo-700 border border-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors font-medium">
            Login
          </Link>
          <Link to="/signup" className="block w-full text-center px-5 py-3 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition-colors font-medium shadow-md">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  </header>

      {/* Hero Section with Animated Elements */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900"></div>
        
        {/* Animated Shapes */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
        
        {/* Dotted Grid Overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Expand Your Knowledge Through <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-300">Interactive Quizzes</span>
          </h1>
          <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto">Challenge yourself, track your progress, and compete with friends on our innovative quiz platform designed for continuous learning.</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/signup" className="px-8 py-4 bg-indigo-600 text-white rounded-full hover:bg-indigo-500 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-bold text-lg">
              Start Your Journey
            </Link>
            <button 
              onClick={() => scrollToSection("features")} 
              className="group px-8 py-4 bg-transparent border-2 border-white text-white rounded-full hover:bg-white hover:bg-opacity-10 transition-all duration-300 font-bold text-lg"
            >
              Discover Features
              <span className="inline-block transform group-hover:translate-x-2 transition-transform duration-300 ml-2">→</span>
            </button>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="text-gray-50 w-full">
            <path fill="currentColor" fill-opacity="1" d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Section with Cards and Icons */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium mb-4">POWERFUL FEATURES</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why QuizMind Stands Out</h2>
            <p className="max-w-2xl mx-auto text-gray-600">Our platform combines learning science with engaging gameplay to make knowledge acquisition both effective and enjoyable.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Feature Card 1 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-100 rounded-bl-full -mt-4 -mr-4 group-hover:bg-indigo-200 transition-colors duration-300"></div>
              <div className="relative z-10">
                <div className="p-4 bg-indigo-100 rounded-xl inline-block mb-6 group-hover:bg-indigo-200 transition-colors">
                  <Brain className="h-8 w-8 text-indigo-700" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">Adaptive Learning</h3>
                <p className="text-gray-600 mb-6">Our AI-powered system adapts difficulty based on your performance, ensuring optimal challenge and maximal knowledge retention.</p>
                <div className="flex items-center text-indigo-700 font-medium group-hover:text-indigo-600">
                  <span>Learn more</span>
                  <span className="transform group-hover:translate-x-2 transition-transform duration-300 ml-2">→</span>
                </div>
              </div>
            </div>
            
            {/* Feature Card 2 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-100 rounded-bl-full -mt-4 -mr-4 group-hover:bg-indigo-200 transition-colors duration-300"></div>
              <div className="relative z-10">
                <div className="p-4 bg-indigo-100 rounded-xl inline-block mb-6 group-hover:bg-indigo-200 transition-colors">
                  <Award className="h-8 w-8 text-indigo-700" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">Gamified Experience</h3>
                <p className="text-gray-600 mb-6">Earn badges, climb leaderboards, and unlock achievements while competing with friends in knowledge challenges.</p>
                <div className="flex items-center text-indigo-700 font-medium group-hover:text-indigo-600">
                  <span>Learn more</span>
                  <span className="transform group-hover:translate-x-2 transition-transform duration-300 ml-2">→</span>
                </div>
              </div>
            </div>
            
            {/* Feature Card 3 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-100 rounded-bl-full -mt-4 -mr-4 group-hover:bg-indigo-200 transition-colors duration-300"></div>
              <div className="relative z-10">
                <div className="p-4 bg-indigo-100 rounded-xl inline-block mb-6 group-hover:bg-indigo-200 transition-colors">
                  <Users className="h-8 w-8 text-indigo-700" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">Community Challenges</h3>
                <p className="text-gray-600 mb-6">Join topic-specific groups, participate in scheduled tournaments, and collaborate on creating community quizzes.</p>
                <div className="flex items-center text-indigo-700 font-medium group-hover:text-indigo-600">
                  <span>Learn more</span>
                  <span className="transform group-hover:translate-x-2 transition-transform duration-300 ml-2">→</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Feature Highlight */}
          <div className="mt-24 bg-gradient-to-r from-gray-100 to-indigo-50 rounded-2xl overflow-hidden shadow-xl">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/2 p-8 md:p-12">
                <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium mb-4">PREMIUM FEATURE</span>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Personalized Learning Paths</h3>
                <p className="text-gray-700 mb-6">Our algorithm analyzes your performance and suggests customized learning paths to improve your knowledge in specific areas. Track your progress with detailed analytics and visual growth charts.</p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center mt-1">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="ml-3 text-gray-600">Detailed performance analytics</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center mt-1">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="ml-3 text-gray-600">Subject-specific recommendations</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center mt-1">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="ml-3 text-gray-600">Weekly progress reports</span>
                  </li>
                </ul>
                <Link to="/signup" className="inline-block px-6 py-3 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition-colors font-medium shadow-md">
                  Explore Learning Paths
                </Link>
              </div>
              <div className="lg:w-1/2 bg-gray-200">
                <div className="h-full flex items-center justify-center">
                  <img src="/api/placeholder/600/400" alt="Analytics Dashboard" className="object-cover rounded-lg shadow-lg mx-6 my-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section with Modern Design */}
      <section id="testimonials" className="py-24 bg-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-50 rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-50 rounded-full -mb-48 -ml-48"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium mb-4">TESTIMONIALS</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Community Says</h2>
            <p className="max-w-2xl mx-auto text-gray-600">Join thousands of satisfied users who have transformed their learning experience with QuizMind.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 relative z-10">
              <div className="absolute -top-4 -right-4">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700">
                  <MessageCircle className="h-4 w-4" />
                </div>
              </div>
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-amber-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">"QuizMind has transformed how I prepare for my exams. The personalized approach helped me identify and strengthen my weak areas efficiently."</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-lg mr-4">EA</div>
                <div>
                  <p className="font-semibold text-gray-900">Emily Anderson</p>
                  <p className="text-sm text-gray-500">Graduate Student</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 relative z-10 md:mt-8">
              <div className="absolute -top-4 -right-4">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700">
                  <MessageCircle className="h-4 w-4" />
                </div>
              </div>
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-amber-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">"I use QuizMind with my high school class, and the engagement levels have skyrocketed. Students actually look forward to quiz time now!"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-lg mr-4">MR</div>
                <div>
                  <p className="font-semibold text-gray-900">Michael Rodriguez</p>
                  <p className="text-sm text-gray-500">High School Teacher</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 relative z-10">
              <div className="absolute -top-4 -right-4">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700">
                  <MessageCircle className="h-4 w-4" />
                </div>
              </div>
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-amber-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">"Our workplace team uses QuizMind for professional development. The specialized industry quizzes have been invaluable for ongoing training."</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-lg mr-4">SP</div>
                <div>
                  <p className="font-semibold text-gray-900">Sarah Patterson</p>
                  <p className="text-sm text-gray-500">Team Lead, TechCorp</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Statistics */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center bg-gray-50 p-8 rounded-xl">
              <div className="text-4xl font-bold text-indigo-700 mb-2">500K+</div>
              <p className="text-gray-600">Active Users</p>
            </div>
            <div className="text-center bg-gray-50 p-8 rounded-xl">
              <div className="text-4xl font-bold text-indigo-700 mb-2">10M+</div>
              <p className="text-gray-600">Quizzes Completed</p>
            </div>
            <div className="text-center bg-gray-50 p-8 rounded-xl">
              <div className="text-4xl font-bold text-indigo-700 mb-2">95%</div>
              <p className="text-gray-600">Satisfaction Rate</p>
            </div>
            <div className="text-center bg-gray-50 p-8 rounded-xl">
              <div className="text-4xl font-bold text-indigo-700 mb-2">50+</div>
              <p className="text-gray-600">Subject Categories</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact/CTA Section with Modern Design */}
      <section id="contact" className="py-24 relative">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-indigo-900"></div>
        
        {/* Content Container */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-12 overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-100 rounded-full -mt-16 -mr-16"></div>
            <div className="absolute left-0 bottom-0 w-32 h-32 bg-indigo-100 rounded-full -mb-16 -ml-16"></div>
            
            <div className="relative z-10 text-center mb-8">
              <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium mb-4">GET STARTED</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ready to Transform Your Learning?</h2>
              <p className="text-gray-600 max-w-xl mx-auto">Join thousands of learners who are already expanding their knowledge and having fun with our interactive quiz platform.</p>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-center space-y-4 md:space-y-0 md:space-x-6 mb-8">
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 mr-4">
                  <span className="text-xl font-bold">1</span>
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Sign Up for Free</p>
                  <p className="text-sm text-gray-600">Create your account in seconds</p>
                </div>
              </div>
              
              <div className="hidden md:block text-gray-400">→</div>
              
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 mr-4">
                  <span className="text-xl font-bold">2</span>
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Choose Your Interests</p>
                  <p className="text-sm text-gray-600">Personalize your experience</p>
                </div>
              </div>
              
              <div className="hidden md:block text-gray-400">→</div>
              
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 mr-4">
                  <span className="text-xl font-bold">3</span>
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Start Learning</p>
                  <p className="text-sm text-gray-600">Begin your knowledge journey</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/signup" className="px-8 py-4 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 shadow-lg transition-all duration-300 font-bold text-lg">
                Create Free Account
              </Link>
              <Link to="/explore" className="px-8 py-4 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-all duration-300 font-medium text-lg">
                Explore Quizzes
              </Link>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">Have questions? Contact us at <a href="mailto:support@quizmind.com" className="text-indigo-700 font-medium">support@quizmind.com</a></p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer with Improved Design */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
            <div className="md:col-span-4">
              <div className="flex items-center mb-4">
                <Brain className="h-8 w-8 text-indigo-500 mr-2" />
                <span className="text-xl font-bold text-white">QuizMind</span>
              </div>
              <p className="text-gray-400 mb-6">Expand your knowledge horizon with our interactive quiz platform designed for continuous learning and engagement.</p>
              <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <span className="text-lg font-medium">f</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <span className="text-lg font-medium">t</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <span className="text-lg font-medium">in</span>
                </a>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-4 text-white">Platform</h3>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Press</a></li>
              </ul>
            </div>
            
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-4 text-white">Resources</h3>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Knowledge Base</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">API Documentation</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Tutorials</a></li>
              </ul>
            </div>
            
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-4 text-white">Contact</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="mr-2">📧</span>
                  <span>support@quizmind.com</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">📱</span>
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">📍</span>
                  <span>123 Learning Street, Knowledge City, KN 12345</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} QuizMind. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-indigo-400 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Scroll to top button */}
      <button 
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 p-3 rounded-full bg-indigo-700 text-white shadow-lg z-50 transition-all duration-300 hover:bg-indigo-600 ${
          scrolled ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-10 pointer-events-none"
        }`}
      >
        <ChevronUp className="h-6 w-6" />
      </button>
      
      {/* Add this style for animated blobs */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: scale(1) translate(0px, 0px); }
          33% { transform: scale(1.1) translate(30px, -50px); }
          66% { transform: scale(0.9) translate(-20px, 20px); }
          100% { transform: scale(1) translate(0px, 0px); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .bg-grid-pattern {
          background-image: radial-gradient(circle, #ffffff 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
};

export default Front;