import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ShieldAlert } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
        <ShieldAlert className="w-12 h-12 text-red-500" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Access Denied</h1>
      <p className="text-lg text-gray-600 max-w-md mb-8">
        You do not have permission to view this page. Please contact your administrator if you believe this is an error.
      </p>
      <Link to="/">
        <Button size="lg" className="rounded-xl px-8">
          Return to Home
        </Button>
      </Link>
    </div>
  );
};

export default Unauthorized;
