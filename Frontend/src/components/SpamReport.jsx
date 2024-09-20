import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchData } from '../utils/utils.js';

const SpamReport = () => {
  // Calculate the stroke-dashoffset for the circular progress
  const [totalReportedContacts, setTotal] = useState("")
  const [spamPercentage, setSpamPercentage] = useState("")
  const strokeDashoffset = 100 - spamPercentage;
  const { contact_no } = useParams();
  const [loader, setLoader] = useState(false)
  useEffect(() => {
    const getContactData = async () => {
      try {
        setLoader(true)
        const res = await fetchData(`/${contact_no}/spam-report`); // Update with your actual endpoint

        if (res) {

          const data = res.data.data
          setTotal(data['reported_users'])
          setSpamPercentage(parseInt(data['spam_likelihood']))

        }
      } catch (error) {
        alert('failed to get spam_report')

      }
      setLoader(false)
    };
    getContactData();
  }, []);

  return (
    <>
      {loader ? (<div className='w-32 h-32'> <div className='loader'></div></div>) :
        (<div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Spam Report</h2>

          {/* Total Number of Reported Contacts */}
          <div className="mb-6">
            <p className="text-gray-700 text-lg font-medium">Total Reported Contacts:</p>
            <p className="text-gray-900 text-2xl font-bold">{totalReportedContacts}</p>
          </div>

          {/* Spam Percentage */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative flex items-center justify-center">
              <svg className="w-40 h-40" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                {/* Background Circle */}
                <circle
                  className="text-gray-200"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  cx="18"
                  cy="18"
                  r="15.5"
                />
                {/* Spam Percentage Circle */}
                <circle
                  className="text-red-500"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="100, 100"
                  strokeDashoffset={strokeDashoffset}
                  cx="18"
                  cy="18"
                  r="15.5"
                  transform="rotate(-90 18 18)"
                />
                {/* Background Circle behind Text */}
                <circle
                  className="text-red-50" // Background color behind text
                  fill="currentColor"
                  cx="18"
                  cy="18"
                  r="12" // Adjust the radius to control the size of the background
                />
                {/* Percentage Text */}
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  fill="#FF0000" // Text color
                  fontSize="8" // Font size of the text
                  dy=".3em"
                  className="font-bold"
                >
                  {spamPercentage}%
                </text>
              </svg>
            </div>
          </div>

          {/* Likelihood of Spam */}
          <div>
            <p className="text-gray-700 text-lg font-medium mb-2">Likelihood of Spam:</p>
            <div className="flex items-center">
              <div className="w-12 h-12 flex items-center justify-center bg-red-500 rounded-full text-white text-lg font-bold">
                {spamPercentage}%
              </div>
              <p className="ml-4 text-gray-900 text-lg">
                {spamPercentage > 50 ? 'High Likelihood' : 'Low Likelihood'}
              </p>
            </div>
          </div>
        </div>)
      }
    </>

  );
};

export default SpamReport;
