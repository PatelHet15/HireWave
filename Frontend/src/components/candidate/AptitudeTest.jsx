import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import Navbar from '../shared/Navbar';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Progress } from '../ui/progress';
import { ArrowLeft, ArrowRight, Check, Timer, AlertTriangle, FileText } from 'lucide-react';
import { PIPELINE_API_END_POINT } from '@/utils/constant';

const AptitudeTest = () => {
  const { testId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [testData, setTestData] = useState(null);
  const [jobData, setJobData] = useState(null);
  const [roundData, setRoundData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // Validate params exist
  useEffect(() => {
    if (!testId) {
      toast.error('Invalid test link');
      navigate('/candidate/dashboard');
    }
  }, [testId, navigate]);

  useEffect(() => {
    if (testId) {
      fetchTestData();
    }
  }, [testId]);

  useEffect(() => {
    if (!testStarted || !timeLeft) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testStarted, timeLeft]);

  const fetchTestData = async () => {
    try {
      setLoading(true);
      console.log('[Aptitude Test] Fetching test data for ID:', testId);

      // Extract jobId and roundId from URL query parameters
      const urlParams = new URLSearchParams(window.location.search);
      const jobIdParam = urlParams.get('jobId');
      const roundIdParam = urlParams.get('roundId');

      // Use the correct endpoint as defined in the backend router
      const endpoint = `${PIPELINE_API_END_POINT}/aptitude-test/${testId}`;
      console.log(`[Aptitude Test] Using endpoint: ${endpoint}`);
      
      const res = await axios.get(endpoint, {
        params: {
          jobId: jobIdParam,
          roundId: roundIdParam
        },
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!res.data.success) {
        throw new Error(res.data.message || 'Failed to fetch test data');
      }
      
      console.log('[Aptitude Test] Successfully fetched test data:', res.data);
      
      const { aptitudeTest } = res.data;
      setTestData(aptitudeTest);
      setTimeLeft(aptitudeTest.duration * 60);

      // Initialize empty answers object
      const initialAnswers = {};
      aptitudeTest.questions.forEach((q, index) => {
        initialAnswers[index] = q.type === 'multiple-choice' || q.type === 'true-false' 
          ? null 
          : '';
      });
      setAnswers(initialAnswers);

      // Store jobId and roundId from URL or from test data
      const finalJobId = jobIdParam || aptitudeTest.jobId;
      const finalRoundId = roundIdParam || aptitudeTest.roundId;
      
      // Fetch job and round info for context
      await fetchJobAndRoundInfo(finalJobId, finalRoundId);

      // Check if test is already completed
      await checkExistingAttempt(aptitudeTest._id);
    } catch (error) {
      console.error('[Aptitude Test] Error fetching test data:', error);
      console.error('[Aptitude Test] Error details:', error.response?.data || error.message);
      
      if (error.response?.status === 404) {
        toast.error('Test not found or no longer available');
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to access this test');
      } else {
        toast.error('Failed to load test. Please try again later.');
      }
      navigate('/candidate/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchJobAndRoundInfo = async (jobId, roundId) => {
    try {
      if (!jobId) {
        console.error('Missing jobId in fetchJobAndRoundInfo');
        return;
      }

      const res = await axios.get(`${PIPELINE_API_END_POINT}/job/${jobId}/my-progress`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('token') && {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          })
        }
      });

      if (res.data.success) {
        const job = res.data.job;
        setJobData(job);
        
        // Log all interview rounds for debugging
        if (job.interviewRounds && Array.isArray(job.interviewRounds)) {
          console.log('Available interview rounds:', job.interviewRounds.map(r => ({
            id: r._id,
            name: r.name,
            type: r.type,
            testLink: r.aptitudeTestLink || 'none'
          })));
          
          // Try to find the round by ID first
          let round = null;
          if (roundId) {
            round = job.interviewRounds.find(r => r._id === roundId);
          }
          
          // If not found by ID, try to find by aptitude type
          if (!round) {
            round = job.interviewRounds.find(r => r.type === 'aptitude');
          }
          
          // If found, set the round data
          if (round) {
            console.log('Found matching round:', round);
            setRoundData(round);
          } else {
            console.warn('No matching round found for roundId:', roundId);
          }
        } else {
          console.warn('No interview rounds found in job data');
        }
      }
    } catch (error) {
      console.error('Error fetching job and round info:', error);
      if (error.response) {
        console.error('Response error data:', error.response.data);
      }
    }
  };

  const checkExistingAttempt = async (testId) => {
    try {
      console.log('[Aptitude Test] Checking for existing test attempt for ID:', testId);
      
      // Use the correct endpoint as defined in the backend router
      const endpoint = `${PIPELINE_API_END_POINT}/aptitude-test/${testId}/attempt`;
      console.log(`[Aptitude Test] Using attempt endpoint: ${endpoint}`);
      
      const res = await axios.get(endpoint, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (res.data.success && res.data.testAttempt) {
        console.log('[Aptitude Test] Found existing test attempt:', res.data.testAttempt);
        const { testAttempt } = res.data;
        if (testAttempt.completed) {
          setTestCompleted(true);
          setTestResult({
            score: testAttempt.score,
            percentageScore: testAttempt.percentageScore,
            passed: testAttempt.passed,
            completionTime: testAttempt.completionTime
          });
        } else {
          setTestStarted(true);
          if (testAttempt.answers) {
            setAnswers(testAttempt.answers);
          }
        }
      } else {
        console.log('[Aptitude Test] No existing test attempt found');
      }
    } catch (error) {
      console.error('[Aptitude Test] Error checking existing test attempt:', error);
      console.error('[Aptitude Test] Error details:', error.response?.data || error.message);
      // No need to show UI errors here, just log the issue
    }
  };

  const handleAnswerChange = (questionIndex, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: value
    }));
  };

  const handleOptionSelect = (questionIndex, optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  const startTest = () => {
    setTestStarted(true);
    // API call to record start time could be added here
  };

  const handleNextQuestion = () => {
    if (currentQuestion < testData.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const isQuestionAnswered = (questionIndex) => {
    const answer = answers[questionIndex];
    if (answer === null || answer === undefined) return false;
    if (typeof answer === 'string' && answer.trim() === '') return false;
    return true;
  };

  const getAnsweredQuestionsCount = () => {
    return Object.values(answers).filter(a => a !== null && a !== undefined && a !== '').length;
  };

  const handleSubmitTest = async () => {
    try {
      setSubmitting(true);

      if (!testData || !testData._id) {
        toast.error('Invalid test data');
        return;
      }

      // Validate all answers are provided
      const unansweredQuestions = testData.questions.filter((_, index) => 
        !isQuestionAnswered(index)
      );

      if (unansweredQuestions.length > 0) {
        toast.error(`Please answer all questions (${unansweredQuestions.length} unanswered)`);
        return;
      }

      // Extract jobId and roundId from URL query parameters
      const urlParams = new URLSearchParams(window.location.search);
      const jobIdParam = urlParams.get('jobId');
      const roundIdParam = urlParams.get('roundId');

      const payload = {
        answers,
        jobId: jobIdParam || testData.jobId,
        roundId: roundIdParam || testData.roundId
      };

      console.log('[Aptitude Test] Submitting test with payload:', payload);
      
      // Use the correct endpoint as defined in the backend router
      const submitEndpoint = `${PIPELINE_API_END_POINT}/aptitude-test/${testData._id}/submit`;
      console.log(`[Aptitude Test] Using submit endpoint: ${submitEndpoint}`);
      
      const res = await axios.post(
        submitEndpoint,
        payload,
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (res.data.success) {
        console.log('[Aptitude Test] Submission successful:', res.data);
        setTestCompleted(true);
        setTestResult(res.data.result);
        toast.success('Test submitted successfully!');
      } else {
        console.error('[Aptitude Test] Submission failed with error:', res.data);
        toast.error(res.data.message || 'Failed to submit test');
      }
    } catch (error) {
      console.error('[Aptitude Test] Error submitting test:', error);
      console.error('[Aptitude Test] Error details:', error.response?.data || error.message);
      
      // More descriptive error message based on the error type
      if (error.response?.status === 404) {
        toast.error('The test submission endpoint was not found. Please contact support.');
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to submit this test.');
      } else if (error.response?.status === 500) {
        toast.error('Server error while submitting test. Please try again or contact support.');
      } else {
        toast.error(error.response?.data?.message || 'Failed to submit test. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Navbar />
        <div className="max-w-4xl mx-auto pt-10 px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!testData) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Navbar />
        <div className="max-w-4xl mx-auto pt-10 px-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Not Available</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">The requested test could not be loaded.</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => navigate('/candidate/dashboard')}>
                Return to Dashboard
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  if (testCompleted) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Navbar />
        <div className="max-w-4xl mx-auto pt-10 px-4 pb-16">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)} 
              className="text-gray-600 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">{testData.title}</h1>
            <p className="text-gray-500">{jobData?.title} • {roundData?.name}</p>
          </div>

          <Card className={`mb-6 ${testResult.passed ? 'border-green-200' : 'border-red-200'}`}>
            <CardHeader className={`pb-2 ${testResult.passed ? 'bg-green-50' : 'bg-red-50'}`}>
              <CardTitle className={`text-xl ${testResult.passed ? 'text-green-800' : 'text-red-800'}`}>
                Test {testResult.passed ? 'Passed' : 'Failed'}
              </CardTitle>
              <CardDescription className={testResult.passed ? 'text-green-700' : 'text-red-700'}>
                Your score: {testResult.score} points ({testResult.percentageScore}%)
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Progress 
                value={testResult.percentageScore} 
                className={`h-2 ${testResult.passed ? 'bg-green-100' : 'bg-red-100'}`}
                indicatorClassName={testResult.passed ? 'bg-green-600' : 'bg-red-600'}
              />

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">Required passing score</div>
                  <div className="text-lg font-semibold">{testData.passingScore}%</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">Completion time</div>
                  <div className="text-lg font-semibold">
                    {new Date(testResult.completionTime).toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-gray-50">
              <div className="w-full text-center">
                <p className="text-gray-700 mb-4">
                  {testResult.passed 
                    ? 'Congratulations! You have passed this aptitude test.'
                    : 'Unfortunately, you did not meet the passing score for this test.'}
                </p>
                <Button 
                  onClick={() => navigate('/candidate/dashboard')}
                  className={`${testResult.passed ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                >
                  Return to Dashboard
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  if (!testStarted) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Navbar />
        <div className="max-w-4xl mx-auto pt-10 px-4 pb-16">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)} 
              className="text-gray-600 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">{testData.title}</h1>
            <p className="text-gray-500">{jobData?.title} • {roundData?.name}</p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Test Instructions</CardTitle>
              <CardDescription>Please read all instructions carefully before starting the test</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-700">{testData.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <div className="bg-gray-100 p-2 rounded-full mr-3">
                      <Timer className="h-5 w-5 text-gray-700" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Duration</h4>
                      <p className="text-gray-500">{testData.duration} minutes</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-gray-100 p-2 rounded-full mr-3">
                      <FileText className="h-5 w-5 text-gray-700" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Questions</h4>
                      <p className="text-gray-500">{testData.questions.length} questions</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-gray-100 p-2 rounded-full mr-3">
                      <Check className="h-5 w-5 text-gray-700" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Passing Score</h4>
                      <p className="text-gray-500">{testData.passingScore}%</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Important Notes:</h4>
                      <ul className="list-disc list-inside text-yellow-700 space-y-1 mt-1">
                        <li>Once you start the test, the timer cannot be paused</li>
                        <li>Ensure you have a stable internet connection</li>
                        <li>Do not refresh the page or navigate away during the test</li>
                        <li>You can review and change your answers before final submission</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-4">
              <Button 
                onClick={startTest}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Start Test
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  const currentQuestionData = testData.questions[currentQuestion];

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto pt-6 px-4 pb-16">
        {/* Timer and progress bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 sticky top-0 z-10">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm text-gray-500">
              Question {currentQuestion + 1} of {testData.questions.length}
            </div>
            <div className={`flex items-center font-mono ${timeLeft < 60 ? 'text-red-600 animate-pulse' : timeLeft < 300 ? 'text-amber-600' : 'text-gray-700'}`}>
              <Timer className="h-4 w-4 mr-1" />
              {formatTime(timeLeft)}
            </div>
          </div>
          <Progress value={(getAnsweredQuestionsCount() / testData.questions.length) * 100} className="h-1" />
        </div>

        {/* Question card */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">{currentQuestionData.questionText}</CardTitle>
            <CardDescription>
              {currentQuestionData.type === 'multiple-choice' ? 'Select one option' : 
               currentQuestionData.type === 'true-false' ? 'Select True or False' : 
               'Provide a short answer'}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {(currentQuestionData.type === 'multiple-choice' || currentQuestionData.type === 'true-false') && (
              <RadioGroup 
                value={answers[currentQuestion]?.toString()} 
                onValueChange={(value) => handleOptionSelect(currentQuestion, parseInt(value))}
                className="space-y-3"
              >
                {currentQuestionData.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 transition-colors p-3 rounded-lg">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option.text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {currentQuestionData.type === 'short-answer' && (
              <Textarea
                value={answers[currentQuestion] || ''}
                onChange={(e) => handleAnswerChange(currentQuestion, e.target.value)}
                placeholder="Type your answer here..."
                className="min-h-[120px]"
              />
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <Button 
              variant="outline" 
              onClick={handlePrevQuestion}
              disabled={currentQuestion === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex gap-3">
              {currentQuestion === testData.questions.length - 1 ? (
                <Button 
                  onClick={handleSubmitTest}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Submit Test
                    </>
                  )}
                </Button>
              ) : (
                <Button 
                  onClick={handleNextQuestion}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>

        {/* Question navigation */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Question Navigation</h3>
          <div className="flex flex-wrap gap-2">
            {testData.questions.map((_, index) => (
              <Button
                key={index}
                variant={currentQuestion === index ? 'default' : 'outline'}
                size="sm"
                className={`w-10 h-10 p-0 ${
                  isQuestionAnswered(index) 
                    ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200' 
                    : 'bg-gray-50'
                } ${currentQuestion === index ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => setCurrentQuestion(index)}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AptitudeTest;