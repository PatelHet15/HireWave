import React, { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { 
  MoreHorizontal, 
  Search, 
  Filter, 
  ArrowUp, 
  ArrowDown, 
  FileText,
  Mail,
  Phone,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Clock3,
  User,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

// Mock candidate data - in a real app this would come from an API
const mockCandidates = [
  {
    id: 1,
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    position: 'senior Software Engineer',
    appliedDate: '2023-10-15',
    status: 'shortlisted',
    experience: '8 years',
    skills: ['React', 'Node.js', 'TypeScript'],
    matchScore: 92,
    avatar: null,
    resumeUrl: '#'
  },
  {
    id: 2,
    name: 'Samantha Williams',
    email: 'samantha.w@example.com',
    position: 'UX Designer',
    appliedDate: '2023-10-12',
    status: 'screening',
    experience: '5 years',
    skills: ['Figma', 'UI/UX', 'Adobe XD'],
    matchScore: 85,
    avatar: null,
    resumeUrl: '#'
  },
  {
    id: 3,
    name: 'David Chen',
    email: 'david.chen@example.com',
    position: 'Frontend Developer',
    appliedDate: '2023-10-10',
    status: 'interview',
    experience: '4 years',
    skills: ['JavaScript', 'React', 'CSS'],
    matchScore: 78,
    avatar: null,
    resumeUrl: '#'
  },
  {
    id: 4,
    name: 'Maria Garcia',
    email: 'maria.g@example.com',
    position: 'Product Manager',
    appliedDate: '2023-10-08',
    status: 'offer',
    experience: '6 years',
    skills: ['Product Strategy', 'Agile', 'User Research'],
    matchScore: 88,
    avatar: null,
    resumeUrl: '#'
  },
  {
    id: 5,
    name: 'James Wilson',
    email: 'james.w@example.com',
    position: 'Frontend Developer',
    appliedDate: '2023-10-07',
    status: 'rejected',
    experience: '2 years',
    skills: ['JavaScript', 'HTML', 'CSS'],
    matchScore: 65,
    avatar: null,
    resumeUrl: '#'
  },
  {
    id: 6,
    name: 'Olivia Smith',
    email: 'olivia.s@example.com',
    position: 'senior Software Engineer',
    appliedDate: '2023-10-05',
    status: 'new',
    experience: '7 years',
    skills: ['Java', 'Spring', 'Microservices'],
    matchScore: 80,
    avatar: null,
    resumeUrl: '#'
  }
];

const getStatusIcon = (status) => {
  switch(status) {
    case 'new': return <Clock className="h-4 w-4 text-blue-500" />;
    case 'screening': return <FileText className="h-4 w-4 text-purple-500" />;
    case 'shortlisted': return <ThumbsUp className="h-4 w-4 text-green-500" />;
    case 'interview': return <Calendar className="h-4 w-4 text-amber-500" />;
    case 'offer': return <CheckCircle className="h-4 w-4 text-emerald-500" />;
    case 'rejected': return <XCircle className="h-4 w-4 text-red-500" />;
    default: return <Clock3 className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusBadge = (status) => {
  const styles = {
    new: 'bg-blue-100 text-blue-800',
    screening: 'bg-purple-100 text-purple-800',
    shortlisted: 'bg-green-100 text-green-800',
    interview: 'bg-amber-100 text-amber-800',
    offer: 'bg-emerald-100 text-emerald-800',
    rejected: 'bg-red-100 text-red-800',
  };
  
  const labels = {
    new: 'New',
    screening: 'Screening',
    shortlisted: 'Shortlisted',
    interview: 'Interview',
    offer: 'Offer',
    rejected: 'Rejected',
  };
  
  return (
    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {getStatusIcon(status)}
      <span className="ml-1">{labels[status]}</span>
    </div>
  );
};

const getInitials = (name) => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
};

const CandidateManagement = () => {
  const [candidates, setCandidates] = useState(mockCandidates);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPosition, setFilterPosition] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Simulate data loading
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);
  
  // Filter candidates based on search term and filters
  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          candidate.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || candidate.status === filterStatus;
    const matchesPosition = filterPosition === 'all' || candidate.position === filterPosition;
    
    return matchesSearch && matchesStatus && matchesPosition;
  });
  
  const positions = [...new Set(candidates.map(c => c.position))];
  
  const updateCandidateStatus = (candidateId, newStatus) => {
    setCandidates(prev => 
      prev.map(candidate => 
        candidate.id === candidateId 
          ? { ...candidate, status: newStatus } 
          : candidate
      )
    );
    
    toast({
      title: "Status updated",
      description: `Candidate status changed to ${newStatus}`,
    });
  };
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Candidate Management</h1>
            <p className="text-gray-500">Manage and track candidates for your job positions</p>
          </div>
          
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <Button variant="outline" className="flex items-center gap-1.5">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Schedule Interview
            </Button>
          </div>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Search candidates..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="screening">Screening</SelectItem>
                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="offer">Offer</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterPosition} onValueChange={setFilterPosition}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Positions</SelectItem>
                {positions.map(position => (
                  <SelectItem key={position} value={position}>{position}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Tabs for candidate stages */}
        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="bg-white p-1 rounded-lg">
            <TabsTrigger value="all">All Candidates</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
            <TabsTrigger value="screening">Screening</TabsTrigger>
            <TabsTrigger value="interview">Interview</TabsTrigger>
            <TabsTrigger value="offer">Offer</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Candidate Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredCandidates.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No candidates match your search criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-3">Candidate</th>
                    <th className="px-6 py-3">Position</th>
                    <th className="px-6 py-3">Applied Date</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Match</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCandidates.map(candidate => (
                    <motion.tr 
                      key={candidate.id} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedCandidate(candidate)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-3">
                            <AvatarImage src={candidate.avatar} />
                            <AvatarFallback className="bg-blue-100 text-blue-600">{getInitials(candidate.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-gray-900">{candidate.name}</div>
                            <div className="text-gray-500 text-xs">{candidate.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-gray-900">{candidate.position}</div>
                          <div className="text-gray-500 text-xs">{candidate.experience} experience</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(candidate.appliedDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(candidate.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className={`h-2 rounded-full ${
                                candidate.matchScore >= 80 ? 'bg-green-500' : 
                                candidate.matchScore >= 60 ? 'bg-amber-500' : 'bg-red-500'
                              }`} 
                              style={{ width: `${candidate.matchScore}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium">{candidate.matchScore}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(candidate.resumeUrl, '_blank');
                              }}
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              <span>View Resume</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.location.href = `mailto:${candidate.email}`;
                              }}
                            >
                              <Mail className="mr-2 h-4 w-4" />
                              <span>Send Email</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateCandidateStatus(candidate.id, 'shortlisted');
                              }}
                            >
                              <ThumbsUp className="mr-2 h-4 w-4" />
                              <span>Shortlist</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateCandidateStatus(candidate.id, 'rejected');
                              }}
                            >
                              <ThumbsDown className="mr-2 h-4 w-4" />
                              <span>Reject</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Candidate Detail Modal */}
        {selectedCandidate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div 
              className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarImage src={selectedCandidate.avatar} />
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                        {getInitials(selectedCandidate.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{selectedCandidate.name}</h2>
                      <p className="text-gray-500">{selectedCandidate.position}</p>
                      <div className="mt-1">{getStatusBadge(selectedCandidate.status)}</div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    onClick={() => setSelectedCandidate(null)}
                    className="h-8 w-8 p-0"
                  >
                    <XCircle className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Contact Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-700">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        <a href={`mailto:${selectedCandidate.email}`} className="hover:text-blue-600">
                          {selectedCandidate.email}
                        </a>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        <span>+1 (555) 123-4567</span>
                      </div>
                    </div>
                    
                    <h3 className="text-sm font-medium text-gray-500 mt-6 mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCandidate.skills.map(skill => (
                        <Badge key={skill} variant="secondary" className="bg-gray-100">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Application Details</h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-700">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <span>Applied on {new Date(selectedCandidate.appliedDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <User className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{selectedCandidate.experience} of experience</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <FileText className="h-4 w-4 mr-2 text-gray-400" />
                        <a href={selectedCandidate.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          View Resume
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Match Score: {selectedCandidate.matchScore}%</h3>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div 
                      className={`h-2.5 rounded-full ${
                        selectedCandidate.matchScore >= 80 ? 'bg-green-500' : 
                        selectedCandidate.matchScore >= 60 ? 'bg-amber-500' : 'bg-red-500'
                      }`} 
                      style={{ width: `${selectedCandidate.matchScore}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="mt-6 flex flex-wrap gap-3 justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      updateCandidateStatus(selectedCandidate.id, 'rejected');
                      setSelectedCandidate(null);
                    }}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      updateCandidateStatus(selectedCandidate.id, 'interview');
                      setSelectedCandidate(null);
                    }}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Interview
                  </Button>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => {
                      updateCandidateStatus(selectedCandidate.id, 'offer');
                      setSelectedCandidate(null);
                    }}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Send Offer
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateManagement; 