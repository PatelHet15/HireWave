import React, { useState, useEffect, useMemo } from 'react';
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { ArrowRight, TrendingUp, Clock, Briefcase } from 'lucide-react';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { motion, AnimatePresence } from 'framer-motion';

const LatestJobs = () => {
  const navigate = useNavigate();
  // Use the hook to ensure jobs are fetched
  useGetAllJobs();
  const { allJobs } = useSelector(store => store.job);
  
  // State for loading and displayed jobs
  const [isLoading, setIsLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(6);
  const [activeTab, setActiveTab] = useState('latest'); // 'latest' or 'top'
  
  // Calculate a job score based on database model fields
  const calculateJobScore = (job) => {
    let score = 0;
    
    // Base score factors from job model
    
    // Salary (higher is better)
    const salary = parseInt(job?.salary) || 0;
    if (salary > 0) {
      // Logarithmic scale to prevent extremely high salaries from dominating
      score += Math.min(50, Math.log(salary) * 10);
    }
    
    // Urgency factor - jobs closer to deadline get priority
    if (job?.applyBy) {
      const now = new Date();
      const deadline = new Date(job.applyBy);
      const daysLeft = Math.max(0, Math.ceil((deadline - now) / (1000 * 60 * 60 * 24)));
      
      // Jobs with 0-7 days left get higher urgency scores
      if (daysLeft <= 7) {
        score += Math.max(0, 30 - (daysLeft * 4)); // 30 points for today, down to 2 for 7 days
      }
    }
    
    // Experience level factor - give variety across levels
    if (job?.experienceLevel) {
      const levelScores = {
        'entry': 15,      // Good for new grads
        'Mid Level': 20,  // High demand segment
        'Senior': 25,     // Valuable positions
        'lead': 20,       // Leadership roles
        'executive': 15   // Specialized audience
      };
      score += levelScores[job.experienceLevel] || 0;
    }
    
    // Job type factor - based on popularity and stability
    if (job?.jobType) {
      const typeScores = {
        'Full Time': 25,   // Most stable
        'Part Time': 15,   // Less commitment
        'contract': 20,    // Good for specialists
        'internship': 10,  // Entry positions
        'remote': 30       // Highly desirable in current market
      };
      score += typeScores[job.jobType] || 0;
    }
    
    // Completeness and quality factors
    
    // Detailed job description
    if (job?.description) {
      // More detailed descriptions get more points (up to 25)
      const descLength = job.description.length;
      score += Math.min(25, Math.floor(descLength / 100));
    }
    
    // Number of requirements listed
    if (job?.requirements && Array.isArray(job.requirements)) {
      // More specific requirements (up to 20 points)
      score += Math.min(20, job.requirements.length * 5);
    }
    
    // Number of perks offered
    if (job?.perks && Array.isArray(job.perks)) {
      // More perks is better (up to 15 points)
      score += Math.min(15, job.perks.length * 3);
    }
    
    // Company quality factors
    if (job?.company) {
      // Company has logo (better brand presence)
      if (job.company.logo) score += 15;
      
      // Company has website (established online presence)
      if (job.company.website) score += 10;
      
      // Company has description
      if (job.company.aboutCompany) score += 10;
    }
    
    // Demand factor - more openings indicates higher demand
    const openings = parseInt(job?.openings) || 0;
    score += Math.min(25, openings * 5); // Cap at 25 points
    
    return score;
  };
  
  // Simulate loading for better UX
  useEffect(() => {
    // Show loading state for at least 300ms to avoid flickering
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [allJobs]);
  
  // Calculate sorted jobs based on different criteria
  const sortedJobs = useMemo(() => {
    if (!allJobs || allJobs.length === 0) return [];
    
    // Create a copy to avoid modifying the original array
    const jobsCopy = [...allJobs];
    
    // Sort based on active tab
    if (activeTab === 'latest') {
      // Sort by creation date (newest first)
      return jobsCopy
        .sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
          const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
          return dateB - dateA;
        })
        .slice(0, 6); // Only return the top 6 latest jobs
    } else {
      // Sort by "top" criteria (a combination of salary, openings and other factors)
      return jobsCopy
        .sort((a, b) => {
          // Calculate a "score" for each job based on multiple factors
          const scoreA = calculateJobScore(a);
          const scoreB = calculateJobScore(b);
          return scoreB - scoreA;
        })
        .slice(0, 6); // Only return the top 6 highest scoring jobs
    }
  }, [allJobs, activeTab]);
  
  // Handle view all jobs navigation
  const handleViewAllJobs = () => {
    navigate('/jobs');
  };
  
  // Select tab (latest or top)
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  // Jobs to display are already limited to 6 in the sortedJobs memo
  const jobsToDisplay = sortedJobs || [];
  
  // No remaining jobs since we're only showing 6
  const remainingJobs = 0;

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6'>
      {/* Header with title and view all button */}
      <div className='text-center mb-12'>
        <h2 className='text-3xl md:text-4xl font-bold'>
          <span className='text-blue-700'>Latest & Top </span>
          Job Openings
        </h2>
        <p className='text-lg text-gray-600 max-w-2xl mx-auto mt-4'>Stay updated with the newest job postings from top companies</p>
      </div>

      {/* Tabs and view all button */}
      <div className='flex flex-col sm:flex-row justify-between items-center gap-4 mb-8'>
        <div className='flex items-center bg-gray-100 rounded-full p-1'>
          <button
            onClick={() => handleTabChange('latest')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'latest' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <span className='flex items-center gap-1.5'>
              <Clock className='w-4 h-4' />
              Latest
            </span>
          </button>
          <button
            onClick={() => handleTabChange('top')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'top' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <span className='flex items-center gap-1.5'>
              <TrendingUp className='w-4 h-4' />
              Top Rated
            </span>
          </button>
        </div>
        <div className='hidden sm:block'>
          <Button
            onClick={handleViewAllJobs}
            className='bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full transition-all duration-300 flex items-center gap-2 group shadow-sm hover:shadow-md'
          >
            View All Jobs
            <ArrowRight className='w-4 h-4 transform group-hover:translate-x-1 transition-transform' />
          </Button>
        </div>
      </div>
      
      {/* Job Cards Grid with animations */}
      <AnimatePresence mode='wait'>
        {isLoading ? (
          // Loading skeleton with animation
          <motion.div 
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div 
                key={i} 
                className="p-6 rounded-xl shadow-md bg-white border border-gray-200 animate-pulse"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gray-200" />
                  <div className="space-y-2">
                    <div className="h-5 w-32 bg-gray-200 rounded" />
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-5 w-3/4 bg-gray-200 rounded" />
                  <div className="h-4 w-full bg-gray-200 rounded" />
                  <div className="h-4 w-2/3 bg-gray-200 rounded" />
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-24 bg-blue-100 rounded-full" />
                  <div className="h-8 w-24 bg-red-100 rounded-full" />
                  <div className="h-8 w-24 bg-purple-100 rounded-full" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : jobsToDisplay.length > 0 ? (
          <motion.div 
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {jobsToDisplay.map((job, index) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: index * 0.1,
                  duration: 0.5,
                  ease: [0.645, 0.045, 0.355, 1.000]
                }}
              >
                <LatestJobCards 
                  job={job} 
                  isTopJob={activeTab === 'top'}
                />
              </motion.div>
            ))}

            {/* No Load More button since we're only showing 6 jobs */}
          </motion.div>
        ) : (
          // No jobs found with animation
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Jobs Found</h3>
            <p className="text-gray-600">Check back later for new opportunities</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile view all button */}
      <div className="mt-8 text-center sm:hidden">
        <Button 
          onClick={handleViewAllJobs}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full px-6 py-3 rounded-full transition-all duration-300 flex items-center justify-center gap-2 group shadow-sm hover:shadow-md"
        >
          View All Jobs
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};

export default LatestJobs;
