import { useState, useEffect } from 'react';

import {Header} from './import.js';

import { Outlet } from 'react-router-dom';


function App() {
  
  

  return (
    <>
      <div className='w-full min-h-screen bg-green-100 flex flex-wrap  content-between'>
        <div className=' w-full block'>

          <Header/>
          
        </div>
      </div>

    </>
  )
}

export default App
