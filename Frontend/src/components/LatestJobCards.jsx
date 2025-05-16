import React, { useState, memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from './ui/badge';
import { 
  Briefcase, 
  DollarSign, 
  MapPin, 
  Clock, 
  Calendar,
  Bookmark, 
  BookmarkCheck,
  TrendingUp,
  Star,
  Building2,
  Users,
  ExternalLink,
  Share2
} from 'lucide-react';
import { format, parseISO, formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { useSelector } from 'react-redux';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip"
import { toast } from 'sonner';

// Memoized component for better performance
const LatestJobCards = memo(({ job, isTopJob = false, isHighConversion = false, conversionRate = 0, variant = "grid" }) => {
  const navigate = useNavigate();
  const { user } = useSelector(store => store.auth);
  
  // State for handling interactions
  const [isSaved, setIsSaved] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Format job post date for displaying
  const formattedDate = job?.createdAt 
    ? format(parseISO(job.createdAt), 'MMM d, yyyy')
    : 'Recent';
  
  const timeAgo = job?.createdAt
    ? formatDistanceToNow(parseISO(job.createdAt), { addSuffix: true })
    : 'Recently posted';

  // Load bookmarks from localStorage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('bookmarkedJobs');
    if (savedBookmarks) {
      const bookmarks = JSON.parse(savedBookmarks);
      setIsSaved(bookmarks[job._id] || false);
    }
  }, [job._id]);

  // Handle navigation to job details
  const handleCardClick = () => {
    navigate(`/description/${job._id}`);
  };

  // Handle saving job to favorites
  const handleSaveJob = (e) => {
    e.stopPropagation(); // Prevent card click
    
    // Toggle bookmark status
    const newState = !isSaved;
    setIsSaved(newState);
    
    // Update localStorage
    const savedBookmarks = localStorage.getItem('bookmarkedJobs');
    let bookmarks = {};
    
    if (savedBookmarks) {
      bookmarks = JSON.parse(savedBookmarks);
    }
    
    if (newState) {
      bookmarks[job._id] = true;
      toast.success('Job saved to bookmarks!');
    } else {
      delete bookmarks[job._id];
      toast.success('Job removed from bookmarks');
    }
    
    localStorage.setItem('bookmarkedJobs', JSON.stringify(bookmarks));
  };
  
  // Share job function
  const handleShareJob = (e) => {
    e.stopPropagation(); // Prevent card click
    
    const shareUrl = `${window.location.origin}/description/${job._id}`;
    
    if (navigator.share) {
      navigator.share({
        title: job?.title || 'Job Opening',
        text: `Check out this job: ${job?.title} at ${job?.company?.name}`,
        url: shareUrl
      })
      .catch(err => {
        console.error('Error sharing', err);
        // Fallback
        copyToClipboard(shareUrl);
      });
    } else {
      // Fallback for browsers without Web Share API
      copyToClipboard(shareUrl);
    }
  };
  
  // Copy to clipboard helper
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success('Job link copied to clipboard!');
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
        toast.error('Failed to copy link');
      });
  };

  // Generate company initials as fallback
  const getCompanyInitials = () => {
    const name = job?.company?.name || 'Company';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate salary text
  const getSalaryText = () => {
    if (!job?.salary) return "Salary not disclosed";
    
    const salary = parseInt(job.salary);
    if (isNaN(salary)) return "Salary not disclosed";
    
    if (salary >= 100) {
      return `${salary}K+/year`;
    } else {
      return `${salary} LPA`;
    }
  };

  // Animation variants
  const cardVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0 }
  };

  // For responsiveness, we'll change the layout based on the variant prop
  if (variant === "list") {
    return (
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={cardVariants}
        transition={{ duration: 0.2 }}
        className="h-full relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Top job indicator */}
        {isTopJob && (
          <div className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full p-1 shadow-md z-20">
            <Star className="w-3 h-3 text-yellow-300 fill-yellow-300" />
          </div>
        )}
        {isHighConversion && (
          <div className="absolute -top-1 -right-1 bg-green-600 text-white rounded-full px-2 py-1 text-xs font-medium shadow-md z-20">
            {conversionRate.toFixed(1)}% CR
          </div>
        )}
        
        {/* Job Card */}
        <div 
          onClick={handleCardClick}
          className={`bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer h-full ${
            isTopJob ? 'border-blue-200 hover:border-blue-300' : isSaved ? 'border-blue-200' : 'border-gray-200 hover:border-blue-200'
          }`}
        >
          <div className="flex items-start gap-4">
            {/* Company Logo */}
            <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden border border-gray-200 flex-shrink-0">
              {job?.company?.logo ? (
                <>
                  <img 
                    src={job.company.logo} 
                    alt={job.company.name} 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden w-full h-full items-center justify-center text-blue-600 font-semibold text-lg">
                    {getCompanyInitials()}
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-blue-600 font-semibold text-lg">
                  {getCompanyInitials()}
                </div>
              )}
            </div>
            
            {/* Job Details */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-700 transition-colors">
                    {job?.title || 'Position Not Available'}
                    {isTopJob && (
                      <span className="inline-flex ml-1.5 text-blue-600">
                        <TrendingUp className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-gray-400" />
                    {job?.company?.name || 'Company Name'}
                    {job?.company?.verified && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        Verified
                      </span>
                    )}
                  </p>
                </div>
                
                <div className="mt-2 md:mt-0 flex items-center gap-1">
                  {user && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={handleSaveJob}
                            className={`p-1.5 rounded-full transition-all duration-200 ${
                              isSaved ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-500'
                            }`}
                            aria-label={isSaved ? "Remove from saved jobs" : "Save job"}
                          >
                            {isSaved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{isSaved ? 'Remove from saved jobs' : 'Save job'}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={handleShareJob}
                          className="p-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-500 transition-all duration-200"
                          aria-label="Share job"
                        >
                          <Share2 className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Share job</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              
              {/* Job Info Grid */}
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-3">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                  <span className="truncate">{job?.jobLocation || "Location not specified"}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Briefcase className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                  <span className="truncate">{job?.jobType || "Type not specified"}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                  <span className="truncate">{getSalaryText()}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                  <span className="truncate">
                    {job?.openings ? `${job.openings} opening${job.openings !== 1 ? 's' : ''}` : "Multiple openings"}
                  </span>
                </div>
              </div>
              
              {/* Job Description Preview */}
              <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                {job?.description?.substring(0, 140) || 'No description available for this position.'}
                {job?.description?.length > 140 ? '...' : ''}
              </p>
              
              {/* Job Badges */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {job?.position && (
                  <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100 text-xs px-2 py-0.5">
                    {job.position}
                  </Badge>
                )}
                {isTopJob && parseInt(job?.salary) > 10 && (
                  <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-100 text-xs px-2 py-0.5">
                    High Salary
                  </Badge>
                )}
                {job?.createdAt && new Date(job.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                  <Badge className="bg-green-50 text-green-700 hover:bg-green-100 border border-green-100 text-xs px-2 py-0.5">
                    New
                  </Badge>
                )}
                <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100 text-xs px-2 py-0.5">
                  <Clock className="mr-1 h-3 w-3" />
                  {timeAgo}
                </Badge>
              </div>
              
              {/* Apply Button */}
              <div className="mt-4 flex justify-end">
                <Button 
                  size="sm" 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  View Details
                  <ExternalLink className="ml-2 h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid layout - default
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={cardVariants}
      transition={{ duration: 0.2 }}
      className="h-full relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top job indicator */}
      {isTopJob && (
        <div className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full p-1 shadow-md z-20">
          <Star className="w-3 h-3 text-yellow-300 fill-yellow-300" />
        </div>
      )}
      
      {/* Action buttons that appear on hover */}
      {user && (isHovered || isSaved) && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 transition-opacity duration-200">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleSaveJob}
                  className={`p-1.5 rounded-full transition-all duration-200 ${
                    isSaved ? 'bg-blue-100 text-blue-600' : 'bg-white/90 backdrop-blur-sm text-gray-500 hover:bg-blue-50 hover:text-blue-500 shadow-sm'
                  }`}
                  aria-label={isSaved ? "Remove from saved jobs" : "Save job"}
                >
                  {isSaved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isSaved ? 'Remove from saved jobs' : 'Save job'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleShareJob}
                  className="p-1.5 rounded-full bg-white/90 backdrop-blur-sm text-gray-500 hover:bg-blue-50 hover:text-blue-500 transition-all duration-200 shadow-sm"
                  aria-label="Share job"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share job</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
      
      {/* Job Card */}
      <div 
        onClick={handleCardClick}
        className={`bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer h-full flex flex-col ${
          isTopJob ? 'border-blue-200 hover:border-blue-300' : isSaved ? 'border-blue-200' : 'border-gray-200 hover:border-blue-200'
        }`}
      >
        {/* Header with logo, title */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden border border-gray-200">
            {job?.company?.logo ? (
              <>
                <img 
                  src={job.company.logo} 
                  alt={job.company.name} 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden w-full h-full items-center justify-center text-blue-600 font-semibold text-sm">
                  {getCompanyInitials()}
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                {getCompanyInitials()}
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-700 transition-colors">
              {job?.title || 'Position Not Available'}
              {isTopJob && (
                <span className="inline-flex ml-1.5 text-blue-600">
                  <TrendingUp className="w-3.5 h-3.5" />
                </span>
              )}
            </h3>
            <p className="text-sm text-gray-500 truncate">{job?.company?.name || 'Company Name'}</p>
          </div>
        </div>
        
        {/* Job quick info */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="flex items-center text-xs text-gray-500">
            <MapPin className="h-3 w-3 mr-1 text-gray-400" />
            <span className="truncate">{job?.jobLocation || "Location not specified"}</span>
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <Briefcase className="h-3 w-3 mr-1 text-gray-400" />
            <span className="truncate">{job?.jobType || "Type not specified"}</span>
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="h-3 w-3 mr-1 text-gray-400" />
            <span className="truncate">Posted: {formattedDate}</span>
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <DollarSign className="h-3 w-3 mr-1 text-gray-400" />
            <span className="truncate">{getSalaryText()}</span>
          </div>
        </div>
        
        {/* Description preview */}
        <div className="mb-4 flex-grow">
          <p className="text-sm text-gray-600 line-clamp-2">
            {job?.description?.substring(0, 120) || 'No description available for this position.'}
            {job?.description?.length > 120 ? '...' : ''}
          </p>
        </div>
        
        {/* Job Badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {job?.position && (
            <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100 text-xs px-2 py-0.5">
              {job.position}
            </Badge>
          )}
          {job?.openings && (
            <Badge className="bg-green-50 text-green-700 hover:bg-green-100 border border-green-100 text-xs px-2 py-0.5">
              {job.openings} Opening{job.openings !== 1 ? 's' : ''}
            </Badge>
          )}
          {isTopJob && parseInt(job?.salary) > 10 && (
            <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-100 text-xs px-2 py-0.5">
              High Salary
            </Badge>
          )}
          {isHighConversion && (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border border-green-200 text-xs px-2 py-0.5">
              {conversionRate.toFixed(1)}% Conversion Rate
            </Badge>
          )}
        </div>
        
        {/* Apply button */}
        <div className="mt-auto pt-2">
          <Button 
            size="sm" 
            className={`w-full ${
              isTopJob 
                ? 'bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 h-7' 
                : isHighConversion
                ? 'bg-green-600 hover:bg-green-700 text-white text-xs py-1 h-7'
                : 'bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs py-1 h-7'
            }`}
          >
            View Details
          </Button>
        </div>
      </div>
    </motion.div>
  );
});

// Set display name for debugging
LatestJobCards.displayName = 'LatestJobCards';

export default LatestJobCards;
