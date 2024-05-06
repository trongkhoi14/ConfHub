
import { useLocation, Outlet, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import NavBarDetailPage from '../components/NavBarDetailPage'
import { useEffect } from 'react'
import usePageNavigation from '../hooks/usePageNavigation'

const MainLayout = () => {
    const location = useLocation()
    usePageNavigation()
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