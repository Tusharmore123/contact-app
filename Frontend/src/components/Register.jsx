import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { Input, Button } from '../import.js'
import { postData } from '../utils/utils.js';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { validateOtp } from '../redux/reducerSlice.js';
function Register() {
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [alert, setAlert] = useState({ message: '', type: '' });
  const navigate = useNavigate();

  const HandleForm = async (data) => {

    const res = await postData('/register', data);

    if (res.status === 200) {
      dispatch(validateOtp())
      setAlert({ message: 'Otp send to mail successfully', type: 'success' });
      navigate('/validate-otp');

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
      <div className="flex min-h-full flex-1 flex-col justify-center px-2 py-3 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Register your account
          </h2>
        </div>

        <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-sm">
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
                  label="User Name"
                  id="username"
                  name="username"
                  type="username"
                  required
                  autoComplete="current-username"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register('username', {
                    required: true,
                    minLength: {
                      value: 5,
                      message: 'Please enter more than 5 charachters'
                    },
                    maxLength: {
                      value: 15,
                      message: 'Please enter less than 15 charachters'
                    }
                  })}
                />
                {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
              </div>
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
                      value: 45,
                      message: 'Please enter less than 45 charahchters'
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
                      message: 'Please enter more than 8 charachters'
                    },
                    maxLength: {
                      value: 15,
                      message: 'Please enter less than 15 charachters'
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
                children="submit"

              />

            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{' '}
            <Link to="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Already have account
            </Link>
          </p>
        </div>
      </div>
    </>


  )
}

export default Register