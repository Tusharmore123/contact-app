import React, { useState } from 'react';
import { Input, Button, getContacts, uploadToCloudinary, postData } from '../import.js';
import { PhotoIcon, PlusIcon } from '@heroicons/react/24/solid';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';


import { useDispatch } from 'react-redux';


function AddContact() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [alert, setAlert] = useState({ message: '', type: '' });
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState('default.jpg');
    const [ImageLoader, setImageLoader] = useState(false)
    const dispatch = useDispatch();

    const handleFileChange = async (e) => {

        if (e.target.files.length > 0) {
            setImageLoader(true)

            const res = await uploadToCloudinary(e.target.files[0])
            if (res.status === 200) {
                setImageLoader(false)

                setProfile(res.data.secure_url);  // Set the Cloudinary URL for the uploaded image
            } else {
                setImageLoader(false)

            }


            // Display the selected image
        }
    };

    const HandleForm = async (data) => {
        if (profile) {
            data = { ...data, 'profile_image_url': profile }
        }
        setLoading(true)
        const res = await postData('/add-contact', data);




        if (res.status >= 200 && res.status < 300) {

            const allContacts = await getContacts('/contact-list')
            dispatch(getContacts(allContacts))
            setAlert({ message: 'Contact added in successfully', type: 'success' });
            navigate('/home');


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
        setLoading(false)
    };



    return (
        <section className='contact '>
            <div className="grid grid-cols-7 md:gap-6 p-6">
                {/* Form Container */}
                <div className="md:col-start-2 md:col-span-5 col-span-7 col-start-1 bg-white p-6 rounded-lg shadow-md">
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
                                <p className="mt-1 text-sm leading-6 text-gray-600">Please fill out form.</p>
                                <div className="flex justify-center items-center">
                                    <div className="relative">
                                        {/* Profile Icon */}
                                        {
                                            ImageLoader ? (
                                                <div className='w-32 h-32'>
                                                    <div className='loader'></div>
                                                </div>
                                            ) : (<div className="relative flex justify-center items-center rounded-full h-32 w-32 bg-gray-200">
                                                <img
                                                    src={profile}
                                                    className="w-full h-full bg-contain rounded-full object-fill scale-y-90"
                                                    alt=""
                                                />
                                                {
                                                    profile == "default.jpg" ? (<div className="absolute inset-0 flex items-center justify-center">
                                                        <PhotoIcon className="h-16 w-16 text-gray-600" />
                                                    </div>) : ""
                                                }


                                                {/* Upload Button */}
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
                                            )
                                        }

                                    </div>
                                </div>
                                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                    <div className="sm:col-span-6">
                                        <div className="mt-2">
                                            <Input
                                                label="Full Name"
                                                id="name"
                                                name="name"
                                                type="text"
                                                autoComplete="username"
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                {...register('name', {
                                                    required: true,
                                                    minLength: {
                                                        value: 5,
                                                        message: 'Please enter more than 5 characters'
                                                    },
                                                    pattern: {
                                                        value: /^[a-zA-Z ]+$/,
                                                        message: 'Please enter only characters'
                                                    },
                                                    maxLength: {
                                                        value: 25,
                                                        message: 'Please enter less than 25 characters'
                                                    }
                                                })}
                                            />
                                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                                        </div>
                                        <div className="mt-2">
                                            <Input
                                                label="Email"
                                                id="email"
                                                name="email"
                                                type="email"
                                                autoComplete="email"
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                {...register('email', {
                                                    required: true,
                                                    pattern: {
                                                        value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                                                        message: 'Please enter a valid Gmail address ending with @gmail.com'
                                                    },
                                                    maxLength: {
                                                        value: 45,
                                                        message: 'Please enter less than 25 characters'
                                                    }
                                                })}
                                            />
                                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                                        </div>
                                        <div className="mt-2">
                                            <Input
                                                label="Phone Number"
                                                id="phone_no"
                                                name="phone_no"
                                                type="text"
                                                autoComplete="phone"
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                {...register('phone_no', {
                                                    required: true,
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
                                            {errors.phone_no && <p className="text-red-500 text-sm mt-1">{errors.phone_no.message}</p>}
                                        </div>
                                        <div className="col-span-full">
                                            <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                                                Address
                                            </label>
                                            <div className="mt-2">
                                                <textarea
                                                    id="address"
                                                    name="address"
                                                    rows={3}
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    defaultValue={''}
                                                    {...register('address', {
                                                        required: true,
                                                        minLength: {
                                                            value: 5,
                                                            message: 'Address is too small',
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
                                </div>
                                <div className="mt-6">
                                    <Button
                                        type="submit"
                                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        Submit
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default AddContact;
