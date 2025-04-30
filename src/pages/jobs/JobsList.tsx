import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Search, Filter, Briefcase, DollarSign } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../../config';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Alert from '../../components/ui/Alert';

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  description: string;
  salary: string;
  user: string;
  createdAt: string;
}

const JobsList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialSearchTerm = queryParams.get('search') || '';

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Filter states
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [locationFilter, setLocationFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [salaryFilter, setSalaryFilter] = useState('');
  const [showMyJobs, setShowMyJobs] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchJobs();
  }, [page, showMyJobs, searchTerm, locationFilter, jobTypeFilter, salaryFilter]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = `?page=${page}`;
      if (searchTerm) query += `&search=${encodeURIComponent(searchTerm)}`;
      if (locationFilter) query += `&location=${encodeURIComponent(locationFilter)}`;
      if (jobTypeFilter) query += `&jobType=${encodeURIComponent(jobTypeFilter)}`;
      if (salaryFilter) query += `&salary=${encodeURIComponent(salaryFilter)}`;
      if (showMyJobs && user && user.role === 'employer') query += `&userId=${user._id}`;

      const { data } = await axios.get(`${API_URL}/api/jobs${query}`, {
        withCredentials: true
      });

      setJobs(data.jobs);
      setTotalPages(data.totalPages || 1);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setLocationFilter('');
    setJobTypeFilter('');
    setSalaryFilter('');
    setShowMyJobs(false);
    setPage(1);
  };

  const toggleMyJobs = () => {
    setShowMyJobs(!showMyJobs);
    setPage(1);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters sidebar */}
        <div className="w-full md:w-1/4">
          <div className="bg-white p-6 rounded-lg shadow-sm sticky top-20">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </h2>

            <form onSubmit={handleSearch} className="space-y-4">
              <Input
                placeholder="Job title or keyword"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />

              <Input
                placeholder="Location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full"
              />

              <Select
                label="Job Type"
                options={[
                  { value: '', label: 'All Types' },
                  { value: 'Full-time', label: 'Full-time' },
                  { value: 'Part-time', label: 'Part-time' },
                  { value: 'Contract', label: 'Contract' },
                  { value: 'Internship', label: 'Internship' },
                  { value: 'Remote', label: 'Remote' },
                ]}
                value={jobTypeFilter}
                onChange={(e) => setJobTypeFilter(e.target.value)}
              />

              <Select
                label="Salary Range"
                options={[
                  { value: '', label: 'Any Salary' },
                  { value: '0-50000', label: 'Under $50,000' },
                  { value: '50000-80000', label: '$50,000 - $80,000' },
                  { value: '80000-100000', label: '$80,000 - $100,000' },
                  { value: '100000-150000', label: '$100,000 - $150,000' },
                  { value: '150000-', label: '$150,000+' },
                ]}
                value={salaryFilter}
                onChange={(e) => setSalaryFilter(e.target.value)}
              />

              {user?.role === 'employer' && (
                <div className="flex items-center mt-4">
                  <input
                    type="checkbox"
                    id="myJobs"
                    checked={showMyJobs}
                    onChange={toggleMyJobs}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="myJobs" className="ml-2 block text-sm text-gray-700">
                    Show only my job posts
                  </label>
                </div>
              )}

              <div className="flex flex-col space-y-2 pt-2">
                <Button type="submit" variant="primary" fullWidth>
                  Apply Filters
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Job listings */}
        <div className="w-full md:w-3/4">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold text-gray-900 mb-2 sm:mb-0">
              {showMyJobs ? 'My Job Listings' : 'Available Jobs'}
            </h1>
            {user?.role === 'employer' && (
              <Link to="/jobs/create">
                <Button variant="primary">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Post a Job
                </Button>
              </Link>
            )}
          </div>

          {error && (
            <Alert type="error" message={error} onClose={() => setError(null)} />
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : jobs.length > 0 ? (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 mb-1 md:mb-0">
                      <Link to={`/jobs/${job._id}`} className="hover:text-blue-600 transition-colors">
                        {job.title}
                      </Link>
                    </h2>
                    <div className="flex items-center space-x-2">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full">
                        {job.jobType}
                      </span>
                      <span className="text-gray-500 text-sm">
                        Posted {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center text-gray-500 mb-4 gap-2 sm:gap-6">
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-1" />
                      <span>{job.company}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span>{job.salary}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>

                  <div className="flex justify-between items-center">
                    <Link to={`/jobs/${job._id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>

                    {user?.role === 'employer' && job.user === user._id && (
                      <div className="flex space-x-2">
                        <Link to={`/jobs/edit/${job._id}`}>
                          <Button variant="secondary" size="sm">
                            Edit
                          </Button>
                        </Link>
                        <Link to={`/jobs/${job._id}/applications`}>
                          <Button variant="primary" size="sm">
                            View Applications
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex space-x-1">
                    <Button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      variant="outline"
                      size="sm"
                    >
                      Previous
                    </Button>
                    
                    <div className="flex items-center px-4">
                      <span className="text-gray-700">
                        Page {page} of {totalPages}
                      </span>
                    </div>
                    
                    <Button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      variant="outline"
                      size="sm"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg text-center">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-500 mb-6">
                {showMyJobs
                  ? "You haven't posted any jobs yet."
                  : "No jobs match your search criteria. Try adjusting your filters."}
              </p>
              {user?.role === 'employer' && showMyJobs ? (
                <Link to="/jobs/create">
                  <Button variant="primary">Post Your First Job</Button>
                </Link>
              ) : (
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobsList;