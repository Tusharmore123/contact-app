import React, { useState } from 'react';
import { Input, Button, getContacts, Contacts } from '../import.js';
import { PhotoIcon, PlusIcon } from '@heroicons/react/24/solid';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { postData } from '../utils/utils.js';
import { useDispatch } from 'react-redux';

function SpamForm() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [alert, setAlert] = useState({ message: '', type: '' });
    const [loader, setLoading] = useState(false)

    const HandleForm = async (data) => {
        setLoading(true)
        const res = await postData('/spam', data);

        if (res.status >= 200 && res.status < 300) {


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
        <>
            {loader ? (<div className='container'>
                <div className='loader'></div>
            </div>) : <section className='contact '>
                <div className="grid grid-cols-7 gap-6 p-6">
                    {/* Form Container */}
                    <div className="md:col-start-2 col-span-7 md:col-span-5 bg-white p-6 rounded-lg shadow-md">
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

                                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                        <div className="sm:col-span-6">

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
                                                    reason
                                                </label>
                                                <div className="mt-2">
                                                    <textarea
                                                        id="reason"
                                                        name="reason"
                                                        rows={3}
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                        defaultValue={''}
                                                        {...register('reason', {
                                                            required: true,
                                                            minLength: {
                                                                value: 5,
                                                                message: 'reason is too small',
                                                            },
                                                            maxLength: {
                                                                value: 50,
                                                                message: 'reason is too long',
                                                            }
                                                        })}
                                                    />
                                                    {errors.reason && <p className="text-red-500 text-sm mt-1">{errors.reason.message}</p>}
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
            </section>}
        </>

    );
}

export default SpamForm;
