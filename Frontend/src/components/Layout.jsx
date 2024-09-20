import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'



export default function Authentication({
  authentication = true,
  children
}) {
  const authStatus = useSelector((state) => state.auth.signIn);
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    if (authentication && authentication !== authStatus) {
      navigate('/login')

    }
    else if (!authentication && authentication !== authStatus) {
      navigate('/')

    }
    setLoader(false)
  }, [authStatus, authentication, navigate])


  return (
    loader ? <h1>Loading...</h1> : <>{children}</>
  )
}
