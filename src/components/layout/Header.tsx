import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, Briefcase } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Logo from './Logo';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <Logo />
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:block">
            <ul className="flex items-center space-x-6">
              <li>
                <Link 
                  to="/jobs" 
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Browse Jobs
                </Link>
              </li>
              
              {user ? (
                <>
                  {user.role === 'employer' && (
                    <li>
                      <Link 
                        to="/jobs/create" 
                        className="text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        Post a Job
                      </Link>
                    </li>
                  )}
                  
                  <li>
                    <div className="relative group">
                      <button className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
                        <User size={18} className="mr-1" />
                        <span>Account</span>
                      </button>
                      
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                        <Link 
                          to="/profile" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Profile
                        </Link>
                        
                        {user.role === 'jobseeker' ? (
                          <Link 
                            to="/applications" 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            My Applications
                          </Link>
                        ) : (
                          <Link 
                            to="/jobs" 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            My Job Posts
                          </Link>
                        )}
                        
                        <button 
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link 
                      to="/login" 
                      className="text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      Sign In
                    </Link>
                  </li>
                  
                  <li>
                    <Link 
                      to="/register" 
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-500 hover:text-blue-600 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-3 border-t">
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/jobs" 
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Browse Jobs
                </Link>
              </li>
              
              {user ? (
                <>
                  {user.role === 'employer' && (
                    <li>
                      <Link 
                        to="/jobs/create" 
                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Post a Job
                      </Link>
                    </li>
                  )}
                  
                  <li>
                    <Link 
                      to="/profile" 
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User size={18} className="inline mr-2" />
                      Profile
                    </Link>
                  </li>
                  
                  {user.role === 'jobseeker' ? (
                    <li>
                      <Link 
                        to="/applications" 
                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Briefcase size={18} className="inline mr-2" />
                        My Applications
                      </Link>
                    </li>
                  ) : (
                    <li>
                      <Link 
                        to="/jobs" 
                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Briefcase size={18} className="inline mr-2" />
                        My Job Posts
                      </Link>
                    </li>
                  )}
                  
                  <li>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      <LogOut size={18} className="inline mr-2" />
                      Sign Out
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link 
                      to="/login" 
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                  </li>
                  
                  <li>
                    <Link 
                      to="/register" 
                      className="block px-3 py-2 text-base font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;