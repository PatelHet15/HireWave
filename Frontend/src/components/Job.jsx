import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Bookmark, BookmarkCheck, MapPin, Briefcase, DollarSign, Clock, Building2, ExternalLink, ChevronRight } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Badge } from './ui/badge';
import axios from 'axios';
import { toast } from 'sonner';
import { USER_API_END_POINT } from '@/utils/constant';
import { useSelector } from 'react-redux';

const Job = ({ job, index = 0, className = "" }) => {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);
  const { user } = useSelector(state => state.auth);
  
  // Check if this is the smaller job card from Browse page
  const isSmaller = className.includes('job-card-smaller');
  const hasNoHover = className.includes('no-hover');

  // Mock saved jobs until backend is implemented
  const [mockSavedJobs, setMockSavedJobs] = useState(() => {
    try {
      const saved = localStorage.getItem('mockSavedJobs');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading saved jobs from localStorage', e);
      return [];
    }
  });

  // Update localStorage when mock saved jobs change
  useEffect(() => {
    localStorage.setItem('mockSavedJobs', JSON.stringify(mockSavedJobs));
  }, [mockSavedJobs]);

  // Check if this job is already saved when component mounts
  useEffect(() => {
    if (user && job) {
      checkIfJobIsSaved();
    }
  }, [user, job, mockSavedJobs]);

  // Add job to cache immediately when component mounts
  useEffect(() => {
    if (job && job._id) {
      // Cache the job immediately on component mount
      cacheJob(job);
    }
  }, [job]);

  // Add job to cache when it becomes visible
  useEffect(() => {
    if (isVisible && job && job._id) {
      // Dispatch custom event with job data to be cached
      cacheJob(job);
    }
  }, [isVisible, job]);

  // Function to cache job data
  const cacheJob = (jobData) => {
    if (!jobData || !jobData._id) return;
    
    // Update local storage cache directly
    try {
      const cachedJobs = JSON.parse(localStorage.getItem('jobsCache') || '{}');
      cachedJobs[jobData._id] = jobData;
      localStorage.setItem('jobsCache', JSON.stringify(cachedJobs));
    } catch (error) {
      console.error('Error updating jobs cache', error);
    }
    
    // Also dispatch event for other components to catch
    const event = new CustomEvent('jobView', { detail: jobData });
    window.dispatchEvent(event);
  };

  // Check if job is saved
  const checkIfJobIsSaved = async () => {
    if (!user || !job || user.role !== 'student') {
      return;
    }
    
    try {
      // Try the actual API first
      const response = await axios.get(`${USER_API_END_POINT}/user/check-saved-job/${job._id}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        setSaved(response.data.isSaved);
      }
    } catch (error) {
      console.log('Using mock saved jobs as backend is not available');
      // If API fails, use our mock implementation
      const isJobSaved = mockSavedJobs.some(savedJobId => savedJobId === job._id);
      setSaved(isJobSaved);
    }
  };

  // Set up lazy loading with Intersection Observer
  useEffect(() => {
    let currentRef = null;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry && entry.isIntersecting) {
          setIsVisible(true);
          // Once visible, stop observing
          if (currentRef) observer.unobserve(currentRef);
        }
      },
      { 
        rootMargin: '200px', // Load earlier for smoother experience
        threshold: 0.1 
      }
    );

    // Only observe if we have a ref and job data
    if (cardRef.current && job) {
      currentRef = cardRef.current;
      observer.observe(currentRef);
    } else {
      // If no job or we're at the top of the list, make visible immediately
      setIsVisible(true);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [job]);

  // Get company initials for avatar fallback
  const getCompanyInitials = (companyName) => {
    if (!companyName) return "JD";
    const words = companyName.split(" ");
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return (words[0][0] + words[1][0]).toUpperCase();
  };

  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    return Math.floor((currentTime - createdAt) / (1000 * 60 * 60 * 24));
  };

  const handleCardClick = () => {
    navigate(`/description/${job?._id}`);
  };

  const handleBookmarkClick = async (e) => {
    e.stopPropagation();
    
    // If user is not logged in, prompt to log in
    if (!user) {
      toast.error('Please log in to save jobs');
      return;
    }
    
    // Only student/candidate users can save jobs
    if (user.role !== 'student') {
      toast.info('Only candidates can save jobs');
      return;
    }
    
    try {
      if (saved) {
        // Try the actual API first
        try {
          const response = await axios.delete(`${USER_API_END_POINT}/user/saved-jobs/${job._id}`, {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          if (response.data.success) {
            setSaved(false);
            toast.success('Job removed from saved list');
          }
        } catch (error) {
          // If API fails, use our mock implementation
          console.log('Using mock saved jobs as backend is not available');
          setMockSavedJobs(prev => prev.filter(id => id !== job._id));
          setSaved(false);
          toast.success('Job removed from saved list');
        }
      } else {
        // Cache the job before saving
        cacheJob(job);
        
        // Try the actual API first
        try {
          const response = await axios.post(`${USER_API_END_POINT}/user/saved-jobs`, 
            { jobId: job._id },
            {
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            }
          );
          
          if (response.data.success) {
            setSaved(true);
            toast.success('Job saved successfully');
          }
        } catch (error) {
          // If API fails, use our mock implementation
          console.log('Using mock saved jobs as backend is not available');
          setMockSavedJobs(prev => [...prev, job._id]);
          setSaved(true);
          toast.success('Job saved successfully (locally)');
        }
      }
    } catch (error) {
      console.error('Error saving/unsaving job:', error);
      toast.error('Failed to update saved jobs');
    }
  };

  const handleButtonClick = (e, action) => {
    e.stopPropagation();
    if (action === 'view' || action === 'apply') {
      navigate(`/description/${job?._id}`);
    }
  };

  // Animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 10
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.1
      }
    },
    tap: {
      scale: 0.98
    }
  };

  // If no job data, don't render anything
  if (!job) return null;

  // If not visible yet, render a placeholder with the same height
  if (!isVisible) {
    return (
      <div 
        ref={cardRef}
        className={`relative bg-white rounded-xl shadow-sm border border-gray-200 opacity-0 ${
          isSmaller ? 'h-[240px] p-4' : 'h-[280px] p-5 w-full md:max-w-[600px]'
        } ${className}`}
      />
    );
  }

  return (
    <motion.div 
      ref={cardRef}
      className={`relative bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col ${
        hasNoHover 
          ? '' 
          : 'group hover:shadow-md hover:border-blue-200 transition-all duration-200'
      } ${
        isSmaller ? 'p-4 gap-2 min-h-[240px]' : 'p-5 gap-3 w-full md:max-w-[600px]'
      } ${className}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      onClick={handleCardClick}
    >
      <motion.button
        className={`absolute ${isSmaller ? 'top-3 right-3 p-1.5' : 'top-4 right-4 p-1.5'} rounded-full z-10 transition-colors ${
          saved ? 'bg-blue-100' : `bg-gray-50 ${!hasNoHover ? 'hover:bg-gray-100' : ''}`
        }`}
        onClick={handleBookmarkClick}
        whileHover={!hasNoHover ? { scale: 1.1 } : {}}
        whileTap={{ scale: 0.9 }}
      >
        {saved ? (
          <BookmarkCheck className={`${isSmaller ? 'h-4 w-4' : 'h-4 w-4'} text-blue-600`} />
        ) : (
          <Bookmark className={`${isSmaller ? 'h-4 w-4' : 'h-4 w-4'} text-gray-400`} />
        )}
      </motion.button>

      <div className="flex items-start gap-3">
        <Avatar className={`${isSmaller ? 'h-10 w-10' : 'h-12 w-12'} rounded-lg border border-gray-200 bg-gray-100`}>
          <AvatarImage src={job?.company?.logo} alt={job?.company?.name} />
          <AvatarFallback className="bg-blue-50 text-blue-600 font-medium text-sm">
            {getCompanyInitials(job?.company?.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h2 className={`${isSmaller ? 'text-base' : 'text-lg'} font-semibold text-gray-900 line-clamp-1 ${!hasNoHover ? 'group-hover:text-blue-600 transition-colors' : ''}`}>
            {job?.title}
          </h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Building2 className={`${isSmaller ? 'h-3.5 w-3.5' : 'h-3.5 w-3.5'} text-gray-400`} />
            <span className="text-sm text-gray-600 truncate">{job?.company?.name}</span>
          </div>
        </div>
      </div>

      <div className={`grid ${isSmaller ? 'grid-cols-2 gap-2' : 'grid-cols-2 gap-3'} mt-1`}>
        <div className="flex items-center gap-1.5 text-gray-600 text-xs">
          <MapPin className={`${isSmaller ? 'h-3 w-3' : 'h-3.5 w-3.5'} text-blue-500`} />
          <span className="truncate">{job?.jobLocation || "India"}</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-600 text-xs">
          <Briefcase className={`${isSmaller ? 'h-3 w-3' : 'h-3.5 w-3.5'} text-green-500`} />
          <span className="truncate">{job?.jobType}</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-600 text-xs">
          <DollarSign className={`${isSmaller ? 'h-3 w-3' : 'h-3.5 w-3.5'} text-indigo-500`} />
          <span className="truncate">{job?.salary} LPA</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-600 text-xs">
          <Clock className={`${isSmaller ? 'h-3 w-3' : 'h-3.5 w-3.5'} text-amber-500`} />
          <span className="truncate">{daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}</span>
        </div>
      </div>

      <div className="mt-2"> 
        <Badge variant="secondary" className={`bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100 ${
          isSmaller ? 'text-xs px-2 py-0.5' : 'text-sm'
        }`}>
          {job?.position}
        </Badge>
      </div>

      {!isSmaller && (
        <p className="text-gray-600 text-sm line-clamp-2 mt-2">
          {job?.description}
        </p>
      )}

      {/* Added flex-grow to create a spacer that pushes the button to the bottom */}
      <div className="flex-grow min-h-[10px]"></div>

      <div className={`flex items-center gap-2 mt-auto pt-2`}>
        {isSmaller ? (
          <motion.button
            variants={buttonVariants}
            whileHover={!hasNoHover ? "hover" : {}}
            whileTap="tap"
            onClick={(e) => handleButtonClick(e, 'apply')}
            className={`flex-1 px-3 py-1.5 text-xs rounded-lg bg-blue-600 text-white font-medium ${!hasNoHover ? 'hover:bg-blue-700' : ''} transition-all duration-200 flex items-center justify-center h-8`}
          >
            Apply Now
            <ChevronRight className="h-3 w-3 ml-1" />
          </motion.button>
        ) : (
          <>
            <motion.button
              variants={buttonVariants}
              whileHover={!hasNoHover ? "hover" : {}}
              whileTap="tap"
              onClick={(e) => handleButtonClick(e, 'view')}
              className={`flex-1 px-3 py-2 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium ${!hasNoHover ? 'hover:border-gray-300 hover:bg-gray-50' : ''} transition-all duration-200 flex items-center justify-center`}
            >
              View Details
              <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
            </motion.button>
            <motion.button
              variants={buttonVariants}
              whileHover={!hasNoHover ? "hover" : {}}
              whileTap="tap"
              onClick={(e) => handleButtonClick(e, 'apply')}
              className={`flex-1 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium ${!hasNoHover ? 'hover:bg-blue-700' : ''} transition-all duration-200 flex items-center justify-center`}
            >
              Apply Now
              <ChevronRight className="h-3.5 w-3.5 ml-1.5" />
            </motion.button>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Job;
