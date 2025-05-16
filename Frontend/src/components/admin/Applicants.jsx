import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import ApplicantsTable from './ApplicantsTable'
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '@/Redux/ApplicationSlice.js';
import { Button } from '../ui/button';
import { List, ArrowLeft } from 'lucide-react';


const Applicants = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { applicants } = useSelector(store => store.application);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllApplicants = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/${params.id}/applicants`,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            ...(localStorage.getItem('token') && {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            })
          }
        }
      );
      
      if (res.data.success) {
        // Changed to match the new response structure
        dispatch(setAllApplicants({
          applications: res.data.applicants || []
        }));
      } else {
        setError(res.data.message || "Failed to load applicants");
      }
    } catch (error) {
      console.error("Error fetching applicants:", error);
      setError(error.response?.data?.message || "Error loading applicants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllApplicants();
    
    // Set up polling to refresh data every 30 seconds
    const interval = setInterval(fetchAllApplicants, 30000);
    return () => clearInterval(interval);
  }, [params.id]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Navbar/>
        <div className="max-w-7xl mx-auto py-8 px-4">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-gray-200 rounded mb-6"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Navbar/>
        <div className="max-w-7xl mx-auto py-8 px-4">
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
            <p>{error}</p>
            <Button 
              onClick={fetchAllApplicants}
              className="mt-2 bg-red-600 hover:bg-red-700"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar/>
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              className="text-gray-600"
              onClick={() => navigate(`/admin/jobs`)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jobs
            </Button>
            <h1 className="text-2xl font-bold">Applicants ({applicants?.applications?.length || 0})</h1>
          </div>
          
          <Button 
            className="bg-purple-600 hover:bg-purple-700 text-white"
            onClick={() => navigate(`/admin/jobs/pipeline/${params.id}/candidates`)}
          >
            <List className="w-4 h-4 mr-2" />
            Manage Pipeline
          </Button>
        </div>
        <ApplicantsTable/>
      </div>
    </div>
  );
}

export default Applicants;