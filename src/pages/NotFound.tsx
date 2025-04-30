import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="max-w-lg mx-auto text-center py-12">
      <h1 className="text-8xl font-bold text-blue-600 mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-gray-900 mb-4">Page Not Found</h2>
      <p className="text-lg text-gray-600 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/">
        <Button variant="primary" size="lg">
          Back to Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;