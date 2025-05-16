import React, { useState, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { FileText, Mail, Calendar } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import {
  APPLICATION_API_END_POINT,
  PIPELINE_API_END_POINT,
  JOB_API_END_POINT
} from '@/utils/constant';
import logo from "../../assets/images/user.jpg";
import { format } from 'date-fns';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Eye, Loader2, ArrowRightCircle } from 'lucide-react';
import { updateApplicantStatus } from '@/Redux/ApplicationSlice.js';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '../ui/tooltip';
import { Skeleton } from '../ui/skeleton';

const ApplicantsTable = () => {
  const { applicants } = useSelector(store => store.application);
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Status display configuration
  const statusConfig = {
    'pending': {
      label: 'Pending',
      className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
      icon: <FileText className="h-3 w-3 mr-1" />
    },
    'accepted': {
      label: 'Accepted',
      className: 'bg-green-100 text-green-800 hover:bg-green-200',
      icon: <CheckCircle className="h-3 w-3 mr-1" />
    },
    'rejected': {
      label: 'Rejected',
      className: 'bg-red-100 text-red-800 hover:bg-red-200',
      icon: <XCircle className="h-3 w-3 mr-1" />
    }
  };

  // Get status display info
  const getStatusInfo = (status) => {
    return statusConfig[status] || {
      label: status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown',
      className: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
      icon: null
    };
  };

  // View applicant profile
  const viewApplicantProfile = (applicantId, jobId) => {
    // If we have a jobId, navigate to the job-specific candidate profile
    if (jobId) {
      navigate(`/admin/jobs/${jobId}/candidates/${applicantId}`);
    } else {
      // Otherwise, navigate to the general candidate profile
      navigate(`/admin/candidates/${applicantId}`);
    }
  };

  // View application details
  const viewApplicationDetails = (applicationId) => {
    const application = applicants?.applications?.find(app => app._id === applicationId);
    if (application) {
      navigate(`/admin/jobs/${application.job._id}/candidates/${application.applicant._id}`);
    }
  };

  // Loading skeleton
  if (loading && !applicants?.applications?.length) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
            <Skeleton className="h-10 w-24" />
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error && !applicants?.applications?.length) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-600 mb-2">{error}</p>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="text-red-600 border-red-300"
        >
          Retry Loading Applicants
        </Button>
      </div>
    );
  }

  // Empty state
  if (!applicants?.applications?.length) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
        <FileText className="mx-auto h-12 w-12 text-blue-400 mb-4" />
        <h3 className="text-lg font-medium text-blue-800 mb-2">No Applicants Yet</h3>
        <p className="text-blue-600 mb-4">This job hasn't received any applications yet.</p>
        <Button
          variant="outline"
          onClick={() => navigate(`/admin/jobs/${params.id}/promote`)}
          className="border-blue-300 text-blue-600"
        >
          Promote This Job
        </Button>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applicants.applications?.map((application) => {
                const statusInfo = getStatusInfo(application.status);

                return (
                  <tr key={application._id} className="hover:bg-gray-50 transition-colors">
                    {/* Applicant Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <Avatar className="h-10 w-10 border-2 border-blue-100 rounded-full">
                            <AvatarImage
                              src={application.applicant?.profile?.profilePhoto || logo}
                              alt={application.applicant?.fullname}
                              className="rounded-full object-cover"
                            />
                            <AvatarFallback className="bg-blue-50 text-blue-600">
                              {application.applicant?.fullname?.charAt(0) || 'A'}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="ml-4">
                          <div
                            className="text-sm font-medium text-gray-900 hover:text-blue-600 cursor-pointer"
                            onClick={() => viewApplicantProfile(application.applicant._id, application.job._id)}
                          >
                            {application.applicant?.fullname || 'Unknown Applicant'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {application.applicant?.email || ''}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Job Title Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {application.job?.title || 'Unknown Job'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {application.job?.jobType || ''}
                      </div>
                    </td>

                    {/* Applied Date Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        {format(new Date(application.createdAt), 'MMM dd, yyyy')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(application.createdAt), 'hh:mm a')}
                      </div>
                    </td>

                    {/* Status Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={`${statusInfo.className} text-xs flex items-center`}>
                        {statusInfo.icon}
                        {statusInfo.label}
                      </Badge>
                    </td>

                    {/* Progress Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {application.currentStage || 'Not Started'}
                      </div>
                      {application.status === 'accepted' && (
                        <div className="text-xs text-gray-500">
                          Next: Technical Interview
                        </div>
                      )}
                    </td>

                    {/* Actions Column */}
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => viewApplicantProfile(application.applicant._id, application.job._id)}
                              className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View Candidate Profile</p>
                          </TooltipContent>
                        </Tooltip>

                        {application.status === 'pending' && (
                          <div className="flex items-center gap-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => viewApplicantProfile(application.applicant._id, application.job._id)}
                                  className="text-gray-600 hover:text-green-600 hover:bg-green-50"
                                >
                                  <ArrowRightCircle className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Review Application</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ApplicantsTable;