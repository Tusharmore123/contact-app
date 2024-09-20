import React, { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from '../utils/utils';
import { getContacts } from '../import.js';
import { Link } from 'react-router-dom';
import myimage from '../assets/default.png';

const Contacts = () => {
  const contacts = useSelector((state) => state.auth.contacts);
  const filteredContacts = useSelector((state) => state.auth.filtered_contacts);
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();

  const fetchContactData = async () => {
    setLoader(true);
    try {
      const res = await fetchData('/contact-list');
      if (res.status >= 200 && res.status < 300) {
        const data = res.data.data;
        dispatch(getContacts(data)); // Dispatch the action to set contacts in Redux state
      } else {

        alert('Failed to get contacts: Server error');
      }
    } catch (error) {

      alert('Failed to fetch contacts');
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchContactData(); // Fetch contacts when the component is mounted

  }, [dispatch, filteredContacts]);
  const contactList = filteredContacts && filteredContacts.length > 0 ? filteredContacts : contacts;


  return (
    <>

      {loader ? (
        <div className='container'>
          <div className='loader'></div>
        </div>
      ) : (
        contactList.length > 0 ? (
          contactList.map((element) => (
            <div className="flex justify-center my-1" key={element.id}>
              <div className="max-w-sm w-full rounded-lg overflow-hidden shadow-lg bg-white border border-gray-200 sm:max-w-full md:max-w-sm lg:max-w-lg xl:max-w-md">
                <div className="p-4 flex items-center">
                  {/* Profile Image */}
                  <div className="flex-shrink-0">
                    <img
                      className="h-16 w-16 sm:h-12 sm:w-12 md:h-16 md:w-16 lg:h-20 lg:w-20 rounded-full object-fill"
                      src={element.profile_image_url !== "default.jpg" ? element.profile_image_url : myimage}
                      alt={element.contact_name}
                    />
                  </div>

                  {/* Contact Info */}
                  <div className="ml-4 flex-1 ">
                    <h3 className="text-lg font-semibold text-gray-900 sm:text-sm md:text-lg lg:text-xl break-all max-w-xs">
                      {element.contact_name}
                    </h3>
                    {element.contact_email && (
                      <p className="text-sm text-gray-500 sm:text-xs md:text-sm lg:text-base break-all max-w-xs">
                        {element.contact_email}
                      </p>
                    )}
                    {element.contact_phone && (
                      <p className="text-sm text-gray-500 sm:text-xs md:text-sm lg:text-base">
                        {element.contact_phone}
                      </p>
                    )}
                  </div>

                  {/* Action Icons */}
                  <div className="ml-4 flex space-x-2">
                    <Link to={`/${element.id}/edit-contact`}>
                      <button className="text-gray-500 hover:text-blue-500">
                        <PencilIcon className="h-5 w-5 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />
                      </button>
                    </Link>
                    <Link to={`/${element.id}/delete-contact`}>
                      <button className="text-gray-500 hover:text-red-500">
                        <TrashIcon className="h-5 w-5 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 sm:text-sm md:text-base lg:text-lg">No contacts available</p>
        )
      )}
    </>
  );
};

export default Contacts;
