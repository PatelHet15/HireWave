import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Search, Briefcase, Star, ArrowRight, CheckCircle, BarChart, Clock } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const HeroSection = () => {
  const { user } = useSelector((state) => state.auth);
  const isStudent = user?.role === "student";
  
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const bubbleVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.5, delay: 0.6 },
    },
  };

  const featureCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: 0.3 + custom * 0.1 },
    }),
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
      className="relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          variants={bubbleVariants}
          className="absolute -top-20 right-1/3 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"
        ></motion.div>
        <motion.div
          variants={bubbleVariants}
          className="absolute bottom-10 left-1/4 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"
        ></motion.div>
        <motion.div
          variants={bubbleVariants}
          className="absolute top-40 right-10 w-48 h-48 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"
        ></motion.div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto w-full py-16 px-4 sm:px-6 lg:px-8 relative z-10">
        {!user ? (
          // **Guest View (Before Login)**
          <>
            {/* Left: Content */}
            <motion.div
              variants={itemVariants}
              className="w-full md:w-1/2 space-y-8 md:pr-8"
            >
              <div className="space-y-6">
                <motion.div
                  variants={itemVariants}
                  className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100"
                >
                  <span className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-1.5" fill="#fbbf24" />
                    <span className="text-blue-700 font-medium text-sm">The #1 Job Platform for Professionals</span>
                  </span>
                </motion.div>

                <motion.h1
                  variants={itemVariants}
                  className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight"
                >
                  Find Your{" "}
                  <span className="relative inline-block">
                    Dream
                    <span className="absolute inset-x-0 bottom-0 h-3 bg-blue-200 opacity-50 -rotate-1"></span>
                  </span>{" "}
                  Job with{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
                    HireWave
                  </span>
                </motion.h1>

                <motion.p
                  variants={itemVariants}
                  className="text-xl text-gray-600 max-w-xl leading-relaxed"
                >
                  Connect with top companies, explore exciting opportunities, and take the next step in your career journey with personalized job matches.
                </motion.p>
              </div>

              {/* Features Cards */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-2 gap-4 my-8"
              >
                <motion.div
                  custom={0}
                  variants={featureCardVariants}
                  className="flex items-start space-x-3 p-4 rounded-lg bg-white shadow-sm border border-gray-100 hover:border-blue-100 hover:shadow-md transition-all duration-200"
                >
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Search className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Smart Search</h3>
                    <p className="text-sm text-gray-500">Find relevant jobs instantly</p>
                  </div>
                </motion.div>
                
                <motion.div
                  custom={1}
                  variants={featureCardVariants}
                  className="flex items-start space-x-3 p-4 rounded-lg bg-white shadow-sm border border-gray-100 hover:border-blue-100 hover:shadow-md transition-all duration-200"
                >
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Briefcase className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Top Companies</h3>
                    <p className="text-sm text-gray-500">Work with the best</p>
                  </div>
                </motion.div>
                
                <motion.div
                  custom={2}
                  variants={featureCardVariants}
                  className="flex items-start space-x-3 p-4 rounded-lg bg-white shadow-sm border border-gray-100 hover:border-blue-100 hover:shadow-md transition-all duration-200"
                >
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <BarChart className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Career Growth</h3>
                    <p className="text-sm text-gray-500">Track your progress</p>
                  </div>
                </motion.div>
                
                <motion.div
                  custom={3}
                  variants={featureCardVariants}
                  className="flex items-start space-x-3 p-4 rounded-lg bg-white shadow-sm border border-gray-100 hover:border-blue-100 hover:shadow-md transition-all duration-200"
                >
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Clock className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Quick Apply</h3>
                    <p className="text-sm text-gray-500">One-click applications</p>
                  </div>
                </motion.div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link to="/signup" className="w-full sm:w-auto">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-xl text-lg font-semibold shadow-lg shadow-blue-200 transition-all duration-300 hover:shadow-xl hover:shadow-blue-300 group">
                    <span className="flex items-center">
                      Get Started Now
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </Link>
                <Link to="/browse" className="w-full sm:w-auto">
                  <Button className="w-full bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-800 px-8 py-6 rounded-xl text-lg font-semibold transition-all duration-300 hover:shadow-lg">
                    Browse Jobs
                  </Button>
                </Link>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-2 text-sm text-gray-500 mt-6"
              >
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Trusted by 5K+ companies worldwide</span>
              </motion.div>
            </motion.div>

            {/* Right: Animation */}
            <motion.div
              variants={itemVariants}
              className="w-full md:w-1/2 flex justify-center items-center mt-12 md:mt-0"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600 blur-3xl opacity-5 rounded-full"></div>
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                >
                  <DotLottieReact
                    className="w-[340px] h-[340px] sm:w-[440px] sm:h-[440px] lg:w-[540px] lg:h-[540px]"
                    src="https://lottie.host/e349a17c-8f2f-4e89-acce-649ac80d300a/J9WvRxlFyW.lottie"
                    loop
                    autoplay
                  />
                </motion.div>
                
                {/* Floating elements */}
                <motion.div 
                  initial={{ x: -10, y: -10, opacity: 0 }}
                  animate={{ x: 0, y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="absolute top-1/4 -left-10 bg-white p-3 rounded-lg shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-medium text-gray-800">Resume Uploaded</span>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ x: 10, y: 10, opacity: 0 }}
                  animate={{ x: 0, y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  className="absolute bottom-1/4 -right-6 bg-white p-3 rounded-lg shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" fill="#fbbf24" />
                    <span className="font-medium text-gray-800">Job Matched!</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        ) : isStudent ? (
          // **Student View (After Login)**
          <motion.div 
            variants={itemVariants}
            className="text-center w-full max-w-4xl py-5 mx-auto"
          >
            <div className="flex flex-col gap-6">
              <motion.span 
                variants={itemVariants}
                className="px-5 py-2.5 rounded-full text-xl font-bold bg-blue-50 text-blue-600 inline-block mx-auto"
              >
                The <span className="text-blue-700">#1</span> Hiring Platform for{" "}
                <span className="text-blue-700">Talent</span> &{" "}
                <span className="text-blue-700">Opportunities</span>
              </motion.span>
              
              <motion.h1 
                variants={itemVariants}
                className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent"
              >
                Search, Apply & <br />
                Get your
                  Dream Jobs

              </motion.h1>
              
              <motion.p 
                variants={itemVariants}
                className="text-xl text-gray-700 my-6 max-w-3xl mx-auto"
              >
                Discover the best opportunities tailored for you. We've analyzed your profile and 
                found <span className="font-semibold text-blue-600">28 new jobs</span> that match your skills and preferences.
              </motion.p>
              
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap justify-center gap-4 mt-4"
              >
                <Link to="/jobs">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-xl text-lg font-semibold shadow-lg shadow-blue-200 transition-all duration-300 hover:shadow-xl hover:shadow-blue-300 group">
                    <span className="flex items-center">
                      Browse Latest Jobs
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </Link>
                <Link to="/candidate/dashboard">
                  <Button className="bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-800 px-8 py-6 rounded-xl text-lg font-semibold transition-all duration-300 hover:shadow-lg">
                    View Your Dashboard
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          // **Recruiter View (After Login)**
          <motion.div 
            variants={itemVariants}
            className="text-center w-full max-w-4xl py-5 mx-auto"
          >
            <div className="flex flex-col gap-6">
              <motion.span 
                variants={itemVariants}
                className="px-5 py-2.5 rounded-full text-xl font-bold bg-blue-50 text-blue-600 inline-block mx-auto"
              >
                The <span className="text-blue-700">#1</span> Platform for{" "}
                <span className="text-blue-700">Talent Acquisition</span> &{" "}
                <span className="text-blue-700">Recruitment</span>
              </motion.span>
              
              <motion.h1 
                variants={itemVariants}
                className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent"
              >
                Search, Hire & <br />
                Find your <span className="relative">
                  Perfect Talent
                  <span className="absolute inset-x-0 bottom-0 h-3 bg-blue-200 opacity-50 -rotate-1"></span>
                </span>
              </motion.h1>
              
              <motion.p 
                variants={itemVariants}
                className="text-xl text-gray-700 my-6 max-w-3xl mx-auto"
              >
                Discover the best talent for your company. Access our pool of qualified candidates 
                and streamline your recruitment process with our comprehensive hiring tools.
              </motion.p>
              
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap justify-center gap-4 mt-4"
              >
                <Link to="/admin/jobs">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-xl text-lg font-semibold shadow-lg shadow-blue-200 transition-all duration-300 hover:shadow-xl hover:shadow-blue-300 group">
                    <span className="flex items-center">
                      Manage Job Postings
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </Link>
                <Link to="/admin/candidates">
                  <Button className="bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-800 px-8 py-6 rounded-xl text-lg font-semibold transition-all duration-300 hover:shadow-lg">
                    Browse Candidates
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default HeroSection;