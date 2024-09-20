import React, { useState, useEffect } from 'react';
import { Input, Button } from '../import.js';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { postData } from '../utils/utils.js';
import { useDispatch, useSelector } from 'react-redux';
import { resetOtp, login } from '../redux/reducerSlice.js';

function OtpValidator() {
  const dispatch = useDispatch()
  const [secondsLeft, setSecondsLeft] = useState(300); // 5 minutes in seconds
  const [isExpired, setIsExpired] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [alertMessage, setAlert] = useState({ message: '', type: '' });
  const verifyOtp = useSelector((state) => state.auth.verifyOtp)


  useEffect(() => {


    if (secondsLeft === 0) {
      setIsExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer); // Cleanup interval on component unmount
  }, [secondsLeft]);

  useEffect(() => {
    if (isExpired) {
      alert('OTP expired');
      navigate('/register')
    }
  }, [isExpired]);
  useEffect(() => {
    if (!verifyOtp) {
      navigate('/register')
    }
  }, [])

  const HandleForm = async (data) => {


    if (isExpired) {
      alert('OTP has expired, please request a new one.');
      navigate('/')
    }

    const res = await postData('/verify-otp', data);

    if (res.status >= 200 && res.status < 300) {

      setAlert({ message: 'Registered new user successfully', type: 'success' });

      navigate('/login');
      dispatch(resetOtp())

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
          ? `Failed to validate otp: ${res.response.data.message}`
          : `Failed to validate otp: ${res.status}`;
      }

      setAlert({ message: errorMessage, type: 'error' });

      // Hide the alert after 5 seconds
      setTimeout(() => {
        setAlert({ message: '', type: '' });
      }, 5000);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <>
      <div className="flex justify-center mt-12">
        <form onSubmit={handleSubmit(HandleForm)} className="w-5/6">
          <div className="w-full border-r-neutral-400  border-solid border-2 rounded-md bg-gray-50 shadow-md shadow-slate-300">
            {alertMessage.message && (
              <div
                className={`w-full bg-center px-4 py-2 rounded-md text-white shadow-lg ${alertMessage.type == 'success' ? 'bg-green-500' : 'bg-red-500'}`}
                role="alert"
              >
                {alertMessage.message}
              </div>
            )}
            <center className='mt-2'><b>Please enter the otp sent to your email</b></center>
            <section className="flex  flex-col sm:flex-row gap-3 justify-center px-6 py-12 lg:px-8">
              <Input
                id="otp"
                label="Validate Otp"
                type="number"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                disabled={isExpired}
                placeholder="Enter OTP"
                {...register('otp', {
                  required: 'OTP is required',
                  maxLength: {
                    value: 6,
                    message: 'OTP must be 6 characters long'
                  },
                  minLength: {
                    value: 6,
                    message: 'OTP must be 6 characters long'
                  }
                })}
              />
              {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>}
              <Button
                type="submit"
                className="flex justify-center w-full self-start sm:w-1/3 sm:self-end rounded-md bg-indigo-600 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-indigo-600 h-10"
                children="Submit"
                disabled={isExpired}
              />
            </section>
          </div>
        </form>
      </div>
      <section className="timer flex justify-center">
        <div className="text-red-600">
          Time left: {formatTime(secondsLeft)}
        </div>
      </section>
    </>
  );
}

export default OtpValidator;
