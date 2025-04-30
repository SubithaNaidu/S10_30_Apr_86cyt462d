import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import JobsList from './pages/jobs/JobsList';
import JobDetails from './pages/jobs/JobDetails';
import CreateJob from './pages/jobs/CreateJob';
import EditJob from './pages/jobs/EditJob';
import Profile from './pages/profile/Profile';
import Applications from './pages/applications/Applications';
import JobApplications from './pages/applications/JobApplications';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/routes/ProtectedRoute';
import EmployerRoute from './components/routes/EmployerRoute';
import JobSeekerRoute from './components/routes/JobSeekerRoute';
import ApplyJob from './pages/jobs/ApplyJob';

function App() {
  const { user, loading, checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="jobs" element={<JobsList />} />
        <Route path="jobs/:id" element={<JobDetails />} />

        {/* ✅ ApplyJob page route */}
        <Route
          path="jobs/:id/apply"
          element={
            <ProtectedRoute>
              <JobSeekerRoute>
                <ApplyJob />
              </JobSeekerRoute>
            </ProtectedRoute>
          }
        />

        {/* Auth routes */}
        <Route 
          path="login" 
          element={user ? <Navigate to="/" /> : <Login />} 
        />
        <Route 
          path="register" 
          element={user ? <Navigate to="/" /> : <Register />} 
        />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="profile" element={<Profile />} />
          <Route element={<JobSeekerRoute />}>
            <Route path="applications" element={<Applications />} />
          </Route>
          <Route element={<EmployerRoute />}>
            <Route path="jobs/create" element={<CreateJob />} />
            <Route path="jobs/edit/:id" element={<EditJob />} />
            <Route path="jobs/:id/applications" element={<JobApplications />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
