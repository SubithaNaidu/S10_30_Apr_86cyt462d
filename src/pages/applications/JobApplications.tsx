// src/pages/JobApplications.tsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, CheckCircle, Clock, XCircle, User } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../../config';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';

interface Application {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  job: {
    _id: string;
    title: string;
  };
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  coverLetter: string;
  createdAt: string;
}

interface Job {
  _id: string;
  title: string;
  company: string;
}

const JobApplications = () => {
  const { id } = useParams<{ id: string }>();
  const [applications, setApplications] = useState<Application[]>([]);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.get(`${API_URL}/api/applications/job/${id}`, {
          withCredentials: true,
        });
        setApplications(data.applications);
        setJob(data.job);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load applications. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [id]);

  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      setStatusUpdateLoading(true);
      await axios.put(`${API_URL}/api/applications/${applicationId}`, { status: newStatus }, {
        withCredentials: true,
      });

      setApplications(applications.map(app =>
        app._id === applicationId ? { ...app, status: newStatus as any } : app
      ));

      if (selectedApplication && selectedApplication._id === applicationId) {
        setSelectedApplication({ ...selectedApplication, status: newStatus as any });
      }
    } catch (err: any) {
      console.error('Error updating application status:', err);
      setError(err.response?.data?.message || 'Failed to update application status.');
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'pending':
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}><Clock className="h-3 w-3 mr-1" /> Pending</span>;
      case 'reviewing':
        return <span className={`${baseClasses} bg-blue-100 text-blue-800`}><Clock className="h-3 w-3 mr-1" /> Reviewing</span>;
      case 'accepted':
        return <span className={`${baseClasses} bg-green-100 text-green-800`}><CheckCircle className="h-3 w-3 mr-1" /> Accepted</span>;
      case 'rejected':
        return <span className={`${baseClasses} bg-red-100 text-red-800`}><XCircle className="h-3 w-3 mr-1" /> Rejected</span>;
      default:
        return null;
    }
  };

  const renderStatusActions = (application: Application) => (
    <div className="flex flex-wrap gap-2 mt-4">
      <Button
        size="sm"
        variant={application.status === 'reviewing' ? 'primary' : 'outline'}
        disabled={application.status === 'reviewing' || statusUpdateLoading}
        onClick={() => updateApplicationStatus(application._id, 'reviewing')}
      >
        Mark as Reviewing
      </Button>
      <Button
        size="sm"
        variant={application.status === 'accepted' ? 'primary' : 'outline'}
        disabled={application.status === 'accepted' || statusUpdateLoading}
        onClick={() => updateApplicationStatus(application._id, 'accepted')}
      >
        Accept
      </Button>
      <Button
        size="sm"
        variant={application.status === 'rejected' ? 'danger' : 'outline'}
        disabled={application.status === 'rejected' || statusUpdateLoading}
        onClick={() => updateApplicationStatus(application._id, 'rejected')}
      >
        Reject
      </Button>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
          {job && (
            <p className="text-gray-600">
              For {job.title} at {job.company}
            </p>
          )}
        </div>
        <div className="mt-4 sm:mt-0">
          <Link to={`/jobs/${id}`}>
            <Button variant="outline">Back to Job</Button>
          </Link>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      {applications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No applications yet</h3>
          <p className="mt-1 text-sm text-gray-500">There are no applications for this job posting yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {applications.map(app => (
              <li
                key={app._id}
                className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setSelectedApplication(app)}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-2" />
                      <h2 className="text-lg font-semibold text-gray-900">{app.user.name}</h2>
                    </div>
                    <p className="text-sm text-gray-600">{app.user.email}</p>
                    <div className="mt-2 flex items-center space-x-2">
                      {getStatusBadge(app.status)}
                      <span className="text-xs text-gray-500 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <Button variant="primary" size="sm">Review Application</Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold text-gray-900">Application Details</h2>
                <button onClick={() => setSelectedApplication(null)} className="text-gray-400 hover:text-gray-500">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{selectedApplication.user.name}</h3>
                  <p className="text-gray-600">{selectedApplication.user.email}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-gray-700">Status:</span>
                  {getStatusBadge(selectedApplication.status)}
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700">Applied on</h4>
                  <p className="text-gray-900">{new Date(selectedApplication.createdAt).toLocaleDateString()}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700">Cover Letter</h4>
                  <p className="text-gray-800 whitespace-pre-wrap">{selectedApplication.coverLetter}</p>
                </div>

                {renderStatusActions(selectedApplication)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobApplications;
