import React from 'react';
import { useAppSelector } from '../app/hooks';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="container py-5 text-center">
      <h1 className="display-1">404</h1>
      <h2 className="mb-4">Page Not Found</h2>
      <p className="lead">The page you are looking for does not exist or has been moved.</p>
      <Link to="/" className="btn btn-primary mt-3">
        Return to Home
      </Link>
    </div>
  );
};

export default NotFound;