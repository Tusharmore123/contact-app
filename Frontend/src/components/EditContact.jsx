import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { PhotoIcon, PlusIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchData, uploadToCloudinary, postData } from '../import.js';
import myimage from '../assets/default.png'

// Mock function for fetching contact data. Replace this with your actual API call.


function EditContact() {
  const { register, handleSubmit, setValue, formState: { errors }, getValues } = useForm();
  const { id } = useParams(); // Get the contact ID from the URL
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [contact, setContact] = useState("1");
  const [profile, setProfile] = useState("default.jpg");
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState(false)

  const navigate = useNavigate('/')
  // Populate form with API data
  const handleFileChange = async (e) => {

    if (e.target.files.length > 0) {
      setImage(true)
      const res = await uploadToCloudinary(e.target.files[0])
      if (res.status === 200) {

        setImage(false)
        setProfile(res.data.secure_url);  // Set the Cloudinary URL for the uploaded image
      } else {
        setImage(false)
      }


      // Display the selected image
    }
  };

  useEffect(() => {
    const getContactData = async () => {
      try {
        setLoading(true)
        const res = await fetchData(`/${id}/update-contact`); // Update with your actual endpoint
        if (res) {
          const data = res.data.data
          setValue('username', data.contact_name || '');
          setValue('email', data.contact_email || '');
          setValue('phone', data.contact_phone || '');
          setValue('address', data.contact_address || '');
          if (data.profile_image_url == "default.jpg") {
            setProfile(myimage)
          } else {

            setProfile(data.profile_image_url)
          }
        }

        setContact(getValues(["phone"])[0])
        setLoading(false)
      } catch (error) {
        console.error(' fetching contact data:', error);
      }
    };
    getContactData();
  }, [id, setValue, getValues]); // Include 'id' in dependencies

  // Handle form submission with updated data
  const HandleForm = async (data) => {

    const res = await postData(`/${id}/update-contact`, data);

    if (res.status >= 200 && res.status < 300) {

      setAlert({ message: 'Contact updated in successfully', type: 'success' });
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
          ? `Failed to log in: ${res.response.data.message}`
          : `Failed to log in: ${res.status}`;
      }

      setAlert({ message: errorMessage, type: 'error' });

      // Hide the alert after 5 seconds
      setTimeout(() => {
        setAlert({ message: '', type: '' });
      }, 5000);
    }
  };

  return (
    <>
      {loading ? (<div className='container'>
        <div className='loader'></div>
      </div>) : (<section className="relative contact">
        <div className="grid grid-cols-7 gap-6 p-6">
          {/* Form Container */}
          <div className="md:col-start-2 md:col-span-5 col-span-7 bg-white p-6 rounded-lg shadow-md">
            {alert.message && (

              <div
                className={`w-full bg-center px-4 py-2 rounded-md text-white shadow-lg ${alert.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
                role="alert"
              >
                {alert.message}
              </div>

            )}
            <form onSubmit={handleSubmit(HandleForm)}>
              <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                  <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">Please fill out the form.</p>

                  {/* Profile Image and Upload */}
                  <div className="flex justify-center items-center">
                    <div className="relative">
                      {image ? (
                        <div className="w-32 h-32">
                          <div className="loader"></div>
                        </div>
                      ) : (
                        <div className="relative flex justify-center items-center rounded-full bg-gray-200 w-24 h-24 sm:w-32 sm:h-32 lg:w-48 lg:h-48">
                          <img
                            src={profile}
                            className="w-full h-full bg-contain rounded-full object-cover"
                            alt="Profile"
                          />
                        </div>
                      )}
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer rounded-full bg-indigo-600 hover:bg-indigo-700 p-3 text-white flex items-center justify-center absolute bottom-0 right-0"
                      >
                        <PlusIcon className="h-6 w-6" />
                      </label>
                      <input
                        id="file-upload"
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                  {/* Input Fields */}
                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700">Full Name</label>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        {...register('username', {
                          required: 'Full Name is required',
                          minLength: {
                            value: 5,
                            message: 'Please enter more than 5 characters'
                          },
                          pattern: {
                            value: /^[^0-9.*+@]+$/,
                            message: "Please enter only characters"
                          },
                          maxLength: {
                            value: 45,
                            message: 'Please enter less than 45 characters'
                          }
                        })}
                      />
                      {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        {...register('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                            message: 'Please enter a valid Gmail address ending with @gmail.com'
                          },
                          maxLength: {
                            value: 45,
                            message: 'Please enter less than 45 characters'
                          }
                        })}
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                      <input
                        id="phone"
                        name="phone"
                        type="text"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        {...register('phone', {
                          required: 'Phone number is required',
                          pattern: {
                            value: /^[0-9]+$/,
                            message: 'Phone number must contain only digits',
                          },
                          minLength: {
                            value: 10,
                            message: 'Phone number must be exactly 10 digits',
                          },
                          maxLength: {
                            value: 10,
                            message: 'Phone number must be exactly 10 digits',
                          },
                        })}
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                      <textarea
                        id="address"
                        name="address"
                        rows={3}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        {...register('address', {
                          required: 'Address is required',
                          minLength: {
                            value: 5,
                            message: 'Address is too short',
                          },
                          maxLength: {
                            value: 50,
                            message: 'Address is too long',
                          }
                        })}
                      />
                      {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}

                <div className="mt-6">
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Update
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>


        {/* Spam Report Icon */}
        <Link to={`/${getValues(["phone"])[0]}/spam-report`}>
          <div className="
    absolute
    bottom-6 right-6
    sm:bottom-4 sm:right-4
    md:bottom-6 md:right-6
    lg:bottom-8 lg:right-8
    xl:bottom-10 xl:right-10
    flex items-center justify-center
  ">
            <button
              className="
        w-16 h-16
        sm:w-14 sm:h-14
        md:w-20 md:h-20
        bg-red-500 rounded-full shadow-lg
        hover:bg-red-600 hover:scale-105 transform transition-transform duration-300
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600
        active:bg-red-700
        flex items-center justify-center
      "
            >
              <ExclamationCircleIcon className="
        w-8 h-8 
        sm:w-7 sm:h-7 
        md:w-12 md:h-12 
        text-white 
        transition-transform duration-300 
        hover:scale-110
      " />
            </button>
          </div>
        </Link>
      </section>)}
    </>

  );
}

export default EditContact;
