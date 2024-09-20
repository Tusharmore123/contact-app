import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Input, Button, config } from '../import.js';
import { useNavigate } from 'react-router-dom';
import { postData } from '../utils/utils.js';
import { useDispatch } from 'react-redux';
import { login } from '../redux/reducerSlice.js'
import { Link } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [loader, setLoader] = useState(false)

  const dispatch = useDispatch();


  const HandleForm = async (data) => {
    setLoader(true)
    const res = await postData('/login', data);

    if (res.status >= 200 && res.status < 300) {

      setLoader(false)
      navigate('/home', { state: { message: 'Logged in successfully', type: 'suscess' } });
      dispatch(login())

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

      navigate('/register')
      setAlert({ message: errorMessage, type: 'error' });

      // Hide the alert after 5 seconds
      setTimeout(() => {
        setAlert({ message: '', type: '' });
      }, 5000);
    }
  };


  return (
    <>

      {
        loader ? (<div className="container">
          <div className="loader">
          </div>
        </div>) : (<div className="flex min-h-full flex-1 flex-col justify-center px-2 py-3 lg:px-8">

          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              alt="Your Company"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              className="mx-auto h-10 w-auto"
            />
            <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>

          <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-sm">
            {/* Alert Message */}
            {alert.message && (
              <div
                className={`w-full bg-center px-4 py-2 rounded-md text-white shadow-lg ${alert.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
                role="alert"
              >
                {alert.message}
              </div>
            )}

            <form action="#" method="POST" className="space-y-6" onSubmit={handleSubmit(HandleForm)}>
              <div>

                {/* <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label> */}
                <div className="mt-2">
                  <Input
                    label='Email'
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register('email', {
                      required: true,
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                        message: 'Please enter a valid Gmail address ending with @gmail.com'
                      },
                      maxLength: {
                        value: 40,
                        message: 'Please enter less than 25 characters'
                      }
                    })}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  {/* <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label> */}
                  <div className="text-sm">
                    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                      Forgot password?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <Input
                    label="Password"
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register('password', {
                      required: true,
                      minLength: {
                        value: 8,
                        message: 'Please enter more than 8 characters'
                      },
                      maxLength: {
                        value: 15,
                        message: 'Please enter less than 15 characters'
                      }
                    })}
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  children="Submit"
                />
              </div>
            </form>

            <p className="mt-10 text-center text-sm text-gray-500">
              Not a member?{' '}
              <Link to="/register" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                Register user
              </Link>
            </p>
          </div>
        </div>
        )
      }
    </>
  );
}

export default Login;
