// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Sparkles, BookOpen, Clock, Award, Brain, Star, ChevronUp, Menu, X } from "lucide-react";

// function TestLandingPage() {
//   const user = JSON.parse(localStorage.getItem("user"));
//   const navigate = useNavigate();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [showScrollTop, setShowScrollTop] = useState(false);

//   // Handle scroll to show/hide scroll-to-top button
//   useEffect(() => {
//     const handleScroll = () => {
//       setShowScrollTop(window.scrollY > 200);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const scrollToTop = () => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const testimonials = [
//     {
//       name: "Sarah Johnson",
//       role: "Math Teacher",
//       image: "/api/placeholder/80/80",
//       text: "This test creation tool has revolutionized how I assess my students. The customizable difficulty levels ensure every student is appropriately challenged!",
//       rating: 5,
//     },
//     {
//       name: "Michael Chen",
//       role: "Science Educator",
//       image: "/api/placeholder/80/80",
//       text: "I've tried many testing platforms, but this one stands out with its intuitive interface and chapter-specific questions. It's saved me countless hours!",
//       rating: 5,
//     },
//     {
//       name: "Jessica Williams",
//       role: "Language Arts Teacher",
//       image: "/api/placeholder/80/80",
//       text: "The analytics from previous tests help me understand exactly where my students need more focus. This platform has improved my teaching effectiveness.",
//       rating: 4,
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white overflow-hidden relative">
//       {/* Animated Background Elements */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         {[...Array(15)].map((_, i) => (
//           <div
//             key={i}
//             className="absolute rounded-full bg-white bg-opacity-10"
//             style={{
//               width: `${Math.random() * 300 + 50}px`,
//               height: `${Math.random() * 300 + 50}px`,
//               top: `${Math.random() * 100}%`,
//               left: `${Math.random() * 100}%`,
//               animation: `float ${Math.random() * 20 + 10}s infinite ease-in-out`,
//               animationDelay: `${Math.random() * 5}s`,
//               opacity: 0.05 + Math.random() * 0.1,
//             }}
//           />
//         ))}
//       </div>
      
//       {/* Header */}
//       <header className="relative z-10 backdrop-blur-sm bg-black bg-opacity-20 border-b border-purple-500 border-opacity-30">
//         <div className="container mx-auto px-4 py-4">
//           <div className="flex justify-between items-center">
//             <div className="flex items-center space-x-2">
//               <Brain className="h-8 w-8 text-purple-300" />
//               <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-300">TestGenius</span>
//             </div>
            
//             {/* Mobile menu button */}
//             <div className="md:hidden">
//               <button 
//                 onClick={() => setIsMenuOpen(!isMenuOpen)}
//                 className="p-2 rounded-full hover:bg-purple-700 transition-colors"
//               >
//                 {isMenuOpen ? <X /> : <Menu />}
//               </button>
//             </div>
            
//             {/* Desktop Navigation */}
//             <nav className="hidden md:flex items-center space-x-8">
//               <a href="#" className="text-purple-200 hover:text-white transition-colors">Home</a>
//               <a href="#" className="text-purple-200 hover:text-white transition-colors">Features</a>
//               <a href="#" className="text-purple-200 hover:text-white transition-colors">Pricing</a>
//               <a href="#" className="text-purple-200 hover:text-white transition-colors">Contact</a>
//               <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-px rounded-full">
//                 <button className="px-4 py-2 rounded-full bg-purple-900 hover:bg-purple-800 transition-colors">
//                   {user ? user.name : "Login"}
//                 </button>
//               </div>
//             </nav>
//           </div>
          
//           {/* Mobile Navigation */}
//           {isMenuOpen && (
//             <nav className="md:hidden pt-4 pb-2 flex flex-col space-y-4">
//               <a href="#" className="text-purple-200 hover:text-white transition-colors">Home</a>
//               <a href="#" className="text-purple-200 hover:text-white transition-colors">Features</a>
//               <a href="#" className="text-purple-200 hover:text-white transition-colors">Pricing</a>
//               <a href="#" className="text-purple-200 hover:text-white transition-colors">Contact</a>
//               <button className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-colors">
//                 {user ? user.name : "Login"}
//               </button>
//             </nav>
//           )}
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="relative z-10">
//         <div className="container mx-auto px-4 py-16 md:py-24">
//           <div className="flex justify-center">
//             <div className="text-center max-w-4xl">
//               <div className="inline-flex items-center space-x-2 mb-4 px-4 py-2 rounded-full bg-purple-800 bg-opacity-50 backdrop-blur-sm">
//                 <Sparkles className="h-5 w-5 text-yellow-300" />
//                 <span className="text-yellow-300 font-medium">Revolutionize your assessments</span>
//               </div>
              
//               <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-300">
//                 Create Your Own Test
//               </h1>
              
//               <p className="text-lg md:text-xl text-purple-200 mb-12 max-w-2xl mx-auto">
//                 Design personalized assessments that meet your exact educational needs. 
//                 Our AI-powered system ensures high-quality questions every time.
//               </p>

//               <div className="relative backdrop-blur-lg bg-white bg-opacity-10 rounded-3xl p-8 mt-8 border border-purple-500 border-opacity-30 overflow-hidden shadow-2xl">
//                 <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500 rounded-full opacity-20 blur-3xl"></div>
//                 <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
                
//                 <h2 className="text-2xl md:text-3xl font-bold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">
//                   In 3 Simple Steps!!
//                 </h2>
                
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
//                   <div className="group bg-gradient-to-br from-purple-800 to-purple-900 p-px rounded-2xl hover:from-blue-500 hover:to-purple-500 transition-all duration-500">
//                     <div className="bg-purple-900 backdrop-blur-lg h-full rounded-2xl p-6 flex flex-col items-center hover:translate-y-1 transition-transform">
//                       <div className="rounded-full bg-purple-700 p-4 mb-4 group-hover:bg-blue-600 transition-colors">
//                         <BookOpen className="h-6 w-6" />
//                       </div>
//                       <h3 className="text-xl font-bold mb-2">Step 1</h3>
//                       <p className="text-purple-200 text-center">Choose the class and subject.</p>
//                     </div>
//                   </div>
                  
//                   <div className="group bg-gradient-to-br from-purple-800 to-purple-900 p-px rounded-2xl hover:from-blue-500 hover:to-purple-500 transition-all duration-500">
//                     <div className="bg-purple-900 backdrop-blur-lg h-full rounded-2xl p-6 flex flex-col items-center hover:translate-y-1 transition-transform">
//                       <div className="rounded-full bg-purple-700 p-4 mb-4 group-hover:bg-blue-600 transition-colors">
//                         <BookOpen className="h-6 w-6" />
//                       </div>
//                       <h3 className="text-xl font-bold mb-2">Step 2</h3>
//                       <p className="text-purple-200 text-center">Select the chapters.</p>
//                     </div>
//                   </div>
                  
//                   <div className="group bg-gradient-to-br from-purple-800 to-purple-900 p-px rounded-2xl hover:from-blue-500 hover:to-purple-500 transition-all duration-500">
//                     <div className="bg-purple-900 backdrop-blur-lg h-full rounded-2xl p-6 flex flex-col items-center hover:translate-y-1 transition-transform">
//                       <div className="rounded-full bg-purple-700 p-4 mb-4 group-hover:bg-blue-600 transition-colors">
//                         <Clock className="h-6 w-6" />
//                       </div>
//                       <h3 className="text-xl font-bold mb-2">Step 3</h3>
//                       <p className="text-purple-200 text-center">Select the difficulty, time limit and number of questions.</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex flex-col sm:flex-row justify-center gap-6">
//                   <button
//                     onClick={() => navigate("/test-req")}
//                     className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-purple-900/30"
//                   >
//                     <Sparkles className="h-5 w-5" />
//                     <span className="font-bold">Create a new test</span>
//                   </button>

//                   <button
//                     onClick={() => navigate(`/results/${user.id}`)}
//                     className="px-8 py-4 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-teal-900/30"
//                   >
//                     <Award className="h-5 w-5" />
//                     <span className="font-bold">📊 View Previous Results</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//        {/* Testimonials */}
// <div className="mt-24 mb-16">
//   <h2 className="text-3xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-300">
//     What Teachers Are Saying
//   </h2>

//   <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//     {testimonials.map((testimonial, index) => (
//       <div 
//         key={index} 
//         className="bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl p-6 border border-purple-500 border-opacity-40 hover:bg-opacity-90 transition-all duration-300 transform hover:-translate-y-1"
//       >
//         <div className="flex items-center mb-4">
//           <img 
//             src={testimonial.image}
//             alt={testimonial.name}
//             className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-purple-400"
//           />
//           <div>
//             <h3 className="font-bold text-lg text-purple-800">{testimonial.name}</h3>
//             <p className="text-purple-600 text-sm">{testimonial.role}</p>
//           </div>
//         </div>

//         <p className="text-gray-800 mb-4">"{testimonial.text}"</p>

//         <div className="flex">
//           {[...Array(5)].map((_, i) => (
//             <Star 
//               key={i}
//               className={`w-5 h-5 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-500"}`}
//             />
//           ))}
//         </div>
//       </div>
//     ))}
//   </div>
// </div>

          
//           {/* Features Section */}
//           <div className="bg-white bg-opacity-5 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-purple-500 border-opacity-30 mt-16">
//             <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-300">
//               Powerful Features for Educators
//             </h2>
            
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
//               {[
//                 {
//                   icon: <Award className="h-6 w-6 text-cyan-300" />,
//                   title: "AI-Powered",
//                   desc: "Smart questions tailored to your curriculum"
//                 },
//                 {
//                   icon: <Clock className="h-6 w-6 text-pink-300" />,
//                   title: "Time-Saving",
//                   desc: "Create tests in minutes, not hours"
//                 },
//                 {
//                   icon: <BookOpen className="h-6 w-6 text-purple-300" />,
//                   title: "Curriculum-Aligned",
//                   desc: "Questions mapped to specific chapters"
//                 },
//                 {
//                   icon: <Brain className="h-6 w-6 text-yellow-300" />,
//                   title: "Adaptive",
//                   desc: "Adjusts difficulty based on student performance"
//                 }
//               ].map((feature, index) => (
//                 <div 
//                   key={index}
//                   className="bg-purple-900 bg-opacity-50 rounded-xl p-6 hover:bg-opacity-70 transition-colors flex flex-col items-center text-center"
//                 >
//                   <div className="rounded-full bg-purple-800 p-3 mb-4">
//                     {feature.icon}
//                   </div>
//                   <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
//                   <p className="text-purple-200">{feature.desc}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="relative z-10 bg-black bg-opacity-30 backdrop-blur-sm pt-16 pb-8 border-t border-purple-500 border-opacity-30">
//         <div className="container mx-auto px-4">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
//             <div>
//               <div className="flex items-center space-x-2 mb-4">
//                 <Brain className="h-8 w-8 text-purple-300" />
//                 <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-300">TestGenius</span>
//               </div>
//               <p className="text-purple-200 mb-4">
//                 Revolutionizing how educators create and administer tests with AI-powered technology.
//               </p>
//               <div className="flex space-x-4">
//                 {["twitter", "facebook", "instagram", "linkedin"].map((social) => (
//                   <a 
//                     key={social}
//                     href="#" 
//                     className="w-10 h-10 rounded-full flex items-center justify-center bg-purple-800 hover:bg-purple-700 transition-colors"
//                   >
//                     <span className="sr-only">{social}</span>
//                     <div className="w-5 h-5 bg-purple-300 rounded-sm"></div>
//                   </a>
//                 ))}
//               </div>
//             </div>
            
//             <div>
//               <h3 className="font-bold text-lg mb-4 text-white">Product</h3>
//               <ul className="space-y-2">
//                 {["Features", "Pricing", "API", "Integrations", "Documentation"].map((item) => (
//                   <li key={item}>
//                     <a href="#" className="text-purple-200 hover:text-white transition-colors">{item}</a>
//                   </li>
//                 ))}
//               </ul>
//             </div>
            
//             <div>
//               <h3 className="font-bold text-lg mb-4 text-white">Resources</h3>
//               <ul className="space-y-2">
//                 {["Blog", "Case Studies", "Webinars", "Help Center", "Community"].map((item) => (
//                   <li key={item}>
//                     <a href="#" className="text-purple-200 hover:text-white transition-colors">{item}</a>
//                   </li>
//                 ))}
//               </ul>
//             </div>
            
//             <div>
//               <h3 className="font-bold text-lg mb-4 text-white">Company</h3>
//               <ul className="space-y-2">
//                 {["About Us", "Careers", "Partners", "Contact", "Legal"].map((item) => (
//                   <li key={item}>
//                     <a href="#" className="text-purple-200 hover:text-white transition-colors">{item}</a>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
          
//           <div className="border-t border-purple-800 pt-8 mt-8 text-center text-purple-300 text-sm">
//             <p>&copy; {new Date().getFullYear()} TestGenius. All rights reserved.</p>
//           </div>
//         </div>
//       </footer>
      
//       {/* Scroll to top button */}
//       {showScrollTop && (
//         <button 
//           onClick={scrollToTop}
//           className="fixed right-6 bottom-6 w-12 h-12 rounded-full bg-purple-700 flex items-center justify-center shadow-lg z-50 hover:bg-purple-600 transition-colors"
//           aria-label="Scroll to top"
//         >
//           <ChevronUp className="w-6 h-6" />
//         </button>
//       )}
      
//       {/* Animation styles */}
//       <style jsx>{`
//         @keyframes float {
//           0%, 100% { transform: translateY(0) rotate(0deg); }
//           50% { transform: translateY(-20px) rotate(5deg); }
//         }
//       `}</style>
//     </div>
//   );
// }

// export default TestLandingPage;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, BookOpen, Clock, Award, Brain, Star, ChevronUp, Menu, X, FileText } from "lucide-react";

function TestLandingPage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  

  // Handle scroll to show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Math Teacher",
      image: "/api/placeholder/80/80",
      text: "This test creation tool has revolutionized how I assess my students. The customizable difficulty levels ensure every student is appropriately challenged!",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Science Educator",
      image: "/api/placeholder/80/80",
      text: "I've tried many testing platforms, but this one stands out with its intuitive interface and chapter-specific questions. It's saved me countless hours!",
      rating: 5,
    },
    {
      name: "Jessica Williams",
      role: "Language Arts Teacher",
      image: "/api/placeholder/80/80",
      text: "The analytics from previous tests help me understand exactly where my students need more focus. This platform has improved my teaching effectiveness.",
      rating: 4,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white bg-opacity-10"
            style={{
              width: `${Math.random() * 300 + 50}px`,
              height: `${Math.random() * 300 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 20 + 10}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.05 + Math.random() * 0.1,
            }}
          />
        ))}
      </div>
      
      {/* Header */}
      <header className="relative z-10 backdrop-blur-sm bg-black bg-opacity-20 border-b border-purple-500 border-opacity-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-purple-300" />
              <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-300">TestGenius</span>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-full hover:bg-purple-700 transition-colors"
              >
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-purple-200 hover:text-white transition-colors">Home</a>
              <a href="#" className="text-purple-200 hover:text-white transition-colors">Features</a>
              <a href="#" className="text-purple-200 hover:text-white transition-colors">Pricing</a>
              <a href="#" className="text-purple-200 hover:text-white transition-colors">Contact</a>
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-px rounded-full">
                <button className="px-4 py-2 rounded-full bg-purple-900 hover:bg-purple-800 transition-colors">
                  {user ? user.name : "Login"}
                </button>
              </div>
            </nav>
          </div>
          
          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden pt-4 pb-2 flex flex-col space-y-4">
              <a href="#" className="text-purple-200 hover:text-white transition-colors">Home</a>
              <a href="#" className="text-purple-200 hover:text-white transition-colors">Features</a>
              <a href="#" className="text-purple-200 hover:text-white transition-colors">Pricing</a>
              <a href="#" className="text-purple-200 hover:text-white transition-colors">Contact</a>
              <button className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-colors">
                {user ? user.name : "Login"}
              </button>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex justify-center">
            <div className="text-center max-w-4xl">
              <div className="inline-flex items-center space-x-2 mb-4 px-4 py-2 rounded-full bg-purple-800 bg-opacity-50 backdrop-blur-sm">
                <Sparkles className="h-5 w-5 text-yellow-300" />
                <span className="text-yellow-300 font-medium">Revolutionize your assessments</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-300">
                Create Your Own Test
              </h1>
              
              <p className="text-lg md:text-xl text-purple-200 mb-12 max-w-2xl mx-auto">
                Design personalized assessments that meet your exact educational needs. 
                Our AI-powered system ensures high-quality questions every time.
              </p>

              <div className="relative backdrop-blur-lg bg-white bg-opacity-10 rounded-3xl p-8 mt-8 border border-purple-500 border-opacity-30 overflow-hidden shadow-2xl">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500 rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
                
                <h2 className="text-2xl md:text-3xl font-bold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">
                  In 3 Simple Steps!!
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  <div className="group bg-gradient-to-br from-purple-800 to-purple-900 p-px rounded-2xl hover:from-blue-500 hover:to-purple-500 transition-all duration-500">
                    <div className="bg-purple-900 backdrop-blur-lg h-full rounded-2xl p-6 flex flex-col items-center hover:translate-y-1 transition-transform">
                      <div className="rounded-full bg-purple-700 p-4 mb-4 group-hover:bg-blue-600 transition-colors">
                        <BookOpen className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Step 1</h3>
                      <p className="text-purple-200 text-center">Choose the class and subject.</p>
                    </div>
                  </div>
                  
                  <div className="group bg-gradient-to-br from-purple-800 to-purple-900 p-px rounded-2xl hover:from-blue-500 hover:to-purple-500 transition-all duration-500">
                    <div className="bg-purple-900 backdrop-blur-lg h-full rounded-2xl p-6 flex flex-col items-center hover:translate-y-1 transition-transform">
                      <div className="rounded-full bg-purple-700 p-4 mb-4 group-hover:bg-blue-600 transition-colors">
                        <BookOpen className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Step 2</h3>
                      <p className="text-purple-200 text-center">Select the chapters.</p>
                    </div>
                  </div>
                  
                  <div className="group bg-gradient-to-br from-purple-800 to-purple-900 p-px rounded-2xl hover:from-blue-500 hover:to-purple-500 transition-all duration-500">
                    <div className="bg-purple-900 backdrop-blur-lg h-full rounded-2xl p-6 flex flex-col items-center hover:translate-y-1 transition-transform">
                      <div className="rounded-full bg-purple-700 p-4 mb-4 group-hover:bg-blue-600 transition-colors">
                        <Clock className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Step 3</h3>
                      <p className="text-purple-200 text-center">Select the difficulty, time limit and number of questions.</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <button
                    onClick={() => navigate("/test-req")}
                    className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-purple-900/30"
                  >
                    <Sparkles className="h-5 w-5" />
                    <span className="font-bold">Create a new test</span>
                  </button>

                  {/* New Import Test Button */}
                  <button
                    onClick={()=> navigate("/test-preparation")}
                    disabled={isLoading}
                    className="px-8 py-4 rounded-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-amber-900/30"
                  >
                    <FileText className="h-5 w-5" />
                    <span className="font-bold">
                    <span className="font-bold">Test Preparation</span>
                    </span>
                  </button>

                  <button
                    onClick={() => navigate(`/results/${user?.id}`)}
                    className="px-8 py-4 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-teal-900/30"
                  >
                    <Award className="h-5 w-5" />
                    <span className="font-bold">View Previous Results</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
       {/* Testimonials */}
<div className="mt-24 mb-16">
  <h2 className="text-3xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-300">
    What Teachers Are Saying
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {testimonials.map((testimonial, index) => (
      <div 
        key={index} 
        className="bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl p-6 border border-purple-500 border-opacity-40 hover:bg-opacity-90 transition-all duration-300 transform hover:-translate-y-1"
      >
        <div className="flex items-center mb-4">
          <img 
            src={testimonial.image}
            alt={testimonial.name}
            className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-purple-400"
          />
          <div>
            <h3 className="font-bold text-lg text-purple-800">{testimonial.name}</h3>
            <p className="text-purple-600 text-sm">{testimonial.role}</p>
          </div>
        </div>

        <p className="text-gray-800 mb-4">"{testimonial.text}"</p>

        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i}
              className={`w-5 h-5 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-500"}`}
            />
          ))}
        </div>
      </div>
    ))}
  </div>
</div>

          
          {/* Features Section */}
          <div className="bg-white bg-opacity-5 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-purple-500 border-opacity-30 mt-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-300">
              Powerful Features for Educators
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {
                  icon: <Award className="h-6 w-6 text-cyan-300" />,
                  title: "AI-Powered",
                  desc: "Smart questions tailored to your curriculum"
                },
                {
                  icon: <Clock className="h-6 w-6 text-pink-300" />,
                  title: "Time-Saving",
                  desc: "Create tests in minutes, not hours"
                },
                {
                  icon: <BookOpen className="h-6 w-6 text-purple-300" />,
                  title: "Curriculum-Aligned",
                  desc: "Questions mapped to specific chapters"
                },
                {
                  icon: <Brain className="h-6 w-6 text-yellow-300" />,
                  title: "Adaptive",
                  desc: "Adjusts difficulty based on student performance"
                }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="bg-purple-900 bg-opacity-50 rounded-xl p-6 hover:bg-opacity-70 transition-colors flex flex-col items-center text-center"
                >
                  <div className="rounded-full bg-purple-800 p-3 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-purple-200">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-black bg-opacity-30 backdrop-blur-sm pt-16 pb-8 border-t border-purple-500 border-opacity-30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-8 w-8 text-purple-300" />
                <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-300">TestGenius</span>
              </div>
              <p className="text-purple-200 mb-4">
                Revolutionizing how educators create and administer tests with AI-powered technology.
              </p>
              <div className="flex space-x-4">
                {["twitter", "facebook", "instagram", "linkedin"].map((social) => (
                  <a 
                    key={social}
                    href="#" 
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-purple-800 hover:bg-purple-700 transition-colors"
                  >
                    <span className="sr-only">{social}</span>
                    <div className="w-5 h-5 bg-purple-300 rounded-sm"></div>
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4 text-white">Product</h3>
              <ul className="space-y-2">
                {["Features", "Pricing", "API", "Integrations", "Documentation"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-purple-200 hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4 text-white">Resources</h3>
              <ul className="space-y-2">
                {["Blog", "Case Studies", "Webinars", "Help Center", "Community"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-purple-200 hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4 text-white">Company</h3>
              <ul className="space-y-2">
                {["About Us", "Careers", "Partners", "Contact", "Legal"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-purple-200 hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="border-t border-purple-800 pt-8 mt-8 text-center text-purple-300 text-sm">
            <p>&copy; {new Date().getFullYear()} TestGenius. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      {/* Scroll to top button */}
      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          className="fixed right-6 bottom-6 w-12 h-12 rounded-full bg-purple-700 flex items-center justify-center shadow-lg z-50 hover:bg-purple-600 transition-colors"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}
      
      {/* Animation styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
}

export default TestLandingPage;