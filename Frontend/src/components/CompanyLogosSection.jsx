import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ChevronLeft, ChevronRight, Star, TrendingUp, Globe, Shield, Award, Users, Zap } from 'lucide-react';

// Import logo images - using the same imports as before
import googleLogo from '../assets/images/google.webp';
import microsoftLogo from '../assets/images/Microsoft.png';
import amazonLogo from '../assets/images/amazon.png';
import appleLogo from '../assets/images/logo2.png';
import metaLogo from '../assets/images/logo4.png';

// Company data with logos, testimonials and industry
const companies = [
  { 
    id: 1,
    name: "Google", 
    logoSrc: googleLogo, 
    industry: "Technology",
    testimonial: "This platform has transformed our hiring process, reducing time-to-hire by 40% while improving candidate quality.",
    author: "Sarah Chen",
    position: "Head of Talent Acquisition"
  },
  { 
    id: 2,
    name: "Microsoft", 
    logoSrc: microsoftLogo, 
    industry: "Software",
    testimonial: "We've found exceptional talent that aligns perfectly with our company culture and technical requirements.",
    author: "Michael Rodriguez",
    position: "VP of Human Resources"
  },
  { 
    id: 3,
    name: "Amazon", 
    logoSrc: amazonLogo, 
    industry: "E-commerce",
    testimonial: "The AI-powered matching has connected us with candidates we might have otherwise overlooked in our traditional hiring process.",
    author: "Jessica Wong",
    position: "Technical Recruiting Lead"
  },
  { 
    id: 4,
    name: "Apple", 
    logoSrc: appleLogo, 
    industry: "Consumer Electronics",
    testimonial: "The platform's intuitive interface and powerful analytics have given us unprecedented insights into our recruitment funnel.",
    author: "David Miller",
    position: "Global Talent Director"
  },
  { 
    id: 5,
    name: "Meta", 
    logoSrc: metaLogo, 
    industry: "Social Media",
    testimonial: "We've been able to build diverse teams faster and more efficiently than ever before using this platform.",
    author: "Priya Patel",
    position: "Diversity & Inclusion Officer"
  },
  { 
    id: 6,
    name: "Netflix", 
    logoSrc: googleLogo, 
    industry: "Entertainment",
    testimonial: "The quality of candidates and the speed at which we can connect with them has been game-changing for our growth.",
    author: "Thomas Jackson",
    position: "Talent Acquisition Manager"
  },
  { 
    id: 7,
    name: "Tesla", 
    logoSrc: microsoftLogo, 
    industry: "Automotive",
    testimonial: "This platform has helped us identify specialized talent for our most challenging technical positions.",
    author: "Emma Wilson",
    position: "Engineering Recruitment Lead"
  },
  { 
    id: 8,
    name: "NVIDIA", 
    logoSrc: appleLogo, 
    industry: "AI & Computing",
    testimonial: "The platform's AI matching algorithms have consistently delivered candidates who exceed our expectations.",
    author: "Robert Chen",
    position: "AI Talent Specialist"
  }
];

// Statistics about the platform
const statistics = [
  { value: "500+", label: "Enterprise Partners", icon: <Globe className="h-6 w-6 text-blue-500" /> },
  { value: "2.5M+", label: "Talented Professionals", icon: <Users className="h-6 w-6 text-indigo-500" /> },
  { value: "94%", label: "Hiring Success Rate", icon: <TrendingUp className="h-6 w-6 text-green-500" /> },
  { value: "100%", label: "Data Security", icon: <Shield className="h-6 w-6 text-purple-500" /> },
];

const CompanyLogosSection = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const carouselRef = useRef(null);
  
  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        duration: 0.6 
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };
  
  // Handle carousel navigation
  const nextTestimonial = () => {
    setActiveTestimonialIndex((prev) => 
      prev === companies.length - 1 ? 0 : prev + 1
    );
  };
  
  const prevTestimonial = () => {
    setActiveTestimonialIndex((prev) => 
      prev === 0 ? companies.length - 1 : prev - 1
    );
  };
  
  // Auto-scroll carousel when not hovering
  useEffect(() => {
    if (isHovering) return;
    
    const interval = setInterval(() => {
      nextTestimonial();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isHovering, activeTestimonialIndex]);
  
  // Get current testimonial
  const activeCompany = companies[activeTestimonialIndex];

  return (
    <section className="relative overflow-hidden py-20" ref={ref}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-indigo-900 opacity-95"></div>
      
      {/* Main content container */}
      <motion.div
        className="relative max-w-7xl mx-auto px-4 sm:px-6 z-10"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={sectionVariants}
      >
      {/* Header */}
      <motion.div className="text-center mb-16" variants={itemVariants}>
        <motion.div 
          className="inline-flex items-center bg-blue-100/50 px-4 py-2 rounded-full mb-4"
          whileHover={{ scale: 1.05 }}
        >
          <Zap className="h-4 w-4 mr-2 text-yellow-500" />
          <span className="text-blue-800 text-sm font-medium">
            TRUSTED BY INDUSTRY LEADERS
          </span>
        </motion.div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Powering Elite Recruitment</h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Join the world's most innovative companies using our platform to discover exceptional talent.
        </p>
      </motion.div>

      {/* Testimonial Carousel Section */}
      <motion.div 
        className="mb-24 relative"
        variants={itemVariants}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        ref={carouselRef}
      >
        <div className="bg-gradient-to-r from-indigo-800/40 to-purple-800/40 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-indigo-500/20 shadow-xl">
          {/* Testimonial content */}
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* Company logo */}
            <div className="w-full md:w-1/3 flex justify-center">
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-lg transform rotate-1 hover:rotate-0 transition-transform duration-300">
                <img 
                  src={activeCompany.logoSrc} 
                  alt={activeCompany.name} 
                  className="h-24 w-auto object-contain mx-auto filter brightness-110" 
                />
                <p className="text-center mt-4 text-white/80 font-medium">{activeCompany.industry}</p>
              </div>
            </div>
            
            {/* Testimonial text */}
            <div className="w-full md:w-2/3">
              <div className="mb-6">
                <svg width="45" height="36" className="text-indigo-400 mb-5" viewBox="0 0 45 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.5 0C6.04125 0 0 6.04125 0 13.5C0 20.9588 6.04125 27 13.5 27C20.9588 27 27 20.9588 27 13.5C27 6.04125 20.9588 0 13.5 0ZM40.5 0C33.0412 0 27 6.04125 27 13.5C27 20.9588 33.0412 27 40.5 27C47.9588 27 54 20.9588 54 13.5C54 6.04125 47.9588 0 40.5 0Z" fill="currentColor" fillOpacity="0.25"/>
                </svg>
                <p className="text-white text-xl md:text-2xl leading-relaxed italic">"{activeCompany.testimonial}"</p>
              </div>
              <div className="flex items-center">
                <div className="mr-4 h-12 w-12 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {activeCompany.author.charAt(0)}
                </div>
                <div>
                  <h4 className="text-white font-semibold text-lg">{activeCompany.author}</h4>
                  <p className="text-indigo-300">{activeCompany.position}, {activeCompany.name}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation controls */}
          <div className="flex justify-center mt-10 gap-3">
            <button 
              onClick={prevTestimonial}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-200"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>
            
            {/* Pagination indicators */}
            <div className="flex items-center gap-2">
              {companies.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => setActiveTestimonialIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === activeTestimonialIndex 
                      ? 'bg-white w-6' 
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <button 
              onClick={nextTestimonial}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-200"
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Logo Marquee - Continuous scroll */}
      <motion.div 
        className="mb-24 overflow-hidden py-6"
        variants={itemVariants}
      >
        <h3 className="text-center text-xl text-white/80 mb-8 font-medium">Trusted by companies worldwide</h3>
        
        <div className="relative">
          {/* First row - moves left */}
          <div className="flex animate-marquee whitespace-nowrap">
            {companies.map((company) => (
              <div key={`row1-${company.id}`} className="mx-8 flex items-center justify-center">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 w-40 h-20 flex items-center justify-center">
                  <img src={company.logoSrc} alt={company.name} className="h-10 object-contain filter brightness-150 grayscale hover:grayscale-0 transition-all duration-300" />
                </div>
              </div>
            ))}
          </div>
          
          {/* Second row - moves right (reversed direction) */}
          <div className="flex animate-marquee2 whitespace-nowrap mt-8">
            {[...companies].reverse().map((company) => (
              <div key={`row2-${company.id}`} className="mx-8 flex items-center justify-center">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 w-40 h-20 flex items-center justify-center">
                  <img src={company.logoSrc} alt={company.name} className="h-10 object-contain filter brightness-150 grayscale hover:grayscale-0 transition-all duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Add custom CSS for the marquee animations */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee2 {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee2 {
          animation: marquee2 30s linear infinite;
        }
      `}</style>

      {/* Stats Section with Hexagonal Grid */}
      <motion.div 
        className="mb-24"
        variants={itemVariants}
      >
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-white mb-4">Recruitment at Scale</h3>
          <p className="text-gray-300 max-w-2xl mx-auto">Our platform delivers exceptional results for companies of all sizes</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {statistics.map((stat) => (
            <motion.div
              key={stat.label}
              className="bg-gradient-to-br from-indigo-900/80 to-purple-900/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-indigo-500/30 shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-2 transition-all duration-300"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-white/10 rounded-xl">
                {stat.icon}
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-center text-white mb-2">{stat.value}</h3>
              <p className="text-indigo-200 text-center font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div 
        className="text-center pb-8"
        variants={itemVariants}
      >
        <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 backdrop-blur-sm rounded-3xl p-10 border border-indigo-500/20 shadow-xl mb-8">
          <h3 className="text-3xl font-bold text-white mb-6">Ready to Transform Your Hiring?</h3>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">Join the world's most innovative companies and discover exceptional talent today.</p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <motion.button 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-xl font-medium shadow-lg hover:shadow-indigo-500/50 transition-all text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started for Free
            </motion.button>
            <motion.button 
              className="bg-white/10 backdrop-blur-sm text-white border border-white/30 px-8 py-4 rounded-xl font-medium hover:bg-white/20 transition-all text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Schedule Demo
            </motion.button>
          </div>
        </div>
        
        <p className="text-indigo-300/80 text-sm">Trusted by 10,000+ companies worldwide</p>
      </motion.div>
      </motion.div>
    </section>
  );
};

export default CompanyLogosSection;