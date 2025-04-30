import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../../config';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';

interface Application {
  _id: string;
  job: {
    _id: string;
    title: string;
    company: string;
    location: string;
  };
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  coverLetter: string;
  createdAt: string;
}

const Applications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data } = await axios.get(`${API_URL}/api/applications/me`, {
          withCredentials: true,
        });
        
        setApplications(data.applications);
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load applications. Please try again.');
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending Review
          </span>
        );
      case 'reviewing':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock className="h-3 w-3 mr-1" />
            Under Review
          </span>
        );
      case 'accepted':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Accepted
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Not Selected
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Applications</h1>
      
      {error && (
        <Alert 
          type="error" 
          message={error} 
          onClose={() => setError(null)} 
        />
      )}
      
      {applications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <svg 
            className="mx-auto h-12 w-12 text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No applications yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            You haven't applied to any jobs yet. Start browsing our job listings to find the perfect match for your skills and experience.
          </p>
          <div className="mt-6">
            <Link to="/jobs">
              <Button variant="primary">Browse Jobs</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {applications.map((application) => (
              <li 
                key={application._id} 
                className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setSelectedApplication(application)}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {application.job.title}
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                      {application.job.company} • {application.job.location}
                    </p>
                    <div className="mt-2 flex items-center space-x-2">
                      {getStatusBadge(application.status)}
                      <span className="text-xs text-gray-500 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Applied on {new Date(application.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <Link to={`/jobs/${application.job._id}`}>
                      <Button variant="outline" size="sm">
                        View Job
                      </Button>
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Application details modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold text-gray-900">
                  Application Details
                </h2>
                <button 
                  onClick={() => setSelectedApplication(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {selectedApplication.job.title}
                  </h3>
                  <p className="text-gray-600">
                    {selectedApplication.job.company} • {selectedApplication.job.location}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700">Status:</span>
                  {getStatusBadge(selectedApplication.status)}
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Applied on</h4>
                  <p className="text-gray-900">
                    {new Date(selectedApplication.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Cover Letter</h4>
                  <div className="mt-1 p-4 bg-gray-50 rounded-md text-gray-800 whitespace-pre-line">
                    {selectedApplication.coverLetter}
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end space-x-3">
                  <Link to={`/jobs/${selectedApplication.job._id}`}>
                    <Button variant="outline">
                      View Job
                    </Button>
                  </Link>
                  <Button 
                    variant="primary"
                    onClick={() => setSelectedApplication(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;