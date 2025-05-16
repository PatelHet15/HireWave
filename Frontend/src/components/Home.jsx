import React, { useEffect } from 'react';
import Navbar from './shared/Navbar';
import HeroSection from './HeroSection';
import CategoryCarousel from './CategoryCarousel';
import LatestJobs from './LatestJobs';
import TestimonialsSection from './TestimonialsSection';
import CompanyLogosSection from './CompanyLogosSection';
import CounterSection from './CounterSection';
import Footer from './shared/Footer';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Element, scroller } from 'react-scroll';
import { motion } from 'framer-motion';

const Home = () => {
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "recruiter") {
      navigate("/admin/companies");
    }
  }, [user, navigate]);

  useGetAllJobs();

  const scrollToSection = (section) => {
    scroller.scrollTo(section, {
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart'
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
        duration: 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }
    }
  };

  return (
    <motion.div 
      className="smooth-scroll-container min-h-screen bg-gradient-to-b from-gray-50 to-white"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Navbar />
      
      <Element name="hero" className="relative z-10">
        <motion.div variants={itemVariants}>
          <HeroSection />
        </motion.div>
      </Element>

      {user && (
        <>
          <Element name="categories" className="relative z-20">
            <motion.div variants={itemVariants} className="py-12 bg-white shadow-sm">
              <CategoryCarousel />
            </motion.div>
          </Element>
          
          <Element name="counter-stats" className="relative z-25">
            <motion.div variants={itemVariants} className="py-16 bg-blue-50">
              <CounterSection />
            </motion.div>
          </Element>

          <Element name="trusted-companies" className="relative z-20">
            <motion.div variants={itemVariants} className="py-16 bg-white">
              <CompanyLogosSection />
            </motion.div>
          </Element>
          
          <Element name="latest-jobs" className="relative z-30">
            <motion.div variants={itemVariants} className="py-16 bg-gray-50">
              <LatestJobs />
            </motion.div>
          </Element>
          
          <Element name="testimonials" className="relative z-35">
            <motion.div variants={itemVariants} className="py-16 bg-white">
              <TestimonialsSection />
            </motion.div>
          </Element>
          
          <Element name="footer" className="relative z-40">
            <motion.div variants={itemVariants}>
              <Footer />
            </motion.div>
          </Element>
        </>
      )}

      {!user && (
        <motion.div variants={itemVariants}>
          <Footer />
        </motion.div>
      )}
    </motion.div>
  );
};

export default Home;
