import './index.css'
import { Provider } from 'react-redux'
import { store } from './redux/store.js'
import './App.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Register, OtpValidator, Login, Contacts, AddContact, EditContact, SpamReport, SpamForm, Delete, Logout } from './import.js'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout.jsx'

const router = createBrowserRouter([{
  path: '/',
  element:(<Layout >

    <App/>
  </Layout>),
  children: [
    {
      path: '/contacts',
      element: (<Layout >

        <Contacts />
      </Layout>)
    },
    {
      path: '/home',
      element: (<Layout >

        <Contacts />
      </Layout>)
    },
    {
      path: '/add-contact',
      element: (<Layout >
        {""}
        <AddContact />
      </Layout>)
    },
    {
      path: '/:id/delete-contact',
      element: (<Layout >
        <Delete />

      </Layout>)
    },
    {
      path: '/:id/edit-contact',
      element: (<Layout >
        <EditContact />
      </Layout>)
    }, {
      path: '/:contact_no/spam-report',
      element: (<Layout >
        <SpamReport />

      </Layout>)
    }
    , {
      path: '/spam-form',
      element: (<Layout >
        <SpamForm />
      </Layout>)
    }
  ]

}, {
  path: '/login',
  element: <Login />
}, {
  path: '/validate-otp',
  element: <OtpValidator/>
}, {
  path: '/register',
  element: (<Layout authentication={false}  >
    {""}
    <Register />

  </Layout>)
}
  , {
  path: '/logout',
  element: (<Layout authentication={true}  >


    <Logout />
  </Layout>)
}

])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>

      <RouterProvider router={router} />
    </Provider>

  </StrictMode>,
)
