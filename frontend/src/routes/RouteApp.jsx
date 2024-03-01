import React from 'react'
import {Routes, Route, Router, useLocation} from 'react-router-dom'

import Homepage from '../pages/public/Homepage'
import Login from '../pages/public/Login'
import Signup from '../pages/public/Signup'

import ErrorPage from '../pages/ErrorPage'


import Account from '../pages/auth/Account'
import Followed from '../pages/auth/Followed'
import YourConf from '../pages/auth/YourConf'
import Timestamp from '../pages/auth/Timestamp'
import Notifications from '../pages/auth/Notifications'
import { AuthLayout } from '../layout/AuthLayout'
import InformationPage from '../pages/public/InformationPage'
import ImportantDatePage from '../pages/public/ImportantDatePage'
import CallforpaperPage from '../pages/public/CallforpaperPage'
import Setting from '../pages/auth/Setting'

const authPage = [
  {path: 'account', element: <Account/>},
  {path: 'followed', element: <Followed/>},
  {path: 'yourconferences', element: <YourConf/>},
  {path: 'schedule', element: <Timestamp/>},
  {path: 'notifications', element: <Notifications/>},
  {path: 'setting', element: <Setting/>},
]
const RoutesApp = () => {
  return (
      <Routes>
          <Route index element={<Homepage />} />
      
          <Route path="home" element={<Homepage />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="/detail/:id/information" element={<InformationPage />} />
          <Route path="/detail/:id/importantdates" element={<ImportantDatePage />} />
          <Route path="/detail/:id/callforpaper" element={<CallforpaperPage />} />

          <Route element={<AuthLayout/>}>
            {
              authPage.map(page=>
                <Route
                  key={page.path}
                  path={page.path}
                  element={page.element}
                />)
            }
          </Route>
          <Route path="*" element={<ErrorPage />} />
        </Routes>
  )
}

export default RoutesApp