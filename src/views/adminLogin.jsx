import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the main login page
    navigate('/loginPage');
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-red-500">
      <div className="bg-white p-8 rounded-md shadow-md">
        <p className="text-center text-gray-600">Redirecting to login...</p>
      </div>
    </div>
  );
}

export default AdminLogin;
