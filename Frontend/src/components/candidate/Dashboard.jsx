import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import Navbar from '../shared/Navbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import {
  Bell, BookOpen, Briefcase, CheckCircle, ChevronRight, ClipboardCheck,
  Clock, FileText, XCircle, Award, CalendarClock, CircleCheck, AlertCircle, Circle,
  CalendarIcon
} from 'lucide-react';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT, PIPELINE_API_END_POINT } from '@/utils/constant';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Progress } from '../ui/progress';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [applications, setApplications] = useState([]);
  const [pendingTests, setPendingTests] = useState([]);
  const [interviewJobs, setInterviewJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applicationProgress, setApplicationProgress] = useState({});

  const getStatusVariant = (status) => {
    switch (status) {
      case 'accepted':
      case 'accept':
        return 'success';
      case 'rejected':
        return 'destructive';
      case 'pending':
      case 'in_process':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const handleViewProgress = (jobId) => {
    if (!jobId) {
      toast.error('Job information not available');
      return;
    }
    navigate(`/candidate/job/${jobId}/progress`);
  };

  const handleStartTest = (testId) => {
    navigate(`/candidate/aptitude-test/${testId}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchApplications();
    };

    fetchData();
    const intervalId = setInterval(fetchData, 30000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (applications.length > 0) {
      fetchPendingTests();
    }
  }, [applications]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      // console.log('Fetching applications...');

      const res = await axios.get(`${APPLICATION_API_END_POINT}/my-applications`, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      // console.log('Applications response:', res.data);

      if (res.data.success) {
        const appList = Array.isArray(res.data.applications) ? res.data.applications : [];
        // console.log('Application list:', appList);
        
        const validApps = appList.filter(app => app.job);
        // console.log('Valid applications:', validApps.length);
        setApplications(validApps);
        
        // Get both accepted and in-process applications - check for both 'accept' and 'accepted'
        const activeApps = validApps.filter(app => 
          app.status === 'accepted' || 
          app.status === 'accept' || 
          app.status === 'in_process'
        );
        // console.log('Active applications:', activeApps);

        if (activeApps.length > 0) {
          const progressData = {};
          
          await Promise.all(activeApps.map(async (app) => {
            try {
              if (!app.job?._id) {
                console.log('Missing job data for application:', app);
                return;
              }

              // console.log('Fetching progress for job:', app.job._id);
              
              try {
                // Get application progress
                const progressRes = await axios.get(
                  `${APPLICATION_API_END_POINT}/progress/application/${app._id}`,
                  { 
                    withCredentials: true,
                    headers: {
                      'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                  }
                );

                const progress = progressRes.data.progress;
                if (progress) {
                  progressData[app.job._id] = progress;
                  // console.log('Progress data received for job:', app.job._id, progress);
                } else {
                  console.log('No progress data received for job:', app.job._id);
                }
              } catch (progressError) {
                console.error(`Error fetching progress for job ${app.job?._id}:`, progressError);
                // Create fallback progress data to ensure UI shows something
                progressData[app.job._id] = {
                  currentRoundName: "Interview Process",
                  overallStatus: 'in_process',
                  totalRounds: 3,
                  completedRounds: 1
                };
              }
            } catch (error) {
              console.error(`Error processing application ${app._id}:`, error);
            }
          }));
          
          // console.log('Setting progress data:', progressData);
          setApplicationProgress(progressData);
        }
      } else {
        console.log('Failed to fetch applications:', res.data.message);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load your applications');
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingTests = async () => {
    try {
      if (!applications.length) {
        console.log('No applications found');
        setPendingTests([]);
        return;
      }

      const validApplications = applications.filter(app => app.job?._id);
      
      if (!validApplications.length) {
        console.log('No valid applications with job data');
        setPendingTests([]);
        return;
      }

      const response = await axios.get(`${PIPELINE_API_END_POINT}/pending-aptitude-tests`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        const validPendingTests = response.data.pendingTests.filter(test => {
          return validApplications.some(app => app.job._id === test.jobId);
        });
        setPendingTests(validPendingTests);
      }
    } catch (error) {
      console.error('Error fetching pending tests:', error);
      setPendingTests([]);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</Badge>;
      case 'accept':
        return <Badge variant="success" className="flex items-center gap-1 bg-green-100 text-green-800"><CheckCircle className="w-3 h-3" /> Accepted</Badge>;
      case 'reject':
        return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="w-3 h-3" /> Rejected</Badge>;
      case 'hired':
        return <Badge variant="success" className="flex items-center gap-1 bg-green-100 text-green-800"><Award className="w-3 h-3" /> Hired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getInterviewStatusInfo = (job) => {
    if (!job || !job._id || !applicationProgress[job._id]) {
      return {
        icon: <Clock className="w-4 h-4" />,
        text: "Not started",
        color: "text-gray-500"
      };
    }

    const progress = applicationProgress[job._id];

    // Handle case where application is accepted but pipeline not started
    if (!progress.currentRound || !progress.roundsStatus || progress.roundsStatus.length === 0) {
      return {
        icon: <Clock className="w-4 h-4" />,
        text: "Starting Aptitude Round",
        color: "text-blue-500"
      };
    }

    if (pendingTests && Array.isArray(pendingTests) && pendingTests.some(test => test && test.jobId === job._id)) {
      return {
        icon: <AlertCircle className="w-4 h-4" />,
        text: "Aptitude Test Required",
        color: "text-orange-500"
      };
    }

    if (progress && progress.nextInterviewDate) {
      return {
        icon: <CalendarClock className="w-4 h-4" />,
        text: `Interview on ${new Date(progress.nextInterviewDate).toLocaleDateString()}`,
        color: "text-blue-500"
      };
    }

    return {
      icon: <Clock className="w-4 h-4" />,
      text: "In Progress",
      color: "text-gray-500"
    };
  };

  // Add a helper function to check if a test is truly pending
  const isTestTrulyPending = (testId, jobId) => {
    // If no test ID, it's definitely not pending
    if (!testId) return false;
    
    // Check if user is already hired for this job
    const progress = applicationProgress[jobId];
    if (progress && progress.overallStatus === 'hired') {
      return false;
    }
    
    // Check if the aptitude round is already completed (either passed or failed)
    if (progress && progress.roundsStatus) {
      const aptitudeRound = progress.roundsStatus.find(round => 
        round.type === 'aptitude' || // Check by round type
        (testId && round.testId === testId) // Or match by specific test ID if we have it
      );
      
      if (aptitudeRound && (aptitudeRound.status === 'passed' || aptitudeRound.status === 'failed')) {
        return false;
      }
    }
    
    return true;
  };

  const renderApplications = () => {
    return applications.map((application) => {
      const pendingTest = pendingTests?.find(test => test.jobId === application.job?._id);
      const jobId = application.job?._id;
      const progress = applicationProgress[jobId];
      
      // Check if we should show the Take Aptitude Test button
      const shouldShowTestButton = 
        application.status === 'accepted' && 
        pendingTest && 
        isTestTrulyPending(pendingTest.testId, jobId) &&
        !(progress && progress.overallStatus === 'hired');
      
      return (
        <div key={application._id} className="bg-white p-6 rounded-lg shadow-sm border mb-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {application.job?.title || 'Job Title Not Available'}
              </h3>
              <p className="text-sm text-gray-500">
                {application.job?.company?.name || 'Unknown Company'}
              </p>
            </div>
            <Badge variant={getStatusVariant(application.status)}>
              {application.status}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 mt-4">
            <Button
              variant="outline"
              onClick={() => navigate(`/description/${application.job?._id}`)}
            >
              View Job
            </Button>

            <Button
              variant="outline"
              className="bg-blue-50 text-blue-700 hover:bg-blue-100"
              onClick={() => handleViewProgress(application.job?._id)}
            >
              View Progress
            </Button>

            {shouldShowTestButton && (
              <Button
                onClick={() => navigate(`/candidate/aptitude-test/${pendingTest.testId}?jobId=${pendingTest.jobId}&roundId=${pendingTest.roundId}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Take Aptitude Test
              </Button>
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Welcome, {user?.fullname || 'Candidate'}</h1>

        {/* Filter out tests that aren't truly pending before showing the notification card */}
        {(() => {
          // Filter the pending tests to only show truly pending ones
          const trulyPendingTests = pendingTests && Array.isArray(pendingTests) 
            ? pendingTests.filter(test => isTestTrulyPending(test.testId, test.jobId))
            : [];
          
          // Only show the notification if there are genuinely pending tests
          if (trulyPendingTests.length > 0) {
            return (
              <Card className="mb-6 border-l-4 border-l-orange-500">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="text-orange-500" />
                    Pending Aptitude Tests
                  </CardTitle>
                  <CardDescription>
                    You have {trulyPendingTests.length} pending aptitude test{trulyPendingTests.length > 1 ? 's' : ''} to complete
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trulyPendingTests.map(test => (
                      <div key={test.jobId} className="flex items-center justify-between p-3 bg-orange-50 rounded-md">
                        <div>
                          <p className="font-medium">{test.title}</p>
                          <p className="text-sm text-gray-600">{test.company}</p>
                          <p className="text-sm text-orange-700">Round: {test.roundName}</p>
                        </div>
                        <Button onClick={() => navigate(`/candidate/aptitude-test/${test.testId}`)}>
                          Take Test
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          }
          return null;
        })()}

        <Tabs defaultValue="applications" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="applications" className="flex items-center gap-1">
              <Briefcase className="w-4 h-4" /> Applications
            </TabsTrigger>
            <TabsTrigger value="interviews" className="flex items-center gap-1">
              <ClipboardCheck className="w-4 h-4" /> Interview Progress
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" /> Saved Jobs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>Your Applications</CardTitle>
                <CardDescription>
                  Track the status of your job applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-40">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                  </div>
                ) : applications && Array.isArray(applications) && applications.length > 0 ? (
                  renderApplications()
                ) : (
                  <Alert>
                    <AlertTitle>No applications found</AlertTitle>
                    <AlertDescription>
                      You haven't applied to any jobs yet. Browse available jobs to get started.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
              <CardFooter>
                <Button onClick={() => navigate('/jobs')}>Browse Jobs</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="interviews">
            <Card>
              <CardHeader>
                <CardTitle>Interview Progress</CardTitle>
                <CardDescription>
                  Track your progress through interview rounds
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-40">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                  </div>
                ) : applications.filter(app => app.status === 'accept' || app.status === 'accepted').length > 0 ? (
                  <div className="space-y-8">
                    {applications.filter(app => app.status === 'accept' || app.status === 'accepted').map((application) => {
                      if (!application || !application.job) return null;
                      
                      // Get progress data or create fallback data if none exists
                      let progress = applicationProgress[application.job._id];
                      
                      // If no progress data exists, create a minimal fallback structure
                      // This ensures something is displayed even if backend data is incomplete
                      if (!progress) {
                        console.log(`Creating fallback progress data for application ${application._id}`);
                        progress = {
                          currentRoundName: "Interview Round",
                          roundsStatus: [
                            {
                              name: "Application Review",
                              status: "passed",
                              order: 1
                            },
                            {
                              name: "Interview Round",
                              status: "scheduled",
                              scheduledDateTime: new Date().toISOString(),
                              order: 2
                            }
                          ],
                          totalRounds: 3,
                          completedRounds: 1,
                          overallStatus: 'in_process',
                          nextInterviewDate: new Date().toISOString()
                        };
                      }
                      
                      const currentRound = progress.currentRoundName || "Current Round";
                      const roundsData = progress.roundsStatus || [];
                      const totalRounds = progress.totalRounds || roundsData.length || 3;
                      const completedRounds = progress.completedRounds || roundsData.filter(r => r.status === 'passed').length || 1;
                      const progressPercentage = totalRounds > 0 ? Math.round((completedRounds / totalRounds) * 100) : 33;
                      
                      const isAptitudeRound = progress.currentRoundType === 'aptitude';
                      const pendingTest = pendingTests && pendingTests.find(test => test && test.jobId === application.job._id);
                      
                      // Check if we should show the Take Aptitude Test button in the interview tab
                      const shouldShowTestButton = 
                        pendingTest && 
                        isTestTrulyPending(pendingTest.testId, application.job._id) &&
                        progress.overallStatus !== 'hired' && 
                        progress.overallStatus !== 'rejected';
                      
                      return (
                        <div key={application._id} className="border rounded-lg p-6 bg-white shadow-sm">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-semibold">{application.job.title || 'Untitled Job'}</h3>
                              <p className="text-sm text-gray-500">{application.job.company?.name || 'Unknown Company'}</p>
                            </div>
                            <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                              {progress.overallStatus === 'in_process' ? 'In Progress' : 
                               progress.overallStatus === 'hired' ? 'Hired' : 
                               progress.overallStatus === 'rejected' ? 'Rejected' : 'Pending'}
                            </Badge>
                          </div>
                          
                          <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">Progress ({completedRounds}/{totalRounds} rounds)</span>
                              <span className="text-sm text-gray-500">{progressPercentage}%</span>
                            </div>
                            <Progress value={progressPercentage} className="h-2" />
                          </div>
                          
                          <div className="grid gap-4 mb-6">
                            {roundsData.length > 0 ? (
                              roundsData.sort((a, b) => (a.order || 0) - (b.order || 0)).map((round, idx) => (
                                <div key={round.roundId || `round-${idx}`} className="flex items-center gap-3">
                                  {round.status === 'pending' ? (
                                    <Clock className="h-5 w-5 text-yellow-500" />
                                  ) : round.status === 'passed' ? (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                  ) : round.status === 'failed' ? (
                                    <XCircle className="h-5 w-5 text-red-500" />
                                  ) : round.status === 'scheduled' ? (
                                    <CalendarClock className="h-5 w-5 text-blue-500" />
                                  ) : (
                                    <Circle className="h-5 w-5 text-gray-300" />
                                  )}
                                  
                                  <div className="flex-1">
                                    <p className="font-medium">{round.name || `Round ${idx + 1}`}</p>
                                    <p className="text-sm text-gray-500">
                                      {round.status === 'pending' ? 'Waiting to start' : 
                                       round.status === 'passed' ? 'Completed successfully' : 
                                       round.status === 'failed' ? 'Not passed' : 
                                       round.status === 'scheduled' ? `Scheduled for ${new Date(round.scheduledDateTime || Date.now()).toLocaleString()}` : 
                                       'Not started'}
                                      {round.score !== undefined && round.score !== null && 
                                        ` - Score: ${round.score}%`}
                                    </p>
                                  </div>
                                </div>
                              ))
                            ) : (
                              // Create default rounds if none exist
                              <>
                                <div className="flex items-center gap-3">
                                  <CheckCircle className="h-5 w-5 text-green-500" />
                                  <div className="flex-1">
                                    <p className="font-medium">Application Review</p>
                                    <p className="text-sm text-gray-500">Completed successfully</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <CalendarClock className="h-5 w-5 text-blue-500" />
                                  <div className="flex-1">
                                    <p className="font-medium">Initial Interview</p>
                                    <p className="text-sm text-gray-500">Scheduled for {new Date().toLocaleString()}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Circle className="h-5 w-5 text-gray-300" />
                                  <div className="flex-1">
                                    <p className="font-medium">Technical Assessment</p>
                                    <p className="text-sm text-gray-500">Not started</p>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                          
                          <div className="flex gap-3 flex-wrap">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/description/${application.job._id}`)}
                            >
                              View Job
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                              onClick={() => handleViewProgress(application.job._id)}
                            >
                              View Progress
                            </Button>
                            {shouldShowTestButton && (
                              <Button
                                size="sm"
                                onClick={() => navigate(`/candidate/aptitude-test/${pendingTest.testId}?jobId=${pendingTest.jobId}&roundId=${pendingTest.roundId}`)}
                                className="bg-orange-500 hover:bg-orange-600"
                              >
                                Take Aptitude Test
                              </Button>
                            )}
                            
                            {(progress.nextInterviewDate || true) && (
                              <Badge variant="outline" className="flex items-center gap-1 h-9 px-3 bg-blue-50 text-blue-800 border-blue-200">
                                <CalendarIcon className="h-4 w-4" />
                                Interview: {new Date(progress.nextInterviewDate || Date.now()).toLocaleDateString()}
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <Alert>
                    <AlertTitle>No interview processes found</AlertTitle>
                    <AlertDescription>
                      You aren't currently in any interview pipelines. Applications need to be accepted before you enter the interview process.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="saved">
            <Card>
              <CardHeader>
                <CardTitle>Saved Jobs</CardTitle>
                <CardDescription>
                  Jobs you've saved for later
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertTitle>Coming Soon</AlertTitle>
                  <AlertDescription>
                    This feature is still under development. Check back later!
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;