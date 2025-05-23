import { useState } from 'react'
import './App.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
// Auth components
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'

// Public components
import Home from './components/Home'
import Jobs from './components/Jobs'
import Browse from './components/Browse'
import JobDescription from './components/JobDescription'
import Faqs from './components/Faqs'
import Settings from './components/Settings'

// Student-specific components
import Profile from './components/Profile'
import RecommendedJobs from './components/RecommendedJobs'
import JobsNearYou from './components/JobsNearYou'
import Dashboard from './components/candidate/Dashboard'
import SavedJobs from './components/SavedJobs'

// Recruiter (admin) base components
import Companies from './components/admin/Companies'
import CompanyCreate from './components/admin/CompanyCreate'
import CompanySetup from './components/admin/CompanySetup'
import AdminJobs from './components/admin/AdminJobs'
import PostJob from './components/admin/PostJob'
import Applicants from './components/admin/Applicants'
import JobEdit from './components/admin/JobEdit'

// New recruiter features
import RecruiterSettings from './components/admin/RecruiterSettings'
import RecruiterAnalytics from './components/admin/RecruiterAnalytics'
import CandidateManagement from './components/admin/CandidateManagement'
import CandidateProfile from './components/admin/CandidateProfile'

// Route protection components
import ProtectedRoute from './components/admin/ProtectedRoute'
import StudentRoute from './components/shared/StudentRoute'

import InterviewPipeline from "./components/admin/InterviewPipeline";
import AptitudeTestSetup from "./components/admin/AptitudeTestSetup";
import CandidatePipeline from "./components/admin/CandidatePipeline";
import AptitudeTest from "./components/candidate/AptitudeTest";
import CandidateProgress from "./components/candidate/CandidateProgress";
import CandidateProgressView from "./components/admin/CandidateProgressView";
import InterviewProgress from "./components/candidate/InterviewProgress";

const appRouter = createBrowserRouter([
  // Public routes
  {
    path: '/',
    element: <Home/>,
  },
  {
    path: '/login',
    element: <Login/>,
  },
  {
    path: '/signup',
    element: <Signup/>,
  },
  {
    path: '/jobs',
    element: <Jobs/>,
  },
  {
    path: '/description/:id',
    element: <JobDescription/>,
  },
  {
    path: '/browse',
    element: <Browse/>,
  },
  {
    path: '/faqs',
    element: <Faqs/>,
  },
  {
    path: '/settings',
    element: <Settings/>,
  },
  
  // Student-specific routes
  {
    path: '/profile',
    element: <Profile/>,
  },
  {
    path: '/candidate/dashboard',
    element: <StudentRoute><Dashboard/></StudentRoute>,
  },
  {
    path: '/recommended-jobs',
    element: <StudentRoute><RecommendedJobs/></StudentRoute>,
  },
  {
    path: '/jobs-near-you',
    element: <StudentRoute><JobsNearYou/></StudentRoute>,
  },
  {
    path: '/saved-jobs',
    element: <StudentRoute><SavedJobs/></StudentRoute>,
  },
  
  // Recruiter routes
  // Company management
  {
    path: "/admin/companies",
    element: <ProtectedRoute><Companies/></ProtectedRoute>,
  },
  {
    path: "/admin/companies/create",
    element: <ProtectedRoute><CompanyCreate/></ProtectedRoute>,
  },
  {
    path: "/admin/companies/:id",
    element: <ProtectedRoute><CompanySetup/></ProtectedRoute>,
  },
  
  // Job management
  {
    path: "/admin/jobs",
    element: <ProtectedRoute><AdminJobs/></ProtectedRoute>,
  },
  {
    path: "/admin/jobs/create",
    element: <ProtectedRoute><PostJob/></ProtectedRoute>,
  },
  {
    path: "/admin/jobs/edit/:jobId",
    element: <ProtectedRoute><JobEdit/></ProtectedRoute>,
  },
  {
    path: "/admin/jobs/:id/applicants",
    element: <ProtectedRoute><Applicants/></ProtectedRoute>,
  },
  
  // New recruiter features
  {
    path: "/admin/settings",
    element: <ProtectedRoute><RecruiterSettings/></ProtectedRoute>,
  },
  {
    path: "/admin/analytics",
    element: <ProtectedRoute><RecruiterAnalytics/></ProtectedRoute>,
  },
  {
    path: "/admin/candidates",
    element: <ProtectedRoute><CandidateManagement/></ProtectedRoute>,
  },
  {
    path: "/admin/candidates/:candidateId",
    element: <ProtectedRoute><CandidateProfile /></ProtectedRoute>,
  },
  {
    path: "/admin/jobs/:jobId/candidates/:candidateId",
    element: <ProtectedRoute><CandidateProfile /></ProtectedRoute>,
  },
  {
    path: "/admin/jobs/pipeline/:jobId",
    element: <ProtectedRoute><InterviewPipeline /></ProtectedRoute>,
  },
  {
    path: "/admin/jobs/pipeline/:jobId/candidates",
    element: <ProtectedRoute><CandidatePipeline /></ProtectedRoute>,
  },
  {
    path: "/admin/jobs/pipeline/:jobId/round/:roundId/aptitude-test",
    element: <ProtectedRoute><AptitudeTestSetup /></ProtectedRoute>,
  },

  {
    path: "/candidate/applications/:jobId/progress",
    element: <StudentRoute><CandidateProgress /></StudentRoute>,
  },
  {
    path: "/candidate/job/:jobId/progress",
    element: <StudentRoute><InterviewProgress /></StudentRoute>,
  },
  {
    path: "/admin/candidates/:candidateId/progress/:jobId",
    element: <ProtectedRoute><CandidateProgressView /></ProtectedRoute>,
  },
  {
    path: "/candidate/aptitude-test/:testId",
    element: <StudentRoute><AptitudeTest /></StudentRoute>,
  },
])

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <RouterProvider router={appRouter}/>
    </>
  )
}

export default App;
