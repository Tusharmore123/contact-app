import React, { useEffect } from 'react'
import { fetchData } from '../utils/utils'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/reducerSlice.js';

function Logout() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    useEffect(() => {
        async function logoutUser() {

            const res = await fetchData('/logout');
            if (res.status >= 200 && res.status < 300) {

                dispatch(logout())
                navigate('/login')
            }
        }
        logoutUser()
    }, [])
    return

}

export default Logout