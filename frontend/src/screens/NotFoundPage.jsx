import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-100 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-purple-600 mb-4">404</h1>
        <div className="text-2xl font-semibold text-gray-800 mb-6">Page Not Found</div>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button
            variant="contained"
            startIcon={<Home size={20} />}
            className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white py-3 px-8 rounded-lg font-semibold"
          >
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;