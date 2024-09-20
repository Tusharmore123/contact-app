import React, { useState, useEffect, useRef } from 'react';
import { Bars3Icon, XMarkIcon, BellIcon } from '@heroicons/react/24/outline';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Input } from '../import.js';
import { useDispatch, useSelector } from 'react-redux';
import myimage from '../assets/default.png'
import { filteredContacts } from '../redux/reducerSlice.js';

const navigation = [
    { name: 'Contacts', href: '/contacts' },
    { name: '+ Add Contacts', href: '/add-contact' },
    { name: 'Report Spam', href: '/spam-form' },
    { name: 'Logout', href: '/logout' },
];
function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function Header() {
    const location = useLocation()
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const inputRef = useRef(null);
    const dispatch = useDispatch();
    const path = location.pathname.split('/')

    const hideSearchRoutes = ['/add-contact', '/spam-form', '/edit-contact', '/spam-report'];


    // Filtering logic similar to Google Contacts search
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        dispatch(filteredContacts(query))

    };



    return (
        <div className="flex h-screen bg-gray-100">
            {/* Mobile Sidebar */}
            <div className={`fixed inset-0 z-40 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
                <div className="fixed inset-0 bg-slate-50 opacity-50" onClick={() => setSidebarOpen(false)}></div>
                <div className="relative flex flex-col w-64 h-full bg-slate-50 mt-5 z-50">
                    <div className="flex items-center justify-between px-4 mt-2">
                        <div className="text-xl font-semibold">Google Contacts</div>
                        <button onClick={() => setSidebarOpen(false)}>
                            <XMarkIcon className="h-full w-6" />
                        </button>
                    </div>
                    <div className="flex-1 px-2 space-y-1 mt-4">
                        {navigation.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.href}
                                className={({ isActive }) =>
                                    classNames(
                                        isActive ? 'bg-cyan-300 text-white' : 'text-gray-900 hover:bg-gray-200',
                                        'block px-3 py-2 rounded-md text-base font-medium'
                                    )
                                }
                            >
                                {item.name}
                            </NavLink>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sidebar for Desktop */}
            <div className="hidden md:flex md:w-64 bg-slate-50 flex-col">
                <div className="flex items-center justify-center h-12 text-xl font-semibold bg-slate-50">
                    Google Contacts
                </div>
                <div className="flex-1 px-2 mt-5 space-y-2">
                    {navigation.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            className={({ isActive }) =>
                                classNames(
                                    isActive ? 'bg-cyan-200 text-gray-900' : 'text-gray-700 hover:bg-gray-200',
                                    'block px-4 py-2 rounded-md text-base font-medium'
                                )
                            }
                        >
                            {item.name}
                        </NavLink>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                {/* Top Navbar */}
                <nav className="bg-white h-10 shadow flex items-center justify-between px-4 md:px-6">
                    {/* Mobile Menu Button */}
                    <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
                        <Bars3Icon className="h-6 w-6 text-gray-600" />
                    </button>

                    {/* Search Bar */}

                    <div className="flex items-center justify-center">
                        <Input
                            type="text"
                            placeholder="Search Contacts"
                            className="hidden h-8 md:block px-4 py-2 md:w-96 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            ref={inputRef}

                            onChange={handleSearch}
                        />
                    </div>

                    {/* Right Side Icons */}
                    <div className="flex items-center space-x-4">
                        <button className="p-2 rounded-full hover:bg-gray-100 focus:outline-none">
                            <BellIcon className="h-6 w-6 text-gray-600" />
                        </button>
                        <img
                            className="h-8 w-8 rounded-full"
                            src={myimage}
                            alt="User Profile"
                        />
                    </div>
                </nav>

                {/* Main Content */}
                <main className="flex-1  bg-white overflow-auto">
                    {
                        !hideSearchRoutes.includes("/" + path[path.length - 1]) && (

                            <div className="flex w-full justify-center">
                                <Input
                                    type="text"
                                    placeholder="Search Contacts"
                                    className="md:hidden   px-4  my-3 w-full h-11  xs:max-w-sm sm:max-w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    ref={inputRef}


                                    onChange={handleSearch}
                                />
                            </div>
                        )
                    }
                    <div className='flex justify-center'>

                        <div className="w-full max-w-4xl my-1">
                            {/* Contact List Render */}
                            <Outlet filteredContacts={filteredContacts} />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
