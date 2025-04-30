import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Briefcase, DollarSign, Clock, Share2, Building, User, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../../config';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import TextArea from '../../components/ui/TextArea';

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  description: string;
  requirements: string;
  responsibilities: string;
  salary: string;
  user: string;
  createdAt: string;
}

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  
  // Application state
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applicationSubmitting, setApplicationSubmitting] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [applicationError, setApplicationError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API_URL}/api/jobs/${id}`);
        setJob(data.job);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError('Failed to load job details. Please try again later.');
        setLoading(false);
      }
    };

    const checkApplicationStatus = async () => {
      if (user && user.role === 'jobseeker') {
        try {
          const { data } = await axios.get(`${API_URL}/api/applications/check/${id}`, {
            withCredentials: true,
          });
          setAlreadyApplied(data.applied);
        } catch (err) {
          console.error('Error checking application status:', err);
        }
      }
    };

    fetchJobDetails();
    if (user) {
      checkApplicationStatus();
    }
  }, [id, user]);

  const handleApply = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setShowApplicationForm(true);
  };

  const submitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!job || !user) return;
    
    try {
      setApplicationSubmitting(true);
      setApplicationError(null);
      
      await axios.post(`${API_URL}/api/applications`, {
        job: job._id,
        coverLetter,
      }, {
        withCredentials: true,
      });
      
      setApplicationSuccess(true);
      setAlreadyApplied(true);
      setShowApplicationForm(false);
    } catch (err: any) {
      setApplicationError(err.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setApplicationSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!job || !user) return;
    
    if (window.confirm('Are you sure you want to delete this job posting? This action cannot be undone.')) {
      try {
        await axios.delete(`${API_URL}/api/jobs/${id}`, {
          withCredentials: true,
        });
        
        navigate('/jobs');
      } catch (err) {
        console.error('Error deleting job:', err);
        setError('Failed to delete job. Please try again later.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
        <Alert type="error" message={error || 'Job not found'} />
        <div className="mt-6 text-center">
          <Link to="/jobs">
            <Button variant="primary">Browse All Jobs</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isEmployer = user && user.role === 'employer';
  const isJobOwner = isEmployer && user._id === job.user;
  const isJobSeeker = user && user.role === 'jobseeker';
  const canApply = isJobSeeker && !alreadyApplied;

  return (
    <div className="max-w-4xl mx-auto">
      {applicationSuccess && (
        <Alert 
          type="success" 
          message="Your application has been submitted successfully!" 
          onClose={() => setApplicationSuccess(false)}
        />
      )}
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        {/* Job header */}
        <div className="bg-blue-600 p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-1" />
                  <span>{job.company}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-800 text-white">
                {job.jobType}
              </span>
            </div>
          </div>
        </div>
        
        {/* Job content */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6">
            <div className="flex items-center text-gray-700">
              <DollarSign className="h-5 w-5 mr-1 text-green-600" />
              <span className="font-medium">{job.salary}</span>
            </div>
            
            <div className="flex space-x-2">
              {isJobOwner && (
                <>
                  <Link to={`/jobs/edit/${job._id}`}>
                    <Button variant="secondary" size="sm">
                      Edit Job
                    </Button>
                  </Link>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                  <Link to={`/jobs/${job._id}/applications`}>
                    <Button variant="primary" size="sm">
                      View Applications
                    </Button>
                  </Link>
                </>
              )}
              
              {canApply && (
                <Button 
                  variant="primary" 
                  onClick={handleApply}
                >
                  Apply Now
                </Button>
              )}
              
              {alreadyApplied && (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-5 w-5 mr-1" />
                  <span>Already Applied</span>
                </div>
              )}
              
              {!user && (
                <Link to="/login">
                  <Button variant="primary">
                    Sign in to Apply
                  </Button>
                </Link>
              )}
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Job Description</h2>
            <div className="text-gray-700 mb-6 whitespace-pre-line">
              {job.description}
            </div>
            
            <h2 className="text-xl font-semibold mb-4">Responsibilities</h2>
            <div className="text-gray-700 mb-6 whitespace-pre-line">
              {job.responsibilities}
            </div>
            
            <h2 className="text-xl font-semibold mb-4">Requirements</h2>
            <div className="text-gray-700 mb-6 whitespace-pre-line">
              {job.requirements}
            </div>
          </div>
        </div>
      </div>
      
      {/* Application form */}
      {showApplicationForm && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Apply for {job.title}</h2>
          
          {applicationError && (
            <Alert 
              type="error" 
              message={applicationError} 
              onClose={() => setApplicationError(null)} 
            />
          )}
          
          <form onSubmit={submitApplication}>
            <TextArea
              label="Cover Letter"
              id="coverLetter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Introduce yourself and explain why you're a good fit for this position..."
              rows={6}
              required
            />
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowApplicationForm(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={applicationSubmitting}
              >
                Submit Application
              </Button>
            </div>
          </form>
        </div>
      )}
      
      {/* Similar jobs placeholder - would be implemented with actual similar jobs logic */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Similar Jobs</h2>
        <p className="text-gray-500 text-center py-6">
          Similar job recommendations would appear here.
        </p>
      </div>
    </div>
  );
};

export default JobDetails;