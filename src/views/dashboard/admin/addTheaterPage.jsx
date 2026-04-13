import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AddTheaterForm from '../../../components/addTheaterForm';

const AddTheaterPage = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    // Navigate back to theater list after successful creation
    setTimeout(() => {
      navigate('/adminDashboard/theaterList');
    }, 1500); // Small delay to show the success toast
  };

  return (
    <div className='w-full min-h-screen bg-gray-50 p-3 md:p-6'>
      {/* Header Section */}
      <div className='bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6'>
        <div className='flex items-center gap-4 mb-4'>
          <button
            onClick={() => navigate('/adminDashboard/theaterList')}
            className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
          >
            <ArrowLeft size={24} className='text-gray-600' />
          </button>
          <div>
            <h1 className='text-2xl md:text-3xl font-bold text-gray-800'>
              Add New <span className='text-red-500'>Theater</span>
            </h1>
            <p className='text-sm text-gray-500 mt-1'>
              Fill in the details to add a new theater to the system
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className='bg-white rounded-xl shadow-sm p-4 md:p-6'>
        <AddTheaterForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
};

export default AddTheaterPage;
