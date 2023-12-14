import React from 'react'
import { useLocation, Outlet } from 'react-router-dom'
import Header from '../components/Header'
import NavBarDetailPage from '../components/NavBarDetailPage'
const MainLayout = () => {
    const location = useLocation()
  return (
    <>
        {
            location.pathname === '/login' || location.pathname === '/signup'
            ?
            null
            :
              <Header/>
            
        }
        {location.pathname.includes("/detail")&&<NavBarDetailPage/>}
        <Outlet/>

    </>
  )
}

export default MainLayout