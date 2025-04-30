import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Briefcase, Building2, MapPin } from 'lucide-react';
import Button from '../components/ui/Button';
import axios from 'axios';
import { API_URL } from '../config';

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary: string;
  createdAt: string;
}

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API_URL}/api/jobs?limit=6`);
        setFeaturedJobs(data.jobs);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch featured jobs:', error);
        setLoading(false);
      }
    };

    fetchFeaturedJobs();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to jobs page with search term
    window.location.href = `/jobs?search=${searchTerm}`;
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      {/* Hero section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            Find Your Dream Job Today
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Connect with top employers and discover opportunities that match your skills and aspirations.
          </p>

          <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center p-1 bg-white rounded-lg shadow-lg">
              <div className="flex items-center flex-1 px-2 py-3">
                <Search className="h-5 w-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  className="w-full border-none focus:outline-none text-gray-800"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button 
                type="submit" 
                className="m-1"
                variant="primary"
              >
                Search Jobs
              </Button>
            </div>
          </form>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link 
              to="/jobs" 
              className="text-white bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200 py-2 px-4 rounded-md inline-flex items-center"
            >
              <Briefcase className="h-4 w-4 mr-2" />
              Browse All Jobs
            </Link>
            <Link 
              to="/register" 
              className="text-white bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200 py-2 px-4 rounded-md inline-flex items-center"
            >
              <Building2 className="h-4 w-4 mr-2" />
              For Employers
            </Link>
          </div>
        </div>
      </section>

      {/* Featured jobs section */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Job Opportunities</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our handpicked selection of top positions from leading companies
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredJobs.length > 0 ? (
                featuredJobs.map((job) => (
                  <Link 
                    key={job._id} 
                    to={`/jobs/${job._id}`}
                    className="bg-white rounded-lg shadow-md transition-transform duration-200 hover:translate-y-[-4px] hover:shadow-lg"
                  >
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                      <p className="text-blue-600 font-medium mb-3">{job.company}</p>
                      <div className="flex items-center text-gray-500 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{job.location}</span>
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-green-600 font-semibold">{job.salary}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-3 text-center py-10">
                  <p className="text-gray-500 text-lg mb-4">No featured jobs available at the moment.</p>
                  <Link to="/jobs">
                    <Button variant="primary">Browse All Jobs</Button>
                  </Link>
                </div>
              )}
            </div>
          )}

          <div className="text-center mt-10">
            <Link to="/jobs">
              <Button variant="outline" size="lg">
                View All Job Listings
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How JobBoardX Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Finding your perfect job or ideal candidate is simple and efficient
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="inline-flex items-center justify-center h-16 w-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Search Jobs</h3>
              <p className="text-gray-600">
                Browse thousands of opportunities or use our advanced filters to find exactly what you're looking for.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="inline-flex items-center justify-center h-16 w-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Apply With Ease</h3>
              <p className="text-gray-600">
                Create your profile once and apply to jobs with just a few clicks. Track your application status in real-time.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="inline-flex items-center justify-center h-16 w-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Connect & Grow</h3>
              <p className="text-gray-600">
                Employers can review applications, schedule interviews, and build relationships with top talent in their industry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-blue-50 py-16 px-4 mt-auto">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Take the Next Step?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Whether you're looking for your next career move or searching for top talent, JobBoardX has you covered.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/register">
              <Button size="lg" variant="primary">
                Create Your Account
              </Button>
            </Link>
            <Link to="/jobs">
              <Button size="lg" variant="outline">
                Explore Job Listings
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;