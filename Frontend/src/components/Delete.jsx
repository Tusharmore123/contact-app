import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteData } from '../utils/utils';
function Delete() {
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false)

  const { id } = useParams()
  const handleCancel = () => {
    navigate('/contacts')
  }

  const handleDelete = async () => {
    // Add your delete logic here
    setLoading(true)
    const res = await deleteData(`/${id}/delete`)
    if (res.status >= 200 && res.status < 300) {

      setAlert({ message: 'Deleted successfully', type: 'success' });
      navigate('/contacts');


      // Hide the alert after 5 seconds
      setTimeout(() => {
        setAlert({ message: '', type: '' });
      }, 5000);
    } else {


      let errorMessage = '';

      if (res.message === "Network Error") {
        errorMessage = "Internal server error";
      } else {
        errorMessage = res.response
          ? `Failed to log in: ${res.response.message}`
          : `Failed to log in: ${res.status}`;
      }

      setAlert({ message: errorMessage, type: 'error' });

      // Hide the alert after 5 seconds
      setTimeout(() => {
        setAlert({ message: '', type: '' });
      }, 5000);


    };
    setLoading(false)
  }

  return (
    <>
      {loading ? (<div className='container'>
        <div className='loader'></div>
      </div>) : (<div className="flex justify-center items-center h-screen">

        {/* Modal Popup */}

        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Confirm Delete
            </h2>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete this item? This action cannot be undone.
            </p>
            <div className="flex justify-between">
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white py-2 px-4 rounded-lg font-semibold shadow hover:bg-red-600 transition duration-200"
              >
                Confirm
              </button>
              <button
                onClick={handleCancel}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold shadow hover:bg-blue-600 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

      </div>)
      }
    </>
  );
}

export default Delete;
